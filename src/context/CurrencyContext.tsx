import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import api from '../lib/api';

// 汇率数据结构
interface ExchangeRatesData {
  base: string;
  rates: Record<string, number>;
  last_updated: string;
}

// Context 状态接口
interface CurrencyContextState {
  currency: string;
  rates: Record<string, number> | null;
  validCurrencies: string[];
  setCurrency: (currency: string) => void;
  formatPrice: (basePrice: number) => string;
  isLoaded: boolean;
}

const CurrencyContext = createContext<CurrencyContextState | undefined>(undefined);

// 缓存相关的 Key
const CACHE_KEY_RATES = 'kellogg_rates_cache';
const CACHE_KEY_CURRENCY = 'kellogg_currency';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // 默认为 USD 作为系统如果加载不出来或者找不到时的安全降级
  const [currency, setCurrencyState] = useState<string>('USD');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 暴露可以使用的币种，目前根据服务端拿到的汇率 keys 提供
  const validCurrencies = rates ? Object.keys(rates) : ['USD', 'CNY', 'EUR', 'GBP'];

  // 包装一层 setCurrency 并同步到 localStorage
  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CACHE_KEY_CURRENCY, newCurrency);
  };

  // 初始化加载：获取汇率 & 获取用户位置/选择
  useEffect(() => {
    const initializeCurrency = async () => {
      let fetchedRates: Record<string, number> | null = null;
      // 1. 获取汇率数据并设置 24 小时缓存
      try {
        const cachedRatesRaw = localStorage.getItem(CACHE_KEY_RATES);
        let useCache = false;

        if (cachedRatesRaw) {
          const parsed = JSON.parse(cachedRatesRaw);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            fetchedRates = parsed.data.rates;
            useCache = true;
          }
        }

        if (!useCache) {
          const ratesData = await api.getConfig<ExchangeRatesData>('exchangeRates');
          if (ratesData && ratesData.rates) {
            fetchedRates = ratesData.rates;
            localStorage.setItem(
              CACHE_KEY_RATES,
              JSON.stringify({
                data: ratesData,
                timestamp: Date.now(),
              })
            );
          }
        }

      } catch (err) {
        console.error('[CurrencyContext] Failed to load exchange rates', err);
      }

      setRates(fetchedRates);

      // 2. 确定用户货币
      const savedCurrency = localStorage.getItem(CACHE_KEY_CURRENCY);
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      } else {
        // 如果没有保存的货币选项，尝试通过 IP 获取当地货币
        try {
          const ipResponse = await fetch('https://ipapi.co/json/');
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            if (ipData.currency && (!fetchedRates || fetchedRates[ipData.currency])) {
              setCurrency(ipData.currency);
            } else {
              setCurrency('USD'); // 默认兜底
            }
          } else {
            setCurrency('USD');
          }
        } catch (error) {
          console.warn('[CurrencyContext] GeoIP detection failed, falling back to USD', error);
          setCurrency('USD');
        }
      }

      setIsLoaded(true);
    };

    initializeCurrency();
  }, []);

  /**
   * 将基准货币(CNY)转换为目标货币并格式化
   * 需求：不要结尾归九，要精确计算，但增加简写后缀。比如 $ 19.34 USD
   */
  const formatPrice = (basePrice: number): string => {
    // 保护逻辑：如果商品没有填价格，或价格无效，直接返回
    if (basePrice === undefined || basePrice === null) return '';

    // 如果汇率表没拿到，默认当做 CNY 去格式化它 (因为本系统里的 basePrice 都是基于 CNY 存储的)
    if (!rates || !rates[currency]) {
      const fallbackFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'CNY',
        currencyDisplay: 'narrowSymbol', // 显示符号 ¥
      });
      return `${fallbackFormatter.format(basePrice)} CNY`;
    }

    // 这里按照汇率进行精密计算
    const targetRate = rates[currency];
    const convertedPrice = basePrice * targetRate;

    // Intl.NumberFormat 会自动根据不同货币处理小数点（例如 JPY 零位，USD 两位）和当地符号
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol', // 强制用缩写符号(如 $，不写可能会出 US$ )
    });

    const formattedOutput = formatter.format(convertedPrice);

    return `${formattedOutput} ${currency}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, rates, validCurrencies, setCurrency, formatPrice, isLoaded }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

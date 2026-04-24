/**
 * SEO & GEO 核心配置文件
 * 针对“重磅基础款 (Heavyweight Basics)”赛道精细化优化
 */

export const SEO_CONFIG = {
  // 基础企业信息 (GEO)
  company: {
    name: "东莞市凯乐格服饰有限公司 / Kellogg Fashion",
    shortName: "Kellogg Fashion",
    location: "Dongguan, China",
    address: {
      region: "CN-GD",
      placename: "Dongguan",
      locality: "Humen Town",
      position: "22.8229;113.7236", // 虎门坐标
      country: "CN"
    },
    coordinates: {
      latitude: 22.8229,
      longitude: 113.7236
    }
  },

  // 核心关键词矩阵
  keywords: [
    "heavyweight hoodie manufacturer",
    "heavyweight t-shirt supplier",
    "sweatpants manufacturer",
    "custom streetwear manufacturer",
    "blank apparel wholesale",
    "OEM clothing factory China",
    "Humen clothing export"
  ],

  // 针对不同页面的精细化 SEO 内容映射
  // key 对应页面 ID
  pageOverrides: {
    'home': {
      title: {
        en: "Heavyweight Hoodie & T-Shirt Manufacturer | Custom Streetwear Supplier | Kellogg Fashion",
        zh: "重磅卫衣与T恤制造商 | 街头服饰定制供应商 | 凯乐格服饰"
      },
      description: {
        en: "Kellogg Fashion is a professional heavyweight hoodie, t-shirt, and sweatpants manufacturer in China. Specialized in custom streetwear and blank apparel wholesale.",
        zh: "凯乐格服饰是专业的重磅卫衣、T恤、卫裤制造商。专注于街头服饰定制与空白服装批发，为全球品牌提供 OEM 服务。"
      }
    },
    'products': {
      title: {
        en: "Heavyweight Streetwear Wholesale Catalog | Custom Hoodies & T-Shirts",
        zh: "重磅街头服饰批发目录 | 定制卫衣与T恤"
      },
      description: {
        en: "Browse our premium heavyweight streetwear collection. High-quality 400-500 GSM hoodies and oversized t-shirts for private label brands.",
        zh: "浏览我们的高品质重磅街头服饰系列。400-500克重卫衣、廓形T恤，支持贴牌定制。"
      }
    }
    // 可以在此处继续添加关于 Hoodie/T-shirt/Sweatpants 等具体分类页面的优化
  }
};

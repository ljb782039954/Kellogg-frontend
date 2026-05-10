import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '../context/LanguageContext';

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  product_type: string;
  quantity: string;
  message: string;
}

export function useInquiry() {
  const { language } = useLanguage();
  const [inquiryConfig, setInquiryConfig] = useState<any>(null);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    company: '',
    product_type: '',
    quantity: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Automatically fetch config, fallback to default if fails
    api.getConfig('inquiry_config').then(data => {
      if (data) setInquiryConfig(data);
    }).catch(() => {});
  }, []);

  const config = inquiryConfig || {
    title: { zh: '联系我们要样品', en: 'Contact Us For Samples' },
    description: { 
      zh: '如果您有任何关于产品的咨询，请填写下方表格，我们的团队会尽快与您联系。', 
      en: 'If you have any inquiries about our products, please fill out the form below and our team will get back to you as soon as possible.' 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitInquiry(formData);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        company: '',
        product_type: '',
        quantity: '',
        message: ''
      });
    } catch (err) {
      alert(language === 'zh' ? '提交失败，请重试' : 'Submission failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    form: {
      name: language === 'zh' ? '姓名' : 'First Name',
      email: language === 'zh' ? '邮箱' : 'Email',
      phone: language === 'zh' ? '电话' : 'Phone Number',
      country: language === 'zh' ? '国家/地区' : 'Country/Region',
      company: language === 'zh' ? '公司名称' : 'Company Name',
      productType: language === 'zh' ? '产品类型' : 'Product Type',
      quantity: language === 'zh' ? '需求数量' : 'Order Quantity',
      message: language === 'zh' ? '消息详情' : 'Message details',
      submit: language === 'zh' ? '提交询盘' : 'Submit Inquiry',
      success: language === 'zh' ? '提交成功！' : 'Success!',
      successMsg: language === 'zh' ? '感谢您的咨询，我们会尽快与您联系。' : 'Thank you for your inquiry, we will contact you soon.',
      back: language === 'zh' ? '返回' : 'Go Back'
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    isSuccess,
    setIsSuccess,
    handleSubmit,
    config,
    t,
    language
  };
}

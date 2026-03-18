import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import siteSettings from '../config/siteSettings.json';

interface FooterProps {
  theme?: 'light' | 'dark' | 'vintage' | 'street' | 'luxury';
}

export default function Footer({ theme = 'light' }: FooterProps) {
  const { language } = useLanguage();
  const { content } = useContent();
  const { footer } = content;

  const themeStyles = {
    light: {
      bg: 'bg-gray-900',
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-800',
      link: 'text-gray-400 hover:text-white',
      input: 'bg-gray-800 border-gray-700 text-white',
      button: 'bg-white text-gray-900 hover:bg-gray-100',
    },
    dark: {
      bg: 'bg-black',
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-800',
      link: 'text-gray-400 hover:text-white',
      input: 'bg-gray-800 border-gray-700 text-white',
      button: 'bg-white text-gray-900 hover:bg-gray-100',
    },
    vintage: {
      bg: 'bg-amber-950',
      text: 'text-amber-50',
      textMuted: 'text-amber-400',
      border: 'border-amber-900',
      link: 'text-amber-400 hover:text-amber-50',
      input: 'bg-amber-900 border-amber-800 text-amber-50',
      button: 'bg-amber-700 text-amber-50 hover:bg-amber-600',
    },
    street: {
      bg: 'bg-black',
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-purple-500/30',
      link: 'text-gray-400 hover:text-purple-400',
      input: 'bg-gray-900 border-purple-500/30 text-white',
      button: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    },
    luxury: {
      bg: 'bg-black',
      text: 'text-amber-100',
      textMuted: 'text-amber-400',
      border: 'border-amber-500/30',
      link: 'text-amber-400 hover:text-amber-100',
      input: 'bg-gray-900 border-amber-500/30 text-amber-100',
      button: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
    },
  };

  const style = themeStyles[theme];

  return (
    <footer id="footer" className={`${style.bg} pt-16 pb-8`}>
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className={`text-2xl font-bold mb-4 ${style.text}`}>
              {siteSettings.brand.name[language as keyof typeof siteSettings.brand.name]}
            </h3>
            <p className={`mb-6 ${style.textMuted}`}>
              {siteSettings.brand.description[language as keyof typeof siteSettings.brand.description]}
            </p>
            
            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={footer.newsletterPlaceholder[language]}
                className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${style.input}`}
              />
              <button className={`px-4 py-2 rounded-lg font-medium transition-all ${style.button}`}>
                {footer.newsletterButton[language]}
              </button>
            </div>
          </motion.div>

          {/* Link Groups */}
          {footer.linkGroups.map((group, index) => (
            <motion.div
              key={group.title.zh}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <h4 className={`text-lg font-semibold mb-4 ${style.text}`}>{group.title[language]}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name.zh}>
                    {link.href === '#' ? (
                      <span className={`cursor-default ${style.link} opacity-50`}>
                        {link.name[language]}
                      </span>
                    ) : link.href.startsWith('/') ? (
                      <Link to={link.href} className={`transition-colors ${style.link}`}>
                        {link.name[language]}
                      </Link>
                    ) : (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={`transition-colors ${style.link}`}>
                        {link.name[language]}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className={`text-lg font-semibold mb-4 ${style.text}`}>
              {language === 'zh' ? '联系我们' : 'Contact Us'}
            </h4>
            <ul className="space-y-3">
              <li className={`flex items-center gap-3 ${style.textMuted}`}>
                <Phone className="w-5 h-5" />
                <span>{siteSettings.contact.phone}</span>
              </li>
              <li className={`flex items-center gap-3 ${style.textMuted}`}>
                <Mail className="w-5 h-5" />
                <span>{siteSettings.contact.email}</span>
              </li>
              <li className={`flex items-start gap-3 ${style.textMuted}`}>
                <MapPin className="w-5 h-5 mt-0.5" />
                <span>{siteSettings.contact.address[language as keyof typeof siteSettings.contact.address]}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={`w-10 h-10 rounded-full border ${style.border} flex items-center justify-center transition-all hover:scale-110 ${style.link}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className={`border-t ${style.border} pt-8`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${style.textMuted}`}>
              © 2024 {siteSettings.brand.name[language as keyof typeof siteSettings.brand.name]}. {language === 'zh' ? '保留所有权利。' : 'All rights reserved.'}
            </p>
            <div className={`flex gap-6 text-sm ${style.textMuted}`}>
              <button onClick={(e) => e.preventDefault()} className="hover:underline cursor-default">
                {language === 'zh' ? '隐私政策' : 'Privacy Policy'}
              </button>
              <button onClick={(e) => e.preventDefault()} className="hover:underline cursor-default">
                {language === 'zh' ? '服务条款' : 'Terms of Service'}
              </button>
              <button onClick={(e) => e.preventDefault()} className="hover:underline cursor-default">
                {language === 'zh' ? 'Cookie设置' : 'Cookie Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  about: {
    title: '关于我们',
    links: [
      { name: '项目介绍', path: '/about' },
      { name: '团队简介', path: '/authors' },
      { name: '联系方式', path: '/about' },
      { name: '加入我们', path: '/about' },
    ],
  },
  resources: {
    title: '资源分类',
    links: [
      { name: '农业古籍', path: '/database' },
      { name: '农书注解', path: '/database' },
      { name: '历史地图', path: '/gis' },
      { name: '研究论文', path: '/database' },
    ],
  },
  services: {
    title: '服务支持',
    links: [
      { name: '使用帮助', path: '/about' },
      { name: 'API文档', path: '/about' },
      { name: '数据下载', path: '/database' },
      { name: '引用指南', path: '/about' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-mq-paper border-t border-mq-border">
      {/* Main Footer */}
      <div className="mq-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-mq-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">明</span>
              </div>
              <span className="text-2xl font-bold text-mq-red">
                明清农业数据库
              </span>
            </Link>
            <p className="text-mq-gray leading-relaxed mb-6 max-w-sm">
              致力于数字化保护与传承明清时期农业文化遗产，
              为学术研究和文化传播提供开放、自由的资源平台。
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-mq-gray">
                <Mail className="w-5 h-5 text-mq-red" />
                <span>contact@mingqing.org</span>
              </div>
              <div className="flex items-center gap-3 text-mq-gray">
                <MapPin className="w-5 h-5 text-mq-red" />
                <span>中国·北京</span>
              </div>
              <div className="flex items-center gap-3 text-mq-gray">
                <Phone className="w-5 h-5 text-mq-red" />
                <span>+86 10 1234 5678</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-lg font-bold text-mq-ink mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-mq-gray hover:text-mq-red hover:translate-x-1
                               transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-mq-border">
        <div className="mq-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-mq-gray text-sm">
              © 2024 明清农业数据库 版权所有
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/about" className="text-mq-gray hover:text-mq-red transition-colors">
                隐私政策
              </Link>
              <Link to="/about" className="text-mq-gray hover:text-mq-red transition-colors">
                使用条款
              </Link>
              <Link to="/about" className="text-mq-gray hover:text-mq-red transition-colors">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: '首页', path: '/' },
  { name: '项目介绍', path: '/about' },
  { name: '作者简介', path: '/authors' },
  { name: '数据库', path: '/database' },
  { name: 'GIS地图', path: '/gis' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-mq-paper/95 backdrop-blur-md shadow-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mq-container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              style={{ perspective: '1000px' }}
            >
              <div className="w-10 h-10 bg-mq-red rounded-full flex items-center justify-center
                            transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-lg">明</span>
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-mq-red' : 'text-white'
              }`}>
                明清农业数据库
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-mq-red hover:text-mq-red-dark' : 'text-white/90 hover:text-white'
                  } ${location.pathname === link.path ? 'font-semibold' : ''}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-current
                                  transition-all duration-300 ${
                                    location.pathname === link.path ? 'w-full' : 'w-0'
                                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? 'text-mq-red hover:bg-mq-red/10'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? 'text-mq-red hover:bg-mq-red/10'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-mq-paper transition-transform duration-500 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-24 px-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 text-xl text-mq-ink border-b border-mq-border
                       transition-colors duration-300 hover:text-mq-red"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-mq-paper/98 backdrop-blur-lg flex items-start justify-center pt-32"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl px-6 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="搜索古籍、农书、资料..."
                className="w-full px-6 py-4 text-xl bg-white rounded-full border-2 border-mq-gold
                         focus:outline-none focus:border-mq-red transition-colors duration-300"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-mq-gray hover:text-mq-red"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-4 text-center text-mq-gray text-sm">
              按 ESC 键关闭搜索
            </p>
          </div>
        </div>
      )}
    </>
  );
}

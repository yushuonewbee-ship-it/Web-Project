import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const progress = Math.min(scrollY / heroHeight, 1);
      
      // Parallax effect on background
      const bg = heroRef.current.querySelector('.hero-bg') as HTMLElement;
      const content = heroRef.current.querySelector('.hero-content') as HTMLElement;
      
      if (bg) {
        bg.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + progress * 0.1})`;
      }
      if (content) {
        content.style.opacity = `${1 - progress * 1.5}`;
        content.style.transform = `translateY(${-scrollY * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Background Image */}
      <div
        className="hero-bg absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Ink particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-black/5"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="hero-content relative z-10 h-full flex flex-col items-center justify-center px-4"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Title with character animation */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wider">
            {'明清农业数据库'.split('').map((char, index) => (
              <span
                key={index}
                className={`inline-block transition-all duration-700 ${
                  isLoaded
                    ? 'opacity-100 translate-y-0 rotate-0'
                    : 'opacity-0 translate-y-8 rotate-3'
                }`}
                style={{
                  transitionDelay: `${index * 80}ms`,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {char}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xl md:text-2xl text-white/90 mb-12 font-light tracking-wide
                       transition-all duration-700 delay-500 ${
                         isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                       }`}
          >
            探索古代农业生产，透视中华农耕变迁
          </p>

          {/* Search Box */}
          <div
            className={`relative max-w-xl mx-auto transition-all duration-700 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
            }`}
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="搜索省份或府州县名"
                className="w-full px-8 py-5 pr-32 rounded-full bg-white/95 text-mq-ink
                         placeholder:text-mq-gray/60
                         shadow-lg shadow-black/20
                         transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-mq-gold focus:bg-white
                         group-hover:shadow-xl group-hover:shadow-black/30"
              />
              <Link
                to="/database"
                className="absolute right-2 top-1/2 -translate-y-1/2
                         bg-mq-red text-white px-6 py-3 rounded-full
                         flex items-center gap-2
                         transition-all duration-300
                         hover:bg-mq-red-dark hover:scale-105"
              >
                <Search className="w-4 h-4" />
                <span>搜索</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`flex justify-center gap-12 mt-16 transition-all duration-700 delay-900 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { value: '3', label: 'Databases' },
              { value: '6', label: 'Members' },
              { value: '2+', label: 'Fields' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-mq-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2
                   transition-all duration-700 delay-1000 ${
                     isLoaded ? 'opacity-100' : 'opacity-0'
                   }`}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

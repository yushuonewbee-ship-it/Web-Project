import { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';

const resources = [
  {
    id: 1,
    title: '石涛书道德经册',
    category: '艺术/书法',
    image: '/resource-1.jpg',
    views: 2341,
  },
  {
    id: 2,
    title: '御选唐宋诗醇',
    category: '文学/诗歌',
    image: '/resource-2.jpg',
    views: 1856,
  },
  {
    id: 3,
    title: '耕织图卷',
    category: '艺术/绘画',
    image: '/resource-3.jpg',
    views: 3122,
  },
  {
    id: 4,
    title: '齐民要术',
    category: '农业/科技',
    image: '/resource-4.jpg',
    views: 4521,
  },
  {
    id: 5,
    title: '农政全书',
    category: '农业/政书',
    image: '/resource-5.jpg',
    views: 3890,
  },
  {
    id: 6,
    title: '稻品图鉴',
    category: '农业/博物',
    image: '/resource-6.jpg',
    views: 2156,
  },
];

export default function Resources() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.resource-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-mq-paper">
      <div className="mq-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mq-section-title">明清文化览略</h2>
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const isVisible = visibleCards.includes(index);

            return (
              <div
                key={resource.id}
                data-index={index}
                className={`resource-card group relative bg-white rounded-xl overflow-hidden
                           shadow-mq transition-all duration-700
                           hover:shadow-mq-hover hover:-translate-y-2 cursor-pointer
                           ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transform: isVisible
                    ? 'translateY(0) rotateX(0deg)'
                    : 'translateY(60px) rotateX(10deg)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover
                             transition-transform duration-700
                             group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-mq-red/80 via-transparent to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* View button */}
                  <div className="absolute inset-0 flex items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center
                                  transform scale-50 group-hover:scale-100 transition-transform duration-500">
                      <Eye className="w-6 h-6 text-mq-red" />
                    </div>
                  </div>

                  {/* Category tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-mq-red/90 text-white text-xs rounded-full
                                   shadow-lg">
                      {resource.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-mq-ink mb-2
                               transition-colors duration-300 group-hover:text-mq-red">
                    {resource.title}
                  </h3>
                  <div className="flex items-center text-sm text-mq-gray">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{resource.views.toLocaleString()} 次浏览</span>
                  </div>
                </div>

                {/* Decorative seal */}
                <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-mq-gold/40
                              rounded-full flex items-center justify-center
                              opacity-0 group-hover:opacity-100 transition-all duration-500
                              transform rotate-12">
                  <span className="text-mq-gold text-xs font-bold">古</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

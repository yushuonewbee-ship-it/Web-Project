import { useEffect, useRef, useState } from 'react';
import { BookOpen, Eye, Lock } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: '精心整合',
    description:
      '我们专注于从明清时期经典典籍和学者研究中收集整理系统结构化的明清农业经济生产数据，包括《中国人口史》、《清代的发展与不发展》、《大明会典》等著作，确保每一份文献都具有重要的历史和研究价值。',
    offset: 0,
  },
  {
    icon: Eye,
    title: '全力呈现',
    description:
      '采用Web数字化技术，完整系统呈现明清农业生产状态与技术进步率，提供原文阅读、数据查询、可视化分析等多种功能，让我们的研究成果立体可感。',
    offset: 40,
  },
  {
    icon: Lock,
    title: '自由获取',
    description:
      '所有资源完全免费开放，支持在线阅读、下载PDF、引用分享。让知识无门槛传播，助力学术研究与文化传承。',
    offset: 80,
  },
];

export default function Features() {
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
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-mq-paper overflow-hidden"
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 mq-paper-texture pointer-events-none" />

      <div className="mq-container relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="mq-section-title">完全开放</h2>
          <p className="mq-section-subtitle max-w-2xl mx-auto">
            我们的网站是一个完全自由开放的项目查询、数据获取、成果共享的数字档案馆，致力于为量化经济史领域同僚和所有感兴趣的学者分享我们的研究成果
          </p>
        </div>

        {/* Feature Cards */}
        <div
          className="grid md:grid-cols-3 gap-8"
          style={{ perspective: '1000px' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleCards.includes(index);

            return (
              <div
                key={index}
                data-index={index}
                className={`feature-card group relative bg-white rounded-xl p-8
                           shadow-mq transition-all duration-700
                           hover:shadow-mq-hover hover:-translate-y-2
                           ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transform: isVisible
                    ? `translateY(0) rotateY(0deg)`
                    : `translateY(40px) rotateY(-30deg)`,
                  transitionDelay: `${index * 150}ms`,
                  marginTop: `${feature.offset}px`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 bg-mq-red/10 rounded-xl flex items-center justify-center mb-6
                            transition-all duration-300 group-hover:bg-mq-red group-hover:scale-110"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <Icon className="w-8 h-8 text-mq-red transition-colors duration-300 group-hover:text-white" />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold text-mq-ink mb-4
                           transition-colors duration-300 group-hover:text-mq-red"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-mq-gray leading-relaxed"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-mq-gold/30
                              rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-mq-gold/30
                              rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

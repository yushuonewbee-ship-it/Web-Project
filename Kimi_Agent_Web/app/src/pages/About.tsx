import { useEffect, useRef, useState } from 'react';
import { BookOpen, Target, Users, Globe, Database, Shield } from 'lucide-react';

const milestones = [
  { year: '2025.3.30', title: '提交申请', desc: '撰写立项申请书并提交书院' },
  { year: '2025.4.21', title: '项目启动', desc: '明清农业数据库项目正式立项' },
  { year: '2025.5—11', title: '中期调研', desc: '开始收集整理数据并着手估算建构' },
  { year: '2025.12—2026.2', title: '平台搭建', desc: '完成数据库架构设计与前端开发' },
  { year: '2026.2—3.15', title: '学术产出', desc: '基于数据库进行学术论文撰写与后续分析' },
];

const values = [
  {
    icon: BookOpen,
    title: '开放共享',
    desc: '所有资源完全免费开放，促进知识传播',
  },
  {
    icon: Target,
    title: '成果激活',
    desc: '灵活利用已有学术成果，深入挖掘典籍中的知识成果',
  },
  {
    icon: Users,
    title: '服务学术',
    desc: '为研究者提供便捷的数据检索服务和相关领域讯息',
  },
  {
    icon: Globe,
    title: '传承文化',
    desc: '保护农业文化遗产，弘扬传统智慧',
  },
  {
    icon: Database,
    title: '数字保护',
    desc: '采用先进技术进行数字化保存',
  },
  {
    icon: Shield,
    title: '权威可靠',
    desc: '基于知名学者发表数据开展稳健保守的估算',
  },
];

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-mq-paper pt-24">
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-gradient-to-b from-mq-red/5 to-transparent"
        style={{
          backgroundImage: 'url(/农耕图.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-mq-red/10"></div>
        <div className="mq-container relative z-10">
          <div
            className={`max-w-3xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              backgroundColor: 'rgba(251, 248, 243, 0.75)',
              padding: '2rem',
              borderRadius: '1rem',
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-mq-red mb-6 text-center"
               style={{ textShadow: '2px 2px 4px rgba(140, 31, 31, 0.2)' }}>
              项目介绍
            </h1>
            <p className="text-xl text-mq-ink leading-relaxed text-left font-serif"
               style={{ 
                 textShadow: 'none',
               }}>
              明清农业数据库是五位来自中国人民大学经济学院和数学学院的本科生在农业农村发展学院翟润卓老师指导下建构的经济史量化项目。数据库跨度明初1400年至晚清1850年，涵盖人口、农业、经济等多个维度的数据，旨在为学界提供全面、详实、严谨的明清农业经济生产状态数据。数据分为两个省一级的面板数据（1400年、1580年；1661年、1685年、1724年、1766年、1812年、1850年）和府州县一级的截面数据（1700年）。我们的研究进一步开创性地估算了各个时期不同地区的农业全要素生产率（TFP）以及技术进步率，首次量化了早近中国农业技术生产率的历史变迁与时空演变，在提倡发展农业新质生产力的当代中国具有独特的时代价值，这些也是我们团队的最大贡献所在。希望我们的项目能对您的研究有所启发，也期待您的宝贵建议！
            </p>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section ref={sectionRef} className="py-16">
        <div className="mq-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <h2 className="text-3xl font-bold text-mq-ink mb-6">项目背景</h2>
              <div className="space-y-4 text-mq-gray leading-relaxed">
                <p>
                  本研究属于中国人民大学"求是学术"品牌项目下设的"首善"子项目，被推荐为北京市级大学生创新创业训练计划等省部级项目。
                </p>
                <p>
                  本研究团队在一年的项目周期内积极开展学术交流、项目调研，培育创新精神、培植创新成果，在实践中发扬"求是"精神。
                </p>
              </div>
            </div>
            <div
              className={`transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-mq-lg p-8">
                <h3 className="text-xl font-bold text-mq-ink mb-6">项目数据</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '2', label: '明代年份' },
                    { value: '6', label: '清代年份' },
                    { value: '1', label: '清代截面' },
                    { value: '4+', label: '数据维度' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-mq-paper rounded-xl">
                      <div className="text-3xl font-bold text-mq-red mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-mq-gray">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section 
        className="py-16 relative"
        style={{
          backgroundImage: 'url(/09_AI生成_灌溉农耕图.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="mq-container relative z-10">
          <h2 className="text-3xl font-bold text-mq-ink text-center mb-12">
            发展历程
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-mq-gold/30 -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-8 md:space-y-0">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative md:flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}
                  >
                    <div
                      className={`bg-mq-paper rounded-xl p-6 shadow-mq inline-block
                                hover:shadow-mq-lg hover:-translate-y-2
                                ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                      style={{ 
                        transitionDelay: `${600 + index * 100}ms`,
                        transition: 'all 150ms ease-out'
                      }}
                    >
                      <span className="text-mq-red font-bold text-lg">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-mq-ink mt-2 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-mq-gray">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-mq-red rounded-full border-4 border-white shadow-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="mq-container">
          <h2 className="text-3xl font-bold text-mq-ink text-center mb-12">
            核心价值观
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl p-6 shadow-mq
                            hover:shadow-mq-lg hover:-translate-y-3 cursor-pointer
                            ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                  style={{ 
                    transitionDelay: `${1000 + index * 100}ms`,
                    transition: 'all 150ms ease-out'
                  }}
                >
                  <div className="w-12 h-12 bg-mq-red/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-mq-red" />
                  </div>
                  <h3 className="text-lg font-bold text-mq-ink mb-2">
                    {value.title}
                  </h3>
                  <p className="text-mq-gray text-sm">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-mq-red">
        <div className="mq-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            加入我们，共同传承
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            如果您对项目感兴趣，或有珍贵的农业古籍愿意分享，欢迎与我们联系
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-mq-red px-8 py-3 rounded-full font-medium
                           transition-all duration-300 hover:bg-mq-gold hover:text-white">
              联系我们
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-medium
                           transition-all duration-300 hover:bg-white hover:text-mq-red">
              了解更多
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

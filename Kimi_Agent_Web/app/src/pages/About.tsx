import { useEffect, useRef, useState } from 'react';
import { BookOpen, Target, Users, Globe, Database, Shield } from 'lucide-react';

const milestones = [
  { year: '2023', title: '项目启动', desc: '明清农业数据库项目正式立项' },
  { year: '2023', title: '资料收集', desc: '开始收集整理明清农业古籍资料' },
  { year: '2024', title: '平台搭建', desc: '完成数据库架构设计与前端开发' },
  { year: '2024', title: '正式上线', desc: '数据库正式对外开放使用' },
];

const values = [
  {
    icon: BookOpen,
    title: '开放共享',
    desc: '所有资源完全免费开放，促进知识传播',
  },
  {
    icon: Target,
    title: '精准收录',
    desc: '严格筛选，确保每一份文献的价值',
  },
  {
    icon: Users,
    title: '服务学术',
    desc: '为研究者提供便捷的文献检索服务',
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
    desc: '与知名图书馆、档案馆合作',
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
      <section className="relative py-20 bg-gradient-to-b from-mq-red/5 to-transparent">
        <div className="mq-container">
          <div
            className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-mq-ink mb-6">
              项目介绍
            </h1>
            <p className="text-xl text-mq-gray leading-relaxed">
              明清农业数据库是一个专注于明清时期农业文献的数字化平台，
              致力于保护、整理和传播中华农业文化遗产。
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
                  明清两代是中国古代农业发展的鼎盛时期，留下了大量珍贵的农业文献。
                  这些古籍不仅记录了当时的农业生产技术，更蕴含着深厚的农耕智慧和文化内涵。
                </p>
                <p>
                  然而，由于年代久远，许多珍贵的农业古籍面临损毁、流失的风险。
                  为了保护和传承这些宝贵的文化遗产，我们启动了明清农业数据库项目。
                </p>
                <p>
                  本项目采用先进的数字化技术，对明清时期的农业古籍进行高精度扫描、
                  OCR识别和结构化处理，建立起一个全面、系统的数字资源库。
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
                    { value: '703', label: '收录资源' },
                    { value: '128', label: '农业古籍' },
                    { value: '56', label: '历史地图' },
                    { value: '12', label: '合作机构' },
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
      <section className="py-16 bg-white">
        <div className="mq-container">
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
                                transition-all duration-700 ${
                                  isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                      style={{ transitionDelay: `${600 + index * 100}ms` }}
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
                            transition-all duration-700 hover:shadow-mq-lg hover:-translate-y-1
                            ${
                              isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                  style={{ transitionDelay: `${1000 + index * 100}ms` }}
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

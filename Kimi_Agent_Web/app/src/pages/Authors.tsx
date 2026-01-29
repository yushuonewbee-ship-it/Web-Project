import { useEffect, useState } from 'react';
import { Mail, BookOpen, Award, GraduationCap } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: '[姓名]',
    title: '项目负责人',
    avatar: null,
    bio: '[个人简介：学术背景、研究方向、主要成就等]',
    research: '[研究领域：明清农业史、古籍数字化等]',
    publications: [
      '[代表著作1]',
      '[代表著作2]',
      '[代表著作3]',
    ],
    email: '[邮箱地址]',
  },
  {
    id: 2,
    name: '[姓名]',
    title: '学术顾问',
    avatar: null,
    bio: '[个人简介：学术背景、研究方向、主要成就等]',
    research: '[研究领域：农业史、经济史等]',
    publications: [
      '[代表著作1]',
      '[代表著作2]',
    ],
    email: '[邮箱地址]',
  },
  {
    id: 3,
    name: '[姓名]',
    title: '技术负责人',
    avatar: null,
    bio: '[个人简介：技术背景、项目经验等]',
    research: '[专长领域：数据库架构、GIS系统等]',
    publications: [
      '[技术论文1]',
      '[技术论文2]',
    ],
    email: '[邮箱地址]',
  },
  {
    id: 4,
    name: '[姓名]',
    title: '数据整理专员',
    avatar: null,
    bio: '[个人简介：专业背景、工作经验等]',
    research: '[专长领域：古籍整理、文献学等]',
    publications: [
      '[整理成果1]',
      '[整理成果2]',
    ],
    email: '[邮箱地址]',
  },
];

const collaborators = [
  { name: '[合作机构1]', role: '数据支持' },
  { name: '[合作机构2]', role: '技术支持' },
  { name: '[合作机构3]', role: '学术指导' },
];

export default function Authors() {
  const [isVisible, setIsVisible] = useState(false);

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
              作者简介
            </h1>
            <p className="text-xl text-mq-gray leading-relaxed">
              我们是一支热爱传统文化、致力于数字化保护的团队，
              由历史学、文献学、计算机科学等多领域专家组成。
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16">
        <div className="mq-container">
          <h2 className="text-3xl font-bold text-mq-ink text-center mb-12">
            核心团队
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`bg-white rounded-2xl shadow-mq overflow-hidden
                          transition-all duration-700 hover:shadow-mq-lg
                          ${
                            isVisible
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-8'
                          }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-mq-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl font-bold text-mq-red">
                        {member.name.charAt(0) === '[' ? '待' : member.name.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-mq-ink">
                          {member.name}
                        </h3>
                        <span className="px-3 py-1 bg-mq-gold/20 text-mq-gold text-sm rounded-full">
                          {member.title}
                        </span>
                      </div>
                      
                      <p className="text-mq-gray text-sm mb-4 leading-relaxed">
                        {member.bio}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-mq-gray mb-4">
                        <GraduationCap className="w-4 h-4 text-mq-red" />
                        <span>{member.research}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-mq-red" />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-mq-red hover:underline"
                        >
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Publications */}
                  <div className="mt-6 pt-6 border-t border-mq-border">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-mq-gold" />
                      <span className="text-sm font-medium text-mq-ink">
                        代表著作
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {member.publications.map((pub, pubIndex) => (
                        <li
                          key={pubIndex}
                          className="text-sm text-mq-gray flex items-center gap-2"
                        >
                          <Award className="w-3 h-3 text-mq-gold" />
                          {pub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators */}
      <section className="py-16 bg-white">
        <div className="mq-container">
          <h2 className="text-3xl font-bold text-mq-ink text-center mb-12">
            合作机构
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {collaborators.map((collab, index) => (
              <div
                key={index}
                className={`bg-mq-paper rounded-xl px-8 py-6 shadow-mq
                          transition-all duration-700 hover:shadow-mq-lg
                          ${
                            isVisible
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-8'
                          }`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="text-lg font-bold text-mq-ink mb-1">
                  {collab.name}
                </div>
                <div className="text-sm text-mq-gold">{collab.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-16">
        <div className="mq-container">
          <div className="bg-gradient-to-r from-mq-red to-mq-red-dark rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              期待您的加入
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              如果您对明清农业史研究、古籍数字化或Web开发感兴趣，
              欢迎加入我们的团队，共同为文化传承贡献力量。
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-mq-red px-8 py-3 rounded-full font-medium
                             transition-all duration-300 hover:bg-mq-gold hover:text-white">
                申请加入
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-medium
                             transition-all duration-300 hover:bg-white hover:text-mq-red">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

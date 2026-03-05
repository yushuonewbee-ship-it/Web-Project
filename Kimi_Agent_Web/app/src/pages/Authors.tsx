import { useEffect, useState } from 'react';
import { Mail, BookOpen, Award, GraduationCap } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: '翟润卓',
    title: '指导教师',
    avatar: '/avatar-1.jpg',
    bio: '翟润卓，牛津大学基布尔学院经济史博士。现任中国人民大学农业与农村发展学院讲师（助理教授），受聘中国人民大学“杰出学者计划”青年学者B岗。师从英国科学院院士、国际著名经济史学家 Stephen Broadberry 教授。目前研究兴趣包括：中国农业经济史，经济增长史，历史国民经济核算和生活水平研究，东西方经济大分流，历史国家能力和中国财政史，计量史学等。',
    research: '长期经济增长，农业经济史，计量史学',
    publications: [
      'Zhai, Runzhuo, and Zhaohui Lou. "Chinese Agricultural Output and TFP: 1661–2019." Economics Letters 213 (2022): 110415.',
      '唐昱茵、高岭、翟润卓. "风起于青萍之末：大英帝国的黄昏 (1888–1913) 的新解释." 经济思想史学刊（接收）.',
      '高岭、翟润卓、唐昱茵. "马克思的劳动强度理论及其当代发展." 经济学家 1, no.7 (2022): 15-23.',
    ],
    email: 'runzhuo.zhai@ruc.edu.cn',
  },
  {
    id: 2,
    name: '卢俣烁',
    title: '项目负责人',
    avatar: '/avatar-2.jpg',
    bio: '中国人民大学经济学院23级本科生，经济学与社会学双学士学位在读，ESH（经济社会历史）实验班。',
    research: '计量经济史、国际政治经济学、博弈论、数字经济学',
    publications: [],
    email: '2023200655@ruc.edu.cn',
  },
  {
    id: 3,
    name: '白瑞睿',
    title: '团队成员',
    avatar: null,
    bio: '[个人简介：技术背景、项目经验等]',
    research: '[专长领域：数据库架构、GIS系统等]',
    publications: [],
    email: '[邮箱地址]',
  },
  {
    id: 4,
    name: '钱泽瑄',
    title: '团队成员',
    avatar: null,
    bio: '[个人简介：专业背景、工作经验等]',
    research: '[专长领域：古籍整理、文献学等]',
    publications: [],
    email: '[邮箱地址]',
  },
  {
    id: 5,
    name: '张稚坤',
    title: '团队成员',
    avatar: null,
    bio: '[个人简介]',
    research: '[研究/专长领域]',
    publications: [],
    email: '[邮箱地址]',
  },
  {
    id: 6,
    name: '魏赵珂',
    title: '团队成员',
    avatar: null,
    bio: '[个人简介]',
    research: '[研究/专长领域]',
    publications: [],
    email: '[邮箱地址]',
  },
];

const collaborators = [
  { name: '中国人民大学经济学院', role: '' },
  { name: '中国人民大学农业与农村发展学院', role: '' },
  { name: '中国人民大学数学学院', role: '' },
];

export default function Authors() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-mq-paper pt-24">
      {/* Hero Section */}
      <section 
        className="relative py-20"
        style={{
          backgroundImage: 'url(/resource-3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="mq-container relative z-10">
          <div
            className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-mq-ink mb-6">
              作者简介
            </h1>
            <p className="text-xl text-mq-gray leading-relaxed">
              我们是一支热爱传统文化、对经济发展充满好奇并致力于数字化数量化重建的团队，由经济学、历史学、社会学、数学科学等多领域学者组成。
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

          {/* 第一行：仅第一张卡片，尺寸较小 */}
          <div
            className={`max-w-2xl mx-auto mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {(() => {
              const member = teamMembers[0];
              return (
                <div className="bg-white rounded-2xl shadow-mq overflow-hidden hover:shadow-mq-lg">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-mq-red/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-mq-red">
                            {member.name.charAt(0) === '[' ? '待' : member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-mq-ink">{member.name}</h3>
                          <span className="px-2 py-0.5 bg-mq-gold/20 text-mq-gold text-xs rounded-full">{member.title}</span>
                        </div>
                        <p className="text-mq-gray text-sm mb-3 leading-relaxed line-clamp-4">{member.bio}</p>
                        <div className="flex items-center gap-2 text-xs text-mq-gray mb-2">
                          <GraduationCap className="w-3 h-3 text-mq-red flex-shrink-0" />
                          <span>{member.research}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3 h-3 text-mq-red flex-shrink-0" />
                          <a href={`mailto:${member.email}`} className="text-mq-red hover:underline truncate">{member.email}</a>
                        </div>
                      </div>
                    </div>
                    {member.publications.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-mq-border">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-3 h-3 text-mq-gold" />
                          <span className="text-xs font-medium text-mq-ink">代表著作</span>
                        </div>
                        <ul className="space-y-1">
                          {member.publications.map((pub, i) => (
                            <li key={i} className="text-xs text-mq-gray flex items-center gap-2">
                              <Award className="w-3 h-3 text-mq-gold flex-shrink-0" />
                              <span className="line-clamp-2">{pub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 第二行：仅第二张卡片，与第一张同尺寸 */}
          <div
            className={`max-w-2xl mx-auto mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '350ms' }}
          >
            {(() => {
              const member = teamMembers[1];
              return (
                <div className="bg-white rounded-2xl shadow-mq overflow-hidden hover:shadow-mq-lg">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-mq-red/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-mq-red">
                            {member.name.charAt(0) === '[' ? '待' : member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-mq-ink">{member.name}</h3>
                          <span className="px-2 py-0.5 bg-mq-gold/20 text-mq-gold text-xs rounded-full">{member.title}</span>
                        </div>
                        <p className="text-mq-gray text-sm mb-3 leading-relaxed">{member.bio}</p>
                        <div className="flex items-center gap-2 text-xs text-mq-gray mb-2">
                          <GraduationCap className="w-3 h-3 text-mq-red flex-shrink-0" />
                          <span>{member.research}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3 h-3 text-mq-red flex-shrink-0" />
                          <a href={`mailto:${member.email}`} className="text-mq-red hover:underline truncate">{member.email}</a>
                        </div>
                      </div>
                    </div>
                    {member.publications.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-mq-border">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-3 h-3 text-mq-gold" />
                          <span className="text-xs font-medium text-mq-ink">代表著作</span>
                        </div>
                        <ul className="space-y-1">
                          {member.publications.map((pub, i) => (
                            <li key={i} className="text-xs text-mq-gray flex items-center gap-2">
                              <Award className="w-3 h-3 text-mq-gold flex-shrink-0" />
                              <span className="line-clamp-2">{pub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 第三行：四张卡片，较窄、无代表著作 */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.slice(2, 6).map((member, index) => (
              <div
                key={member.id}
                className={`bg-white rounded-2xl shadow-mq overflow-hidden hover:shadow-mq-lg transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="p-5">
                  <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-3">
                    <div className="w-16 h-16 bg-mq-red/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-mq-red">
                          {member.name.charAt(0) === '[' ? '待' : member.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold text-mq-ink">{member.name}</h3>
                        <span className="px-2 py-0.5 bg-mq-gold/20 text-mq-gold text-xs rounded-full w-fit">{member.title}</span>
                      </div>
                      <p className="text-mq-gray text-xs mb-2 leading-relaxed line-clamp-3">{member.bio}</p>
                      <div className="flex items-center gap-2 text-xs text-mq-gray mb-2 justify-center sm:justify-start">
                        <GraduationCap className="w-3 h-3 text-mq-red flex-shrink-0" />
                        <span className="line-clamp-2">{member.research}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs justify-center sm:justify-start">
                        <Mail className="w-3 h-3 text-mq-red flex-shrink-0" />
                        <a href={`mailto:${member.email}`} className="text-mq-red hover:underline truncate">{member.email}</a>
                      </div>
                    </div>
                  </div>
                  {member.publications.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-mq-border">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-3 h-3 text-mq-gold" />
                        <span className="text-xs font-medium text-mq-ink">代表著作</span>
                      </div>
                      <ul className="space-y-1">
                        {member.publications.map((pub, i) => (
                          <li key={i} className="text-xs text-mq-gray flex items-start gap-2">
                            <Award className="w-3 h-3 text-mq-gold flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{pub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                <div className="text-lg font-bold text-mq-gold mb-1">
                  {collab.name}
                </div>
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

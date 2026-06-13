export type Lang = 'en' | 'zh'
export type Theme = 'light' | 'dark'

type Dict = Record<string, { en: string; zh: string }>

const dict = {
  'nav.overview': { en: 'Overview', zh: '总览' },
  'nav.architecture': { en: 'Architecture', zh: '架构' },
  'nav.agent': { en: 'StrikeAgent', zh: '智能体' },
  'nav.domains': { en: 'Domains', zh: '领域' },
  'nav.core': { en: 'Core', zh: '核心' },

  'hero.tag': { en: 'Offensive-Security Intelligence', zh: '攻防安全智能' },
  'hero.lede': {
    en: 'An autonomous offensive-security stack. Agents that plan, exploit and report — skills, command line, code audit and four combat domains working as one.',
    zh: '一套自主的攻防安全体系。能够自主规划、利用与复盘的智能体——技能、命令行、代码审计与四大作战领域协同联动。',
  },
  'hero.cta1': { en: 'See how it links', zh: '查看协同联动' },
  'hero.cta2': { en: 'See the core', zh: '看看核心两块' },

  'overview.eyebrow': { en: 'StrikeAgent Platform', zh: 'StrikeAgent 平台' },
  'overview.title': { en: 'Autonomous offensive-security agents', zh: '自主攻防智能体' },
  'overview.agentTitle': { en: 'StrikeAgent', zh: 'StrikeAgent · 智能体' },
  'overview.agentDesc': {
    en: 'Skills, a command line, code auditing and a four-domain attack brain — backed by knowledge, a vuln DB and asset mapping.',
    zh: '技能、命令行、代码审计与四领域攻击大脑——由知识库、漏洞库与资产测绘支撑。',
  },

  'arch.eyebrow': { en: 'System Map', zh: '系统图谱' },
  'arch.title': { en: 'How it all connects', zh: '体系如何联动' },
  'arch.desc': {
    en: 'The attack brain calls the CLI, dispatches four domain agents, and their results flow back to enable the next move.',
    zh: '攻击大脑调用命令行、调度四大领域智能体，产出回流并驱动下一步行动。',
  },
  'arch.legend.compose': { en: 'Composition (contains)', zh: '组成（包含）' },
  'arch.legend.flow': { en: 'Runtime call / data flow', zh: '运行时调用 / 数据流' },

  'agent.eyebrow': { en: 'StrikeAgent Modules', zh: 'StrikeAgent 能力' },
  'agent.title': { en: 'Capability matrix', zh: '能力矩阵' },
  'agent.lede': {
    en: 'Seven modules make up StrikeAgent — from atomic skills to the attack brain that orchestrates them, all grounded in knowledge and asset mapping.',
    zh: 'StrikeAgent 由七个模块组成——从原子化技能，到统筹调度的攻击大脑，再到知识与资产测绘的支撑底座。',
  },
  'agent.viewDomains': { en: 'View domains', zh: '查看领域' },

  'linkage.eyebrow': { en: 'Runtime Linkage', zh: '体系联动' },
  'linkage.title': { en: 'How StrikeAgent works as one', zh: 'StrikeAgent 如何协同联动' },
  'linkage.desc': {
    en: 'Asset mapping reconnoiters the attack surface; knowledge, the vuln DB, skills and code-audit feed the attack brain; the CLI issues the command; the brain dispatches the four domain products; results converge and flow back to enable the next move — an end-to-end loop.',
    zh: '资产测绘侦察攻击面，知识库、漏洞库、技能与代码审计为攻击大脑供给；命令行下达指令，大脑调度四个领域产品，战果汇聚后回流驱动下一步——端到端闭环。',
  },
  'linkage.supply': { en: 'Knowledge & capability supply', zh: '知识与能力供给' },
  'linkage.brain': { en: 'Attack Brain', zh: '攻击大脑' },
  'linkage.brainNote': { en: 'Decision core · not a standalone product', zh: '决策内核 · 非独立产品' },
  'linkage.cli': { en: 'Command-line', zh: '命令行' },
  'linkage.cliNote': { en: 'Operator control desk', zh: '操作指挥台' },
  'linkage.products': { en: 'Four domain products', zh: '四个领域产品' },
  'linkage.resultNote': { en: 'Aggregated findings', zh: '战果汇总' },

  'domains.eyebrow': { en: 'Attack Brain', zh: '攻击大脑' },
  'domains.title': { en: 'Four combat domains', zh: '四大作战领域' },
  'domains.desc': {
    en: 'Dispatched by the attack brain according to the battlefield state.',
    zh: '由攻击大脑按战场态势动态调度。',
  },

  'footer.tagline': {
    en: 'AI for offensive security.',
    zh: '为攻防而生的人工智能。',
  },
  'footer.rights': { en: 'Internal research preview.', zh: '内部研究预览。' },
  'footer.author': { en: 'Author', zh: '作者' },

  'a11y.theme': { en: 'Toggle theme', zh: '切换主题' },
  'a11y.lang': { en: 'Switch language', zh: '切换语言' },
} satisfies Dict

export type I18nKey = keyof typeof dict

export function t(key: I18nKey, lang: Lang): string {
  return dict[key][lang]
}

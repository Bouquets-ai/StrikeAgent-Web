export type Bi = { en: string; zh: string }

export type Domain = {
  code: string
  name: Bi
  field: string
  desc: Bi
}

export type Capability = {
  code: string
  name: Bi
  group: 'capability' | 'knowledge' | 'interface'
  desc: Bi
  highlights: Bi[]
  domains?: Domain[]
}

export const ROOT = {
  title: 'AI for offensive security',
  version: 'V2026.06.11',
}

export const groupMeta: Record<Capability['group'], Bi> = {
  capability: { en: 'Capability', zh: '能力' },
  knowledge: { en: 'Knowledge', zh: '知识' },
  interface: { en: 'Interface', zh: '接口' },
}

export const capabilities: Capability[] = [
  {
    code: 'StrikeAgent-Skill',
    name: { en: 'Skills', zh: '技能' },
    group: 'capability',
    desc: {
      en: 'A pluggable library of offensive skills. Recon, exploitation, evasion and persistence are packaged as atomic, callable modules the agent can pick up on demand.',
      zh: '可插拔的攻防技能库，把信息收集、漏洞利用、绕过与权限维持等原子能力封装为可调用模块，供智能体即取即用。',
    },
    highlights: [
      { en: 'Atomic, composable skills', zh: '原子化、可组合技能' },
      { en: 'Recon · exploit · evade · persist', zh: '侦察 · 利用 · 绕过 · 维持' },
      { en: 'Hot-pluggable at runtime', zh: '运行时热插拔调用' },
    ],
  },
  {
    code: 'StrikeAgent-CLI',
    name: { en: 'Command-line Tool', zh: '命令行工具' },
    group: 'capability',
    desc: {
      en: 'A unified command-line entry that wires every capability and agent together — scriptable, automatable, the control desk between the operator and the attack brain.',
      zh: '统一的命令行入口，串联各项能力与智能体，支持脚本化、自动化编排，是人与攻击大脑之间的指挥台。',
    },
    highlights: [
      { en: 'Single entry for every module', zh: '统一入口贯通所有模块' },
      { en: 'Scriptable & automatable', zh: '可脚本化、可自动编排' },
      { en: 'Pipes results back to the brain', zh: '产出回灌攻击大脑' },
    ],
  },
  {
    code: 'StrikeAgent-Coder',
    name: { en: 'Code Audit Tool', zh: '代码审计工具' },
    group: 'capability',
    desc: {
      en: 'Automated source-code auditing. It spots dangerous calls and vulnerability patterns, traces exploitable chains, and outputs reproducible findings.',
      zh: '面向源码的自动化审计，识别危险调用与漏洞模式，回溯可利用链路，输出可复现的审计结论。',
    },
    highlights: [
      { en: 'Dangerous-call detection', zh: '危险调用识别' },
      { en: 'Exploit-chain backtracking', zh: '可利用链路回溯' },
      { en: 'Reproducible findings', zh: '可复现审计结论' },
    ],
  },
  {
    code: 'StrikeAgent-AtkBrain',
    name: { en: 'Attack Brain', zh: '攻击大脑' },
    group: 'capability',
    desc: {
      en: 'The decision core — a penetration-testing agent. It autonomously plans attack paths, dispatches the four domain agents by battlefield state, and feeds results back into the CLI loop.',
      zh: '决策中枢（渗透测试智能体）。自主规划攻击路径，按战场态势调度四大领域智能体，并将产出回灌到命令行闭环。',
    },
    highlights: [
      { en: 'Autonomous attack planning', zh: '自主攻击路径规划' },
      { en: 'Dispatches 4 domain agents', zh: '调度四大领域智能体' },
      { en: 'Closed loop with the CLI', zh: '与命令行形成闭环' },
    ],
    domains: [
      {
        code: 'StrikeAgent-Redinit',
        name: { en: 'Red Team', zh: '红队领域' },
        field: 'RED TEAM',
        desc: {
          en: 'Automated red-team operations: external foothold, lateral movement, covert channels and persistence.',
          zh: '自动化红队作业：外网打点、横向移动、隐蔽通道与权限维持。',
        },
      },
      {
        code: 'StrikeAgent-VulnFind',
        name: { en: 'Blue Team', zh: '蓝队领域' },
        field: 'BLUE TEAM',
        desc: {
          en: 'Defensive-perspective vulnerability discovery and risk assessment, pinpointing weak spots and proposing hardening.',
          zh: '防守视角的漏洞发现与风险研判，辅助定位薄弱点并给出加固建议。',
        },
      },
      {
        code: 'StrikeAgent-CTF',
        name: { en: 'CTF', zh: 'CTF 领域' },
        field: 'CTF',
        desc: {
          en: 'Auto-solving CTF challenges: recognize the category, reason out the approach, then generate and verify the exploit.',
          zh: '面向 CTF 赛题的自动解题：识别题型、推理思路、生成并验证 EXP。',
        },
      },
      {
        code: 'StrikeAgent-PE',
        name: { en: 'Post-Exploitation', zh: '后渗透领域' },
        field: 'POST-EXPLOIT',
        desc: {
          en: 'The post-exploitation stage: harvesting, privilege escalation, trace cleanup and data consolidation — banking the spoils.',
          zh: '后渗透阶段的信息收割、提权、清痕与数据归集，沉淀战果。',
        },
      },
    ],
  },
  {
    code: 'StrikeAgent-RAGKB',
    name: { en: 'Knowledge Base', zh: '知识库' },
    group: 'knowledge',
    desc: {
      en: 'A retrieval-augmented offensive knowledge base, accumulating tactics, cases and intelligence to give the agent traceable domain expertise.',
      zh: '检索增强的攻防知识库，沉淀战法、案例与情报，为智能体提供可追溯的领域知识。',
    },
    highlights: [
      { en: 'Retrieval-augmented tactics', zh: '检索增强战法库' },
      { en: 'Cases & threat intel', zh: '案例与威胁情报' },
      { en: 'Traceable domain knowledge', zh: '可追溯领域知识' },
    ],
  },
  {
    code: 'StrikeAgent-VulnDB',
    name: { en: 'Vulnerability DB', zh: '漏洞库' },
    group: 'knowledge',
    desc: {
      en: 'Structured vulnerability data linked to PoC / EXP and asset fingerprints, powering the attack brain to pick paths with precision.',
      zh: '结构化漏洞数据，关联 PoC / EXP 与资产指纹，支撑攻击大脑的精准选路。',
    },
    highlights: [
      { en: 'Structured vuln records', zh: '结构化漏洞数据' },
      { en: 'Linked PoC / EXP', zh: '关联 PoC / EXP' },
      { en: 'Asset-fingerprint mapping', zh: '资产指纹关联' },
    ],
  },
  {
    code: 'StrikeAgent-MAP',
    name: { en: 'Asset Mapping', zh: '资产测绘' },
    group: 'interface',
    desc: {
      en: 'Cyberspace asset discovery and mapping, building a live attack-surface view that serves as the platform’s outward situational interface.',
      zh: '网络空间资产探测与测绘，构建实时可攻击面视图，作为对外的态势接口。',
    },
    highlights: [
      { en: 'Cyberspace asset discovery', zh: '网络空间资产探测' },
      { en: 'Live attack-surface view', zh: '实时攻击面视图' },
      { en: 'Outward situational interface', zh: '对外态势接口' },
    ],
  },
]

export type Stat = {
  value: number
  suffix: string
  label: Bi
  sub: string
}

export const stats: Stat[] = [
  { value: 7, suffix: '', label: { en: 'Agent Modules', zh: '智能体模块' }, sub: 'StrikeAgent' },
  { value: 4, suffix: '', label: { en: 'Combat Domains', zh: '渗透对抗领域' }, sub: 'Red · Blue · CTF · PE' },
  { value: 5, suffix: '', label: { en: 'Knowledge & Supply', zh: '知识与能力供给' }, sub: 'MAP · RAGKB · VulnDB · Skill · Coder' },
]

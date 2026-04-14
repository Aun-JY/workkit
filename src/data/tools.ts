export type ToolCategory =
  | 'text' | 'datetime' | 'converter' | 'dev' | 'calculator' | 'games';

export interface Tool {
  id: string;
  category: ToolCategory;
  icon: string;
  path: string;
  badge?: 'popular' | 'niche' | 'new';
  nameKey: string;
  descKey: string;
}

export const CATEGORY_META: Record<ToolCategory, { icon: string; labelKey: string }> = {
  text:       { icon: '📝', labelKey: 'categories.text' },
  datetime:   { icon: '📅', labelKey: 'categories.datetime' },
  converter:  { icon: '🔄', labelKey: 'categories.converter' },
  dev:        { icon: '💻', labelKey: 'categories.dev' },
  calculator: { icon: '💰', labelKey: 'categories.calculator' },
  games:      { icon: '🎯', labelKey: 'categories.games' },
};

export const ALL_TOOLS: Tool[] = [
  // TEXT
  { id: 'word-counter',      category: 'text',       icon: '🔢', path: '/tools/word-counter',      badge: 'popular', nameKey: 'tools.wordCounter.name',      descKey: 'tools.wordCounter.desc' },
  { id: 'case-converter',    category: 'text',       icon: '🔤', path: '/tools/case-converter',                      nameKey: 'tools.caseConverter.name',    descKey: 'tools.caseConverter.desc' },
  { id: 'whitespace',        category: 'text',       icon: '✂️', path: '/tools/whitespace',                          nameKey: 'tools.whitespace.name',       descKey: 'tools.whitespace.desc' },
  { id: 'email-formatter',   category: 'text',       icon: '📧', path: '/tools/email-formatter',   badge: 'niche',   nameKey: 'tools.emailFormatter.name',   descKey: 'tools.emailFormatter.desc' },
  { id: 'resume-formatter',  category: 'text',       icon: '📄', path: '/tools/resume-formatter',  badge: 'niche',   nameKey: 'tools.resumeFormatter.name',  descKey: 'tools.resumeFormatter.desc' },
  { id: 'meeting-formatter', category: 'text',       icon: '📝', path: '/tools/meeting-formatter', badge: 'niche',   nameKey: 'tools.meetingFormatter.name', descKey: 'tools.meetingFormatter.desc' },
  // DATE & TIME
  { id: 'dday',              category: 'datetime',   icon: '📆', path: '/tools/dday',              badge: 'popular', nameKey: 'tools.dday.name',             descKey: 'tools.dday.desc' },
  { id: 'work-hours',        category: 'datetime',   icon: '⏱️', path: '/tools/work-hours',                          nameKey: 'tools.workHours.name',        descKey: 'tools.workHours.desc' },
  { id: 'timezone',          category: 'datetime',   icon: '🌍', path: '/tools/timezone',                            nameKey: 'tools.timezone.name',         descKey: 'tools.timezone.desc' },
  { id: 'pto',               category: 'datetime',   icon: '🏖️', path: '/tools/pto',               badge: 'niche',   nameKey: 'tools.pto.name',              descKey: 'tools.pto.desc' },
  // CONVERTER
  { id: 'qr-generator',     category: 'converter',  icon: '📱', path: '/tools/qr-generator',     badge: 'popular', nameKey: 'tools.qrGenerator.name',     descKey: 'tools.qrGenerator.desc' },
  { id: 'base64',           category: 'converter',  icon: '🔐', path: '/tools/base64',                              nameKey: 'tools.base64.name',          descKey: 'tools.base64.desc' },
  { id: 'color-palette',    category: 'converter',  icon: '🎨', path: '/tools/color-palette',                       nameKey: 'tools.colorPalette.name',    descKey: 'tools.colorPalette.desc' },
  { id: 'password-gen',     category: 'converter',  icon: '🔑', path: '/tools/password-gen',     badge: 'popular', nameKey: 'tools.passwordGen.name',     descKey: 'tools.passwordGen.desc' },
  { id: 'unit-converter',   category: 'converter',  icon: '📐', path: '/tools/unit-converter',   badge: 'new',     nameKey: 'tools.unitConverter.name',   descKey: 'tools.unitConverter.desc' },
  // DEV
  { id: 'json-formatter',   category: 'dev',        icon: '📋', path: '/tools/json-formatter',   badge: 'popular', nameKey: 'tools.jsonFormatter.name',   descKey: 'tools.jsonFormatter.desc' },
  { id: 'env-generator',    category: 'dev',        icon: '🔑', path: '/tools/env-generator',    badge: 'niche',   nameKey: 'tools.envGenerator.name',    descKey: 'tools.envGenerator.desc' },
  { id: 'readme-builder',   category: 'dev',        icon: '📖', path: '/tools/readme-builder',   badge: 'niche',   nameKey: 'tools.readmeBuilder.name',   descKey: 'tools.readmeBuilder.desc' },
  { id: 'cursor-rules',     category: 'dev',        icon: '🤖', path: '/tools/cursor-rules',     badge: 'niche',   nameKey: 'tools.cursorRules.name',     descKey: 'tools.cursorRules.desc' },
  { id: 'unix-timestamp',   category: 'dev',        icon: '🔢', path: '/tools/unix-timestamp',                     nameKey: 'tools.unixTimestamp.name',   descKey: 'tools.unixTimestamp.desc' },
  { id: 'regex-visualizer', category: 'dev',        icon: '🔍', path: '/tools/regex-visualizer',                   nameKey: 'tools.regexVisualizer.name', descKey: 'tools.regexVisualizer.desc' },
  // CALCULATOR
  { id: 'salary',           category: 'calculator', icon: '💼', path: '/tools/salary',           badge: 'popular', nameKey: 'tools.salary.name',           descKey: 'tools.salary.desc' },
  { id: 'overtime',         category: 'calculator', icon: '⏰', path: '/tools/overtime',         badge: 'niche',   nameKey: 'tools.overtime.name',         descKey: 'tools.overtime.desc' },
  { id: 'raise-calc',       category: 'calculator', icon: '📈', path: '/tools/raise-calc',       badge: 'niche',   nameKey: 'tools.raiseCalc.name',        descKey: 'tools.raiseCalc.desc' },
  { id: 'dutch-pay',        category: 'calculator', icon: '🍽️', path: '/tools/dutch-pay',                          nameKey: 'tools.dutchPay.name',         descKey: 'tools.dutchPay.desc' },
  { id: 'freelance-rate',   category: 'calculator', icon: '💸', path: '/tools/freelance-rate',   badge: 'niche',   nameKey: 'tools.freelanceRate.name',    descKey: 'tools.freelanceRate.desc' },
  { id: 'savings-calc',     category: 'calculator', icon: '🏦', path: '/tools/savings-calc',     badge: 'new',     nameKey: 'tools.savingsCalc.name',      descKey: 'tools.savingsCalc.desc' },
  { id: 'loan-calc',        category: 'calculator', icon: '🏠', path: '/tools/loan-calc',        badge: 'new',     nameKey: 'tools.loanCalc.name',         descKey: 'tools.loanCalc.desc' },
  { id: 'basic-calculator', category: 'calculator', icon: '🔢', path: '/tools/basic-calculator', badge: 'new',     nameKey: 'tools.basicCalculator.name',  descKey: 'tools.basicCalculator.desc' },
  // GAMES
  { id: 'ladder-game',      category: 'games',      icon: '🪜', path: '/tools/ladder-game',      badge: 'popular', nameKey: 'tools.ladderGame.name',      descKey: 'tools.ladderGame.desc' },
  { id: 'roulette',         category: 'games',      icon: '🎡', path: '/tools/roulette',                           nameKey: 'tools.roulette.name',        descKey: 'tools.roulette.desc' },
  { id: 'team-splitter',    category: 'games',      icon: '👥', path: '/tools/team-splitter',                      nameKey: 'tools.teamSplitter.name',    descKey: 'tools.teamSplitter.desc' },
  { id: 'lunch-picker',     category: 'games',      icon: '🍜', path: '/tools/lunch-picker',                       nameKey: 'tools.lunchPicker.name',     descKey: 'tools.lunchPicker.desc' },
  { id: 'lucky-draw',       category: 'games',      icon: '🎲', path: '/tools/lucky-draw',                         nameKey: 'tools.luckyDraw.name',       descKey: 'tools.luckyDraw.desc' },
];

export const POPULAR_TOOLS = ALL_TOOLS.filter(t => t.badge === 'popular').slice(0, 8);

export const getToolsByCategory = (cat: ToolCategory) =>
  ALL_TOOLS.filter(t => t.category === cat);

export const getToolById = (id: string) =>
  ALL_TOOLS.find(t => t.id === id);

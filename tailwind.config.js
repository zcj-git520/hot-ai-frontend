/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './components/**/*.{vue,ts,js}',
    './pages/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        // 宣纸：比上版更暖、更旧
        paper:       '#F2EBD9',
        'paper-deep':'#E8DFC5',
        'paper-soft':'#F7F1E0',
        'paper-faint':'#EDE5CD',
        // 墨
        ink:        '#1A1714',
        'ink-soft': '#2E2823',
        'ink-mute': '#6B6155',
        'ink-faint':'#9A8E7E',
        // 朱砂
        vermillion:    '#B5202A',
        'vermillion-deep': '#8B141C',
        'vermillion-soft': '#D63D45',
        // 印泥深红（用于印章）
        seal:        '#8B141C',
        // 墨绿（用于「学习」类）
        moss:        '#3F5D3A',
        // 土黄（用于「工具」类）
        ochre:       '#A87326',
        // 蓝黑（用于「资讯」类）
        indigo:      '#1F3147',
        // 边线
        rule:        '#1A1714',
        'rule-soft': '#C8BBA0',
        'rule-faint':'#D9CDB0',
      },
      fontFamily: {
        // 中文衬线为主角
        display: ['"Noto Serif SC"', '"Source Serif 4"', 'STSong', 'SimSun', 'serif'],
        serif:   ['"Noto Serif SC"', '"Source Serif 4"', 'STSong', 'SimSun', 'serif'],
        // 中文 sans 作副
        sans:    ['"Noto Sans SC"', '"IBM Plex Sans"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        // 拉丁无衬线（仅数据 / UI 标签）
        latin:   ['"IBM Plex Sans"', 'sans-serif'],
        // 数字 / 元数据
        mono:    ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        kicker:  ['12px',  { lineHeight: '1.1',  letterSpacing: '0.24em' }],
        seal:    ['13px',  { lineHeight: '1',    letterSpacing: '0.12em' }],
        dateline:['11px',  { lineHeight: '1.2',  letterSpacing: '0.18em' }],
      },
      maxWidth: {
        column: '34rem',
        broadsheet: '1320px',
      },
      letterSpacing: {
        masthead: '0.06em',
        cjk:      '0.04em',
      },
      spacing: {
        seal: '2.5rem',
      },
    },
  },
  corePlugins: {
    // 禁用 gradient——杜绝任何 AI 模板的渐变回潮
    backgroundImage: false,
  },
  plugins: [],
}

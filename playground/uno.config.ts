import type { PresetWind4Theme } from 'unocss';
import { defineConfig, presetWind4 } from 'unocss';
import { presetMagicolor } from 'unocss-preset-magicolor';

/** 应用使用的颜色、尺寸与效果主题。 */
const theme: PresetWind4Theme = {
  font: { sans: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' },
  spacing: {
    'DEFAULT': '4px',
    'px': '1px',
    'form': '390px',
    'intro': '370px',
    'layout': '820px',
    'history': '620px',
    'board': '620px',
    'sidebar': '280px',
    'game-shell': '1078px',
    'settings-shell': '1040px',
    'dialog': '460px',
    'dialog-sm': '400px',
  },
  text: {
    '2xs': { fontSize: '9px', lineHeight: '1.25' },
    'xs': { fontSize: '10px', lineHeight: '1.4' },
    'sm': { fontSize: '11px', lineHeight: '1.45' },
    'base': { fontSize: '12px', lineHeight: '1.5' },
    'md': { fontSize: '13px', lineHeight: '1.5' },
    'lg': { fontSize: '14px', lineHeight: '1.55' },
    'xl': { fontSize: '15px', lineHeight: '1.45' },
    '2xl': { fontSize: '17px', lineHeight: '1.4' },
    '3xl': { fontSize: '18px', lineHeight: '1.35' },
    '4xl': { fontSize: '21px', lineHeight: '1.3' },
    '5xl': { fontSize: '30px', lineHeight: '1.15' },
    '6xl': { fontSize: '66px', lineHeight: '1' },
  },
  radius: {
    'DEFAULT': '9px',
    'none': '0',
    'xs': '6px',
    'sm': '8px',
    'md': '9px',
    'lg': '10px',
    'xl': '12px',
    '2xl': '14px',
    '3xl': '18px',
    '4xl': '20px',
    '5xl': '22px',
    '6xl': '28px',
    'pill': '99px',
    'full': '9999px',
  },
  shadow: {
    card: '0 22px 55px color-mix(in oklab, var(--app-shadow-color, var(--mc-colors-ink-950)) 13%, transparent)',
    shell: [
      '0 26px 70px color-mix(in oklab, var(--app-shadow-color, var(--mc-colors-ink-950)) 14%, transparent)',
      '0 2px 8px color-mix(in oklab, var(--app-shadow-color, var(--mc-colors-ink-950)) 4%, transparent)',
    ],
    float: '0 7px 14px color-mix(in oklab, var(--app-shadow-color, var(--mc-colors-sage-600)) 18%, transparent)',
    dialog: '0 24px 60px color-mix(in oklab, var(--app-shadow-color, var(--mc-colors-ink-950)) 20%, transparent)',
    soft: '0 12px 32px color-mix(in oklab, var(--app-shadow-color, var(--mc-colors-ochre-650)) 15%, transparent)',
    focus: '0 0 0 3px color-mix(in oklab, var(--mc-colors-sage-600) 10%, transparent)',
    board: '0 4px 14px color-mix(in oklab, var(--app-shadow-color, var(--mc-colors-board-800)) 10%, transparent)',
  },
};

/** 注册基础颜色源与按深度生成颜色的 Magicolor。 */
export default defineConfig<PresetWind4Theme>({
  presets: [
    presetWind4(),
    presetMagicolor({
      colors: {
        ink: '#24261f',
        paper: '#B5A983',
        canvas: '#eef2e8',
        ivory: '#f9f4e8',
        sage: '#41684e',
        ochre: '#dcb35c',
        danger: '#a9584d',
        neutral: '#b5b9ae',
        board: '#805a1a',
        stone: '#1c1d1a',
      },
      dark: {
        ink: '#f4efe4',
        paper: '#30322a',
        canvas: '#1c1e18',
        ivory: '#14150f',
        sage: '#74ab89',
        ochre: '#e2ba66',
        danger: '#dd9282',
        neutral: '#e8eae4',
        board: { color: '#805a1a', lightnessReverse: true },
        stone: { color: '#1c1d1a', lightnessReverse: true },
      },
    }),
  ],
  theme,
  preflights: [{ getCSS: () => '.dark { --app-shadow-color: #000; }' }],
});

import { defineConfig, presetWind4 } from 'unocss';
import { presetMagicolor } from 'unocss-preset-magicolor';

export default defineConfig({
  presets: [
    presetWind4(),
    presetMagicolor(),
  ],
});

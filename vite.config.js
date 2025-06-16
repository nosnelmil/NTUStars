import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

import { sassMigratorQuasar } from 'rollup-plugin-sass-migrator';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: { transformAssetUrls }
  }),
  quasar({
    sassVariables: 'src/quasar-variables.sass',
    plugins: [sassMigratorQuasar()]
  })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

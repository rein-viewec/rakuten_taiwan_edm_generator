// plugins/vuetify.js
import { createVuetify, ThemeDefinition } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
import {
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiCheckboxMarkedOutline,
} from '@mdi/js'
import colors from 'vuetify/lib/util/colors.mjs'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    inorganicPrimary: '#3A3A3A',
    inorganicSecondary: '#2c2c2c',
    textGray: '#ffffff',
    surface: '#383838',
    primary: '#bb6350',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

const light: ThemeDefinition = {
  dark: false,
  colors: {
    inorganicPrimary: '#ffffff',
    inorganicSecondary: '#ececec',
    textGray: '#727272',
    surface: '#FFFFFF',
    primary: '#bb6350',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        light,
        dark,
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        fa,
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
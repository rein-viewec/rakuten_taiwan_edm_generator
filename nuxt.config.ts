// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from 'nuxt'
export default defineNuxtConfig({
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify'],
    },
    modules: [
        '@pinia/nuxt',
        'nuxt-clipboard',
    ],
    clipboard: {
        autoSetContainer: true
    },
    axios: {
        baseURL: process.env.API_BASE_URL
    },
    runtimeConfig: {
        reurl_secret_key: process.env.reurl_secret_key,
        reurl_api_url: process.env.reurl_api_url,
        secret_token: process.env.secret_token,
        public: {
            // JGUrl: process.env.JG_URL,
            // JGToken: process.env.JG_TOKEN,
            token: process.env.token,
        },
    },
    vite: {
        define: {
            'process.env.DEBUG': false,
        },
    },
})

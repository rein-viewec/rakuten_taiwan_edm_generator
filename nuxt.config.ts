// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from 'nuxt'
export default defineNuxtConfig({
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify'],
    },
    modules: [
        '@pinia/nuxt',
    ],
    axios: {
        baseURL: process.env.API_BASE_URL
    },
    runtimeConfig: {
        cryptoSecret: process.env.crypto_secret_key,
        public: {
            JGUrl: process.env.JG_URL,
            JGToken: process.env.JG_TOKEN,
            // token: process.env.token
        },
    },
    vite: {
        define: {
            'process.env.DEBUG': false,
        },
    },
})

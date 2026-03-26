import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

import App from './App.vue'
import router from './router'

import { useFavoriteStore } from '@/stores/favoriteStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)

useFavoriteStore().initStore()

app.mount('#app')

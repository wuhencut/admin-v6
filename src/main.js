import { createApp } from 'vue'
import  ElementPlus from "element-plus";
import 'element-plus/lib/theme-chalk/index.css';
import router from "./router/index.js"
import store from "./store/index.js"
import api from "./api"

import App from './App.vue'

const app = createApp(App);
app.use(ElementPlus, {size: "small", zIndex: 3000})
app.use(router);
app.use(store)

app.config.globalProperties.$api= api
app.mount('#app');

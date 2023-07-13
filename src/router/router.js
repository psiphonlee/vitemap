import { createRouter, createWebHashHistory } from "vue-router";
import houtailogin from "../pages/houtailogin.vue";
import guanli from "../components/guanli.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/houtailogin",
            name: "houtailogin",
            component:houtailogin,
        },
        {
            path: "/guanli",
            name: "guanli",
            component:guanli,
        }
    ]
    
})

export default router
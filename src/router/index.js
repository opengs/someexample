import Vue from 'vue'
import VueRouter from 'vue-router'

import Cameras from '@/components/Cameras'
//import Dashboard from '@/components/Dashboard'

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        redirect: {name: "Cameras"}
    },
    /*{
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard
    },*/
    {
        path: "/cameras",
        name: "Cameras",
        component: Cameras
    },
]

const router = new VueRouter({
    routes
})

export default router
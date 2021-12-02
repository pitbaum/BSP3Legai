import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import CaseFAQ from "../views/CaseFAQ.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/casefaq",
    name: "CaseFAQ",
    component: CaseFAQ,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
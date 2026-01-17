import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import AdminDashboard from "../views/AdminDashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/admin", component: AdminDashboard }, // In a real app, should have auth guard
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

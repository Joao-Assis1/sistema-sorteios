import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import AdminDashboard from "../views/AdminDashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard - Verifica autenticação antes de acessar rotas protegidas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    // Usuário não autenticado tentando acessar rota protegida
    // Redireciona para a página inicial (Consulta de Participantes)
    next("/");
  } else {
    next();
  }
});

export default router;

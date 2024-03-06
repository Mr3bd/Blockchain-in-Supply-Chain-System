import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage/LoginPage.vue';
import DashboardPage from './components/DashboardPage/DashboardPage.vue';
import { getAccount } from './web3Service';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getAccount();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/'); // Redirect to login page if authentication is required but user is not logged in
  } else if (isAuthenticated && to.path === '/') {
    next('/dashboard'); // Redirect to dashboard if user is already logged in and accessing the root path
  } else {
    next(); // Continue navigation
  }
});

export default router;
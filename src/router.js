import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage/LoginPage.vue';
import DashboardPage from './components/DashboardPage/DashboardPage.vue';
import { getAccount } from './web3Service';

const routes = [
  { path: '/', redirect: '/dashboard' }, // Redirect root path to '/dashboard'
  { path: '/login', component: LoginPage },
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getAccount().value;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !isAuthenticated) {
    // If authentication is required but user is not authenticated,
    // redirect to the login page
    next('/login');
  } else if (isAuthenticated && to.path === '/') {
    // If user is authenticated and navigates to the root path,
    // redirect to the dashboard page
    next('/dashboard');
  } else {
    // Otherwise, proceed with the navigation
    next();
  }
});

export default router;
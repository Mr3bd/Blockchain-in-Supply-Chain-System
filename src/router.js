import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "./components/LoginPage/LoginPage.vue";
import DashboardPage from "./components/DashboardPage/DashboardPage.vue";
import { getAccount, set_balance, logout } from "./web3Service";
import { postData } from "./apiService.js";
import { user, accountBalance } from "@/globalVariables";
import AddMaterial from "./views/AddMaterial.vue";
import Materials from "./views/Materials.vue";
import AddUser from "./views/AddUser.vue";
import Users from "./views/Users.vue";
import Products from "./views/Products.vue";
import AddProduct from "./views/AddProduct.vue";
import QARequests from "./views/QARequests.vue";
import Store from "./views/Store.vue";
import Orders from "./views/Orders.vue";
import ShippingRequests from "./views/ShippingRequests.vue";

const routes = [
  { path: "/", redirect: "/dashboard" }, // Redirect root path to '/dashboard'
  { path: "/login", component: LoginPage },
  {
    path: "/dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
    children: [
      { path: "addmaterial", component: AddMaterial },
      { path: "materials", component: Materials },
      { path: "users", component: Users },
      { path: "adduser", component: AddUser },
      { path: "products", component: Products },
      { path: "addproduct", component: AddProduct },
      { path: "qarequests", component: QARequests },
      { path: "store", component: Store },
      { path: "orders", component: Orders },
      { path: "shippingrequests", component: ShippingRequests },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getAccount().value;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    // If authentication is required but user is not authenticated,
    // redirect to the login page
    next("/login");
  } else if (isAuthenticated && to.path === "/") {
    // If user is authenticated and navigates to the root path,
    // redirect to the dashboard page
    if (accountBalance.value == null) {
      set_balance();
    }
    next("/dashboard");
  } else {
    if (user.value.id != null) {
      next();
      if (accountBalance.value == null) {
        set_balance();
      }
    } else {
      if (getAccount().value != null) {
        check_login(next);
      } else {
        next();
      }
    }
  }
});

export const check_login = async (next) => {
  postData("login", { id: getAccount().value })
    .then((response) => {
      user.value = response["user"];
      console.log(response);
      if (user.value.deleted == 1) {
        logout();
      } else {
        if (accountBalance.value == null) {
          set_balance();
        }
        next();
      }
    })
    .catch((error) => {
      console.error("Error while making POST request:", error);
      // Handle the error as needed
      logout();
    });
};

export default router;

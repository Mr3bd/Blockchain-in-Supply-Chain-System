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
import SystemLogs from "./views/SystemLogs.vue";
import Notifications from "./views/Notifications.vue";

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
      { path: "systemlogs", component: SystemLogs },
      { path: "notifications", component: Notifications },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  console.log("gg");
  console.log(to.path);
  if (getAccount().value == null && requiresAuth) {
    if (to.path != "/login") {
      next("/login");
    }

    // Redirect to login if not authenticated
  } else {
    console.log("xx");

    if (to.path == "/" || to.path == "/dashboard") {
      console.log("zz");

      getLogin();

      next(); // Proceed to the route
    } else if (to.path == "/login") {
      console.log("yy");

      next();
    } else {
      next();
    }
  }
});

export const getLogin = async (next) => {
  postData(
    "login",
    { id: getAccount().value },
    () => {},
    () => {}
  )
    .then((response) => {
      console.log("login router.js");
      if (response["user"] != null) {
        user.value = response["user"];
      }
      if (accountBalance.value == null) {
        set_balance();
      }
      
    })
    .catch((error) => {
      console.error("Error while making POST request:", error);
      if (accountBalance.value == null) {
        set_balance();
      }
    });
};

export default router;

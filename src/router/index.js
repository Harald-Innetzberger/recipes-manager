import Vue from "vue";
import VueRouter from "vue-router";
import MainDish from "../views/MainDish.vue";
import { auth } from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/",
    name: "Hauptspeisen",
    component: MainDish,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/appetiser",
    name: "Vorspeisen",
    component: () => import("../views/Appetiser.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dessert",
    name: "Nachspeisen",
    component: () => import("../views/Dessert.vue"),
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next("/login");
  } else {
    next();
  }
});

export default router;

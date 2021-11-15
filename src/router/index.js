import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
   {
      path: "/",
      name: "GenKey",
      component: () => import("../views/GenKey.vue"),
      alias: "gen-key",
   },
   {
      path: "/encrypt",
      name: "Encrypt",
      component: () => import("../views/Encrypt.vue"),
   },
   {
      path: "/decrypt",
      name: "Decrypt",
      component: () => import("../views/Decrypt.vue"),
   },
];

const router = new VueRouter({
   mode: "history",
   base: process.env.BASE_URL,
   routes,
});

export default router;

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../components/Error.vue')
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../views/Goods.vue')
  },
  {
    path: '/goods/details',
    name: 'Details',
    component: () => import('../views/Details.vue')
  },
  {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    component: () => import('../views/ShoppingCart.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: () => import('../views/Collect.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/confirmOrder',
    name: 'ConfirmOrder',
    component: () => import('../views/ConfirmOrder.vue'),
    requireAuth: true
  }
]

// 同一地址报错问题
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

const router = new VueRouter({
  routes
})

export default router

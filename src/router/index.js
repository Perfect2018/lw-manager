import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/page/index';
import Login from '@/page/login';
import Manage from '@/page/manage';
import ToShop from '@/page/shop/toShop';
import Getgoods from '@/page/goodsmanage/getGoods';
import ToCategory from '@/page/goodsmanage/tocategory';
import Review from '@/page/goodsmanage/review';
import GetOrderPage from '@/page/order/getOrderPage';
import GetShopOrderPage from '@/page/order/getShopOrderPage';
import AdvertIndex from "@/page/advert/advertIndex";
import ToKnight from "@/page/knight/toKnight";
import GetRecruit from "@/page/recruit/getRecruit";
import GetUnsalable from "@/page/unsalable/getUnsalable";
import getMessage from "@/page/message/getMessage";
import ToPtRedPackager from "@/page/ptred/toPtRedPackager";
import RoleIndex from "@/page/role/roleIndex";
import cust from "@/page/cust/getCustList";
import ShopCashRollList from "@/page/cashRoll/shopCashRollList";

Vue.use(Router);

export default new Router({
  routes: [
    //登录
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    //管理模板
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
      children: [
        //管理首页
        {
          path: '/index',
          name: 'Index',
          component: Index
        },
        // //客户列表
        {
            path: '/cust/getCustList',
            name: 'getCustList',
            component: cust
        },
        // //角色管理
        // {
        //     path: '/role/roleIndex',
        //     name: 'RoleIndex',
        //     component: RoleIndex
        // },
        //
        //广告列表
        {
            path: '/advert/advertIndex',
            name: 'AdvertIndex',
            component: AdvertIndex
        },
        // //骑士列表
        // {
        //     path: '/knight/toKnight',
        //     name: 'ToKnight',
        //     component: ToKnight
        // },
        //商户申请管理
        {
          path: '/shop/toShop',
          name: 'ToShop',
          component: ToShop
        },
        //商品列表
        {
          path: '/goodsmanage/getgoods',
          name: 'Getgoods',
          component: Getgoods
        },
        //品类管理
        // {
        //     path: '/category/tocategory',
        //     name: 'ToCategory',
        //     component: ToCategory
        // },
        //审核商品
        // {
        //   path: '/goodsmanage/review',
        //   name: 'Review',
        //   component: Review
        // },
        // //客户订单管理
        // {
        //     path: '/order/getOrderPage',
        //     name: 'GetOrderPage',
        //     component: GetOrderPage
        // },
        // //商户订单管理
        // {
        //     path: '/order/getShopOrderPage',
        //     name: 'GetShopOrderPage',
        //     component: GetShopOrderPage
        // },
        // //合伙人管理
        // {
        //     path: '/recruit/getRecruit',
        //     name: 'GetRecruit',
        //     component: GetRecruit
        // },
        // //滞销管理
        // {
        //     path: '/unsalable/getUnsalable',
        //     name: 'GetUnsalable',
        //     component: GetUnsalable
        // },
        // //意见反馈
        {
            path: '/message/getMessageList',
            name: 'getMessage',
            component: getMessage
        },
        //红包管理
        // {
        //     path: '/ptred/toPtRedPackager',
        //     name: 'ToPtRedPackager',
        //     component: ToPtRedPackager
        // },
        //店铺现金券管理
        // {
        //   path: '/cashRoll/shopCashRollList',
        //   name: 'ShopCashRollList',
        //   component: ShopCashRollList
        // }
      ],
      beforeEnter: (to, from, next) => {
        let token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {
          next({
            name: "Login"
          });
        }
      }

    },


  ]
})

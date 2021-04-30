import Router from "vue-router"
import api from "../api/index.js"

let router = new Router({
  routes: [
    {
      path: "*",
      redirect: "login" //无效路由匹配 登录
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue")
    },
    {
      path: "/",
      name: "main",
      component: () => import("../views/Main.vue"),
      //验证登录
      async beforeEnter(to, from, next) {
        alert(1)
        if (sessionStorage.getItem("auth") == 1) {
          next();
        } else {
          alert(2)
          let res = await api.verify({});
          if (res.data.valid == 1) {
            sessionStorage.setItem("auth", 1);
            next();
          } else {
            next("login");
          }
        }
      },
      children: [
        {
          path: ""
          // redirect:'cpList'
        },
        {
          path: "cpList",
          name: "cpList",
          component: () => import("../views/cp/List.vue")
        },
        {
          path: "registeCpList",
          name: "registeCpList",
          component: () => import("../views/cp/RegisteCpList.vue")
        },
        {
          path: "cpApply",
          name: "cpApply",
          component: () => import("../views/cp/Apply.vue")
        },
        {
          path: "brandList",
          name: "brandList",
          component: () => import("../views/brand/List.vue")
        },
        {
          path: "configExplain",
          name: "configExplain",
          component: () => import("../views/config/Explain.vue")
        },
        {
          path: "configList",
          name: "configList",
          component: () => import("../views/config/List.vue")
        },
        {
          path: "configEdit",
          name: "configEdit",
          component: () => import("../views/config/Edit.vue")
        },
        {
          path: "configForm",
          name: "configForm",
          component: () => import("../views/config/Form.vue")
        },
        {
          path: "cpKill",
          name: "cpKill",
          component: () => import("../views/utils/Kill.vue")
        },
        {
          path: "orderList",
          name: "orderList",
          component: () => import("../views/order/List.vue")
        },
        {
          path: "updatePassword",
          name: "updatePassword",
          component: () => import("../views/admin/UpdatePassword.vue")
        },
        {
          path: "rechargeOrder",
          name: "rechargeOrder",
          component: () => import("../views/finance/Order.vue")
        },
        {
          path: "activityList",
          name: "activityList",
          component: () => import("../views/activity/List.vue")
        },
        {
          path: "evaluataionList",
          name: "evaluataionList",
          component: () => import("../views/evaluation/List.vue")
        },
        {
          path: "activitySchedu",
          name: "activitySchedu",
          component: () => import("../views/activity/Schedu.vue")
        },
        {
          path: "activityReward",
          name: "activityReward",
          component: () => import("../views/activity/Reward.vue")
        },
        {
          path: "orderReward",
          name: "orderReward",
          component: () => import("../views/order/Reward.vue")
        },
        {
          path: "spRechargeWithdraw",
          name: "spRechargeWithdraw",
          component: () => import("../views/finance/SpRechargeWithdraw.vue")
        },
        {
          path: "spIncomeWithdraw",
          name: "spIncomeWithdraw",
          component: () => import("../views/finance/SpIncomeWithdraw.vue")
        },
        {
          path: "bloggerWithdraw",
          name: "bloggerWithdraw",
          component: () => import("../views/finance/BloggerWithdraw.vue")
        },
        {
          path: "payUser",
          name: "payUser",
          component: () => import("../views/finance/PayUser.vue")
        },
        {
          path: "expressFansList",
          name: "expressFansList",
          component: () => import("../views/logistics/expressFansList.vue") //粉丝物流
        },
        {
          path: "adminList",
          name: "adminList",
          component: () => import("../views/admin/List.vue") //业务人员管理
        },
        {
          path: "roleList",
          name: "roleList",
          component: () => import("../views/admin/RoleList.vue") //角色管理
        },
        {
          path: "provideIngCoin",
          name: "provideIngCoin",
          component: () => import("../views/finance/ProvideIngCoin.vue") //发放映币
        },
        {
          path: "theme",
          name: "theme",
          component: () => import("../views/utils/Theme.vue") // 主题活动创建工具
        },
        {
          path: "taxRefund",
          name: "taxRefund",
          component: () => import("../views/finance/TaxRefund.vue") // 退税
        },
        {
          path: "webEditor",
          name: "webEditor",
          component: () => import("../views/poster/WebEditor.vue") // H5编辑
        },
        {
          path: "notice",
          name: "notice",
          component: () => import("../views/notice/Notice.vue") // 消息推送
        },
        {
          path: "depositList",
          name: "depositList",
          component: () => import("../views/deposit/List.vue") //押金管理
        },
        {
          path: "adminReset",
          name: "adminReset",
          component: () => import("../views/config/AdminReset.vue") //运营重置操作
        },
        {
          path: "goodsManage",
          name: "goodsManage",
          component: () => import("../views/goodsManage/GoodsManage.vue") //商品管理
        },
        {
          path: "hotGoods",
          name: "hotGoods",
          component: () => import("../views/activity/HotGoods.vue") // 热门单品
        },
        {
          path: "rebateDetail",
          name: "rebateDetail",
          component: () => import("../views/activity/RebateDetail.vue") // 返利活动详情
        },
        {
          path: "goodsList",
          name: "goodsList",
          component: () => import("../views/order/GoodsList.vue") //商品列表
        },
        {
          path: "customerIssues",
          name: "customerIssues",
          component: () => import("../views/afterSale/CustomerIssues.vue") //客户问题
        },
        {
          path: "reviewIssues",
          name: "reviewIssues",
          component: () => import("../views/afterSale/ReviewIssues.vue") //测评修改
        },
        {
          path: "refundIssues",
          name: "refundIssues",
          component: () => import("../views/afterSale/RefundIssues.vue") //退货退款
        },
        {
          path: "starBanner",
          name: "starBanner",
          component: () => import("../views/config/StarBanner.vue") //星选轮播
        },
        {
          path: "appOpen",
          name: "appOpen",
          component: () => import("../views/config/Open.vue") //App开屏
        },
        {
          path: "privateBanner",
          name: "privateBanner",
          component: () => import("../views/config/PrivateBanner.vue") //私享轮播
        },
        {
          path: "companyAuth",
          name: "companyAuth",
          component: () => import("../views/auth/CompanyAuth.vue") //企业认证
        },
        {
          path: "brandAuth",
          name: "brandAuth",
          component: () => import("../views/auth/BrandAuth.vue") //品牌认证
        },
        {
          path: "creditModify",
          name: "creditModify",
          component: () => import("../views/config/CreditModify.vue") //修改信用分
        },
        {
          path: "appTopNav",
          name: "appTopNav",
          component: () => import("../views/config/AppTopNav.vue") // 顶部导航
        },
        {
          path: "guaranteeFines",
          name: "guaranteeFines",
          component: () => import("../views/afterSale/GuaranteeFines.vue") //修改信用分
        },
        {
          path: "appNotice",
          name: "appNotice",
          component: () => import("../views/notice/AppNotice.vue") //修改信用分
        },
        {
          path: "preAudit",
          name: "preAudit",
          component: () => import("../views/pre-audit/List.vue") //预审核
        },
        {
          path: "feedbackReward",
          name: "feedbackReward",
          component: () => import("../views/activity/Feedback.vue") //返利发放
        },
        {
          path: "rewardSettle",
          name: "rewardSettle",
          component: () => import("../views/activity/RewardSettle.vue") //悬赏审核
        },
        {
          path: "tagList",
          name: "tagList",
          component: () => import("../views/tag/List.vue") // 标签列表
        },
        {
          path: "dataList",
          name: "dataList",
          component: () => import("../views/data/List.vue") //数据管理列表
        },
        {
          path: "erpList",
          name: "erpList",
          component: () => import("../views/order/ErpList.vue")
        },
        {
          path: "cpPunish",
          name: "cpPunish",
          component: () => import("../views/cp/Punish.vue") //博主处罚
        },
        {
          path: "cpContact",
          name: "cpContact",
          component: () => import("../views/cp/Contact.vue") //大小号关联
        },
        {
          path: "addReplaceNum",
          name: "addReplaceNum",
          component: () => import("../views/activity/AddReplaceNum.vue")
        },
        {
          path: "campaignAggregation",
          name: "campaignAggregation",
          component: () => import("../views/config/CampaignAggregation.vue")
        },
        {
          path: "baManage",
          name: "baManage",
          component: () => import("../views/community/BaManage.vue") //社群管理
        },
        {
          path: "scoreList",
          name: "scoreList",
          component: () => import("../views/community/ScoreList.vue") //社群分享列表
        },
        {
          path: "shareList",
          name: "shareList",
          component: () => import("../views/community/ShareList.vue") //社群任务分
        },
        {
          path: "category",
          name: "category",
          component: () => import("../views/category/Backend.vue") //后台类目
        },
        {
          path: "categoryFront",
          name: "categoryFront",
          component: () => import("../views/category/Frontend.vue") //前台类目
        },
        {
          path: "specialEvent",
          name: "specialEvent",
          component: () => import("../views/activity/SpecialEvent.vue")
        },
        {
          path: "cloudManage",
          name: "cloudManage",
          component: () => import("../views/finance/CloudManage.vue")
        },
        {
          path: "historyRecords",
          name: "historyRecords",
          component: () => import("../views/finance/HistoryRecords.vue")
        },
        {
          path: "settledInfo",
          name: "settledInfo",
          component: () => import("../views/finance/SettledInfo.vue")
        },
        {
          path: "leagueBlogger",
          name: "leagueBlogger",
          component: () => import("../views/cp/LeagueBlogger.vue")
        },
        {
          path: "personalPool",
          name: "personalPool",
          component: () => import("../views/bd/PersonalPool.vue")
        },
        {
          path: "publicPool",
          name: "publicPool",
          component: () => import("../views/bd/PublicPool.vue")
        },
        {
          path: "bdKpi",
          name: "bdKpi",
          component: () => import("../views/finance/BdKpi.vue")
        },
        {
          path: "sponsorManage",
          name: "sponsorManage",
          component: () => import("../views/sponsor/Manage.vue")
        },
        {
          path: "couponList",
          name: "couponList",
          component: () => import("../views/coupon/CouponList.vue")
        },
        {
          path: "createCoupon",
          name: "createCoupon",
          component: () => import("../views/coupon/CreateCoupon.vue")
        },
        {
          path: "operateSchedule",
          name: "operateSchedule",
          component: () => import("../views/config/OperateSchedule.vue")
        },
        {
          path: "teamPoints",
          name: "teamPoints",
          component: () => import("../views/team/TeamPoints.vue")
        },
        {
          path: "leagueOrder",
          name: "leagueOrder",
          component: () => import("../views/team/LeagueOrder.vue")
        },
        {
          path: "leagueTeamList",
          name: "leagueTeamList",
          component: () => import("../views/team/LeagueTeamList.vue")
        },
        {
          path: "customBloggerList",
          name: "customBloggerList",
          component: () => import("../views/team/CustomBloggerList.vue")
        },
        {
          path: "sourcePrice",
          name: "sourcePrice",
          component: () => import("../views/team/SourcePrice.vue")
        },
        {
          path: "customizedActivityCheck",
          name: "customizedActivityCheck",
          component: () => import("../views/team/CustomizedActivityCheck.vue")
        },
        {
          path: "cashDeposit",
          name: "cashDeposit",
          component: () => import("../views/finance/CashDeposit.vue")
        }
      ]
    }
  ]
});

//拦截路由，判断有没有auth，没有就再次verify
router.beforeEach(async (to, from, next) => {
  console.log(to.path, from.path)
  if (to.name != "login" && sessionStorage.getItem("auth") != 1) {
    let res = await api.verify({});
    if (res.error_code == 0 && res.data.valid == 1) {
      sessionStorage.setItem("auth", 1);
      next();
    } else {
      alert(3)
      next("login");
    }
  } else {
    next();
  }
});

export default router;
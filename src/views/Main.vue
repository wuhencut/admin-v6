<template>
  <el-container class="page-main">
    <!--header-->
    <el-header class="header flex">
      <div class="logo">
        <img src="../../static/img/logo.png" alt="logo" />
      </div>
      <div class="flex-1"></div>
      <div class="user-admin">
        <el-dropdown @command="handleCommand" trigger="click">
          <p class="user-email">{{ userInfo.email }}</p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">安全退出</el-dropdown-item>
            <el-dropdown-item command="updatePassword"
              >修改密码</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!--/header-->
    <!--main-->
    <el-container class="content">
      <el-aside class="aside" width="200px">
        <el-menu
          :default-active="active"
          unique-opened
          router
          text-color="#666"
        >
          <template v-for="item in authList">
            <el-submenu v-if="item.value" :key="item.id" :index="item.id">
              <template slot="title">
                <i :class="icon[item.id]"></i>
                <span>{{ item.label }}</span>
              </template>
              <template v-for="subItem in item.children">
                <el-menu-item
                  v-if="subItem.value"
                  :index="subItem.path"
                  :key="subItem.id"
                  >{{ subItem.label }}</el-menu-item
                >
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main v-if="showMain">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
  <!--/main-->
</template>
<script>
import authJson from "../authTemp/authorization";
import getUserInfo from "../api/getUserInfo";
export default {
  data() {
    return {
      showMain: false,
      userInfo: getUserInfo(), // 用户信息
      authList: authJson.list, //权限列表
      checkedAuth: [], // 获取到的权限id list
      icon: {
        id59: "el-icon-circle-check", // 认证管理
        id60: "el-icon-mobile-phone", // 账户管理
        id61: "el-icon-menu", // 业务管理
        id74: "el-icon-s-claim", //联盟定制
        id62: "el-icon-s-goods", // 商城管理
        id63: "el-icon-present", //社群管理
        id64: "el-icon-date", // 活动管理
        id67: "el-icon-goods", // 结算管理
        id68: "el-icon-location", // 物流管理
        id69: "el-icon-setting", // 配置管理
        id70: "el-icon-more", // 工具管理
        id71: "el-icon-edit-outline", // 财务管理
        id72: "el-icon-star-on", // 账户管理
        id66: "el-icon-shopping-cart-2", // 订单管理
        id65: "el-icon-bell" // 售后管理
      }
    };
  },
  computed: {
    active() {
      let pathName = this.$route.name;
      let pathMap = {
        erpList: "erpList", // 授权管理
        tagList: "tagList", // 标签列表
        rewardSettle: "rewardSettle", // 悬赏审核
        appNotice: "appNotice", // app消息推送
        guaranteeFines: "guaranteeFines", // 保障罚款
        creditModify: "creditModify", // 加减信用
        companyAuth: "companyAuth", // 商户认证
        brandAuth: "brandAuth", // 品牌认证
        cpList: "cpList", //博主列表
        registeCpList: "registeCpList", // 用户列表
        cpApply: "cpApply", //博主申请
        brandList: "brandList", //品牌列表
        cateList: "cateList", //类目列表
        configExplain: "configExplain", //配置说明
        configList: "configList", //配置管理
        configEdit: "configList", //配置编辑
        configForm: "configList", //配置表单
        cpKill: "cpKill", //追杀博主
        crawler: "crawler", //爬虫任务
        crawlerCount: "crawlerCount", //爬虫任务的可视化界面
        crawlerAccount: "crawlerAccount",
        orderList: "orderList", //订单管理
        posterList: "posterList", //活动海报
        rechargeOrder: "rechargeOrder", //充值的订单管理
        activityList: "activityList", //活动管理
        evaluataionList: "activityList", //活动测评地址
        addUrl: "addUrl", //添加测评地址
        activitySchedu: "activitySchedu", //活动排期
        activityReward: "activityReward", //赏金发放审核
        orderReward: "activityReward", //赏金测评审核
        spRechargeWithdraw: "spRechargeWithdraw", //商户充值提现
        spIncomeWithdraw: "spIncomeWithdraw", //商户收入提现
        bloggerWithdraw: "bloggerWithdraw", //博主提现
        payUser: "payUser", // 用户发薪
        adminList: "adminList", //人员管理
        roleList: "roleList", //角色管理
        expressFansList: "expressFansList", //粉丝物流
        provideIngCoin: "provideIngCoin", // 发放映币
        taxRefund: "taxRefund", // 退税审核
        webEditor: "webEditor", //H5 编辑
        notice: "notice", // 折扣列表
        depositList: "depositList", //押金管理
        adminReset: "adminReset", // 运营重置操作
        goodsManage: "goodsManage", // 商品管理
        hotGoods: "hotGoods",
        goodsList: "goodsList", // 商品购买
        customerIssues: "customerIssues", // 客户问题工单
        reviewIssues: "reviewIssues", // 测评修改工单
        refundIssues: "refundIssues", // 退货退款工单
        starBanner: "starBanner", // 星选轮播
        privateBanner: "privateBanner", //私享轮播
        preAudit: "preAudit", // 初审管理
        feedbackReward: "feedbackReward", // 返利发放
        dataList: "dataList", //数据管理
        appOpen: "appOpen", //App开屏
        cpPunish: "cpPunish", //博主处罚
        cpContact: "cpContact", //关联账号
        addReplaceNum: "addReplaceNum", //增加置换活动次数
        appTopNav: "appTopNav", // app端顶部导航配置
        baManage: "baManage", //社群列表
        shareList: "shareList", //社群分享列表
        scoreList: "scoreList", //社群任务分列表
        specialEvent: "specialEvent", //活动专场
        campaignAggregation: "campaignAggregation", //活动聚合
        personalPool: "personalPool", // 个人池
        publicPool: "publicPool", // 公海
        bdKpi: "bdKpi",
        categoryFront: "categoryFront", // 前台类目
        category: "category", //后台类目
        sponsorManage: "sponsorManage", // 商户管理
        leagueBlogger: "leagueBlogger", //联盟博主列表
        cloudManage: "cloudManage", //云账户
        operateSchedule: "operateSchedule", //运营计划
        couponList: "couponList", //优惠券
        createCoupon: "couponList", // 创建优惠券
        leagueTeamList: "leagueTeamList", //联盟战队
        customBloggerList: "customBloggerList", //定制博主
        sourcePrice: "sourcePrice", //联盟平台价
        teamPoints: "teamPoints", //战队积分
        customizedActivityCheck: "customizedActivityCheck", //定制活动审核
        leagueOrder: "leagueOrder", //联盟定制订单
        cashDeposit: "cashDeposit" //保证金
      };
      return pathMap[pathName];
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    //初始化数据
    initData() {
      this.getAdminList(); //获取用户列表
      this.checkAuth(); //检查权限
    },
    //检查权限
    async checkAuth() {
      let role_id;
      if (!this.userInfo) {
        this.$router.push({ name: "login" });
        return false;
      } else {
        role_id = this.userInfo.role_id;
      }
      if (role_id == 0) {
        this.$router.push({
          name: "login"
        });
        return false;
      }
      if (role_id) {
        //如果role_id不存在就返回
        let res = await this.$api.queryRoleInfo(
          this.$initReq({
            id: role_id + "",
            name: "",
            status: -1
          })
        );
        if (res.error_code == 0) {
          //获取的权限json
          this.checkedAuth = JSON.parse(res.data.list[0].page_level_permission);
          this.$store.dispatch("getAuthList", this.checkedAuth);
          if (res.data.list[0].status == 0) {
            this.$message.error(
              res.data.list[0].name + "角色权限未激活，请申请开启权限"
            );
            this.$router.push({
              name: "login"
            });
            return;
          } else {
            this.setRoute(); //对获取到的权限json进行处理
          }
        }
      } else {
        this.$message.error("登录异常，请重新登录");
        this.$router.push({
          name: "login"
        });
        return;
      }
    },
    //配置路由和权限
    setRoute() {
      let validRoute = [];
      // 老的权限是纯对象，indexOf方法不存在， 做兼容
      if (!Array.isArray(this.checkedAuth)) {
        this.showMain = true;
        return false;
      }
      this.authList.map(item => {
        if (this.checkedAuth.indexOf(item.id) > -1) {
          item.value = true;
        }
        item.children.map(subItem => {
          if (this.checkedAuth.indexOf(subItem.id) > -1) {
            subItem.value = true;
            validRoute.push(subItem.path);
          }
        });
      });
      this.showMain = true;
      if (!this.$route.path || this.$route.path == "/") {
        this.$router.push({
          name: validRoute[0]
        });
      }
    },
    //获取admin用户列表
    async getAdminList() {
      let res = await this.$api.listAdmin({});
      if (res.error_code == 0) {
        let adminList = res.data.users,
          allAdmin = {};
        this.$store.dispatch("getAdminList", adminList);
        for (let i = 0; i < adminList.length; i++) {
          allAdmin[adminList[i]["user_id"]] = adminList[i]["nickname"];
        }
        // 给列表展示用的 sponsorManage页面
        this.$store.dispatch("getAllAdmin", allAdmin);
      }
    },
    handleCommand(command) {
      this[command]();
    },
    logout() {
      this.$router.push({
        name: "login"
      });
    },
    updatePassword() {
      this.$router.push({
        name: "updatePassword"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.page-main {
  width: 100%;
  height: 100%;
  .el-header {
    z-index: 100;
    background: #333;
    .logo {
      width: 125px;
      height: 60px;
      padding: 15px 0;
      box-sizing: border-box;
      img {
        height: 30px;
      }
    }
    .user-admin {
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      .user-email {
        color: #fff;
        outline: none !important;
      }
    }
  }
  .header {
    position: fixed;
    width: 100%;
  }
  .content {
    min-width: 1000px;
    padding-top: 60px;
    padding-left: 200px;
    .aside {
      position: fixed;
      // 头部header 60px
      top: 60px;
      left: 0;
      height: 100%;
      // 解决 小屏幕底部悬赏卡 账号管理等不展示问题
      padding-bottom: 100px;
    }
  }
}

.el-main::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.el-aside::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.el-aside {
  background: #fff;
  border-right: 1px solid #e6e6e6;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  height: 100%;
}
</style>

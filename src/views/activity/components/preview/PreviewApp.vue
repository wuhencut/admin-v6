<template>
  <div class="preview-app">
    <div class="my-swipe">
      <swipe class="my-swipe">
        <swipe-item :key="item.id" v-for="item in previewData.images">
          <img :src="item" alt="" />
        </swipe-item>
      </swipe>
    </div>
    <div class="title-info">
      <p class="preview-title">{{ previewData.title }}</p>
      <p class="title-tip">{{ deadLine }}申请截止</p>
    </div>
    <ul class="apply-nums">
      <li>
        <span class="txt-s22 txt-bold">{{ previewData.count }}</span
        ><br />
        <span class="txt-gray txt-s12">商品数量</span>
      </li>
      <li>
        <span class="txt-s22 txt-bold">{{ previewData.apply_count }}</span
        ><br />
        <span class="txt-gray txt-s12">申请数量</span>
      </li>
    </ul>
    <p
      v-if="previewData.describe"
      class="goods-describe txt-gray txt-s12"
      style="padding: 20px; background-color: #fff;"
    >
      {{ previewData.brand_story }}
    </p>
    <div class="guige-area">
      <img :src="previewData.brand_image" alt="" />
      <i class="brand-name">{{ previewData.brand }}</i>
      <!-- <span class="fr"><i class="el-icon-more"></i></span>-->
    </div>
    <!--<p class="brand-detail" v-if="showBrandDetail">
                {{}}
            </p>-->
    <!--亮点-->
    <div class="light-spot" v-if="previewData.guidelines">
      <p class="spot-title txt-gray">评测指引</p>
      <ul class="spots">
        <li :key="index" v-for="(item, index) in previewData.guidelines">
          {{ item }}
        </li>
      </ul>
    </div>
    <p class="details-title">
      <i class="fl left-i">///</i> 产品详情 <i class="fr right-i">///</i>
    </p>
    <!--描述-->
    <div class="production-img" v-html="previewData.new_describe"></div>
    <div class="apply-area">
      <div class="apply-rules txt-gray">
        申请规则
        <i class="el-icon-arrow-right txt-gray fr"></i>
      </div>
      <div class="apply-steps">
        <ul class="steps">
          <li>
            <i class="txt-orange fl">1</i> <i class="txt-gray txt-s10 fl">/</i>
            <i class="step-text fl">
              发起 <br />
              申请</i
            >
          </li>
          <li>
            <i class="txt-orange fl">2</i> <i class="txt-gray txt-s10 fl">/</i>
            <i class="step-text fl">
              申请 <br />
              成功</i
            >
          </li>
          <li>
            <i class="txt-orange fl">3</i> <i class="txt-gray txt-s10 fl">/</i>
            <i class="step-text fl">
              接受 <br />
              商品</i
            >
          </li>
          <li>
            <i class="txt-orange fl">4</i> <i class="txt-gray txt-s10 fl">/</i>
            <i class="step-text fl">
              测评 <br />
              报告</i
            >
          </li>
        </ul>
      </div>
      <div class="preview-footer">
        申请
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "vue-swipe";
import moment from "moment";

require("vue-swipe/dist/vue-swipe.css");

export default {
  props: ["value"],
  name: "PreviewApp", // 预览app的样式
  components: {
    // 引入Swiper组件
    swipe: Swipe,
    "swipe-item": SwipeItem
  },
  data() {
    return {
      moment: moment,
      previewData: {},
      deadLine: "", //活动截止时间
      showBrandDetail: false, //展示商户详情 - 目前没用到
      deadTime: "", //起始时间，截止时间
      reviewsType: ["不限形式", "视频", "图文"] //评测形式
    };
  },
  mounted() {
    this.previewData = this.value;
    // 删除图片乱码问题
    this.previewData.new_describe = this.previewData.new_describe.replace(
      /\\u003c/g,
      "<"
    );
    this.previewData.new_describe = this.previewData.new_describe.replace(
      /\\u003e/g,
      ">"
    );
    this.previewData.new_describe = this.previewData.new_describe.replace(
      /\\/g,
      ""
    );
    this.getTime();
    this.createTime = moment(this.previewData.start_time * 1000).format(
      "YYYY-MM-DD"
    );
    this.deadTime = moment(this.previewData.end_time * 1000).format(
      "YYYY-MM-DD"
    );
  },
  methods: {
    //获取截止时间
    getTime() {
      let deadTime = this.previewData.deadline;
      let deadTimeTxt = "";
      //用这个方法可以得出时间的日期，小时和分钟，。 可以直接取出对象的值来减计算，但是会有小时会负数的情况，还是有点蹩脚

      //也可以根据duration来获取hours days，还是蹩脚
      // let hours = moment.duration(deadTime * 1000).get('hours')

      //可以从obj中获取hours,days等等， 还是妈的蹩脚
      // let deadTimeObj = moment.duration(10000000000, 'ms')

      //最好是引入moment Timezone, 为了这一个方法我引入一个插件，我他妈傻逼吗。垃圾moment插件

      //老老实实自己写，moment不支持
      let oneDay = 24 * 60 * 60;
      let oneHour = 60 * 60;
      if (deadTime > oneDay) {
        let days = parseInt(deadTime / oneDay);
        let hours = parseInt((deadTime - days * oneDay) / oneHour);
        let minutes = parseInt(
          (deadTime - days * oneDay - hours * oneHour) / 60
        );
        deadTimeTxt = days + "天" + hours + "小时" + minutes + "分钟" + "后";
      } else if (deadTime > oneHour && deadTime < oneDay) {
        let hours = parseInt(deadTime / oneHour);
        let minutes = parseInt((deadTime - hours * oneHour) / 60);
        deadTimeTxt = hours + "小时" + minutes + "分钟" + "后";
      } else if (deadTime < oneHour && deadTime > 0) {
        deadTimeTxt = parseInt(deadTime / 60) + "分钟" + "后";
      } else {
        deadTimeTxt = "";
      }

      this.deadLine = deadTimeTxt;
    }
  }
};
</script>
<style>
.production-img img {
  width: 375px;
  vertical-align: top;
}
</style>
<style scoped>
.preview-app {
  width: 375px;
  height: 600px;
}

.mint-swipe-indicator {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 100%;
  background: gray;
  margin: 0 3px;
  opacity: 1 !important;
}

.mint-swipe-indicator.is-active {
  background: #fbc607 !important;
}

.my-swipe {
  height: 375px;
  color: #fff;
  font-size: 30px;
  text-align: center;
  cursor: pointer;
}

.my-swipe img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-title {
  font-size: 18px;
  font-weight: 400;
}

.title-info {
  padding: 20px;
  background-color: #fff;
}

.title-tip {
  color: #9f9da1;
  font-size: 14px;
  margin-top: 10px;
}

.preview-footer {
  background-color: #fbcd04;
  height: 50px;
  line-height: 50px;
  position: fixed;
  top: 650px;
  left: 50%;
  margin-left: -188px;
  width: 375px;
  text-align: center;
  font-size: 18px;
  z-index: 1000;
}

.apply-nums {
  width: 100%;
  display: table;
  background-color: #fff;
}

.apply-nums li {
  display: table-cell;
  text-align: center;
  padding: 10px;
}

.txt-gray {
  color: #9f9da1;
}

.txt-s12 {
  font-size: 12px;
}

.txt-s22 {
  font-size: 22px;
}

.txt-bold {
  font-weight: bold;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.el-icon-arrow-right {
  line-height: 20px;
}

.apply-area {
  background-color: #fff;
  padding: 0 10px;
}

.apply-rules {
  border-bottom: 1px dashed #9f9da1;
  padding: 10px;
  line-height: 20px;
}

.steps {
  list-style: none;
  padding: 10px;
  background-color: #fff;
  height: 50px;
}

.steps li {
  width: 25%;
  float: left;
}

.txt-orange {
  color: #fbcd04;
}

i {
  font-style: normal;
}

.txt-s10 {
  font-size: 10px;
}

.step-text {
  display: inline-block;
  width: 40px;
  height: 40px;
}

.guige-area {
  padding: 10px 20px;
  height: 40px;
  background-color: #fafafa;
}

.guige-area img {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  float: left;
}

.guige-area i {
  display: inline-block;
  line-height: 32px;
  /* float: left; */
  margin-left: 20px;
}

.light-spot {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #fff;
}

.spots {
  list-style: none;
  width: 100%;
}

.spot-title {
  line-height: 48px;
}

.spots li {
  border-top: 1px dashed #cccccc;
  line-height: 48px;
}

.details-title {
  margin-top: 20px;
  line-height: 66px;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  background-color: #fff;
}

.left-i,
.right-i {
  display: inline-block;
  font-size: 10px;
  width: 100px;
  line-height: 66px;
}

.left-i {
  text-align: right;
}

.right-i {
  text-align: left;
}
</style>

<template>
  <div class="activity-info">
    <h2 style="color: #000;" class="title">活动详情</h2>
    <p><span class="info-title">主题: </span>{{ data.topic }}</p>
    <p><span class="info-title">简介: </span>{{ data.idea }}</p>
    <p><span class="info-title">团队要求: </span>{{ data.demand }}</p>
    <p>
      <span class="info-title">测评渠道: </span
      ><img
        style="width:20px; height: 20px; vertical-align: -3px;"
        :src="data.channel_url"
        alt=""
      />
    </p>
    <p><span class="info-title">测评形式: </span>{{ data.channel }}</p>
  </div>
</template>

<script>
export default {
  props: ["value"],
  name: "ActivityInfo", // 审核活动信息
  data() {
    return {
      data: {},
      review_ways: ["图文", "视频", "不限形式"],
      channels: ["微博", "小红书", "美拍", "B站", "微淘", "微信公众号", "抖音"]
    };
  },
  mounted() {
    this.data = this.value;
  }
};
</script>

<style lang="less" scoped>
.activity-info {
  color: #9f9da1;
  padding: 20px;
  p {
    line-height: 40px;
  }
  .info-title {
    color: #000;
    font-size: 14px;
  }
  .title {
    line-height: 40px;
    font-size: 20px;
    text-align: center;
  }
}
</style>

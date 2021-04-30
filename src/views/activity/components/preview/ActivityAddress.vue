<template>
  <div class="activity-address">
    <div class="detail-info">
      <div
        v-for="(item, index) in previewData.shop_address_list"
        :key="index"
        class="area-info"
      >
        <p class="area-info-title">地址{{ ++index }}：</p>
        <div class="iconfont">
          <p>&#xe626; {{ item.name || "未填写" }}</p>
          <p>&#xe61f; {{ item.tel || "未填写" }}</p>
          <p>
            &#xe602; {{ item.pname }} {{ item.cityname }} {{ item.adname }}
            {{ item.address }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value"],
  name: "ActivityAddress", //活动预览 地址
  data() {
    return {
      previewData: {}
    };
  },
  mounted() {
    this.previewData = this.value;
  }
};
</script>

<style scoped>
.area-info-title {
  border-bottom: 1px solid #ececec;
  line-height: 30px;
}

.area-info {
  border-bottom: 1px solid #ececec;
}
</style>

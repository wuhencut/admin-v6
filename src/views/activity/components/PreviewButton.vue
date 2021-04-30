<template>
  <div class="page">
    <el-button @click="preview" type="text">预览</el-button>

    <activity-preview
      :tabs="tabs"
      @close="close"
      :showPreview="showPreview"
      v-if="showPreview"
    >
      <template slot="first">
        <preview-app v-model="campaign_data"></preview-app>
      </template>
      <template slot="second">
        <activity-detail v-model="campaign_data"></activity-detail>
      </template>
      <template slot="third">
        <activity-address v-model="campaign_data"></activity-address>
      </template>
    </activity-preview>
  </div>
</template>
<script>
import ActivityPreview from "./preview/ActivityPreview.vue";
import PreviewApp from "./preview/PreviewApp";
import ActivityDetail from "./preview/ActivityDetail";
import ActivityAddress from "./preview/ActivityAddress";
export default {
  name: "PreviewButton",
  components: {
    ActivityPreview,
    PreviewApp,
    ActivityDetail,
    ActivityAddress
  },
  props: {
    activityData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      showPreview: false, //是否展示预览
      campaign_data: "", //当前活动预览数据
      tabs: [
        {
          // 绑定至preview详情， tab用来显示点击的标签页
          label: "预览",
          name: "first"
        },
        {
          label: "详情",
          name: "second"
        },
        {
          label: "地址",
          name: "third" //
        }
      ]
    };
  },
  mounted() {},
  methods: {
    close() {
      this.showPreview = false;
      this.campaign_data = null;
    },
    //页面预览
    async preview() {
      let res = await this.$api.getPreviewData({
        campaign_id: this.activityData.campaign_id
      });
      if (res.error_code == 0) {
        this.campaign_data = res.data;
        if (
          this.campaign_data.shop_address_list &&
          this.campaign_data.shop_address_list.length > 0
        ) {
          this.tabs = [
            {
              label: "预览",
              name: "first"
            },
            {
              label: "详情",
              name: "second"
            },
            {
              label: "地址",
              name: "third"
            }
          ];
        }
      } else {
        return false;
      }
      this.showPreview = true;
    }
  }
};
</script>

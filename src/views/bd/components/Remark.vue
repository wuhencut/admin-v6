<template>
  <div class="page">
    <el-button @click="showRemark" type="text">备注</el-button>

    <!-- remark dialog -->
    <el-dialog
      :visible.sync="dialog"
      :close-on-click-modal="false"
      title="备注"
      append-to-body
    >
      <div class="remark-list">
        <div
          class="remark-item"
          v-for="(item, index) in remarkList"
          :key="index"
        >
          <p class="remark-title">
            时间：
            {{ moment(item.comment_time * 1000).format("YYYY-MM-DD HH:mm") }} /
            操作人: {{ allAdmin[item.admin_id] }}
          </p>
          <p class="remark-content">备注: {{ item.content }}</p>
        </div>
      </div>
      <div class="new-remark" v-if="isNewRemark">
        <el-input
          v-model="remark"
          placeholder="请填写您的备注"
          type="textarea"
          rows="5"
          maxlength="300"
        ></el-input>
      </div>
      <el-button @click="isNewRemark = true" class="add-btn" type="text">
        <i class="el-icon-circle-plus"></i> 新增备注
      </el-button>
      <div slot="footer">
        <el-button type="primary" @click="addSponsorRemark" :disabled="!remark"
          >提交保存</el-button
        >
        <el-button @click="dialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- / remark dialog -->
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "Remark",
  props: {
    sponsor_id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      moment: moment,
      isNewRemark: false,
      remark: "",
      dialog: false,
      remarkList: []
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  created() {},
  methods: {
    async showRemark() {
      this.remark = "";
      this.remarkList = [];
      // 获取商户备注
      let res = await this.$api.getSponsorRemark({
        sponsor_id: this.sponsor_id
      });
      if (res.error_code == 0) {
        this.remarkList = res.data.list || [];
        this.dialog = true;
      }
    },
    // 对商户添加备注
    async addSponsorRemark() {
      let res = await this.$api.addSponsorRemark({
        sponsor_id: this.sponsor_id,
        content: this.remark
      });
      if (res.error_code == 0) {
        this.$message.success("备注成功");
        this.showRemark();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.remark-list {
  overflow-y: scroll;
  max-height: 300px;
  .remark-item {
    border-bottom: 1px solid #dedede;
    padding: 10px 0;
    .remark-content {
      letter-spacing: 1px;
    }
    .remark-title {
      font-weight: bold;
    }
  }
}

.new-remark {
  padding-top: 10px;
}
</style>

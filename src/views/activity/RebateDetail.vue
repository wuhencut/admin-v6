<template>
  <div class="page">
    <div class="header">
      <span class="name">晒单返利活动 </span>
      活动id: {{ this.$route.query.rebate_id }} | 商家名:
      {{ campaignInfo.company_name }}
    </div>
    <el-row class="main" :gutter="10">
      <el-col :span="6">
        <p class="title">基础信息</p>
        <p>
          <span class="name">活动名称:</span> {{ campaignInfo.rebate_name }}
        </p>
        <div>
          <p class="name">
            晒单渠道: {{ rebateChannel[campaignInfo.channel_type] }}
          </p>
        </div>
        <p>
          <span class="name">活动时间:</span>
          {{
            campaignInfo.rebate_start_time > 0
              ? `${moment(campaignInfo.rebate_start_time * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}发布`
              : "-"
          }}
        </p>
      </el-col>
      <el-col :span="6">
        <p class="title">社媒返利</p>
        <p>
          <span class="name">社媒奖励:</span>
          {{
            `${campaignInfo.min_point / 100} ~ ${campaignInfo.max_point / 100}`
          }}映币/人
        </p>
        <div
          v-if="
            campaignInfo.channel_rebate_point &&
            campaignInfo.channel_rebate_point.length
          "
          class="channel-reward"
        >
          <span class="name">特殊价位: </span>
          <div class="channels">
            <p
              v-for="(item, index) in campaignInfo.channel_rebate_point"
              :key="index"
            >
              {{ $getPlatformName(item.channel_id) }}:
              {{ ` ${item.min_point / 100} ~ ${item.max_point / 100}` }}映币/人
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" v-if="campaignInfo.guangguang_point">
        <p class="title">逛逛返利</p>
        <p>
          <span class="name">逛逛奖励:</span>
          {{ campaignInfo.guangguang_point / 100 }}映币/人
        </p>
        <p v-if="campaignInfo.repurchase_limit > 0">
          <span class="name">复购限制:</span>
          {{ campaignInfo.repurchase_limit == 1 ? "商品SPU" : "规格SKU" }}
        </p>
      </el-col>
      <el-col :span="6">
        <p class="title">资金设置</p>
        <p v-if="campaignInfo.freeze_point > 0">
          <span class="name">活动预算:</span> 冻结{{
            campaignInfo.freeze_point / 100
          }}映币
        </p>
        <p>
          <span class="name">剩余预算:</span>
          {{ campaignInfo.remain_freeze_point / 100 }}映币
        </p>
      </el-col>
    </el-row>
    <p style="padding: 20px 0; font-size: 16px; font-weight: bold">活动商品</p>
    <el-table :data="goodsList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品头图" prop="cover">
        <template slot-scope="scope">
          <img width="50px" :src="scope.row.cover" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="商品名字" prop="title"></el-table-column>
      <el-table-column label="商品id" prop="production_id"></el-table-column>
      <el-table-column label="价格" prop="price">
        <template slot-scope="scope">
          {{
            scope.row.price.min == scope.row.price.max
              ? "￥" + scope.row.price.min / 100
              : `￥${scope.row.price.min / 100} ~ ￥${
                  scope.row.price.max / 100
                }`
          }}
        </template>
      </el-table-column>
      <el-table-column label="总库存" prop="stock_num"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkClick(scope.row.production_id)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--page-->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        :page-size="search.page_size"
        :current-page="search.page_id"
        :total="total"
      ></el-pagination>
    </div>
    <!--/page-->
  </div>
</template>
<script>
import moment from "moment";
import env from "../../api/env";
export default {
  name: "RebateDetail",
  data() {
    return {
      moment: moment,
      total: 0,
      search: {
        rebate_id: this.$route.query.rebate_id,
        page_id: 1,
        page_size: 10
      },
      rebateChannel: {
        1: "社媒",
        2: "逛逛",
        "1,2": "逛逛+社媒"
      },
      campaignInfo: {
        channel_rebate_point: []
      },
      goodsList: []
    };
  },
  created() {
    this.queryCampaignInfo();
    this.queryList();
  },
  methods: {
    async queryCampaignInfo() {
      let res = await this.$api.getRebateCampaignDetail({
        rebate_id: this.search.rebate_id
      });
      if (res.error_code == 0) {
        this.campaignInfo = res.data || {};
      }
    },
    async queryList() {
      let res = await this.$api.getRebateGoodsList(this.search);
      if (res.error_code == 0) {
        this.goodsList = res.data.list || [];
        this.total = res.data.total || 0;
      }
    },
    //分页
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    // 查看点击
    checkClick(id) {
      let head, url;
      if (env != "online") {
        head = "shop-test";
      } else {
        head = "shop";
      }
      url = "http://" + head + ".ingtube.com/productDetail?production_id=" + id;
      window.open(url, "_blank");
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  .main {
    .title {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 10px;
    }
    .channel-reward {
      display: flex;
      .channels {
        padding-left: 4px;
      }
    }
    .name {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .header {
    padding-bottom: 20px;
    .name {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>

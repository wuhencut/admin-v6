<template>
  <!--活动列表评分-->
  <div class="activity-list">
    <!--search-->
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.campaign_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动ID"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.campaign_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="品牌名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <admin-select
          class="search-inp"
          @change="searchBtnClick"
          v-model="search.admin_id"
          isAll
        ></admin-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.ranked"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="全部"></el-option>
          <el-option :value="1" label="已评分"></el-option>
          <el-option :value="0" label="未评分"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtnClick" icon="el-icon-search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!--/search-->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="活动Id"
        prop="campaign_id"
        width="100"
      ></el-table-column>
      <el-table-column
        label="活动名称"
        prop="campaign_name"
        min-width="200"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        prop="production_name"
        min-width="150"
      ></el-table-column>
      <el-table-column label="活动时间" width="250">
        <template slot-scope="scope">
          <p>
            <span>{{
              moment(scope.row.start_time * 1000).format("YYYY年MM月DD")
            }}</span>
            -
            <span>{{
              moment(scope.row.end_time * 1000).format("YYYY年MM月DD")
            }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="品牌名称" prop="brand_name"></el-table-column>
      <el-table-column
        label="悬赏类型"
        width="150"
        prop="reward_type"
      ></el-table-column>
      <el-table-column label="是否已评分" width="100">
        <template slot-scope="scope">
          <p>
            <span>{{ scope.row.ranked == 1 ? "已评分" : "未评分" }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="
              $router.push({
                name: 'evaluataionList',
                query: { id: scope.row.campaign_id, isRank: scope.row.ranked }
              })
            "
            type="text"
            >评分排序
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--table-->
    <!--page-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        :total="count"
      >
      </el-pagination>
    </div>
    <!--/page-->
  </div>
</template>
<script>
import moment from "moment";
import AdminSelect from "../../components/AdminSelect";

export default {
  components: {
    AdminSelect
  },
  filters: {
    trim: val => {
      return val.trim();
    }
  },
  data() {
    return {
      moment: moment,
      search: {
        campaign_id: this.$route.query.id || "",
        campaign_name: this.$route.query.name || "",
        brand_name: this.$route.query.brand || "",
        ranked: parseInt(this.$route.query.ranked) || 0,
        page_id: parseInt(this.$route.query.page) || 1,
        page_size: 10,
        admin_id: "0"
      },
      list: [],
      count: 0
    };
  },
  mounted() {
    this.searchBtnClick();
  },
  methods: {
    //点击搜索按钮  输入框enter
    searchBtnClick() {
      this.search.page_id = 1;
      this.replaceUrl(); //切换url
      this.searchList();
    },
    //获取活动列表
    async searchList() {
      if (
        !/\d+/.test(this.search.campaign_id) &&
        this.search.campaign_id != ""
      ) {
        this.$message.error("活动id为数字");
        return;
      }
      let req = this.$initReq(this.search);
      let res = await this.$api.campaignList(req);
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      } else {
        this.list = [];
        this.count = 0;
      }
    },
    //路由更新
    replaceUrl() {
      this.$router.replace({
        name: "activityList",
        query: {
          id: this.search.campaign_id,
          name: this.search.campaign_name,
          brand: this.search.brand_name,
          page: this.search.page_id,
          ranked: this.search.ranked
        }
      });
    },
    //切换页面
    currentChange(val) {
      this.search.page_id = val;
      this.searchList();
      this.replaceUrl();
    }
  }
};
</script>
<style lang="less" scoped>
.activity-list {
  .pagination {
    text-align: center;
    padding: 30px 0;
  }
}
</style>

<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.production_name"
          placeholder="商品名称"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          placeholder="品牌"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.company_name"
          placeholder="企业名称"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.rebate_status"
          @change="searchBtnClick"
        >
          <el-option label="全部返利状态" :value="0"></el-option>
          <el-option label="无返利" :value="1"></el-option>
          <el-option label="有返利" :value="2"></el-option>
          <el-option label="只社媒返利" :value="3"></el-option>
          <el-option label="逛逛和社媒返利" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.order_by_param"
          @change="searchBtnClick"
          style="width: 170px"
        >
          <el-option label="按上架时间从新到旧" :value="0"></el-option>
          <el-option label="按客单价从低到高" :value="1"></el-option>
          <el-option label="按返利力度从大到小" :value="2"></el-option>
          <el-option label="按成交量从高到低" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="search-time"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="成交时间"
          end-placeholder="成交时间"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <div class="block">
          <span class="demonstration"></span>
          <lazy-cascader
            v-model="search.category"
            filterable
            :props="defaultParams"
            placeholder="请选择要搜索的类目"
          ></lazy-cascader>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBtnClick"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品 | 商品id" min-width="200">
        <template slot-scope="scope">
          <div style="display: flex">
            <img style="width: 50px; height: 50px" :src="scope.row.cover" alt />
            <p
              style="
                display: flex;
                align-items: center;
                padding-left: 10px;
                flex: 1;
              "
            >
              {{ scope.row.title }}
            </p>
          </div>
          <br />
          <p>商品id: {{ scope.row.production_id || "-" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="客单价" prop="price" width="160px">
      </el-table-column>
      <el-table-column label="库存" prop="stock_num"></el-table-column>
      <el-table-column label="上架时间" width="125">
        <template slot-scope="scope">{{
          moment(scope.row.in_stock_time * 1000).format("YYYY/MM/DD HH:mm")
        }}</template>
      </el-table-column>
      <el-table-column label="品牌" prop="brand_name"></el-table-column>
      <el-table-column label="企业名称" prop="company_name"></el-table-column>
      <el-table-column label="类目" min-width="200">
        <template slot-scope="scope">
          <p>
            {{ (scope.row.category || []).join("-") }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="成交量" prop="deal_finish_num"></el-table-column>
      <el-table-column
        label="返利状态"
        prop="rebate_status"
        width="125"
      ></el-table-column>
      <el-table-column label="当前返利金额" prop="rebate_point" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.rebate_status == '社媒返利'">
            <p
              v-for="(item, index) in (scope.row.rebate_point || []).filter(
                (item) => {
                  return item.source !== '逛逛';
                }
              )"
              :key="index"
            >
              {{ item.source }}: {{ (item.min_point / 100).toFixed(2) }}-{{
                (item.max_point / 100).toFixed(2)
              }}
            </p>
            <p>
              社媒渠道:{{ (scope.row.media_min_point / 100).toFixed(2) }}-{{
                (scope.row.media_max_point / 100).toFixed(2)
              }}
            </p>
          </div>
          <div v-if="scope.row.rebate_status == '逛逛和社媒返利'">
            <p v-for="(item, index) in scope.row.rebate_point" :key="index">
              {{ item.source }}: {{ (item.min_point / 100).toFixed(2) }}-{{
                (item.max_point / 100).toFixed(2)
              }}
            </p>
            <p>
              社媒渠道:{{ (scope.row.media_min_point / 100).toFixed(2) }}-{{
                (scope.row.media_max_point / 100).toFixed(2)
              }}
            </p>
          </div>
          <div v-if="scope.row.rebate_status == '无返利'">-</div>
        </template>
      </el-table-column>
      <el-table-column label="当前返利活动" width="125">
        <template slot-scope="scope">
          <div v-if="scope.row.rebate_status == '无返利'">
            <p>-</p>
          </div>
          <div v-else>
            <p>{{ scope.row.rebate_name }}</p>
            <p>ID:{{ scope.row.rebate_id }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template>
          <el-tag>已上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="authList.indexOf('id106') > -1"
            @click="checkClick(scope.row.production_id)"
            >查看</el-button
          >
          <el-button
            type="text"
            v-if="authList.indexOf('id107') > -1"
            @click="goTopClick(scope.row.production_id)"
            >置顶</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination
      class="pagination"
      background
      :total="total"
      @current-change="currentChange"
      :current-page="search.page_id"
      :page-size="20"
      layout="total, prev, pager, next, jumper"
      v-show="total > 0"
    ></el-pagination>
  </div>
</template>
<script>
import moment from "moment";
import env from "../../api/env";
import LazyCascader from "lazy-cascader";
export default {
  components: {
    LazyCascader
  },
  name: "GoodsManage",
  data() {
    return {
      id: 1,
      timer: "",
      options: [],
      data: [],
      value: [],
      defaultParams: {
        checkStrictly: true,
        lazySearch: this.lazySearch,
        lazyLoad: this.lazyLoad,
        label: "name",
        value: "id",
        leaf: "leaf"
      },
      categoryname: [],
      moment: moment,
      date: "",
      disabled: false,
      search: {
        category: [],
        deal_start_time: 0,
        deal_end_time: 0,
        rebate_status: 0,
        order_by_param: 0,
        production_name: "",
        brand_name: "",
        company_name: "",
        page_id: 1, // 页码
        page_size: 20
      },
      total: 10,
      list: [],
      count: 1
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    date(val) {
      if (val == null) {
        this.search.deal_start_time = 0;
        this.search.deal_end_time = 0;
      } else {
        this.search.deal_start_time = moment(val[0]).unix();
        this.search.deal_end_time = moment(val[1]).unix();
      }
      this.searchBtnClick();
    }
  },
  mounted() {
    this.queryList();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    searchReset() {
      this.search = {
        category: [],
        deal_start_time: 0,
        deal_end_time: 0,
        rebate_status: 0,
        order_by_param: 0,
        production_name: "",
        brand_name: "",
        company_name: "",
        page_id: 1, // 页码
        page_size: 20
      };
      this.queryList();
    },
    async lazySearch(queryString, callback) {
      if (queryString === "") {
        callback([]);
        return false;
      }
      let res = await this.$api.getCategorySearchList({ name: queryString });
      if (res.error_code == 0) {
        const list = res.data.category || [];
        callback(list);
      }
    },
    async lazyLoad(nodeValue, resolve) {
      let req = {
        parent_id: nodeValue
      };
      let res = await this.$api.listBackCategory(req);
      if (res.error_code == 0 && Array.isArray(res.data.list)) {
        let list = res.data.list || [];
        let nodes = list.map((item) => ({
          ...item,
          leaf: item.child_count <= 0 ? true : false
        }));
        resolve(nodes);
      }
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
    },
    // 审核
    async verifyClick(id, type) {
      let txt = type == 0 ? "通过" : "拒绝";
      this.$confirm("确定" + txt + "该商品？", txt, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let res = await this.$api.productionVerify({
          production_id: id,
          status: type
        });
        if (res.error_code == 0) {
          this.$message.success("处理成功");
          this.queryList();
        }
      });
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getProductionList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data ? res.data.list : [];
        this.total = res.data ? res.data.count : 0;
      }
    },
    async goTopClick(id) {
      let res = await this.$api.goTopProduct({ production_id: id });
      if (res.error_code == 0) {
        this.$message.success("置顶成功");
        this.queryList();
      } else {
        this.$message.error("置顶失败");
        this.queryList();
      }
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    }
  }
};
</script>
<style lang="less" scoped></style>

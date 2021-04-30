<template>
  <div class="page-deposit-list">
    <!-- search -->
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.cp_nickname"
          placeholder="博主名称"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          placeholder="品牌名称"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item style="width: 150px;">
        <el-select
          class="search-inp"
          v-model="search.campaign_type"
          placeholder="活动类型"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="全部活动类型"></el-option>
          <el-option :value="0" label="试用活动"></el-option>
          <el-option :value="4" label="折扣活动"></el-option>
          <el-option :value="3" label="团队活动"></el-option>
          <el-option :value="2" label="达人探店"></el-option>
          <el-option :value="1" label="秒杀活动"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 150px;">
        <el-select
          class="search-inp"
          v-model="search.freeze_status"
          placeholder="活动状态"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="全部押金状态"></el-option>
          <!--<el-option :value="0" label="未冻结">未冻结</el-option>-->
          <el-option :value="1" label="已冻结">已冻结</el-option>
          <el-option :value="2" label="已解冻">已解冻</el-option>
          <!--<el-option :value="3" label="待扣除">待扣除</el-option>-->
          <el-option :value="4" label="已扣除">已扣除</el-option>
          <el-option :value="5" label="扣除失败">扣除失败</el-option>
          <el-option :value="6" label="已违约">已违约</el-option>
          <!--<el-option :value="7" label="授权取消">授权取消</el-option>-->
          <el-option :value="8" label="授权超时,订单关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 150px;">
        <admin-select
          class="search-inp"
          v-model="search.admin_id"
          placeholder="运营"
          is-all
        ></admin-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="searchBtnClick"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!-- search -->
    <!-- table -->
    <el-table :data="list" size="mini">
      <el-table-column type="index"></el-table-column>
      <el-table-column width="160" label="ID|品牌">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.order_id }}</p>
            <p>{{ scope.row.brand_name }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="商品|规格">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.production_title }}</p>
            <p>规格: {{ scope.row.specification }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="公司|申请人|申请时间|开始时间">
        <template slot-scope="scope">
          <div>
            <p>公司:{{ scope.row.company_name }}</p>
            <p>申请人:{{ scope.row.cp_nickname }}</p>
            <p>
              申请时间:
              {{
                moment(scope.row.order_create_time * 1000).format(
                  "YYYY-MM-DD HH:mm"
                )
              }}
            </p>
            <p>
              开始时间:
              {{
                moment(scope.row.campaign_start_time * 1000).format(
                  "YYYY-MM-DD HH:mm"
                )
              }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额|方式">
        <template slot-scope="scope">
          <div>
            <p>金额: {{ scope.row.freeze_amount }}</p>
            <p>方式: {{ scope.row.auth_type }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="押金状态">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.freeze_status == 0">未冻结</span>
            <span v-if="scope.row.freeze_status == 1">已冻结</span>
            <span v-if="scope.row.freeze_status == 2">已解冻</span>
            <span v-if="scope.row.freeze_status == 3">待扣除</span>
            <span v-if="scope.row.freeze_status == 4">已扣除</span>
            <span v-if="scope.row.freeze_status == 5">扣除失败</span>
            <span v-if="scope.row.freeze_status == 6">已违约</span>
            <span v-if="scope.row.freeze_status == 7">授权取消</span>
            <span v-if="scope.row.freeze_status == 8">授权超时,订单关闭</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="100" label="剩余天数">
        <template slot-scope="scope">
          <div>{{ getDays(scope.row.remain_time) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <p
            v-if="
              scope.row.freeze_status == 5 && authList.indexOf('id105') > -1
            "
          >
            <el-button type="text" @click="unFreezeOrder(scope.row.order_id)"
              >履约</el-button
            >
            <el-button type="text" @click="freezeOrder(scope.row.order_id)"
              >违约</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!-- table -->
    <!-- pagination -->
    <div class="pagination" v-if="total">
      <el-pagination
        background
        :total="total"
        @current-change="currentChange"
        :current-page="search.page_id"
      ></el-pagination>
    </div>
    <!-- pagination -->
  </div>
</template>
<script>
import AdminSelect from "../../components/AdminSelect";
import moment from "moment";

export default {
  components: {
    AdminSelect
  },
  data() {
    return {
      moment: moment,
      search: {
        page_id: 1,
        page_size: 10,
        cp_nickname: "", // 博主昵称
        campaign_type: -1, // '' 全部活动 0为普通活动，2为线下探店活动, 3为团队活动'
        freeze_status: -1, // 押金状态 0:未冻结 1:已冻结 2:已解冻 3:待扣除 4:已扣除 5:扣除失败 6:已违约 7:授权已取消 8:授权超时,订单关闭'
        admin_id: "0", //运营id
        brand_name: "" // 品牌名
      },
      list: [],
      total: 0
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    "search.admin_id"() {
      this.searchBtnClick();
    }
  },
  mounted() {
    this.getFreezeList();
  },
  methods: {
    async unFreezeOrder(order_id) {
      this.$confirm("确定执行[履约]？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: " 取消",
        type: "warning"
      }).then(async () => {
        let res = await this.$api.unFreezeOrder({ order_id });
        if (res.error_code == 0) {
          this.$message.success("处理成功");
          this.getFreezeList();
        }
      });
    },
    async freezeOrder(order_id) {
      this.$confirm("确定执行[违约]？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let res = await this.$api.freezeOrder({ order_id });
        if (res.error_code == 0) {
          this.$message.success("处理成功");
          this.getFreezeList();
        }
      });
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.getFreezeList();
    },
    async getFreezeList() {
      let res = await this.$api.getFreezeList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.orders;
        this.total = res.data.count;
      }
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.getFreezeList();
    },
    getDays(sec) {
      let hour = 60 * 60,
        day = 24 * hour;
      let leftDay, leftHour; // 剩余天数，小数
      if (sec > day) {
        leftDay = parseInt(sec / day);
        leftHour = parseInt((sec - leftDay * day) / hour) + 1;
        return leftDay + "天" + leftHour + "小时";
      } else if (sec > 0 && sec < day) {
        leftHour = parseInt(sec / hour) + 1;
        return leftHour + "小时";
      } else {
        return "截止";
      }
    }
  }
};
</script>

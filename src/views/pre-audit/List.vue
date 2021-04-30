<template>
  <div class="page-pre-audit">
    <el-form inline>
      <el-form-item>
        <el-input
          placeholder="订单编号"
          v-model.trim="search.order_id"
          @keyup.enter.native="searchList"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="博主昵称"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchList"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.check_status" @change="searchList">
          <el-option label="初审状态" value></el-option>
          <el-option label="未通过" value="AppraisalReject"></el-option>
          <el-option label="已通过" value="AppraisalPass"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDate"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        label="审核编号"
        prop="appraisal_id"
        width="140"
      ></el-table-column>
      <el-table-column label="测评问题">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.content.basic">
              <p><strong>基础问题：</strong></p>
              <p v-for="(item, index) in scope.row.content.basic" :key="index">
                {{ item }}
              </p>
            </div>
            <div v-if="scope.row.content.image">
              <p><strong>图片问题：</strong></p>
              <p v-for="(item, index) in scope.row.content.image" :key="index">
                {{ item }}
              </p>
            </div>
            <div v-if="scope.row.content.video">
              <p><strong>视频问题：</strong></p>
              <p v-for="(item, index) in scope.row.content.video" :key="index">
                {{ item }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="brand_name"></el-table-column>
      <el-table-column width="150" label="订单编号 | 博主昵称">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.order_id }}</p>
            <p>{{ scope.row.cp_nickname }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="初审状态" width="100">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.check_status == 'AppraisalReject'"
              >未通过</span
            >
            <span v-if="scope.row.check_status == 'OnAnalysis'">审核中</span>
            <span v-if="scope.row.check_status == 'AppraisalPass'">已通过</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="150">
        <template slot-scope="scope">
          <div>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="测评链接">
        <template slot-scope="scope">
          <div>
            <a class="link" target="_blank" :href="scope.row.appraisal_url">{{
              scope.row.appraisal_url
            }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="detailBtnClick(scope.row)"
            >订单详情</el-button
          >
          <!-- <el-button type="text" v-if="scope.row.check_status != 'AppraisalPass'" @click="passBtnClick(scope.row)">通过</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!--page-->
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        :page-size="search.page_size"
        :current-page="search.page_id"
        :total="count"
      ></el-pagination>
    </div>
    <!--/page-->
    <el-dialog title="订单详情" :visible.sync="detailVisible" width="800">
      <!-- 订单详情 -->
      <order-detail :order="order"></order-detail>
      <p style="padding: 10px 0; font-size: 16px;">变更记录</p>
      <el-table :data="changeRecords">
        <el-table-column label="时间">
          <template slot-scope="scope">
            <p>
              {{
                moment(scope.row.change_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="备注" prop="content"></el-table-column>
        <el-table-column label="操作人" prop="operator_name"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import OrderDetail from "../../components/OrderDetail";
export default {
  components: {
    OrderDetail
  },
  data() {
    return {
      moment: moment,
      date: null,
      search: {
        order_id: "", //订单编号
        cp_nickname: "", //博主昵称
        check_status: "", //初审状态
        start_time: 0, //提交时间范围起
        end_time: 0, //提交时间范围始
        page_id: 1, //开始页
        page_size: 10 //每页条数
      },
      list: [],
      count: 0,
      detailVisible: false,
      order: {
        // 订单详情
        quote_info: {},
        reward: {
          type: 1,
          form: {},
          rank: {}
        }
      },
      changeRecords: []
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    //搜索
    searchList() {
      this.search.page_id = 1;
      this.getList();
    },
    //请求列表
    async getList() {
      let res = await this.$api.preCheckList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.count = res.data.count || 0;
      } else {
        this.list = [];
        this.count = 0;
      }
    },
    //切换日期
    changeDate(date) {
      if (date !== null) {
        this.search.start_time = moment(date[0] + " 00:00:00").unix();
        this.search.end_time = moment(date[1] + " 23:59:59").unix();
      } else {
        this.search.start_time = 0;
        this.search.end_time = 0;
      }
      this.searchList();
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.getList();
    },
    // 获取详情
    async getDetail(order_id) {
      let res = await this.$api.orderDetail({ order_id: order_id });
      if (res.error_code == 0) {
        this.order = res.data || {};
      } else {
        this.order = null;
      }
    },
    // 获取订单变更记录
    async getChangeRecord(order_id) {
      let res = await this.$api.orderHistoty({ order_id: order_id });
      if (res.error_code == 0) {
        this.changeRecords = res.data || [];
      } else {
        this.changeRecords = null;
      }
    },
    //获取订单详情
    async detailBtnClick(item) {
      await this.getDetail(item.order_id);
      await this.getChangeRecord(item.order_id);
      if (this.order && this.changeRecords) {
        this.detailVisible = true;
      } else {
        this.$message.error("系统出错,请重试");
      }
    },
    //点击通过按钮
    async passBtnClick(item) {
      let req = {
        appraisal_id: item.appraisal_id
      };
      let res = await this.$api.preCheckCerify(req);
      if (res.error_code == 0) {
        this.getList();
      }
    }
  }
};
</script>
<style lang="less">
.link {
  white-space: nowrap;
}
</style>

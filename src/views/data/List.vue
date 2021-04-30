<template>
  <div class="page-data-list">
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
        <el-select v-model="search.channel" @change="searchList">
          <el-option label="全部" :value="''"></el-option>
          <el-option label="微博" :value="'1'"></el-option>
          <el-option label="小红书" :value="'2'"></el-option>
          <el-option label="抖音" :value="'7'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.type" @change="searchList">
          <el-option label="测评形式" value></el-option>
          <el-option label="正式测评" :value="'AppraisalFormal'"></el-option>
          <el-option label="追加测评" :value="'AppraisalAppend'"></el-option>
          <el-option label="工单测评" :value="'AppraisalTicket'"></el-option>
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
    <!--  -->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="订单编号｜博主昵称" width="160">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.order_id }}</p>
            <p>{{ scope.row.cp_nickname }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="测评渠道">
        <template slot-scope="scope">
          <div v-if="scope.row.channel != 0">
            {{ getPlatformName(scope.row.channel) }}
          </div>
          <div v-else>暂无渠道</div>
        </template>
      </el-table-column>
      <el-table-column label="测评链接">
        <template slot-scope="scope">
          <div>
            <a class="link" :href="scope.row.appraisal_url">{{
              scope.row.appraisal_url
            }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="测评形式">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 'AppraisalFormal'">正式测评</div>
          <div v-if="scope.row.type == 'AppraisalAppend'">追加测评</div>
          <div v-if="scope.row.type == 'AppraisalTicket'">工单测评</div>
          <div></div>
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
      <el-table-column label="阅读量/播放量" prop="interaction_num">
      </el-table-column>
      <el-table-column label="测评截图">
        <template slot-scope="scope">
          <div>
            <el-button
              type="text"
              @click="LookpicBtn(scope.row.interaction_num_image_url)"
              >查看截图</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看截图 -->
    <el-dialog :visible.sync="detailVisible" width="30%">
      <div class="imgDiv">
        <img :src="this.url" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看截图 -->
    <!-- page -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="currentChange"
        :page-size="search.page_size"
        :current-page="search.page_id"
        :total="count"
      >
      </el-pagination>
    </div>
    <!-- page -->
  </div>
</template>

<script>
import { getPlatformName } from "../../utils/platform";
import moment from "moment";

export default {
  data() {
    return {
      moment: moment,
      date: null,
      search: {
        order_id: "", //订单id
        cp_id: "", //博主id
        cp_nickname: "", //博主昵称
        type: "AppraisalFormal", //
        page_id: 1, //开始页
        start_time: 0, //截图上传时间开始时间
        end_time: 0, //截图上传时间结束时
        page_size: 10, //每页条数
        channel: "" //全部的话传空
      },
      list: [],
      count: 0,
      url: "", //截图的图片路径
      detailVisible: false,
      order: {} //订单详情
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    getPlatformName: getPlatformName,
    //搜索
    searchList() {
      this.search.page_id = 1;
      this.getList();
    },

    async getList() {
      let res = await this.$api.shareOrderList(this.$initReq(this.search));
      if (res.error_code == 0) {
        (this.list = res.data.orders || []), (this.count = res.data.count || 0);
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
    LookpicBtn(item) {
      this.detailVisible = true;
      this.url = item;
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.imgDiv img {
  width: 100%;
  height: auto;
}
.link {
  white-space: nowrap;
}
</style>

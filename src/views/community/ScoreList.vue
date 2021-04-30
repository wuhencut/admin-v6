<template>
  <div class="bamanage-list">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="映兔昵称"
          v-model.trim="search.nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          maxlength="19"
          placeholder="映兔ID"
          v-model.trim="search.ba_id"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="手机号"
          v-model.trim="search.phone"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="微信号"
          v-model.trim="search.wx"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item label="统计月度">
        <el-date-picker
          v-model="search.month"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="searchBtnClick"
          :clearable="true"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtnClick" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button @click="refreshBtnClick" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="映兔昵称" prop="nickname"></el-table-column>
      <el-table-column label="映兔ID" prop="ba_id"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="微信号" prop="wx"></el-table-column>
      <el-table-column label="任务分" prop="total_score"></el-table-column>
      <el-table-column label="统计月度" prop="month"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <p>
            <el-button
              v-if="authList.indexOf('id114') > -1"
              type="text"
              @click="detailClick(scope.row)"
              >查看详情</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 外层page -->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="10"
        :total="count"
      ></el-pagination>
    </div>
    <!-- 外层page -->
    <!-- 查看详情dialog -->
    <el-dialog title="查看详情" :visible.sync="detailDialog" width="850px">
      <el-form label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="映兔昵称：" prop="nikename">
              <span>{{ topdetail.nickname }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="映兔ID：">
              <span>{{ topdetail.ba_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前任务分：">
              <span>{{ topdetail.total_score }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <div style="position:relative;width:100%;height:100px;">
              <div
                style="width:90%;height:100px;position:absolute;left:0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        box-shadow:0px 0px  4px 2px #CCCCCC;
        "
              >
                <div class="message border">
                  <span class="span">分享商品数</span>
                  <p class="p">{{ topdetail.share_num }}件商品</p>
                </div>
                <div class="message border">
                  <span class="span">链接点击量</span>
                  <p class="p">
                    {{
                      topdetail.weapp_click_num + topdetail.code_click_num
                    }}次点击
                  </p>
                </div>
                <div class="message">
                  <span class="span">转化订单数</span>
                  <p class="p">
                    {{
                      topdetail.weapp_conversion_num +
                        topdetail.code_conversion_num
                    }}笔成交
                  </p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- table -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table :data="taskList" style="margin-top:30px">
              <el-table-column label="任务分类型" prop="score_type">
                <template slot-scope="scope">
                  <p v-if="scope.row.score_type == 1">每日好物分享</p>
                  <p v-if="scope.row.score_type == 2">粉丝购买</p>
                </template>
              </el-table-column>
              <el-table-column
                label="分享商品名称"
                prop="production_name"
              ></el-table-column>
              <el-table-column label="任务分变化" prop="score"
                ><template slot-scope="scope">
                  +{{ scope.row.score }}
                </template></el-table-column
              >
              <el-table-column label="时间" prop="create_time">
                <template slot-scope="scope">
                  {{
                    moment(scope.row.create_time * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  }}
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination" v-if="this.innercount > 0">
              <el-pagination
                background
                style="float:right"
                small
                layout="total,prev, pager, next"
                @current-change="innercurrentChange"
                :current-page="this.page_id"
                :page-size="5"
                :total="innercount"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      detailDialog: false,
      list: [],
      innercount: 0,
      count: 0,
      taskList: [],
      topdetail: "",
      id: "",
      month: "",
      page_id: 1,
      search: {
        ba_id: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        phone: "",
        month: "",
        wx: ""
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    // this.initSearchMonth();
    this.queryList();
  },
  methods: {
    // initSearchMonth() {
    //   this.search.month = moment()
    //     .startOf("month")
    //     .format("YYYY-MM");
    // },
    async queryList() {
      let res = await this.$api.getStatisticsList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //查看详情
    detailClick(item) {
      this.id = item.ba_id;
      this.month = item.month;
      this.page_id = 1;
      this.detailDialog = true;
      this.getScoreTop();
      this.getScoreBottom();
    },
    //任务分上半部分列表
    async getScoreTop() {
      let req = {
        ba_id: this.id,
        month: this.month
      };
      let res = await this.$api.getDetailTopList(req);
      if (res.error_code == 0) {
        this.topdetail = res.data;
      }
    },
    //任务分下半部分列表
    async getScoreBottom() {
      let req = {
        ba_id: this.id,
        page_id: this.page_id,
        page_size: 5,
        month: this.month
      };
      let res = await this.$api.getDetailMonthList(req);
      if (res.error_code == 0) {
        this.taskList = res.data.list;
        this.innercount = res.data.count;
      }
    },
    //重置
    refreshBtnClick() {
      this.search = {
        ba_id: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        phone: "",
        month: "",
        wx: ""
      };
      this.searchBtnClick();
    },
    innercurrentChange(current) {
      this.page_id = current;
      this.getScoreBottom();
    },
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
.message {
  width: 33.2%;
  height: 60px;
  float: left;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.span {
  color: #cccccc;
}
.border {
  border-right: 1px solid #dbdbdb;
}
.p {
  font-size: 20px;
  margin-top: 5px;
}
</style>

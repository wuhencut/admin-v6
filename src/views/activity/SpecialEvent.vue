<template>
  <div class="spacial-list">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.topic_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动编号"
          maxlength="19"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.topic_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动专题"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.tab_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="专题Tab"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="活动id"
          maxlength="19"
          v-model.trim="search.campaign_id"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="活动名称"
          v-model.trim="search.campaign_name"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="品牌名称"
          v-model.trim="search.brand_name"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.recommend_level"
          @change="searchBtnClick"
        >
          <el-option label="推荐排序" :value="0"></el-option>
          <el-option label="高" :value="1"></el-option>
          <el-option label="中" :value="2"></el-option>
          <el-option label="低" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.recommend_status"
          @change="searchBtnClick"
        >
          <el-option label="推荐状态" :value="0"></el-option>
          <el-option label="未开始" :value="1"></el-option>
          <el-option label="报名中" :value="2"></el-option>
          <el-option label="已结束" :value="3"></el-option>
          <el-option label="已撤销" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="search-time"
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="活动开始日期"
          end-placeholder="活动开始日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtnClick" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button @click="refreshBtnClick" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
      <p>
        <el-button type="primary" icon="el-icon-plus" @click="edit(false)"
          >添加</el-button
        >
      </p>
    </el-form>
    <!-- table -->
    <el-table :data="list" style="margin-top:15px">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="活动编号" prop="topic_id"></el-table-column>
      <el-table-column
        label="活动专题"
        prop="topic_name"
        min-width="120px"
      ></el-table-column>
      <el-table-column label="专题Tab" prop="tab_name"></el-table-column>
      <el-table-column label="活动id" prop="campaign_id"></el-table-column>
      <el-table-column label="活动名称" prop="campaign_name"></el-table-column>
      <el-table-column label="品牌名称" prop="brand_name"></el-table-column>
      <el-table-column label="活动时间" prop="campaign_time">
        <template slot-scope="scope">
          <p>
            {{ moment(scope.row.campaign_time * 1000).format("YYYY-MM-DD") }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="推荐排序" prop="recommend_level">
        <template slot-scope="scope">
          <p v-if="scope.row.recommend_level == 1">高</p>
          <p v-if="scope.row.recommend_level == 2">中</p>
          <p v-if="scope.row.recommend_level == 3">低</p>
        </template>
      </el-table-column>
      <el-table-column label="推荐状态" prop="recommend_status">
        <template slot-scope="scope">
          <p v-if="scope.row.recommend_status == 1">未开始</p>
          <p v-if="scope.row.recommend_status == 2">报名中</p>
          <p v-if="scope.row.recommend_status == 3">已结束</p>
          <p v-if="scope.row.recommend_status == 4">已撤销</p>
        </template>
      </el-table-column>
      <el-table-column label="创建人-创建时间" min-width="150">
        <template slot-scope="scope">
          <p v-if="scope.row.creator_id == 0">admin</p>
          <p v-else>{{ allAdmin[scope.row.creator_id] }}</p>
          <p>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100">
        <template slot-scope="scope">
          <p>
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="scope.row.recommend_status !== 4"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="moveOut(scope.row)"
              v-if="scope.row.recommend_status !== 4"
              >移出</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!--page-->
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
    <!--/page-->
    <!-- 添加推荐活动dialog -->
    <el-dialog
      title="添加/编辑推荐活动"
      :visible.sync="activityDialog"
      width="800px"
    >
      <el-form label-width="100px" :model="addParams" ref="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动ID:" prop="campaign_id">
              <el-input
                style="width:200px;"
                v-model.trim="addParams.campaign_id"
                @blur="getCampaignName"
                @keydown.native="keydown($event)"
                placeholder="请输入"
                maxlength="19"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名称">
              <el-input
                style="width:200px;"
                v-model="campaign_name"
                disabled
                placeholder="自动填入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="推荐专题:" prop="topic_id">
              <el-select
                v-model="addParams.topic_id"
                style="width:200px"
                placeholder="请选择"
                @change="getCampaignTab()"
                value-key="id"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in campaign_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专题Tab" prop="tab_name">
              <el-select
                v-model="addParams.tab_name"
                style="width:200px"
                placeholder="请选择"
                :disabled="tabdisabled"
              >
                <el-option
                  v-for="(item, index) in tab_list"
                  :key="index"
                  :value="item.name"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="推荐排序:" prop="recommend_level">
              <el-select
                v-model="addParams.recommend_level"
                style="width:200px"
                placeholder="请选择"
              >
                <el-option :value="1" label="高"></el-option>
                <el-option :value="2" label="中"></el-option>
                <el-option :value="3" label="低"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activityDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 撤销dialog -->
    <el-dialog :visible.sync="cancelDg" width="300px">
      <p>
        <img
          src="../../../static/img/icon-chexiao.png"
          alt=""
          style="vertical-align: text-bottom;"
        /><span style="margin-left:10px">确定移出该活动推荐？</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDg = false">取 消</el-button>
        <el-button type="primary" @click="cancelConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 撤销dialog -->
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      date: "",
      campaign_name: "",
      campaign_list: "", //聚合活动列表
      tab_list: "", //专题Tab列表
      isNew: false,
      disabled: false,
      list: [],
      activityDialog: false,
      tabdisabled: false,
      cancelDg: false,
      item: "", //撤销传递数据
      params: "", //编辑弹框传递数据
      count: 0, //记录总条数
      search: {
        topic_id: "",
        topic_name: "",
        tab_name: "",
        campaign_id: "",
        campaign_name: "",
        recommend_level: 0, //推荐排序 1:高 2:中 :3 :低  0：默认
        brand_name: "",
        recommend_status: 0, //推荐状态:0:默认 1:未开始 2:报名中 3:已结束 3:已撤销
        start_time: "",
        end_time: "",
        page_id: 1,
        page_size: 10
      },
      addParams: {},
      rules: {
        campaign_id: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "blur"
          }
        ],
        topic_id: [
          {
            required: true,
            message: "请选择推荐专题",
            trigger: "change"
          }
        ],
        // tab_name: [
        //   {
        //     required: true,
        //     message: "请选择专题Tab",
        //     trigger: "change"
        //   }
        // ],
        recommend_level: [
          {
            required: true,
            message: "请选择推荐排序",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  watch: {
    date(val) {
      if (val == null) {
        this.search.start_time = 0;
        this.search.end_time = 0;
      } else {
        this.search.start_time = moment(val[0]).unix();
        this.search.end_time = moment(val[1]).unix();
      }
      this.searchBtnClick();
    },
    "addParams.campaign_id"() {
      if (this.isNew == true) {
        this.campaign_name = "";
      }
    }
  },
  mounted() {
    this.listCate();
  },
  methods: {
    //防止输入空格
    keydown(event) {
      if (event.keyCode == 32) {
        event.returnValue = false;
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.listCate();
    },
    refreshBtnClick() {
      this.search = {
        topic_id: "",
        topic_name: "",
        tab_name: "",
        campaign_id: "",
        campaign_name: "",
        recommend_level: 0, //推荐排序 1:高 2:中 :3 :低  0：默认
        brand_name: "",
        recommend_status: 0, //推荐状态:0:默认 1:未开始 2:报名中 3:已结束 3:已撤销
        start_time: 0,
        end_time: 0,
        page_id: 1,
        page_size: 10
      };
      this.date = null;
      this.searchBtnClick();
    },
    async listCate() {
      if (this.search.topic_id) {
        this.search.topic_id = Number(this.search.topic_id);
      }
      let res = await this.$api.getAggregationEventList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
    },
    //获取私享活动名称
    async getCampaignName() {
      let req = {
        campaign_id: this.addParams.campaign_id
      };
      let res = await this.$api.getCampaignDetail(req);
      if (res.error_code == 0) {
        this.campaign_name = res.data.title;
      }
    },
    //获取聚合活动列表
    async getEventList() {
      let req = {
        page_id: 1,
        page_size: 10
      };
      let res = await this.$api.getCampaignList(req);
      if (res.error_code == 0) {
        this.campaign_list = res.data.list;
      }
    },
    //获取专题Tab
    async getCampaignTab() {
      let req;
      req = {
        id: this.addParams.topic_id
      };

      let res = await this.$api.getTabList(req);
      if (res.error_code == 0) {
        this.tab_list = res.data.topic_tab || [];
        if (this.tab_list.length == "") {
          this.tabdisabled = true;
        } else {
          this.tabdisabled = false;
        }
        if (this.addParams.tab_name != "" && this.isNew == false) {
          let index = this.tab_list.findIndex(item => {
            return item.name == this.addParams.tab_name;
          });
          if (index < 0) {
            this.addParams.tab_name = "";
          }
        } else {
          this.addParams.tab_name = "";
        }
      }
    },
    edit(data) {
      this.activityDialog = true;
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.getEventList();
      if (!data) {
        this.isNew = true;
        this.disabled = false;
        this.addParams = {
          tab_name: ""
        };
      } else {
        this.isNew = false;
        this.disabled = true;
        this.params = JSON.parse(JSON.stringify(data));
        this.campaign_name = this.params.campaign_name;
        this.addParams = {
          campaign_id: this.params.campaign_id,
          topic_id: this.params.topic_id,
          recommend_level: this.params.recommend_level,
          tab_name: this.params.tab_name
        };
        this.getCampaignTab();
      }
      //添加活动
    },
    async confirmClick() {
      this.$refs.form.validate(async ok => {
        if (ok) {
          if (this.isNew) {
            this.eventAdd();
          } else {
            this.eventModify();
          }
        } else {
          return false;
        }
      });
    },
    async eventAdd() {
      let params = { ...this.addParams };
      params.topic_id = params.topic_id.toString();
      if (this.tabdisabled == false && this.addParams.tab_name == "") {
        this.$message.error("请选择专题Tab！");
        return false;
      }
      let res = await this.$api.addNewEvent(params);
      if (res.error_code == 0) {
        this.$message.success("添加成功");
        this.listCate();
      }
      this.activityDialog = false;
    },
    async eventModify() {
      let params = { ...this.addParams };
      let res = await this.$api.modifyEvent(params);
      if (res.error_code == 0) {
        this.$message.success("修改成功");
        this.listCate();
      }
      this.activityDialog = false;
    },
    //移除活动
    moveOut(item) {
      this.item = item;
      this.cancelDg = true;
    },
    async cancelConfirm() {
      let req = {
        campaign_id: this.item.campaign_id,
        topic_id: this.item.topic_id
      };
      let res = await this.$api.removeEvent(req);
      if (res.error_code == 0) {
        this.$message.success("撤销成功！");
        this.cancelDg = false;
        this.listCate();
      }
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.listCate();
    }
  }
};
</script>

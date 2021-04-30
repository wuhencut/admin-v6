<template>
  <div class="check-list">
    <el-button type="text" @click="getDetail">查看</el-button>
    <el-dialog
      title="活动详情"
      :visible.sync="dialog"
      :close-on-click-modal="true"
      append-to-body
      width="800px"
    >
      <el-form
        width="90px"
        label-position="left"
        :rules="rules"
        ref="checkItem"
        :model="checkItem"
      >
        <p style="font-size:16px;margin-bottom:15px"><b>基础信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动ID：" label-width="100px">
              <el-input disabled v-model="checkItem.campaign_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属公司：" label-width="90px">
              <el-input disabled v-model="checkItem.company_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="活动名称："
              label-width="100px"
              prop="campaign_name"
            >
              <el-input
                v-model="checkItem.campaign_name"
                :disabled="refuse"
                maxlength="24"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" label-width="100px">
              <el-input disabled v-model="checkItem.production_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="活动规格"
              label-width="100px"
              prop="production_specs"
            >
              <el-select
                v-model="checkItem.production_specs"
                value-key="id"
                collapse-tags
                multiple
                :disabled="refuse || process"
              >
                <el-option
                  v-for="item in specslist"
                  :key="item.id"
                  :label="(item.name == null ? [] : item.name).join('-')"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货地限制" label-width="100px">
              <el-input
                v-if="checkItem.address_limit"
                disabled
                value="已开启"
              ></el-input>
              <el-input v-else disabled value="未开启"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div
              v-if="
                checkItem.address_limit &&
                  checkItem.address_limit_info.area != ''
              "
            >
              <el-popover placement="right" width="80" trigger="click">
                <div v-if="checkItem.address_limit_info.area_type == 2">
                  <h3>不可收货地址为:</h3>
                  {{ checkItem.address_limit_info.area.join(",") }}
                </div>
                <div v-if="checkItem.address_limit_info.area_type == 1">
                  <h3>可收货地址为:</h3>
                  {{ checkItem.address_limit_info.area.join(",") }}
                </div>
                <el-button slot="reference">查看</el-button>
              </el-popover>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动预算" label-width="100px" prop="budget">
              <el-input
                style="width:150px"
                v-model="budget"
                :disabled="refuse || process"
              ></el-input>
              <span style="margin-left:10px">映币</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定制名额" label-width="100px">
              <el-input-number
                :min="1"
                :max="20"
                v-model="checkItem.total_num"
                @change="addNum"
                :disabled="refuse || process"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最晚交稿" label-width="100px">
              <el-date-picker
                :disabled="refuse || process"
                :picker-options="pickerOptionsD"
                v-model="deadline"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
              <p style="font-size:8px;color:#909399">
                （最晚交稿最早为报名截止时间后5天，请注意）
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合集形式" label-width="100px">
              <el-select
                v-model="checkItem.is_collection"
                :disabled="refuse || process"
              >
                <el-option label="不限" :value="1"></el-option>
                <el-option label="非合集" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="定制渠道" label-width="100px">
              <p>
                <span>视频</span>
                <el-checkbox-group
                  v-model="videoList"
                  style="display:inline-block;margin-left:10px"
                  :disabled="refuse || process"
                >
                  <el-checkbox :label="'2'">小红书</el-checkbox>
                  <el-checkbox :label="'4'">B站</el-checkbox>
                  <el-checkbox :label="'7'">抖音</el-checkbox>
                  <el-checkbox :label="'1'">微博</el-checkbox>
                  <el-checkbox :label="'8'">快手</el-checkbox>
                  <el-checkbox :label="'5'">微淘</el-checkbox>
                </el-checkbox-group>
              </p>
              <p>
                <span>图文</span>
                <el-checkbox-group
                  v-model="picList"
                  style="display:inline-block;margin-left:10px"
                  :disabled="refuse || process"
                >
                  <el-checkbox :label="'2'">小红书</el-checkbox>
                  <el-checkbox :label="'1'">微博</el-checkbox>
                  <el-checkbox :label="'5'">微淘</el-checkbox>
                </el-checkbox-group>
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <p style="font-size:16px;margin-bottom:15px"><b>活动审核</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="提名总额：" label-width="90px">
              <el-input-number
                :disabled="refuse || finish"
                :value="checkItem.team_quota"
                :min="this.checkItem.total_num"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名截止：" label-width="90px" prop="end_time">
              <el-date-picker
                :disabled="refuse || process"
                :picker-options="pickerOptions"
                type="date"
                placeholder="选择日期"
                v-model="end_time"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="定制Brief：" label-width="100px" prop="brief">
              <upload-file
                v-model="checkItem.brief"
                :disabled="refuse"
              ></upload-file>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="定制指引："
              label-width="100px"
              prop="payee_id"
            >
              <guide-list
                v-model="checkItem.review_guide"
                :disabled="refuse"
              ></guide-list>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">关 闭</el-button>
        <el-button
          type="primary"
          @click="saveBtnClick"
          v-if="authList.indexOf('id1611715033') > -1"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import GuideList from "../../../components/GuideList";
import uploadFile from "../../../components/UploadFile";
import moment from "moment";
export default {
  components: {
    GuideList,
    uploadFile
  },
  props: {
    campaign: {
      type: Object
    }
  },
  data() {
    return {
      moment: moment,
      dialog: false,
      refuse: false,
      process: false,
      finish: false,
      deadline: "",
      end_time: "",
      budget: "",
      rules: {
        campaign_name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "blur"
          }
        ],
        production_specs: [
          {
            required: true,
            message: "请选择活动规格",
            trigger: "change"
          }
        ],
        budget: [
          {
            required: true,
            message: "请输入活动预算",
            trigger: "blur"
          }
        ]
      },
      videoList: [], //视频渠道列表
      picList: [], //图文渠道列表
      specslist: [], //活动规格列表
      pickerOptionsD: {},
      checkItem: {
        campaign_id: "",
        campaign_name: "",
        production_id: "",
        production_name: "",
        production_image: "",
        production_specs: [], //活动规格
        company_name: "",
        total_num: 0,
        deadline: "", //最晚交稿时间
        review_guide: [], //定制指引
        budget: "", //活动预算
        brief: "", //brief文件链接
        form_source: [], //定制渠道
        is_collection: 1, //测评内容 1、合集 2、非合集
        team_quota: 0, //	提名名额
        end_time: "" //报名截止
      },
      source: [
        {
          id: "1",
          name: "微博"
        },
        {
          id: "2",
          name: "小红书"
        },
        {
          id: "4",
          name: "B站"
        },
        {
          id: "5",
          name: "微淘"
        },
        {
          id: "7",
          name: "抖音"
        },
        {
          id: "8",
          name: "快手"
        }
      ]
    };
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate(time) {
          return (
            time.getTime() - 1 * 24 * 60 * 60 * 1000 <
            new Date(new Date().toLocaleDateString()).getTime()
          );
        }
      };
    },
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    end_time() {
      let end_time = new Date(this.end_time).getTime();
      this.pickerOptionsD = {
        disabledDate(time) {
          return time.getTime() < end_time + 4 * 24 * 60 * 60 * 1000;
        }
      };
    }
  },
  methods: {
    addNum() {
      this.checkItem.team_quota = this.checkItem.total_num * 3;
    },
    //获取详情
    async getDetail() {
      this.refuse = false;
      this.process = false;
      this.finish = false;
      if (this.campaign.status == 400) {
        //审核拒绝
        this.refuse = true;
      }
      if (this.campaign.status == 300) {
        //提名中
        this.process = true;
      }
      if (
        this.campaign.status == 500 ||
        this.campaign.status == 501 ||
        this.campaign.status == 502
      ) {
        //报名结束 活动关闭 活动结束
        this.process = true;
        this.finish = true;
      }
      let res = await this.$api.getActivityDetail({
        campaign_id: this.campaign.campaign_id
      });
      if (res.error_code == 0) {
        this.checkItem = res.data || {};
        this.dialog = true;
      }
      if (res.data.team_quota == 0) {
        this.checkItem.team_quota = this.checkItem.total_num * 3;
      } else {
        this.team_quota == res.data.team_quota;
      }
      this.checkItem.review_guide = this.checkItem.review_guide || [];
      this.getProduct();
      this.deadline = moment(this.checkItem.deadline * 1000).format(
        "YYYY-MM-DD HH:mm"
      );
      if (this.checkItem.apply_end_time > 0) {
        this.end_time = moment(this.checkItem.apply_end_time * 1000).format(
          "YYYY-MM-DD HH:mm"
        );
      } else {
        this.end_time = moment(
          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
        ).format("YYYY-MM-DD HH:mm");
      }

      this.budget = this.checkItem.budget / 100;
      this.checkItem.form_source.map(item => {
        if (item.form == "1") {
          this.videoList = item.source;
        }
        if (item.form == "2") {
          this.picList = item.source;
        }
      });
    },
    //获取商品的规格
    async getProduct() {
      let res = await this.$api.getProductionSpecList({
        production_id: this.checkItem.production_id
      });
      if (res.error_code == 0) {
        this.specslist = res.data.list || [];
      }
    },
    //保存
    async saveBtnClick() {
      let time = new Date(this.deadline).setHours(23, 59, 59) / 1000;
      this.checkItem.deadline = time;
      let time2 = new Date(this.end_time).setHours(23, 59, 59) / 1000;
      this.checkItem.apply_end_time = time2;
      this.checkItem.budget = this.budget * 100;
      if (this.checkItem.deadline == "") {
        this.$message.error("请选择最晚交稿日期");
        return false;
      }
      if (this.checkItem.apply_end_time == "") {
        this.$message.error("请选择报名截止日期");
        return false;
      }
      if (this.checkItem.budget < 1000000) {
        this.$message.error("活动预算不少于1W");
        return false;
      }
      this.getCustom();
      if (this.checkItem.form_source.length == 0) {
        this.$message.error("视频渠道和图文渠道必须选择一个！");
        return false;
      }
      if (this.checkItem.brief == "") {
        this.$message.error("请上传定制Brief文件！");
        return false;
      }
      for (let i = 0; i < this.checkItem.review_guide.length; i++) {
        if (this.checkItem.review_guide[i] == "") {
          this.$message.error("请补全定制指引！");
          return false;
        }
      }
      if (
        this.checkItem.deadline - 5 * 24 * 60 * 60 <
        this.checkItem.apply_end_time
      ) {
        this.$message.error(
          "最晚交稿时间一定要晚于报名时间5天之后！请重新选择"
        );
        return false;
      }
      this.$refs["checkItem"].validate(async vaild => {
        if (vaild) {
          let res = await this.$api.updateActivityDetail(this.checkItem);
          if (res.error_code == 0) {
            this.$message.success("修改成功！");
            this.$emit("recall");
            this.dialog = false;
          }
        } else {
          return false;
        }
      });
    },
    getCustom() {
      let obj1 = {};
      let obj2 = {};
      if (this.videoList.length !== 0) {
        obj1 = {
          form: 1,
          source: this.videoList
        };
      }
      if (this.picList.length !== 0) {
        obj2 = {
          form: 2,
          source: this.picList
        };
      }
      this.checkItem.form_source = [obj1, obj2];
      for (let i = 0; i < this.checkItem.form_source.length; i++) {
        if (
          this.checkItem.form_source[i] == null ||
          this.checkItem.form_source[i] == "" ||
          JSON.stringify(this.checkItem.form_source[i]) == "{}"
        ) {
          this.checkItem.form_source.splice(i, 1);
          i = i - 1;
        }
      }
      return this.checkItem.form_source;
    }
  }
};
</script>

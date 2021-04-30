<template>
  <div class="operateSchedule-page">
    <div class="schedule-list">
      <div class="schedule-title">
        <p class="title">运营计划列表</p>
        <el-button type="text" icon="el-icon-plus" @click="createSchedule"
          >新建计划</el-button
        >
      </div>
      <div class="list">
        <div
          class="item"
          :key="item.id"
          v-for="item in list"
          :class="{ 'item-active': item.id == schedule.id }"
          @click="itemClick(item)"
        >
          <div style="display:flex;justify-content:space-between">
            <h2 class="item-title">
              {{ item.name }}
            </h2>
            <el-tag v-if="item.status == 2" type="danger">已关闭</el-tag>
          </div>
          <p class="p">
            创建时间：{{
              moment(item.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
          <p class="p">参与次数：{{ item.show_num }}</p>
          <p class="p">目标完成率：{{ item.complete_num }}</p>
        </div>
      </div>
      <!-- pagination -->
      <div class="pagination" v-if="total > 0">
        <el-pagination
          :page-size="this.page_size"
          :current-page="this.page_id"
          small
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
        ></el-pagination>
      </div>
      <div v-else style="padding: 30px; color: gray; text-align: center;">
        暂无数据
      </div>
      <!-- pagination -->
    </div>
    <div class="schedule-editor">
      <el-form label-width="90px" :model="schedule" ref="schedule">
        <div class="content">
          <el-form-item label-width="0">
            <div class="right-title">计划名称</div>
          </el-form-item>
          <el-form-item label-width="0">
            <el-input
              v-model="schedule.name"
              :disabled="isNew == false"
            ></el-input>
          </el-form-item>
        </div>
        <div class="content" style="margin-top:10px">
          <el-form-item label-width="0">
            <div class="right-title">触发条件</div>
          </el-form-item>
          <el-form-item label="触发事件" prop="event_type">
            <el-select v-model="schedule.event_type" :disabled="isNew == false">
              <el-option label="浏览页面" :value="1"></el-option>
              <el-option label="完成支付" :value="2"></el-option>
              <el-option label="完成晒单" :value="3"></el-option>
              <el-option label="完成测评" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="页面路径" v-show="schedule.event_type === 1">
            <el-input
              v-model="schedule.event_value"
              style="width:400px"
              :disabled="isNew == false"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品ID"
            v-show="
              schedule.event_type === 2 ||
                schedule.event_type === 3 ||
                schedule.event_type === 4
            "
          >
            <el-input
              v-model="schedule.event_value"
              style="width:200px"
              :disabled="isNew == false"
            ></el-input>
          </el-form-item>
          <el-form-item label="起止时间">
            <el-date-picker
              v-model="sdate"
              type="date"
              placeholder="选择日期"
              style="width:150px"
              :picker-options="startTimeOptions"
              :clearable="false"
              :disabled="isNew == false"
            >
            </el-date-picker>
            <el-time-picker
              v-model="stime"
              placeholder="选择时间"
              value-format="HH:mm"
              style="width:150px;margin-left:10px"
              :picker-options="timeOptions1"
              :disabled="isNew == false"
            >
            </el-time-picker>
            至
            <el-date-picker
              v-model="edate"
              type="date"
              placeholder="选择日期"
              style="width:150px"
              :picker-options="endTimeOptions"
              :clearable="false"
              :disabled="isNew == false"
            >
            </el-date-picker>
            <el-time-picker
              v-model="etime"
              placeholder="选择时间"
              value-format="HH:mm"
              style="width:150px;margin-left:10px"
              :picker-options="timeOptions2"
              :disabled="isNew == false"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="参与限制">
            <el-radio v-model="radio" :label="1" :disabled="isNew == false"
              >参与1次</el-radio
            >
          </el-form-item>
        </div>
        <div class="content" style="margin-top:10px">
          <el-form-item label-width="0">
            <div class="right-title">受众配置</div>
          </el-form-item>
          <el-form-item label="适用人群">
            <el-radio-group
              v-model="type"
              :disabled="isNew == false"
              @change="changeTagType"
            >
              <el-radio :label="false">所有用户</el-radio>
              <el-radio :label="true">用户标签适用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <!-- 标签选择部分 -->
            <el-cascader
              v-model="tagArray"
              v-show="type === true"
              :disabled="isNew == false"
              :options="options"
              :props="props"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
        </div>

        <div class="content" style="margin-top:10px">
          <el-form-item label-width="0">
            <div class="right-title">触达配置</div>
          </el-form-item>
          <el-form-item label="弹窗模版">
            <el-radio v-model="radio" :label="1" :disabled="isNew == false"
              >纯图片弹窗</el-radio
            >
          </el-form-item>
          <el-form-item label="图片">
            <upload-img
              v-model="schedule.img"
              :disabled="isNew == false"
            ></upload-img>
            <p>
              图片尺寸支比例为宽高 310 x
              430px的图片，格式支持png、jpeg、jpg、gif，大小不超过500KB
            </p>
          </el-form-item>
          <el-form-item label="点击跳转">
            <el-radio-group
              v-model="schedule.jump_type"
              :disabled="isNew == false"
            >
              <el-radio :label="1">页面路径</el-radio>
              <el-radio :label="2">H5链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="schedule.jump_path"
              :disabled="isNew == false"
            ></el-input>
          </el-form-item>
        </div>
        <div class="content" style="margin-top:10px">
          <el-form-item label-width="0">
            <div class="right-title">目标设置</div>
          </el-form-item>
          <el-form-item>
            <p>用户完成点击跳转则认为完成目标</p>
          </el-form-item>
        </div>
        <div class="content" style="margin-top:10px">
          <el-form-item>
            <el-button
              style="float:right;width:100px"
              type="primary"
              v-if="!schedule.id"
              @click="createPlan"
              >保存</el-button
            >
            <el-button
              style="float:right;width:100px"
              type="primary"
              v-if="schedule.id && this.status == 1"
              @click="closePlan"
              >关闭</el-button
            >
            <el-button
              style="float:right;width:100px"
              type="primary"
              v-if="schedule.id && this.status == 2"
              disabled
              >已关闭</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import UploadImg from "../../components/UploadImg";
import moment from "moment";
export default {
  components: {
    UploadImg
  },
  data() {
    return {
      props: {
        multiple: true,
        value: "id",
        label: "name"
      },
      total: 0,
      plan_id: "",
      moment: moment,
      isNew: false,
      status: "",
      sdate: "",
      stime: "",
      edate: "",
      etime: "",
      radio: 1,
      type: false,
      page_id: 1,
      page_size: 10,
      tagArray: [],
      options: [],
      timeOptions1: {},
      timeOptions2: {},
      list: [],
      scheduleTemplt: {
        name: "",
        event_type: "",
        event_value: "",
        start_time: 0,
        end_time: 0,
        tag_limit: {
          is_limit: true,
          value: []
        },
        img: "",
        jump_type: 1,
        jump_path: ""
      },
      schedule: {
        name: "",
        event_type: "",
        event_value: "",
        start_time: 0,
        end_time: 0,
        tag_limit: {
          is_limit: true,
          value: []
        },
        img: "",
        jump_type: 1,
        jump_path: ""
      }
    };
  },
  computed: {
    startTimeOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;
        }
      };
    },
    endTimeOptions() {
      let start_time = new Date(this.sdate).getTime();
      return {
        disabledDate(time) {
          return time.getTime() < start_time;
        }
      };
    }
  },
  watch: {
    sdate(val) {
      if (this.isNew === true) {
        this.edate = "";
        this.etime = "";
        let timeStart = moment(new Date().getTime()).format("HH:mm:ss");
        if (
          this.sdate &&
          this.sdate.getTime() >
            new Date(new Date().toLocaleDateString()).getTime() //获取本地时间当天的零点
        ) {
          timeStart = "00:00:00";
        }
        if (val) {
          this.timeOptions1 = {
            selectableRange: timeStart + "- 23:59:00"
          };
        }
      }
    },
    edate(val) {
      if (this.isNew === true) {
        let timeStart = moment(new Date().getTime()).format("HH:mm:ss");
        if (
          this.edate &&
          this.edate.getTime() >
            new Date(new Date().toLocaleDateString()).getTime() //获取本地时间当天的零点
        ) {
          timeStart = "00:00:00";
        }
        if (val) {
          this.timeOptions2 = {
            selectableRange: timeStart + "- 23:59:00"
          };
        }
      }
    }
  },
  mounted() {
    this.getTagTreeList();
    this.queryList();
    this.createSchedule();
  },
  methods: {
    async queryList() {
      let req = {
        page_id: this.page_id,
        page_size: this.page_size
      };
      let res = await this.$api.getOperationPlanList(req);
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.total = res.data.count;
      }
    },
    //获取标签树
    async getTagTreeList() {
      let req = {
        tag_type: [10, 9, 8, 3, 7, 1, 2]
      };
      let res = await this.$api.userLabelList(req);
      if (res.error_code == 0) {
        res.data.tag_list = JSON.parse(
          JSON.stringify(res.data.tag_list).replace(/son_list/g, "children") //因为树组件的数据要求子节点的节点名为children
        );
        this.options = res.data.tag_list;
      }
    },
    changeTagType() {
      this.tagArray = [];
    },
    async createPlan() {
      let validate = this.validateForm();
      if (validate) {
        //计算起止时间戳
        if (this.sdate) {
          let countTemp = this.timeTransform(this.stime);
          this.schedule.start_time = (this.sdate.getTime() + countTemp) / 1000;
        }
        if (this.edate) {
          let countTemp = this.timeTransform(this.etime);
          this.schedule.end_time = (this.edate.getTime() + countTemp) / 1000;
        }
        if (this.schedule.end_time < this.schedule.start_time) {
          this.$message.error("你选择的结束时间早于开始时间，请重新选择");
          return false;
        }
        this.schedule.tag_limit = {
          is_limit: this.type,
          value: this.tagArray
        };
        let res = await this.$api.createOperationPlan(this.schedule);
        if (res.error_code == 0) {
          this.$message.success("新建成功");
          this.createSchedule();
          this.queryList();
        }
      }
    },
    async closePlan() {
      let req = {
        id: this.plan_id
      };
      let res = await this.$api.closeOperationPlan(req);
      if (res.error_code == 0) {
        this.$message.success("关闭成功");
        this.createSchedule();
        this.queryList();
        this.close = true;
      }
    },
    validateForm() {
      if (this.schedule.name === "") {
        this.$message.error("请输入计划名称");
        return false;
      }
      if (this.schedule.event_type === "") {
        this.$message.error("请选择触发事件");
        return false;
      }
      if (this.schedule.event_value === "") {
        this.$message.error("请填写页面路径或商品名称");
        return false;
      }
      if (
        this.sdate === "" ||
        this.stime === "" ||
        this.edate === "" ||
        this.etime === ""
      ) {
        this.$message.error("请选择起止时间");
        return false;
      }
      if (this.type == true) {
        if (this.tagArray.length == 0) {
          this.$message.error("请选择适用人群的限制");
          return false;
        }
      }
      if (this.schedule.img == "") {
        this.$message.error("请选择图片");
        return false;
      }
      if (this.schedule.jump_path == "") {
        this.$message.error("请填写跳转链接");
        return false;
      }
      return true;
    },
    //切换页码
    currentChange(val) {
      this.page_id = val;
      this.queryList();
    },
    timeTransform(t) {
      let timeTemp;
      if (typeof t == "string") {
        let arr = t.split(":");
        timeTemp = arr[0] * 60 * 60 * 1000 + arr[1] * 60 * 1000;
      } else {
        timeTemp = t.getHours() * 60 * 60 * 1000 + t.getMinutes() * 60 * 1000;
      }
      return timeTemp;
    },
    //点击新建运营计划
    createSchedule() {
      this.isNew = true;
      this.edate = "";
      this.etime = "";
      this.sdate = "";
      this.stime = "";
      this.type = false;
      this.tagArray = [];
      this.schedule = { ...this.scheduleTemplt };
    },
    itemClick(item) {
      this.isNew = false;
      this.schedule = item;
      this.plan_id = item.id;
      this.status = item.status;
      this.type = item.tag_limit.is_limit;
      this.tagArray = item.tag_limit.value;
      this.sdate = moment(item.start_time * 1000).format("YYYY-MM-DD");
      this.stime = moment(item.start_time * 1000).format("HH:mm");
      this.edate = moment(item.end_time * 1000).format("YYYY-MM-DD");
      this.etime = moment(item.end_time * 1000).format("HH:mm");
    }
  }
};
</script>
<style lang="less" scoped>
.operateSchedule-page {
  min-width: 1000px;
  display: flex;
  .schedule-list {
    border-right: 1px solid #e6e6e6;
    width: 300px;
    background: #fff;
    .schedule-title {
      font-weight: bold;
      height: 40px;
      font-size: 18px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
    }
    > .list {
      > .item {
        padding: 10px;
        border-left: 4px solid #fff;
        border-bottom: 1px solid #e6e6e6;
        cursor: pointer;
        .p {
          margin-top: 5px;
        }
        .item-title {
          font-weight: bold;
          font-size: 16px;
        }
      }
      > .item-active {
        border-left: 4px solid #409eff;
      }
    }
  }
  > .schedule-editor {
    flex: 1;
    padding: 0 10px;
  }
  .content {
    padding: 15px 10px;
    background: white;
  }
  .right-title {
    width: 110px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding: 0 20px 0 0;
    box-sizing: border-box;
  }
}
</style>

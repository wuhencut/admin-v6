<template>
  <div class="page-notice">
    <div class="notice-list">
      <!-- title -->
      <div class="list-title">
        <div class="list-title-text">APP推送列表</div>
        <el-button @click="createBtnClick" type="text" icon="el-icon-plus"
          >新增</el-button
        >
      </div>
      <!-- title -->
      <!-- list -->
      <div class="list">
        <div
          class="item"
          :key="item.id"
          :class="{ 'item-active': item.id == notice.id }"
          v-for="item in list"
          @click="itemClick(item)"
        >
          <h2 class="item-title">
            <span class="title">{{ item.title }} </span>
            <el-tag
              class="fr"
              v-if="item.push_status == 'canceled'"
              type="danger"
              >已撤销</el-tag
            >
            <el-tag
              class="fr"
              v-if="item.push_status == 'complete'"
              type="success"
              >已推送</el-tag
            >
            <el-tag class="fr" v-if="item.push_status == 'not_start'"
              >待推送</el-tag
            >
          </h2>
          <div style="color: gray; padding: 10px 0;">{{ item.desc }}</div>
          <p class="item-time">
            {{ moment(item.push_time * 1000).format("YYYY-MM-DD HH:mm") }}
          </p>
        </div>
      </div>
      <!-- list -->

      <!-- pagination -->
      <div class="pagination" v-if="total > 0">
        <el-pagination
          :page-size="search.page_size"
          :current-page="search.page_id"
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
    <div class="notice-editor">
      <el-form
        :disabled="notice.id != undefined"
        :model="notice"
        ref="noticeForm"
        :rules="noticeFormRules"
      >
        <el-form-item>
          <h2 style="font-size:20px;">
            <span v-show="notice.id == undefined">新增推送</span>
            <span v-show="notice.id != undefined">查看推送</span>
          </h2>
        </el-form-item>
        <el-form-item prop="desc">
          <div>
            推送任务描述 <span>{{ notice.desc.length }}/10</span>
          </div>
          <el-input v-model.trim="notice.desc" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="title">
          <div>
            主标题 <span>{{ notice.title.length }}/30</span>
          </div>
          <el-input
            type="textarea"
            v-model.trim="notice.title"
            :rows="3"
            :maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <div>
            消息内容 <span>{{ notice.content.length }}/400</span>
          </div>
          <el-input
            type="textarea"
            v-model.trim="notice.content"
            :rows="3"
            :maxlength="400"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            点击前往
            <el-radio-group
              @change="notice.link_content = ''"
              v-model="notice.link_type"
            >
              <el-radio label="none">无</el-radio>
              <el-radio label="url">链接</el-radio>
              <el-radio label="campaign">活动</el-radio>
              <el-radio label="production">商品</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          prop="link_content"
          v-if="notice.link_type == 'url'"
          :rules="{
            required: notice.link_type == 'link',
            message: '请输入跳转链接',
            trigger: 'blur'
          }"
        >
          <el-input
            v-if="!notice.id"
            v-model="notice.link_content"
            placeholder="请输入跳转链接"
          ></el-input>
          <a v-else target="_blank" :href="notice.url">{{ notice.url }}</a>
        </el-form-item>
        <el-form-item
          prop="link_content"
          v-if="notice.link_type == 'campaign'"
          :rules="{
            required: notice.link_type == 'campaign',
            message: '请输入活动id',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="notice.link_content"
            placeholder="请输入活动id"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="link_content"
          v-if="notice.link_type == 'production'"
          :rules="{
            required: notice.link_type == 'product',
            message: '请输入商品id',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="notice.link_content"
            placeholder="请输入商品id"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div>发送时间</div>
          <el-radio-group
            v-model="notice.push_type"
            @change="notice.push_time = ''"
          >
            <el-radio label="instant">即时推送</el-radio>
            <el-radio label="fixed">定时推送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="notice.push_type == 'fixed'">
          <el-date-picker
            v-model="date.day"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-time-picker
            v-model="date.time"
            :picker-options="timeOptions"
            placeholder="选择时间"
            value-format="HH:mm"
            :clearable="false"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!notice.id" type="primary" @click="submitClick">
            确认
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-if="notice.id && notice.push_status == 'not_start'"
          @click="cancelClick"
          type="danger"
          >撤销</el-button
        >
        <el-button
          v-if="notice.id"
          type="primary"
          style="float: right"
          @click="checkStatus"
          >查询推送状态</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "AppNotice",
  data() {
    return {
      total: 0,
      moment: moment,
      isNew: true,
      notice: {
        desc: "", // 任务描述
        title: "",
        content: "",
        link_type: "none", // none不跳转、url普通链接, production商品,campain活动
        link_content: "", // 根据 link_type 确定传什么值
        push_type: "instant", //instant立即推送,fixed定时推送
        push_time: "" //推送时间
      },
      pickerOptions: {},
      timeOptions: {},
      date: {
        day: "",
        time: ""
      },
      noticeTemplt: {
        desc: "", // 任务描述
        title: "",
        content: "",
        link_type: "none", // none不跳转、url普通链接, production商品,campain活动
        link_content: "", // 根据 link_type 确定传什么值
        push_type: "instant", //instant立即推送,fixed定时推送
        push_time: "" //推送时间
      },
      noticeFormRules: {
        desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      search: {
        //查询条件
        page_size: 5,
        page_id: 1
      },
      sendStatusObg: {
        not_start: "待推送",
        sending: "排队中",
        canceled: "已撤销",
        complete: "发送方成功",
        fail: "发送失败",
        unknown: "未知错误"
      },
      list: [] //列表
    };
  },
  created() {
    this.notice = { ...this.noticeTemplt };
    this.searchNotices();
  },
  watch: {
    "date.day"(val) {
      if (this.isNew == true) {
        let timeStart = moment(new Date().getTime()).format("HH:mm:ss");
        if (
          this.date.day.getTime() >
          new Date(new Date().toLocaleDateString()).getTime() //获取本地时间当天的零点
        ) {
          timeStart = "00:00:00";
        }
        if (val) {
          this.timeOptions = {
            selectableRange: timeStart + "- 23:59:00"
          };
        }
      }
    },
    "notice.push_type"(val) {
      //即时和定时切换的时候
      if (val == "fixed" && this.isNew == true) {
        //也是只有在添加的时候才监听
        this.date.day = new Date(new Date().toLocaleDateString()); //当下时间
        this.date.time = new Date(
          parseInt(new Date().getTime() / 60000) * 60000
        );
        this.pickerOptions = {
          disabledDate(time) {
            return (
              time.getTime() <
                new Date(new Date().toLocaleDateString()).getTime() ||
              time.getTime() >
                new Date(new Date().toLocaleDateString()).getTime() +
                  30 * 24 * 3600 * 1000 //限制1个月的范围
            );
          }
        };
      }
    }
  },
  methods: {
    // 查询友盟推送状态
    async checkStatus() {
      let res = await this.$api.getNoticeStatus({ id: this.notice.id });
      if (res.error_code == 0) {
        let ios = this.sendStatusObg[res.data.ios_status],
          android = this.sendStatusObg[res.data.android_status];
        this.$message.info(`iOS${ios}, Android${android}`);
      }
    },
    // 撤销推送
    async cancelClick() {
      this.$confirm("撤销后此条推送计划将被取消", "确认撤销?", {
        confirmButtonText: "确认",
        cancalButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let res = await this.$api.cancelAppNotice({ id: this.notice.id });
        if (res.error_code == 0) {
          this.$message.success("撤销成功");
          this.searchNotices();
        }
      });
    },
    // 更改 推送类型
    changeType(value) {
      if (value == "fixed") {
        let date = moment();
        this.start_date = date.format("YYYY-MM-DD");
        this.start_time = date.format("HH:mm");
      }
    },
    //点击新增按钮
    createBtnClick() {
      this.notice = { ...this.noticeTemplt };
      this.isNew = true;
      //清除表单验证
      this.$refs.noticeForm.clearValidate();
    },
    //点击确认按钮
    submitClick() {
      this.$refs.noticeForm.validate(async ok => {
        if (ok) {
          this.isNew = false;
          //及时推送
          if (this.notice.push_type == "instant") {
            this.notice.push_time = parseInt(new Date().getTime() / 1000);
          } else {
            if (this.date.day) {
              let timeTemp;
              // 选择时间后会变成 hh:ss的格式
              if (typeof this.date.time == "string") {
                let arr = this.date.time.split(":");
                timeTemp = arr[0] * 60 * 60 * 1000 + arr[1] * 60 * 1000;
              } else {
                timeTemp =
                  this.date.time.getHours() * 60 * 60 * 1000 +
                  this.date.time.getMinutes() * 60 * 1000;
              }
              this.notice.push_time =
                (this.date.day.getTime() + timeTemp) / 1000;
            }
          }
          let res = await this.$api.createAppNotice(this.notice);
          if (res.error_code == 0) {
            this.$message.success("创建成功");
            this.notice = { ...this.noticeTemplt };
            this.searchNotices();
          }
        } else {
          return false;
        }
      });
    },
    //获取消息列表
    async searchNotices() {
      let res = await this.$api.getAppNoticeList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      } else {
        this.list = [];
        this.total = 0;
      }
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.searchNotices();
    },
    //点击
    itemClick(item) {
      this.notice = item;
      this.isNew = false;
      this.date.day = moment(item.push_time * 1000).format("YYYY-MM-DD");
      this.date.time = moment(item.push_time * 1000).format("HH:mm");
      this.$refs.noticeForm.clearValidate();
    }
  }
};
</script>
<style lang="less" scoped>
.page-notice {
  min-width: 1000px;
  display: flex;
  background: #fff;
  .notice-list {
    width: 300px;
    border-right: 1px solid #e6e6e6;
    .list-title {
      padding: 10px;
      display: flex;
      border-bottom: 1px solid #eee;
      > .list-title-text {
        flex: 1;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #000;
      }
    }
    > .list {
      > .item {
        padding: 10px;
        border-left: 4px solid #fff;
        border-bottom: 1px solid #e6e6e6;
        cursor: pointer;
        > .item-title {
          color: #000;
          display: flex;
          .title {
            font-weight: bold;
            flex: 1;
          }
          .fr {
            float: right;
          }
        }
        > .item-time {
          text-align: right;
          color: #999;
        }
      }
      > .item-active {
        border-left: 4px solid #409eff;
      }
    }
    > .pagination {
      padding: 10px 5px;
    }
  }
  > .notice-editor {
    flex: 1;
    padding: 30px;
  }
}
</style>

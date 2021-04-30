<template>
  <div class="page">
    <el-button type="primary" icon="el-icon-plus" @click="edit(false)"
      >新增</el-button
    >
    <span style="color:grey;margin-left:10px"
      >新增或重新上线开屏，将顶掉当前开屏</span
    >
    <h1>当前开屏</h1>
    <el-table :data="havetail" style="margin-top: 10px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="开屏图">
        <template slot-scope="scope">
          <img
            class="banner"
            :src="scope.row.image"
            alt
            width="200"
            height="100"
          />
        </template>
      </el-table-column>
      <el-table-column label="上线时间">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.online_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p v-show="scope.row.status == 1">已上线</p>
          <p v-show="scope.row.status == 2">待上线</p>
          <p v-show="scope.row.status == 3">未上线</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <p>
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="removeBanner(scope.row.id)"
              >删除</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>

    <h1>未上线开屏</h1>
    <el-table :data="list" style="margin-top: 10px;" :show-header="false">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="开屏图">
        <template slot-scope="scope">
          <img
            class="banner"
            :src="scope.row.image"
            alt
            width="200"
            height="100"
          />
        </template>
      </el-table-column>
      <el-table-column label="上线时间">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.online_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p v-show="scope.row.status == 1">已上线</p>
          <p v-show="scope.row.status == 2">待上线</p>
          <p v-show="scope.row.status == 3">未上线</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <p>
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="removeBanner(scope.row.id)"
              >删除</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹框 -->
    <el-dialog :visible.sync="editDg" title="开屏信息">
      <el-form
        ref="appForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
        :model="currItem"
      >
        <el-form-item label="上传图片" prop="image">
          <p>750*400像素，支持PNG,JPG格式，小于1M</p>
          <upload-img
            :width="200"
            :height="100"
            v-model="currItem.image"
            :disabled="disabled"
          ></upload-img>
        </el-form-item>
        <el-form-item label="上线时间">
          <el-radio-group
            v-model="currItem.online_type"
            @change="changeType"
            :disabled="disabled"
          >
            <el-radio :label="1">即时上线</el-radio>
            <el-radio :label="2">定时上线</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="currItem.online_type == 2">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="start_date"
            :disabled="disabled"
            :picker-options="pickerDateOptions"
            :clearable="false"
          >
          </el-date-picker>
          <el-time-picker
            v-model="start_time"
            :disabled="disabled"
            value-format="HH:mm"
            :picker-options="{
              disabledDate: time => {
                return time.getTime() < Date.now() - 3600 * 1000 * 24;
              },
              selectableRange: startTimeRange
            }"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="comfirmClick" v-if="comfirm"
            >确定</el-button
          >
          <el-button type="primary" @click="saveClick" v-else>保存</el-button>
          <el-button @click="editDg = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹框 -->
  </div>
</template>

<script>
import moment from "moment";
import UploadImg from "../../components/UploadImg";
export default {
  components: {
    UploadImg
  },
  data() {
    return {
      havetail: [],
      moment: moment,
      disabled: false,
      comfirm: false,
      startTimeRange: "",
      start_date: "",
      start_time: "00:00",
      editDg: false, //控制弹框
      isNew: false,
      list: [],
      condition: {
        //根据条件进行返回
        type: 3
      },
      currItem: {
        type: 3,
        image: "", //开屏图片地址
        name: "",
        jump_type: 0, //跳转类型
        jump_link: "", //点击图片跳转的地址
        online_type: "", //1即时上线 2定时上线
        online_time: "" //时间戳
      },
      rules: {
        image: [
          {
            required: true,
            message: "请选择图片",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    pickerDateOptions() {
      let endTime = new Date().getTime();
      return {
        disabledDate(time) {
          return (
            time.getTime() < endTime - 1 * 24 * 3600 * 1000 ||
            time.getTime() > endTime + 30 * 24 * 3600 * 1000
          );
        }
      };
    }
  },
  watch: {
    start_date: {
      handler() {
        if (this.currItem.image == "") {
          this.start_time = moment()
            .format("YYYY-MM-DD HH:mm:ss")
            .split(" ")[1];
        }
      }
    },
    start_time: {
      handler() {
        if (this.start_date) {
          let nowDate = moment().format("YYYY-MM-DD HH:mm:ss");
          let dt = nowDate.split(" ");
          let st = "";
          if (this.start_date.split(" ")[0] == dt[0]) {
            // 是今天,选择 的时间开始为此刻的时分秒
            st = dt[1];
          } else {
            // 明天及以后从0时开始
            st = "00:00:00";
          }

          this.startTimeRange = st + " - 23:59:59";
          //例如：如果今天此刻时间为10:41:40 则选择时间范围为： 10:41:40 - 23:59:59
          //否则为：00:00:00- 23:59:59
        }
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    //获取App开屏列表
    async queryList() {
      let res = await this.$api.getBannerOpenList(this.condition);
      if (res.error_code == 0) {
        this.havetail =
          res.data.list.filter(item => {
            return item.status == 1;
          }) || [];
        this.list =
          res.data.list.filter(item => {
            return item.status !== 1;
          }) || [];
      }
    },
    changeType(value) {
      if (value == 2) {
        let date = moment();
        this.start_date = date.format("YYYY-MM-DD");
        this.start_time = date.format("HH:mm");
      }
    },

    //点击新增或者编辑按钮
    edit(data) {
      this.disabled = false;
      if (this.$refs.bannerForm) {
        this.$refs.bannerForm.clearValidate();
      }
      if (!data) {
        this.comfirm = false;
        this.editDg = true;
        this.isNew = true;
        this.currItem = {
          type: 3,
          image: "", //开屏图片地址
          name: "",
          jump_type: 0, //跳转类型
          jump_link: "", //点击图片跳转的地址
          online_type: 1, //1即时上线 2定时上线
          online_time: "" //时间戳
        };
      } else {
        this.disabled = false;
        this.currItem = JSON.parse(JSON.stringify(data));
        this.isNew = false;
        this.start_date = moment(data.online_time * 1000).format("YYYY-MM-DD");
        this.start_time = moment(data.online_time * 1000).format("HH:mm");
        if (data.status == 1) {
          this.disabled = true;
          this.comfirm = true;
        } else {
          this.comfirm = false;
        }
        this.editDg = true;
      }
    },
    //点击保存按钮
    async saveClick() {
      this.$refs.appForm.validate(async ok => {
        if (ok) {
          if (this.currItem.online_type == 1) {
            //如果是即时上线 就是当前时间
            this.currItem.online_time = parseInt(new Date().getTime() / 1000);
          }
          if (this.currItem.online_type == 2) {
            //如果是延时上线 则是延时上线的日期加时间
            this.currItem.online_time = parseInt(
              new Date(this.start_date + " " + this.start_time).getTime() / 1000
            );
          }
          if (this.isNew) {
            this.appBannerAdd();
          } else {
            this.appBannerModify();
          }
        }
      });
    },

    //请求App新增轮播图接口
    async appBannerAdd() {
      // this.editDg = false;
      let res = await this.$api.bannerCreate(this.$initReq(this.currItem));
      if (res.error_code == 0) {
        this.$message.success("添加成功");
        this.editDg = false;
        this.queryList();
      }
      if (res.error_code == 1005) {
        this.$message.error("定时上线时间不能超过现在30天!请重新选择");
      }
    },

    //请求App修改轮播图接口
    async appBannerModify() {
      let res = await this.$api.bannerModify(this.$initReq(this.currItem));
      if (res.error_code == 0) {
        this.$message.success("修改成功");
        this.editDg = false;
        this.queryList();
      }
    },
    comfirmClick() {
      this.editDg = false;
    },
    //删除轮播图
    async removeBanner(id) {
      let res = await this.$api.bannerDelete({ id: id });
      if (res.error_code == 0) {
        this.$message.success("删除成功");
        this.queryList();
      }
    }
  }
};
</script>

<style lang="less">
.page {
  .banner {
    object-fit: cover;
  }
}
h1 {
  font-size: 25px;
  margin-top: 15px;
}
</style>

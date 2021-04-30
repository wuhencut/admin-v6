<template>
  <div class="page">
    <el-button type="primary" icon="el-icon-plus" @click="edit(false)"
      >新增</el-button
    >
    <el-table :data="list" style="margin-top: 10px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="轮播图" width="200">
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
      <el-table-column label="轮播名称" prop="name"></el-table-column>
      <el-table-column label="跳转" prop="jump_link">
        <template slot-scope="scope">
          <a
            :href="scope.row.jump_link"
            target="_blank"
            v-if="scope.row.jump_type == 1"
            >{{ scope.row.jump_link }}</a
          >
          <p v-else>{{ scope.row.jump_link }}</p>
        </template>
      </el-table-column>
      <el-table-column label="上线时间" width="140">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.online_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <p v-show="scope.row.status == 1">已上线</p>
          <p v-show="scope.row.status == 2">待上线</p>
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
          <p>
            <el-button
              type="text"
              v-if="scope.$index > 0 || page_id !== 1"
              @click="moveBanner(scope.row.id, 1)"
              >上移</el-button
            >
            <el-button
              type="text"
              v-if="scope.$index < list.length - 1 || last == true"
              @click="moveBanner(scope.row.id, 2)"
              >下移</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="editDg" title="编辑/新增banner">
      <el-form
        ref="bannerForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
        :model="currItem"
      >
        <el-form-item label="轮播名称" prop="name">
          <div style="display: flex">
            <el-input
              placeholder="请输入轮播名称"
              maxlength="20"
              v-model="currItem.name"
              :disabled="bannername"
            >
              <template slot="append"
                >{{ currItem.name.length }}/20</template
              >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="上传图片" prop="image">
          <p>750*400像素，支持PNG,JPG格式，小于1M</p>
          <upload-img
            :width="200"
            :height="100"
            v-model="currItem.image"
            :disabled="time"
          ></upload-img>
        </el-form-item>
        <el-form-item label="跳转设置">
          <el-radio-group v-model="currItem.jump_type" :disabled="time">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">链接</el-radio>
            <el-radio :label="2">活动</el-radio>
            <el-radio :label="3">商品</el-radio>
          </el-radio-group>
          <el-form-item prop="update_link" v-if="currItem.jump_type != 0">
            <el-input
              v-model="currItem.update_link"
              placeholder="请输入banner跳转链接"
              v-show="currItem.jump_type == 1"
              :disabled="time"
            ></el-input>
            <el-input
              v-model="currItem.update_link"
              placeholder="活动ID"
              v-show="currItem.jump_type == 2"
              :disabled="time"
            ></el-input>
            <el-input
              v-model="currItem.update_link"
              placeholder="商品ID"
              v-show="currItem.jump_type == 3"
              :disabled="time"
            ></el-input>
          </el-form-item>
        </el-form-item>
        <!-- 上线时间 -->
        <el-form-item label="上线时间">
          <el-radio-group
            v-model="currItem.online_type"
            @change="currItem.online_time = ''"
            :disabled="disabled"
          >
            <el-radio :label="1">即时上线</el-radio>
            <el-radio :label="2">定时上线</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="currItem.online_type == 2">
          <el-date-picker
            v-model="date.day"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="pickerOptions"
            :disabled="disabled"
          ></el-date-picker>
          <el-time-picker
            v-model="date.time"
            :picker-options="timeOptions"
            placeholder="选择时间"
            value-format="HH:mm"
            :clearable="false"
            :disabled="disabled"
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

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="currentChange"
        :page-size="conidition.page_size"
        :current-page="conidition.page_id"
        :total="count"
      >
      </el-pagination>
    </div>
    <!-- 分页 -->
  </div>
</template>
<script>
import UploadImg from "../../components/UploadImg";
import moment from "moment";
export default {
  name: "StarBanner", // 星选轮播
  isNew: false,
  components: {
    UploadImg
  },
  data() {
    return {
      moment: moment,
      page_id: 1,
      last: true, //是否为最后一页
      editDg: false, // 编辑弹窗 、 新增弹窗
      comfirm: false, //如果是编辑窗口
      time: false,
      disabled: false, //专门控制时间的
      bannername: false,
      pickerOptions: {},
      timeOptions: {},
      date: {
        day: "",
        time: ""
      },
      conidition: {
        page_size: 10,
        page_id: 1,
        type: 1
      },
      currItem: {
        image: "", //图的link
        name: "", //轮播名称
        jump_type: "", //是否有跳转 跳转类型
        jump_link: "", //活动 商品id 跳转链接
        online_type: 1, //1即时上线 2定时上线
        online_time: "" //时间戳
      }, // 当前banner信息
      rules: {
        //验证规格
        name: [
          {
            required: true,
            message: "请输入banner名称",
            trigger: "blur"
          }
        ],
        image: [
          {
            required: true,
            message: "请选择图片",
            trigger: "change"
          }
        ],
        jump_link: [
          {
            required: true,
            message: "请输入链接、活动ID或商品ID",
            trigger: "blur"
          }
        ]
      },
      list: [],
      count: 0
    };
  },
  watch: {
    "date.day"(val) {
      if (this.isNew == true) {
        //判断是否为添加，添加才监听。因为编辑不能修改，不然会有报错
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
    "currItem.online_type"(val) {
      //即时和定时切换的时候
      if (val == 2 && this.isNew == true) {
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
  mounted() {
    this.queryList(); //1为星选
  },
  methods: {
    changeType(value) {
      if (value == 2) {
        let date = moment();
        this.start_date = date.format("YYYY-MM-DD");
        this.start_time = date.format("HH:mm");
      }
    },
    //新增星选轮播图
    async addBanner() {
      this.currItem.type = 1; //为星选轮播
      this.currItem.jump_link = this.currItem.update_link;
      let res = await this.$api.bannerCreate(this.$initReq(this.currItem));
      if (res.error_code == 0) {
        this.$message.success("添加成功");
        this.editDg = false;
        this.queryList();
      }
      if (res.error_code == 1001) {
        this.$message.error(res.error_description + "," + "请重新输入");
      }
      if (res.error_code == 1005) {
        this.$message.error("定时上线时间不能超过现在30天!请重新选择");
      }
    },

    //修改星选轮播图
    async starBannerModify() {
      this.currItem.jump_link = this.currItem.update_link;
      let res = await this.$api.bannerModify(this.$initReq(this.currItem));
      if (res.error_code == 0) {
        this.$message.success("修改成功");
        this.editDg = false;
        this.queryList();
      } else {
        this.$message.error(res.error_description + "," + "请输入正确的ID");
      }
    },

    // 保存
    async saveClick() {
      this.$refs.bannerForm.validate(async ok => {
        if (ok) {
          if (this.isNew) {
            //如果是即时上线，时间为当下时间
            if (this.currItem.online_type == 1) {
              this.currItem.online_time = parseInt(new Date().getTime() / 1000);
            }
            //如果是延时上线,则为延时上线时间
            if (this.currItem.online_type == 2) {
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
                this.currItem.online_time =
                  (this.date.day.getTime() + timeTemp) / 1000;
              }
            }
            this.addBanner();
          } else {
            this.starBannerModify();
          }
        } else {
          return false;
        }
      });
    },
    //通过数据来判断是新增的还是修改的
    edit(data) {
      this.time = false;
      this.bannername = false;
      if (this.$refs.bannerForm) {
        this.$refs.bannerForm.clearValidate();
      }
      //新增
      if (!data) {
        this.comfirm = false;
        this.editDg = true;
        this.isNew = true;
        this.disabled = false;
        this.currItem = {
          image: "",
          name: "",
          jump_link: "",
          online_type: 1,
          jump_type: 0 //跳转类型
        };
        //修改
      } else {
        // 指针不能直接指 list 元素 对象，不然在修改dialog时会同时修改 list 元素的值
        this.currItem = JSON.parse(JSON.stringify(data));
        this.isNew = false;
        this.date.day = moment(data.online_time * 1000).format("YYYY-MM-DD");
        this.date.time = moment(data.online_time * 1000).format("HH:mm");
        this.editDg = true;
        if (this.currItem.status == 1) {
          this.bannername = true;
        }
        this.time = false;
        this.disabled = true;
        this.comfirm = false;
        // }
      }
    },

    async queryList() {
      let res = await this.$api.getBannerOpenList(this.conidition);
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.count = res.data.count || 0;
        this.isLastPage();
      }
    },

    //上下移动
    async moveBanner(id, type) {
      let req = {
        type: 1,
        id: id,
        move_type: type
      };
      let res = await this.$api.bannerMove(req);
      if (res.error_code == 0) {
        this.$message.success("设置成功");
        this.queryList();
      }
    },

    // 删除轮播图
    async removeBanner(id) {
      let res = await this.$api.bannerDelete({ id: id });
      if (res.error_code == 0) {
        this.$message.success("删除成功");
        if (this.list.length > 1) {
          this.queryList();
        } else {
          this.conidition.page_id = this.page_id - 1;
          this.queryList();
        }
      }
    },
    //切换页码
    currentChange(current) {
      this.conidition.page_id = current;
      this.page_id = current;
      this.queryList();
    },
    comfirmClick() {
      this.editDg = false;
    },
    //判断是否为最后一页
    isLastPage() {
      this.last = true;
      let lastpage = Math.ceil(this.count / this.conidition.page_size);
      if (this.conidition.page_id === lastpage) {
        this.last = false;
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
</style>

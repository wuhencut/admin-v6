<template>
  <div class="page">
    <el-form inline>
      <el-form-item v-if="authList.indexOf('id110') > -1">
        <el-button v-if="!isEdit" type="primary" @click="editClick"
          >编辑</el-button
        >
        <template v-else>
          <el-button type="primary" @click="saveClick">保存</el-button>
          <el-button @click="cancelClick">取消</el-button>
        </template>
      </el-form-item>
      <el-form-item>
        <el-select class="search-inp" v-model="status" @change="queryList">
          <el-option value label="全部开始状态"></el-option>
          <el-option value="1" label="已开始"></el-option>
          <el-option value="2" label="预热"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right" v-show="!isEdit">
        <el-button
          icon="el-icon-plus"
          style="float: right"
          type="primary"
          @click="addClick"
          v-if="authList.indexOf('id109') > -1"
          >新加单品</el-button
        >
      </el-form-item>
    </el-form>

    <div style="width: 100%; overflow-x: auto">
      <table cellpadding="10" cellspacing="0" class="table">
        <thead>
          <tr>
            <th width="30px" v-if="isEdit">拖拽</th>
            <th width="300px">商品 | ID | 状态</th>
            <th width="120px">企业名称 | 库存</th>
            <th width="180px">当前返利金额</th>
            <th width="150px">当前返利活动</th>
            <th width="90px">剩余可用预算</th>
            <th width="160px">资源位状态</th>
            <th width="100px">加入后成交量</th>
            <th class="operate" width="80px">操作</th>
          </tr>
        </thead>
        <draggable
          v-model="list"
          tag="tbody"
          animation="500"
          class="table-main"
          handle=".icon"
          @end="initList"
        >
          <tr class="table-tr" v-for="(item, index) in list" :key="index">
            <td v-if="isEdit">
              <svg
                t="1599191034057"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1864"
                width="20"
                height="20"
              >
                <path
                  d="M96 256l768 0C881.664 256 896 241.664 896 224S881.664 192 864 192l-768 0C78.336 192 64 206.336 64 224S78.336 256 96 256zM864 512l-768 0C78.336 512 64 526.336 64 544S78.336 576 96 576l768 0C881.664 576 896 561.664 896 544S881.664 512 864 512zM864 832l-768 0C78.336 832 64 846.336 64 864S78.336 896 96 896l768 0c17.664 0 32-14.336 32-32S881.664 832 864 832z"
                  p-id="1865"
                  fill="#8a8a8a"
                ></path>
              </svg>
            </td>
            <td>
              <div style="display: flex">
                <div style="display: flex; align-items: center;">
                  <img width="50px" :src="item.cover" alt="" />
                </div>
                <div>
                  <p>{{ item.title }}</p>
                  <p>{{ item.production_id }}</p>
                  <p v-if="item.resource_type > 0">
                    上线状态:
                    <span v-if="item.join_status == 1"
                      >进行中{{ hotList.indexOf(item.production_id) + 1 }}</span
                    >
                    <span v-if="item.join_status == 2"
                      >预热{{
                        preHotList.indexOf(item.production_id) + 1
                      }}</span
                    >
                    <span v-if="item.join_status == 3">未在资源位</span>
                  </p>
                </div>
              </div>
            </td>
            <td>
              <p>{{ item.company_name }}</p>
              <p>库存: {{ item.stock_num }}</p>
            </td>
            <td>
              <p v-if="item.media_min_point || item.media_max_point">
                社媒:
                {{
                  `￥${item.media_min_point / 100} ~ ￥${item.media_max_point /
                    100}`
                }}
              </p>
              <div v-if="item.rebate_point && item.rebate_point.length">
                <p v-for="(channel, idx) in item.rebate_point" :key="`%${idx}`">
                  {{ $getPlatformName(channel.source) }}:
                  {{
                    channel.min_point == channel.max_point
                      ? "￥" + channel.max_point / 100
                      : `￥${channel.min_point / 100} ~ ￥${channel.max_point /
                          100}`
                  }}
                </p>
              </div>
            </td>
            <td>
              <router-link
                :to="{
                  path: 'rebateDetail',
                  query: {
                    rebate_id: item.rebate_id
                  }
                }"
                >{{ item.rebate_name }}</router-link
              >
              <div v-if="item.rebate_status == 1">活动状态: 进行中</div>
              <div v-if="item.rebate_status == 2">
                <p>活动状态: 未开始</p>
                <p>
                  {{
                    moment(item.rebate_start_time * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  }}开始
                </p>
              </div>
            </td>
            <td>
              {{ item.rebate_remaining_budget / 100 }}
            </td>
            <td>
              <p v-if="item.resource_type == 1">已加入</p>
              <p v-if="item.resource_type == 2">未加入</p>
              <div v-if="item.join_time">
                加入时间:
                <p>
                  {{
                    moment(item.join_time * 1000).format("YYYY-MM-DD HH:mm:ss")
                  }}
                </p>
              </div>
            </td>
            <td>
              {{ item.after_join_deal_num }}
            </td>
            <td class="opearte">
              <el-button
                v-if="authList.indexOf('id108') > -1"
                type="text"
                @click="checkClick(item.production_id)"
                >查看</el-button
              >
              <el-button
                v-if="isEdit"
                type="text"
                @click="removeClick(item.production_id)"
                >移出</el-button
              >
              <el-button v-if="isEdit" type="text" @click="moveTop(item)"
                >置顶</el-button
              >
            </td>
          </tr>
        </draggable>
      </table>
    </div>

    <!-- 新加商品 -->
    <el-dialog :visible.sync="addDg" title="加入商品">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="商品id">
          <el-input
            style="width: 200px"
            v-model.trim="search.production_id"
            placeholder="请输入商品id"
            @keyup.enter.native="queryGoods"
            @blur="queryGoods"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名">
          {{ currGood ? currGood.title : "查无此商品" }}
        </el-form-item>
        <el-form-item label="加入时间" v-if="currGood != null">
          <el-radio-group
            v-model="currGood.join_type"
            @change="currGood.join_time = ''"
          >
            <el-radio label="1">立即上线</el-radio>
            <el-radio label="2">定时上线</el-radio>
          </el-radio-group>
          <div v-if="currGood.join_type == 2">
            <el-date-picker
              v-model="date.day"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-time-picker
              v-model="date.time"
              :picker-options="timeOptions"
              placeholder="选择时间"
              value-format="HH:mm"
            >
            </el-time-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :disabled="!currGood" @click="confirmAddGood"
          >确定</el-button
        >
        <el-button @click="addDg = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import draggable from "vuedraggable";
import env from "../../api/env";
export default {
  name: "HotGoods",
  components: {
    draggable
  },
  watch: {
    "date.day"(val) {
      let timeStart = moment(new Date().getTime() + 15 * 60 * 1000).format(
        "HH:mm:ss"
      );
      if (
        this.date.day.getTime() >
        new Date(new Date().toLocaleDateString()).getTime()
      ) {
        timeStart = "00:00:00";
      }
      if (val) {
        this.timeOptions = {
          selectableRange: timeStart + "- 23:59:00"
        };
      }
    },
    "currGood.join_type"(val) {
      if (val == 2) {
        this.date.day = new Date(new Date().toLocaleDateString());
        this.date.time = new Date(
          parseInt(new Date().getTime() / 60000) * 60000 + 15 * 60000
        );
        this.pickerOptions = {
          disabledDate(time) {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        };
      }
    }
  },
  data() {
    return {
      moment: moment,
      timeOptions: {},
      search: {
        production_id: ""
      },
      date: {
        day: "",
        time: ""
      },
      currGood: {
        join_type: "1", //1 立即上线 2 定时上线
        join_time: "" // 上线时间
      }, // 当前搜索出来的商品
      isEdit: false,
      addDg: false, // 新加商品
      status: "", // 	开始状态：空：全部状态 1：已开始 2：预热
      hotList: [], // 已加入热单的列表
      preHotList: [], // 预热列表
      beforeEditList: [], // 编辑前的列表，用于点击取消后，恢复原来的列表
      list: [],
      pickerOptions: {}
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    async queryList() {
      let res = await this.$api.getHotGoodsList(
        this.$initReq({ status: this.status })
      );
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.initList();
        this.beforeEditList = JSON.parse(JSON.stringify(res.data.list));
      }
    },
    // 置顶
    moveTop(item) {
      this.list.splice(0, 0, this.list.splice(this.list.indexOf(item), 1)[0]);
    },
    removeClick(id) {
      let data;
      this.list.map(item => {
        if (item.production_id == id) {
          data = item;
        }
      });
      let index = this.list.indexOf(data);
      this.list.splice(index, 1);
    },
    // 点击确定添加单品
    confirmAddGood() {
      if (!this.currGood.production_id) {
        this.$message.error("请选择要添加的商品");
        return false;
      }
      if (this.currGood.join_type == 2 && !this.date.day) {
        this.$message.error("请选择上线时间");
        return false;
      }
      // 去重
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].production_id == this.currGood.production_id) {
          this.$message("列表中已有该商品");
          return false;
        }
      }
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
        this.currGood.join_time = (this.date.day.getTime() + timeTemp) / 1000;
      }
      this.list.push(this.currGood);
      this.saveClick();
    },
    // 点击编辑
    editClick() {
      this.isEdit = true;
    },
    // 查看点击
    checkClick(id) {
      let head, url;
      if (env != "online") {
        head = "shop-test";
      } else {
        head = "shop";
      }
      url = "http://" + head + ".ingtube.com/productDetail?production_id=" + id;
      window.open(url, "_blank");
    },
    addClick() {
      this.search.production_id = "";
      this.currGood = {
        join_time: "",
        join_type: "1"
      };
      if (this.list.length && this.list.length >= 20) {
        this.$message.error("热门商品已满20个，若要添加，请先删除一个或多个");
        return false;
      }
      this.addDg = true;
    },
    async queryGoods() {
      if (!this.search.production_id) {
        this.$message("请输入商品id");
        return false;
      }
      let res = await this.$api.searchGoodForHotList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        if (!res.data.info) {
          this.currGood = null;
        } else {
          let good = res.data.info || {};
          this.currGood = {
            title: good.title,
            production_id: good.production_id,
            join_type: "1",
            join_time: ""
          };
        }
      }
    },
    initList() {
      this.hotList = [];
      this.preHotList = [];
      this.list.map(item => {
        if (item.join_status == 1) {
          this.hotList.push(item.production_id);
        }
        if (item.join_status == 2) {
          this.preHotList.push(item.production_id);
        }
      });
    },
    async saveClick() {
      let list = [];
      this.list.map(item => {
        list.push({
          production_id: item.production_id,
          join_time: item.join_time ? item.join_time : 0,
          join_type: item.join_status || item.join_type
        });
      });

      let res = await this.$api.updateHotGoodsList({ list: list });
      if (res.error_code == 0) {
        this.$message.success("操作成功");
        this.isEdit = false;
        this.addDg = false;
        this.queryList();
      } else {
        this.list = this.beforeEditList;
      }
    },
    cancelClick() {
      this.isEdit = false;
      // 不可采用浅拷贝，浅拷贝会导致 后续的取消影响到了 beforeEditList ,因为浅拷贝是对象原型的引用~
      this.list = JSON.parse(JSON.stringify(this.beforeEditList));
    }
  }
};
</script>
<style lang="less">
.page {
  .table {
    background-color: #dedede;
    width: 100%;
    min-width: 1350px;
    tr {
      position: relative;
      padding-right: 50px;
      background-color: #fff;
      th {
        text-align: left;
      }
      background: #fefefe;
      td {
        border-bottom: 1px solid #dedede;
        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

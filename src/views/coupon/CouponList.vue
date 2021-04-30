<template>
  <div class="coupon">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="goCreateCoupon">新建优惠券</el-button>
      </el-form-item>
      <el-form-item
        ><el-input
          placeholder="优惠券ID"
          v-model.trim="search.coupon_id"
          @keyup.enter.native="searchBtnClick"
          maxlength="19"
        ></el-input
      ></el-form-item>
      <el-form-item
        ><el-input
          placeholder="优惠券名称"
          v-model.trim="search.coupon_name"
          @keyup.enter.native="searchBtnClick"
        ></el-input
      ></el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="company_name"
          :fetch-suggestions="filterCompany"
          placeholder="商家名称"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.coupon_type" @change="searchBtnClick">
          <el-option
            v-for="item in couponList"
            :key="item.id"
            :value="item.id"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <span>运营团队剩余预算：{{ point / 100 }}</span>
        <el-button
          v-if="authList.indexOf('1608014199') > -1"
          style="margin-left:10px"
          @click="recharge"
          >充值</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="coupon_id" label="优惠券ID" min-width="120">
      </el-table-column>
      <el-table-column prop="name" label="优惠券名称"> </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <div v-for="(item, index) in couponList" :key="index">
            <p v-if="item.id == scope.row.type">
              {{ item.value }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creator_name" label="创建者" min-width="130px">
        <template slot-scope="scope">
          <p v-if="scope.row.admin_id !== '0'">
            平台-{{ allAdmin[scope.row.admin_id] }}
          </p>
          <p v-else>{{ scope.row.creator_name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <div>
            {{ moment(scope.row.create_time * 1000).format("YYYY-MM-DD") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="优惠">
        <template slot-scope="scope">
          <p>{{ formatCoupon(scope.row) }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">进行中</el-tag>
          <el-tag type="info" v-if="scope.row.status == 1">已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="已领取/已使用">
        <template slot-scope="scope">
          <el-button
            type="text"
            :disabled="!scope.row.received_count"
            @click="receiveDetail(scope.row.coupon_id)"
            >{{ scope.row.received_count }}/{{
              scope.row.used_count
            }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="total_count" label="总量"> </el-table-column>
      <el-table-column label="操作" min-width="150px">
        <template slot-scope="scope">
          <p>
            <el-button
              type="text"
              @click="couponDetail(scope.row.coupon_id)"
              v-show="scope.row.admin_id !== '0'"
              >查看配置</el-button
            >
            <el-button
              type="text"
              v-show="scope.row.status == 0 && scope.row.admin_id !== '0'"
              @click="closeCoupon(scope.row.coupon_id)"
              >关闭</el-button
            >
          </p>
          <p v-if="scope.row.receive_type == 2 && scope.row.admin_id !== '0'">
            <el-button
              type="text"
              class="btn"
              :data-clipboard-text="scope.row.ingtube_code"
              @click="onCopy('btn')"
              v-if="scope.row.ingtube_code !== ''"
              >复制口令</el-button
            >
            <el-button
              type="text"
              @click="targetedClick(scope.row.coupon_id)"
              class="btn"
              >定向发放</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!--page-->
    <div class="pagination" v-if="count > 0">
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

    <!-- 充值弹框 -->
    <el-dialog title="预算充值" :visible.sync="rechargeDg" width="30%">
      <span>充值金额</span>
      <el-input
        style="width:200px;margin-left:20px"
        v-model="recharge_point"
        oninput="value=value.replace(/[^\d.]/g,'')"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rechargeDg = false">取 消</el-button>
        <el-button type="primary" @click="rechargeConfirm">确认充值</el-button>
      </span>
    </el-dialog>

    <!-- 优惠券使用详情dialog -->
    <el-dialog title="优惠券领取者名单" width="940px" :visible.sync="receiveDg">
      <el-table :data="receiveList">
        <el-table-column
          label="映兔id"
          prop="cp_id"
          width="160"
        ></el-table-column>
        <el-table-column
          label="映兔昵称"
          width="100"
          prop="cp_nickname"
        ></el-table-column>
        <el-table-column
          label="账号手机"
          width="120"
          prop="phone"
        ></el-table-column>
        <el-table-column label="领取时间" width="120" prop="receive_time">
          <template slot-scope="scope">
            {{
              scope.row.receive_time > 0
                ? moment(scope.row.receive_time * 1000).format("YYYY-M-D HH:mm")
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="过期时间" width="120" prop="expired_time">
          <template slot-scope="scope">
            {{
              scope.row.expired_time > 0
                ? moment(scope.row.expired_time * 1000).format("YYYY-M-D HH:mm")
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="使用时间" width="120" prop="use_time">
          <template slot-scope="scope">
            {{
              scope.row.use_time > 0
                ? moment(scope.row.use_time * 1000).format("YYYY-M-D HH:mm")
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="使用商品名/订单号" prop="production_name">
          <template slot-scope="scope">
            <p>
              {{ scope.row.production_name ? scope.row.production_name : "-" }}
            </p>
            <p>{{ scope.row.order_id ? scope.row.order_id : "-" }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          @current-change="handleChange"
          :page-size="receiveSearch.page_size"
          :current-page="receiveSearch.page_id"
          :total="receiveTotal"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 定向发放dialog -->
    <el-dialog
      title="按昵称定向发券"
      :visible.sync="targetedDg"
      :close-on-click-modal="false"
    >
      <div style="color: #aaa; padding-bottom: 10px;">
        一行一个昵称，excel粘贴自动换行，错误的昵称会被删除
        用户会自动领取优惠券，并收到系统消息
      </div>
      <el-input type="textarea" :rows="6" v-model="targetedList"></el-input>
      <div slot="footer">
        <el-button
          @click="
            targetedDg = false;
            targetedList = '';
          "
          >取消</el-button
        >
        <el-button type="primary" @click="targetedSure">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="发券结果"
      :visible.sync="resultDg"
      :close-on-click-modal="false"
    >
      <el-link type="danger">发送失败</el-link>
      <el-table :data="resultOnePageList">
        <el-table-column label="映兔昵称" prop="cp_nickname"></el-table-column>
        <el-table-column label="失败原因" prop="fail_reason"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          @current-change="resultPageChange"
          :page-size="resultSearch.page_size"
          :current-page="resultSearch.page_id"
          :total="resultTotal"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      moment: moment,
      point: 0,
      rechargeDg: false,
      isNew: false,
      companyList: [],
      recharge_point: "", //预算充值金额
      company_name: "", //商家名称
      couponList: [
        {
          id: 0,
          value: "全部优惠券类型"
        },
        {
          id: 1,
          value: "普通优惠券"
        },
        {
          id: 2,
          value: "抽奖优惠券"
        },
        {
          id: 3,
          value: "无任务返利券"
        },
        {
          id: 4,
          value: "任务返利券"
        }
      ],
      list: [],
      count: 0,
      search: {
        coupon_id: "",
        coupon_name: "",
        coupon_type: 0,
        sponsor_id: "",
        page_id: 1,
        page_size: 10
      },
      // 查看优惠券领取、使用列表
      receiveSearch: {
        coupon_id: "",
        page_id: 1,
        page_size: 5
      },
      receiveList: [], // 列表
      receiveTotal: 0, // 总量
      receiveDg: false, // 详情dialog
      currCouponId: "", // 当前点击的优惠券id
      targetedDg: false, // 定向dialog
      targetedList: "", // 定向list
      resultList: [], // 结果list
      resultOnePageList: [], // 结果单页展示数据
      resultDg: false, // 结果dialog
      resultTotal: 5,
      resultSearch: {
        page_id: 1,
        page_size: 5
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  watch: {
    company_name(val) {
      if (val == "") {
        this.search.sponsor_id = "";
        this.queryList();
      }
    }
  },
  mounted() {
    this.queryList(); // 查询列表
    this.getBudgetPoint(); // 获取运营团队剩余预算
  },
  methods: {
    // 定向发放点击
    targetedClick(id) {
      this.currCouponId = id;
      this.targetedDg = true;
    },
    formatList() {
      this.targetedList = this.targetedList.replace(/^\n*/, "");
      this.targetedList = this.targetedList.replace(/\n{2,}/g, "\n");
      this.targetedList = this.targetedList.replace(/\n*$/, "");
    },
    async targetedSure() {
      this.formatList();
      if (this.targetedList == "") {
        this.$message.error("请输入昵称");
        return false;
      }
      let list = this.targetedList.split("\n");
      let res = await this.$api.targetedAssign({
        coupon_id: this.currCouponId,
        cp_nickname_list: list
      });
      if (res.error_code == 0) {
        this.targetedDg = false;
        this.targetedList = "";
        this.queryList(); // 查询列表
        this.getBudgetPoint(); // 获取运营团队剩余预算
        if (res.data.err_list && res.data.err_list.length > 0) {
          this.resultDg = true;
          this.resultList = res.data.err_list || [];
          this.resultTotal = res.data.err_list.length || 0;
          this.getOnePage(1);
        } else {
          this.$message.success("发放成功");
          this.targetedList = "";
        }
      }
    },
    resultPageChange(val) {
      this.getOnePage(val);
    },
    getOnePage(page_id) {
      this.resultOnePageList = this.resultList.slice(
        (page_id - 1) * this.resultSearch.page_size,
        page_id * this.resultSearch.page_size
      );
    },
    // 领用详情
    async receiveDetail(id) {
      if (id) {
        this.currCouponId = id;
        this.receiveSearch.page_id = 1;
      }
      let res = await this.$api.getReceiveUsedList({
        ...this.receiveSearch,
        coupon_id: this.currCouponId
      });
      if (res.error_code == 0) {
        this.receiveDg = true;
        this.receiveList = res.data.list || [];
        this.receiveTotal = res.data.count || 0;
      }
    },
    handleChange(val) {
      this.receiveSearch.page_id = val;
      this.receiveDetail();
    },
    handleSelect(item) {
      this.search.sponsor_id = item.sponsor_id;
      this.queryList();
    },
    //筛选商家
    async filterCompany(queryString, cb) {
      if (queryString === "") {
        cb([]);
        return false;
      }
      let req = {
        page_id: 1,
        page_size: 10,
        company_name: queryString
      };
      let res = await this.$api.getBusinessLicenseList(req);
      if (res.error_code == 0) {
        this.companyList = res.data.sponsor_user || [];
        for (let i = 0; i < this.companyList.length; i++) {
          this.companyList[i].value = this.companyList[i].company_name;
        }
      } else {
        this.companyList = [];
      }
      cb(this.companyList);
    },
    async queryList() {
      let res = await this.$api.getCouponList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async getBudgetPoint() {
      let res = await this.$api.getBudgetTotal({});
      if (res.error_code == 0) {
        this.point = res.data.point;
      }
    },
    //确认充值
    async rechargeConfirm() {
      let req = {
        recharge_point: Number(this.recharge_point) * 100
      };
      let res = await this.$api.rechargeBudget(req);
      if (res.error_code == 0) {
        this.$message.success("充值成功");
        this.$router.go(0);
        this.rechargeDg = false;
      }
    },
    //点击复制映口令
    onCopy(elementClass) {
      const clipboard = new Clipboard(`.${elementClass}`);
      let t = this;
      clipboard.on("success", function(e) {
        e.clearSelection();
        t.$message.success("复制成功");
        clipboard.destroy();
      });
    },
    //关闭优惠券
    async closeCoupon(id) {
      let req = {
        coupon_id: id
      };
      let res = await this.$api.closeCoupon(req);
      if (res.error_code == 0) {
        this.$message.success("操作成功");
        this.queryList();
      }
    },
    // 充值
    recharge() {
      this.rechargeDg = true;
    },
    couponDetail(id) {
      this.isNew = false;
      this.$router.push({
        path: "createCoupon",
        query: {
          id: id,
          flag: this.isNew
        }
      });
    },
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    //格式化优惠券全文案
    formatCoupon(item) {
      if (item.order_total_require > 0) {
        return (
          "满" +
          parseInt(item.order_total_require / 100) +
          "减" +
          parseInt(item.discount_amount / 100)
        );
      } else {
        return "无门槛减" + parseInt(item.discount_amount / 100);
      }
    },
    goCreateCoupon() {
      this.isNew = true;
      this.$router.push({
        path: "createCoupon",
        query: {
          flag: this.isNew
        }
      });
    }
  }
};
</script>
<style lang="less">
.page {
  .target-dialog {
    .sub-title {
      color: #fff;
    }
  }
}
</style>

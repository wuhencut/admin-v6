<template>
  <div class="cp-list">
    <!--form-->
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.company_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="商户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
          placeholder="博主昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.order_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="提案ID"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option :value="0" label="全部"></el-option>
          <el-option :value="2" label="待发货"></el-option>
          <el-option :value="3" label="已发货"></el-option>
          <el-option :value="9" label="发货逾期"></el-option>
          <el-option :value="6" label="订单关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtnClick"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <!--/form-->
    <!--table-->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="提案信息" width="200">
        <template slot-scope="scope">
          <p>博主昵称: {{ scope.row.cp_nickname }}</p>
          <p>提案ID: {{ scope.row.id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" min-width="200">
        <template slot-scope="scope">
          <p>
            收货人: {{ scope.row.address_info.recipient }}
            {{ scope.row.address_info.phone }}
          </p>
          <p>
            收货地址: {{ scope.row.address_info.province }}
            {{ scope.row.address_info.city }}
            {{ scope.row.address_info.district }}
            {{ scope.row.address_info.address }}
          </p>
          <p>备注: {{ scope.row.express_remark || "无" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="活动信息" min-width="250">
        <template slot-scope="scope">
          <p>商户名: {{ scope.row.company_name }}</p>
          <p>活动名: {{ scope.row.campaign_name }}</p>
          <p>
            规格: {{ scope.row.specification }}
            <span v-if="scope.row.level_two_specification"
              >| {{ scope.row.level_two_specification }}</span
            >
          </p>
        </template>
      </el-table-column>
      <el-table-column label="物流信息" width="200">
        <template slot-scope="scope">
          <p>物流公司: {{ scope.row.expressCompany || "未填写" }}</p>
          <p>物流单号: {{ scope.row.expressNumber || "未填写" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="发货状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">待审核</span>
          <span v-if="scope.row.status == 2">待发货</span>
          <span v-if="scope.row.status == 3">已发货</span>
          <span v-if="scope.row.status == 4">已测评</span>
          <span v-if="scope.row.status == 5">已失效</span>
          <!--包括8,9-->
          <span v-if="scope.row.status == 6">已关闭</span>
          <span v-if="scope.row.status == 7">博主取消</span>
          <span v-if="scope.row.status == 8" style="color:#FF3C8A;"
            >测评逾期</span
          >
          <span v-if="scope.row.status == 9" style="color:#FF3C8A;"
            >发货逾期</span
          >
        </template>
      </el-table-column>
      <el-table-column label="凭证" fixed="right">
        <template slot-scope="scope">
          <!-- scope.row.proof_images.length -->
          <el-button
            type="text"
            v-if="scope.row.proof_images"
            @click="checkImgs(scope.row.proof_images)"
            >查看</el-button
          >
          <el-tag v-else>无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.status != 6 && authList.indexOf('id130') > -1"
            @click="closeClick(scope.row.id)"
            >关闭</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="page" v-if="allNum != 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="30"
        layout="total, prev, pager, next, jumper"
        :total="allNum"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="reasonDg" title="关闭订单">
      <p>关闭订单后，该订单不可恢复</p>
      <el-input v-model="closeData.reason" type="textarea" :rows="5"></el-input>
      <div slot="footer">
        <el-button @click="reasonDg = false">取消</el-button>
        <el-button @click="closeOrder" type="primary">关闭</el-button>
      </div>
    </el-dialog>
    <div v-if="showImgs">
      <el-dialog class="img-preview" :visible.sync="showImgs">
        <el-carousel indicator-position="outside" :autoplay="true">
          <el-carousel-item v-for="item in imgs" :key="item">
            <img
              style="width: 100%; height: 100%; object-fit: contain;"
              :src="item"
              alt=""
            />
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      closeData: {
        order_id: "",
        reason: ""
      },
      reasonDg: false, // 关闭订单弹窗
      search: {
        company_name: "", //商户名
        page_id: 1, //页码
        cp_nickname: "", //博主名称
        order_id: "", //单号
        status: 0 //0 全部。2 待发货，3 已发货 ，9 发货逾期，
      },
      list: [],
      allNum: 0, //总条数
      imgs: [], // 凭证图
      showImgs: false // 展示图片
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    //查询粉丝物流
    this.searchBtnClick();
  },
  methods: {
    async closeOrder() {
      if (!this.closeData.reason) {
        this.$message.error("填写关闭理由啊！！！");
        return false;
      }
      this.$confirm("确认关闭该物流?", "提示", {
        type: "warning"
      })
        .then(async () => {
          let req = this.$initReq(this.closeData);
          let res = await this.$api.closeFansExp(req);
          if (res.error_code == 0) {
            this.queryExpressInfo();
            this.reasonDg = false;
          }
        })
        .catch(async () => {
          this.reasonDg = false;
        });
    },
    async closeClick(id) {
      this.closeData.order_id = id;
      this.closeData = {
        order_id: id,
        reason: ""
      };
      this.reasonDg = true;
    },
    checkImgs(imgs) {
      this.showImgs = true;
      this.imgs = imgs;
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryExpressInfo();
    },
    //查询粉丝物流信息
    async queryExpressInfo() {
      if (!/\d+/.test(this.search.order_id) && this.search.order_id != "") {
        this.$message.error("提案ID为数字");
        return;
      }
      let req = this.$initReq(this.search);
      let res = await this.$api.fansExpress(req);
      if (res.error_code == 0) {
        this.allNum = res.data.count;
        this.list = res.data.orders;
      }
    },
    //点击跳转页面
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryExpressInfo();
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  text-align: center;
  margin-top: 20px;
}
</style>

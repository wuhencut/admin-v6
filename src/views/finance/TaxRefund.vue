<template>
  <div class="tax-list">
    <!--form-->
    <el-form inline>
      <el-form-item>
        <el-input
          style="width: 240px"
          v-model.trim="search.settle_id"
          clearable
          @change="searchBtnClick"
          placeholder="结算编号"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.cp_nickname"
          clearable
          @change="searchBtnClick"
          placeholder="博主昵称"
        ></el-input>
      </el-form-item>
      <el-form-item label="结算时间">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          @change="searchBtnClick"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.settle_status"
          @change="searchBtnClick"
        >
          <el-option :value="0" label="全部"></el-option>
          <el-option :value="1" label="可退税"></el-option>
          <el-option :value="2" label="退税驳回"></el-option>
          <el-option :value="3" label="已退税"></el-option>
          <el-option :value="4" label="不可退税"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float:right"
        ><el-button class="export-btn" type="primary" @click="exportClick"
          >导出</el-button
        ></el-form-item
      >
    </el-form>
    <!--/form-->
    <!--table-->
    <el-table :data="list">
      <el-table-column
        label="结算编号"
        prop="settle_id"
        width="180"
      ></el-table-column>
      <el-table-column
        label="博主昵称"
        prop="cp_nickname"
        width="150"
      ></el-table-column>
      <el-table-column label="结算时间" width="150">
        <template slot-scope="scope">{{
          moment(scope.row.settle_time * 1000).format("YYYY-MM-DD HH:mm")
        }}</template>
      </el-table-column>
      <el-table-column
        label="结算金额"
        prop="settle_point"
        width="110"
      ></el-table-column>
      <el-table-column
        label="个人所得税"
        prop="personal_income_tax"
        width="110"
      ></el-table-column>
      <el-table-column
        label="增值附加税"
        prop="vat"
        width="115"
      ></el-table-column>
      <el-table-column
        label="到账金额"
        prop="final_amount"
        width="110"
      ></el-table-column>
      <el-table-column label="退税状态">
        <template slot-scope="scope">
          <span v-if="scope.row.settle_status == 1">可退税</span>
          <span v-if="scope.row.settle_status == 2">退税驳回</span>
          <span v-if="scope.row.settle_status == 3">已退税</span>
          <span v-if="scope.row.settle_status == 4">不可退税</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.settle_status == 1"
            type="text"
            @click="verifyClick(scope.row)"
            >审核</el-button
          >
          <el-button
            v-if="
              scope.row.settle_status == 1 && scope.row.personal_income_tax != 0
            "
            type="text"
            @click="refuseClick(scope.row.settle_id)"
            >驳回</el-button
          >
          <el-button
            v-if="scope.row.settle_status == 4 || scope.row.settle_status == 2"
            type="text"
            @click="reverifyClick(scope.row)"
            >重新审核</el-button
          >
          <el-button
            v-if="scope.row.settle_status == 3"
            type="text"
            @click="checkTaxInfo(scope.row)"
            >查看</el-button
          >
          <el-button type="text" @click="changeClick(scope.row)"
            >变更记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--/table-->
    <!--分页 大于一页再展示-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
    <!--/page-->
    <!--审核弹窗-->
    <el-dialog :visible.sync="verifyDialog" title="开票方信息">
      <el-form :model="form" ref="form" label-width="130px" :rules="rules">
        <el-form-item label="退税种类" prop="tax_type">
          <el-checkbox-group v-model="form.tax_type">
            <el-checkbox :label="1">个人所得税</el-checkbox>
            <el-checkbox :label="2">增值附加税</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="开票方身份：" prop="cp_type">
          <el-radio-group v-model="form.cp_type">
            <el-radio :label="1" disabled>个人</el-radio>
            <el-radio :label="2">企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人姓名：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone_number">
          <el-input v-model="form.phone_number"></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.cp_type == 2"
          label="公司名称："
          prop="company_name"
        >
          <el-input v-model="form.company_name"></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.cp_type == 2"
          label="营业执照号码："
          prop="business_license_number"
        >
          <el-input v-model="form.business_license_number"></el-input>
        </el-form-item>
        <el-form-item label="发票类型：" prop="invoice_type">
          <el-radio-group v-model="form.invoice_type">
            <el-radio :label="1">电子发票</el-radio>
            <el-radio :label="2">纸质发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票号码" prop="invoice_number">
          <el-input
            v-model="form.invoice_number"
            :rows="5"
            type="textarea"
            placeholder="多个发票号码请以换行区分"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="verify">确认</el-button>
          <el-button @click="verifyDialog = false">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--查看 - 弹窗-->
    <el-dialog :visible.sync="checkDialog" title="开票方信息">
      <el-form :model="currTaxInfo" label-width="130px">
        <el-form-item
          v-if="currTaxInfo.tax_type && currTaxInfo.tax_type.length"
          label="退税种类: "
        >
          <span v-for="item in currTaxInfo.tax_type" :key="item">
            {{ item == 1 ? "个人所得税" : "增值附加税" }} &nbsp;
          </span>
        </el-form-item>
        <el-form-item label="开票方身份: " prop="cp_type">
          <span v-if="currTaxInfo.cp_type == 1">个人</span>
          <span v-if="currTaxInfo.cp_type == 2">企业</span>
        </el-form-item>
        <el-form-item
          v-if="currTaxInfo.cp_type == 2"
          label="公司名称: "
          prop="company_name"
        >
          <span>{{ currTaxInfo.company_name }}</span>
        </el-form-item>
        <el-form-item
          v-if="currTaxInfo.cp_type == 2"
          label="营业执照号码: "
          prop="business_license_number"
        >
          <span>{{ currTaxInfo.business_license_number }}</span>
        </el-form-item>
        <el-form-item label="联系人姓名: " prop="name">
          <span>{{ currTaxInfo.name }}</span>
        </el-form-item>
        <el-form-item label="联系方式: " prop="phone_number">
          <span>{{ currTaxInfo.phone_number }}</span>
        </el-form-item>
        <el-form-item label="发票类型: " prop="invoice_type">
          <span v-if="currTaxInfo.invoice_type == 1">电子发票</span>
          <span v-if="currTaxInfo.invoice_type == 2">纸质发票</span>
        </el-form-item>
        <el-form-item label="发票号码: " prop="invoice_number">
          <span
            :key="index"
            v-for="(item, index) in currTaxInfo.invoice_number"
          >
            {{ item }}
            <br />
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--变更记录 - 弹窗-->
    <el-dialog :visible.sync="changeDialog" title="变更记录">
      <el-table :data="changeList">
        <el-table-column label="日期" prop="change_time">
          <template slot-scope="scope">{{
            moment(scope.row.change_time * 1000).format("YYYY-MM-DD HH:mm")
          }}</template>
        </el-table-column>
        <el-table-column label="审核状态" prop="content"></el-table-column>
      </el-table>
    </el-dialog>
    <!--驳回理由 - 弹窗-->
    <el-dialog :visible.sync="refuseDialog">
      <p
        style="text-align: center; line-height: 50px; font-size: 18px; font-weight: bold;"
      >
        输入驳回理由
      </p>
      <el-input
        v-model="refuseInfo.reason"
        type="textarea"
        :rows="10"
      ></el-input>
      <div style="margin-top: 20px;text-align: center;">
        <el-button type="primary" @click="refuse">确认驳回</el-button>
        <el-button @click="refuseDialog = false">关闭驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import env from "../../api/env";
import getUserInfo from "../../api/getUserInfo";
export default {
  data() {
    let _minTime = null;
    let _maxTime = null;
    // let that = this;
    return {
      userInfo: getUserInfo(),
      dateTime: [],
      pickerOptions: {
        onPick(time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            let timeRange = 90 * 24 * 60 * 60 * 1000; // 90天
            _minTime = time.minDate.getTime() - timeRange; // 最小时间
            _maxTime = time.minDate.getTime() + timeRange; // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null;
          }
        },
        disabledDate(time) {
          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() < _minTime || time.getTime() > _maxTime;
          }
        }
      },
      moment: moment,
      verifyDialog: false, // 审核弹窗
      currTaxInfo: {}, // 当前退税相关信息
      checkDialog: false, // 查看 退税详情
      refuseDialog: false, // 驳回弹窗
      changeDialog: false, // 更改日志 弹窗
      refuseInfo: {
        // 驳回信息
        settle_id: "", // 驳回id
        reason: "" //驳回理由
      },
      changeList: [], // 日志列表
      form: {
        tax_type: [], // 1个人所得税 2增值附加税
        settle_id: "", // id
        cp_type: 0, // 开票方身份  人 / 企业
        name: "",
        phone_number: "",
        invoice_type: 0, // 发票类型
        invoice_number: [], // 发票号
        company_name: "", // 公司名
        business_license_number: "" // 营业执照
      },
      rules: {
        tax_type: [
          {
            required: true,
            message: "请选择退税类型",
            trigger: "change"
          }
        ],
        cp_type: [
          {
            required: true,
            message: "请选择开票方身份",
            pattern: /1|2/,
            trigger: "change"
          }
        ],
        invoice_type: [
          {
            required: true,
            message: "请选择发票类型",
            pattern: /1|2/,
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入联系人姓名",
            trigger: "blur"
          }
        ],
        phone_number: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: "blur"
          }
        ],
        invoice_number: [
          {
            required: true,
            message: "请输入发票号",
            trigger: "blur"
          }
        ],
        company_name: [
          {
            required: true,
            message: "请输入公司名",
            trigger: "blur"
          }
        ],
        business_license_number: [
          {
            required: true,
            message: "请输入营业执照",
            trigger: "blur"
          }
        ]
      },
      search: {
        cp_nickname: "",
        settle_id: "",
        settle_status: 0, // 1 可退税， 2 退税驳回， 3 已退税， 4 不可退税
        page_id: 1,
        page_size: 20,
        settle_time_start: 0,
        settle_time_end: 0
      },
      verifyInfo: {
        settle_id: "", // 结算编号
        cp_type: 1, // 开票类型， 1 个人， 2 企业
        personal_invoice: {
          // 个人发票
          name: "", // 联系人
          phone_number: "", //联系方式
          invoice_type: 1, // 1 电子发票， 2 纸质发票
          invoice_number: [] // 发票号
        },
        enterprise_invoice: {
          // 企业发票
          company_name: "", // 公司名字
          business_license_number: "", // 公司营业执照
          name: "", // 联系人
          phone_number: "", // 联系方式
          invoice_type: 1, // 1 电子发票， 2 纸质发票
          invoice_number: [] // 纸质发票
        }
      },
      list: [],
      date: "", // 日期
      count: 0 // 列表数目
    };
  },
  watch: {
    dateTime(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.settle_time_start = 0;
        this.search.settle_time_end = 0;
      } else {
        this.search.settle_time_start = moment(val[0]).unix();
        this.search.settle_time_end = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    }
  },
  mounted() {
    this.searchBtnClick();
  },
  methods: {
    // 日志弹窗
    changeClick(data) {
      this.changeDialog = true;
      this.changeList = data.change_log;
    },
    // 点击审核
    verifyClick(data) {
      this.form = {
        tax_type: [], // 1个人所得税 2增值附加税
        settle_id: "", // id
        cp_type: 0, // 开票方身份  人 / 企业
        name: "",
        phone_number: "",
        invoice_type: 0, // 发票类型
        invoice_number: [], // 发票号
        company_name: "", // 公司名
        business_license_number: "" // 营业执照
      };
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
      this.form.settle_id = data.settle_id;
      this.form.cp_type = data.cp_type;
      if (data.cp_type == 1) {
        Object.assign(this.form, data.personal_invoice);
      }
      if (data.cp_type == 2) {
        Object.assign(this.form, data.enterprise_invoice);
      }
      if (this.form.invoice_number instanceof Array) {
        // 如果是字符串会报错，只处理数组
        this.form.invoice_number = this.form.invoice_number.join("\n"); // 将数组解析成换行字符串
      }
      this.verifyDialog = true; // 页面展示必须在数据处理之后，不然会报错
    },
    // 审核
    async verify() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          // 校验成功
          if (this.form.cp_type == 1) {
            this.verifyInfo = {
              settle_id: this.form.settle_id, // 结算编号
              cp_type: 1, // 开票类型， 1 个人， 2 企业
              tax_type: this.form.tax_type,
              personal_invoice: {
                // 个人发票
                name: this.form.name, // 联系人
                phone_number: this.form.phone_number, //联系方式
                invoice_type: this.form.invoice_type, // 1 电子发票， 2 纸质发票
                invoice_number: this.form.invoice_number.split("\n") // 发票号
              }
            };
          } else {
            this.verifyInfo = {
              settle_id: this.form.settle_id, // 结算编号
              cp_type: 2, // 开票类型， 1 个人， 2 企业
              tax_type: this.form.tax_type,
              enterprise_invoice: {
                // 企业发票
                company_name: this.form.company_name, // 公司名字
                business_license_number: this.form.business_license_number, // 公司营业执照
                name: this.form.name, // 联系人
                phone_number: this.form.phone_number, // 联系方式
                invoice_type: this.form.invoice_type, // 1 电子发票， 2 纸质发票
                invoice_number: this.form.invoice_number.split("\n") // 纸质发票
              }
            };
          }
          this.$confirm("确认 通过审核？", "操作警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              let res = await this.$api.confirmTaxRefund(this.verifyInfo);
              if (res.error_code == 0) {
                this.$message.success("审核成功");
                this.getList();
                this.verifyDialog = false;
              }
            })
            .catch(() => {
              this.$message.info("已取消");
            });
        } else {
          this.$message.error("请填写完整");
          return false;
        }
      });
    },
    // 点击重新审核
    async reverifyClick(data) {
      this.$confirm("确定 重置审核吗？", "操作警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.resetTaxRefund({
            settle_id: data.settle_id
          });
          if (res.error_code == 0) {
            this.$message.success("重置成功");
            this.getList();
            return false;
          }
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 驳回弹窗
    refuseClick(data) {
      this.refuseInfo.reason = "";
      this.refuseDialog = true;
      this.refuseInfo.settle_id = data;
    },
    // 驳回
    async refuse() {
      if (!this.refuseInfo.reason) {
        this.$message.error("请填写驳回理由");
        return false;
      }
      let res = await this.$api.refuseTaxRefund(this.refuseInfo);
      if (res.error_code == 0) {
        this.$message.success("已驳回");
        this.getList();
        this.refuseDialog = false;
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.getList();
    },
    // 获取列表信息
    async getList() {
      let req = this.$initReq(this.search);
      let res = await this.$api.getTaxList(req);
      if (res.error_code == 0) {
        this.count = res.data.count;
        this.list = res.data.list; // 税表
      }
    },
    //导出
    exportClick() {
      //测试环境
      let BASEURL = `http://${env}.admin.test.collectivedynamic.com:30000`;
      //线上环境
      if (env == "online") {
        BASEURL = "https://admin-api.yingtu.co";
      }
      let user_id = this.userInfo.user_id || "";
      let sid = this.userInfo.sid || "";
      let req = {
        source: "web",
        sid: sid,
        user_id: user_id,
        data: {
          cp_nickname: this.search.cp_nickname,
          settle_id: this.search.settle_id,
          settle_status: this.search.settle_status,
          settle_time_start: this.search.settle_time_start,
          settle_time_end: this.search.settle_time_end
        }
      };
      if (req.data.settle_id == "") {
        delete req.data.settle_id;
      }
      req = JSON.stringify(req);
      let str = encodeURI(req);
      window.location.href = BASEURL + `/admin/pay/tax/v1/export?data=${str}`;
    },
    // 查看 - 退税信息
    checkTaxInfo(data) {
      // 个人
      if (data.cp_type == 1) {
        this.currTaxInfo = Object.assign(
          { cp_type: 1, tax_type: data.tax_type },
          data.personal_invoice
        );
      } else {
        this.currTaxInfo = Object.assign(
          { cp_type: 2, tax_type: data.tax_type },
          data.enterprise_invoice
        );
      }
      this.checkDialog = true;
    },
    // 切换页面
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.getList();
    }
  }
};
</script>
<style lang="less" scoped>
.pagination {
  text-align: center;
  margin: 10px 0;
}

.tag + .tag {
  margin-left: 10px;
}
</style>

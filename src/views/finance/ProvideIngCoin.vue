<template>
  <!--映币发放-->
  <div class="page-recharge-cp">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="rechargeBtnClick"
          >发放</el-button
        >
      </el-form-item>
      <el-form-item label="发放时间">
        <el-date-picker
          type="daterange"
          range-separator="至"
          v-model="search.date"
          value-format="yyyy-MM-dd"
          @change="searchBtnClick"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="映兔ID"
          v-model.trim="search.cp_id"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="映兔昵称"
          v-model.trim="search.cp_nickname"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="商户ID"
          v-model.trim="search.sponsor_id"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="企业名称"
          v-model.trim="search.company_name"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.recharge_type"
          @change="searchBtnClick"
        >
          <el-option label="所有发放类型" :value="0"></el-option>
          <el-option
            v-for="item in recharge_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtnClick"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="发放时间" width="150">
        <template slot-scope="scope">
          <div>
            {{
              moment.unix(scope.row.recharge_time).format("YYYY-MM-DD HH:mm")
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户id | 用户昵称" min-width="200">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.cp_id }}</p>
            <p>{{ scope.row.cp_nickname }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付方" min-width="200">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.sponsor_id }}</p>
            <p>{{ scope.row.company_name }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发放数量" prop="recharge_num"> </el-table-column>
      <el-table-column label="发放类型">
        <template slot-scope="scope">
          <div v-for="(item, index) in recharge_type" :key="index">
            <p v-if="item.value == scope.row.recharge_type">
              {{ item.label }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="扣除金额">
        <template slot-scope="scope">
          <div>{{ toThousands(scope.row.sponsor_point / 100) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发放金额">
        <template slot-scope="scope">
          <div>{{ toThousands(scope.row.recharge_total) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
        min-width="200"
      ></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :total="count"
        :page-size="search.page_size"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!--发放表单-->
    <el-dialog
      title="发放映币"
      :visible.sync="rechargeFormVisible"
      width="1000px"
    >
      <el-form label-width="110px" label-position="left">
        <el-form-item label="发放方式">
          <el-select v-model="rechargeForm.type" @change="changeRechargeType">
            <el-option
              v-for="item in recharge_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="支付方(商户id)"
          v-if="rechargeForm.type != 1 && rechargeForm.type != 2"
        >
          <el-input
            v-model="rechargeForm.sponsor_id"
            style="width:300px"
            @change="changeSponsorId"
          ></el-input>
          <span>{{ rechargeForm.company_name }}</span>
        </el-form-item>
        <el-form-item
          v-if="
            rechargeForm.type == 4 ||
              rechargeForm.type == 3 ||
              rechargeForm.type == 5
          "
          label="扣佣方式"
        >
          <p v-if="rechargeForm.type == 4">
            不抽佣 | 扣商家X金额，发给博主X金额
          </p>
          <p v-if="rechargeForm.type == 3">
            扣除36.34% | 扣商家X金额，发给博主X金额*0.6366
          </p>
          <p v-if="rechargeForm.type == 5">
            手动输入扣除金额(支持两位小数)和发放金额(不支持小数)
          </p>
        </el-form-item>
      </el-form>
      <el-table :data="rechargeForm.list">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户id" width="200">
          <template slot-scope="scope">
            <el-input
              v-model.trim="scope.row.cp_id"
              @blur="blurUserId(scope.row)"
              maxlength="19"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="用户昵称"
          width="150"
          prop="cp_nickname"
        ></el-table-column>
        <el-table-column label="扣除金额" width="150">
          <template slot-scope="scope">
            <el-input
              v-if="rechargeForm.type == 5"
              v-model="scope.row.sponsor_point"
              :maxlength="8"
            ></el-input>
            <el-input
              v-else
              v-model="scope.row.sponsor_point"
              @input="blurRechargeTotal(scope.row)"
              :maxlength="8"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="发放金额" width="150">
          <template slot-scope="scope">
            <span v-if="rechargeForm.type !== 5">{{
              scope.row.recharge_total
            }}</span>
            <el-input
              v-if="rechargeForm.type == 5"
              v-model="scope.row.recharge_total"
              @input="changeInput(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template slot="header">
            <el-button
              type="primary"
              @click="addRowBtnClick"
              icon="el-icon-plus"
              >添加</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="rechargeForm.list.length > 1"
              @click="delRow(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="submitBtnClick">提交</el-button>
      </div>
    </el-dialog>
    <!--发放表单-->
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      // type: 1,
      search: {
        date: null,
        cp_id: "",
        cp_nickname: "",
        company_name: "",
        sponsor_id: "",
        recharge_type: 0, //全部
        page_id: 1,
        page_size: 30
      },
      //发放类型模板
      recharge_type: [
        {
          label: "邀请博主",
          value: 1
        },
        {
          label: "邀请品牌",
          value: 2
        },
        {
          label: "线下悬赏",
          value: 3
        },
        {
          label: "其他",
          value: 4
        },
        {
          label: "自定义",
          value: 5
        }
      ],
      list: [],
      count: 0,
      rechargeFormVisible: false,
      rechargeForm: {
        type: 1,
        sponsor_id: "",
        company_name: "",
        list: [
          {
            cp_id: "",
            cp_nickname: "",
            cp_point: "",
            recharge_total: "",
            remark: ""
          }
        ]
      },
      isPadding: false
    };
  },
  created() {
    this.searchList();
  },
  methods: {
    changeInput(item) {
      item.recharge_total = parseInt(Number(item.recharge_total)) || "";
    },
    //搜索发放映币列表
    async searchList() {
      let begin_time = 0,
        end_time = 0;
      if (this.search.date !== null) {
        begin_time =
          new Date(this.search.date[0] + " 00:00:00").getTime() / 1000;
        end_time = new Date(this.search.date[1] + " 23:59:59").getTime() / 1000;
      }
      let req = {
        begin_time: begin_time,
        end_time: end_time,
        cp_id: this.search.cp_id,
        cp_nickname: this.search.cp_nickname,
        company_name: this.search.company_name,
        sponsor_id: this.search.sponsor_id,
        recharge_type: this.search.recharge_type,
        page_id: this.search.page_id,
        page_size: this.search.page_size
      };
      let res = await this.$api.getChargeList(this.$initReq(req));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.count = res.data.count || 0;
      } else {
        this.list = [];
        this.count = 0;
      }
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.searchList();
    },
    //searchBtnClick
    searchBtnClick() {
      this.search.page_id = 1;
      this.searchList();
    },
    //数字千位符格式化
    toThousands(num) {
      num = (num || 0).toString();
      let result = "", //最重结果
        decimal = "", // 小数部分
        index = num.indexOf("."); //小数点的index
      if (index !== -1) {
        decimal = num.substr(index).toString(); // 取出小数部分
        num = num.substr(0, index); // 取出整数数部分
      }
      while (num.length > 3) {
        result = "," + num.slice(-3) + result; //取出最后的三位正数加 ","
        num = num.slice(0, num.length - 3); // 取出剩余的整数，再重复
      }
      if (num) result = num + result + decimal; // 如果最后num还剩余整数，说明，num % 3 ！= 0 。
      return result;
    },
    //点击发放
    rechargeBtnClick() {
      this.rechargeForm = {
        type: 1,
        sponsor_id: "",
        company_name: "",
        list: [
          {
            cp_id: "",
            cp_nickname: "",
            recharge_total: "",
            cp_point: "",
            remark: ""
          }
        ]
      };
      this.rechargeFormVisible = true;
    },
    //切换发放方式
    changeRechargeType(type) {
      if (type == 1 || type == 2) {
        this.rechargeForm.sponsor_id = "";
        this.rechargeForm.company_name = "";
      }
      // this.type = type;
      this.rechargeForm.list.length = 0;
      this.rechargeForm.list.push({
        cp_id: "",
        cp_nickname: "",
        recharge_total: "",
        cp_point: "",
        remark: ""
      });
    },
    //点击添加按钮
    addRowBtnClick() {
      this.rechargeForm.list.push({
        cp_id: "",
        cp_nickname: "",
        recharge_total: "",
        cp_point: "",
        remark: ""
      });
    },
    //点击提交按钮
    async submitBtnClick() {
      if (this.rechargeForm.type == 3 || this.rechargeForm.type == 4) {
        if (this.rechargeForm.sponsor_id == "") {
          this.$message.error("请输入商户id");
          return false;
        }
        if (this.rechargeForm.company_name == "") {
          this.$message.error("请核对商户id和公司名称");
          return false;
        }
      }
      if (
        this.rechargeForm.list.some(item => {
          return item.cp_id == "";
        })
      ) {
        this.$message.error("请补全用户id");
        return false;
      }

      if (
        this.rechargeForm.list.some(item => {
          return item.cp_id == "";
        })
      ) {
        this.$message.error("请补全用户id");
        return false;
      }

      if (
        this.rechargeForm.list.some(item => {
          return item.cp_nickname == "";
        })
      ) {
        this.$message.error("请核对用户id和昵称");
        return false;
      }
      if (
        this.rechargeForm.list.some(item => {
          return item.sponsor_point == "";
        })
      ) {
        this.$message.error("请输入扣除金额");
        return false;
      }
      if (
        this.rechargeForm.list.some(item => {
          return item.recharge_total == "";
        })
      ) {
        this.$message.error("请输入发放金额");
        return false;
      }
      let arr = [];
      let changeList = this.rechargeForm.list.map(item => {
        return arr.push({
          cp_id: item.cp_id,
          cp_nickname: item.cp_nickname,
          sponsor_point: Number(item.sponsor_point) * 100, //商家扣除的金额
          recharge_total: Number(item.recharge_total), //博主实际得到的钱（发放金额）
          remark: item.remark
        });
      });
      console.log(changeList);
      let req = {
        sponsor_id: this.rechargeForm.sponsor_id,
        recharge_type: this.rechargeForm.type,
        recharge_list: arr
      };
      if (req.recharge_type == 1 || req.recharge_type == 2) {
        delete req.sponsor_id;
      }
      this.isPadding = true;
      let res = await this.$api.submmitCharge(req);
      if (res.error_code == 0) {
        this.rechargeFormVisible = false;
        this.search.page_id = 1;
        this.searchList();
      }
      this.isPadding = false;
    },
    //根据id获取博主密码 blurUserId
    async blurUserId(item) {
      let req = {
        cp_id: item.cp_id
      };
      if (req.cp_id == "") {
        this.$message.error("请输入用户id");
      } else {
        let res = await this.$api.userSearch(req);
        if (res.error_code == 0 && res.data) {
          item.cp_nickname = res.data.cp_nickname;
        } else {
          item.cp_nickname = "";
        }
      }
    },
    //获取商户名称
    async changeSponsorId(id) {
      let req = {
        page_id: 1,
        page_size: 1,
        sponsor_id: id,
        status: -1
      };
      let res = await this.$api.sponsorSearch(req);
      if (
        res.error_code == 0 &&
        res.data.sponsor_user &&
        res.data.sponsor_user.length > 0
      ) {
        this.rechargeForm.company_name = res.data.sponsor_user[0].company_name;
      } else {
        this.rechargeForm.company_name = "";
        this.$message.error("请核对商户id");
      }
    },
    //格式化金额
    // 1039393315054686208
    blurRechargeTotal(item) {
      let money;
      if (
        this.rechargeForm.type == 1 ||
        this.rechargeForm.type == 2 ||
        this.rechargeForm.type == 4
      ) {
        money = Number(item.sponsor_point);
      }
      if (this.rechargeForm.type == 3) {
        money = Math.floor(Number(item.sponsor_point * 0.6366));
      }

      if (isNaN(money)) {
        item.recharge_total = "";
      } else if (money > 0) {
        item.recharge_total = parseInt(money);
      } else {
        item.recharge_total = "";
      }
    },
    //删除条目
    delRow(item) {
      let currentIndex = this.rechargeForm.list.indexOf(item);
      this.rechargeForm.list.splice(currentIndex, 1);
    }
  }
};
</script>
<style lang="less" scoped>
.page-recharge-cp {
  .date-split {
    padding: 0 10px;
  }
}
</style>

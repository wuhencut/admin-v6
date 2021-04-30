<template>
  <div class="page">
    <el-tabs v-model="tabName">
      <!-- 删除微博 -->
      <!-- <el-tab-pane label="删除微博" name="first">
        <el-input
          v-model="weibo_id"
          type="textarea"
          :rows="4"
          placeholder="请输入要删除的微博"
        ></el-input>
        <el-button class="del-btn" type="primary" @click="delLink"
          >删除</el-button
        >
      </el-tab-pane> -->
      <!-- 解绑手机 -->
      <el-tab-pane label="解绑手机" name="second">
        <el-input
          v-model="phone"
          placeholder="请输入需要解绑的手机号"
        ></el-input>
        <p class="tip">tip: 未入驻情况下，解绑用户手机号</p>
        <el-button class="del-btn" type="primary" @click="resetPhone"
          >解绑</el-button
        >
      </el-tab-pane>
      <!-- <el-tab-pane label="重置订单" name="third">
        <el-input v-model="order.user_id" placeholder="请输入映兔id"></el-input>
        <el-input style="margin-top: 10px" v-model="order.order_id" placeholder="请输入订单id"></el-input>
        <p class="tip">tip: 关闭逾期订单，清除逾期记录并增加信用分</p>
        <el-button class="del-btn" type="primary" @click="resertOrder">重置</el-button>
      </el-tab-pane> -->
      <el-tab-pane label="重置密码" name="fourth">
        <el-input
          v-model="email"
          placeholder="输入需要重置密码的商家登录邮箱"
        ></el-input>
        <el-button class="del-btn" type="primary" @click="resetClick"
          >重置</el-button
        >
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="resetPassDg" title="确认重置">
      <p>企业名称: {{ companyData.company_name }}</p>
      <p>重置后密码: {{ companyData.pass }}</p>
      <div slot="footer">
        <el-button @click="resetPassDg = false">取消</el-button>
        <el-button @click="resetSponsorPass" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  name: "AdminReset",
  data() {
    return {
      weibo_id: "", // 微博id
      tabName: "second",
      phone: "+86", //手机号
      order: {
        user_id: "",
        order_id: ""
      },
      email: "", // 重置商家密码的邮箱
      resetPassDg: false, // 重置密码dg
      companyData: {
        company_name: "", // 等待重置的企业名称
        pass: "", // 重置后的密码
        user_id: "" // 商家id
      }
    };
  },
  mounted() {},
  watch: {
    weibo_id() {
      this.weibo_id = this.weibo_id.trim();
    }
  },
  methods: {
    // 点击重置
    async resetClick() {
      if (!this.email) {
        this.$message.error("不输入邮箱我怎么查？");
        return false;
      }
      let res = await this.$api.sponsorSearch({
        email: this.email,
        page_id: 1,
        page_size: 1
      });
      if (res.error_code == 0) {
        if (!res.data.sponsor_user) {
          this.$message.error("请输入正确的邮箱");
        } else {
          this.user_id = res.data.sponsor_user[0].sponsor_id || "";
          this.companyData = {
            company_name: res.data.sponsor_user[0].company_name,
            pass: res.data.sponsor_user[0].phone
          };
          this.resetPassDg = true;
        }
      }
    },
    async resetSponsorPass() {
      let res = await this.$api.resetSponsorPass({
        user_id: this.user_id,
        password: md5(this.companyData.pass)
      });
      if (res.error_code == 0) {
        this.$message.success("操作成功");
        this.resetPassDg = false;
      }
    },
    async resetPhone() {
      if (this.phone != "") {
        this.$confirm("此操作将重置手机号，是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          let res = await this.$api.unbindPhone({
            phone: this.phone
          });
          if (res.error_code == 0) {
            this.$message.success("解绑成功");
          }
        });
      }
    },
    // 重置订单
    async resertOrder() {
      if (this.order.order_id && this.order.user_id) {
        this.$confirm("此操作将重置订单，是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          let res = await this.$api.resetOrder(this.order);
          if (res.error_code == 0) {
            this.$message.success("重置成功");
          }
        });
      }
    },
    async delLink() {
      if (this.weibo_id != "") {
        this.$confirm("此操作将永久删除微博链接, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await this.$api.delWeiboLink({
              weibo_id: this.weibo_id + ""
            });
            if (res.error_code == 0) {
              this.$message.success("删除成功");
              this.weibo_id = "";
            }
          })
          .catch(err => {
            if (err) {
              this.$message.info(err);
            } else {
              this.$message.info("已取消");
            }
          });
      } else {
        this.$message.error("你不填，我删啥呢？");
      }
    }
  }
};
</script>
<style lang="less">
.page {
  .tip {
    padding-top: 20px;
    color: gray;
  }
  .del-btn {
    margin-top: 20px;
  }
}
</style>

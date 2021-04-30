<template>
  <div>
    <!--form-->
    <el-form inline>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="edit()">创建人员</el-button>
      </el-form-item>
      <!--<el-form-item label="选择角色">
                <el-select v-model="currentRole" value-key="id" placeholder="请选择角色">
                    <el-option v-for="item in roleList" :value="item.id" :key="item.id"
                               :label="item.label">
                    </el-option>
                </el-select>
			</el-form-item>-->
    </el-form>
    <!--/form-->
    <!--table-->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <!--<el-table-column label="Id" prop="id" width="200"></el-table-column>-->
      <el-table-column
        label="姓名"
        prop="nickname"
        min-width="200"
      ></el-table-column>
      <el-table-column
        label="账号名"
        prop="email"
        min-width="230"
      ></el-table-column>
      <el-table-column label="手机" prop="phone" width="150"></el-table-column>
      <el-table-column
        label="权限角色"
        prop="admin_role"
        width="150"
      ></el-table-column>
      <el-table-column label="账户状态" width="200">
        <template slot-scope="scope">
          <el-switch
            @change="sure(scope.row)"
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="禁用"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <p>
            <!--分配角色-->
            <el-button @click="edit(scope.row)">修改</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="创建/修改人员"
      :visible.sync="editDialog"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="adminInfo.nickname" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="adminInfo.phone" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="邮箱(账号)">
          <el-input v-model="adminInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="adminInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select
            v-model="currentRole"
            value-key="id"
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roleList"
              :value="item"
              :key="item.id"
              :label="item.name"
              :disabled="item.status == 0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="sure" type="primary">保存</el-button>
          <el-button @click="editDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import md5 from "js-md5";

export default {
  data() {
    return {
      moment: moment,
      //人员信息
      adminInfo: {
        nickname: "", //姓名
        phone: "", //电话
        email: "", //账号邮箱
        password: "", //密码
        user_id: "", //id
        admin_role: "", //角色
        status: "" //是够禁用 0： 启用， 1： 禁用
      },
      currentRole: {
        id: "3",
        label: "管理员"
      }, //当前状态
      editDialog: false,
      roleList: [], //角色列表
      isEdit: false //是否在编辑，控制name输入框
    };
  },
  mounted() {
    this.getRoleList(); //拉取角色列表
  },
  computed: {
    //人员列表
    list() {
      return this.$store.state.adminList;
    }
  },
  watch: {
    currentRole(val) {
      this.adminInfo.admin_role = val.id - 0;
      this.adminInfo.status = 1; //默认打开权限
    }
  },
  methods: {
    //创建  、修改 、查询 人员信息
    edit(row) {
      if (row) {
        this.adminInfo.admin_role = row.admin_role_id;
        this.adminInfo.email = row.email;
        this.adminInfo.nickname = row.nickname;
        this.adminInfo.phone = row.phone;
        this.adminInfo.status = row.status;
        this.adminInfo.user_id = row.user_id;
        this.currentRole = {
          id: row.admin_role_id + "",
          label: row.admin_role
        };
        this.isEdit = true; //name框不可编辑
      } else {
        this.isEdit = false; //name输入框可编辑
        this.adminInfo = {
          nickname: "", //姓名
          phone: "", //电话
          email: "", //账号邮箱
          password: "", //密码
          user_id: "", //id
          admin_role: "", //角色
          status: "" //是够禁用 1： 启用， 0： 禁用
        };
        this.currentRole = {
          id: "",
          label: ""
        };
      }
      this.editDialog = true;
    },
    //刷新人员列表
    async updateAdminList() {
      let response = await this.$api.listAdmin({});
      if (response.error_code == 0) {
        this.$store.dispatch("getAdminList", response.data.users);
      } else {
        this.$message.error(response.error_description);
      }
    },
    //获取角色列表
    async getRoleList() {
      let res = await this.$api.queryRoleInfo({
        status: -1
      });
      if (res.error_code == 0) {
        this.roleList = res.data.list || [];
      } else {
        this.roleList = [];
      }
    },
    //确认修改，新建admin
    async sure(row) {
      //如果row存在就是在切换switch
      if (row.user_id) {
        let res;
        try {
          res = await this.$api.updateAdminInfo({
            user_id: row.user_id,
            admin_role: this.currentRole - 0,
            status: row.status
          });
        } catch (e) {
          this.$message.error("服务请求异常");
          this.updateAdminList(); // 服务请求异常404，但是switch还是切换过去了，会导致视觉误差，以为生效了，但是还是报服务异常所以这里需要刷新。将switch恢复成api的数据显示
        }
        if (res.error_code == 0) {
          this.$message.success("修改成功");
          this.updateAdminList();
        } else {
          this.$message.error("修改失败");
          this.updateAdminList();
        }
      } else if (this.adminInfo.user_id) {
        //user_id存在，则在修改状态
        //只匹配-和_和数字和英文字母并以@ingtube.com结尾的邮箱，不符合就报错吧。
        //\w包含： 0-9 a-z A-Z _ 还有汉子。。所以当有多个_或者-就还能匹配，不够精准
        let reg = /^((_|-|\.)?[0-9a-zA-Z]+(-|_|\.)?)+(@ingtube.com)$/;
        if (
          !reg.test(this.adminInfo.email) ||
          this.adminInfo.email.replace(/@ingtube.com/g, "") == ""
        ) {
          this.$message.error("请输入正确的公司邮箱");
          return;
        }
        if (!/^1[345678]\d{9}$/.test(this.adminInfo.phone)) {
          this.$message.error("请填写正确的手机号");
          return;
        }
        let req;
        //当有密码的时候传密码，没写密码的时候就别传了，因为会把密码设置成空的
        if (this.adminInfo.password) {
          req = {
            status: this.adminInfo.status, //默认修改是开启的。
            admin_role: this.adminInfo.admin_role - 0,
            phone: this.adminInfo.phone,
            password: md5(this.adminInfo.password),
            email: this.adminInfo.email,
            user_id: this.adminInfo.user_id
          };
        } else {
          req = {
            status: this.adminInfo.status, //默认修改是开启的。
            admin_role: this.adminInfo.admin_role - 0,
            phone: this.adminInfo.phone,
            email: this.adminInfo.email,
            user_id: this.adminInfo.user_id
          };
        }
        let res = await this.$api.updateAdminInfo(req);
        if (res.error_code == 0) {
          this.$message.success("修改成功");
          this.editDialog = false;
          this.updateAdminList();
        }
      } else {
        //如果什么都不存在，就是在创建
        //在创建后 ,修改角色信息。
        let reg = /^((_|-|\.)?[0-9a-zA-Z]+(-|_|\.)?)+(@ingtube.com)$/;
        if (!reg.test(this.adminInfo.email)) {
          this.$message.error("请用正确的公司邮箱创建账号");
          return;
        }
        if (!/^1[345678]\d{9}$/.test(this.adminInfo.phone)) {
          this.$message.error("请填写正确的手机号");
          return;
        }
        let res = await this.$api.createAdmin({
          name: this.adminInfo.nickname,
          phone: this.adminInfo.phone,
          email: this.adminInfo.email,
          password: md5(this.adminInfo.password)
        });
        if (res.error_code == 0) {
          await this.updateAdminList(); // 先刷新列表
          let adminList = this.$store.state.adminList;
          let newAccount = adminList[adminList.length - 1]; //取到刚刚新建的账号
          let e = await this.$api.updateAdminInfo({
            admin_role: this.adminInfo.admin_role,
            user_id: newAccount.user_id, //对新创建的人员赋予角色
            status: 1 // 默认开启权限
          });
          if (e.error_code == 0) {
            this.updateAdminList(); //创建成功后刷新列表
            this.$message.success("创建成功");
            this.editDialog = false;
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped></style>

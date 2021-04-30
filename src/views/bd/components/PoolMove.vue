<template>
  <div class="page">
    <div v-if="!isMove">
      <el-dropdown @command="menuClick" trigger="click">
        <el-button type="primary"
          >{{ `${btnTxt}至` }} <i class="el-icon-arrow-down el-icon--right"></i
        ></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1">个人私有池</el-dropdown-item>
          <el-dropdown-item :command="2">个人发展池</el-dropdown-item>
          <el-dropdown-item :command="3" v-if="btnTxt == '转移'"
            >公司公海</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-else>
      <el-button type="primary" @click="moveClick">确认</el-button>
      <el-button @click="cancelClick">取消</el-button>
    </div>

    <el-dialog :visible.sync="dialog" :title="`转移至${pools[pool]}`">
      <el-table :data="selectedList">
        <el-table-column prop="sponsor_id" label="客户id"></el-table-column>
        <el-table-column prop="company_name" label="客户名称"></el-table-column>
        <el-table-column label="BD负责人">
          <template slot-scope="scope">
            {{ allAdmin[scope.row.bd_admin_id] }}
          </template>
        </el-table-column>
      </el-table>
      <div class="info">
        <div class="item" v-if="pool != 3">
          目标BD: &nbsp;
          <bd-select
            @change="getPoolCapacity"
            :disabled="!isCharge"
            class="search-inp"
            v-model="bd"
          ></bd-select>
        </div>
        <div class="item" v-if="pool != 3 && bd != ''">
          剩余容量:
          {{
            pool == 1
              ? 200 - poolCapacity.private_num
              : 200 - poolCapacity.develop_num
          }}
          个
        </div>
        <div class="item">本次{{ btnTxt }} : {{ selectedList.length }} 个</div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="dialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BdSelect from "../../../components/BdSelect";
import getUserInfo from "../../../api/getUserInfo";
export default {
  name: "PoolMove",
  components: {
    BdSelect
  },
  props: {
    selectedList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    btnTxt: String,
    isCharge: Boolean // 是否主管
  },
  data() {
    return {
      userInfo: getUserInfo(),
      dialog: false,
      pools: ["", "个人私有池", "个人发展池", "公司公海"],
      isMove: false,
      pool: null,
      bd: "",
      poolCapacity: {}, // 池容量
      poolMax: 200 // 个人池最大容量
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
  created() {},
  methods: {
    // 去重
    checkout() {
      if (!this.bd && this.pool != 3) {
        this.$message.error("请选择BD");
        return false;
      }
      if (
        this.pool == 1 &&
        this.poolCapacity.private_num + this.selectedList.length > 200
      ) {
        this.$message.error("超过个人私有池容量，请空余出容量再拾取");
        return false;
      }
      if (
        this.pool == 2 &&
        this.poolCapacity.develop_num + this.selectedList.length > 200
      ) {
        this.$message.error("超过个人发展池容量，请空余出容量再拾取");
        return false;
      }
      if (this.pool != 3) {
        let index = this.selectedList.findIndex(item => {
          return item.pool_type == this.pool && item.bd_admin_id == this.bd;
        });
        let sponsor = this.selectedList[index];
        if (index > -1) {
          this.$message.error(
            `"${sponsor.company_name}"已存在于${this.allAdmin[this.bd]}的${
              this.pools[this.pool]
            }中, 请重新选择`
          );
          return false;
        }
      }
      return true;
    },
    async submit() {
      if (this.checkout()) {
        let list = [];
        this.selectedList.map(item => {
          list.push({
            admin_id: item.bd_admin_id,
            sponsor_id: item.sponsor_id,
            pool_type: item.pool_type
          });
        });
        let res = await this.$api.movePool(
          this.$initReq({
            target_bd: this.pool == 3 ? "" : this.bd,
            target_pool: this.pool,
            operator_id: this.isCharge ? "" : this.userInfo.user_id,
            list: list,
            supervisor: this.isCharge
          })
        );
        if (res.error_code == 0) {
          this.$message.success("操作成功");
          this.dialog = false;
          this.$emit("update");
        }
      }
    },
    // 获取池容量
    async getPoolCapacity() {
      let res = await this.$api.getPoolCapacity({ admin_id: this.bd });
      if (res.error_code == 0) {
        this.poolCapacity = res.data || {
          private_num: 0,
          develop_num: 0
        };
      }
    },
    moveClick() {
      if (this.selectedList.length == 0) {
        this.$message.error("请勾选");
        return false;
      }
      if (!this.isCharge) {
        this.bd = this.userInfo.user_id;
        this.getPoolCapacity();
      } else {
        this.bd = "";
      }
      this.dialog = true;
    },
    menuClick(val) {
      this.isMove = true;
      this.pool = val;
      this.$emit("menuClick", val);
    },
    cancelClick() {
      this.isMove = false;
      this.$emit("cancelClick");
    }
  }
};
</script>
<style lang="less">
.page {
  .info {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    .item {
      display: flex;
    }
  }
}
</style>

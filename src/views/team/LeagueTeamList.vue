<template>
  <div class="league-list">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <team-search
            v-model="s_team_name"
            @select="handleSelectOne"
          ></team-search>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            v-model.trim="o_leader_id"
            placeholder="队长ID"
            :disabled="disabled1"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <blogger-search
            v-model.trim="nickname"
            @select="handleSelectTwo"
            :disabled="disabled2"
            @changeState="changeState"
            placeholder="队长昵称"
          ></blogger-search>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchBtnClick"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            type="primary"
            @click="updateTeam(true)"
            v-if="authList.indexOf('id1611662664') > -1"
            >创建战队</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="list">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="联盟战队" prop="team_name"></el-table-column>
        <el-table-column label="战队人数" prop="member_count"></el-table-column>
        <el-table-column
          label="战队队长"
          prop="leader_nickname"
        ></el-table-column>
        <el-table-column label="本月积分" prop="team_score"></el-table-column>
        <el-table-column
          label="本月定制/单"
          prop="current_num"
        ></el-table-column>
        <el-table-column label="累计定制/单" prop="total_num"></el-table-column>
        <el-table-column label="操作" min-width="130px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="updateTeam(false, scope.row)"
              v-if="authList.indexOf('id1611662696') > -1"
              >战队改名</el-button
            >
            <el-button
              type="text"
              @click="goMember(scope.row)"
              v-if="
                scope.row.member_count > 0 &&
                  authList.indexOf('id1611662732') > -1
              "
              >成员列表</el-button
            >
            <el-button
              type="text"
              @click="deleteTeam(scope.row.team_id, scope.row.member_count)"
              v-if="authList.indexOf('id1611662755') > -1"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-if="total !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 创建/编辑战队名字弹窗 -->
    <el-dialog
      :title="flag == true ? '创建战队' : '战队改名'"
      :visible.sync="createDg"
      width="500px"
    >
      <el-form inline :model="form" ref="form">
        <el-form-item
          label="联盟战队"
          label-width="100px"
          prop="team_name"
          :rules="[
            { required: true, message: '请输入战队名称', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model.trim="form.team_name"
            placeholder="请输入战队名称"
            maxlength="20"
            show-word-limit
            style="width:350px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDg = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtnClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 战队成员列表 -->
    <el-dialog title="成员列表" :visible.sync="memberDg" width="800px">
      <div class="member">
        <div>
          <span><b>联盟战队</b></span>
          <span class="margin">{{ team_name }}</span>
        </div>
        <div>
          <span><b>战队队长</b></span>
          <span class="margin">{{ leader_nickname }}</span>
          <span class="margin">{{ leader_id }}</span>
        </div>
      </div>
      <el-table :data="innerList" style="margin-top:30px">
        <el-table-column label="战队成员" prop="nickname"></el-table-column>
        <el-table-column label="合作渠道">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.source" :key="index">
              {{ $getPlatformName(item) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="本月积分"
          prop="current_score"
        ></el-table-column>
        <el-table-column label="累计贡献" prop="total_score"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="
                scope.row.is_leader == false &&
                  authList.indexOf('id1611663165') > -1
              "
              @click="setLeader(scope.row)"
              >设为队长</el-button
            >
            <el-tag type="success" v-if="scope.row.is_leader == true"
              >战队队长</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="innerTotal > 0">
        <el-pagination
          small
          layout="total, prev, pager, next"
          :total="innerTotal"
          @current-change="currentChange"
          :page-size="page_size"
          :current-page="page_id"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 删除转移战队弹窗 -->
    <el-dialog :visible.sync="deleteDg" width="30%">
      <i style="color:red;font-size:18px" class="el-icon-error"></i
      ><span style="font-size:16px;margin-left:10px;">确定删除该战队？</span>
      <div v-if="member_count > 0">
        <p class="top">
          该战队{{ member_count }}名成员需要重新转移战队，请选择！
        </p>
        <el-autocomplete
          class="top"
          style="width:100%"
          v-model="changed_team_name"
          :fetch-suggestions="filterTeam"
          placeholder="请选择战队"
          @select="handleSelectThree"
        ></el-autocomplete>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDg = false">取 消</el-button>
        <el-button type="primary" @click="deleteConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认修改队长弹框 -->
    <el-dialog :visible.sync="updateLeaderDg" width="500px">
      <i style="color:orange;font-size:18px" class="el-icon-warning"></i
      ><span style="font-size:16px;margin-left:10px;">确定修改队长？</span>
      <p class="top">
        是否确认将【{{ l_nickname }}】设置为【{{ team_name }}】队长？
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateLeaderDg = false">取 消</el-button>
        <el-button type="primary" @click="updateLeaderClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPlatformName } from "../../utils/platform";
import TeamSearch from "../team/components/teamSearch";
import BloggerSearch from "../team/components/bloggerSearch";
export default {
  components: {
    TeamSearch,
    BloggerSearch
  },
  data() {
    return {
      createDg: false, //创建战队弹窗
      memberDg: false, //成员列表弹窗
      deleteDg: false, //删除战队弹窗
      updateLeaderDg: false, //修改队长弹框
      nickname: "", //查询队长昵称
      flag: "", //创建和编辑的弹窗标题控制
      s_team_name: "", //查询联盟战队
      team_name: "", //展示用
      team_id: "", //展示用
      d_team_id: "", //需要删除的team_id
      leader_nickname: "", //展示用
      leader_id: "",
      o_leader_id: "", //搜索用id
      cp_id: "",
      changed_team_id: "", //转移后的联盟战队ID
      changed_team_name: "", //搜索转移的战队
      member_count: "", //需要转移的人数
      l_nickname: "", //展示用
      l_team_name: "", //展示用
      total: 0, //总条数
      innerTotal: "", //弹框里总条数
      cpList: [],
      page_id: 1,
      page_size: 5,
      disabled1: false,
      disabled2: false,
      search: {
        team_id: "",
        leader_id: "",
        leader_nickname: "",
        page_id: 1,
        page_size: 10
      },
      message: {},
      list: [],
      innerList: [],
      teamList: [],
      form: {
        team_name: ""
      }
    };
  },
  watch: {
    o_leader_id() {
      if (this.o_leader_id !== "") {
        this.disabled2 = true;
        this.search.leader_id = this.o_leader_id;
      } else {
        this.disabled2 = false;
        this.search.leader_id = "";
        this.searchBtnClick();
      }
    },
    nickname(val) {
      if (val !== "") {
        this.disabled1 = true;
      } else {
        this.disabled1 = false;
      }
    }
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
    getPlatformName: getPlatformName,
    changeState(value) {
      this.nickname = value;
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getTeamList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    handleSelectOne(item) {
      this.search.team_id = item;
      this.searchBtnClick();
    },
    handleSelectTwo(item) {
      this.search.leader_id = item;
      this.searchBtnClick();
    },
    handleSelectThree(item) {
      this.changed_team_id = item.team_id;
    },
    //筛选战队
    async filterTeam(queryString, cb) {
      if (queryString === "") {
        cb([]);
        return false;
      }
      let req = {
        team_name: queryString
      };
      let res = await this.$api.getTeamName(req);
      if (res.error_code == 0) {
        this.teamList = res.data.list || [];
        for (let i = 0; i < this.teamList.length; i++) {
          this.teamList[i].value = this.teamList[i].team_name;
        }
      } else {
        this.teamList = [];
      }
      cb(this.teamList);
    },
    //创建战队弹框
    updateTeam(flag, message) {
      this.message = message;
      this.flag = flag;
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      if (flag == true) {
        this.form.team_name = "";
      } else {
        this.form.team_name = this.message.team_name;
      }
      this.createDg = true;
    },
    //创建战队确认
    confirmBtnClick() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.flag == true) {
            let res = await this.$api.createTeam({
              team_name: this.form.team_name
            });
            if (res.error_code == 0) {
              this.$message.success("创建成功！");
              this.createDg = false;
              this.queryList();
            }
          } else {
            let res = await this.$api.updateTeam({
              team_name: this.form.team_name,
              team_id: this.message.team_id
            });
            if (res.error_code == 0) {
              this.$message.success("修改成功！");
              this.createDg = false;
              this.queryList();
            }
          }
        } else {
          return false;
        }
      });
    },
    //获取成员列表
    async goMember(item) {
      this.page_id = 1;
      this.team_name = item.team_name;
      this.team_id = item.team_id;
      await this.getMemberList();
      this.memberDg = true;
    },
    //获取成员列表
    async getMemberList() {
      let req = {
        team_id: this.team_id,
        page_id: this.page_id,
        page_size: this.page_size
      };
      let res = await this.$api.getMemberDetail(req);
      if (res.error_code == 0) {
        this.innerList = res.data.list || [];
        this.innerTotal = res.data.count;
        this.leader_nickname = res.data.leader_nickname;
        this.leader_id = res.data.leader_id;
      }
    },
    //删除战队
    deleteTeam(team_id, member_count) {
      this.changed_team_name = "";
      this.deleteDg = true;
      this.member_count = member_count;
      this.d_team_id = team_id;
    },
    //确认删除战队
    async deleteConfirm() {
      if (this.member_count > 1 && this.changed_team_name == "") {
        this.$message.error("请选择转移后的战队！");
        return false;
      }
      let req = {
        team_id: this.d_team_id,
        new_team_id: this.changed_team_id
      };
      if (this.member_count < 1) {
        delete req.new_team_id;
      }
      let res = await this.$api.deleteTeam(this.$initReq(req));
      if (res.error_code == 0) {
        this.$message.success("删除成功！");
        this.deleteDg = false;
        this.queryList();
      }
    },
    //设置队长
    setLeader(item) {
      this.l_nickname = item.nickname;
      this.updateLeaderDg = true;
      this.cp_id = item.cp_id;
    },
    async updateLeaderClick() {
      let req = {
        team_id: this.team_id,
        cp_id: this.cp_id
      };
      this.getMemberList();
      let res = await this.$api.updateTeamLeader(req);
      if (res.error_code == 0) {
        this.$message.success("设置成功！");
        this.updateLeaderDg = false;
        this.page_id = 1;
        this.getMemberList();
        this.queryList();
      }
    },
    close() {
      this.memberDg = false;
      this.queryList();
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    },
    currentChange(num) {
      this.page_id = num;
      this.getMemberList();
    }
  }
};
</script>
<style scoped>
.member {
  display: flex;
  justify-content: space-evenly;
  padding: 0 30px;
}
.margin {
  margin-left: 20px;
}
.top {
  margin-top: 10px;
}
</style>

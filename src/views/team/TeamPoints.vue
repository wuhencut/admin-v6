<template>
  <div class="team-list">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <el-input
            placeholder="博主ID"
            class="search-inp"
            v-model.trim="f_cp_id"
            :disabled="disabled1"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <blogger-search
            v-model.trim="s_cp_id"
            @select="handleSelect"
            :disabled="disabled2"
            @changeState="changeState"
            placeholder="博主昵称"
          ></blogger-search>
        </el-form-item>
        <el-form-item>
          <team-search
            v-model="s_team_name"
            @select="handleSelectTeam"
          ></team-search>
        </el-form-item>
        <el-form-item>
          <el-select
            placeholder="积分类型"
            class="search-inp"
            v-model="search.score_type"
            @change="searchBtnClick"
          >
            <el-option value label="全部积分类型"></el-option>
            <el-option label="规模分" :value="'1'"></el-option>
            <el-option label="活动分" :value="'2'"></el-option>
            <el-option label="创意分" :value="'3'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分时间">
          <el-date-picker
            class="search-time"
            type="daterange"
            align="right"
            v-model="dateTime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="searchBtnClick"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            type="primary"
            @click="addPoints"
            v-if="authList.indexOf('id1611713705') > -1"
            >增加积分</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="list">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="博主昵称">
          <template slot-scope="scope">
            <p>{{ scope.row.cp_nickname }}</p>
            <p>{{ scope.row.cp_id }}</p>
          </template>
        </el-table-column>
        <el-table-column label="积分类型" prop="score_type">
          <template slot-scope="scope">
            <p v-show="scope.row.score_type == '1'">规模分</p>
            <p v-show="scope.row.score_type == '2'">活动分</p>
            <p v-show="scope.row.score_type == '3'">创意分</p>
          </template>
        </el-table-column>
        <el-table-column
          label="所属联盟战队"
          prop="team_name"
        ></el-table-column>
        <el-table-column label="积分变化" prop="score"></el-table-column>
        <el-table-column label="积分备注" prop="remark"></el-table-column>
        <el-table-column label="积分时间">
          <template slot-scope="scope">
            <p>
              {{
                moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="
                scope.row.can_delete && authList.indexOf('id1611713735') > -1
              "
              @click="deteleBtnClick(scope.row.score_id)"
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
    <el-dialog title="增加积分" :visible.sync="pointsDg" width="800px">
      <el-form :model="scoreItem" ref="scoreItem">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="映兔ID" label-width="90px">
              <el-input
                v-model.trim="scoreItem.cp_id"
                @blur="getMessage"
                maxlength="19"
              ></el-input>
              <p
                style="color:red;font-size:12px"
                v-show="status !== '' && status == false"
              >
                非联盟定制博主，请检查！
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="映兔昵称" label-width="90px">
              <el-input v-model="cp_nickname" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="联盟战队" label-width="90px">
              <el-input v-model="this.team_name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="积分值" label-width="90px">
              <el-input-number
                :min="1"
                :max="10"
                label="描述文字"
                v-model="scoreItem.score"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="积分类型" label-width="90px">
              <el-select v-model="scoreItem.score_type" disabled>
                <el-option label="规模分" :value="'1'"></el-option>
                <el-option label="活动分" :value="'2'"></el-option>
                <el-option label="创意分" :value="'3'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="活动编号" label-width="90px">
              <el-input
                v-model.trim="scoreItem.campaign_id"
                @blur="getActivityName(scoreItem.campaign_id)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="活动名称" label-width="90px">
              <el-input v-model="topic_name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="pointsDg = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtnClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import BloggerSearch from "../team/components/bloggerSearch";
import TeamSearch from "../team/components/teamSearch";
export default {
  components: {
    BloggerSearch,
    TeamSearch
  },
  data() {
    return {
      moment: moment,
      pointsDg: false,
      dateTime: [],
      disabled1: false,
      disabled2: false,
      f_cp_id: "",
      s_cp_id: "",
      status: "",
      nameList: [],
      list: [],
      teamList: [],
      total: 0,
      cp_nickname: "",
      topic_name: "",
      team_name: "",
      s_team_name: "", //搜索战队
      search: {
        cp_id: "",
        team_id: "",
        score_type: "",
        create_time_gte: 0,
        create_time_lte: 0,
        page_id: 1,
        page_size: 10
      },
      scoreItem: {
        cp_id: "",
        score_type: "3",
        score: 0,
        campaign_id: "" //活动ID
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    "scoreItem.cp_id"(val) {
      if (val == "") {
        this.team_name = "";
        this.cp_nickname = "";
        this.is_league = "";
      }
    },
    dateTime(val) {
      if (!val) {
        this.search.create_time_gte = 0;
        this.search.create_time_lte = 0;
      } else {
        this.search.create_time_gte = moment(val[0]).unix();
        this.search.create_time_lte = moment(val[1]).unix();
      }
    },
    f_cp_id() {
      if (this.f_cp_id !== "") {
        this.disabled2 = true;
        this.search.cp_id = this.f_cp_id;
      } else {
        this.disabled2 = false;
        this.search.cp_id = "";
        this.searchBtnClick();
      }
    },
    s_cp_id(val) {
      if (val !== "") {
        this.disabled1 = true;
      } else {
        this.disabled1 = false;
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    changeState(value) {
      this.s_cp_id = value;
    },
    async getActivityName(item) {
      if (item !== "") {
        let res = await this.$api.getActivityDetail({ campaign_id: item });
        if (res.error_code == 0) {
          this.topic_name = res.data.campaign_name;
        }
      }
    },
    handleSelect(item) {
      this.search.cp_id = item;
      this.searchBtnClick();
    },
    handleSelectTeam(item) {
      this.search.team_id = item;
      this.searchBtnClick();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getTeamScoreList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    //删除定制积分
    async deteleBtnClick(data) {
      this.$confirm("确认删除积分?", "提示", {
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.deleteCustomScore({ score_id: data });
          if (res.error_code == 0) {
            this.queryList();
            this.reasonDg = false;
          }
        })
        .catch(async () => {
          this.reasonDg = false;
        });
    },
    addPoints() {
      this.scoreItem = {
        cp_id: "",
        score_type: "3",
        score: 0,
        campaign_id: "" //活动ID
      };
      this.topic_name = "";
      this.status = "";
      this.pointsDg = true;
    },
    //确认添加积分
    async confirmBtnClick() {
      if (this.scoreItem.cp_id == "") {
        this.$message.error("请输入映兔ID");
        return false;
      }
      if (this.status == false) {
        this.$message.error("非联盟定制博主，请检查！");
        return false;
      }
      if (this.scoreItem.campaign_id == "") {
        this.$message.error("请输入活动编号");
        return false;
      }
      if (this.topic_name == "") {
        this.$message.error("请输入正确的活动编号");
        return false;
      }
      let res = await this.$api.addCustomScore(this.scoreItem);
      if (res.error_code == 0) {
        this.$message.success("添加成功！");
        this.queryList();
        this.pointsDg = false;
      }
    },
    async getMessage() {
      if (this.scoreItem.cp_id !== "") {
        let res = await this.$api.getBloggerMessage({
          cp_id: this.scoreItem.cp_id
        });
        if (res.error_code == 0) {
          this.cp_nickname = res.data.nickname;
          this.status = res.data.is_league;
          this.team_name = res.data.team_name;
        }
      }
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    }
  }
};
</script>
<style scoped></style>

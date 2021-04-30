<template>
  <div class="cp-punish">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
          v-model.trim="search.cp_id"
          placeholder="映兔ID"
          maxlength="19"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
          v-model.trim="search.cp_nickname"
          placeholder="映兔昵称"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
          v-model.trim="search.reason"
          placeholder="处罚原因"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          placeholder="处罚状态"
          v-model="search.punish_status"
          @change="searchBtnClick"
        >
          <el-option label="全部状态" :value="0"></el-option>
          <el-option label="待处罚" :value="1"></el-option>
          <el-option label="处罚中" :value="2"></el-option>
          <el-option label="已撤销" :value="3"></el-option>
          <el-option label="已完成" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtnClick" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button @click="refreshBtnClick" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
      <br />
      <el-form-item v-if="authList.indexOf('id94') > -1">
        <el-button @click="createKill" type="primary" icon="el-icon-aim"
          >创建处罚</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="映兔ID" prop="cp_id"></el-table-column>
      <el-table-column label="映兔昵称" prop="cp_nickname"></el-table-column>
      <el-table-column label="处罚原因" prop="punish_reason"></el-table-column>
      <el-table-column label="处罚状态" prop="punish_status">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.punish_status == 1"
            style="background:#909399;color:white;display;none"
            >已撤销</el-tag
          >
          <el-tag
            v-if="
              scope.row.punish_status != 1 && currentTime < scope.row.start_time
            "
            style="background:#F88F6C;color:white;display;none"
            >待处罚</el-tag
          >
          <el-tag
            v-if="
              scope.row.start_time < currentTime &&
                currentTime < scope.row.end_time &&
                scope.row.punish_status != 1
            "
            style="background:#F56C6C;color:white;display;none"
            >处罚中</el-tag
          >

          <el-tag
            v-if="
              scope.row.punish_status != 1 && scope.row.end_time < currentTime
            "
            style="background:#8CDCC7;color:white;display;none"
            >已完成</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="处罚周期" prop="period">
        <template slot-scope="scope">
          <p v-if="scope.row.punish_type == 1">{{ scope.row.period }}</p>
          <p v-else>永久</p>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="create_admin_id">
        <template slot-scope="scope">
          <p v-if="scope.row.create_admin_id == 0">admin</p>
          <p v-else>{{ allAdmin[scope.row.create_admin_id] }}</p>
        </template>
      </el-table-column>
      <el-table-column label="处罚时间">
        <template slot-scope="scope">
          <div>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="getDetail(scope.row)"
              >查看详情</el-button
            >
            <el-button
              v-if="
                scope.row.punish_status != 1 &&
                  scope.row.end_time > currentTime &&
                  authList.indexOf('id94') > -1
              "
              @click="adoptBtnClick(scope.row.id)"
              type="text"
              >撤销</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- pagination -->
    <!-- 创建追杀dialog -->
    <el-dialog
      title="创建处罚"
      :visible.sync="newKillDg"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="killForm"
        label-width="85px"
        label-position="left"
        :rules="rules"
        ref="killForm"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="cp_id" label="映兔ID：" label-width="95px">
              <el-input
                :maxlength="19"
                placeholder="请输入"
                style="width:200px"
                v-model="killForm.cp_id"
                @blur="getBloggerMessage"
              ></el-input>
              <div style="color:red;font-size:12px" v-show="validtime">
                <span v-if="currentType == 1"
                  >该账户已被降权处罚，处罚期限：{{
                    moment(validtime * 1000).format("YYYY-MM-DD HH:mm")
                  }}</span
                >
                <span v-else>该账户已被禁权处罚，处罚期限：永久</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="nickname" label="映兔昵称：" label-width="95px">
              <el-input
                :maxlength="30"
                placeholder="请输入"
                v-model="nickname"
                style="width:200px"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="处罚类型：" label-width="95px">
              <el-select
                style="width:200px"
                v-model="killForm.punish_type"
                @change="changeType(killForm.punish_type)"
                :disabled="close"
              >
                <el-option label="降权处罚" :value="1"></el-option>
                <el-option label="禁权处罚" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="处罚周期：" label-width="95px">
              <div v-if="killForm.punish_type == 1">
                <el-input-number
                  v-model="killForm.period"
                  :precision="0"
                  :min="1"
                  :max="99"
                  :disabled="close"
                ></el-input-number>
                周
              </div>
              <div v-else>
                <el-input value="永久" style="width:200px" disabled></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间：" label-width="95px">
              <el-date-picker
                style="width:200px"
                type="datetime"
                placeholder="选择开始日期时间"
                :picker-options="startTimeOptions"
                v-model="start_date"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                disabled
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结束时间："
              label-width="95px"
              v-show="killForm.punish_type == 1"
            >
              <el-date-picker
                style="width:200px"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="endTimeOptions"
                v-model="end_date"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                disabled
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="处罚原因：" label-width="95px" prop="reason">
              <el-input
                style="width:300px"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="killForm.reason"
                :maxlength="150"
                :disabled="close"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newKillDg = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmClick"
          :disabled="createConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 创建追杀dialog -->

    <!-- 查看详情dialog -->
    <el-dialog title="查看详情" :visible.sync="DetailDg" width="800px">
      <el-form label-width="80px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID：" label-width="95px">
              <span>{{ showdetail.cp_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称：" label-width="95px">
              <span>{{ showdetail.cp_nickname }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="处罚类型：" label-width="95px">
              <span v-if="showdetail.punish_type == 1">降权处罚</span>
              <span v-if="showdetail.punish_type == 2">禁权处罚</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处罚周期：" label-width="95px">
              <span v-if="showdetail.punish_type == 1"
                >{{ showdetail.period }}周</span
              >
              <span v-else>永久</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间：" label-width="95px">
              <span>{{
                moment(showdetail.start_time * 1000).format("YYYY-MM-DD HH:mm")
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结束时间："
              label-width="95px"
              v-if="showdetail.punish_type == 1"
            >
              <span>{{
                moment(showdetail.end_time * 1000).format("YYYY-MM-DD HH:mm")
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="处罚原因：" label-width="95px">
              <span>{{ showdetail.punish_reason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <table border="0" style="border: 1px solid #ccc" rules="rows">
          <tr>
            <th style="width:300px;height:35px;background:#F0F0F0">步骤</th>
            <th style="width:300px;background:#F0F0F0">时间</th>
            <th style="width:300px;background:#F0F0F0">操作人</th>
          </tr>
          <tr v-if="showdetail.create_time > 0" style="height:30px">
            <td align="center"><div>创建处罚</div></td>
            <td align="center">
              <div>
                {{
                  moment(showdetail.create_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}
              </div>
            </td>
            <td align="center">
              <div v-if="showdetail.create_admin_id == 0">admin</div>
              <div>{{ allAdmin[showdetail.create_admin_id] }}</div>
            </td>
          </tr>
          <tr
            v-if="showdetail.end_time > 0 && showdetail.punish_status != 1"
            style="height:30px"
          >
            <td align="center"><div>结束处罚</div></td>
            <td align="center">
              <div v-if="showdetail.punish_type == 1">
                {{
                  moment(showdetail.end_time * 1000).format("YYYY-MM-DD HH:mm")
                }}
              </div>
              <div v-else>永久</div>
            </td>
            <td align="center"><div></div></td>
          </tr>
          <tr v-if="showdetail.revoke_time > 0">
            <td align="center"><div>撤销处罚</div></td>
            <td align="center">
              <div>
                {{
                  moment(showdetail.revoke_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}
              </div>
            </td>
            <td align="center">
              <div>{{ allAdmin[showdetail.revoke_admin_id] }}</div>
            </td>
          </tr>
        </table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DetailDg = false" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情dialog -->
    <!-- 撤销dialog -->
    <el-dialog :visible.sync="cancelDg" width="300px">
      <p>
        <img
          src="../../../static/img/icon-chexiao.png"
          alt=""
          style="vertical-align: text-bottom;"
        /><span style="margin-left:10px">确定撤销改处罚操作？</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDg = false">取 消</el-button>
        <el-button type="primary" @click="cancelConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 撤销dialog -->
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      newKillDg: false, //创建追杀dg
      DetailDg: false, //查看详情dg
      cancelDg: false, //撤销dg
      cancelID: "", //要撤销的ID
      start_date: "",
      start_date1: "",
      showdetail: "", //查看详情
      validtime: "", //当下处罚时间
      currentType: "", //当下处罚状态
      currentTime: "", //加载列表时的时间
      close: false,
      createConfirm: false,
      total: 0,
      status: "",
      list: [],
      nickname: "",
      search: {
        cp_id: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        reason: "",
        punish_status: 0
      },
      killForm: {
        id: "",
        nickname: "",
        punish_type: "1",
        period: "", //追杀周数
        reason: ""
      },
      rules: {
        cp_id: [
          {
            required: true,
            message: "请输入映兔ID",
            trigger: "blur"
          }
        ],
        reason: [
          {
            required: true,
            message: "请输入处罚原因",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    startTimeOptions() {
      let endTime = new Date().getTime();
      return {
        disabledDate(time) {
          return time.getTime() < endTime - 1 * 24 * 3600 * 1000;
        }
      };
    },
    endTimeOptions() {
      let start_time = new Date(this.start_time).getTime();
      return {
        disabledDate(time) {
          return time.getTime() < start_time;
        }
      };
    },
    end_date: function() {
      let start_time = new Date(this.start_date).getTime();
      let period = this.killForm.period;
      return moment(start_time + period * 7 * 24 * 3600 * 1000).format(
        "YYYY-MM-DD HH:mm"
      );
    }
  },
  watch: {
    start_date(value) {
      this.start_date1 = moment(new Date(value).getTime()).format("YYYY-MM-DD");
      let date = moment();
      if (value == date.format("YYYY-MM-DD")) {
        this.start_date = date(value).format("YYYY-MM-DD HH:mm");
      }
    },
    "killForm.cp_id"() {
      this.nickname = "";
    }
  },
  mounted() {
    this.listCate();
  },
  methods: {
    getcurrentTime() {
      this.currentTime = new Date().getTime() / 1000;
    },
    changeType(type) {
      if (type == 1) {
        this.killForm.period = 1;
      }
      if (type == 2) {
        this.killForm.period = 100;
      }
    },
    async listCate() {
      let res = await this.$api.getPunishList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.total = res.data.count;
        this.getcurrentTime();
      }
    },
    createKill() {
      //创建追杀按钮
      this.newKillDg = true;
      this.createConfirm = false;
      this.close = false;
      this.validtime = "";
      this.killForm = {
        cp_id: "",
        reason: "",
        punish_type: 1,
        period: "1"
      };
      if (this.$refs.killForm) {
        this.$refs.killForm.clearValidate();
      }
      let now = new Date().getTime();
      let start_date = now;
      this.start_date = moment(start_date).format("YYYY-MM-DD HH:mm:ss"); //点击以后创建追杀时间显示当前时间
    },
    getDetail(item) {
      this.showdetail = item;
      this.DetailDg = true;
    },
    confirmClick() {
      this.$refs.killForm.validate(async ok => {
        if (ok) {
          let params = {
            cp_id: this.killForm.cp_id,
            reason: this.killForm.reason,
            type: this.killForm.punish_type, //降权1,禁权2
            period: this.killForm.period
          };
          let res = await this.$api.createPunish(params);
          if (res.error_code == 0) {
            this.$message.success("创建成功");
            this.listCate();
            this.newKillDg = false;
          }
        } else {
          return false;
        }
      });
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.listCate();
    },
    //重置
    refreshBtnClick() {
      this.search = {
        cp_id: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        reason: "",
        punish_status: 0
      };
      this.searchBtnClick();
    },
    getBloggerMessage() {
      this.getBloggerName();
      this.getBloggerStatus();
    },
    //自动根据id键入映兔名搜索
    async getBloggerName() {
      if (this.killForm.cp_id == "") {
        return false;
      }
      let req = {
        cp_id: this.killForm.cp_id || "0",
        status: -1,
        page_id: 1,
        page_size: 1,
        level: -1 //博主等级
      };
      let res = await this.$api.cpSearch(req);
      if (res.error_code == 0) {
        if (res.data && res.data.list && res.data.list.length == 1) {
          this.nickname = res.data.list[0].cp_nickname;
        }
      }
    },
    //根据id获得现在该博主的处罚状态
    async getBloggerStatus() {
      if (this.killForm.cp_id == "") {
        return false;
      }
      let params = {
        cp_id: this.killForm.cp_id
      };
      let res = await this.$api.getNowValidtime(params);
      if (res.error_code == 0) {
        this.validtime = res.data.latest_valid_punish_time;
        this.currentType = res.data.type;
        if (res.data.type == 1) {
          this.start_date = moment(this.validtime * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        if (res.data.type == 2) {
          this.close = true;
          this.createConfirm = true;
        }
      }
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      // debugger;
      this.listCate();
    },
    //点击撤销按钮
    adoptBtnClick(id) {
      this.cancelID = id;
      this.cancelDg = true;
    },
    async cancelConfirm() {
      let params = {
        id: this.cancelID
      };
      let res = await this.$api.cancelBloggerPunish(params);
      if (res.error_code == 0) {
        this.$message.success("撤销成功");
        this.listCate();
        this.cancelDg = false;
      }
    }
  }
};
</script>

<style lang="less" scoped></style>

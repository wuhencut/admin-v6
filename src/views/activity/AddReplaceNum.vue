<template>
  <div class="page-addreplace">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.sponsor_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="企业ID"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.company_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          @change="searchBtnClick"
          v-model="search.sponsor_level"
        >
          <el-option value label="全部商户等级"></el-option>
          <el-option value="KA" label="KA"></el-option>
          <el-option value="A" label="A"></el-option>
          <el-option value="B" label="B"></el-option>
        </el-select>
      </el-form-item>
      <!-- BD负责人项 -->
      <el-form-item>
        <bd-select
          class="search-inp"
          v-model="search.bd_admin_id"
          isAll
          isNew
          @change="searchBtnClick"
        ></bd-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.type"
          @change="searchBtnClick"
        >
          <el-option :value="0" label="全部分类"></el-option>
          <el-option :value="1" label="商家购买"></el-option>
          <el-option :value="2" label="充值福利"></el-option>
          <el-option :value="3" label="商户补偿"></el-option>
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
      <el-form-item v-if="authList.indexOf('id101') > -1">
        <el-button @click="addNum" type="primary">增加次数</el-button>
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="企业ID" prop="sponsor_id"></el-table-column>
      <el-table-column label="企业名称" prop="company_name"></el-table-column>
      <el-table-column label="商户等级" prop="sponsor_level"></el-table-column>
      <el-table-column label="BD负责人">
        <template slot-scope="scope">{{
          allAdmin[scope.row.bd_admin_id]
        }}</template>
      </el-table-column>
      <el-table-column label="分类">
        <template slot-scope="scope">
          <p v-if="scope.row.type == 1">商家购买</p>
          <p v-if="scope.row.type == 2">充值福利</p>
          <p v-if="scope.row.type == 3">商户补偿</p>
        </template>
      </el-table-column>
      <el-table-column label="次数" prop="num"></el-table-column>
      <el-table-column label="创建人" prop="admin_id">
        <template slot-scope="scope">
          <p v-if="scope.row.admin_id == 0">admin</p>
          <p v-else>{{ allAdmin[scope.row.admin_id] }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <p>
            <el-button
              v-if="authList.indexOf('id116') > -1"
              @click="infoBtnClick(scope.row)"
              type="text"
              >查看详情</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!--page-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="10"
        :total="count"
      ></el-pagination>
    </div>
    <!--/page-->
    <!-- 增加次数弹框 -->
    <el-dialog title="增加次数" :visible.sync="addNumDialog" width="800px">
      <el-form label-width="100px" :model="addParams" ref="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业ID:" prop="sponsor_id">
              <el-input
                style="width:200px;"
                @blur="getCompanyName"
                v-model.trim="addParams.sponsor_id"
                maxlength="19"
                placeholder="请输入"
              ></el-input>
              <!-- <el-button @click="getCompanyName">获取名称</el-button> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称">
              <el-input
                style="width:200px;"
                v-model="company_name"
                disabled
                placeholder="自动填入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类:" prop="type">
              <el-select
                v-model="addParams.type"
                style="width:200px"
                placeholder="请选择"
              >
                <el-option :value="2" label="充值福利"></el-option>
                <el-option :value="3" label="商户补偿"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增加次数">
              <el-input-number
                v-model="addParams.num"
                :min="1"
                :max="10"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="有效期限:">
              <el-date-picker
                style="width:200px"
                v-model="addParams.invalid_time"
                :clearable="false"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerDateOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注说明:">
              <el-input
                style="width:300px"
                type="textarea"
                rows="4"
                placeholder="请输入内容"
                v-model="addParams.remark"
                maxlength="150"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNumDialog = false">取 消</el-button>
        <el-button type="primary" @click="comfirmClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情弹框 -->
    <el-dialog title="查看详情" :visible.sync="detailDialog" width="50%">
      <el-form label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业ID：" prop="sponsor_id">
              <span>{{ showdetail.sponsor_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称：">
              <span>{{ showdetail.company_name }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="增加类型：">
              <span v-if="showdetail.type == 1">商家购买</span>
              <span v-if="showdetail.type == 2">充值福利</span>
              <span v-if="showdetail.type == 3">商户补偿</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增加次数：">
              <span>{{ showdetail.num }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="有效期限：">
              <span>{{
                moment(showdetail.invalid_time * 1000).format("YYYY-MM-DD")
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注说明：">
              <span>{{ showdetail.remark }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>
<script>
import BdSelect from "../../components/BdSelect";
import moment from "moment";
export default {
  components: {
    BdSelect
  },
  data() {
    return {
      moment: moment,
      addNumDialog: false, //增加次数弹框
      detailDialog: false, //查看详情弹框
      list: [],
      count: 0,
      search: {
        sponsor_id: "", //商户ID
        sponsor_level: "", //KA A B
        type: 0, //1商家购买 2充值福利 3.商户补偿
        page_id: 1,
        page_size: 10,
        company_name: "", //公司名称
        bd_admin_id: "" // bd负责人
      },
      showdetail: {}, //详情
      addParams: {
        sponsor_id: "", //商户ID
        type: "", //福利类型
        num: 1, //增加次数
        invalid_time: "", //有效期限
        remark: "", //备注
        snow_id: "" //提交前获取雪花id
      },
      company_name: "", //商户名称
      rules: {
        sponsor_id: [
          {
            required: true,
            message: "请输入企业ID",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择分类",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.queryList();
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    pickerDateOptions() {
      let endTime = new Date().getTime();
      return {
        disabledDate(time) {
          return time.getTime() < endTime - 1 * 24 * 3600 * 1000;
        }
      };
    }
  },
  watch: {
    "addParams.sponsor_id"() {
      this.company_name = "";
    }
  },
  methods: {
    //获取列表数据
    async queryList() {
      let res = await this.$api.getFreeList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
    },
    //重置
    refreshBtnClick() {
      this.search = {
        sponsor_id: "", //商户ID
        sponsor_level: "", //KA A B
        type: 0, //1商家购买 2充值福利 3.商户补偿
        page_id: 1,
        page_size: 10,
        company_name: "", //公司名称
        bd_admin_id: "" // bd负责人
      };
      this.searchBtnClick();
    },
    addNum() {
      this.addNumDialog = true;
      this.addParams.invalid_time = moment()
        .add(1, "years")
        .format("YYYY-MM-DD");
      this.addParams.sponsor_id = "";
      this.addParams.type = "";
      this.addParams.num = 1;
      this.addParams.remark = "";
    },
    //确认增加手动次数
    comfirmClick() {
      this.getSnow();
      if (this.company_name == "") {
        this.$message.error("请验证商户名称");
        return false;
      }
      this.$refs["form"].validate(vaild => {
        if (vaild) {
          this.$confirm(
            "确认给[" +
              this.company_name +
              "]增加" +
              this.addParams.num +
              "次置换活动",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(async () => {
              let params = {};
              params.sponsor_id = this.addParams.sponsor_id;
              params.type = this.addParams.type;
              params.num = this.addParams.num;
              let time =
                new Date(this.addParams.invalid_time).setHours(23, 59, 59) /
                1000;
              params.invalid_time = time;
              params.remark = this.addParams.remark;
              params.operate_id = this.addParams.snow_id;
              let res = await this.$api.addFreeNumber(params);
              if (res && res.error_code == 0) {
                this.$message.success(
                  "添加成功,该商户活动次数已增加" + this.addParams.num + "次"
                );
                this.addNumDialog = false;
                await this.queryList();
              }
            })
            .catch(() => {
              return false;
            });
        }
      });
    },
    infoBtnClick(item) {
      this.detailDialog = true;
      this.showdetail = item;
    },
    //获取雪花id
    async getSnow() {
      let res = await this.$api.getSnowId();
      this.addParams.snow_id = res.data.id;
    },
    //获取公司名字
    async getCompanyName() {
      if (this.addParams.user_id == "") {
        return false;
      }
      let req = {
        page_id: 1,
        page_size: 1,
        sponsor_id: this.addParams.sponsor_id,
        status: -1
      };
      let res = await this.$api.sponsorSearch(req);
      if (res.error_code == 0) {
        if (res.data && (res.data.sponsor_user || []).length == 1) {
          this.company_name = res.data.sponsor_user[0].company_name;
        } else {
          this.$message.error("获取失败,请核对id");
          this.company_name = "";
        }
      } else {
        this.$message.error("获取失败,请核对id");
        this.company_name = "";
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    }
  }
};
</script>

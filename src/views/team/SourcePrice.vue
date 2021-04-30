<template>
  <div class="source">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <el-input
            class="search-inp"
            placeholder="映兔ID"
            v-model.trim="f_cp_id"
            :disabled="disabled1"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <blogger-search
            v-model.trim="s_cp_nickname"
            @select="handleSelect"
            :disabled="disabled2"
            @changeState="changeState"
            placeholder="映兔昵称"
          ></blogger-search>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.source">
            <el-option value label="全部合作类型"></el-option>
            <el-option
              v-for="(item, index) in source1"
              :key="index"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="渠道ID"
            v-model="search.source_id"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item label="映兔平台价">
          <el-input
            v-model.trim="search.regular_price_gte"
            class="search-inp"
            oninput="value = value.replace(/[^\d]/g, '')"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
          -
          <el-input
            v-model.trim="search.regular_price_lte"
            class="search-inp"
            oninput="value = value.replace(/[^\d]/g, '')"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick">搜索</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="primary"
            @click="addPrice"
            v-if="authList.indexOf('id1611663900') > -1"
            >添加</el-button
          >
          <el-button
            @click="priceAllBtnClick"
            v-if="authList.indexOf('id1611663909') > -1"
            >批量导入</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="list">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="映兔ID" prop="cp_id"></el-table-column>
        <el-table-column label="映兔昵称" prop="cp_nickname"></el-table-column>
        <el-table-column label="社媒渠道" prop="source">
          <template slot-scope="scope">
            <p v-if="scope.row.source && scope.row.source !== '0'">
              {{ getPlatformName(scope.row.source) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="渠道ID" prop="source_id"></el-table-column>
        <el-table-column label="映兔平台价" prop="regular_price">
          <template slot-scope="scope">
            <p>{{ scope.row.regular_price / 100 }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作人">
          <template slot-scope="scope">
            <p>{{ allAdmin[scope.row.last_operator_id] }}</p>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="update_time">
          <template slot-scope="scope">
            <p>
              {{
                moment(scope.row.update_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getDetail(scope.row)"
              v-if="authList.indexOf('id1611663888') > -1"
              >查看</el-button
            >
            <el-button
              type="text"
              @click="updatePrice(scope.row)"
              v-if="authList.indexOf('id1611663916') > -1"
              >修改</el-button
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
    <el-dialog title="查看详情" :visible.sync="detailDg" width="800px">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID：">
              <span>{{ info.cp_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称：">
              <span>{{ info.cp_nickname }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="定制渠道：">
              <span v-if="info.source && info.source !== 0">{{
                getPlatformName(info.source)
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道ID：">
              <p>{{ info.source_id }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="innerList">
        <el-table-column label="映兔平台价">
          <template slot-scope="scope">
            <p>{{ scope.row.regular_price / 100 }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作人">
          <template slot-scope="scope">
            <p>{{ allAdmin[scope.row.operator_id.toString()] }}</p>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <p>
              {{
                moment(scope.row.operate_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="innertotal > 0">
        <el-pagination
          small
          layout="total,prev, pager, next"
          :total="innertotal"
          @current-change="currentChange"
          :page-size="page_size"
          :current-page="page_id"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDg = false">取 消</el-button>
        <el-button type="primary" @click="detailDg = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新建平台价" :visible.sync="addDg" width="800px">
      <el-form :model="priceItem" :rules="rules" ref="priceItem">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID：" label-width="110px" prop="cp_id">
              <el-input
                style="width:200px"
                v-model.trim="priceItem.cp_id"
                maxlength="19"
                @blur="getMessage(priceItem.cp_id)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称：" label-width="100px">
              <el-input
                disabled
                style="width:200px"
                v-model="inner_cp_nickname"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="已入驻渠道："
              label-width="110px"
              prop="source"
            >
              <el-select
                style="width:200px"
                v-model="priceItem.source"
                @change="getSource"
              >
                <el-option
                  v-for="(item, index) in source"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道ID：" label-width="100px">
              <el-input style="width:200px" v-model="source_id" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="平台价："
              label-width="110px"
              prop="regular_price"
            >
              <el-input
                style="width:200px"
                placeholder="请输入正整数"
                oninput="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g, '')"
                v-model="o_regular_price"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDg = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtnClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改平台价Dg -->
    <el-dialog title="修改平台价" :visible.sync="updateDg" width="800px">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID：" label-width="110px" prop="cp_id">
              <span>{{ priceItem.cp_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称：" label-width="100px">
              <span>{{ this.cp_nickname }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="定制渠道：" label-width="110px" prop="source">
              <span v-if="priceItem.source && priceItem.source != 0">{{
                getPlatformName(priceItem.source)
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道ID：" label-width="100px">
              <el-input style="width:200px" v-model="source_id" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="原平台价："
              label-width="110px"
              prop="regular_price"
            >
              <el-input
                style="width:200px"
                v-model="regular_price"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="调整至："
              label-width="100px"
              prop="regular_price"
            >
              <el-input
                style="width:200px"
                placeholder="请输入正整数"
                v-model="priceItem.regular_price"
                oninput="value = value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDg = false">取 消</el-button>
        <el-button type="primary" @click="updateBtnClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--批量发货-->
    <el-dialog
      title="批量导入"
      :visible.sync="priceAll.dialog"
      :close-on-click-modal="false"
      width="600px"
    >
      <p>
        <span class="fileBtn">
          选择文件
          <input
            @change="selectFile"
            ref="file"
            type="file"
            accept=".xlsx, .xls"
          />
        </span>
        <span v-show="priceAll.fileName"
          ><i class="el-icon-document" /> {{ priceAll.fileName }}</span
        >
      </p>
      <p class="cell-item cell-tips">
        备注：文件必须为xlsx或者xls格式，且不能超过1M
      </p>
      <div slot="footer">
        <el-button @click="priceAll.dialog = false"> 取消 </el-button>
        <el-button type="primary" @click="uploadBtnClick"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPlatformName } from "../../utils/platform";
import axios from "axios";
import getUserInfo from "../../api/getUserInfo";
import { BASEURL } from "../../api/baseUrl";
import moment from "moment";
import BloggerSearch from "../team/components/bloggerSearch";
export default {
  components: {
    BloggerSearch
  },
  data() {
    return {
      moment: moment,
      detailDg: false,
      addDg: false,
      updateDg: false,
      f_cp_id: "",
      cp_nickname: "",
      s_cp_nickname: "", //搜素用
      inner_cp_nickname: "",
      source_id: "",
      o_regular_price: "",
      regular_price: "",
      price: "", //判断是否存在原来平台价
      page_id: 1,
      page_size: 5,
      total: 0,
      innertotal: 0,
      flag: false,
      disabled1: false,
      disabled2: false,
      info: {},
      nameList: [],
      priceAll: {
        //批量导入
        dialog: false,
        file: null,
        fileName: "",
        fileSize: ""
      },
      search: {
        cp_id: "",
        source: "",
        source_id: "",
        regular_price_gte: "",
        regular_price_lte: "",
        page_id: 1,
        page_size: 10
      },
      checkList: [],
      source: [],
      source1: [
        {
          id: "2",
          name: "小红书"
        },
        {
          id: "4",
          name: "B站"
        },
        {
          id: "7",
          name: "抖音"
        },
        {
          id: "1",
          name: "微博"
        },
        {
          id: "8",
          name: "快手"
        },
        {
          id: "5",
          name: "微淘"
        }
      ],
      list: [],
      innerList: [],
      priceItem: {
        cp_id: "",
        source: "",
        regular_price: "",
        source_id: ""
      },
      rules: {
        cp_id: [
          {
            required: true,
            message: "请输入映兔ID",
            trigger: "blur"
          }
        ],
        source: [
          {
            required: true,
            message: "请选择入驻渠道",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
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
    s_cp_nickname(val) {
      if (val !== "") {
        this.disabled1 = true;
      } else {
        this.disabled1 = false;
        // this.search.cp_id = "";
        // this.searchBtnClick();
      }
    },
    "priceItem.cp_id"(val) {
      if (val == "") {
        this.inner_cp_nickname = "";
        this.checkList = [];
        this.source = [];
        this.priceItem.source = "";
        this.source_id = "";
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    getPlatformName: getPlatformName,
    changeState(value) {
      this.s_cp_nickname = value;
    },
    handleSelect(item) {
      this.search.cp_id = item;
      this.searchBtnClick();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //获取列表
    async queryList() {
      let req = { ...this.$initReq(this.search) };
      req.regular_price_gte &&
        (req.regular_price_gte = parseInt(
          Math.round(req.regular_price_gte * 100)
        ));
      req.regular_price_lte &&
        (req.regular_price_lte = parseInt(
          Math.round(req.regular_price_lte * 100)
        ));
      let res = await this.$api.getBloggerPriceList(this.$initReq(req));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.total = res.data.count;
      }
    },
    priceAllBtnClick() {
      this.priceAll.file = null;
      this.priceAll.fileName = "";
      this.priceAll.fileSize = 0;
      this.priceAll.dialog = true;
    },
    //选择文件
    selectFile() {
      let files = this.$refs.file.files;
      if (files.length > 0) {
        this.priceAll.file = files[0];
        this.priceAll.fileName = files[0].name;
        this.priceAll.fileSize = (files[0].size / 1024).toFixed(2);
        this.$refs.file.value = "";
      }
    },
    uploadBtnClick() {
      if (this.priceAll.file) {
        if (this.priceAll.fileSize > 1024) {
          this.$message.error("文件大小不能超过1M");
          return false;
        }
        let userInfo = getUserInfo();
        const postUrl = BASEURL + "/admin/cp/price/upload";
        const operator_id = userInfo.user_id;
        const user_id = userInfo.user_id;
        const sid = userInfo.sid;
        const request = new FormData();
        request.append("file", this.priceAll.file);
        request.append("user_id", user_id); //商户id
        request.append("operator_id", operator_id); //登录id
        request.append("sid", sid);

        //设置form-data提交表单
        const config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        //上传文件
        axios.post(postUrl, request, config).then(res => {
          if (res.error_code === 0) {
            this.priceAll.dialog = false;
            this.$message.warning(
              "上传成功" +
                res.data.success_num +
                "条" +
                "，" +
                "失败" +
                res.data.fail_num +
                "条" +
                "，" +
                "无效" +
                res.data.useless_num +
                "条"
            );
            this.queryList();
          }
        });
      } else {
        this.$message.warning("请选择xlsx格式文件");
      }
    },

    //失去焦点获得博主相关信息
    getMessage(cp_id) {
      if (this.priceItem.cp_id !== "") {
        this.getPriceList(cp_id);
        this.getBloggerName();
      }
    },
    //自动根据id键入映兔名搜索
    async getBloggerName() {
      if (this.priceItem.cp_id == "") {
        return false;
      }
      let req = {
        cp_id: this.priceItem.cp_id || "0",
        status: -1,
        page_id: 1,
        page_size: 1,
        level: -1 //博主等级
      };
      let res = await this.$api.cpSearch(req);
      if (res.error_code == 0) {
        if (res.data && res.data.list && res.data.list.length == 1) {
          this.inner_cp_nickname = res.data.list[0].cp_nickname;
        }
      }
    },
    //获取平台价等信息
    async getPriceList(cp_id) {
      let res = await this.$api.getPriceList({ cp_id: cp_id });
      if (res.error_code == 0) {
        let list = res.data.source_list || [];
        let array = [];
        if (list.length !== 0) {
          list.map(item => {
            array.push(
              Object.assign(
                {},
                { id: item },
                { name: this.$getPlatformName(item) }
              )
            );
          });
        }
        this.checkList = res.data.price_list || [];
        this.source = array;
      }
    },
    //自动填入渠道ID
    getSource(val) {
      let result = this.checkList.find(item => {
        return item.source == val;
      });
      this.source_id = result.source_id;
      this.price = result.price;
    },
    //点击查看
    getDetail(item) {
      this.page_id = 1;
      this.detailDg = true;
      this.info = { ...item };
      this.getMemberDetail();
    },
    async getMemberDetail() {
      let req = {
        cp_id: this.info.cp_id,
        source: this.info.source,
        page_id: this.page_id,
        page_size: this.page_size,
        source_id: this.info.source_id
      };
      let res = await this.$api.bloggerPriceHistory(req);
      if (res.error_code == 0) {
        this.innerList = res.data.list || [];
        this.innertotal = res.data.count;
      }
    },
    //点击添加平台价
    addPrice() {
      this.o_regular_price = "";
      this.priceItem = {
        cp_id: "",
        source: "",
        regular_price: "",
        source_id: ""
      };
      this.addDg = true;
    },
    //确认创建平台价
    async confirmBtnClick() {
      this.priceItem.source_id = this.source_id;
      this.priceItem.regular_price = Number(this.o_regular_price) * 100;
      if (this.inner_cp_nickname == "") {
        this.$message.error("请输入正确的映兔ID！");
        return false;
      }
      if (this.o_regular_price == "") {
        this.$message.error("请输入平台价！");
        return false;
      }
      if (this.o_regular_price > 1000000) {
        this.$message.error("平台价不能超过1000000！");
        return false;
      }
      this.$refs["priceItem"].validate(async vaild => {
        if (vaild) {
          if (this.price !== 0) {
            this.$message.error("该渠道平台价已存在，请检查！");
            return false;
          }
          let res = await this.$api.createBloggerPrice(this.priceItem);
          if (res.error_code == 0) {
            this.$message.success("添加成功！");
            this.addDg = false;
            this.queryList();
          }
        } else {
          return false;
        }
      });
    },
    //点击修改弹窗
    updatePrice(item) {
      this.priceItem.regular_price = "";
      this.priceItem.cp_id = item.cp_id;
      this.cp_nickname = item.cp_nickname;
      this.priceItem.source = item.source;
      this.regular_price = item.regular_price / 100;
      this.source_id = item.source_id;
      this.updateDg = true;
    },
    //确认修改平台价
    async updateBtnClick() {
      if (this.priceItem.regular_price == "") {
        this.$message.error("请输入调整后的平台价");
        return false;
      }
      if (this.priceItem.regular_price == this.regular_price) {
        this.$message.error("调整后的平台价不能等同于原平台价！请重新输入");
        return false;
      }
      if (this.priceItem.regular_price > 1000000) {
        this.$message.error("调整后的平台价不能大于1000000！");
        return false;
      }
      let req = {
        cp_id: this.priceItem.cp_id,
        source: this.priceItem.source,
        source_id: this.source_id,
        regular_price: Number(this.priceItem.regular_price) * 100
      };
      let res = await this.$api.updateBloggerPrice(req);
      if (res.error_code == 0) {
        this.$message.success("修改成功！");
        this.updateDg = false;
        this.queryList();
      }
    },
    //弹框里的分页
    currentChange(current) {
      this.page_id = current;
      this.getMemberDetail();
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    }
  }
};
</script>
<style lang="less" scoped>
.fileBtn {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  background: #409eff;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  border-radius: 2px;
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
    font-size: 100px;
  }
}
</style>

<template>
  <div class="order-list">
    <!--form-->
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.order_id"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="订单编号 "
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.brand_name"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="品牌名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.product_name"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.company_name"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.cp_nickname"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="用户昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          placeholder="审核状态"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
        >
          <el-option value label="全部审核状态"></el-option>
          <el-option :value="1" label="待审核"></el-option>
          <el-option :value="2" label="已审核"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.type"
          placeholder="晒单类型"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
        >
          <el-option value label="全部晒单类型"></el-option>
          <el-option :value="3" label="商城+社媒"></el-option>
          <el-option :value="2" label="社媒"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="晒单上传时间:">
        <el-date-picker
          class="search-time"
          v-model="dateTime"
          type="daterange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.marked" @change="searchBtnClick">
          <el-option value label="全部标记"></el-option>
          <el-option :value="1" label="无标记"></el-option>
          <el-option :value="2" label="有标记"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtnClick" icon="el-icon-search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!--/form-->
    <!--table-->
    <el-table :data="list" highlight-current-row class="table">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号| 商品名称 | 品牌 | 公司" width="200">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.order_id }}</p>
            <p>{{ scope.row.product_name }}</p>
            <p>{{ scope.row.brand_name }}</p>
            <p>{{ scope.row.company_name }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户" prop="cp_nickname">
        <template slot-scope="scope">
          <p>{{ scope.row.cp_nickname }}</p>
          <!-- <div v-if="scope.row.type == 3">
            <p>
              <el-button type="text" @click="showQrCode(scope.row.homepage_url)"
                >洋淘主页</el-button
              >
            </p>
            <p>
              <el-button
                type="text"
                @click="homepageClick(scope.row.homepage_image)"
                >主页截图</el-button
              >
            </p>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column label="晒单类型" width="170">
        <template slot-scope="scope">
          {{ scope.row.type == 3 ? "商城+社媒" : "社媒" }}
        </template>
      </el-table-column>
      <el-table-column label="晒单提交时间" width="150">
        <template slot-scope="scope">
          {{ moment(scope.row.share_time * 1000).format("YYYY-MM-DD HH:mm") }}
        </template>
      </el-table-column>
      <el-table-column label="返利额度" width="130">
        <template slot-scope="scope">
          {{ scope.row.total_rebate / 100
          }}{{ scope.row.type == 3 ? "映币" : "元" }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">待审核</el-tag>
          <el-tag v-if="scope.row.status == 2" type="success">已审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="晒单" min-width="170">
        <template slot-scope="scope">
          <template v-if="scope.row.review_list">
            <div v-for="(channel, index) in scope.row.review_list" :key="index">
              <div v-if="channel.type == 1">
                <el-link
                  v-if="channel.source !== parseInt($platformEnum.GUANGGUANG)"
                  style="margin-right: 10px"
                  type="primary"
                  @click="goPlatformUrl(channel.url)"
                  >{{ $getPlatformName(channel.source) }}</el-link
                >
                <div v-else style="display: flex">
                  <!-- TODO 链接需要根据后端返回的字段进行修改 -->
                  <el-link
                    style="margin-right: 10px"
                    type="primary"
                    @click="toOpenUrl(channel.url)"
                    >逛逛链接
                  </el-link>
                  <el-popover
                    placement="left"
                    title=""
                    width="262"
                    trigger="hover"
                  >
                    <div
                      slot="reference"
                      @mouseenter="
                        openQR($event, channel.url, 'qrcode-appraisal')
                      "
                    >
                      <el-link style="margin-right: 10px" type="primary"
                        >逛逛二维码</el-link
                      >
                    </div>
                    <div
                      class="popover-title"
                      style="
                        display: flex;
                        justify-content: center;
                        margin-bottom: 12px;
                        color: #303133;
                        font-size: 16px;
                        line-height: 1;
                      "
                    >
                      请用淘宝扫描二维码
                    </div>
                    <div id="qrcode-appraisal" class="qrcode-container"></div>
                  </el-popover>
                </div>
              </div>
            </div>
          </template>
          <p v-if="!scope.row.review_list">-</p>
        </template>
      </el-table-column>
      <el-table-column label="追加晒单">
        <template slot-scope="scope">
          <template v-if="scope.row.review_list">
            <div v-for="(channel, index) in scope.row.review_list" :key="index">
              <div v-if="channel.type == 2">
                <el-link
                  style="margin-right: 10px"
                  type="primary"
                  @click="goPlatformUrl(channel.url)"
                  >{{ $getPlatformName(channel.source) }}</el-link
                >
              </div>
            </div>
          </template>
          <p v-if="!scope.row.review_list">-</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="authList.indexOf('id127') > -1"
            @click="verifyClick(scope.row.order_id, scope.row.cp_id)"
            >审核发放</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.marked == false"
            @click="openRemarkDg(scope.row.order_id)"
            >标记</el-button
          >
          <el-button type="text" v-else @click="getRemark(scope.row.order_id)"
            >查看标记</el-button
          >
          <!-- <el-button type="text" @click="orderDetail(scope.row.order_id)">查看订单详情</el-button>gt -->
        </template>
      </el-table-column>
    </el-table>
    <!--/table-->
    <!--page-->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        :page-size="search.page_size"
        :current-page="search.page_id"
        :total="total"
      ></el-pagination>
    </div>
    <!--/page-->
    <!-- 审核发放 -->
    <el-dialog title="审核发放" :visible.sync="verifyDg">
      <div class="dialog-tip">
        {{ this.verifyStatusText }} <br />
        要求：3张+图或15秒+视频 出现产品；提及品牌，产品名和使用感受 <br />
        返利：{{ feedbackCount / 100
        }}{{ verifyInfo.but_type == 3 ? "映币" : "元" }}
      </div>
      <el-form style="margin-top: 16px" :disabled="verifyInfo.reviewed">
        <p><b>正式测评</b></p>
        <div
          v-for="(item, index) in verifyInfo.format_list"
          style="margin-bottom: 10px"
          :key="index"
        >
          <el-link
            style="margin-right: 10px"
            type="primary"
            @click="goPlatformUrl(item.appraisal_url)"
            >{{ $getPlatformName(item.source) }}</el-link
          >
          <el-link
            style="margin-right: 10px"
            type="primary"
            v-if="item.homepage_url"
            @click="goPlatformUrl(item.homepage_url)"
            >账号链接</el-link
          >
          <el-link
            v-if="item.source == 9 && item.certificate_url"
            style="margin-right: 10px"
            type="primary"
            @click="homepageClick(item.certificate_url)"
            >凭证</el-link
          >
          <el-radio-group
            style="float: right"
            v-model="item.qualified"
            @change="changeStatus(item.source)"
          >
            <!-- :disabled="item.system_warning.length > 0" -->
            <el-radio label="1">合格</el-radio>
            <el-radio label="2">不合格</el-radio>
          </el-radio-group>
          <!-- 系统警告 -->
          <div v-if="item.system_warning.length" class="warning">
            {{ item.system_warning.join(" | ") }}
          </div>
        </div>
        <!-- 返利券任务 -->
        <div style="margin-bottom: 10px" v-if="verifyInfo.task_reward">
          <p><b>返利券任务</b></p>
          <span>{{ verifyInfo.task_reward.task }}</span>
          <el-radio-group
            style="float: right"
            v-model="verifyInfo.task_reward.qualified"
          >
            <el-radio label="1">合格</el-radio>
            <el-radio label="2">不合格</el-radio>
          </el-radio-group>
        </div>
        <!-- 追加测评 -->
        <div v-if="verifyInfo.append_list">
          <p><b>追加测评</b></p>
          <div
            v-for="(item, index) in verifyInfo.append_list"
            style="margin-bottom: 10px"
            :key="`${index}%`"
          >
            <el-link
              v-if="item.source != 9 && item.source != 7"
              style="margin-right: 10px"
              type="primary"
              @click="goPlatformUrl(item.appraisal_url)"
              >{{ $getPlatformName(item.source) }}</el-link
            >
            <el-link
              style="margin-right: 10px"
              type="primary"
              @click="goPlatformUrl(item.appraisal_url)"
              >账号链接</el-link
            >
            <el-link
              v-if="item.source == 9 && item.certificate_url"
              style="margin-right: 10px"
              type="primary"
              @click="homepageClick(item.certificate_url)"
              >凭证</el-link
            >
            <el-radio-group
              style="float: right"
              v-model="item.qualified"
              @change="changeStatus(item.source)"
            >
              <!-- :disabled="item.system_warning.length" -->
              <el-radio label="1">合格</el-radio>
              <el-radio label="2">不合格</el-radio>
            </el-radio-group>
            <!-- 系统警告 -->
            <div v-if="item.system_warning.length" class="warning">
              {{ item.system_warning.join(" | ") }}
            </div>
          </div>
        </div>

        <p style="padding-bottom: 4px"><b>最终结果</b></p>
        <div
          v-for="(item, index) in verifyInfo.result_list"
          style="margin-bottom: 10px"
          :key="index + '%'"
        >
          <span style="padding-right: 16px">{{
            $getPlatformName(item.source)
          }}</span>
          <span>{{ item.rebate / 100 }}映币</span>
          <el-radio-group
            :disabled="item.radioDisabled || verifyInfo.reviewed"
            style="float: right"
            v-model="item.status"
            @change="changeStatus(item.source)"
          >
            <el-radio :label="1">发放</el-radio>
            <el-radio :label="2">不发放</el-radio>
          </el-radio-group>
          <div
            v-if="item.status == 2"
            style="display: flex; justify-content: flex-end"
          >
            <el-select
              :disabled="item.disabled || verifyInfo.reviewed"
              @change="changeSelect(item.source, $event)"
              v-model="item.refuse_reason"
              multiple
              placeholder="请选择理由"
              style="width: 100%; margin-top: 4px"
            >
              <el-option
                v-for="(item, index) in messages"
                :label="item"
                :key="index"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </div>
        <p v-if="verifyInfo.task_reward">
          <span>返利券任务 {{ verifyInfo.task_reward.rebate / 100 }}映币</span>
          <el-radio-group
            :disabled="verifyInfo.reviewed"
            style="float: right"
            v-model="verifyInfo.task_reward.status"
          >
            <el-radio :label="1">发放</el-radio>
            <el-radio :label="2">不发放</el-radio>
          </el-radio-group>
        </p>
      </el-form>
      <p style="padding-bottom: 4px; margin-top: 10px">
        <b>用户打标（选填）</b>
      </p>
      <p style="margin-bottom: 10px">
        <span style="margin-right: 10px">私享标签</span
        ><el-cascader
          v-model="private_tags"
          :options="options1"
          :props="defaultParams"
          :show-all-levels="false"
        ></el-cascader>
      </p>
      <p>
        <span style="margin-right: 10px">星选标签</span
        ><el-cascader
          v-model="star_tags"
          :options="options2"
          :props="defaultParams"
          :show-all-levels="false"
        ></el-cascader>
      </p>
      <div slot="footer">
        <!-- <div slot="footer" v-if="!verifyInfo.reviewed"> -->
        <el-button @click="verifyDg = false">取消</el-button>
        <el-button @click="verifyFeedback" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <!--orderDialog-->
    <el-dialog title="订单详情" :visible.sync="orderDialog">
      <order-detail :order="order"></order-detail>
    </el-dialog>
    <!--/orderDialog-->
    <!-- 标记 -->
    <el-dialog title="添加标记/查看标记" :visible.sync="remarkDg" width="800px">
      <el-form>
        <el-form-item label="晒单问题" label-width="70px">
          <div class="relative-element">
            <el-input
              style="width: 700px"
              v-model="remark"
              type="textarea"
              :maxlength="500"
              show-word-limit
              rows="12"
              @keyup.delete.native="deleteTag"
              placeholder="请输入晒单问题"
            ></el-input>
            <div class="bottom-labels" ref="remarkLabels">
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                @click="getValue(tag.name, $event)"
                class="tag"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button style="color: red; float: left" @click="deleteRemark"
          >删除标记</el-button
        >
        <el-button @click="remarkDg = false">取 消</el-button>
        <el-button type="primary" @click="addRemark">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 标记 -->
    <!-- 主页截图 -->
    <el-dialog title="主页截图" width="500px" :visible.sync="showHomepage">
      <img width="100%" :src="homepage" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import OrderDetail from "../../components/OrderDetail";
import { goPlatformUrl } from "../../utils/platform";
import QRCode from "qrcodejs2";

export default {
  name: "Feedback",
  components: {
    OrderDetail
  },
  data() {
    return {
      defaultParams: {
        multiple: true,
        value: "id",
        label: "name"
      },
      remarkDg: false,
      remark: "",
      goPlatformUrl: goPlatformUrl,
      homepage: "", //主页图片
      showHomepage: false, // 主页截图弹窗
      order_id: "", //当前订单id
      r_order_id: "", //需要删除标记的订单id
      moment: moment,
      verifyDg: false, // 审核弹窗
      verifyStatusText: "", // 审核状态文字展示
      currSource: null, // 当前点击的渠道
      private_tags: [],
      star_tags: [],
      verifyInfo: {
        format_list: [],
        append_list: [],
        result_list: [],
        task_reward: {
          task: "",
          qualified: "",
          status: "",
          rebate: ""
        }
      },
      options1: [], //获取私享标签
      options2: [], //获取星选标签
      orderDialog: false, // 订单详情dg
      feedbackCount: 0, // 返利金额
      order: {}, // 订单详情
      messages: [
        "小于3张图片含有产品",
        "小于15秒视频含有产品",
        "未正确提及产品名",
        "未正确提及品牌名",
        "未提及使用感受",
        "链接失效或未提交",
        "逛逛链接失效"
      ],
      tags: [
        { name: "#无效链接/旧链#" },
        { name: "#图片数量/视频时长#" },
        { name: "#文案未提及品牌名#" },
        { name: "#差评商品#" },
        { name: "#超大合集#" },
        { name: "#商品链接不符合要求#" }
      ],
      stop: "",
      search: {
        order_id: "",
        brand_name: "",
        product_name: "",
        company_name: "",
        cp_nickname: "",
        status: "",
        type: "",
        marked: "",
        start_time: 0,
        end_time: 0,
        page_id: 1,
        page_size: 10
      },
      dateTime: {}, // 订单时间
      total: 0,
      list: [], // 列表数据
      qrConfigs: {
        value: "",
        qWidth: 250,
        qHeight: 250
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    // 订单创建时间
    dateTime(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.start_time = 0;
        this.search.end_time = 0;
      } else {
        this.search.start_time = moment(val[0]).unix();
        this.search.end_time = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    }
  },
  mounted() {
    this.searchBtnClick();
    this.getPrivateTagsList();
    this.getStarTagsList();
  },
  methods: {
    // mouseenter 时创建二维码并 append 到对应的元素上
    openQR(e, url, id) {
      document.getElementById(id).innerHTML = "";
      this.qrConfigs.value = url;
      this.$nextTick(() => {
        this.createQRCode(
          this.qrConfigs.qWidth,
          this.qrConfigs.qHeight,
          this.qrConfigs.value,
          id,
          "canvas"
        );
      });
    },
    /**
     * @description 生成二维码
     * @param  {number} qWidth  宽度px
     * @param  {number} qHeight  高度px
     * @param  {string} qText  二维码内容（跳转连接）
     * @param  {string} qRender 渲染方式（有两种方式 table和canvas，默认是canvas）
     */
    createQRCode(qWidth, qHeight, qText, id, qRender) {
      const el = document.getElementById(id);
      let qrcode = new QRCode(el, {
        width: qWidth,
        height: qHeight,
        text: qText,
        render: qRender
      });
    },
    toOpenUrl(url) {
      if (url) {
        location.href = url;
      }
    },
    // 展示主页截图
    homepageClick(img) {
      this.showHomepage = true;
      this.homepage = img;
    },
    //获取博主已有私享标签
    async getPrivateTags() {
      let req = {
        cp_id: this.cp_id,
        tag_type: [4]
      };
      let res = await this.$api.getBloggerTagList(req);
      if (res.error_code == 0) {
        this.private_tags = res.data.tag;
      }
    },
    //获取博主已有星选标签
    async getStarTags() {
      let req = {
        cp_id: this.cp_id,
        tag_type: [7]
      };
      let res = await this.$api.getBloggerTagList(req);
      if (res.error_code == 0) {
        this.star_tags = res.data.tag;
      }
    },
    //获取私享标签备选
    async getPrivateTagsList() {
      let req = {
        tag_type: [3]
      };
      let res = await this.$api.userLabelList(req);
      if (res.error_code == 0) {
        res.data.tag_list = JSON.parse(
          JSON.stringify(res.data.tag_list).replace(/son_list/g, "children")
        );
        this.options1 = res.data.tag_list;
      }
    },
    //获取星选标签备选
    async getStarTagsList() {
      let req = {
        tag_type: [7]
      };
      let res = await this.$api.userLabelList(req);
      if (res.error_code == 0) {
        res.data.tag_list = JSON.parse(
          JSON.stringify(res.data.tag_list).replace(/son_list/g, "children")
        );
        this.options2 = res.data.tag_list;
      }
    },

    async verifyClick(order_id, cp_id) {
      this.cp_id = cp_id;
      this.order_id = order_id;
      await this.getPrivateTags();
      await this.getStarTags();
      let res = await this.$api.feedbackVerifyInfo({ order_id });
      if (res.error_code == 0) {
        this.verifyInfo = res.data || {};
        // 有审核提醒就默认不合格且只会
        if (this.verifyInfo.format_list) {
          this.verifyInfo.format_list.map((item) => {
            if (item.system_warning.length > 0) {
              item.qualified = "2";
            }
          });
        }
        // 有审核提醒就默认不合格且只会
        if (this.verifyInfo.append_list) {
          this.verifyInfo.append_list.map((item) => {
            if (item.system_warning.length > 0) {
              item.qualified = "2";
            }
          });
        }
        this.changeStatus();
        this.verifyDg = true;
      }
    },
    // 改变发放状态
    changeStatus(channel) {
      if (channel) {
        this.currSource = channel;
      }
      this.feedbackCount = 0;
      let channelList = [];
      for (let item of this.verifyInfo.result_list) {
        if (item.status == 1) {
          channelList.push(this.$getPlatformName(item.source));
          this.feedbackCount += item.rebate;
        }
        // 当由于 洋淘链接改变状态：不发放且 洋淘链接失效，其他渠道会被选定成disabled 且 理由是洋淘链接失效，当改变选择，改成发放时，要恢复成disabled = true
        if (item.source == 9) {
          if (item.status == 1) {
            for (let i of this.verifyInfo.result_list) {
              i.disabled = false;
              i.radioDisabled = false;
            }
          }
        }
      }
      if (channelList.length == 0) {
        this.verifyStatusText = "未通过官方审核";
      } else {
        this.verifyStatusText = "合格渠道：" + channelList.join("和");
      }
    },
    changeSelect(channel, data) {
      if (data.indexOf("逛逛链接失效") > -1 && channel == 9) {
        for (let i of this.verifyInfo.result_list) {
          i.status = 2;
          if (i.source != 9) {
            i.refuse_reason = ["逛逛链接失效"];
            i.disabled = true;
            i.radioDisabled = true;
          }
        }
      }
      if (data.indexOf("逛逛链接失效") < 0 && channel == 9) {
        for (let i of this.verifyInfo.result_list) {
          if (i.source != 9) {
            i.disabled = false;
            i.radioDisabled = false;
          }
        }
      }
    },
    // 获取审核信息
    async getVerifyInfo(order_id) {
      let res = await this.$api.feedbackVerifyInfo({ order_id });
      if (res.error_code == 0) {
        this.verifyInfo = res.data;
      }
    },
    // 返利审核提交
    async verifyFeedback() {
      for (let item of this.verifyInfo.result_list) {
        // 清理 点击不发放时 选择理由产生的垃圾数据
        if (item.status == 1) {
          item.refuse_reason = [];
        }
        if (item.status == 2 && !item.refuse_reason.length) {
          this.$message.error("请选择拒绝理由");
          return false;
        }
        if (!item.status) {
          this.$message.error("请选择是否发放返利");
          return false;
        }
        if (this.verifyInfo.task_reward) {
          if (!this.verifyInfo.task_reward.status) {
            this.$message.error("请选择是否发放返利券任务返利");
            return false;
          }
        }
      }
      await this.updatePrivateTag();
      await this.updateStarTag();
      this.verifyInfo.order_id = this.order_id;
      let res = await this.$api.verifyFeedback(this.verifyInfo);
      if (res.error_code == 0) {
        this.$message.success("审核成功");
        this.verifyDg = false;
        this.queryList();
      }
    },
    //更新私享标签
    async updatePrivateTag() {
      let req = {
        cp_id: this.cp_id,
        tag_type: 4,
        tags: this.private_tags
      };
      await this.$api.updateTagList(req);
    },
    //更新星选标签
    async updateStarTag() {
      let req = {
        cp_id: this.cp_id,
        tag_type: 7,
        tags: this.star_tags
      };
      await this.$api.updateTagList(req);
    },
    async orderDetail(order_id) {
      let res = await this.$api.orderDetail({ order_id });
      if (res.error_code == 0) {
        this.order = res.data || {};
        this.orderDialog = true;
      }
    },
    async queryList() {
      let res = await this.$api.getFeedbackList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data ? res.data.list || [] : [];
        this.total = res.data ? res.data.count : 0;
      }
    },
    //点击搜索按钮
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //分页
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    openRemarkDg(id) {
      this.r_order_id = id;
      this.remark = "";
      this.remarkDg = true;
    },
    async getRemark(id) {
      let res = await this.$api.getMarkDescription({ order_id: id });
      if (res.error_code == 0) {
        this.remark = res.data.mark_description;
      }
      this.remarkDg = true;
    },
    async addRemark() {
      if (this.remark == "") {
        this.$message.error("请输入晒单中存在的问题");
        return false;
      }
      if (this.remark.length > 500) {
        this.$message.error("超出限制字数500，请修改！");
        return false;
      }
      let req = {
        mark_description: this.remark,
        order_id: this.r_order_id
      };
      let res = await this.$api.updateMarkContent(req);
      if (res.error_code == 0) {
        this.$message.success("标记成功！");
        this.remarkDg = false;
        this.queryList();
      }
    },
    //删除标记
    deleteRemark() {
      let req = {
        mark_description: "",
        order_id: this.r_order_id
      };
      this.$confirm("确定删除返利审核标记？", {
        confirmButtonText: "确认",
        cancalButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let res = await this.$api.updateMarkContent(req);
        if (res.error_code == 0) {
          this.$message.success("标记已删除");
          this.remarkDg = false;
          this.queryList();
        }
      });
    },
    getValue(text) {
      this.remark += text;
    }
  }
};
</script>
<style lang="less">
.el-table__body tr.current-row > td {
  background-color: #aed6f1 !important;
  color: #fff;
}
</style>
<style lang="less" scoped>
.flex {
  display: flex;
}
.flex-s1 {
  flex: 1;
}
.txt-left {
  text-align: left;
}
.warning {
  padding: 4px 6px;
  border: #dedede;
  background: #f0f0f0;
  margin: 4px 0;
  color: red;
  position: relative;
  border-radius: 4px;
}
.warning::before {
  content: " ";
  display: block;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-bottom-color: #f0f0f0;
  position: absolute;
  top: -12px;
  left: 8px;
}
.order-list {
  .pagination {
    text-align: center;
    margin: 10px 0;
  }
  .order {
    p {
      label {
        color: #999;
      }
    }
  }

  .more-good-info {
    position: absolute;
    top: 0px;
  }
}
.tag {
  margin-left: 5px;
  margin-bottom: 5px;
}
.relative-element {
  position: relative;
  .bottom-labels {
    width: 600px;
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 3px;
    display: flex;
    flex-wrap: wrap;
    line-height: 18px;
    background-color: #fff;
  }
}

.qrcode-container {
  display: flex;
  justify-content: center;
}
</style>

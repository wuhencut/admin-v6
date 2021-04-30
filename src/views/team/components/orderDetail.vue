<template>
  <div class="order-list-one">
    <el-button type="text" @click="getDetail">查看详情</el-button>
    <el-dialog
      :visible.sync="dialog"
      :close-on-click-modal="true"
      append-to-body
      width="800px"
    >
      <el-form>
        <p style="font-size:16px;margin-bottom:15px"><b>联盟定制详情</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单编号" class="Item" label-width="80px">
              <span>{{ order.order_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态" class="Item" label-width="80px">
              <span v-show="order.status == 1">待提名</span>
              <span v-show="order.status == 2">待品牌确认</span>
              <span v-show="order.status == 3">待发货</span>
              <span v-show="order.status == 4">待收货</span>
              <span v-show="order.status == 5">待审稿提交</span>
              <span v-show="order.status == 6">待审稿确认</span>
              <span v-show="order.status == 7">待测评</span>
              <span v-show="order.status == 8">待测评确认</span>
              <span v-show="order.status == 9">待结算</span>
              <span v-show="order.status == 10">已完成</span>
              <span v-show="order.status == 11">已关闭</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请人ID" class="Item" label-width="80px">
              <span>{{ order.cp.id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称" class="Item" label-width="80px">
              <span>{{ order.cp.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="定制渠道" class="Item" label-width="80px">
              <span>{{ $getPlatformName(order.source) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容形式" class="Item" label-width="80px">
              <span>{{
                order.content_form.collection == 1 ? "合集" : "非合集"
              }}</span>
              <span style="padding:0 5px">|</span>
              <span>{{ ["视频", "图文"][order.content_form.form] }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="定制报价" class="Item" label-width="80px">
              <span>{{ order.quoted_price / 100 }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台调价" class="Item" label-width="80px">
              <span v-show="order.accept_adjust == true"
                >接受调价
                <span v-show="order.final_price > 0"
                  >（成交价{{ order.final_price / 100 }})</span
                ></span
              >
              <span v-show="order.accept_adjust == false">不接受调价</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请时间" class="Item" label-width="80px">
              <span>{{
                moment(order.create_time * 1000).format("YYYY-MM-DD HH:mm")
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货信息" class="Item" label-width="80px">
              <span>{{ order.receipt.recipient }}</span>
              <span style="margin-left:10px">{{
                order.receipt.telephone
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收货地址" class="Item" label-width="80px">
              <span>{{ order.receipt.province }}</span>
              <span style="margin-left:10px">{{ order.receipt.city }}</span>
              <span style="margin-left:10px">{{ order.receipt.county }}</span>
              <span style="margin-left:10px">{{ order.receipt.address }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请理由" class="Item" label-width="80px">
              <span>{{ order.apply_reason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div
          v-if="
            params.status == 4 ||
              params.status == 5 ||
              params.status == 6 ||
              params.status == 7 ||
              params.status == 8 ||
              params.status == 9 ||
              params.status == 10
          "
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="快递单号" class="Item" label-width="80px">
                <span>{{ order.receipt.express_company }}</span>
                <span style="margin-left:10px">{{
                  order.receipt.express_number
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发货时间" class="Item" label-width="80px">
                <span>{{
                  moment(order.receipt.deliver_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="定制审稿"
              class="Item"
              label-width="80px"
              v-if="
                params.status == 6 ||
                  params.status == 7 ||
                  params.status == 8 ||
                  params.status == 9 ||
                  params.status == 10
              "
            >
              <el-button type="text" @click="openInner(order.order_id)"
                >查看</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="正式测评"
              class="Item"
              label-width="80px"
              v-if="
                params.status == 8 || params.status == 9 || params.status == 10
              "
            >
              <span
                v-for="(item, index) in order.appraisal"
                :key="index"
                style="padding-right: 4px"
              >
                <el-link
                  type="primary"
                  target="_blank"
                  :href="item.appraisal_url"
                  v-if="item.type == 1 || item.type == 3"
                >
                  {{ $getPlatformName(item.source) }}
                </el-link>
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="追加测评"
              label-width="80px"
              class="Item"
              v-if="
                params.status == 8 || params.status == 9 || params.status == 10
              "
            >
              <span v-for="(item, index) in order.appraisal" :key="index">
                <el-link
                  target="_blank"
                  :href="item.appraisal_url"
                  v-if="item.type == 2"
                  >{{
                    moment(item.create_time * 1000).format("YYYY.MM.DD")
                  }}</el-link
                >
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <p style="font-size:16px;margin-bottom:15px"><b>活动信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商户ID" class="Item" label-width="80px">
              <span>{{ order.company.id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" class="Item" label-width="80px">
              <span>{{ order.company.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品牌" class="Item" label-width="80px">
              <span>{{ order.brand.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动ID" class="Item" label-width="80px">
              <span>{{ order.campaign_id }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" class="Item" label-width="80px">
              <span>{{ order.production.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品规格" class="Item" label-width="80px">
              <span>{{ order.spec.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="params.status == 6 && authList.indexOf('id1611715822') > -1"
          @click="finishBtnClick"
          >完 成 审 稿</el-button
        >
        <el-button
          type="primary"
          v-if="params.status == 8 && authList.indexOf('id1611715822') > -1"
          @click="confirmBtnClick"
          >确 认 测 评</el-button
        >
      </span>
    </el-dialog>
    <!-- 审稿详情 -->
    <el-dialog
      title="审稿详情"
      :visible.sync="innerDg"
      width="500px"
      append-to-body
    >
      <el-form>
        <el-form-item label="文稿内容" label-width="80px" class="Item">
          <span>{{ inner.content }}</span>
        </el-form-item>
        <el-form-item label="图片视频" label-width="80px" class="Item">
          <div>
            <img
              v-for="(item, index) in this.pic"
              :key="index"
              :src="item"
              style="width:100px;height:100px;margin-left:10px"
              @click="itemClick(item)"
            />
          </div>
          <div>
            <video
              width="150"
              height="150"
              v-for="(item, index) in this.video"
              :key="index"
              :src="item"
              controls="controls"
              style="margin-left:10px"
            ></video>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
    <!-- 审稿详情 -->
    <el-dialog
      style="text-align: center;"
      :visible.sync="showImg.show"
      :append-to-body="true"
      :show-close="false"
    >
      <img width="100%" :src="showImg.src" />
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import { getPlatformName } from "../../../utils/platform";
export default {
  props: {
    params: {
      type: Object
    }
  },
  data() {
    return {
      moment: moment,
      dialog: false,
      innerDg: false, //审稿详情
      showImg: {
        show: false,
        src: ""
      },
      pic: [],
      video: [],
      order: {
        order_id: "1085800216386338816",
        production: {
          id: "", //商品ID
          name: "" //商品名称
        },
        spec: {
          name: "", //商品规格
          id: "" //规格ID
        },
        content_form: {
          collection: 0, //合集/非合集
          form: 0 //图文/视频
        },
        company: {
          id: "", //商户ID
          name: "" //商户名称
        },
        cp: {
          id: "", //申请人ID
          name: "" //映兔昵称
        },
        create_time: 1547709919, //创建(申请)时间
        status: "发货逾期",
        brand: {
          id: "", //品牌ID
          name: "" //品牌名称
        },
        deadline: 0,
        update_time: 0,
        receipt: {
          recipient: "",
          telephone: "",
          province: "",
          city: "",
          county: "",
          address: "",
          express_company: "",
          express_number: "",
          deliver_time: 0
        },
        quoted_price: 0,
        apply_reason: "", //申请理由
        accept_adjust: false, //接受调价
        final_price: 0, //最终成交价
        source: "1", //定制渠道
        ticket: {
          id: "", //订单ID
          status: "" //订单状态
        },
        campaign_id: "", //活动ID
        appraisal: [
          {
            id: "",
            appraisal_url: "",
            type: 0,
            create_time: 0
          }
        ]
      },
      inner: {
        content: "",
        urls: []
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  methods: {
    getPlatformName: getPlatformName,
    itemClick(item) {
      this.showImg.src = item;
      this.showImg.show = true;
    },
    async getDetail() {
      this.dialog = true;
      let res = await this.$api.getCustomizedOrderDetail({
        order_id: this.params.order_id
      });
      if (res.error_code == 0) {
        this.order = res.data ? res.data || {} : {};
      }
    },
    //确认测评
    async confirmBtnClick() {
      let res = await this.$api.confirmAppraisal({
        order_id: this.params.order_id
      });
      if (res.error_code == 0) {
        this.$message.success("确认测评成功！");
        this.dialog = false;
        this.$emit("refresh");
      }
    },
    //完成审稿
    async finishBtnClick() {
      let res = await this.$api.checkIdea({
        order_id: this.params.order_id
      });
      if (res.error_code == 0) {
        this.$message.success("审稿完成！");
        this.dialog = false;
        this.$emit("refresh");
      }
    },
    //获取审稿详情
    async openInner() {
      let res = await this.$api.getIdeaDetail({
        order_id: this.params.order_id
      });
      if (res.error_code == 0) {
        this.innerDg = true;
        this.inner = res && res.data ? res.data || {} : {};
        let pic = [];
        let video = [];
        (this.inner.urls || []).map(item => {
          if (
            item.substring(item.lastIndexOf(".") + 1) == "png" ||
            item.substring(item.lastIndexOf(".") + 1) == "jpg" ||
            item.substring(item.lastIndexOf(".") + 1) == "gif"
          ) {
            return pic.push(item);
          } else {
            return video.push(item);
          }
        });
        this.pic = pic;
        this.video = video;
      }
    }
  }
};
</script>
<style>
.Item .el-form-item__label {
  font-weight: bold;
}
</style>
<style lang="less" scoped></style>

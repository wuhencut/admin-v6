<template>
  <div>
    <div>
      <table class="in-table">
        <tbody>
          <template>
            <tr>
              <td>订单编号</td>
              <td>{{ order.order_id }}</td>
            </tr>
            <tr>
              <td>订单状态</td>
              <td>
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
              </td>
            </tr>
            <tr>
              <td>申请人ID</td>
              <td>{{ order.cp.id }}</td>
            </tr>
            <tr>
              <td>映兔昵称</td>
              <td>{{ order.cp.name }}</td>
            </tr>
            <tr>
              <td>定制渠道</td>
              <td>{{ $getPlatformName(order.source) }}</td>
            </tr>
            <tr>
              <td>内容形式</td>
              <td>
                {{ order.setting.is_collection == 1 ? "合集" : "非合集" }}
              </td>
            </tr>
            <tr>
              <td>定制报价</td>
              <td>{{ order.quoted_price / 100 }}</td>
            </tr>
            <tr>
              <td>平台调价</td>
              <td>
                <span v-show="order.accept_adjust == true"
                  >接受调价（成交价{{ order.final_price / 100 }})</span
                >
                <span v-show="order.accept_adjust == false">不接受调价</span>
              </td>
            </tr>
            <tr>
              <td>申请时间</td>
              <td>
                {{
                  moment(order.create_time * 1000).format("YYYY-MM-DD HH:mm")
                }}
              </td>
            </tr>
            <tr>
              <td>收货信息</td>
              <td>
                <span>{{ order.receipt.recipient }}</span>
                <span style="margin-left:10px">{{
                  order.receipt.telephone
                }}</span>
              </td>
            </tr>
            <tr>
              <td>收货地址</td>
              <td>
                <span>{{ order.receipt.province }}</span>
                <span style="margin-left:10px">{{ order.receipt.city }}</span>
                <span style="margin-left:10px">{{ order.receipt.county }}</span>
                <span style="margin-left:10px">{{
                  order.receipt.address
                }}</span>
              </td>
            </tr>
            <tr>
              <td>申请理由</td>
              <td>
                {{ order.apply_reason }}
              </td>
            </tr>
            <tr>
              <td>快递单号</td>
              <td>
                <span>{{ order.receipt.express_company }}</span>
                <span style="margin-left:10px">{{
                  order.receipt.express_number
                }}</span>
              </td>
            </tr>
            <tr>
              <td>发货时间</td>
              <td>
                {{
                  moment(order.receipt.deliver_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>定制审稿</td>
              <td>
                <el-button type="text" @click="openInner(order.order_id)"
                  >查看</el-button
                >
              </td>
            </tr>
            <tr>
              <td>正式测评</td>
              <td>
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
              </td>
            </tr>
            <tr>
              <td>追加测评</td>
              <td>
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
              </td>
            </tr>
            <tr>
              <td>商户ID</td>
              <td>{{ order.company.id }}</td>
            </tr>
            <tr>
              <td>公司名称</td>
              <td>{{ order.company.name }}</td>
            </tr>
            <tr>
              <td>品牌</td>
              <td>{{ order.brand.name }}</td>
            </tr>
            <tr>
              <td>活动ID</td>
              <td>{{ order.campaign_id }}</td>
            </tr>
            <tr>
              <td>商品名称</td>
              <td>{{ order.production.name }}</td>
            </tr>
            <tr>
              <td>商品规格</td>
              <td>{{ order.spec.name }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- 审稿详情 -->
    <el-dialog
      title="审稿详情"
      :visible.sync="innerDg"
      width="900px"
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
export default {
  name: "OrderDetail",
  props: {
    order: {
      type: Object,
      dafault: () => {
        return {
          production: {
            id: "", //商品ID
            name: "" //商品名称
          },
          spec: {
            name: "", //商品规格
            id: "" //规格ID
          },
          setting: {
            is_collection: 0, //合集/非合集
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
          brand: {
            id: "", //品牌ID
            name: "" //品牌名称
          },
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
          ticket: {
            id: "", //订单ID
            status: "" //订单状态
          },
          appraisal: [
            {
              id: "",
              appraisal_url: "",
              type: 0,
              create_time: 0
            }
          ]
        };
      }
    }
  },
  data() {
    return {
      moment: moment,
      pic: [],
      video: [],
      inner: {},
      innerDg: false,
      showImg: {
        show: false,
        src: ""
      }
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  methods: {
    itemClick(item) {
      this.showImg.src = item;
      this.showImg.show = true;
    },
    //获取审稿详情
    async openInner(order_id) {
      let res = await this.$api.getIdeaDetail({
        order_id: order_id
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

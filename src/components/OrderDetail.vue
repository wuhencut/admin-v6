<template>
  <div>
    <table class="in-table" v-if="order">
      <tbody>
        <template v-if="showAllInfo">
          <tr>
            <td>订单编号</td>
            <td>
              {{ order.order_id }}
            </td>
          </tr>
          <tr>
            <td>订单状态</td>
            <td>
              {{ order.status }}
              <span v-if="order.status == '已测评'"
                >提交时间：{{
                  moment(order.status_info.occur_time * 1000).format(
                    "YYYY.MM.DD HH:mm:ss"
                  )
                }}</span
              >
              <span v-if="order.status == '待收货'"
                >截止时间：{{
                  moment(order.status_info.end_time * 1000).format(
                    "YYYY.MM.DD HH:mm:ss"
                  )
                }}</span
              >
              <span v-if="order.status == '待探店'"
                >截止时间：{{
                  moment(order.status_info.end_time * 1000).format(
                    "YYYY.MM.DD HH:mm:ss"
                  )
                }}</span
              >
              <span v-if="order.status == '待测评'"
                >截止时间：{{
                  moment(order.status_info.end_time * 1000).format(
                    "YYYY.MM.DD HH:mm:ss"
                  )
                }}</span
              >
              <span v-if="order.status == '已取消'"
                >取消时间：{{
                  moment(order.status_info.occur_time * 1000).format(
                    "YYYY.MM.DD HH:mm:ss"
                  )
                }}</span
              >
              <span v-if="order.status == '已关闭'"
                >截止时间：{{
                  moment(order.status_info.occur_time * 1000).format(
                    "YYYY.MM.DD HH:mm:ss"
                  )
                }}</span
              >
            </td>
          </tr>
          <tr>
            <td>活动id</td>
            <td>{{ order.campaign_id }}</td>
          </tr>
          <tr>
            <td>申请时间</td>
            <td>
              {{ moment(order.apply_time * 1000).format("YYYY-MM-DD HH:mm") }}
            </td>
          </tr>
          <tr>
            <td>申请商品</td>
            <td>{{ order.production_title }}</td>
          </tr>
          <tr>
            <td>申请规格</td>
            <td>{{ order.specification }}</td>
          </tr>
          <tr>
            <td>收货人信息</td>
            <td>{{ order.recipient }} {{ order.telephone }}</td>
          </tr>
          <tr>
            <td>收货地址</td>
            <td>
              {{
                order.province +
                  " " +
                  order.city +
                  " " +
                  order.county +
                  " " +
                  order.address
              }}
            </td>
          </tr>
          <tr v-if="order.deliver_status">
            <td>发货时间</td>
            <td>
              {{ moment(order.deliver_time * 1000).format("YYYY-MM-DD HH:mm") }}
            </td>
          </tr>
          <tr v-if="order.deliver_status">
            <td>快递单号</td>
            <td>{{ order.express_company }} {{ order.express_num }}</td>
          </tr>
          <tr>
            <td>申请人账号Id</td>
            <td>{{ order.cp_id }}</td>
          </tr>
          <tr>
            <td>申请人用户昵称</td>
            <td>{{ order.cp_nickname }}</td>
          </tr>
          <tr>
            <td>商户id</td>
            <td>{{ order.sponsor_id }}</td>
          </tr>
          <tr>
            <td>订单所属公司</td>
            <td>{{ order.company_name }}</td>
          </tr>
          <template v-if="showAllInfo">
            <tr v-if="order.reward.form && order.reward.form.enable">
              <td>推广悬赏</td>
              <td>{{ order.form_reward_info.reward_point + "映币" }}</td>
            </tr>
          </template>
        </template>
        <tr>
          <td>申请理由</td>
          <td>{{ order.apply_reason }}</td>
        </tr>
        <tr>
          <td>合作模式</td>
          <td>{{ cooperationType[order.cooperation_type] }}</td>
        </tr>
        <tr v-if="order.fans_markup">
          <td>粉丝加价</td>
          <td>{{ order.fans_markup / 100 }} 映币</td>
        </tr>
        <tr v-if="order.cooperation_type == 'CooperationTypeOld'">
          <td>接受悬赏</td>
          <td>{{ order.rewarded ? "接受" : "不接受" }}</td>
        </tr>
        <tr>
          <td>测评渠道</td>
          <td>
            <tbody v-for="(review, index) in order.review_channel" :key="index">
              <el-tag>{{ $getPlatformName(review.channel) }}:</el-tag>
              <br />
              <p>测评内容：{{ review.is_collection ? "不限" : "非合集" }}</p>
              <p>
                测评形式：{{
                  review.content_type
                    ? reviewsType[review.content_type]
                    : "不限"
                }}
              </p>
              <p v-if="review.content_type == 1 && review.video_duration > 0">
                视频时长: {{ review.video_duration }}秒
              </p>
              <p v-if="review.account != '' || review.topic != ''">
                账号话题：{{
                  review.account ? "@" + review.account : "账号不限"
                }}
                {{ review.topic ? "#" + review.topic : "话题不限" }}
              </p>
              <p v-if="review.keywords">
                附带关键词：<span
                  v-for="(word, index) in review.keywords"
                  :key="index"
                  >{{ word }}
                </span>
              </p>
              <p v-if="review.word_count && review.word_count">
                图文要求：{{
                  review.word_count ? review.word_count + "字" : "不限字数"
                }}
                |
                {{
                  review.picture_count
                    ? review.picture_count + "张图"
                    : "不限图片数"
                }}
              </p>
              <p v-if="review.extension_preferential">
                优惠信息：{{ review.extension_preferential }}
              </p>
              <p v-if="review.publish_time">
                发布时间：{{ review.publish_time }}
              </p>
            </tbody>
          </td>
        </tr>
        <tr v-if="order.reward.form.creative_theme">
          <td>创作方向</td>
          <td>
            <p>{{ order.reward.form.creative_theme }}</p>
            <p>
              文案要求:
              {{ order.reward.form.creative_needs["文案要求"] || "-" }}
            </p>
            <p>
              图片要求:
              {{ order.reward.form.creative_needs["图片要求"] || "-" }}
            </p>
            <p>
              视频要求:
              {{ order.reward.form.creative_needs["视频要求"] || "-" }}
            </p>
            <p>参考链接: {{ order.reward.form.reference_url || "-" }}</p>
          </td>
        </tr>
        <tr v-if="order.quote && order.quote.length">
          <td>报价明细</td>
          <td>
            <p v-for="(item, index) in order.quote" :key="index">
              {{ item.name }} | {{ item.point / 100 }}映币 | {{ item.reason }}
            </p>
          </td>
        </tr>
        <tr
          v-if="
            order.appraisal &&
              order.appraisal.some(item => {
                return item.type == 'AppraisalFormal';
              })
          "
        >
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
                v-if="item.type == 'AppraisalFormal'"
                :href="item.url"
                >{{ $getPlatformName(item.source) }}
              </el-link>
            </span>
          </td>
        </tr>
        <tr
          v-if="
            order.appraisal &&
              order.appraisal.some(item => {
                return item.type == 'AppraisalAppend';
              })
          "
        >
          <td>追加测评</td>
          <td>
            <span v-for="(link, index) in order.appraisal" :key="index">
              <el-link
                type="primary"
                target="_blank"
                :href="link.url"
                v-if="link.type == 'AppraisalAppend'"
                >{{ $getPlatformName(link.source) }} 时间{{
                  moment(link.time * 1000).format("YYYY.MM.DD")
                }}</el-link
              >
            </span>
          </td>
        </tr>
        <tr
          v-if="
            order.appraisal &&
              order.appraisal.some(item => {
                return item.type == 'AppraisalTicket';
              })
          "
        >
          <td>测评修改</td>
          <td>
            <span v-for="(link, index) in order.appraisal" :key="index">
              <el-link
                type="primary"
                target="_blank"
                :href="link.url"
                v-if="link.type == 'AppraisalTicket'"
                >{{ $getPlatformName(link.source) }} 时间{{
                  moment(link.time * 1000).format("YYYY.MM.DD")
                }}</el-link
              >
            </span>
          </td>
        </tr>
        <template v-if="showAllInfo">
          <tr
            v-if="
              order.cooperation_type == 'CooperationTypeSpreadAndQuote' ||
                order.cooperation_type == 'CooperationTypeQuote' ||
                order.cooperation_type == 'CooperationTypeSpread'
            "
          >
            <td>悬赏发放(推广/报价)</td>
            <td>
              <span
                v-if="
                  order.form_reward_info.status == 'OrderLogStatusSpreadDefault'
                "
                >待发放</span
              >
              <span
                v-if="
                  order.form_reward_info.status == 'OrderLogStatusSpreadApprove'
                "
                >已发放, 发放时间:
                {{
                  moment(order.form_reward_info.form_reward_time * 1000).format(
                    "YYYY.MM.DD HH:mm:ss"
                  )
                }}</span
              >
              <span
                v-if="
                  order.form_reward_info.status == 'OrderLogStatusSpreadReject'
                "
                >不发放</span
              >

              <span v-if="order.form_reward_info.sub_status == 'NotEvaluated'"
                >, 测评未提交</span
              >
              <span v-if="order.form_reward_info.sub_status == 'NotVerified'"
                >, 平台审核中</span
              >
              <span v-if="order.form_reward_info.sub_status == 'ProposalTicket'"
                >, 测评投诉处理中</span
              >
              <span
                v-if="order.form_reward_info.sub_status == 'SponsorRewarded'"
                >商户补发悬赏</span
              >
              <span
                v-if="
                  order.form_reward_info.sub_status == 'OnBoard' &&
                    parseInt(new Date().getTime() / 1000) <
                      order.form_reward_info.form_reward_time
                "
                >, 剩余{{
                  calLeftTime(
                    order.form_reward_info.form_reward_time -
                      parseInt(new Date().getTime() / 1000)
                  )
                }}自动发放</span
              >
              <!--                                              逾期                      逾期后测评 -->
              <span
                v-if="
                  order.form_reward_info.sub_status == 'Expired' ||
                    order.form_reward_info.sub_status == 'ExpiredAppraisal'
                "
                >, 测评逾期</span
              >
              <span v-if="order.form_reward_info.sub_status == 'Negative'"
                >, 测评已差评</span
              >
              <span v-if="order.form_reward_info.sub_status == 'Unaccepted'"
                >, 不满足悬赏要求</span
              >
              <span
                v-if="order.form_reward_info.sub_status == 'AppraisalInvalid'"
                >, 测链接打开异常</span
              >
              <span v-if="order.form_reward_info.sub_status == 'cancel'"
                >, 取消悬赏发放, 理由:
                {{ order.form_reward_info.admin_operate_reason }}, 操作人:
                {{ allAdmin[order.form_reward_info.admin_operator] }},
                {{
                  moment(
                    order.form_reward_info.admin_cancel_time * 1000
                  ).format("YYYY-MM-DD HH:mm:ss")
                }}</span
              >
              <span v-if="order.form_reward_info.sub_status == 'Applying'"
                >, 申请中</span
              >
              <span v-if="order.form_reward_info.sub_status == 'OverTime'"
                >，上榜后提交</span
              >
              <span v-if="order.form_reward_info.sub_status == 'Withdraw'"
                >撤回申请</span
              >
            </td>
          </tr>
        </template>
        <!-- 因为 cooperation_type 没有排名悬赏的筛选项，所以用是否存在数据来判断-->
        <template v-if="showAllInfo">
          <tr v-if="order.reward.rank.enable">
            <td>悬赏发放(排名)</td>
            <td>
              <span
                v-if="
                  order.rank_reward_info.status == 'OrderLogStatusRankDefault'
                "
                >待上榜</span
              >
              <span
                v-if="
                  order.rank_reward_info.status == 'OrderLogStatusRankApprove'
                "
                >已上榜</span
              >
              <span
                v-if="
                  order.rank_reward_info.status == 'OrderLogStatusRankReject'
                "
                >未上榜</span
              >

              <span v-if="order.rank_reward_info.sub_status == 'NotEvaluated'"
                >, 测评未提交</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'NotVerified'"
                >, 平台审核中</span
              >
              <span
                v-if="
                  order.rank_reward_info.sub_status == 'OnBoard' &&
                    !order.rank_reward_info.rank_order &&
                    order.rank_reward_info.on_board_time >
                      new Date().getTime() / 1000
                "
                >, 上榜结束还剩{{
                  calLeftTime(
                    order.rank_reward_info.on_board_time -
                      parseInt(new Date().getTime() / 1000)
                  )
                }}</span
              >
              <span
                v-if="
                  order.rank_reward_info.sub_status == 'OnBoard' &&
                    !order.rank_reward_info.rank_order &&
                    order.rank_reward_info.settle_time >
                      new Date().getTime() / 1000 &&
                    order.rank_reward_info.on_board_time <
                      new Date().getTime() / 1000
                "
                >, 商家评分剩余{{
                  calLeftTime(
                    order.rank_reward_info.settle_time -
                      parseInt(new Date().getTime() / 1000)
                  )
                }}</span
              >
              <span
                v-if="
                  order.rank_reward_info.sub_status == 'OnBoard' &&
                    order.rank_reward_info.rank_order
                "
                >, 最终排名第{{ order.rank_reward_info.rank_order }}, 已发放{{
                  order.rank_reward_info.rank_point
                }}映币</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'OverTime'"
                >，上榜后提交</span
              >
              <span
                v-if="
                  order.rank_reward_info.sub_status == 'Expired' ||
                    order.rank_reward_info.sub_status == 'ExpiredAppraisal'
                "
                >, 测评逾期</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'Unaccepted'"
                >, 原因: 不符合悬赏要求</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'Negative'"
                >, 测评已差评</span
              >
              <span
                v-if="order.rank_reward_info.sub_status == 'AppraisalInvalid'"
                >, 测评打开异常</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'ProposalTicket'"
                >, 测评投诉处理中</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'cancel'"
                >, 取消悬赏发放, 理由:
                {{ order.rank_reward_info.admin_operate_reason }}, 操作人:
                {{ allAdmin[order.rank_reward_info.admin_operator] }},
                {{
                  moment(
                    order.rank_reward_info.admin_cancel_time * 1000
                  ).format("YYYY-MM-DD HH:mm:ss")
                }}</span
              >
              <span
                v-if="order.rank_reward_info.sub_status == 'SponsorRewarded'"
                >, 商户补发悬赏</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'Applying'"
                >, 申请中</span
              >
              <span v-if="order.rank_reward_info.sub_status == 'Withdraw'"
                >, 撤回申请</span
              >
            </td>
          </tr>
        </template>
        <template v-if="showAllInfo">
          <tr v-if="order.review_status != 'OrderLogStatusAdminDefault'">
            <td>悬赏审核(小二)</td>
            <td>
              {{
                order.review_status == "OrderLogStatusAdminApprove"
                  ? "已通过"
                  : order.review_status == "OrderLogStatusAdminReject"
                  ? "未通过"
                  : ""
              }}
            </td>
          </tr>
          <tr v-if="order.patch_reward_time">
            <td>补发悬赏(商家)</td>
            <td>
              操作时间:
              {{
                moment(order.patch_reward_time * 1000).format(
                  "YYYY.MM.DD HH:mm:ss"
                )
              }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "OrderDetail",
  props: {
    order: {
      type: Object,
      default: () => {
        return {
          reward: {
            form: {},
            rank: {}
          },
          form_reward_info: {},
          rank_reward_info: {},
          quote: []
        };
      }
    },
    showAllInfo: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  data() {
    return {
      moment: moment,
      cooperationType: {
        CooperationTypeOld: "老订单",
        CooperationTypeFreeExchange: "免费置换",
        CooperationTypeSpread: "接受悬赏",
        CooperationTypeSpreadAndQuote: "博主报价",
        CooperationTypeQuote: "博主报价"
      },
      reviewsType: ["不限形式", "视频", "图文"] //评测形式
    };
  },
  methods: {
    // 计算剩余时间
    calLeftTime(sec) {
      let minute = 60,
        hour = 60 * 60,
        day = 24 * hour;
      let leftDay, leftHour, leftMinute; // 剩余天数，小数, 分
      if (sec > day) {
        leftDay = parseInt(sec / day);
        leftHour = parseInt((sec - leftDay * day) / hour);
        leftMinute = parseInt((sec - leftDay * day - leftHour * hour) / minute);
        return leftDay + "天" + leftHour + "小时" + leftMinute + "分";
      } else if (sec > 0 && sec < day) {
        leftHour = parseInt(sec / hour);
        leftMinute = parseInt((sec - leftHour * hour) / minute);
        return leftHour + "小时" + leftMinute + "分";
      } else if (sec > 0 && sec < hour) {
        leftMinute = parseInt(sec / minute);
        return leftMinute + "分";
      } else {
        return "-";
      }
    }
  }
};
</script>

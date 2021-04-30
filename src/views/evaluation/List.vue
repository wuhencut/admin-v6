<template>
  <div class="evalution-list">
    <el-form inline>
      <el-form-item>
        <p>
          <el-button @click="$router.back()" icon="el-icon-arrow-left"
            >返回</el-button
          >
        </p>
      </el-form-item>
      <el-form-item>
        <p>
          <span v-if="is_unique == 1">非合集,</span>
          <span v-else>合集,</span>
          测评排名前{{ rank_count }} :
        </p>
      </el-form-item>
      <el-form-item>
        <div class="rank">
          <div
            class="rank-item"
            v-for="(item, index) in checkList"
            :key="index"
          >
            <p>
              <el-tag>{{ item.user_nickname }}</el-tag>
              <el-button
                @click="move(index, index - 1)"
                v-show="index > 0"
                type="text"
                >前移</el-button
              >
              <el-button
                @click="move(index, index + 1)"
                v-show="index < checkList.length - 1"
                type="text"
                >后移</el-button
              >
            </p>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <!--删除 :disabled="checkList.length==0"-->
        <el-button
          @click="submitRankClick"
          :disabled="isRank == 1 || submitDisabled"
          type="primary"
          >确认评分</el-button
        >
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="当前排名" width="100">
        <template slot-scope="scope">
          <p>
            <span v-if="scope.row.designated_ranking > 0"
              >第 {{ scope.row.designated_ranking }} 名</span
            >
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="博主昵称"
        prop="user_nickname"
        min-width="150"
      ></el-table-column>
      <el-table-column label="评测渠道">
        <template slot-scope="scope">
          <img :src="sourceList[scope.row.source]" width="20" height="20" />
        </template>
      </el-table-column>
      <el-table-column label="获赞数" prop="like_count"></el-table-column>
      <el-table-column
        label="EMV得分"
        prop="score"
        width="100"
      ></el-table-column>
      <el-table-column label="测评时间" width="200">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.appraisal_time * 1000).format(
                "YYYY年MM月DD日 HH:mm"
              )
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="是否报价" width="100">
        <template slot-scope="scope">
          <p>{{ scope.row.is_offer == 0 ? "否" : "是" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="测评评分">
        <template slot-scope="scope">
          <span v-if="scope.row.ranking_desc == 1">差</span>
          <span v-if="scope.row.ranking_desc == 2">中</span>
          <span v-if="scope.row.ranking_desc == 3">好</span>
        </template>
      </el-table-column>
      <el-table-column label="打标状态">
        <template slot-scope="scope">{{
          scope.row.content_taged ? "已打标" : "未打标"
        }}</template>
      </el-table-column>
      <el-table-column label="测评链接" width="200">
        <template slot-scope="scope">
          <p class="link">
            <a :href="scope.row.appraisal_url" target="_blank">{{
              scope.row.appraisal_url
            }}</a>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <div style="display:flex;">
            <el-button
              type="text"
              @click="detailClick(scope.row, scope.$index)"
              style="padding-right: 10px;"
              >详情</el-button
            >
            <!--                    已经被排名-->
            <el-checkbox-group
              v-model="checkList"
              :max="rank_count"
              :disabled="isRank == 1 || submitDisabled"
            >
              <el-checkbox :label="scope.row" border>选择</el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- /table -->

    <!-- 详情Dg -->
    <div v-if="detailDg">
      <el-dialog
        :visible.sync="detailDg"
        title="测评详情"
        class="mod-detail"
        width="1100px"
      >
        <!-- 切换测评的按钮 -->
        <div>
          <el-button
            @click="changeReview('-')"
            style="font-size: 16px;"
            type="text"
            >上一篇</el-button
          >
          <el-button
            @click="changeReview('+')"
            style="font-size: 16px;"
            type="text"
            >下一篇</el-button
          >
        </div>
        <el-row :gutter="20" style="border-bottom: 1px solid #dedede;">
          <!-- 头部 -->
          <div class="mod-top flex">
            <div class="mod-top-left">
              <p>
                <el-tag>{{ simpleData.index + 1 }}</el-tag>
                <el-tag type="warning" style="margin-left: 10px;">{{
                  simpleData.user_nickname
                }}</el-tag>
              </p>
              <div class="chennel-info flex">
                <img
                  class="channel-img"
                  :src="sourceList[simpleData.source]"
                  width="20"
                  height="20"
                />
                <el-tag>
                  <a
                    class="channel-link"
                    :href="simpleData.appraisal_url"
                    target="_blank"
                    >链接</a
                  >
                </el-tag>
                <span class="item">EMV： {{ simpleData.score }} |</span>
                <span class="item"
                  >是否报价:
                  {{ simpleData.is_offer == 0 ? "否" : "是" }} |</span
                >
                <span class="item"
                  >测评时间:
                  {{
                    moment(simpleData.appraisal_time * 1000).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  }}</span
                >
              </div>
            </div>
            <div class="mod-top-right flex-s1" style="text-align: right;">
              <el-radio-group
                @change="
                  rankEdit(simpleData.ranking_id, simpleData.ranking_desc)
                "
                v-model="simpleData.ranking_desc"
              >
                <el-radio-button :label="1">差</el-radio-button>
                <el-radio-button :label="2">中</el-radio-button>
                <el-radio-button :label="3">好</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 中间 -->
          <el-row :gutter="20">
            <div class="mod-info" v-if="!isImage && !onlyText">
              <!-- 视频 -->
              <el-col :span="12">
                <p class="title">测评详情</p>
                <el-tag v-if="simpleData.content_taged">标签已提交</el-tag>
                <div class="mod-img-review">
                  <iframe
                    :src="currReview.video.content"
                    style="width: 500px; height: 500px;"
                    frameborder="0"
                  ></iframe>
                </div>
              </el-col>
              <!-- 打标模块 -->
              <el-col :span="8">
                <!-- 视频测评 -->
                <div class="tags" v-if="!isImage && !onlyText">
                  <p class="title">视频标签</p>
                  <p class="tip">视频清晰度</p>
                  <el-radio-group v-model="currReview.video.manual.definition">
                    <el-radio-button :label="0">视频模糊</el-radio-button>
                    <el-radio-button :label="1">视频清晰</el-radio-button>
                  </el-radio-group>
                  <p class="tip">产品出现时长</p>
                  <el-radio-group
                    v-model="currReview.video.manual.display_duration"
                  >
                    <el-radio-button :label="0">不符合</el-radio-button>
                    <el-radio-button :label="1">符合</el-radio-button>
                  </el-radio-group>
                  <p class="tip">滤镜使用</p>
                  <el-radio-group v-model="currReview.video.manual.filter">
                    <el-radio-button :label="0">失真</el-radio-button>
                    <el-radio-button :label="1">合理</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
              <!-- ai识别结果 -->
              <el-col :span="4">
                <div class="ai-tags" v-if="!isImage && !onlyText">
                  <p class="title">AI识别结果</p>
                  <p class="ai-tip">
                    {{
                      currImageData.ai.definition == 0
                        ? "视频模糊"
                        : "视频清晰" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currImageData.ai.display_duration == 0
                        ? "不符合"
                        : "符合" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currImageData.ai.filter == 0 ? "失真" : "合理" || "无结果"
                    }}
                  </p>
                </div>
              </el-col>
            </div>
            <div class="mod-info" v-if="isImage && !onlyText">
              <!-- 图片预览 -->
              <el-col :span="12">
                <p class="title">测评详情</p>
                <el-tag v-if="simpleData.content_taged">标签已提交</el-tag>
                <div class="mod-img-review">
                  <swiper
                    :options="swiperOptionTop"
                    class="swiper-top"
                    ref="swiperTop"
                  >
                    <swiper-slide
                      class="img-item"
                      v-for="(item, index) in currReview.images"
                      :key="index"
                    >
                      <img :src="item.content" />
                    </swiper-slide>
                    <div
                      class="swiper-button-next swiper-button-white"
                      slot="button-next"
                    ></div>
                    <div
                      class="swiper-button-prev swiper-button-white"
                      slot="button-prev"
                    ></div>
                  </swiper>
                  <!-- swiper2 Thumbs -->
                  <swiper
                    :options="swiperOptionThumbs"
                    class="swiper-down"
                    ref="swiperDown"
                  >
                    <swiper-slide
                      class="img-item"
                      v-for="(item, index) in currReview.images"
                      :key="index"
                    >
                      <img
                        style="width: 75px; height: 50px; object-fit: cover;"
                        :src="item.content"
                      />
                      <span
                        v-if="item.taged"
                        style="color: #04c4b3"
                        class="el-icon-success"
                      ></span>
                      <span
                        v-else
                        style="color: #ff7e67"
                        class="el-icon-error"
                      ></span>
                    </swiper-slide>
                  </swiper>
                </div>
              </el-col>
              <!-- 打标模块 -->
              <el-col :span="8">
                <!-- 图片测评 -->
                <div class="tags" v-if="isImage && !onlyText">
                  <p class="title">图片标签</p>
                  <p class="tip">
                    构图合理、光线好、图片清晰度高、色彩搭配美观
                  </p>
                  <el-radio-group v-model="currImageData.manual.aesthetics">
                    <el-radio-button :label="0">差</el-radio-button>
                    <el-radio-button :label="1">中</el-radio-button>
                    <el-radio-button :label="2">好</el-radio-button>
                  </el-radio-group>
                  <p class="tip">有logo清晰</p>
                  <el-radio-group v-model="currImageData.manual.logo">
                    <el-radio-button :label="0">无logo</el-radio-button>
                    <el-radio-button :label="1">有logo</el-radio-button>
                  </el-radio-group>
                  <p class="tip">产品特写</p>
                  <el-radio-group v-model="currImageData.manual.display">
                    <el-radio-button :label="0">不合格</el-radio-button>
                    <el-radio-button :label="1">合格</el-radio-button>
                  </el-radio-group>
                  <p class="tip">产品使用,产品上身,上脸,摆拍</p>
                  <el-radio-group v-model="currImageData.manual.product_using">
                    <el-radio-button :label="0">不符合</el-radio-button>
                    <el-radio-button :label="1">使用对比</el-radio-button>
                    <el-radio-button :label="2">摆拍</el-radio-button>
                  </el-radio-group>
                  <p class="tip">标签作废(图片不适合打标)</p>
                  <el-radio-group v-model="currImageData.taged">
                    <el-radio-button :label="false">标签作废</el-radio-button>
                    <el-radio-button :label="true">标签有效</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
              <!-- ai识别结果 -->
              <el-col :span="4">
                <div
                  class="ai-tags"
                  v-if="isImage && currImageData.ai && !onlyText"
                >
                  <p class="title">AI识别结果</p>
                  <p class="ai-tip">
                    {{
                      currImageData.ai.aesthetics == 0
                        ? "差"
                        : currImageData.ai.aesthetics == 1
                        ? "中"
                        : "好" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currImageData.ai.logo == 0
                        ? "无logo"
                        : "有logo" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currImageData.ai.display == 0
                        ? "不合格"
                        : "合格" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currImageData.ai.product_using == 0
                        ? "不符合"
                        : currImageData.ai.product_using == 1
                        ? "使用对比"
                        : "摆拍" || "无结果"
                    }}
                  </p>
                </div>
              </el-col>
            </div>
          </el-row>
          <!-- 文本标签 -->
          <el-row :gutter="20" v-if="currReview.article">
            <div class="mod-info">
              <el-col :span="12">
                <div class="production-desc">
                  {{ currReview.article.content }}
                </div>
              </el-col>
              <!-- 打标模块 -->
              <el-col :span="8">
                <div class="tags">
                  <p class="title">文本标签</p>
                  <p class="tip">文字篇幅</p>
                  <el-radio-group v-model="currReview.article.manual['length']">
                    <el-radio-button :label="0">短</el-radio-button>
                    <el-radio-button :label="1">中</el-radio-button>
                    <el-radio-button :label="2">长</el-radio-button>
                  </el-radio-group>
                  <p class="tip">产品描述</p>
                  <el-radio-group v-model="currReview.article.manual.desc">
                    <el-radio-button :label="0">无</el-radio-button>
                    <el-radio-button :label="1">短</el-radio-button>
                    <el-radio-button :label="2">中</el-radio-button>
                    <el-radio-button :label="3">详细</el-radio-button>
                  </el-radio-group>
                  <p class="tip">合集</p>
                  <el-radio-group
                    v-model="currReview.article.manual.collection"
                  >
                    <el-radio-button :label="0">否</el-radio-button>
                    <el-radio-button :label="1">是</el-radio-button>
                  </el-radio-group>
                  <p class="tip">使用效果描述</p>
                  <el-radio-group
                    v-model="currReview.article.manual.use_effect"
                  >
                    <el-radio-button :label="0">无</el-radio-button>
                    <el-radio-button :label="1">短</el-radio-button>
                    <el-radio-button :label="2">中</el-radio-button>
                    <el-radio-button :label="3">详细</el-radio-button>
                  </el-radio-group>
                  <p class="tip">使用感受</p>
                  <el-radio-group
                    v-model="currReview.article.manual.use_feeling"
                  >
                    <el-radio-button :label="0">差评</el-radio-button>
                    <el-radio-button :label="1">中性</el-radio-button>
                    <el-radio-button :label="2">推荐</el-radio-button>
                  </el-radio-group>
                  <p class="tip">标签作废(文本不适合打标)</p>
                  <el-radio-group v-model="currReview.article.taged">
                    <el-radio-button :label="false">标签作废</el-radio-button>
                    <el-radio-button :label="true">标签有效</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
              <!-- ai识别结果 -->
              <el-col :span="4">
                <div
                  class="ai-tags"
                  v-if="
                    isImage &&
                      currReview.article &&
                      currReview.article.ai &&
                      !onlyText
                  "
                >
                  <p class="title">AI识别结果</p>
                  <p class="ai-tip">
                    {{
                      currReview.article.ai["length"] == 0
                        ? "短"
                        : currReview.article.ai["length"] == 1
                        ? "中"
                        : "长" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currReview.article.ai.desc == 0
                        ? "无"
                        : currReview.article.ai.desc == 1
                        ? "短"
                        : currReview.article.ai.desc == 2
                        ? "中"
                        : "详细" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currReview.article.ai.collection == 0
                        ? "否"
                        : "是" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currReview.article.ai.use_effect == 0
                        ? "无"
                        : currReview.article.ai.use_effect == 1
                        ? "短"
                        : currReview.article.ai.use_effect == 2
                        ? "中"
                        : "详细" || "无结果"
                    }}
                  </p>
                  <p class="ai-tip">
                    {{
                      currReview.article.ai.use_feeling == 0
                        ? "差评"
                        : currReview.article.ai.use_feeling == 1
                        ? "中性"
                        : "推荐" || "无结果"
                    }}
                  </p>
                </div>
              </el-col>
            </div>
          </el-row>
        </el-row>
        <div slot="footer">
          <el-button @click="detailDg = false">取消</el-button>
          <el-button @click="submit" type="primary">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { swiper, swiperSlide } from "vue-awesome-swiper";
require("swiper/dist/css/swiper.css");

export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      isSee: false, // 是否已经打标提交过
      submitDisabled: false, // 页面报错，不能提交评分
      reviewData: {
        images: []
      },
      outerIndex: null, // 当前整篇测评在列表中的index
      currIndex: 1, // 图片测评当前index
      swiperOptionTop: {
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        on: {
          slideChangeTransitionEnd: () => {
            let swiperTop = this.$refs.swiperTop.swiper;
            // let swiperDown = this.$refs.swiperDown.swiper;
            this.currIndex = swiperTop.activeIndex;
            this.currImageData = this.currReview.images[swiperTop.activeIndex];
            // 没提交过
            if (!this.isSee) {
              this.currImageData.taged = true; // 看过就默认打标
            }
          }
        }
      },
      sourceList: [
        "",
        "http://video.yingtu.co/images/platform/weibo.png",
        "http://video.yingtu.co/images/platform/xiaohongshu.png",
        "http://video.yingtu.co/images/platform/meipai.png",
        "http://video.yingtu.co/images/platform/bilibili.png",
        "http://video.yingtu.co/images/platform/wetaobao.png",
        "http://video.yingtu.co/images/platform/weixin.png",
        "http://video.yingtu.co/images/platform/douyin.png",
        "http://video.yingtu.co/images/platform/kuaishou.png"
      ],
      swiperOptionThumbs: {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 0.2,
        slideToClickedSlide: true
      },
      simpleData: {}, // dg顶部概览
      currReview: {
        images: [],
        article: {
          ai: {},
          manual: {}
        }
      }, // 当前测评详情
      detailDg: false, // 详情dg
      moment: moment,
      isRank: this.$route.query.isRank, //已评分
      plant: ["", "微博", "小红书", "美拍", "B站", "微淘", "公众号", "抖音"],
      search: {
        campaign_id: this.$route.query.id
      },
      list: [],
      onlyText: false, // 只有文字
      checkList: [],
      rank_count: 0, // 悬赏人数
      is_unique: 0, // 是否独家评测
      ranking_desc: 0, // 测评评价: 0无，1:差，2:中，3:好
      isImage: false, //
      currImageData: {
        manual: {
          aesthetics: "",
          logo: "",
          display: "",
          product_using: ""
        },
        ai: {},
        article: {
          manual: {},
          ai: {}
        }
      } // 当前图片数据
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    // 测评打标提交
    async submit() {
      this.currReview["appraisal_url"] = this.simpleData.appraisal_url || "";
      let res = await this.$api.appraisalContentSubmit(this.currReview);
      if (res.error_code == 0) {
        this.$message.success("提交成功");
        this.simpleData.content_taged = true;
        this.searchList();
      }
    },
    // 初始化测评数据
    initReviewData() {
      // 图片测评 && 有数据 && 没有被打标。。。需要赋默认值
      if (
        this.isImage &&
        this.currReview.images.length &&
        !this.currReview.images[0].manual
      ) {
        for (let i = 0; i < this.currReview.images.length; i++) {
          this.currReview.images[i]["manual"] = {
            aesthetics: 1,
            logo: 1,
            display: 0,
            product_using: 0
          };
          this.currReview.images[i].taged = false;
        }
        this.currImageData = this.currReview.images[0];
        this.currImageData.taged = true;
      }
    },
    // 切换上一篇，下一篇测评
    async changeReview(type) {
      if (type == "-") {
        if (this.simpleData.index == 0) {
          this.$message.error("没有上一篇了");
          return false;
        } else {
          this.simpleData.index -= 1;
        }
      } else {
        if (this.simpleData.index == this.list.length - 1) {
          this.$message.error("没有下一篇了");
          return false;
        } else {
          this.simpleData.index += 1;
        }
      }
      this.detailClick(this.list[this.simpleData.index], this.simpleData.index);
    },
    async detailClick(data, index) {
      this.isSee = false; // 初始化不能是true
      data.appraisal_url;
      if (!data.appraisal_url) {
        this.$message.error("测评数据有误");
        return false;
      }
      let res = await this.$api.getAppraisalContent({
        appraisal_url: data.appraisal_url
      });
      if (res.error_code == 0) {
        this.currReview = res.data || {};
        if (
          !this.currReview.article &&
          !this.currReview.images &&
          !this.currReview.video
        ) {
          this.$message.error("无测评数据");
          return false;
        }
        // 视频
        if (!this.currReview.images) {
          this.isImage = false;
          if (this.currReview.video && !this.currReview.video.manual) {
            this.currReview.video.manual = {
              definition: 1,
              display_duration: 1,
              filter: 1
            };
          }
        }
        if (this.currReview.article) {
          if (!this.currReview.article.manual) {
            this.currReview.article.manual = {
              length: 1,
              desc: 1,
              collection: 0,
              use_effect: 2,
              use_feeling: 0
            };
          }
          if (!this.currReview.images && !this.currReview.video) {
            this.onlyText = true; // 只有文字
          } else {
            this.onlyText = false;
          }
        }
        if (this.currReview.images) {
          // 图文
          this.isImage = true;
          if (!this.currReview.images[0].manual) {
            this.initReviewData();
          } else {
            this.isSee = true; // 是否已经打标提交过
            this.currImageData = this.currReview.images[0];
          }
          if (this.currReview.article && !this.currReview.article.manual) {
            this.currReview.article.manual = {
              length: 1,
              desc: 2,
              collection: 1,
              use_effect: 1,
              use_feeling: 2
            };
            this.currReview.article.taged = false;
          }
          this.detailDg = true;
          this.$nextTick(() => {
            let swiperTop = this.$refs.swiperTop.swiper;
            let swiperDown = this.$refs.swiperDown.swiper;
            swiperTop.controller.control = swiperDown;
            swiperDown.controller.control = swiperTop;
          });
        }
        this.simpleData = data;
        this.simpleData["index"] = index; // 获取序列标
        this.detailDg = true;
      }
    },
    // 评价 好中差
    async rankEdit(ranking_id, ranking_desc) {
      let res = await this.$api.rankEdit({
        ranking_id: ranking_id,
        ranking_desc: ranking_desc
      });

      if (res.error_code == 0) {
        this.$message.success("评价成功");
      }
    },
    //获取评分列表
    async searchList() {
      let res = await this.$api.apprasialList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.rank_count = res.data.rank_count;
        this.is_unique = res.data.is_unique;
      } else {
        this.list = [];
        this.submitDisabled = true;
      }
    },
    //测评
    submitRankClick() {
      this.$confirm(
        "确认后不可修改,确认选择当前的" + this.checkList.length + "个测评吗？",
        "温馨提示",
        {
          confirmButtonText: "必须的",
          cancelButtonText: "再想想"
        }
      )
        .then(async () => {
          let rankingList = [];
          for (var i = 0; i < this.checkList.length; i++) {
            rankingList.push({
              ranking_id: this.checkList[i].ranking_id,
              user_id: this.checkList[i].user_id,
              designated_ranking: i + 1,
              appraisal_url: this.checkList[i].appraisal_url
            });
          }
          let req = {
            campaign_id: this.search.campaign_id,
            ranking_list: rankingList
          };
          let res = await this.$api.appraisalRankAdd(req);
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.isRank = 1; // 将选择按钮置灰，防止重复提交
            this.checkList = [];
            this.searchList();
          } else {
            this.$message.error("系统出错了" + res.error_description);
          }
        })
        .catch(() => {
          return false;
        });
    },
    //移动排名
    move(index, target) {
      var indexItem = this.checkList[index];
      var targetItem = this.checkList[target];
      this.checkList.splice(index, 1, targetItem);
      this.checkList.splice(target, 1, indexItem);
    }
  }
};
</script>
<style lang="less" scoped>
.el-icon-arrow-right,
el-icon-arrow-left {
  font-size: 30px;
  font-weight: bold;
  &.disabled {
    opacity: 0.3;
  }
}
.evalution-list {
  .ai-tags {
    .ai-tip {
      line-height: 66px;
    }
  }
  .mod-info {
    .production-desc {
      padding-top: 20px;
      width: 500px;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .tags {
      padding-left: 10px;
      padding-bottom: 20px;
    }
    .mod-img-review {
      cursor: pointer;
      padding-top: 14px;
      width: 500px;
      height: 500px;
      .swiper-down {
        box-sizing: border-box;
        padding: 10px 0;
        .swiper-slide {
          width: 15%;
          height: 100%;
          opacity: 0.4;
          text-align: center;
          img {
            width: 100%;
          }
        }
        .swiper-slide-active {
          opacity: 1;
        }
      }
      .swiper-top {
        height: 80% !important;
        width: 100%;
        .img-item {
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    padding-top: 10px;
  }
  .tip {
    padding-top: 10px;
  }
  .flex {
    display: flex;
    align-content: center;
  }
  .flex-s1 {
    flex: 1;
  }
  .mod-detail {
    .mod-top {
      .mod-top-right {
        padding-left: 10px;
      }
      .mod-top-left {
        .chennel-info {
          padding: 10px 0;
          .channel-img {
            margin-right: 10px;
          }
          .channel-link {
            text-decoration: none;
            color: #409eff;
          }
          .item {
            padding-left: 10px;
          }
        }
      }
    }
  }
  .rank {
    .rank-item {
      display: inline-block;
      margin-left: 40px;
    }
  }
  .link {
    width: 100%;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }
}
</style>

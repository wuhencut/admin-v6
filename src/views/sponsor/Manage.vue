<template>
  <div class="page-sponsor-apply">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <el-input
            class="search-inp"
            v-model="search.sponsor_id"
            @keyup.enter.native="searchBtnClick"
            placeholder="账号ID"
            maxlength="19"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            v-model="search.company_name"
            @keyup.enter.native="searchBtnClick"
            placeholder="企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            v-model="search.brand_name"
            @keyup.enter.native="searchBtnClick"
            placeholder="品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            v-model="search.phone"
            @keyup.enter.native="searchBtnClick"
            placeholder="联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            placeholder="邀请码"
            v-model="search.invitation"
            @keyup.enter.native="searchBtnClick"
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
        <el-form-item>
          <el-select
            class="search-inp"
            v-model="search.status"
            @change="searchBtnClick"
          >
            <el-option :value="0" label="全部订单状态"></el-option>
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="已冻结"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            class="search-inp"
            v-model="search.housekeeper"
            placeholder="映兔管家状态"
            @change="searchBtnClick"
            style="width: 140px;"
          >
            <el-option :value="0" label="全部管家状态"></el-option>
            <el-option :value="1" label="已开始"></el-option>
            <el-option :value="2" label="未开始"></el-option>
            <el-option :value="3" label="未开启"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            class="search-inp"
            v-model="search.sort_type"
            placeholder="排序"
            @change="searchBtnClick"
            style="width: 140px"
          >
            <el-option :value="0" label="默认排序"></el-option>
            <el-option :value="1" label="信用分从低到高排序"></el-option>
            <el-option :value="2" label="积分从高到低排序"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            class="search-inp"
            v-model="search.company_certification"
            style="width: 140px;"
            placeholder="企业认证状态"
            @change="searchBtnClick"
          >
            <el-option value label="全部认证状态"></el-option>
            <el-option value="not_create" label="未提交"></el-option>
            <el-option value="waiting" label="待审核"></el-option>
            <el-option value="approve" label="已通过"></el-option>
            <el-option value="refuse" label="已拒绝"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <bd-select
            class="search-inp"
            @change="searchBtnClick"
            style="width: 140px;"
            v-model="search.bd_admin_id"
            isAll
          ></bd-select>
        </el-form-item>
        <el-form-item label="认证通过时间:">
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
        <el-form-item label="入驻时间:">
          <el-date-picker
            class="search-time"
            v-model="registTime"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="searchBtnClick"
            type="primary"
            icon="el-icon-search"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- list -->
    <div class="list">
      <el-table :data="list">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="账号/企业名称" width="160">
          <template slot-scope="scope">
            <p>{{ scope.row.sponsor_id }}</p>
            <p>{{ scope.row.company_name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="授权品牌" prop="auth_brand">
          <template slot-scope="scope">
            <div v-if="scope.row.auth_brand">
              <p v-for="(brand, index) in scope.row.auth_brand" :key="index">
                {{ brand }}
              </p>
            </div>
            <div v-else>暂无</div>
          </template>
        </el-table-column>
        <el-table-column
          label="账户等级"
          prop="sponsor_level"
        ></el-table-column>
        <el-table-column label="认证状态 | 通过时间" width="150">
          <template slot-scope="scope">
            <div>
              <el-tag
                v-if="scope.row.company_auth == 'not_create'"
                type="warning"
                >未提交</el-tag
              >
              <el-tag v-if="scope.row.company_auth == 'waiting'">待审核</el-tag>
              <el-tag type="success" v-if="scope.row.company_auth == 'approve'"
                >已通过</el-tag
              >
              <el-tag type="danger" v-if="scope.row.company_auth == 'refuse'"
                >已拒绝</el-tag
              >
            </div>
            <div>
              {{
                scope.row.company_verify_approve_time
                  ? moment(scope.row.company_verify_approve_time * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册邮箱" width="150">
          <template slot-scope="scope">
            <p>{{ scope.row.email }}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="user_name"></el-table-column>
        <el-table-column
          label="联系电话"
          prop="phone"
          width="120"
        ></el-table-column>
        <!-- 邀请码/邀请人 -->
        <el-table-column label="邀请码/邀请人" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.inviter_code == ''">-</div>
            <div v-else>
              <p>{{ scope.row.inviter_code }}</p>
              <p>{{ scope.row.inviter }}</p>
            </div>
          </template>
        </el-table-column>
        <!-- 邀请码/邀请人 -->
        <el-table-column label="运营负责人" prop="operation_admin_id">
          <template slot-scope="scope">
            {{ allAdmin[scope.row.operation_admin_id] }}
          </template>
        </el-table-column>
        <el-table-column label="BD负责人">
          <template slot-scope="scope">{{
            allAdmin[scope.row.bd_admin_id]
          }}</template>
        </el-table-column>
        <el-table-column label="入驻时间" width="140">
          <template slot-scope="scope">
            {{
              moment(scope.row.passport_register_time * 1000).format(
                "YYYY/MM/DD HH:mm:ss"
              )
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <p>
              <el-button type="text" @click="editBtnClick(scope.row)"
                >查看</el-button
              >
              <!-- 正常 、 冻结能备注 -->
              <!-- <el-button
                type="text"
                v-if="scope.row.status == 1 || scope.row.status == 2"
                @click="showRemark(scope.row.sponsor_id)"
                >备注</el-button
              >
              <template>
                <el-button
                  v-if="scope.row.status == 1"
                  type="text"
                  @click="frozenBtnClick(scope.row)"
                  >冻结</el-button
                >
                <el-button
                  v-if="scope.row.status == 2"
                  type="text"
                  @click="unfrozenBtnClick(scope.row)"
                  >解冻</el-button
                >
              </template> -->
            </p>
            <!-- <p>
              <el-button
                type="text"
                v-if="scope.row.company_auth == 'not_create'"
                @click="newAuthClick(scope.row.sponsor_id)"
                >新增认证</el-button
              >
              <el-button
                type="text"
                @click="newApplyClick(scope.row.sponsor_id)"
                >新增授权</el-button
              >
            </p> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-show="list.length">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="currentChange"
          :current-page="search.page_id"
        ></el-pagination>
      </div>
    </div>
    <!-- list -->
    <!-- sponsorDialog -->
    <el-dialog
      title="商户账号编辑/新增"
      width="800px"
      :visible.sync="sponsorDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="sponsor"
        :rules="rules"
        ref="sponsorForm"
        label-width="90px"
        label-position="left"
        :disabled="(sponsor.status == 2 || sponsor.status == 4) && !isNewApply"
      >
        <el-row :gutter="20" style="border-bottom: 1px solid #dedede;">
          <el-col :span="12">
            <el-form-item label="BD负责人" prop="bd_admin_id">
              <bd-select disabled v-model="sponsor.bd_admin_id"></bd-select>
              <el-button
                disabled
                v-show="sponsor.bd_admin_id"
                @click="resetBdAdmin"
                type="primary"
                >无负责人</el-button
              >
            </el-form-item>
            <el-form-item label="商户来源">
              <el-select v-model="sponsor.source" placeholder="选择商户来源">
                <el-option
                  v-for="(item, index) in sourceTemplate"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运营负责人">
              <admin-select
                v-model="sponsor.operation_admin_id"
                isSponsorOperator
              ></admin-select>
            </el-form-item>
            <el-form-item label="推荐人">
              <el-input
                style="width: 194px;"
                v-if="isNewApply"
                v-model="sponsor.invitation"
              ></el-input>
              <el-input
                style="width: 194px;"
                v-else
                disabled
                :value="sponsor.invitation || '-'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-form-item label="账户ID">
              <el-input
                :value="sponsor.user_id ? sponsor.user_id : '-'"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="登录邮箱" prop="email">
              <el-input
                v-model="sponsor.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="company_name">
              <el-input
                v-model="sponsor.company_name"
                placeholder="请输入企业名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="授权品牌">
              <p v-if="sponsor.auth_brand">
                <el-tag
                  v-for="(brand, index) in sponsor.auth_brand"
                  :key="index"
                  >{{ brand }}</el-tag
                >
              </p>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="sponsor.phone"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="微信号">
              <el-input
                v-model="sponsor.wechat"
                placeholder="请输入微信号"
              ></el-input>
            </el-form-item>
            <el-form-item label="映兔管家">
              <div>
                <el-radio-group v-model="sponsor.housekeeper_status">
                  <el-radio :label="false">未开启</el-radio>
                  <el-radio :label="true">已设置</el-radio>
                </el-radio-group>
                <el-date-picker
                  style="width: 280px"
                  v-model="housekeeper_time"
                  :disabled="!sponsor.housekeeper_status"
                  type="daterange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册时间">
              <el-input
                :value="
                  sponsor.register_time
                    ? moment(sponsor.register_time * 1000).format(
                        'YYYY-MM-DD HH:mm'
                      )
                    : '-'
                "
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="积分">{{
              sponsor.reward_point || 0
            }}</el-form-item>
            <el-form-item label="信用分">{{
              sponsor.credit_point || 0
            }}</el-form-item>
            <el-form-item label="联系人" prop="user_name">
              <el-input
                v-model="sponsor.user_name"
                placeholder="请输入联系人姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺链接">
              <el-input
                v-model="sponsor.shop_link"
                placeholder="请输入店铺链接"
              ></el-input>
            </el-form-item>
            <el-form-item label="发货类型">
              <el-radio-group v-model="sponsor.express_type">
                <el-radio :label="1">商户发货</el-radio>
                <el-radio :label="2">平台发货</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="企业认证">
              <el-tag v-if="sponsor.company_auth == 'not_create'"
                >未提交</el-tag
              >
              <el-tag v-if="sponsor.company_auth == 'waiting'">待审核</el-tag>
              <el-tag type="success" v-if="sponsor.company_auth == 'approve'"
                >已通过</el-tag
              >
              <el-tag type="danger" v-if="sponsor.company_auth == 'refuse'"
                >已拒绝</el-tag
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-top: 1px solid #dedede;"
          v-if="sponsor.payment"
        >
          <p style="color: #303133; font-size: 18px;padding: 20px 10px;">
            商户认证信息
          </p>
          <el-col :span="12">
            <el-form-item label="账户类型">
              <el-radio>对公账户</el-radio>
            </el-form-item>
            <el-form-item label="收款户名">{{
              sponsor.payment.account_name
            }}</el-form-item>
            <el-form-item label="收款账号">{{
              sponsor.payment.account_number
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户城市"
              >{{ sponsor.payment.account_province }}/{{
                sponsor.payment.account_city
              }}</el-form-item
            >
            <el-form-item label="银行名称">{{
              sponsor.payment.account_bank
            }}</el-form-item>
            <el-form-item label="开户支行">{{
              sponsor.payment.account_sub_bank
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div v-if="!isNewApply">
            <el-button
              v-if="authList.indexOf('1604372133') > -1"
              type="primary"
              @click="submitSponsor()"
              >提交保存</el-button
            >
            <el-button @click="sponsorDialog = false">取消</el-button>
          </div>
          <div v-else>
            <el-button v-if="isNewApply" type="primary" @click="submitSponsor()"
              >新增申请</el-button
            >
            <el-button @click="sponsorDialog = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /sponsorDialog -->
    <!-- remark dialog -->
    <el-dialog
      :visible.sync="remarkDialog"
      :close-on-click-modal="false"
      title="备注"
    >
      <div class="remark-list">
        <div
          class="remark-item"
          v-for="(item, index) in remarkList"
          :key="index"
        >
          <p class="remark-title">
            时间：
            {{ moment(item.comment_time * 1000).format("YYYY-MM-DD HH:mm") }} /
            操作人: {{ allAdmin[item.admin_id] }}
          </p>
          <p class="remark-content">{{ item.content }}</p>
        </div>
      </div>
      <div class="new-remark" v-if="isNewRemark">
        <el-input
          v-model="remark"
          placeholder="请填写您的备注"
          type="textarea"
          rows="5"
          maxlength="300"
        ></el-input>
      </div>
      <el-button @click="isNewRemark = true" class="add-btn" type="text">
        <i class="el-icon-circle-plus"></i> 新增备注
      </el-button>
      <div slot="footer">
        <el-button type="primary" @click="addSponsorRemark" :disabled="!remark"
          >提交保存</el-button
        >
        <el-button @click="remarkDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- / remark dialog -->
    <!-- 新增企业认证弹窗 -->
    <el-dialog :visible.sync="newAuthDg" title="企业认证" width="800px">
      <el-form
        ref="newAuthForm"
        :model="newAuthData"
        label-width="90px"
        label-position="left"
        :rules="newAuthRules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户类型">
              <el-radio-group v-model="newAuthData.sponsor_account_type">
                <el-radio label="brand_owner">品牌方</el-radio>
                <el-radio label="brand_agent">代理商</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="营业执照" prop="business_license_image">
              <upload-img
                v-model="newAuthData.business_license_image"
                style="width: 100px; height: 100px;"
              ></upload-img>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信用代码" prop="usci">
              <el-input
                v-model="newAuthData.usci"
                placeholder="请输入信用代码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="newAuthDg = false">取消</el-button>
        <el-button @click="newAuthSubmit" type="primary">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增企业认证弹窗 -->
    <!-- 新增企业申请弹窗 -->
    <el-dialog :visible.sync="newApplyDg" title="新建申请" width="900px">
      <el-form
        ref="newApplyForm"
        :model="newApplyData"
        label-width="100px"
        label-position="left"
        :rules="newApplyRules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请品牌" prop="brand_name">
              <div style="display: flex;">
                <el-autocomplete
                  v-model="newApplyData.brand_name"
                  :fetch-suggestions="searchBrand"
                  @select="handleSelect"
                ></el-autocomplete>
                <el-tag
                  v-if="brandAuthed"
                  style="margin-top: 3px; margin-left: 4px;"
                  type="danger"
                  >该品牌已被认证</el-tag
                >
              </div>
            </el-form-item>
            <el-form-item label="品牌logo">
              <upload-img
                v-model="newApplyData.brand_logo"
                disabled
              ></upload-img>
            </el-form-item>
            <el-form-item label="品牌等级" prop="brand_level">
              {{ newApplyData.brand_level }}
            </el-form-item>
            <el-form-item label="主营类目" prop="category_list">
              <el-cascader
                v-if="newApplyDg"
                :options="cascaderOptions"
                :props="props"
                v-model="newApplyData.category_list"
              ></el-cascader>
              <!-- <el-select
                v-model="newApplyData.category_list"
                multiple
                value-key="id"
              >
                <el-option
                  v-for="item in categories"
                  :value="item"
                  :label="item.name"
                  :key="item.id"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="产品渠道">
              <el-radio-group v-model="newApplyData.import">
                <el-radio :label="true">进口</el-radio>
                <el-radio :label="false">非进口</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="认证方式">
              <el-radio-group v-model="newApplyData.auth_method">
                <el-radio label="shop_link">店铺链接</el-radio>
                <el-radio label="industry_qualification_images"
                  >资质图片</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="相关资质">
              <p>
                <el-tag
                  ><a
                    target="_blank"
                    style="color: #409EFF; text-decoration: none;"
                    href="http://ingtube.udesk.cn/hc/articles/153571?api_name="
                    >行业资质要求</a
                  ></el-tag
                >
              </p>
              <el-form-item
                v-show="
                  newApplyData.auth_method == 'industry_qualification_images'
                "
                prop="industry_qualification_images"
                :rules="{
                  required:
                    newApplyData.auth_method == 'industry_qualification_images',
                  message: '请上传店铺资质',
                  trigger: 'blur,change'
                }"
              >
                <upload-img-list
                  :length="10"
                  v-model="newApplyData.industry_qualification_images"
                ></upload-img-list>
              </el-form-item>
              <!-- 单独拎出来做校验 -->
              <el-form-item
                v-show="newApplyData.auth_method == 'shop_link'"
                prop="shop_link"
                :rules="{
                  required: newApplyData.auth_method == 'shop_link',
                  message: '请填写店铺链接',
                  trigger: 'blur,change'
                }"
              >
                <el-input v-model="newApplyData.shop_link"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌关系">
              <el-radio-group v-model="newApplyData.brand_auth_type">
                <el-radio label="brand_owner">品牌方</el-radio>
                <el-radio label="brand_unique_agent">独家代理</el-radio>
                <el-radio label="brand_normal_agent">普通代理</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注册号" prop="trademark_registration_id">
              <el-input
                v-model="newApplyData.trademark_registration_id"
                placeholder="请输入注册号"
              ></el-input>
            </el-form-item>
            <el-form-item label="注册书" prop="trademark_registration_images">
              <upload-img-list
                :length="10"
                v-model="newApplyData.trademark_registration_images"
              ></upload-img-list>
            </el-form-item>
            <el-form-item
              label="注册有效期"
              prop="trademark_registration_expired_date"
            >
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="newApplyData.trademark_registration_expired_date"
                type="date"
                placeholder="请选择注册到期日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              v-show="newApplyData.brand_auth_type != 'brand_owner'"
              label="授权书"
              prop="brand_auth_images"
              :rules="{
                required: newApplyData.brand_auth_type != 'brand_owner',
                message: '请上传授权书',
                trigger: 'blur,change'
              }"
            >
              <upload-img-list
                :length="10"
                v-model="newApplyData.brand_auth_images"
              ></upload-img-list>
            </el-form-item>
            <el-form-item
              v-show="newApplyData.brand_auth_type != 'brand_owner'"
              label="授权有效期"
              prop="brand_auth_expired_date"
              :rules="{
                required: newApplyData.brand_auth_type != 'brand_owner',
                message: '请填写授权有效期',
                trigger: 'blur,change'
              }"
            >
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="newApplyData.brand_auth_expired_date"
                type="date"
                placeholder="请选择授权到期日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="newApplyDg = false">取消</el-button>
        <el-button
          @click="newApplySubmit"
          type="primary"
          :disabled="brandAuthed"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增企业申请弹窗 -->
  </div>
</template>
<script>
import env from "../../api/env";
import moment from "moment";
import UploadImg from "../../components/UploadImg";
import UploadImgList from "../../components/UploadImgList";
import AdminSelect from "../../components/AdminSelect";
import BdSelect from "../../components/BdSelect";
export default {
  components: {
    UploadImg,
    UploadImgList,
    AdminSelect,
    BdSelect
  },
  data() {
    return {
      props: {
        multiple: true,
        lazy: true,
        lazyLoad: this.lazyLoad,
        label: "name",
        value: "id",
        leaf: "leaf"
      },
      cascaderOptions: [],
      env: env,
      time: false,
      activity_quota: null, // 免费活动次数
      registTime: [], // 入驻时间
      housekeeper_time: [], // 映兔管家时间
      brandAuthed: false, // 品牌已被认证
      registerValidDate: "", // 注册有效日期
      authValidDate: "", // 授权有效期
      newAuthData: {
        sponsor_account_type: "brand_owner",
        business_license_image: "",
        usci: "",
        sponsor_id: ""
      }, // 新增认证
      newApplyData: {}, // 新增品牌申请
      currBrand: {
        brand_id: "",
        brand_name: "",
        brand_logo: "",
        authed: true
      }, // 当前搜索的品牌
      applyDataTemp: {
        sponsor_id: "",
        brand_id: "",
        brand_auth_type: "brand_normal_agent",
        import: true,
        category_list: [],
        trademark_registration_id: "",
        trademark_registration_images: [],
        trademark_registration_expired_date: null,
        brand_auth_images: [],
        brand_auth_expired_date: null,
        auth_method: "shop_link",
        shop_link: "",
        industry_qualification_images: [],
        apply_time: "",
        operation_admin_id: "",
        brand_auth_status: ""
      },
      newAuthDg: false, // 新增认证dg
      newApplyDg: false, // 新增申请dg
      currSponsorId: "", // 当前商户id
      moment: moment, //
      isNewApply: true, // 是否新增
      search: {
        sponsor_level: "",
        page_id: 1,
        page_size: 10,
        status: 0, //审核状态
        company_name: "", //企业名称
        brand_name: "",
        phone: "",
        user_name: "",
        sponsor_id: "", // 商户id
        bd_admin_id: "0", // bd负责人
        housekeeper: 0, // 管家状态
        sort_type: 0, // 排序
        company_certification: "" // 企业认证状态
      },
      list: [],
      total: 0,
      sponsorDialog: false, //商户申请信息弹框
      sponsor: {}, //商户申请表单
      sponsorTemplate: {
        //空数据模板
        status: 0,
        email: "", //注册邮箱
        phone: "", //电话
        company_name: "", //企业名称
        brand_name: "", //品牌名称
        business_licene: "", //营业执照
        express_type: 1, //发货类型
        // category: "", // 营业类目
        user_name: "", //联系人姓名
        wechat: "", //微信号
        shop_link: "", //店铺地址
        brand_info: [], //品牌信息 ["url","url"],
        credential: [], //资质证明 ["url","url"]
        operation_admin_id: "", // 运营负责人
        bd_admin_id: "", // bd负责人
        source: "", // 商户来源
        user_id: "", // 账户id  没有商户id不传 该字段
        register_time: 0, // 申请时间
        enter_time: 0, // 入驻时间
        invitation: "" // 邀请人
      },
      newApplyRules: {
        trademark_registration_expired_date: [
          {
            required: true,
            message: "请填写注册有效期",
            trigger: "blur,change"
          }
        ],
        trademark_registration_images: [
          {
            required: true,
            message: "请上传注册书",
            trigger: "blur,change"
          }
        ],
        trademark_registration_id: [
          {
            required: true,
            message: "请填写注册号",
            trigger: "blur,change"
          }
        ],
        category_list: [
          {
            required: true,
            message: "请填写主营类目",
            trigger: "blur"
          }
        ],
        brand_name: [
          {
            required: true,
            message: "请填写品牌名",
            trigger: "blur, change"
          }
        ]
      },
      newAuthRules: {
        business_license_image: [
          {
            required: true,
            message: "选择资质证明",
            trigger: "blur"
          }
        ],
        usci: [
          {
            required: true,
            message: "请填写信用代码",
            trigger: "blur"
          }
        ]
      },
      rules: {
        email: [
          {
            required: true,
            message: "请输入注册邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        company_name: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "blur"
          }
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        // category: [{ required: true, message: "请选择营业类目" }],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },
      passDialog: false,
      sourceTemplate: [
        "BD",
        "老客推荐",
        "博主推荐",
        "官网自主",
        "邮件",
        "微信",
        "微博推广",
        "线下活动"
      ],
      remarkDialog: false, // 备注弹窗
      remark: "", // 商户备注
      remarkList: [], // 备注列表
      isNewRemark: false, // 新增备注填写框展示
      categories: [], // 二级类目表
      dateTime: {}, // 认证通过时间
      showFreezBtn: true // 展示冻结按钮
    };
  },
  computed: {
    // 权限 id list
    authList() {
      return this.$store.getters.getAuthList;
    },
    // 公司内部所有人员
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    // date选项
    pickerOptions() {
      return {
        disabledDate(time) {
          return (
            time.getTime() + 1000 * 3600 * 24 <
            Date.now() + 91 * 24 * 60 * 60 * 1000
          );
        }
      };
    }
  },
  created() {
    this.queryList();
    // this.initCategories();
  },
  watch: {
    registTime(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.passport_register_start_time = 0;
        this.search.passport_register_end_time = 0;
      } else {
        this.search.passport_register_start_time = moment(val[0]).unix();
        this.search.passport_register_end_time = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    },
    housekeeper_time(val) {
      this.sponsor["housekeeper_start_time"] = moment(val[0]).unix();
      this.sponsor["housekeeper_end_time"] = moment(val[1]).unix();
    },
    dateTime(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.company_verify_start_time = 0;
        this.search.company_verify_end_time = 0;
      } else {
        this.search.company_verify_start_time = moment(val[0]).unix();
        this.search.company_verify_end_time = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    }
  },
  methods: {
    async lazyLoad(node, resolve) {
      const { level } = node;
      if (level <= 1) {
        let req = {
          parent_id: level == 0 ? 0 : node.data.id
        };
        let res = await this.$api.getBrandAuthCategory(req);
        if (res.error_code == 0 && res.data) {
          var nodes = res.data.map(item => ({
            ...item,
            leaf: node.level >= 1 ? true : false
          }));
        }
        if (node.children && node.children.length > 0) {
          resolve([]);
        } else {
          resolve(nodes);
        }
        if (node.level == 0 && this.detailDg) {
          this.cascaderOptions = nodes;
          this.initCascaderOptions(this.cascaderOptions);
        }
      } else {
        return resolve([]);
      }
    },
    initCascaderOptions(cascaderOptions) {
      this.newApplyData.category_list.forEach(item => {
        this.initNode(item, cascaderOptions);
      });
    },
    async initNode(node, list) {
      let curOptions = list;
      for (let i = 0; i < node.length; i++) {
        let parent_id = node[i];
        let curNode = curOptions.find(item => {
          return item.id == parent_id;
        });
        if (curNode) {
          let req = {
            parent_id: parent_id
          };
          let res = await this.$api.getBrandAuthCategory(req);

          if (res.error_code == 0 && Array.isArray(res.data)) {
            let list = res.data || [];
            const nodes = list.map(item => ({
              ...item,
              leaf: node.level >= 1 ? false : true
            }));
            this.$set(curNode, "children", nodes);
            curOptions = curNode.children;
            // this.initCascaderOptions(curNode.children);
          }
        }
      }
    },
    // 删除bd负责人
    resetBdAdmin() {
      if (this.sponsor.bd_admin_id) {
        delete this.sponsor.bd_admin_id;
        this.$forceUpdate();
      }
    },
    async handleSelect(val) {
      this.brandAuthed = val.authed;
      this.newApplyData.brand_id = val.brand_id;
      this.newApplyData.brand_level = val.brand_level;
      this.newApplyData.brand_logo = val.brand_logo;
      this.newApplyData.brand_name = val.brand_name;
      this.newApplyData.brand_story = val.brand_story;
      this.$forceUpdate();
    },
    async newApplySubmit() {
      this.$refs.newApplyForm.validate(async ok => {
        if (ok) {
          let req = this.$initReq(this.newApplyData);
          let res = await this.$api.newBrandAuth(req);
          if (res.error_code == 0) {
            this.$message.success("提交成功");
            this.newApplyDg = false;
          } else {
            this.$message.error(res.error_description);
          }
        }
      });
    },
    async initCategories() {
      let res = await this.$api.categoryList({});
      if (res.error_code == 0) {
        let list = res.data.categories || [];
        let inList = []; // 二级类目表
        for (let i = 0; i < list.length; i++) {
          inList = list[i].level_two_category || [];
          for (let j = 0; j < inList.length; j++) {
            this.categories.push({
              id: inList[j].category_id,
              name: inList[j].category_name
            });
          }
        }
      }
    },
    async searchBrand(string, cb) {
      if (!string) {
        cb([]);
        return false;
      }
      let req = this.$initReq({
        sponsor_id: this.newApplyData.sponsor_id,
        brand_name: string
      });
      let res = await this.$api.brandAuthSearch(req);
      if (res.error_code == 0) {
        let brandList = res.data.brands || [];
        for (let i = 0; i < brandList.length; i++) {
          brandList[i]["value"] = brandList[i].brand_name;
        }
        cb(brandList);
      } else {
        cb([]);
      }
    },
    newApplyClick(id) {
      this.brandAuthed = false;
      this.newApplyData = JSON.parse(JSON.stringify(this.applyDataTemp)); // 初始化
      this.newApplyData["sponsor_id"] = id;
      if (this.$refs.newApplyForm) {
        this.$refs.newApplyForm.clearValidate();
      }
      this.newApplyDg = true;
    },
    // 提交新增认证
    async newAuthSubmit() {
      this.$refs.newAuthForm.validate(async ok => {
        if (ok) {
          let req = this.$initReq(this.newAuthData);
          let res = await this.$api.createCompanyAuth(req);
          if (res.error_code == 0) {
            this.newAuthDg = false;
            this.$message.success("新增成功");
            this.queryList();
          } else {
            this.$message.error(res.error_description);
          }
        }
      });
    },
    newAuthClick(id) {
      if (this.$refs.newAuthForm) {
        this.$refs.newAuthForm.clearValidate();
      }
      this.newAuthData = {
        sponsor_account_type: "brand_owner",
        business_license_image: "",
        usci: "",
        sponsor_id: id
      };
      this.newAuthDg = true;
    },
    async showRemark(sponsor_id) {
      this.remark = "";
      this.remarkList = [];
      this.currSponsorId = sponsor_id;
      // 获取商户备注
      let res = await this.$api.getSponsorRemark({
        sponsor_id: sponsor_id
      });
      if (res.error_code == 0) {
        this.remarkList = res.data.list || [];
        this.remarkDialog = true;
      } else {
        this.$message.error(res.error_description);
      }
    },
    // 对商户添加备注
    async addSponsorRemark() {
      let res = await this.$api.addSponsorRemark({
        sponsor_id: this.currSponsorId,
        content: this.remark
      });
      if (res.error_code == 0) {
        this.$message.success("备注成功");
        this.showRemark(this.currSponsorId);
      }
    },
    //点击查询按钮
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    },
    async queryList() {
      let req = this.$initReq(this.search);
      let res = await this.$api.sponsorSearch(req);
      if (res.error_code == 0) {
        this.list = res.data.sponsor_user || [];
        this.total = res.data.total || 0;
      } else {
        this.list = [];
      }
    },
    //editBtnClick 查看
    editBtnClick(item) {
      // 新增申请
      if (!item) {
        this.isNewApply = true;
        this.sponsor = {
          ...JSON.parse(JSON.stringify(this.sponsorTemplate))
        };
        this.sponsorDialog = true;
        //防止dom为渲染完成获取   sponsorForm 失败
        this.$nextTick(() => {
          this.$refs.sponsorForm.clearValidate();
        });
      } else {
        this.isNewApply = false;
        this.sponsor = { ...item };
        if (
          this.sponsor.housekeeper_start_time <= 1 ||
          this.sponsor.housekeeper_end_time <= 1
        ) {
          this.housekeeper_time = [];
        } else {
          this.housekeeper_time = [
            new Date(this.sponsor.housekeeper_start_time * 1000),
            new Date(this.sponsor.housekeeper_end_time * 1000)
          ];
        }
        this.isNewApply = false;
        this.sponsorDialog = true;
        //防止dom为渲染完成获取 sponsorForm 失败
        this.$nextTick(() => {
          this.$refs.sponsorForm.clearValidate();
        });
      }
    },
    //submitSponsor 确认提交
    submitSponsor() {
      this.$refs.sponsorForm.validate(async ok => {
        if (ok) {
          //提交申请
          let method = "postCompanyInfo";
          if (this.sponsor.user_id) {
            method = "sponsorModify";
          }
          let res = await this.$api[method](this.sponsor);
          if (res.error_code == 0) {
            this.$message.success("保存成功");
            //如果是新增  返回第一页
            if (method == "postCompanyInfo") {
              this.search.page_id = 1;
            }
            this.queryList();
            this.sponsorDialog = false;
          } else {
            this.$message.error("操作失败" + res.error_description);
          }
        } else {
          return false;
        }
      });
    },
    // passBtnClick 通过
    passBtnClick(id) {
      this.passForm = { ...this.passFormTemplate };
      this.passForm.sponsor_id = id;
      this.passDialog = true;
    },
    //冻结账户
    frozenBtnClick(item) {
      let sponsor = { ...item };
      sponsor.status = 2;
      this.updateStatus(sponsor);
    },
    //解冻账户
    unfrozenBtnClick(item) {
      let sponsor = { ...item };
      sponsor.status = 1;
      this.updateStatus(sponsor);
    },
    //修改状态
    updateStatus(item) {
      let message = item.status == 2 ? "确定冻结账户吗？" : "确定解冻账户吗？";
      this.$confirm(message, "操作提示")
        .then(async () => {
          let res = await this.$api.sponsorModify(item);
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.queryList();
          } else {
            this.$message.error(res.error_description);
          }
        })
        .catch(() => {
          return false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.remark-list {
  overflow-y: scroll;
  max-height: 300px;
  .remark-item {
    border-bottom: 1px solid #dedede;
    padding: 10px 0;
    .remark-content {
      letter-spacing: 1px;
    }
    .remark-title {
      font-weight: bold;
    }
  }
}

.new-remark {
  padding-top: 10px;
}
</style>

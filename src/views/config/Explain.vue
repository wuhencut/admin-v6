<template>
  <div class="config-explain">
    <div class="title">配置说明</div>
    <el-collapse :accordion="true">
      <el-collapse-item title="开屏页配置说明">
        <div class="item">
          <p>第一步：点击 联盟配置管理/配置中心/start-page.json的填写表单</p>
          <p>第二步：点击添加项</p>
          <p>第三步：点击选择文件选择开屏图片上传</p>
          <p>第四步：可以操作上移、下移、删除等操作</p>
          <p>第五步：点击保存 点击保存 点击保存【说三次非常重要】</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="App 私享 Banner 配置">
        <div class="item">
          <p>第一步：点击 联盟配置管理/配置中心/top-banner.json的填写表单</p>
          <p>第二步：点击添加项</p>
          <p>
            第三步：点击选择文件选择banner图片上传(小图、大图)/banner标题(随便填)/banner描述(随便填)/banner点击跳转链接【认真填】
          </p>
          <p>第四步：banner点击跳转链接说明:</p>
          <p>
            <b> h5链接：http://ingtube.com?titleAnim=1</b> 参数:titleAnim=1
            表示app内title显示动画方式
          </p>
          <p><b> App内页：yt://push.exclusive.co + 参数；</b></p>
          <p>
            <b>
              活动详情：如:yt://push.exclusive.co?page=GoodsDetail&campaignId=1040</b
            >
            参数campaignId 表示活动id
          </p>
          <p>
            <b>
              商品详情：如:yt://push.exclusive.co?page=StarProductionDetail&productionID=1040</b
            >
            参数productionID 表示活动id
          </p>
          <p>第五步：可以操作上移、下移、删除等操作</p>
          <p>第六步：点击保存 点击保存 点击保存[说三次非常重要]</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="常见问题配置">
        <div class="item">
          <p>第一步：点击 联盟配置管理/配置中心/question.json的填写表单</p>
          <p>第二步：点击添加项</p>
          <p>第三步：输入表单内容</p>
          <p>第四步：可以操作上移、下移、删除等操作</p>
          <p>第五步：点击保存 点击保存 点击保存【说三次非常重要】</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="名词解释配置">
        <div class="item">
          <p>第一步：点击 联盟配置管理/配置中心/noun.json的填写表单</p>
          <p>第二步：点击添加项</p>
          <p>第三步：输入表单内容</p>
          <p>第四步：可以操作上移、下移、删除等操作</p>
          <p>第五步：点击保存 点击保存 点击保存【说三次非常重要】</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="活动指引配置">
        <div class="item">
          <p>第一步：点击 联盟配置管理/配置中心/guid1.json 的填写表单</p>
          <p>第二步：输入表单内容、支持图文编辑简单排版</p>
          <p>第三步：点击 保存后</p>
          <p>第四步：点击 联盟配置管理/配置中心/guid-list.json 的填写表单</p>
          <p>
            第五步：输入表单内容，其中[指引标题]为联盟后台/帮助中心、[对应配置地址]为第一步的名称
            guid1.json
          </p>
          <p>第六步：点击保存 点击保存 点击保存【说三次非常重要】</p>
          <p><b>如要增加新的活动指引，请联系前端开发人员</b></p>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="less" scoped>
.config-explain {
  background: #fff;
  padding: 30px;
  > .title {
    font-weight: bold;
    padding-bottom: 20px;
  }
  .item {
    p {
      margin-bottom: 16px;
    }
  }
}
</style>

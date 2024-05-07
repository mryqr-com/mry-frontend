<template>
  <footer :class="$style.wrapper">
    <div :class="$style.footerSectionContent">
      <div :class="$style.footerLinksContainer">
        <div :class="$style.footerLinksColumn">
          <div :class="$style.footerLinksColumnTitle">产品功能</div>
          <a :class="$style.footerTextLink" class="block marginBottom20"
             href="//docs.mryqr.com/page-controls/introduction/"
             target="_blank">
            表单引擎
          </a>
          <a :class="$style.footerTextLink" class="block marginBottom20"
             href="//docs.mryqr.com/collaboration/submission-approval/"
             target="_blank">
            审批流程
          </a>
          <a :class="$style.footerTextLink" class="block marginBottom20"
             href="//docs.mryqr.com/collaboration/assignments/"
             target="_blank">
            定期任务
          </a>

          <a :class="$style.footerTextLink" class="block marginBottom20"
             href="//docs.mryqr.com/console-app-operation/reporting/"
             target="_blank">
            统计报表
          </a>

          <a :class="$style.footerTextLink" class="block marginBottom20"
             href="//docs.mryqr.com/app-design/plate-template-setting/"
             target="_blank">
            码牌设计
          </a>
        </div>
        <div :class="$style.footerLinksColumn">
          <div :class="$style.footerLinksColumnTitle">资源中心</div>
          <a :class="$style.footerTextLink" class=" block marginBottom20"
             href="//docs.mryqr.com/"
             target="_blank">
            使用文档
          </a>
          <a :class="$style.footerTextLink" class=" block marginBottom20"
             href="/public/app-templates"
             target="_blank">
            应用模板
          </a>
          <a :class="$style.footerTextLink" class=" block marginBottom20"
             href="//docs.mryqr.com/terms/"
             target="_blank">
            用户协议
          </a>
          <a :class="$style.footerTextLink" class=" block marginBottom20"
             href="//docs.mryqr.com/privacy/"
             target="_blank">
            隐私条款
          </a>
          <a :class="$style.footerTextLink" class=" block marginBottom20"
             href="//docs.mryqr.com/rules/"
             target="_blank">
            使用规范
          </a>
        </div>
        <div :class="$style.footerLinksColumn">
          <div :class="$style.footerLinksColumnTitle">联系我们</div>
          <div :class="$style.footerContactContainer">
            <div>
              <img :class="$style.footerQrImage" alt="客服微信" src="/images/customer-service-151.png"/>
              <div :class="$style.footerQrText">客服微信</div>
            </div>
          </div>
        </div>
      </div>

      <div :class="$style.footerBottomLinksContainer">
        <a :class="$style.footerTextLink" class=" marginRight15" href="//www.mryqr.com">XXX信息技术有限公司</a>
        <a :class="$style.footerTextLink" class=" marginLeft15 marginRight15"
           href="https://beian.miit.gov.cn/"
           target="_blank">
          ICP备案号
        </a>

        <a :class="$style.footerTextLink"
           class=" marginLeft15"
           href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51015602000526"
           target="_blank">
          <img :class="$style.gongan" alt="公安备案" src="/gongan.png"/>
          公安备案号
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
.wrapper {
  background-color: rgb(34, 34, 34);
  padding-right: 24px;
  padding-left: 24px;
}

.footerSectionContent {
  width: 100%;
  max-width: 1200px;
  margin: auto;
}

.footerLinksContainer {
  display: flex;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 24px;
  border-bottom: 1px solid #5a5c5d;
}

.footerLinksColumn {
  margin-left: 100px;
  margin-right: 100px;
}

.footerLinksColumnTitle {
  color: whitesmoke;
  font-size: 20px;
  margin-bottom: 20px;
}

.footerBottomLinksContainer {
  padding: 24px 0;
  text-align: center;
}

.footerContactContainer {
  display: flex;
}

.footerQrImageContainer {
  margin-right: 100px;
}

.footerTextLink {
  color: #c0c1c2;
}

.footerTextLink:hover {
  color: $primaryThemeColor !important;
}

.footerTextLink:link, .footerTextLink:visited, .footerTextLink:active {
  color: #c0c1c2;
}

.footerQrImage {
  max-width: 130px;
}

.footerQrText {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #c0c1c2;
}

.gongan {
  width: 16px;
  vertical-align: bottom;
  margin-right: 3px;
}

</style>

<template>
  <div v-if="templateDetail" :class="$style.wrapper">
    <main :class="$style.mainContent">
      <Logo :class="$style.logo" size="small" @click="onLogoClick"></Logo>
      <router-link :class="$style.templateLib" :to="{name:'app-templates'}">
        <i class="el-icon-back"/>应用模板库
      </router-link>
      <div :class="$style.templateName">{{ templateDetail.name }}</div>

      <MarkdownViewer :markdown-style="markdownStyle"
                      :value="templateDetail.introduction">
      </MarkdownViewer>

      <div :class="$style.demoButtonContainer">
        <el-button :class="$style.mobileDemoButton"
                   type="primary"
                   @click="mobileOpenDemo">
          在线预览
        </el-button>

        <div :class="$style.demoButtonTip">如需使用该模板，请在电脑端完成操作</div>
      </div>

      <div :class="$style.featureContainer">
        <div :class="$style.featureTitle">该模板包含以下功能：</div>
        <table :class="$style.featureTable">
          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">所需最低套餐</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">{{ requiredPlan.name }}（表示使用该模板所需的最低套餐版本）</td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">所有页面</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">{{ templateDetail.pages.join("，") }}</td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">可提交页面</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.fillablePages.length === 0 ? '无' : templateDetail.fillablePages.join("，") }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">可审批页面</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.approvalPages.length === 0 ? '无' : templateDetail.approvalPages.join("，") }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">控件总数</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">{{ templateDetail.controlCount }}</td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">实例定位</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.geolocationEnabled ? '默认开启' : '默认关闭' }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">批量生码</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.plateBatchEnabled ? '默认开启' : '默认关闭' }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">任务管理</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">{{
                templateDetail.assignmentEnabled ? '默认开启' : '默认关闭'
              }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">自定义属性</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.attributes.length === 0 ? '无' : templateDetail.attributes.join("，") }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">运营菜单</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.operationMenus.length === 0 ? '无' : templateDetail.operationMenus.join("，") }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">数字报表</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.numberReports.length === 0 ? '无' : templateDetail.numberReports.join("，") }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">图形报表</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.chartReports.length === 0 ? '无' : templateDetail.chartReports.join("，") }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">状态看板</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.kanbans.length === 0 ? '无' : templateDetail.kanbans.join("，") }}
            </td>
          </tr>

          <tr>
            <td :class="[$style.featureTd,$style.featureNameTd]">流转状态</td>
            <td :class="[$style.featureTd,$style.featureValueTd]">
              {{ templateDetail.circulationStatuses.length === 0 ? '无' : templateDetail.circulationStatuses.join("，") }}
            </td>
          </tr>
        </table>
      </div>
    </main>
    <section :class="$style.sideBar">
      <div :class="$style.plateWrapper" :style="plateWrapperStyle">
        <Plate :class="$style.thePlate"
               :plateSetting="templateDetail.plateSetting"
               :qr="demoQr"
               :scale="scale">
        </Plate>
      </div>
      <div :class="$style.plateScanText">码牌预览（可扫码试用）</div>

      <el-button :class="$style.previewButton" plain size="medium" @click="openDemo">在线预览</el-button>

      <el-popconfirm title="即将拷贝该模板到您的账户下，确定继续？" @confirm="useTemplate">
        <el-button slot="reference"
                   :class="$style.useButton"
                   :disabled="shouldNotUse || apiInProgress"
                   size="medium"
                   type="primary">
          使用该模板
        </el-button>
      </el-popconfirm>

      <div v-if="shouldNotUse" :class="$style.warningText">{{ warningText }}
        <router-link v-if="isTenantAdmin" :class="$style.purchaseLink" :to="{name:'purchase-packages'}">
          购买套餐<i class="el-icon-right"></i>
        </router-link>
      </div>
    </section>

    <DrawerBrowser :show.sync="showDrawerBrowser"
                   :src="drawerQrSrc"
                   :title="drawerQrName"
                   wrapperClosableReferenceKey="demo-qr">
    </DrawerBrowser>
  </div>
</template>

<script>
import appTemplateApi from "@/common/api/app-template-api";
import {imageDisplayUrl} from "@/common/utils/image-utils";
import {mapGetters} from 'vuex';
import planTypes from "@/common/utils/plan-types";
import appApi from "@/common/api/app-api";
import Plate from '@/common/components/plate/Plate';
import DrawerBrowser from '@/common/components/DrawerBrowser';
import {goToMryOfficialWebsite, qrUrl} from "@/common/utils/common-utils";

export default {
  props: ['templateId'],

  components: {
    Plate,
    DrawerBrowser,
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
  },

  data() {
    return {
      templateDetail: null,
      apiInProgress: false,
      showDrawerBrowser: false,
      drawerQrSrc: null,
      drawerQrName: null,
    }
  },

  created() {
    return appTemplateApi.fetchAppTemplateDetail(this.templateId).then(response => {
      this.templateDetail = response.data;
      document.title = this.templateDetail.name + ' - 码如云应用模板库';
    });
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'isTenantAdmin',
      'currentEffectivePlanType',
      'currentPlanType',
      'isCurrentPlanExpired',
    ]),

    markdownStyle() {
      return {
        fontStyle: {
          fontFamily: "默认",
          fontSize: 15,
          bold: false,
          italic: false,
          color: '#606266',
        },
        lineHeight: 1.8
      };
    },

    scale() {
      let vScale = 1;
      let height = this.templateDetail.plateSetting.config.height;
      let width = this.templateDetail.plateSetting.config.width;
      if (height > width) {
        vScale = height > 300 ? 300 / height : 1;
      } else if (height === width) {
        vScale = 250 / height;
      }

      let hScale = 270 / width;//270为容器的固定宽度
      return Math.min(vScale, hScale);
    },

    plateWrapperStyle() {
      return {
        width: this.scale * this.templateDetail.plateSetting.config.width + 'px',
        height: this.scale * this.templateDetail.plateSetting.config.height + 'px',
      }
    },

    demoQr() {
      return {
        appName: this.templateDetail.demoQr.appName,
        tenantName: this.templateDetail.demoQr.tenantName,
        id: this.templateDetail.demoQr.id,
        name: this.templateDetail.demoQr.name,
        headerImageUrl: this.templateDetail.demoQr.headerImage ? imageDisplayUrl(this.templateDetail.demoQr.headerImage) : null,
        groupName: this.templateDetail.demoQr.groupName,
        customId: this.templateDetail.demoQr.customId,
        plateId: this.templateDetail.demoQr.plateId,
        url: qrUrl(this.templateDetail.demoQr.plateId),
        attributes: this.templateDetail.demoQr.attributeValues,
      }
    },

    shouldNotUse() {
      if (!this.isLoggedIn) {
        return false;
      }

      if (!this.isTenantAdmin) {
        return true;
      }

      return !this.planAllowed;
    },

    requiredPlan() {
      return planTypes[this.templateDetail.planType];
    },

    currentEffectivePlan() {
      return planTypes[this.currentEffectivePlanType];
    },

    planAllowed() {
      return this.currentEffectivePlan.level >= this.requiredPlan.level;
    },

    currentPlan() {
      return planTypes[this.currentPlanType];
    },

    warningText() {
      if (!this.isLoggedIn) {
        return;
      }

      if (!this.isTenantAdmin) {
        return '您不是系统管理员，如需使用该模板，请联系您的系统管理员进行操作。';
      }

      if (!this.planAllowed) {
        if (this.isCurrentPlanExpired) {
          return `您当前的套餐【${this.currentPlan.name}】已过期，无法使用该模板（最低要求为${this.requiredPlan.name}），请及时续费或升级。`;
        }

        return `您当前的套餐【${this.currentPlan.name}】版本过低，无法使用该模板（最低要求为【${this.requiredPlan.name}】），请及时升级。`;
      }
    },
  },

  methods: {
    imageDisplayUrl,

    onLogoClick() {
      goToMryOfficialWebsite();
    },

    useTemplate() {
      this.apiInProgress = true;
      return appApi.createAppFromTemplate(this.templateDetail.id).then(response => {
        let createAppResponse = response.data;
        this.$message({
          type: 'success',
          message: `成功从模板新建应用。`,
          center: true,
        });

        this.$router.push({
          name: 'app-edit-home',
          params: {appId: createAppResponse.appId}
        });
      }).finally(() => {
        this.apiInProgress = false;
      });
    },

    openDemo() {
      this.drawerQrSrc = qrUrl(this.templateDetail.demoQr.plateId);
      this.drawerQrName = this.templateDetail.demoQr.name;
      this.showDrawerBrowser = true;
    },

    mobileOpenDemo() {
      window.open(qrUrl(this.templateDetail.demoQr.plateId), '_blank');
    }
  }
}
</script>

<style lang="scss" module>
$contentWidth: 1050px;
$sideBarWidth: 300px;
$contentMarginTop: $consoleTopBarHeight + 10px;

.wrapper {
  margin-left: auto;
  margin-right: auto;
  width: $contentWidth;
  margin-top: $contentMarginTop;
}

.logo {
  display: none;
}

.mainContent {
  background-color: white;
  margin-right: $sideBarWidth;
  margin-bottom: 24px;
  padding: 24px;
}

.templateLib {
  color: $secondaryTextColor;
}

.templateLib:hover {
  color: $primaryThemeColor !important;
}

.templateLib:visited {
  color: $secondaryTextColor;
}

.templateName {
  margin-top: 24px;
  margin-bottom: 24px;
  font-size: 30px;
  font-weight: 500;
  color: $primaryTextColor;
}

.featureContainer {
  margin-top: 30px;
  margin-bottom: 24px;
}

.featureTitle {
  font-size: 16px;
  font-weight: 500;
  color: $primaryTextColor;
  margin-bottom: 8px;
}

.featureTable {
  border-collapse: collapse;
  width: 100%;
}

.featureTd {
  vertical-align: middle;
  border: $primary1pxBorder;
  font-size: 15px;
  color: #444444;
}

.featureNameTd {
  white-space: nowrap;
  padding: 7px 15px 7px 10px;
  line-height: 1.4em;
  color: $secondaryTextColor;
}

.featureValueTd {
  word-break: break-all;
  padding: 7px 15px 7px 10px;
  width: 99%;
  line-height: 1.4em;
}

.demoButtonContainer {
  display: none;
}

.mobileDemoButton {
  margin-top: 50px;
  margin-bottom: 15px;
}

.demoButtonTip {
  margin-bottom: 50px;
  text-align: center;
  font-size: 15px;
}

.sideBar {
  background-color: #ebecee;
  position: fixed;
  width: $sideBarWidth;
  top: $contentMarginTop;
  right: calc((100vw - #{$contentWidth}) / 2 - 10px);
  padding: 24px 15px;
  box-shadow: $lightShadow;
}

.plateWrapper {
  margin: auto;
}

.thePlate {
  transform-origin: left top !important;
  box-shadow: $imageShadow;
  overflow: hidden;
}

.plateScanText {
  text-align: center;
  margin-top: 16px;
}

.previewButton {
  margin-top: 36px;
  width: 100%;
}

.useButton {
  margin-top: 18px;
  width: 100%;
  margin-bottom: 15px;
}

.warningText {
  margin-top: 10px;
  color: $warningYellow;
  font-size: 13px;
  line-height: 1.6em;
}

.purchaseLink {
  color: $primaryThemeColor;
  text-decoration: underline;
}

.purchaseLink:visited {
  color: $primaryThemeColor;
}

@media (max-width: $pcScreenBreakpoint) {
  .wrapper {
    width: 100%;
    margin-top: $consoleTopBarHeight;
  }

  .mainContent {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .demoButtonContainer {
    display: block;
  }

  .mobileDemoButton {
    display: block;
    width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .sideBar {
    display: none;
  }
}

@media (max-width: $mobileScreenBreakpoint) {
  .wrapper {
    width: 100%;
    margin-top: 0;
  }

  .logo {
    display: flex;
    margin-bottom: 20px;
  }

  .mainContent {
    margin-right: 0;
    margin-bottom: 0;
    padding: 15px;
  }

  .demoButtonContainer {
    display: block;
  }

  .mobileDemoButton {
    width: 100%;
  }

  .sideBar {
    display: none;
  }
}
</style>

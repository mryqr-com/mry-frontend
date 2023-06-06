<template>
  <LeftNavedPageWrapper v-if="loaded">
    <template v-slot:menu="{fold}">
      <ul>
        <li v-show="!fold">
          <div :class="$style.pageHeader">
            <div :class="$style.pageHeaderTitle">
              <span :class="$style.firstLevelIcon"><icon icon="folder"/></span>
              页面列表
            </div>
            <button :class="[$style.addButton,{[$style.addButtonDisabled]:isPageFull}]"
                    :disabled="isPageFull"
                    :title="isPageFull?'当前应用的页面数量已经达到最大数量(20页)，无法及新建页面':'新建页面，一个应用最多可创建20个页面'"
                    @click="openCreatePageDialog">
              <i class="el-icon-plus">新建页面</i>
            </button>
          </div>

          <draggable v-model="pages"
                     :class="$style.dragArea"
                     animation="200"
                     tag="div">
            <div v-for="aPage in pages"
                 :key="aPage.id"
                 :class="$style.pageLi">
              <router-link :class="$style.pageLink"
                           :title="pageNameTitle(aPage)"
                           :to="{ name: 'app-edit-page', params: { appId: appId, pageId: aPage.id }}"
                           tag="span">
                <span :class="$style.pageIcon"><icon :icon="pageIcon(aPage)"/></span>
                <span :class="$style.pageName">{{ pageName(aPage) }}</span>
              </router-link>
            </div>
          </draggable>
        </li>

        <li v-show="fold" :class="$style.foldedPageTitle" title="页面列表">
          <el-popover :popper-class="$style.foldedPagePopOver"
                      placement="right"
                      trigger="hover"
                      width="200">
            <div slot="reference" :class="$style.popoverReference">
              <icon icon="folder"/>
            </div>
            <ul>
              <li v-for="aPage in pages"
                  :key="aPage.id"
                  :class="$style.foldedPageLi">
                <router-link :class="$style.foldedPageLink"
                             :title="pageNameTitle(aPage)"
                             :to="{ name: 'app-edit-page', params: { appId: appId, pageId: aPage.id }}"
                             tag="div">
                  <span :class="$style.pageIcon"><icon :icon="pageIcon(aPage)"/></span>
                  <span :class="$style.pageName">{{ pageName(aPage) }}</span>
                </router-link>
              </li>
            </ul>
          </el-popover>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="[$style.menuLink,{[$style.foldedMenuLink]:fold}]"
                       :title="fold?'自定义属性':`自定义${instanceDesignation}属性，属性值可以直接显示在${instanceDesignation}列表中，并可根据属性值进行过滤或排序；另外，属性表格和属性表盘控件可以引用属性并对属性值进行展示`"
                       :to="{ name: 'app-edit-attributes', params: { appId: appId }}"
                       tag="div">
            <span :class="[$style.firstLevelIcon,{[$style.foldedFirstLevelIcon]:fold}]"><icon icon="tag"/></span>
            <span v-if="!fold">自定义属性</span>
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="[$style.menuLink,{[$style.foldedMenuLink]:fold}]"
                       :title="fold?'运营菜单':`自定义运营菜单，菜单项将显示在后台运营页面的左侧菜单栏，以及手机端${instanceDesignation}首页的右上角菜单中`"
                       :to="{ name: 'app-edit-operation-menus', params: { appId: appId }}"
                       tag="div">
            <span :class="[$style.firstLevelIcon,{[$style.foldedFirstLevelIcon]:fold}]"><icon icon="bars"/></span>
            <span v-if="!fold">运营菜单</span>
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="[$style.menuLink,{[$style.foldedMenuLink]:fold}]"
                       :title="fold?'码牌设置':'设置码牌内容，系统内置了大量码牌模板可以直接引用'"
                       :to="{ name: 'app-edit-plates', params: { appId: appId }}"
                       tag="div">
            <span :class="[$style.firstLevelIcon,{[$style.foldedFirstLevelIcon]:fold}]"><icon icon="qrcode"/></span>
            <span v-if="!fold">码牌设置</span>
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="[$style.menuLink,{[$style.foldedMenuLink]:fold}]"
                       :title="fold?'状态流转':'设置提交表单后的各种状态的流转'"
                       :to="{ name: 'app-edit-circulation-settings', params: { appId: appId }}"
                       tag="div">
            <span :class="[$style.firstLevelIcon,{[$style.foldedFirstLevelIcon]:fold}]"><icon icon="retweet"/></span>
            <span v-if="!fold">状态流转</span>
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="[$style.menuLink,{[$style.foldedMenuLink]:fold}]"
                       :title="fold?'应用设置':'针对整个应用的设置'"
                       :to="{ name: 'app-edit-config', params: { appId: appId }}"
                       tag="div">
            <span :class="[$style.firstLevelIcon,{[$style.foldedFirstLevelIcon]:fold}]"><icon icon="cog"/></span>
            <span v-if="!fold">应用设置</span>
          </router-link>
        </li>
      </ul>
    </template>

    <div :class="$style.workingArea">
      <div :class="$style.editHeader">
        <div :class="$style.editHeaderLeft">
          <span>{{ appName }} / {{ subtitle }}</span>
        </div>

        <div :class="$style.editHeaderRight">
          <MryCustomerServiceEntry :class="$style.rightSectionIcon"
                                   :iconSize="16"
                                   :textSize="12"
                                   color="#909399">
          </MryCustomerServiceEntry>

          <MryDocumentationEntry :class="$style.rightSectionIcon"
                                 :iconSize="16"
                                 :textSize="12"
                                 color="#909399">
          </MryDocumentationEntry>

          <MryMobileEntry :class="$style.rightSectionIcon"
                          :iconSize="16"
                          :textSize="12">
          </MryMobileEntry>

          <el-button :class="$style.appOpsButton"
                     icon="el-icon-s-platform"
                     plain
                     size="medium"
                     title="应用运营页"
                     @click="gotoOperationPage">
            应用运营页
          </el-button>

          <!--          <el-button :class="$style.topButton"-->
          <!--                     plain-->
          <!--                     size="medium"-->
          <!--                     icon="el-icon-menu"-->
          <!--                     title="返回应用管理列表"-->
          <!--                     @click="exit">-->
          <!--            应用管理列表-->
          <!--          </el-button>-->

          <el-button :class="$style.topButton"
                     icon="el-icon-upload2"
                     size="medium"
                     title="保存应用"
                     type="primary"
                     @click="save">
            保存
          </el-button>

        </div>
      </div>

      <div :class="$style.editSection">
        <router-view :key="$route.path"></router-view>
      </div>
    </div>

    <CreatePageDialog :show.sync="showCreatePageDialog"></CreatePageDialog>
    <IdentificationDialog v-if="!isMobileIdentified" :show.sync="identificationDialogVisible"></IdentificationDialog>
  </LeftNavedPageWrapper>
</template>

<script>
import LeftNavedPageWrapper from '@/console/common/LeftNavedPageWrapper';
import CreatePageDialog from '@/console/app-edit/CreatePageDialog';
import draggable from 'vuedraggable';
import {createNamespacedHelpers, mapGetters} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {handleApiError} from '@/console/console-api-error-handler';
import eventBus from "@/common/utils/event-bus";
import {errorOfApi, isApiErrorResponse, pageName} from '@/common/utils/common-utils';
import IdentificationDialog from '@/console/common/IdentificationDialog';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['appId'],

  components: {
    LeftNavedPageWrapper,
    CreatePageDialog,
    draggable,
    IdentificationDialog,
  },

  data() {
    return {
      showCreatePageDialog: false,
      identificationDialogVisible: true,
    };
  },

  beforeRouteLeave(to, from, next) {
    if (this.saved || to.name === 'login') {
      next();
      return;
    }

    this.$confirm('应用尚未保存，确认离开？', '提示', {
      confirmButtonText: '是的，离开',
      cancelButtonText: '留在本页',
      type: 'warning'
    }).then(() => {
      next();
    }).catch(() => {
      next(false);
    });
  },

  created() {
    eventBus.$emit('lefeMenuFoldChanged', 'NONE');

    return this[ACTIONS.FETCH_UPDATABLE_APP](this.appId).then(() => {
      document.title = `${this.appName} - ${this.tenantName}`;
      window.addEventListener('keydown', this.onControlS, false);
      this.$watch('app.setting', function () {
            this[ACTIONS.MARK_UN_SAVE]();
            window.addEventListener('beforeunload', this.callToSaveHandler);
          },
          {
            deep: true,
          });
    });
  },

  computed: {
    ...appEditStore.mapGetters([
      'isHomePage',
      'allPages',
      'appName',
      'isPageFull',
      'currentPageName',
      'instanceDesignation',
    ]),

    ...mapGetters([
      'tenantName',
      'currentPlanName',
      'isCurrentPlanExpired',
      'isMobileIdentified',
    ]),

    ...appEditStore.mapState([
      'loaded',
      'saved',
      'app',
    ]),

    subtitle() {
      if (this.$route.meta.name) {
        return this.$route.meta.name;
      }
      return this.currentPageName;
    },

    pages: {
      get() {
        return this.allPages;
      },
      set(pages) {
        this[ACTIONS.UPDATE_PAGES](pages);
      }
    }
  },

  methods: {
    pageName,
    ...appEditStore.mapActions([
      ACTIONS.UPDATE_PAGES,
      ACTIONS.FETCH_UPDATABLE_APP,
      ACTIONS.SAVE,
      ACTIONS.MARK_UN_SAVE
    ]),

    openCreatePageDialog() {
      this.showCreatePageDialog = true
    },

    pageIcon(page) {
      if (this.isHomePage(page)) {
        return 'home';
      }
      return 'sticky-note';
    },

    pageNameTitle(page) {
      if (this.isHomePage(page)) {
        return `【首页】${this.pageName(page)}`;
      }

      return this.pageName(page);
    },

    callToSaveHandler(event) {
      event.preventDefault();
      event.returnValue = '';
    },

    onControlS(e) {
      if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
        e.preventDefault();
        this.save().catch(ex => {
          if (isApiErrorResponse(ex)) {
            handleApiError(errorOfApi(ex), null);
          } else {
            console.error(ex);
          }
        });
      }
    },

    cancelControlS() {
      window.removeEventListener('keydown', this.onControlS);
    },

    cancelCallToSave() {
      window.removeEventListener('beforeunload', this.callToSaveHandler);
    },

    save() {
      if (this.saved) {
        this.$message({
          type: 'info',
          message: '应用已保存，无需重复保存。',
          center: true
        });
        return;
      }

      return this[ACTIONS.SAVE]().then(() => {
        this.cancelCallToSave();
        this.$message({
          type: 'success',
          message: '应用保存成功。',
          center: true
        });
      });
    },

    gotoOperationPage() {
      this.$router.push({name: 'qr-list', params: {appId: this.appId}}).catch(() => {
      });
    },

    exit() {
      this.$router.push({name: 'app-list'}).catch(() => {
      });
    }
  },

  beforeDestroy() {
    this.cancelCallToSave();
    this.cancelControlS();
  }

}
</script>


<style lang="scss" module>
$top-item-padding-left: 30px;
$page-item-padding-left: 45px;
$page-item-padding-right: 10px;

.pageHeader {
  height: 50px;
  color: $leftBarTextColor;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: $top-item-padding-left;
  padding-right: $page-item-padding-right;
  font-size: 15px;
}

.pageHeaderTitle {
  cursor: default;
  display: flex;
  align-items: center;
}

.firstLevelIcon {
  width: 30px;
}

.foldedFirstLevelIcon {
  width: auto;
}

.addButton {
  background-color: transparent;
  border: 1px solid $leftBarTextColor;
  outline: none;
  color: $leftBarTextColor;
  font-size: 13px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 6px;
}

.addButton:hover {
  border-color: $primaryThemeColor;
  color: $primaryThemeColor;
}

.addButtonDisabled {
  border: 1px solid $secondaryTextColor;
  color: $secondaryTextColor;
}

.addButtonDisabled:hover {
  cursor: not-allowed;
  border: 1px solid $secondaryTextColor;
  color: $secondaryTextColor;
}

.dragArea {
  max-height: 50vh;
  overflow-y: auto;
}

.pageLi:hover, .menuLi:hover, .foldedPageTitle:hover, .foldedPageLi:hover {
  background-color: $leftBarBackgroundColor;
}

.pageLi, .foldedPageLi, .menuLi {
  :global {
    .router-link-active {
      color: white;
      background-color: $primaryThemeColor;
    }
  }
}

.pageLink {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: $leftBarTextColor;
  padding: 12px $page-item-padding-right 12px $page-item-padding-left;
  font-size: 14px;
}

.pageIcon {
  width: 20px;
  flex-shrink: 0;
}

.pageName {
  line-height: 1.2em;
}

.foldedPageTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: $leftBarTextColor;
  font-size: 15px;
}

.popoverReference {
  padding-top: 18px;
  padding-bottom: 18px;
  width: 50px;
  display: flex;
  justify-content: center;
}

.foldedPagePopOver {
  border: none;
  border-radius: 0;
  padding: 0;
  background-color: #24282c;
  margin-left: 0 !important;
  box-shadow: none;

  :global {
    .popper__arrow {
      display: none;
    }
  }
}

.foldedPageLi {
  color: $leftBarTextColor;
}

.foldedPageLink {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 12px;
  font-size: 14px;
}

.menuLink {
  display: flex;
  align-items: center;
  color: $leftBarTextColor;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: $top-item-padding-left;
  font-size: 15px;
  cursor: pointer;
}

.foldedMenuLink {
  justify-content: center;
  padding-left: 0;
}

.workingArea {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

$headerHeight: 62px;

.editHeader {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  border-bottom: $primary1pxBorder;
  height: $headerHeight;
  background-color: $whiteBackgroundColor;
}

.editSection {
  height: calc(100% - #{$headerHeight});
}

.editHeaderLeft {
  font-size: 15px;
  font-weight: 500;
  flex-grow: 1;
}

.editHeaderRight {
  display: flex;
  align-items: center;
}

.rightSectionIcon {
  margin-right: 30px;
}

.appOpsButton {
  font-weight: normal;
  width: 120px;
  padding-left: 0;
  padding-right: 0;
}

.topButton {
  font-weight: normal;
  width: $pageButtonWidth;
}

</style>
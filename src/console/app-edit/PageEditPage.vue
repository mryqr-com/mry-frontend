<template>
  <div v-if="currentControlId" :class="$style.wrapper" tabindex="0">
    <ControlBox :class="$style.controlBox" @controlAdded="targetNewControl"></ControlBox>

    <div :class="$style.wholeViewport" :style="wholeViewportStyle">
      <ViewWrapper v-if="shouldShowTopBar"
                   ref="TOP_BAR"
                   :class="$style.topBarView"
                   controlId="TOP_BAR"
                   controlType="TOP_BAR">
        <AppTopBarView></AppTopBarView>
      </ViewWrapper>

      <div :class="$style.pageWrapper" @click.self="activatePageConfig">
        <div v-if="currentPage" :class="$style.pageArea" :style="pageStyle">
          <RoundButton v-if="shouldCurrentPageShowProfileButton" :class="$style.profileRoundButton">
            <img :class="$style.profileIcon" alt="profileIcon" :src="profileIconSrc"/>
          </RoundButton>
          <ViewWrapper v-if="shouldCurrentPageShowHeader"
                       ref="HEADER"
                       controlId="HEADER"
                       controlType="HEADER">
            <PageHeaderView></PageHeaderView>
          </ViewWrapper>

          <div :class="$style.contentArea" :style="contentStyle">
            <ViewWrapper v-if="shouldCurrentPageShowTitle"
                         ref="TITLE"
                         controlId="TITLE"
                         controlType="TITLE">
              <PageTitleView></PageTitleView>
            </ViewWrapper>

            <draggable v-model="controls"
                       :chosenClass="$style.chosenClass"
                       :dragClass="$style.dragClass"
                       :emptyInsertThreshold="500"
                       :forceFallback="true"
                       :ghostClass="$style.ghostClass"
                       :group="{ name: 'controls', pull: true, put: true}"
                       animation="200"
                       tag="ul"
                       @add="onDragAdded"
                       @end="isDragging = false"
                       @start="isDragging = true">
              <transition-group :enter-active-class="!isDragging ? $style.enterActive:null"
                                :enter-class="!isDragging ? $style.enterClass : null"
                                :leave-active-class="!isDragging ? $style.leaveActive:null"
                                :leave-to-class="!isDragging ? $style.leaveTo:null"
                                :move-class="!isDragging ? $style.flipListMove:null"
                                type="transition">
                <li v-for="(control,index) in controls" :key="control.id">
                  <ViewWrapper :ref="control.id"
                               :controlId="control.id"
                               controlType="CONTROL">
                    <ControlViewWrapper :control="control"
                                        :controlIndex="index"
                                        @controlCloned="scrollCurrentControlIntoView">
                    </ControlViewWrapper>
                  </ViewWrapper>
                </li>
              </transition-group>
            </draggable>

            <div v-if="controls.length === 0" :key="`placeholder`" :class="$style.placeholderText">
              <i class="el-icon-back">请从右侧工具箱中添加您所需的控件项</i>
            </div>

            <ViewWrapper ref="SUBMIT_BUTTON" controlId="SUBMIT_BUTTON" controlType="SUBMIT_BUTTON">
              <SubmitButtonView :submitButton="currentPage.submitButton"></SubmitButtonView>
            </ViewWrapper>
          </div>

          <ViewWrapper v-if="isCurrentHomePage && shouldCurrentPageShowMenu"
                       ref="MENU"
                       :class="$style.menuWrapper"
                       controlId="MENU"
                       controlType="MENU">
            <MenuView></MenuView>
          </ViewWrapper>
        </div>
      </div>

      <PageEditPreviewToolBox :class="$style.thePreviewBox"></PageEditPreviewToolBox>

      <PageEditScrollToolBox :class="$style.scrollToolBox"
                             @bottom="scrollToBottom"
                             @target="scrollCurrentControlIntoView"
                             @top="scrollToTop">
      </PageEditScrollToolBox>
    </div>

    <EditPanelWrapper :key="panelKey" :class="$style.editPanel"></EditPanelWrapper>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ControlBox from '@/console/app-edit/control-box/ControlBox';
import AppTopBarView from '@/console/app-edit/topbar/AppTopBarView';
import PageHeaderView from '@/console/app-edit/header/PageHeaderView';
import PageTitleView from '@/console/app-edit/title/PageTitleView';
import ViewWrapper from '@/console/app-edit/ViewWrapper';
import ControlViewWrapper from '@/console/app-edit/control/ControlViewWrapper';
import PageEditScrollToolBox from '@/console/app-edit/scroll/PageEditScrollToolBox'
import PageEditPreviewToolBox from '@/console/app-edit/preview/PageEditPreviewToolBox'
import SubmitButtonView from '@/console/app-edit/submit/SubmitButtonView'
import MenuView from '@/console/app-edit/menu/MenuView'
import EditPanelWrapper from '@/console/app-edit/panel/EditPanelWrapper'
import {imageDisplayUrl} from '@/common/utils/image-utils'

import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {createNamespacedHelpers, mapGetters} from 'vuex';
import {borderStyles, shadowStyles} from "@/common/utils/common-utils";
import profileIcon from "@/console/app-edit/icon/profileIcon.svg";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    draggable,
    ControlBox,
    AppTopBarView,
    PageHeaderView,
    PageTitleView,
    ViewWrapper,
    ControlViewWrapper,
    PageEditScrollToolBox,
    SubmitButtonView,
    MenuView,
    PageEditPreviewToolBox,
    EditPanelWrapper
  },

  data() {
    return {
      isDragging: false
    };
  },

  props: ['pageId'],


  mounted() {
    this.$el.addEventListener('keydown', this.onKeyDown);
  },

  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.onKeyDown);
  },

  computed: {
    ...mapGetters(['tenantName', 'tenantLogo']),
    ...appEditStore.mapState([
      'tabletView',
      'panelKey'
    ]),

    ...appEditStore.mapGetters([
      'currentControlId',
      'currentPage',
      'homePage',
      'appTopBar',
      'isCurrentHomePage',
      'currentPageViewPortBackgroundColor',
      'shouldCurrentPageShowTopBar',
      'shouldCurrentPageShowHeader',
      'shouldCurrentPageShowTitle',
      'shouldCurrentPageShowMenu',
      'currentPageMaxWidth',
      'currentPageContentMaxWidth',
      'currentPageBackgroundColor',
      'currentPageShadow',
      'currentPageBorder',
      'currentPageViewPortBackgroundImage',
      'shouldCurrentPageShowTopBottomBlank',
      'shouldCurrentPageShowProfileButton',
    ]),

    profileIconSrc() {
      return profileIcon;
    },

    controls: {
      get() {
        return this.currentPage.controls;
      },
      set(controls) {
        this[ACTIONS.DRAG_CONTROLS](controls);
      }
    },

    shouldShowTopBar() {
      return this.tabletView && this.shouldCurrentPageShowTopBar;
    },

    wholeViewportStyle() {
      if (this.currentPageViewPortBackgroundImage) {
        return {
          backgroundColor: 'transparent',
          backgroundImage: `url('${imageDisplayUrl(this.currentPageViewPortBackgroundImage)}')`
        }
      }
      if (this.currentPageViewPortBackgroundColor) {
        return {
          backgroundColor: this.currentPageViewPortBackgroundColor,
          backgroundImage: 'none'
        }
      }
    },

    currentPageMarginTop() {
      if (!this.tabletView) {
        return 0;
      }

      let marginTop = 0;
      if (this.shouldCurrentPageShowTopBottomBlank) {
        marginTop = marginTop + 36;
      }

      if (this.shouldCurrentPageShowTopBar) {
        marginTop = marginTop + this.appTopBar.height;
      }

      return marginTop;
    },

    currentPageMarginBottom() {
      if (!this.tabletView) {
        return 0;
      }

      if (this.shouldCurrentPageShowTopBottomBlank) {
        return 36;
      }

      return 0;
    },

    pageStyle() {
      let base = {
        backgroundColor: this.currentPageBackgroundColor,
        marginTop: this.currentPageMarginTop + 'px',
        marginBottom: this.currentPageMarginBottom + 'px',
      };

      let width = this.tabletView ? {
        maxWidth: this.currentPageMaxWidth + 'px'
      } : {
        maxWidth: '375px'
      };

      return {...base, ...width, ...borderStyles(this.currentPageBorder), ...shadowStyles(this.currentPageShadow)};
    },

    contentStyle() {
      return this.tabletView ? {
        maxWidth: this.currentPageContentMaxWidth + 'px'
      } : {
        maxWidth: '375px'
      };
    }

  },
  methods: {
    ...appEditStore.mapActions([
      ACTIONS.SET_CURRENT_PAGE,
      ACTIONS.DRAG_CONTROLS,
      ACTIONS.ACTIVATE_PAGE_CONFIG,
      ACTIONS.SET_CURRENT_CONTROL
    ]),

    onKeyDown(e) {
      if (e.keyCode === 27) {//esc
        this[ACTIONS.ACTIVATE_PAGE_CONFIG]();
      }
    },

    onDragAdded(control) {
      let listedControl = this.controls[control.newIndex];

      let payload = {
        currentEditType: 'CONTROL',
        currentControlId: listedControl ? listedControl.id : this.controls[0].id
      };
      this[ACTIONS.SET_CURRENT_CONTROL](payload);
    },

    targetNewControl() {
      this.$nextTick(() => {
        this.scrollCurrentControlIntoView();
      });
    },

    scrollCurrentControlIntoView(smooth = true) {
      if (!this.currentControlId || this.currentControlId === 'PAGE_SETTING') {
        return;
      }

      let currentComponent = this.$refs[this.currentControlId];

      if (currentComponent instanceof Array) {
        currentComponent = currentComponent[0];
      }
      this.scrollIntoView(currentComponent, smooth);
    },

    scrollIntoView(component, smooth = true) {

      component.$el.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'center',
        inline: 'center'
      });
    },
    scrollToBottom() {
      let component = this.$refs['SUBMIT_BUTTON'];
      this.scrollIntoView(component)
    },
    scrollToTop() {
      let component = this.$refs['HEADER'];
      this.scrollIntoView(component)
    },

    activatePageConfig() {
      this[ACTIONS.ACTIVATE_PAGE_CONFIG]();
    },

    setCurrentPage(pageId) {
      this[ACTIONS.SET_CURRENT_PAGE](pageId).then(() => {
        // this.scrollCurrentControlIntoView(true);
      }).catch((e) => {
        this.$router.replace({
          name: 'app-edit-home',
          params: {appId: this.$route.params.appId}
        });
      })
    }
  },

  created() {
    if (!this.pageId) {
      let pageId = this.homePage.id;
      this.$router.replace({
        name: "app-edit-page",
        params: {appId: this.$route.params.appId, pageId: pageId}
      });
      return;
    }
    this.setCurrentPage(this.pageId);
  },

}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  display: flex;
}

.controlBox {
  flex-shrink: 0;
}

.wholeViewport {
  flex-grow: 1;
  height: 100%;
  overflow-x: auto;
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(white, #b9e3ff); //整屏默认背景色
}

.editPanel {
  flex-shrink: 0;
  width: 300px;
  height: 100%;
  overflow-y: auto;
  background-color: white;
  border-left: 1px solid rgba(50, 50, 50, .14);
}

.topBarView {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 800;
}

.pageWrapper {
  height: 100%;
  overflow-y: auto;
}

.pageArea {
  margin-left: auto;
  margin-right: auto;
  transition: max-width 0.5s;
  position: relative;
}

.profileRoundButton {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 200;
}

.profileIcon {
  width: 15px;
}

.contentArea {
  margin-left: auto;
  margin-right: auto;
}

.chosenClass {
  cursor: grab !important;
}

.dragClass {
  cursor: grab !important;
}

.ghostClass {
  background-color: $lightBackgroundColor !important;
  width: 100%;
  margin-top: 0;
  margin-bottom: 0;
}

.enterClass, .leaveTo {
  opacity: 0;
  transform: translateY(30px);
}

.enterActive, .leaveActive {
  transition: width 0.5s;
}

.flipListMove {
  transition: transform 0.5s;
}

.menuWrapper {
  position: sticky;
  bottom: 0;
  z-index: 800;
}

.scrollToolBox {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.thePreviewBox {
  position: absolute;
  top: 100px;
  right: 24px;
  z-index: 1000;
}

.placeholderText {
  height: 100px;
  color: $warningYellow;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

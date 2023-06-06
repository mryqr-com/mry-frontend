<template>
  <div v-if="initialised" :class="$style.wrapper">
    <header :class="$style.headerBar">

      <div :class="$style.iconButtonContainer">
        <button :class="$style.headerButton"
                class="majoricon i-left plainButton"
                title="返回上级"
                @click="goToUpperLink">
        </button>
      </div>

      <section :class="$style.searchSection">
        <el-input :key="keepStateKey"
                  ref="searchBox"
                  v-model="theSearch"
                  :class="$style.searchInput"
                  :maxlength="50"
                  placeholder="搜索..."
                  size="small"
                  title="搜索"
                  @blur="onSearchBlurred"
                  @keyup.enter.native="onSearchEnter">
        </el-input>
      </section>

      <div v-if="isAppGeolocationEnabled" :class="$style.iconButtonContainer">
        <button :class="[$style.headerButton,{[$style.nearestPointEnabled]:nearestPointEnabled}]"
                class="majoricon i-location plainButton"
                title="离我最近的排在最前面"
                @click="toggleGeolocationEnabled">
        </button>
      </div>

      <div :class="$style.iconButtonContainer">
        <button :class="[$style.headerButton,{[$style.hasFilterButton]:hasFilter}]"
                class="majoricon i-filter plainButton"
                title="筛选"
                @click="openFilterDrawer">
        </button>
      </div>

      <div v-if="shouldShowQrAddButton" :class="$style.iconButtonContainer">
        <button :class="[$style.headerButton,$style.addQrButton]"
                :title="`添加${instanceDesignation}`"
                class="majoricon i-plus plainButton"
                @click="openAddQrDialog">
        </button>
      </div>
    </header>

    <main :class="$style.mainContent">
      <div v-for="qr in qrs" :class="$style.qrContainer">
        <section :class="$style.qrIconSection" @click="openQr(qr)">
          <QrIcon :fontSize="24" :length="70" :qr="qr"></QrIcon>
        </section>
        <section :class="$style.qrContentSection" @click="openQr(qr)">
          <div :class="$style.qrName">
            <span :class="[{[$style.inactiveName]:!qr.active}]">{{ qr.name }}</span>
            <span v-if="qr.template" :class="$style.qrNameIcon">
               (模板)
             </span>
            <span v-if="!qr.active" :class="$style.qrNameIcon">
               (禁用)
             </span>
          </div>
          <div :class="$style.qrAttributesContainer">
            <div v-for="attribute in allEligibleAttributes"
                 :key="attribute.id"
                 :class="$style.attributeRow">
              <div :class="$style.attributeName"> {{ attribute.name }}：</div>
              <component :is="attribute.valueType"
                         :key="attribute.id"
                         :appSetting="appSetting"
                         :attribute="attribute"
                         :class="$style.attributeValue"
                         :refControl="controlOf(attribute.controlId)"
                         :value="attributeValueOf(qr.id, attribute.id)"/>
            </div>
          </div>
        </section>
        <section :class="$style.qrDropdownSection">
          <ClientQrOperationButtons :qr="qr"></ClientQrOperationButtons>
        </section>
      </div>

      <InfiniteLoading :key="infiniteKey"
                       spinner="spiral"
                       @infinite="infiniteHandler">
        <div slot="no-more" :class="$style.infiniteMessage">
          <span v-if="qrs.length > 20">没有了</span>
        </div>
        <div slot="no-results" :class="$style.infiniteMessage">无数据</div>
      </InfiniteLoading>
    </main>

    <ClientAddQrDialog :show.sync="addQrDialogVisible"></ClientAddQrDialog>

    <ClientQrListFilterDrawer :selectableGroups="selectableGroups"
                              :shouldShowGroupSelect="shouldShowGroupSelect"
                              :show.sync="filterDialogVisible">
    </ClientQrListFilterDrawer>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import CLIENT_QR_LIST_ACTIONS from "@/client/operations/app/qrs/store/client-qr-list-actions";
import ClientAddQrDialog from '@/client/operations/app/qrs/ClientAddQrDialog';
import ClientQrListFilterDrawer from '@/client/operations/app/qrs/ClientQrListFilterDrawer';
import QrIcon from '@/common/components/QrIcon';
import AddressAttributeValue from '@/client/common/components/attribute/AddressAttributeValue';
import CheckboxAttributeValue from '@/client/common/components/attribute/CheckboxAttributeValue';
import BooleanAttributeValue from '@/client/common/components/attribute/BooleanAttributeValue';
import DoubleAttributeValue from '@/client/common/components/attribute/DoubleAttributeValue';
import DropdownAttributeValue from '@/client/common/components/attribute/DropdownAttributeValue';
import EmailAttributeValue from '@/client/common/components/attribute/EmailAttributeValue';
import FilesAttributeValue from '@/client/common/components/attribute/FilesAttributeValue';
import GeolocationAttributeValue from '@/client/common/components/attribute/GeolocationAttributeValue';
import GroupAttributeValue from '@/client/common/components/attribute/GroupAttributeValue';
import IdentifierAttributeValue from '@/client/common/components/attribute/IdentifierAttributeValue';
import ImagesAttributeValue from '@/client/common/components/attribute/ImagesAttributeValue';
import IntegerAttributeValue from '@/client/common/components/attribute/IntegerAttributeValue';
import ItemCountAttributeValue from '@/client/common/components/attribute/ItemCountAttributeValue';
import ItemStatusAttributeValue from '@/client/common/components/attribute/ItemStatusAttributeValue';
import LocalDateAttributeValue from '@/client/common/components/attribute/LocalDateAttributeValue';
import LocalTimeAttributeValue from '@/client/common/components/attribute/LocalTimeAttributeValue';
import MemberEmailAttributeValue from "@/client/common/components/attribute/MemberEmailAttributeValue";
import MemberMobileAttributeValue from "@/client/common/components/attribute/MemberMobileAttributeValue";
import MemberAttributeValue from "@/client/common/components/attribute/MemberAttributeValue";
import MembersMobileAttributeValue from "@/client/common/components/attribute/MembersMobileAttributeValue";
import MembersAttributeValue from "@/client/common/components/attribute/MembersAttributeValue";
import MembersEmailAttributeValue from "@/client/common/components/attribute/MembersEmailAttributeValue";
import MobileAttributeValue from "@/client/common/components/attribute/MobileAttributeValue";
import MultiLevelSelectionAttributeValue from "@/client/common/components/attribute/MultiLevelSelectionAttributeValue";
import MultiLineTextAttributeValue from "@/client/common/components/attribute/MultiLineTextAttributeValue";
import RichTextAttributeValue from "@/client/common/components/attribute/RichTextAttributeValue";
import PointCheckAttributeValue from "@/client/common/components/attribute/PointCheckAttributeValue";
import RadioAttributeValue from "@/client/common/components/attribute/RadioAttributeValue";
import SignatureAttributeValue from "@/client/common/components/attribute/SignatureAttributeValue";
import TextAttributeValue from '@/client/common/components/attribute/TextAttributeValue';
import TimestampAttributeValue from "@/client/common/components/attribute/TimestampAttributeValue";
import ClientQrOperationButtons from '@/client/operations/app/qrs/ClientQrOperationButtons';
import CirculationStatusAttributeValue from "@/client/common/components/attribute/CirculationStatusAttributeValue";
import {qrUrl} from "@/common/utils/common-utils";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');
const clientQrListStore = createNamespacedHelpers('CLIENT_QR_LIST_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },

    selectableGroups: {
      type: Array,
    },

    upperLinkName: {
      type: String,
      required: true,
    }
  },

  components: {
    InfiniteLoading: () => import(/* webpackChunkName: "infinite-loading" */ 'vue-infinite-loading'),
    ClientAddQrDialog,
    ClientQrOperationButtons,
    ClientQrListFilterDrawer,
    QrIcon,
    ADDRESS_VALUE: AddressAttributeValue,
    CHECKBOX_VALUE: CheckboxAttributeValue,
    BOOLEAN_VALUE: BooleanAttributeValue,
    DOUBLE_VALUE: DoubleAttributeValue,
    DROPDOWN_VALUE: DropdownAttributeValue,
    EMAIL_VALUE: EmailAttributeValue,
    FILES_VALUE: FilesAttributeValue,
    GEOLOCATION_VALUE: GeolocationAttributeValue,
    GROUP_VALUE: GroupAttributeValue,
    IDENTIFIER_VALUE: IdentifierAttributeValue,
    IMAGES_VALUE: ImagesAttributeValue,
    INTEGER_VALUE: IntegerAttributeValue,
    ITEM_COUNT_VALUE: ItemCountAttributeValue,
    ITEM_STATUS_VALUE: ItemStatusAttributeValue,
    LOCAL_DATE_VALUE: LocalDateAttributeValue,
    LOCAL_TIME_VALUE: LocalTimeAttributeValue,
    MEMBER_EMAIL_VALUE: MemberEmailAttributeValue,
    MEMBER_MOBILE_VALUE: MemberMobileAttributeValue,
    MEMBER_VALUE: MemberAttributeValue,
    MEMBERS_EMAIL_VALUE: MembersEmailAttributeValue,
    MEMBERS_MOBILE_VALUE: MembersMobileAttributeValue,
    MEMBERS_VALUE: MembersAttributeValue,
    MOBILE_VALUE: MobileAttributeValue,
    MULTI_LEVEL_SELECTION_VALUE: MultiLevelSelectionAttributeValue,
    MULTI_LINE_TEXT_VALUE: MultiLineTextAttributeValue,
    RICH_TEXT_VALUE: RichTextAttributeValue,
    POINT_CHECK_VALUE: PointCheckAttributeValue,
    RADIO_VALUE: RadioAttributeValue,
    SIGNATURE_VALUE: SignatureAttributeValue,
    TEXT_VALUE: TextAttributeValue,
    TIMESTAMP_VALUE: TimestampAttributeValue,
    CIRCULATION_STATUS_VALUE: CirculationStatusAttributeValue,
  },

  data() {
    return {
      initialised: false,
      addQrDialogVisible: false,
      filterDialogVisible: false,
    }
  },

  created() {
    this.init();
    this.initialised = true;
    document.addEventListener('visibilitychange', this.onVisible);
  },

  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.onVisible);
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'appId',
      'instanceDesignation',
      'isAppGeolocationEnabled',
      'viewableGroupIds',
      'managableGroupIds',
      'canManageGroup',
      'allEligibleAttributes',
      'controlOf',
      'allFilterableAttributes',
      'appSetting',
    ]),

    ...clientQrListStore.mapGetters([
      'attributeValueOf',
      'hasFilter',
    ]),

    ...clientQrListStore.mapState([
      'nearestPointEnabled',
      'search',
      'qrs',
      'infiniteKey',
      'keepStateKey',
    ]),

    derivedGroupId() {
      if (this.viewableGroupIds.length === 1 && this.groupId === 'ALL') {
        return this.viewableGroupIds[0];
      }
      return this.groupId;
    },

    shouldShowGroupSelect() {
      return this.derivedGroupId === 'ALL';
    },

    shouldShowQrAddButton() {
      if (this.groupId === 'ALL') {
        return this.managableGroupIds.length > 0;
      } else {
        return this.canManageGroup(this.groupId);
      }
    },

    theSearch: {
      get() {
        return this.search;
      },

      set(value) {
        this.updateSearch(value);
      }
    },
  },

  methods: {
    onVisible() {
      if (document.visibilityState === 'visible') {
        this.refreshKeepStateKey();
        this[CLIENT_QR_LIST_ACTIONS.CLIENT_FETCH_WORKING_QR]();
      }
    },

    ...clientQrListStore.mapActions([
      CLIENT_QR_LIST_ACTIONS.CLIENT_LIST_MY_VIEWABLE_QRS,
      CLIENT_QR_LIST_ACTIONS.CLIENT_FETCH_WORKING_QR,
    ]),

    ...clientQrListStore.mapMutations([
      'updateNearestPointEnabled',
      'updateSearch',
      'resetState',
      'initState',
      'resetInfinite',
      'refreshKeepStateKey',
      'setWorkingQrId',
    ]),

    init() {
      this.resetState();
      let initFilterableKey = this.$route.query.initFilterableKey;
      let initFilterableValue = this.$route.query.initFilterableValue;
      let initFilterables = new Map();
      if (initFilterableKey && initFilterableValue) {
        initFilterables.set(initFilterableKey, [initFilterableValue]);
      }

      this.initState({
        appId: this.appId,
        originGroupId: this.groupId,
        groupId: this.derivedGroupId,
        initFilterables: initFilterables,
      });
    },

    goToUpperLink() {
      this.$router.push({name: this.upperLinkName});
    },

    onSearchEnter() {
      this.$refs.searchBox.blur();
    },

    onSearchBlurred() {
      this.resetInfinite();
    },

    toggleGeolocationEnabled() {
      this.updateNearestPointEnabled(!this.nearestPointEnabled);
      this.resetInfinite();
    },

    openFilterDrawer() {
      this.filterDialogVisible = true;
    },

    openAddQrDialog() {
      this.addQrDialogVisible = true;
    },

    infiniteHandler(infiniteState) {
      return this[CLIENT_QR_LIST_ACTIONS.CLIENT_LIST_MY_VIEWABLE_QRS](infiniteState);
    },

    openQr(qr) {
      if (qr.active) {
        this.setWorkingQrId(qr.id);
        window.open(qrUrl(qr.plateId), '_blank');
      }
    },
  }
};
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow-y: auto;
}

.headerBar {
  height: $clientTopBarHeight;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: $clientPageZIndex + 1;
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: $lightShadow;
}

.headerButton {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  font-size: 20px;
  color: $regularTextColor;
}

.iconButtonContainer {
  flex-shrink: 0;
  flex-grow: 0;
  padding: 10px;
}

.searchSection {
  flex-shrink: 1;
  flex-grow: 1;
  margin-left: 20px;
  margin-right: 10px;
}

.searchInput {
  width: 100%;
}

.hasFilterButton {
  color: $oppositeThemeColor;
}

.hasFilterButton:before {
  font-weight: 500;
}

.nearestPointEnabled {
  color: $oppositeThemeColor;
}

.nearestPointEnabled:before {
  font-weight: 500;
}

.addQrButton:before {
  font-size: 24px;
  color: $regularTextColor;
}

.mainContent {
  background-color: $primaryBackgroundColor;
  position: relative;
  z-index: $clientPageZIndex;
  margin-top: $clientTopBarHeight;
  padding: 12px 10px;
  height: calc(100vh - #{$clientTopBarHeight});
  overflow-y: auto;
}

.qrContainer {
  background-color: white;
  margin-bottom: 12px;
  padding: 10px;
  min-height: 80px;
  display: flex;
}

.qrIconSection {
  flex-grow: 0;
  flex-shrink: 0;
}

.qrContentSection {
  flex-grow: 1;
  margin-left: 15px;
  margin-right: 5px;
}

.qrName {
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  color: $primaryTextColor;
  line-height: 1.3em;
  word-break: break-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.inactiveName {
  color: $placeholderTextColor !important;
}

.qrNameIcon {
  font-weight: normal;
  font-size: 12px;
  color: $oppositeThemeColor;
}

.qrAttributesContainer {
  margin-top: 6px;
  font-size: 13px;
  color: #b0b5bd;
}

.attributeRow {
  margin-bottom: 5px;
  line-height: 1.3em;
  display: flex;
}

.attributeRow:last-child {
  margin-bottom: 0;
}

.attributeName {
  width: 80px;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.attributeValue {
  flex-grow: 1;
  word-break: break-all;
  color: $secondaryTextColor;
}

.qrDropdownSection {
}

.infiniteMessage {
  padding-bottom: 15px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .mainContent {
    padding: 15px 10px;
  }

  .qrContainer {
    margin-bottom: 15px;
  }

  .attributeName {
    width: 100px;
  }
}

</style>

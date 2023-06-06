<template>
  <div :class="$style.wrapper">
    <el-table ref="listTable"
              :border="qrTableBordered"
              :class="$style.theTable"
              :data="qrs"
              :height="height"
              highlight-current-row
              stripe
              @selection-change="onSelectionChange"
              @filter-change="onFilterChange"
              @sort-change="onSortChange">
      <el-table-column
          fixed="left"
          type="selection"
          width="48">
      </el-table-column>

      <el-table-column
          :class-name="$style.nameColumn"
          :fixed="allViewableAttributes.length > 5? 'left':null"
          :label="`${instanceDesignation}名称`"
          column-key="name"
          min-width="200"
          sortable="custom">
        <template slot-scope="scope">
          <span :class="[$style.qrNameContainer]" @click="openQr(scope.row)">
            <QrIcon :class="$style.qrIcon" :length="40" :qr="scope.row"></QrIcon>
            <span :class="[$style.qrName,{[$style.inActiveQrName]:!scope.row.active}]"
                  :title="scope.row.name">
              {{ scope.row.name }}
            </span>
             <span v-if="isNew(scope.row)" class="tableTag greenTableTag">新</span>
             <span v-if="scope.row.template" class="tableTag yellowTableTag">模板</span>
             <span v-if="!scope.row.active" class="tableTag redTableTag">已禁用</span>
          </span>
        </template>
      </el-table-column>

      <component :is="attribute.valueType"
                 v-for="attribute in allViewableAttributes"
                 :key="attribute.id"
                 :attribute="attribute"/>

      <el-table-column
          fixed="right"
          label="操作"
          width="150">
        <template slot="header" slot-scope="scope">
          <div :class="$style.tableOperationContainer">
            操作
            <div>
              <i :class="$style.refreshButton"
                 class="el-icon-refresh-right"
                 title="刷新"
                 @click="refreshQrList">
              </i>
              <QrTableOperationButtons></QrTableOperationButtons>
            </div>
          </div>
        </template>

        <template slot-scope="scope">
          <QrOperationButtons :qr="scope.row" @openQr="openQr"></QrOperationButtons>
        </template>
      </el-table-column>
    </el-table>

    <DrawerBrowser :show.sync="showDrawerBrowser"
                   :src="drawerQrSrc"
                   :title="drawerQrName"
                   :wrapperClosableReferenceKey="'qrs_'+currentAppId"
                   @closed="onDrawerClose">
    </DrawerBrowser>
  </div>
</template>

<script>
import {formatEpochToMinute, isNew, qrUrlWithPage} from '@/common/utils/common-utils';
import {createNamespacedHelpers} from "vuex";
import QrTableOperationButtons from '@/console/app-operation/qrs/QrTableOperationButtons';
import QrOperationButtons from '@/console/app-operation/qrs/QrOperationButtons';
import TextAttributeValueColumn from '@/console/app-operation/qrs/attribute/TextAttributeValueColumn';
import MultiLineTextAttributeValueColumn from '@/console/app-operation/qrs/attribute/MultiLineTextAttributeValueColumn';
import RichTextAttributeValueColumn from '@/console/app-operation/qrs/attribute/RichTextAttributeValueColumn';
import TimestampAttributeValueColumn from '@/console/app-operation/qrs/attribute/TimestampAttributeValueColumn';
import LocalDateAttributeValueColumn from '@/console/app-operation/qrs/attribute/LocalDateAttributeValueColumn';
import LocalTimeAttributeValueColumn from '@/console/app-operation/qrs/attribute/LocalTimeAttributeValueColumn';
import DoubleNumberAttributeValueColumn from '@/console/app-operation/qrs/attribute/DoubleNumberAttributeValueColumn';
import IntegerNumberAttributeValueColumn from '@/console/app-operation/qrs/attribute/IntegerNumberAttributeValueColumn';
import PointCheckAttributeValueColumn from '@/console/app-operation/qrs/attribute/PointCheckAttributeValueColumn';
import BooleanAttributeValueColumn from '@/console/app-operation/qrs/attribute/BooleanAttributeValueColumn';
import MobileAttributeValueColumn from '@/console/app-operation/qrs/attribute/MobileAttributeValueColumn';
import EmailAttributeValueColumn from '@/console/app-operation/qrs/attribute/EmailAttributeValueColumn';
import IdentifierAttributeValueColumn from '@/console/app-operation/qrs/attribute/IdentifierAttributeValueColumn';
import AddressAttributeValueColumn from '@/console/app-operation/qrs/attribute/AddressAttributeValueColumn';
import GeolocationAttributeValueColumn from '@/console/app-operation/qrs/attribute/GeolocationAttributeValueColumn';
import GroupAttributeValueColumn from '@/console/app-operation/qrs/attribute/GroupAttributeValueColumn';
import MemberAttributeValueColumn from '@/console/app-operation/qrs/attribute/MemberAttributeValueColumn';
import MemberMobileAttributeValueColumn from '@/console/app-operation/qrs/attribute/MemberMobileAttributeValueColumn';
import MembersAttributeValueColumn from '@/console/app-operation/qrs/attribute/MembersAttributeValueColumn';
import MembersMobileAttributeValueColumn from '@/console/app-operation/qrs/attribute/MembersMobileAttributeValueColumn';
import MembersEmailAttributeValueColumn from '@/console/app-operation/qrs/attribute/MembersEmailAttributeValueColumn';
import MemberEmailAttributeValueColumn from '@/console/app-operation/qrs/attribute/MemberEmailAttributeValueColumn';
import RadioAttributeValueColumn from '@/console/app-operation/qrs/attribute/RadioAttributeValueColumn';
import CheckboxAttributeValueColumn from '@/console/app-operation/qrs/attribute/CheckboxAttributeValueColumn';
import DropdownAttributeValueColumn from '@/console/app-operation/qrs/attribute/DropdownAttributeValueColumn';
import ItemStatusAttributeValueColumn from '@/console/app-operation/qrs/attribute/ItemStatusAttributeValueColumn';
import ItemCountAttributeValueColumn from '@/console/app-operation/qrs/attribute/ItemCountAttributeValueColumn';
import FilesAttributeValueColumn from '@/console/app-operation/qrs/attribute/FilesAttributeValueColumn';
import ImagesAttributeValueColumn from '@/console/app-operation/qrs/attribute/ImagesAttributeValueColumn';
import MultiLevelSelectionAttributeValueColumn
  from '@/console/app-operation/qrs/attribute/MultiLevelSelectionAttributeValueColumn';
import SignatureAttributeValueColumn from '@/console/app-operation/qrs/attribute/SignatureAttributeValueColumn';
import CirculationStatusAttributeValueColumn
  from '@/console/app-operation/qrs/attribute/CirculationStatusAttributeValueColumn';
import eventBus from '@/common/utils/event-bus';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";
import QrIcon from '@/common/components/QrIcon';
import DrawerBrowser from '@/common/components/DrawerBrowser';

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['height'],

  components: {
    QrIcon,
    QrTableOperationButtons,
    QrOperationButtons,
    DrawerBrowser,
    TEXT_VALUE: TextAttributeValueColumn,
    MULTI_LINE_TEXT_VALUE: MultiLineTextAttributeValueColumn,
    RICH_TEXT_VALUE: RichTextAttributeValueColumn,
    TIMESTAMP_VALUE: TimestampAttributeValueColumn,
    LOCAL_DATE_VALUE: LocalDateAttributeValueColumn,
    LOCAL_TIME_VALUE: LocalTimeAttributeValueColumn,
    DOUBLE_VALUE: DoubleNumberAttributeValueColumn,
    INTEGER_VALUE: IntegerNumberAttributeValueColumn,
    POINT_CHECK_VALUE: PointCheckAttributeValueColumn,
    MOBILE_VALUE: MobileAttributeValueColumn,
    EMAIL_VALUE: EmailAttributeValueColumn,
    IDENTIFIER_VALUE: IdentifierAttributeValueColumn,
    ADDRESS_VALUE: AddressAttributeValueColumn,
    GEOLOCATION_VALUE: GeolocationAttributeValueColumn,
    GROUP_VALUE: GroupAttributeValueColumn,
    MEMBER_VALUE: MemberAttributeValueColumn,
    MEMBER_MOBILE_VALUE: MemberMobileAttributeValueColumn,
    MEMBERS_VALUE: MembersAttributeValueColumn,
    MEMBERS_MOBILE_VALUE: MembersMobileAttributeValueColumn,
    RADIO_VALUE: RadioAttributeValueColumn,
    CHECKBOX_VALUE: CheckboxAttributeValueColumn,
    BOOLEAN_VALUE: BooleanAttributeValueColumn,
    DROPDOWN_VALUE: DropdownAttributeValueColumn,
    ITEM_STATUS_VALUE: ItemStatusAttributeValueColumn,
    ITEM_COUNT_VALUE: ItemCountAttributeValueColumn,
    FILES_VALUE: FilesAttributeValueColumn,
    IMAGES_VALUE: ImagesAttributeValueColumn,
    MEMBERS_EMAIL_VALUE: MembersEmailAttributeValueColumn,
    MEMBER_EMAIL_VALUE: MemberEmailAttributeValueColumn,
    MULTI_LEVEL_SELECTION_VALUE: MultiLevelSelectionAttributeValueColumn,
    SIGNATURE_VALUE: SignatureAttributeValueColumn,
    CIRCULATION_STATUS_VALUE: CirculationStatusAttributeValueColumn,
  },

  data() {
    return {
      showDrawerBrowser: false,
      drawerQrName: '',
      drawerQrSrc: '',
    }
  },

  created() {
    eventBus.$on('go-to-qrs-table-top', this.scrollToTop);
    eventBus.$on('reset-qrs-sorting', this.resetTableSort);
    eventBus.$on('reset-qrs-filterables', this.resetTableFilter);
  },

  beforeDestroy() {
    eventBus.$off('go-to-qrs-table-top');
    eventBus.$off('reset-qrs-sorting');
    eventBus.$off('reset-qrs-filterables');
  },

  computed: {
    ...appOperationStore.mapState([
      'appHiddenAttributeIds',
    ]),

    ...appOperationStore.mapGetters([
      'allEligibleAttributes',
      'instanceDesignation',
      'currentAppHomePageId',
      'currentAppId',
    ]),

    ...qrListStore.mapState([
      'qrs',
      'qrTableBordered',
    ]),

    allViewableAttributes() {
      return this.allEligibleAttributes.filter(attr => !this.appHiddenAttributeIds.includes(attr.id));
    }
  },

  methods: {
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.FETCH_WORKING_QR,
      QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS,
    ]),

    ...qrListStore.mapMutations([
      'resetPageIndex',
      'updateFilterables',
      'updateSorting',
      'updateBatchSelectedQrs',
      'setWorkingQrId',
    ]),

    formatEpochToMinute: formatEpochToMinute,
    isNew: isNew,

    openQr(qr) {
      if (!qr.active) {
        return;
      }

      this.setWorkingQrId(qr.id);
      this.drawerQrSrc = qrUrlWithPage(qr.plateId, this.currentAppHomePageId);
      this.drawerQrName = qr.name;
      this.showDrawerBrowser = true;
    },

    onDrawerClose() {
      this[QR_LIST_ACTIONS.FETCH_WORKING_QR]();
    },

    refreshQrList() {
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.scrollToTop();
      });
    },

    onSelectionChange(qrs) {
      this.updateBatchSelectedQrs(qrs);
    },

    onFilterChange(filter) {
      let filterMap = new Map(Object.entries(filter));
      this.updateFilterables(filterMap);
      this.resetPageIndex();
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.scrollToTop();
      });
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.scrollToTop();
      });
    },

    scrollToTop() {
      this.$refs.listTable.bodyWrapper.scrollTop = 0;
    },

    resetTableSort() {
      this.$refs.listTable.clearSort();
    },

    resetTableFilter() {
      this.$refs.listTable.clearFilter();
    },

  }
}
</script>


<style lang="scss" module>
.wrapper {
}

.theTable {
  width: 100%;
  background-color: $whiteBackgroundColor;

  :global {
    th {
      color: $primaryTextColor;
    }

    .el-table-column--selection .cell {
      text-align: center;
    }
  }
}

.nameColumn {
  padding: 0 !important;

  :global {
    .cell {
      display: flex;
      align-items: center;
    }
  }
}

.qrNameContainer {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.qrIcon {
  margin-right: 10px;
  flex-shrink: 0;
}

.qrName {
  margin-right: 10px;
  font-weight: 500;
  line-height: 1.3em;
}

.qrName:hover {
  color: $primaryThemeColor;
}

.inActiveQrName {
  cursor: default !important;
  color: $placeholderTextColor !important;
}

.inActiveQrName:hover {
  color: $placeholderTextColor !important;
}

.tableOperationContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refreshButton {
  cursor: pointer;
  margin-right: 5px;
}

.refreshButton:hover {
  color: $primaryThemeColor;
}

</style>

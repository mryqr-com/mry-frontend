<template>
  <el-drawer :append-to-body="true"
             :class="$style.wrapper"
             :modal-append-to-body="true"
             :visible.sync="visible"
             :with-header="false"
             size="250px"
             @close="$emit('update:show', false)">
    <div :class="$style.content">
      <div :class="$style.topTitle">筛选</div>
      <section v-if="initGroupId !== 'ALL'"
               :class="$style.groupNameSection">
        {{ groupDesignation }}：<span :class="$style.groupName">{{ groupNameOf(initGroupId) }}</span>
      </section>

      <section v-if="shouldShowGroupSelect">
        <div :class="$style.filterTitle">{{ groupDesignation }}</div>
        <el-select :key="keepStateKey + 1"
                   v-model="localGroup"
                   :class="$style.inputSelect"
                   :placeholder="`选择${groupDesignation}`"
                   :title="`选择${groupDesignation}`"
                   size="small"
                   @change="onGroupChanged">
          <el-option
              v-for="range in selectableGroups"
              :key="range.id"
              :label="range.name"
              :value="range.id">
          </el-option>
        </el-select>
      </section>

      <section :class="$style.filterSection">
        <div :class="$style.filterTitle">排序</div>
        <div :class="$style.sortRow">
          <el-select :key="keepStateKey + 2"
                     v-model="localSortedBy"
                     :class="$style.sortSelect"
                     placeholder="请选择排序字段"
                     size="small"
                     title="排序"
                     @change="onSortChanged">
            <el-option
                v-for="option in sortableOptions"
                :key="option.id"
                :label="option.name"
                :value="option.id">
            </el-option>
          </el-select>

          <el-radio-group v-if="localSortedBy"
                          :key="keepStateKey + 3"
                          v-model="localAscSort"
                          :class="$style.ascSort"
                          size="small"
                          @change="onSortChanged">
            <el-radio-button :label="true">升序
            </el-radio-button>
            <el-radio-button :label="false">降序
            </el-radio-button>
          </el-radio-group>
        </div>
      </section>

      <component :is="attribute.valueType"
                 v-for="attribute in allFilterableAttributes"
                 :key="attribute.id"
                 :attribute="attribute"
                 :class="$style.filterSection"
                 :refControl="controlOf(attribute.controlId)"/>

      <el-collapse v-model="moreActive" :class="$style.moreSettingCollapse">
        <el-collapse-item name="moreSetting">
          <template slot="title">
            更多搜索
          </template>
          <el-checkbox v-model="localTemplateOnly" :class="$style.checkboxInput"
                       size="small"
                       @change="templateOnlyChanged">
            仅显示模板
          </el-checkbox>

          <template v-if="shouldShowInactiveOnly">
            <el-checkbox v-model="localInactiveOnly" :class="$style.checkboxInput"
                         size="small"
                         @change="inactiveOnlyChanged">
              仅显示禁用
            </el-checkbox>
          </template>
        </el-collapse-item>
      </el-collapse>

      <section :class="$style.buttonSection">
        <el-button :class="$style.aButton"
                   icon="el-icon-refresh"
                   size="small"
                   type="plain"
                   @click="reset">
          重置
        </el-button>

        <el-button :class="$style.aButton"
                   icon="el-icon-check"
                   size="small"
                   type="primary"
                   @click="confirm">
          确定
        </el-button>
      </section>
    </div>
  </el-drawer>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import RadioAttributeValueFilter from '@/client/operations/app/qrs/filter/RadioAttributeValueFilter';
import CheckboxAttributeValueFilter from '@/client/operations/app/qrs/filter/CheckboxAttributeValueFilter';
import BooleanAttributeValueFilter from '@/client/operations/app/qrs/filter/BooleanAttributeValueFilter';
import DropdownAttributeValueFilter from '@/client/operations/app/qrs/filter/DropdownAttributeValueFilter';
import ItemStatusAttributeValueFilter from '@/client/operations/app/qrs/filter/ItemStatusAttributeValueFilter';
import PointCheckAttributeValueFilter from '@/client/operations/app/qrs/filter/PointCheckAttributeValueFilter';
import MemberAttributeValueFilter from '@/client/operations/app/qrs/filter/MemberAttributeValueFilter';
import CirculationStatusAttributeValueFilter
  from '@/client/operations/app/qrs/filter/CirculationStatusAttributeValueFilter';

const clientQrListStore = createNamespacedHelpers('CLIENT_QR_LIST_STORE');
const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },

    shouldShowGroupSelect: {
      type: Boolean,
      required: true,
    },

    selectableGroups: {
      type: Array,
      required: true,
    }
  },

  components: {
    RADIO_VALUE: RadioAttributeValueFilter,
    CHECKBOX_VALUE: CheckboxAttributeValueFilter,
    BOOLEAN_VALUE: BooleanAttributeValueFilter,
    DROPDOWN_VALUE: DropdownAttributeValueFilter,
    ITEM_STATUS_VALUE: ItemStatusAttributeValueFilter,
    POINT_CHECK_VALUE: PointCheckAttributeValueFilter,
    MEMBER_VALUE: MemberAttributeValueFilter,
    MEMBER_MOBILE_VALUE: MemberAttributeValueFilter,
    MEMBER_EMAIL_VALUE: MemberAttributeValueFilter,
    MEMBERS_VALUE: MemberAttributeValueFilter,
    MEMBERS_MOBILE_VALUE: MemberAttributeValueFilter,
    MEMBERS_EMAIL_VALUE: MemberAttributeValueFilter,
    CIRCULATION_STATUS_VALUE: CirculationStatusAttributeValueFilter,
  },

  data() {
    return {
      visible: this.show,
      moreActive: [],
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'allSortableAttributes',
      'allFilterableAttributes',
      'groupDesignation',
      'controlOf',
      'groupNameOf',
      'canManageGroup',
      'canManageApp',
    ]),

    ...clientQrListStore.mapState([
      'sortedBy',
      'ascSort',
      'inactiveOnly',
      'templateOnly',
      'keepStateKey',
      'groupId',
      'initGroupId',
    ]),

    shouldShowInactiveOnly() {
      if (this.canManageApp) {
        return true;
      }

      return this.groupId && this.canManageGroup(this.groupId);
    },

    sortableOptions() {
      return this.allSortableAttributes.map(function (attr) {
        return {id: attr.id, name: attr.name}
      });
    },

    localSortedBy: {
      get() {
        return this.sortedBy;
      },

      set(value) {
        this.updateSortedBy(value);
      }
    },

    localAscSort: {
      get() {
        return this.ascSort;
      },

      set(value) {
        this.updateAscSort(value);
      }
    },

    localGroup: {
      get() {
        return this.groupId;
      },

      set(value) {
        return this.updateGroupId(value);
      }
    },

    localInactiveOnly: {
      get() {
        return this.inactiveOnly;
      },

      set(value) {
        this.updateInactiveOnly(value);
      }
    },

    localTemplateOnly: {
      get() {
        return this.templateOnly;
      },

      set(value) {
        this.updateTemplateOnly(value);
      }
    },

  },

  methods: {
    ...clientQrListStore.mapMutations([
      'updateSortedBy',
      'updateAscSort',
      'resetInfinite',
      'updateGroupId',
      'resetGroupId',
      'resetFilters',
      'updateInactiveOnly',
      'updateTemplateOnly',
    ]),

    onSortChanged() {
      this.resetInfinite();
    },

    onGroupChanged() {
      this.resetInfinite();
    },

    inactiveOnlyChanged() {
      this.resetInfinite();
    },

    templateOnlyChanged() {
      this.resetInfinite();
    },

    reset() {
      this.resetFilters();
      this.resetGroupId();
      this.resetInfinite();
      this.visible = false;
    },

    confirm() {
      this.visible = false;
    },

  }

}
</script>


<style lang="scss" module>
.wrapper {
}

.content {
  height: 100vh;
  overflow-y: auto;
  padding: 10px;
}

.topTitle {
  margin-bottom: 15px;
  font-weight: 500;
  font-size: 15px;
}

.groupNameSection {
  margin-bottom: 15px;
  font-size: 13px;
}

.groupName {
  color: $primaryTextColor;
}

.filterTitle {
  font-size: 13px;
  margin-bottom: 5px;
}

.sortRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sortSelect {
  width: 100%;
  flex-shrink: 1;
}

.ascSort {
  flex-shrink: 0;
  margin-left: 10px;
}

.filterSection {
  margin-top: 20px;
}

.inputSelect {
  width: 100%;
}

.moreSettingCollapse {
  margin-top: 15px;
  margin-bottom: 15px;
  border: none;

  :global {
    .el-collapse-item__header {
      border: none;
      font-weight: normal;
      color: $regularTextColor;
    }

    .el-collapse-item__wrap {
      border: none;
    }
  }
}

.buttonSection {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 100px;
}

.checkboxInput {
  display: block;
  margin-bottom: 10px;

  :global {
    .el-checkbox__label {
      font-size: 13px;
    }
  }
}

.aButton {
  width: 100%;
}
</style>

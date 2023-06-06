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
      <section v-if="initGroupId !== 'ALL'" :class="$style.groupNameSection">
        {{ groupDesignation }}：
        <span :class="$style.groupName">{{ groupNameOf(initGroupId) }}</span>
      </section>

      <section v-if="shouldShowGroupSelect" :class="$style.filterSection">
        <div :class="$style.filterTitle">{{ groupDesignation }}</div>
        <el-select v-model="localGroupId"
                   :class="$style.inputSelect"
                   :placeholder="`选择${groupDesignation}`"
                   :title="`选择${groupDesignation}`"
                   size="small"
                   @change="onGroupChanged">
          <el-option v-for="group in allableViewableGroups"
                     :key="group.id"
                     :label="group.name"
                     :value="group.id">
          </el-option>
        </el-select>
      </section>

      <section :class="$style.filterSection">
        <div :class="$style.filterTitle">排序</div>
        <div :class="$style.sortRow">
          <el-select v-model="localSortedBy"
                     :class="$style.sortSelect"
                     placeholder="请选择排序字段"
                     size="small"
                     title="排序"
                     @change="onSortChanged">
            <el-option v-for="option in sortableOptions"
                       :key="option.id"
                       :label="option.name"
                       :value="option.id">
            </el-option>
          </el-select>

          <el-radio-group v-if="localSortedBy"
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

const clientMyAssignmentListStore = createNamespacedHelpers('CLIENT_MY_ASSIGNMENT_LIST_STORE');
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
  },

  data() {
    return {
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'groupDesignation',
      'groupNameOf',
      'allableViewableGroups',
    ]),

    ...clientMyAssignmentListStore.mapState([
      'initGroupId',
      'groupId',
      'sortedBy',
      'ascSort',
    ]),

    sortableOptions() {
      return [
        {id: 'startAt', name: '任务开始时间'},
        {id: 'expireAt', name: '任务结束时间'}
      ];
    },

    localGroupId: {
      get() {
        return this.groupId;
      },

      set(value) {
        return this.updateGroupId(value);
      }
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
  },

  methods: {
    ...clientMyAssignmentListStore.mapMutations([
      'updateGroupId',
      'updateSortedBy',
      'updateAscSort',
      'resetGroupId',
      'resetSorting',
      'resetInfinite',
    ]),


    onGroupChanged() {
      this.resetInfinite();
    },

    onSortChanged() {
      this.resetInfinite();
    },

    reset() {
      this.resetGroupId();
      this.resetSorting();
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
  margin-bottom: 20px;
}

.inputSelect {
  width: 100%;
}

.buttonSection {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 100px;
}

.aButton {
  width: 100%;
}

</style>

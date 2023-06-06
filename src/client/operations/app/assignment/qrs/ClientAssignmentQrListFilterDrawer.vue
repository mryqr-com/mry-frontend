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

      <section :class="$style.filterSection">
        <div :class="$style.filterTitle">搜索</div>
        <el-input :key="keepStateKey"
                  ref="searchBox"
                  v-model="localSearch"
                  :class="$style.inputBox"
                  :maxlength="50"
                  placeholder="搜索..."
                  size="small"
                  title="搜索"
                  @blur="onSearchBlurred"
                  @keyup.enter.native="onSearchEnter">
        </el-input>
      </section>

      <section :class="$style.filterSection">
        <div :class="$style.filterTitle">排序</div>
        <div :class="$style.sortRow">
          <el-select :key="keepStateKey + 1"
                     v-model="localSortedBy"
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
                          :key="keepStateKey + 2"
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

const clientAssignmentQrListStore = createNamespacedHelpers('CLIENT_ASSIGNMENT_QR_LIST_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: true,
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
    ...clientAssignmentQrListStore.mapState([
      'search',
      'nearestPointEnabled',
      'keepStateKey',
      'sortedBy',
      'ascSort',
    ]),

    localSearch: {
      get() {
        return this.search;
      },

      set(value) {
        this.updateSearch(value);
      }
    },

    sortableOptions() {
      return [
        {id: 'createdAt', name: '创建时间'},
        {id: 'name', name: '名称'}
      ];
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
    ...clientAssignmentQrListStore.mapMutations([
      'updateSearch',
      'resetSearch',
      'updateSortedBy',
      'updateAscSort',
      'resetSorting',
      'resetInfinite',
    ]),

    onSearchEnter() {
      this.$refs.searchBox.blur();
    },

    onSearchBlurred() {
      this.resetInfinite();
    },

    onSortChanged() {
      this.resetInfinite();
    },

    reset() {
      this.resetSearch();
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

.filterTitle {
  font-size: 13px;
  margin-bottom: 5px;
}

.filterSection {
  margin-bottom: 25px;
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

.inputBox {
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

<template>
  <div :class="$style.wrapper">
    <div :class="$style.filterTitle">审批状态</div>
    <el-select :key="keepStateKey"
               ref="theSelect"
               v-model="localOptions"
               :class="$style.inputSelect"
               multiple
               size="small"
               @change="onOptionChanged('theSelect')">
      <el-option
          v-for="option in allOptions"
          :key="option.value"
          :label="option.text"
          :value="option.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');
const clientQrSubmissionListStore = createNamespacedHelpers('CLIENT_QR_SUBMISSION_LIST_STORE');

export default {
  computed: {
    ...clientQrStore.mapGetters([
      'approvalFiltersForPage'
    ]),

    ...clientQrSubmissionListStore.mapState([
      'filterables',
      'keepStateKey',
      'pageId',
    ]),

    allOptions() {
      return this.approvalFiltersForPage(this.pageId);
    },

    localOptions: {
      get() {
        return this.filterables.get('approval');
      },

      set(options) {
        let filterable = new Map();
        filterable.set('approval', options);
        this.updateFilterables(filterable);
      }
    }
  },

  methods: {
    ...clientQrSubmissionListStore.mapMutations([
      'resetInfinite',
      'updateFilterables',
    ]),

    onOptionChanged(select) {
      this.resetInfinite();
      let _this = this;
      setTimeout(function () {
        _this.$refs[select].blur();
      }, 50);
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.filterTitle {
  font-size: 13px;
  margin-bottom: 5px;
}

.inputSelect {
  width: 100%;
}
</style>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.filterTitle">{{ fieldName }}</div>
    <el-select :key="keepStateKey"
               ref="theSelect"
               v-model="localOptions"
               :class="$style.inputSelect"
               multiple
               size="small"
               @change="onOptionChanged('theSelect')">
      <el-option
          v-for="option in allOptions"
          :key="option.id"
          :label="option.name"
          :value="option.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {controlFieldName} from "@/common/utils/common-utils";

const clientSubmissionListStore = createNamespacedHelpers('CLIENT_SUBMISSION_LIST_STORE');

export default {
  props: ['control'],

  computed: {
    ...clientSubmissionListStore.mapState([
      'filterables',
      'keepStateKey',
    ]),

    allOptions() {
      return [{id: 'YES', name: '正常'}, {id: 'NO', name: '异常'}]
    },

    fieldName() {
      return controlFieldName(this.control)
    },

    localOptions: {
      get() {
        return this.filterables.get(this.control.id);
      },

      set(options) {
        let filterable = new Map();
        filterable.set(this.control.id, options);
        this.updateFilterables(filterable);
      }
    }
  },

  methods: {
    ...clientSubmissionListStore.mapMutations([
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

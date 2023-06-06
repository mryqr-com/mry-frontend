<template>
  <div :class="$style.wrapper">
    <div :class="$style.filterTitle">{{ attribute.name }}</div>
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

const clientQrListStore = createNamespacedHelpers('CLIENT_QR_LIST_STORE');
const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: ['attribute'],

  computed: {
    ...clientQrListStore.mapState([
      'filterables',
      'keepStateKey',
    ]),

    ...clientAppOperationStore.mapGetters([
      'appSetting'
    ]),

    allOptions() {
      return this.appSetting.circulationStatusSetting.options;
    },

    localOptions: {
      get() {
        return this.filterables.get(this.attribute.id);
      },

      set(options) {
        let filterable = new Map();
        filterable.set(this.attribute.id, options);
        this.updateFilterables(filterable);
      }
    }
  },

  methods: {
    ...clientQrListStore.mapMutations([
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

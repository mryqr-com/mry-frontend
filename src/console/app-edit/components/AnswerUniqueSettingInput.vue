<template>
  <div :class="$style.wrapper" class="keyValueSettingContainer">
    唯一性检查：
    <el-select :value="value"
               class="width130"
               size="mini"
               title="填值在应用范围下是否唯一"
               @change="$emit('input', $event)">
      <el-option v-for="aType in uniqueTypes"
                 :key="aType.value"
                 :label="aType.text"
                 :value="aType.value">
      </el-option>
    </el-select>
  </div>

</template>

<script>
import {createNamespacedHelpers} from "vuex";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: String,
      required: true
    },
  },

  computed: {
    ...mapGetters([
      'instanceDesignation'
    ]),

    uniqueTypes() {
      return [
        {
          text: '无',
          value: "NONE"
        },
        {
          text: '应用范围内唯一',
          value: "UNIQUE_PER_APP"
        },

        {
          text: `${this.instanceDesignation}范围内唯一`,
          value: "UNIQUE_PER_INSTANCE"
        },
      ]
    },
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

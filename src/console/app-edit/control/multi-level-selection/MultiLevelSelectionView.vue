<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <div v-if="titles.length >= 1" :class="$style.singleRow">
      <el-select ref="level1"
                 v-model="value"
                 :class="$style.theInput"
                 :placeholder="titles[0]"
                 @visible-change="noclick('level1')">
      </el-select>
    </div>

    <div v-if="titles.length >= 2" :class="$style.singleRow">
      <el-select ref="level2"
                 v-model="value"
                 :class="$style.theInput"
                 :placeholder="titles[1]"
                 @visible-change="noclick('level2')">
      </el-select>
    </div>

    <div v-if="titles.length >= 3" :class="$style.singleRow">
      <el-select ref="level3"
                 v-model="value"
                 :class="$style.theInput"
                 :placeholder="titles[2]"
                 @visible-change="noclick('level3')">
      </el-select>
    </div>

    <div v-if="titles.length===0" :class="$style.placeholderText">
      请点击右侧"编辑选项"按钮以完成选项数据录入
    </div>

  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {
      value: null
    };
  },

  computed: {
    titles() {
      if (!this.control.titleText) {
        return [];
      }
      return this.control.titleText.split('/').map(str => str.trim()).filter(value => value);
    }
  },

  methods: {
    noclick(ref) {
      this.$refs[ref].blur();
      this.$el.click();
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  pointer-events: none;
}

.singleRow {
  margin-top: 6px;
}

.singleRow:first-child {
  margin-top: 0;
}

.theInput {
  width: 100%;
}

.wrapperWide {
  max-width: $maxControlSelectionWidth;
}

.placeholderText {
  color: $warningYellow;
  font-size: 13px;
}

</style>

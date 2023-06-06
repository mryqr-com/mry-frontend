<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <div :class="$style.rowContainer">
      <el-select ref="theProvince"
                 v-model="value"
                 :class="$style.theProvince"
                 placeholder="请选择省份"
                 @visible-change="noclick('theProvince')">
      </el-select>

      <PlainButton v-if="control.positionable" :class="$style.currentButton">
        当前位置
      </PlainButton>
    </div>

    <div v-if="control.precision > 1"
         :class="$style.singleRow">
      <el-select ref="theCity"
                 v-model="value"
                 :class="$style.theCity"
                 placeholder="请选择城市"
                 @visible-change="noclick('theCity')">
      </el-select>

    </div>

    <div v-if="control.precision > 2"
         :class="$style.singleRow">
      <el-select ref="theArea"
                 v-model="value"
                 :class="$style.theArea"
                 placeholder="请选择区域"
                 @visible-change="noclick('theArea')">
      </el-select>
    </div>

    <div v-if="control.precision > 3"
         :class="$style.singleRow">
      <el-input :class="$style.theInput"
                :spellcheck="false"
                placeholder="请输入详细地址"
                readonly
                type="textarea">
      </el-input>
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
}

.rowContainer {
  pointer-events: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.singleRow {
  pointer-events: none;
  margin-top: 6px;
}

.singleRow:first-child {
  margin-top: 0;
}

.theInput {
  pointer-events: none;

  :global {
    .el-input__inner {
      cursor: pointer;
    }
  }
}

.wrapperWide {
  max-width: $maxControlSelectionWidth;
}

.currentButton {
  flex-shrink: 0;
  width: 100px !important;
  margin-left: 10px;
  height: 36px !important;
  color: $regularTextColor !important;
}

.theProvince {
  flex-grow: 1;
}

.theCity {
  width: 100%;
}

.theArea {
  width: 100%;
}

</style>

<template>
  <div :class="$style.wrapper">
    <el-row>
      <el-col v-for="optionId in ['YES','NO']" :key="optionId" :span="6">
        <button :class="$style.optionContainer" class="plainButton" @click="gotoList(optionId)">
          <span :class="$style.countNumber" :style="styleForCount(optionId)">
            {{ countFor(optionId) }}
          </span>
          <span :class="$style.optionName">{{ optionId === 'YES' ? '正常' : '异常' }}</span>
        </button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  props: ['counts', 'refControl'],

  methods: {
    gotoList(optionId) {
      if (this.countFor(optionId) > 0) {
        this.$emit("optionClicked", optionId);
      }
    },

    countFor(optionId) {
      let count = this.counts.get(optionId);
      return count ? count : 0;
    },

    styleForCount(optionId) {
      return {
        color: optionId === 'YES' ? '#10b01b' : '#ea0000',
      }
    },
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.optionContainer {
  display: block;
  width: 100%;
  padding: 5px;
  cursor: pointer;
}

.countNumber {
  display: block;
  font-size: 22px;
  overflow: hidden;
  font-weight: 500;
  text-align: center;
  height: 26px;
}

.optionName {
  display: block;
  text-align: center;
  color: $secondaryTextColor;
  height: 30px;
  overflow: hidden;
}
</style>

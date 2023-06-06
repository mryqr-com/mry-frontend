<template>
  <div :class="$style.wrapper">
    <el-row>
      <el-col v-for="option in refControl.options" :key="option.id" :span="6">
        <button :class="$style.optionContainer" class="plainButton" @click="gotoList(option)">
          <span :class="$style.countNumber">
            {{ countFor(option.id) }}
          </span>
          <span :class="$style.optionName">{{ option.name }}</span>
        </button>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  props: ['counts', 'refControl'],

  methods: {
    gotoList(option) {
      if (this.countFor(option.id) > 0) {
        this.$emit("optionClicked", option.id);
      }
    },

    countFor(optionId) {
      let count = this.counts.get(optionId);
      return count ? count : 0;
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

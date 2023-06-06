<template>
  <div :class="$style.wrapper">
    <el-row :gutter="control.gutter">
      <el-col v-for="link in links"
              :key="link.id"
              :span="24/control.linkPerLine">
        <StyledButton :buttonStyle="control.buttonTextStyle"
                      :style="buttonStyle"
                      @click="go(link)">
          {{ link.buttonText }}
          <i v-if="showWarning && isIncomplete(link)"
             :class="$style.warning"
             class="el-icon-warning-outline"
             title="请完善链接设置">
          </i>
        </StyledButton>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  props: {
    control: {
      type: Object,
    },

    links: {
      type: Array,
    },

    showWarning: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    buttonStyle() {
      return {
        marginBottom: this.control.gutter + 'px',
      }
    },
  },

  methods: {
    go(link) {
      this.$emit("click", link);
    },

    isIncomplete(link) {
      if (!link.type) {
        return true;
      }

      if (link.type === 'PAGE') {
        return !link.pageId;
      }

      return !link.url;
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.linkName {
  display: inline-block;
  vertical-align: middle;
  font-family: inherit;
}

.warning {
  color: $warningYellow;
}
</style>

<template>
  <ul :class="$style.wrapper">
    <li v-for="instance in instances"
        :class="[$style.listItem,{[$style.separatorVisible]:showSeparator}]"
        :style="listItemStyle"
        @click="onClick(instance)">
      {{ instanceText(instance) }}
    </li>
  </ul>
</template>

<script>
import {formatEpochToMinute} from "@/common/utils/common-utils";

export default {
  props: {
    instances: {
      type: Array,
      required: true
    },

    showCreator: {
      type: Boolean,
      default: false
    },

    showCreatedAt: {
      type: Boolean,
      default: true
    },

    showSeparator: {
      type: Boolean,
      default: true
    },

    rowGutter: {
      type: Number,
      default: 20,
    }
  },

  computed: {
    listItemStyle() {
      return {
        paddingTop: this.rowGutter / 2 + 'px',
        paddingBottom: this.rowGutter / 2 + 'px',
      }
    }
  },

  methods: {
    onClick(instance) {
      this.$emit("click", instance);
    },

    instanceText(instance) {
      let suffix = '';
      let creator = this.showCreator ? instance.creator : null;
      let createdAt = this.showCreatedAt ? formatEpochToMinute(instance.createdAt) : null;

      if (creator || createdAt) {
        suffix = `（${[creator, createdAt].filter(it => !!it).join("，")}）`;
      }

      return instance.name + suffix;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  list-style-type: square;
  list-style-position: inside;
}

.listItem {
  cursor: pointer;
  text-indent: -1.4em;
  padding-left: 1.4em;
  line-height: 1.4em;
}

.listItem:hover {
  color: $primaryThemeColor;
}

.separatorVisible {
  border-bottom: $secondary1pxBorder;
}

.separatorVisible:first-child {
  border-top: $secondary1pxBorder;
}

</style>

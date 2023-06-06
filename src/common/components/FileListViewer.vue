<template>
  <ul v-if="files.length > 0" :class="$style.wrapper" :style="wrapperStyle">
    <li v-for="file in files"
        :key="file.id"
        :class="$style.theLi"
        @click="onFileClick(file)">
      <img :class="$style.theImage" :src="iconForType(file.type)" alt="icon"/>
      <BoxedTextViewer :textStyle="fileNameStyle">
        {{ file.name }} <span :class="$style.fileSize">（{{ fileSizeOf(file) }}）</span>
      </BoxedTextViewer>
    </li>
  </ul>
</template>

<script>
import {iconFor} from '@/common/utils/mime-utils'
import {appearanceStyles} from "@/common/utils/common-utils";

export default {
  props: {
    files: {
      type: Array,
      required: true
    },

    fileNameStyle: {
      type: Object,
      required: true,
    },

    appearanceStyle: {
      type: Object,
      required: true,
    },
  },

  methods: {
    iconForType(type) {
      return `/file-icon/${iconFor(type)}`;
    },

    onFileClick(file) {
      this.$emit('fileClicked', file);
    },

    fileSizeOf(file) {
      let kbSize = file.size / 1024;
      if(kbSize < 1000) {
        return kbSize.toFixed(2) + ` KB`;
      }

      let mbSize = kbSize / 1024;
      return mbSize.toFixed(2) + ' MB';
    },
  },

  computed: {
    wrapperStyle() {
      return {
        ...appearanceStyles(this.appearanceStyle),
      }
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theLi {
  display: flex;
  align-items: center;
  border-bottom: $primary1pxBorder;
  padding: 25px 0;
  cursor: pointer;
}

.theLi:last-child {
  border-bottom: none !important;
}

.theImage {
  min-height: 20px;
  max-width: 40px;
  max-height: 40px;
  box-shadow: $imageShadow;
  margin-right: 15px;
  flex-shrink: 0;
  flex-grow: 0;
  border-radius: 2px;
  background-color: white;
}

.theName {
  flex-grow: 1;
}

.fileSize {
  font-size: 13px;
  color: $secondaryTextColor;
}
</style>

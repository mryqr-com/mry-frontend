<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <div v-for="link in links"
         :key="link.id"
         :class="$style.linkContainer">
      <section :class="$style.leftSection">
        <div :class="$style.iconContainer">
          <img v-if="link.image"
               :alt="link.name"
               :class="$style.linkImage"
               :src="imageSrc(link)"
               :style="imageStyle"/>
        </div>
        <div :class="$style.nameContainer">
          <BoxedTextViewer v-if="link.name" :textStyle="control.nameTextStyle">
            {{ link.name }}
          </BoxedTextViewer>
          <BoxedTextViewer v-if="link.description" :textStyle="control.descriptionTextStyle">
            {{ link.description }}
          </BoxedTextViewer>
          <div v-if="showWarning && isIncomplete(link)" :class="$style.cardIncompleteNote">
            <i class="el-icon-warning-outline"> 请完善该项链接设置</i>
          </div>
        </div>
      </section>

      <StyledButton :buttonStyle="control.cardButtonTextStyle"
                    :class="$style.rightSection"
                    @click="go(link)">
        {{ link.buttonText }}
      </StyledButton>
    </div>
  </div>
</template>

<script>
import {imageThumbnailUrl} from '@/common/utils/image-utils'
import {appearanceStyles} from "@/common/utils/common-utils";

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
    wrapperStyle() {
      return {
        ...appearanceStyles(this.control.appearanceStyle),
      }
    },

    imageStyle() {
      return {
        maxHeight: this.control.linkImageSize + 'px',
        maxWidth: this.control.linkImageSize + 'px'
      }
    },
  },

  methods: {
    go(link) {
      this.$emit("click", link);
    },

    imageSrc(link) {
      return imageThumbnailUrl(link.image)
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

.linkContainer {
  display: flex;
  align-items: center;
  border-bottom: $primary1pxBorder;
  padding: 25px 0;
}

.linkContainer:last-child {
  border-bottom: 0;
}

.leftSection {
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.iconContainer {
  flex-shrink: 0;
  flex-grow: 0;
}

.linkImage {
  min-height: 20px;
  padding-right: 15px;
  width: 100%;
}

.nameContainer {
  flex-shrink: 1;
  flex-grow: 1;
}

.rightSection {
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 90px;
}

.cardIncompleteNote {
  color: $warningYellow;
  font-size: 13px;
  margin-top: 10px;
}
</style>

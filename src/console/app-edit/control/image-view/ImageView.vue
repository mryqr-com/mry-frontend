<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <ImageListViewer v-if="control.images.length > 0"
                     :border="control.border"
                     :borderRadius="control.borderRadius"
                     :images="control.images"
                     :shadow="control.shadow"
                     :showName="control.showImageName"
                     :verticalMargin="control.verticalMargin"
                     :widthRatio="control.widthRatio">
    </ImageListViewer>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请添加图片文件</i>
    </div>
  </div>
</template>

<script>

export default {
  props: ['control', 'tabletView', "controlIndex"],
}
</script>

<style lang="scss" module>
.wrapper {
}

.placeholderText {
  color: $warningYellow;
}

</style>

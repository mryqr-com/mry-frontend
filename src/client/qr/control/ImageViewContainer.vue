<template>
  <ControlWrapper v-if="control.images.length > 0" :control="control" :index="index">
    <ImageListViewer :border="control.border"
                     :borderRadius="control.borderRadius"
                     :images="control.images"
                     :shadow="control.shadow"
                     :showName="control.showImageName"
                     :verticalMargin="control.verticalMargin"
                     :widthRatio="control.widthRatio">
    </ImageListViewer>
  </ControlWrapper>
</template>

<script>

export default {
  props: ['control', 'index'],
}
</script>

<style lang="scss" module>

</style>

<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <MultipleFileUploader v-model="images"
                          :buttonStyle="control.buttonStyle"
                          :buttonText="control.buttonText"
                          :compressType="control.compressType"
                          :displayCount="true"
                          :dnd="tabletView"
                          :dndAreaHeight="50"
                          :dndAreaText="control.buttonText"
                          :hideButtonWhenMax="true"
                          :imageOnly="true"
                          :max="control.max"
                          :nameEditable="control.nameEditable"
                          :onlyOnSite="control.onlyOnSite"
                          :ossRequest="fakeOssRequest"
                          :perMaxSize="10"
                          :sortable="control.sortable"
                          :viewOnly="false">
    </MultipleFileUploader>
  </div>
</template>

<script>

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  data() {
    return {
      images: []
    };
  },

  computed: {
    fakeOssRequest() {
      return {
        type: 'FAKE_OSS_REQUEST',
      }
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
  pointer-events: none;
}

</style>

<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <MultipleFileUploader v-model="files"
                          :acceptTypes="acceptFileTypes"
                          :buttonStyle="control.buttonStyle"
                          :buttonText="control.buttonText"
                          :dnd="tabletView"
                          :dndAreaHeight="50"
                          :dndAreaText="control.buttonText"
                          :hideButtonWhenMax="true"
                          :max="control.max"
                          :nameEditable="control.nameEditable"
                          :ossRequest="fakeOssRequest"
                          :perMaxSize="control.perMaxSize"
                          :sortable="control.sortable"
                          :viewOnly="false">
    </MultipleFileUploader>
  </div>
</template>

<script>
import {accept} from "@/common/utils/mime-utils";

export default {
  props: ['control', 'tabletView', "controlIndex"],

  data() {
    return {
      files: []
    };
  },

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  computed: {
    acceptFileTypes() {
      return accept[this.control.category];
    },

    fakeOssRequest() {
      return {
        type: 'FAKE_OSS_REQUEST',
      }
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  pointer-events: none;
}

</style>

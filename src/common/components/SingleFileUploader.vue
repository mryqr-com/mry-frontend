<template>
  <MultipleFileUploader v-model="localFiles"
                        :acceptTypes="acceptTypes"
                        :buttonStyle="buttonStyle"
                        :buttonText="buttonText"
                        :compressType="compressType"
                        :displayCount="false"
                        :dnd="dnd"
                        :dndAreaHeight="dndAreaHeight"
                        :dndAreaText="dndAreaText"
                        :hideButtonWhenMax="hideButtonWhenMax"
                        :imageOnly="imageOnly"
                        :max="1"
                        :nameEditable="nameEditable"
                        :onlyOnSite="onlyOnSite"
                        :ossRequest="ossRequest"
                        :perMaxSize="perMaxSize"
                        :sortable="false"
                        :viewOnly="viewOnly">
  </MultipleFileUploader>
</template>

<script>

export default {
  props: {
    value: {//v-model
      type: Object,
    },

    acceptTypes: {//接收的MIME类型
      type: Array,
      default: function () {
        return ['*'];
      },
    },

    imageOnly: {//是否只用于上传图片
      type: Boolean,
      default: false,
    },

    dnd: {//是否采用拖拽方式
      type: Boolean,
      default: false,
    },

    dndAreaHeight: {//拖拽区域高度
      type: Number,
      default: 50
    },

    dndAreaText: {//拖拽区域文本
      type: String,
    },

    buttonText: {//按钮文本
      type: String,
    },

    buttonStyle: {//按钮样式
      type: Object,
    },

    perMaxSize: {//单个文件最大M
      type: Number,
      default: 10,
    },

    nameEditable: {//文件名是否可编辑
      type: Boolean,
      default: false
    },

    ossRequest: {//OSS请求类型
      type: Object,
      required: true
    },

    hideButtonWhenMax: {//文件满时，是否因此按钮，对dndArea无效
      type: Boolean,
      default: false
    },

    viewOnly: {//是否为只浏览模式
      type: Boolean,
      default: false
    },

    onlyOnSite: {//是否现场拍照
      type: Boolean,
      default: false
    },

    compressType: {//图片压缩级别
      type: String,
      default: 'MEDIUM'
    },
  },

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  data() {
    return {
      localFiles: []
    }
  },

  created() {
    if (this.value) {
      this.localFiles.push(this.value)
    }
  },

  watch: {
    localFiles: {
      handler: function () {
        if (this.localFiles[0]) {
          this.$emit('input', this.localFiles[0])
        } else {
          this.$emit('input', null)
        }
      },
      deep: true
    },

    value: {
      handler: function () {
        this.localFiles = [];
        if (this.value) {
          this.localFiles.push(this.value)
        }
      },
    }
  }
}
</script>

<style lang="scss" module>

</style>

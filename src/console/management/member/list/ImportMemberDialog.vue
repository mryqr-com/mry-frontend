<template>
  <el-dialog :append-to-body="true"
             :visible.sync="visible"
             title="批量导入成员"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-alert :class="$style.templateAlert" :closable="false" type="warning">
      <span :class="$style.warningText">单次最多导入500条记录；为保证正常导入，请严格按照模板格式进行上传！</span>
      <el-button :class="$style.templateButton" size="medium" type="text" @click="downloadTemplate">下载模板</el-button>
    </el-alert>

    <DraggableSingleFileInput
        v-model="file"
        :acceptTypes="['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']"
        :class="$style.fileUploader">
    </DraggableSingleFileInput>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>

      <el-button :class="$style.footerButton"
                 :disabled="hasNoFile"
                 icon="el-icon-upload2"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        上传
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import DraggableSingleFileInput from '@/common/components/DraggableSingleFileInput';
import {saveAs} from 'file-saver';
import templateFile from '@/console/management/member/list/member-upload-template.xlsx';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    DraggableSingleFileInput,
  },

  data() {
    return {
      visible: this.show,
      file: null
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    init() {
      this.file = null;
    },

    downloadTemplate() {
      saveAs(templateFile, '成员导入模板.xlsx');
    },

    onSubmit() {
      if (this.file) {
        let formData = new FormData();
        formData.append("file", this.file);
        this.visible = false;
        this.$emit("fileUpload", formData);
      }
    },

    cancel() {
      this.visible = false;
    }
  },

  computed: {
    hasNoFile() {
      return !this.file;
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

.templateAlert {
  padding-left: 5px;
  margin-bottom: 10px;
}

.warningText {
  font-size: 13px;
  line-height: 1.6em;
}

.templateButton {
  font-size: 13px;
  padding: 0;
  font-weight: normal;
  text-decoration: underline;
}

.fileUploader {
  margin-bottom: 10px;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


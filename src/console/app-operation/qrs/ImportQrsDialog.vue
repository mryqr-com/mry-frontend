<template>
  <el-dialog :append-to-body="true"
             :title="`批量导入${instanceDesignation}`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-alert :class="$style.templateAlert" :closable="false" type="warning">
      <span :class="$style.warningText">单次最多导入1000条记录；为保证正常导入，请严格按照模板格式进行上传！</span>
      <el-button :class="$style.templateButton" size="medium" type="text" @click="downloadTemplate">下载模板</el-button>
    </el-alert>

    <div :class="$style.groupSection">{{ groupDesignation }}：{{ groupNameOf(groupId) }}</div>

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
import {createNamespacedHelpers} from 'vuex';
import DraggableSingleFileInput from '@/common/components/DraggableSingleFileInput';
import {saveAs} from 'file-saver';
import appApi from '@/common/api/app-api';

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

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
      return appApi.fetchImportQrTemplate(this.currentAppId).then((response) => {
        saveAs(response.data, `${this.currentAppName}-${this.instanceDesignation}导入模板.xlsx`);
      });
    },

    onSubmit() {
      if (this.file) {
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("groupId", this.groupId);
        this.visible = false;
        this.$emit("fileUpload", formData);
      }
    },

    cancel() {
      this.visible = false;
    }
  },

  computed: {
    ...qrListStore.mapState(['groupId']),
    ...appOperationStore.mapGetters([
      'instanceDesignation',
      'groupDesignation',
      'groupNameOf',
      'currentAppId',
      'currentAppName',
    ]),

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

.groupSection {
  margin-top: 20px;
  margin-bottom: 5px;
}

.fileUploader {
  margin-bottom: 10px;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


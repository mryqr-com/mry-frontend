<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :title="`${instanceDesignation}导入结果`"
             :visible.sync="visible"
             width="700px"
             @close="$emit('update:show', false)">

    <template v-if="importResponse">
      <div :class="$style.responseText">
        本次导入总共读取<span :class="$style.info">{{ importResponse.readCount }}</span>条记录，
        成功导入<span :class="$style.green">{{ importResponse.importedCount }}</span>条记录。
        <template v-if="importResponse.errorRecords.length > 0">
          有<span :class="$style.error">{{ importResponse.errorRecords.length }}</span>条记录因存在错误而无法导入，您可以根据以下错误提示修正数据后重新导入。
        </template>
      </div>

      <template v-if="importResponse.errorRecords.length > 0">
        <div :class="$style.errorTitle">错误记录：</div>
        <el-table :data="errors"
                  :max-height="384"
                  highlight-current-row>
          <el-table-column :width="100"
                           label="所在行号"
                           prop="rowIndex">
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true"
                           label="名称"
                           prop="name">
          </el-table-column>

          <el-table-column :label="customIdDesignation"
                           :min-width="120"
                           prop="customId">
          </el-table-column>

          <el-table-column :min-width="150"
                           :show-overflow-tooltip="true"
                           label="错误详情">
            <template slot-scope="scope">
              {{ scope.row.errors.join('；') }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </template>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="primary"
                 @click="close">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers, mapMutations} from 'vuex';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    importResponse: {
      type: Object,
    },
  },

  data() {
    return {
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    ...mapMutations(['refreshConsoleAppOperationPage']),

    close() {
      this.visible = false;
      this.refreshConsoleAppOperationPage();
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'instanceDesignation',
      'customIdDesignation'
    ]),

    errors() {
      return this.importResponse.errorRecords
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 10px;
    }
  }
}

.responseText {
  background-color: $lightBackgroundColor;
  padding: 15px;
  line-height: 1.6em;
}

.info {
  color: $primaryTextColor;
  font-weight: 600;
}

.green {
  color: $passGreen;
  font-weight: 600;
}

.error {
  color: $rejectRed;
  font-weight: 600;
}

.errorTitle {
  margin-top: 15px;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


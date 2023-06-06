<template>
  <el-dialog :visible.sync="visible"
             title="重命名码牌批次"
             width="500px"
             @close="$emit('update:show', false)"
             @open="openRenameInit">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="renameFormData"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onRenameSubmit">

      <el-form-item label="名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="renameFormData.name"
                  :class="$style.nameInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="请输入批次名称"
                  size="medium">
        </el-input>
      </el-form-item>

    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onRenameSubmit">
        确定
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import plateBatchApi from '@/common/api/platebatch-api';

const plateBatchListStore = createNamespacedHelpers('PLATE_BATCH_LIST_STORE');


export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    batch: {
      type: Object,
    },

  },

  data() {
    return {
      visible: this.show,
      renameFormData: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入批次名称', trigger: 'change'},
          {max: 50, message: '名称不能超过50个字符', trigger: 'change'},
        ],
      }
    }
  },


  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    ...plateBatchListStore.mapMutations(['renameBatch']),

    openRenameInit() {
      this.renameFormData.name = this.batch.name;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['nameBox'].select();
        this.$refs['theForm'].clearValidate();
      });
    },

    onRenameSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        return plateBatchApi.renamePlateBatch(this.batch.id, this.renameFormData).then((response) => {
          this.$message({
            type: 'success',
            message: `重命名成功。`,
            center: true
          });

          let batchId = this.batch.id;
          let name = this.renameFormData.name;
          this.renameBatch({batchId, name});
        });
      });
    },

    cancel() {
      this.visible = false;
    }

  },

}
</script>


<style lang="scss" module>
.nameInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


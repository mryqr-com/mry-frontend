<template>
  <div :class="$style.wrapper">
    <el-button :class="$style.addButton"
               icon="el-icon-plus"
               size="medium"
               title="新建码牌批次，码牌批次主要用于一次性提前生成大量码牌以备后用"
               type="primary"
               @click="showDialog">
      新建码牌批次
    </el-button>

    <el-dialog :visible.sync="dialogVisible"
               title="新建码牌批次"
               width="500px"
               @open="openInit">

      <el-form ref="theForm"
               :hide-required-asterisk="true"
               :model="addFormData"
               :rules="rules"
               label-position="top"
               @submit.native.prevent="onSubmit">

        <el-form-item label="批次名称：" prop="name">
          <el-input ref="nameBox"
                    v-model="addFormData.name"
                    :class="$style.nameInput"
                    :maxlength="50"
                    :spellcheck="false"
                    placeholder="请输入批次名称"
                    size="medium">
          </el-input>
        </el-form-item>

        <el-form-item label="所含码牌数量（10-200个之间）：" prop="total">
          <el-input-number v-model="addFormData.total"
                           :class="$style.numberInput"
                           :max="200"
                           :min="10"
                           :step="1"
                           controls-position="right"
                           size="medium">
          </el-input-number>
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
                   :disabled="apiInProgress"
                   icon="el-icon-plus"
                   size="medium"
                   type="primary"
                   @click="onSubmit">
          确定
        </el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-operation/platebatch/store/platebatch-list-actions';
import plateBatchApi from '@/common/api/platebatch-api';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const plateBatchListStore = createNamespacedHelpers('PLATE_BATCH_LIST_STORE');


export default {
  data() {
    return {
      dialogVisible: false,
      apiInProgress: false,
      addFormData: {
        name: null,
        total: 100
      },

      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {max: 50, message: '名称不能超过50个字符', trigger: 'change'},
        ],
      }
    }
  },

  methods: {
    ...plateBatchListStore.mapMutations([
      'resetPageIndex',
      'clearSearchTerm',
      'resetSorting',
    ]),

    ...plateBatchListStore.mapActions([ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES]),

    showDialog() {
      this.dialogVisible = true;
    },

    openInit() {
      this.addFormData.name = null;
      this.apiInProgress = false;
      this.addFormData.total = 100;
      this.$nextTick(() => {
        this.$refs['theForm'].clearValidate();
        this.$refs['nameBox'].focus();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        let command = {
          name: this.addFormData.name,
          total: this.addFormData.total,
          appId: this.currentAppId
        };

        this.apiInProgress = true;
        this.dialogVisible = false;

        return plateBatchApi.createPlateBatch(command).then((response) => {
          this.$message({
            type: 'success',
            message: `码牌批次【${command.name}】创建成功。`,
            center: true
          });

          this.resetPageIndex();
          this.clearSearchTerm();
          this.resetSorting();
          return this[ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES](this.currentAppId);
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    },

    cancel() {
      this.dialogVisible = false;
    }

  },

  computed: {
    ...appOperationStore.mapGetters(['currentAppId']),
  }

}
</script>


<style lang="scss" module>
.wrapper {
}

.addButton {
  width: $pageButtonWidth;
}

.nameInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

.numberInput {
  width: 100%;

  :global {
    .el-input__inner {
      text-align: left;
    }
  }
}

</style>

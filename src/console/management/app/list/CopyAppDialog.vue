<template>
  <el-dialog :visible.sync="visible"
             title="复制应用"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="formData"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item label="新应用名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="formData.name"
                  :class="$style.nameInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="如：设备管理系统"
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
                 :disabled="apiInProgress"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确定
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import {createNamespacedHelpers, mapMutations} from 'vuex';

import appApi from '@/common/api/app-api';

const appListStore = createNamespacedHelpers('APP_LIST_STORE');


export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    app: {
      type: Object,
    },
  },

  data() {
    return {
      visible: this.show,
      apiInProgress: false,
      formData: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入应用名称', trigger: 'change'},
          {max: 50, message: '应用名称不能超过50个字符', trigger: 'change'},
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
    ...mapMutations(['clearMyAppsCache']),

    init() {
      this.formData.name = `(复制)${this.app.name}`;
      this.apiInProgress = false;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['nameBox'].select();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        let command = {
          name: this.formData.name,
          sourceAppId: this.app.id,
        };

        this.apiInProgress = true;
        this.visible = false;

        return appApi.copyApp(command).then((response) => {
          this.$message({
            type: 'success',
            message: `应用复制成功。`,
            center: true
          });
          this.clearMyAppsCache();

          this.$router.push({
            name: 'app-edit-home',
            params: {appId: response.data.appId}
          });
        }).finally(() => {
          this.apiInProgress = false;
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
.wrapper {
}

.theInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


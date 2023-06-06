<template>
  <el-dialog :visible.sync="visible"
             title="新建应用"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="addFormData"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item label="应用名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="addFormData.name"
                  :class="$style.nameInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="如：设备管理系统"
                  size="medium">
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" :class="$style.footer">
      <el-button :class="$style.appTemplateButton" type="text" @click="gotoAppTemplatePage">应用模板库</el-button>

      <div :class="$style.buttonSection">
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
    </div>
  </el-dialog>
</template>

<script>
import {mapMutations} from 'vuex';

import appApi from '@/common/api/app-api';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      visible: this.show,
      apiInProgress: false,
      addFormData: {
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

    initDialog() {
      this.apiInProgress = false;
      this.addFormData.name = null;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    gotoAppTemplatePage() {
      this.$router.push({name: 'app-templates'});
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.apiInProgress = true;
        this.visible = false;
        return appApi.createApp(this.addFormData).then((response) => {
          this.clearMyAppsCache();
          this.$emit('appCreated', {appId: response.data.appId, name: this.addFormData.name});
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

.addButton {
  width: $pageButtonWidth;
}

.nameInput {
  width: 100%;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.appTemplateButton span {
  text-decoration: underline;
  font-weight: normal;
}

.buttonSection {
  flex-grow: 1;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

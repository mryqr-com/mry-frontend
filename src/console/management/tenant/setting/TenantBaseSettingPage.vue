<template>
  <div v-if="loaded" :class="$style.wrapper">
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item label="账户名称：" prop="name">
        <el-input v-model="theModel.name"
                  :class="$style.commonInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="如：XXX公司"
                  size="medium"
                  title="账户名称，账户名称将在多处显示，比如运营页面左上角、大屏设备下表单页面的左上角等处">
        </el-input>
      </el-form-item>
    </el-form>

    <template v-if="isSubdomainEffective">
      <div :class="$style.logoSetting">登录页面背景图片：</div>
      <SingleFileUploader v-model="theModel.loginBackground"
                          :class="$style.logoUploader"
                          :dnd="true"
                          :dndAreaHeight="40"
                          :imageOnly="true"
                          :ossRequest="tenantEditOssRequest"
                          dndAreaText="上传背景图片">
      </SingleFileUploader>
    </template>

    <el-button :class="$style.saveButton"
               icon="el-icon-check"
               size="medium"
               type="primary"
               @click="onSubmit">
      保存
    </el-button>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import tenantApi from '@/common/api/tenant-api';
import SingleFileUploader from '@/common/components/SingleFileUploader';

export default {
  data() {
    return {
      theModel: {
        name: null,
        loginBackground: null
      },

      loaded: false,
      rules: {
        name: [
          {required: true, message: '请输入账户名称', trigger: 'change'},
          {max: 50, message: '账户名称不能超过50个字符', trigger: 'change'},
        ],
      }
    }
  },

  components: {
    SingleFileUploader,
  },

  created() {
    return tenantApi.fetchTenantBaseSetting().then((response) => {
      let theSetting = response.data;
      this.theModel.name = theSetting.name;
      this.theModel.loginBackground = theSetting.loginBackground;
      this.loaded = true;
    });
  },

  computed: {
    ...mapGetters(['tenantId', 'isSubdomainEffective']),

    tenantEditOssRequest() {
      return {
        type: 'TENANT_EDIT',
        tenantId: this.tenantId
      }
    },
  },

  methods: {
    ...mapMutations(['updateTenantName']),

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        return tenantApi.updateTenantBaseSetting(this.theModel).then(() => {
          this.updateTenantName(this.theModel.name);
          this.$message({
            type: 'success',
            message: `账户基本设置更新成功。`,
            center: true
          });
        });
      });
    },
  },
}
</script>


<style lang="scss" module>
.wrapper {
}

.commonInput {
  width: 300px;
}

.logoSetting {
  margin-top: 30px;
  margin-bottom: 5px;
}

.logoUploader {
  width: 300px;
  margin-bottom: 5px;
}

.saveButton {
  margin-top: 24px;
  width: $pageButtonWidth;
}

</style>

<template>
  <div :class="$style.wrapper">
    <div v-if="!isCustomLogoAllowed" :class="$style.planWarning">
      <el-alert :closable="false"
                effect="dark"
                type="warning">
                <span slot="title">{{ planWarningText }}
                    <router-link :class="$style.purchaseLink" :to="{name:'purchase-packages'}">
                        前往套餐购买页面<i class="el-icon-right"></i>
                    </router-link>
                </span>
      </el-alert>
    </div>

    <template v-if="isCustomLogoAllowed && loaded">
      <div :class="$style.editSection">
        <div :class="$style.logoSettingText">账户Logo：</div>
        <SingleFileUploader v-model="theModel.logo"
                            :class="$style.logoUploader"
                            :dnd="true"
                            :dndAreaHeight="40"
                            :imageOnly="true"
                            :ossRequest="tenantEditOssRequest"
                            dndAreaText="上传Logo图片"
                            title="上传账户Logo图片/图标">
        </SingleFileUploader>

        <el-button :class="$style.saveButton"
                   icon="el-icon-check"
                   size="medium"
                   type="primary"
                   @click="onSubmit">
          保存
        </el-button>
      </div>
    </template>
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
        logo: null,
      },
      loaded: false,
    }
  },

  components: {
    SingleFileUploader,
  },

  created() {
    if (!this.isCustomLogoAllowed) {
      return;
    }

    return tenantApi.fetchTenantLogo().then((response) => {
      let data = response.data;
      this.theModel.logo = data.logo;
      this.loaded = true;
    });
  },

  methods: {
    ...mapMutations(['updateTenantLogo']),

    onSubmit() {
      return tenantApi.updateTenantLogo(this.theModel).then(() => {
        this.updateTenantLogo(this.theModel.logo);
        this.$message({
          type: 'success',
          message: `Logo更新成功。`,
          center: true
        });
      });
    },
  },

  computed: {
    ...mapGetters([
      'tenantId',
      'currentPlanName',
      'isCurrentPlanExpired',
      'isCustomLogoAllowed',
    ]),

    planWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法编辑Logo，如需编辑请续费或升级。`;
      }

      return `您当前是${this.currentPlanName}套餐，无法编辑Logo，如需编辑请升级。`
    },

    tenantEditOssRequest() {
      return {
        type: 'TENANT_EDIT',
        tenantId: this.tenantId
      }
    },

  }

}
</script>


<style lang="scss" module>
.wrapper {
}

.planWarning {
  margin-bottom: 15px;
}

.purchaseLink {
  color: white;
  text-decoration: underline;
}

.purchaseLink:visited {
  color: white;
}

.editSection {
  margin-top: 10px;
}

.logoSettingText {
  margin-bottom: 8px;
}

.logoUploader {
  width: 300px;
}

.saveButton {
  margin-top: 30px;
  width: $pageButtonWidth;
}

</style>

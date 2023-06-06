<template>
  <div :class="$style.wrapper">
    <div v-if="!isDeveloperAllowed" :class="$style.planWarning">
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

    <div v-if="isDeveloperAllowed && loaded" :class="$style.mainContent">
      <div :class="$style.sectionTitle">API集成</div>

      <div :class="$style.apiRow">
        <div :class="$style.apiRowTitle">API Key：</div>
        <div :class="$style.apiRowValue">{{ apiSetting.apiKey }}</div>
      </div>

      <div :class="$style.apiRow">
        <div :class="$style.apiRowTitle">API Secret：</div>
        <div :class="$style.apiRowValue">
          {{ displayedApiSecret }}
          <el-button :class="$style.toggleApiSecretButton"
                     type="text"
                     @click="toggleApiSecretView">
            {{ toggleApiSecretButtonText }}
          </el-button>
        </div>
      </div>

      <el-button :class="$style.refreshApiSecretButton"
                 icon="el-icon-refresh"
                 size="medium"
                 type="primary"
                 @click="refreshApiSecret">
        重新生成API Secret
      </el-button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import tenantApi from '@/common/api/tenant-api';

export default {
  data() {
    return {
      loaded: false,
      apiSetting: {},
      apiSecretViewable: false,
    }
  },

  created() {
    if (!this.isDeveloperAllowed) {
      return;
    }

    return tenantApi.fetchTenantApiSetting().then((response) => {
      this.apiSetting = response.data.apiSetting;
      this.loaded = true;
    });
  },

  methods: {
    toggleApiSecretView() {
      this.apiSecretViewable = !this.apiSecretViewable;
    },

    refreshApiSecret() {
      return this.$confirm(`重新生成后，先前的API Secret将自动失效，确认重新生成？`, '提示', {
        confirmButtonText: '是的，重新生成',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return tenantApi.refreshTenantApiSecret().then((response) => {
          this.apiSetting.apiSecret = response.data.secret;
          this.apiSecretViewable = true;
          this.$message({
            type: 'success',
            message: `重新生成API Secret成功。`,
            center: true
          });
        });
      });
    },
  },

  computed: {
    ...mapGetters([
      'currentPlanName',
      'isCurrentPlanExpired',
      'isDeveloperAllowed',
    ]),

    planWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法使用API集成功能，如需启用请续费或升级。`;
      }

      return `您当前是${this.currentPlanName}套餐，无法使用API集成功能，如需启用请升级。`
    },

    displayedApiSecret() {
      return this.apiSecretViewable ? this.apiSetting.apiSecret : '* * * * * * * * * * * * * * * * * * * *';
    },

    toggleApiSecretButtonText() {
      return this.apiSecretViewable ? '隐藏' : '显示';
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

.mainContent {
  max-width: 800px;
}

.sectionTitle {
  margin-top: 10px;
  font-size: 20px;
  font-weight: 500;
  padding-bottom: 5px;
  border-bottom: 1px solid $placeholderTextColor;
  margin-bottom: 20px;
}

.apiRow {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.apiRowTitle {
  flex-basis: 100px;
  text-align: left;
  margin-right: 10px;
}

.apiRowValue {
  flex-grow: 1;
  display: flex;
  align-items: center;
  color: $primaryTextColor;
}

.toggleApiSecretButton {
  margin-left: 15px;
  padding: 0;
}

.refreshApiSecretButton {
  margin-bottom: 36px;
  min-width: 180px;
}

</style>

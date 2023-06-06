<template>
  <div v-if="infoFetched" :class="$style.wrapper">
    <div v-if="info.isPackagesExpired" :class="$style.planWarning">
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
    <div :class="$style.row">
      <div :class="$style.title">账户名称：</div>
      <div :class="$style.infoValue">{{ info.name }}</div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">账户编号：</div>
      <div :class="$style.infoValue">{{ info.tenantId }}</div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">创建时间：</div>
      <div :class="$style.infoValue">{{ formatEpochToDate(info.createdAt) }}</div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">创建人：</div>
      <div :class="$style.infoValue">{{ info.creator }}</div>
    </div>

    <!--free-version-->
    <!--    <div :class="$style.row">-->
    <!--      <div :class="$style.title">当前套餐：</div>-->
    <!--      <div :class="$style.infoValue">-->
    <!--        {{ info.packagesName }}-->
    <!--        <span>（应用{{ info.planMaxAppCount }}个；成员{{ info.planMaxMemberCount }}名；存储空间{{ storageText }}）</span>-->
    <!--        <el-button :class="$style.textButton"-->
    <!--                   size="small"-->
    <!--                   type="text"-->
    <!--                   @click="gotoPurchasePage">-->
    <!--          前往套餐购买页面-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--free-version-->
    <!--    <div v-if="info.planType!=='FREE'" :class="$style.row">-->
    <!--      <div :class="$style.title">套餐过期时间：</div>-->
    <!--      <div :class="$style.infoValue">{{ formatEpochToDate(info.packagesExpireAt) }}-->
    <!--      </div>-->
    <!--    </div>-->

    <div v-if="info.extraMemberCount" :class="$style.row">
      <div :class="$style.title">已增购成员：</div>
      <div :class="$style.infoValue">{{ info.extraMemberCount }}名</div>
    </div>

    <div v-if="info.extraStorage" :class="$style.row">
      <div :class="$style.title">已增购存储空间：</div>
      <div :class="$style.infoValue">{{ info.extraStorage }}G</div>
    </div>

    <div v-if="info.extraRemainSmsCount" :class="$style.row">
      <div :class="$style.title">剩余增购短信量：</div>
      <div :class="$style.infoValue">{{ info.extraRemainSmsCount }}条</div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">应用额度<span :class="$style.supportText">（已使用/总量）</span>：</div>
      <div :class="[$style.infoValue,{[$style.warningText]: info.usedAppCount > info.effectiveMaxAppCount}]">
        {{ info.usedAppCount }}个 / {{ info.effectiveMaxAppCount }}个
      </div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">实例额度<span :class="$style.supportText">（已使用/总量）</span>：</div>
      <div
          :class="[$style.infoValue,{[$style.warningText]: info.usedQrCount > info.effectiveMaxQrCount}]">
        {{ info.usedQrCount }}个 / {{ info.effectiveMaxQrCount }}个
      </div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">提交量额度<span :class="$style.supportText">（已使用/总量）</span>：</div>
      <div
          :class="[$style.infoValue,{[$style.warningText]: info.usedSubmissionCount > info.effectiveMaxSubmissionCount}]">
        {{ info.usedSubmissionCount }}份 / {{ info.effectiveMaxSubmissionCount }}份
      </div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">成员额度<span :class="$style.supportText">（已使用/总量）</span>：</div>
      <div :class="[$style.infoValue,{[$style.warningText]: info.usedMemberCount > info.effectiveMaxMemberCount}]">
        {{ info.usedMemberCount }}名 / {{ info.effectiveMaxMemberCount }}名
      </div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">存储空间额度<span :class="$style.supportText">（已使用/总量）</span>：</div>
      <div :class="[$style.infoValue,{[$style.warningText]: info.usedStorage > info.effectiveMaxStorage}]">
        {{ info.usedStorage }}G / {{ info.effectiveMaxStorage }}G
      </div>
    </div>

    <div :class="$style.row">
      <div :class="$style.title">本月短信额度<span :class="$style.supportText">（已使用/剩余可用）</span>：</div>
      <div :class="[$style.infoValue]">
        {{ info.usedSmsCountForCurrentMonth }}条 / {{ remainSmsCountForCurrentMonth }}条
      </div>
    </div>

    <div :class="$style.row">
      <el-button :class="$style.textButton"
                 size="small"
                 type="text"
                 @click="gotoPurchasePage">
        免费调整额度
      </el-button>
    </div>

  </div>
</template>

<script>
import tenantApi from "@/common/api/tenant-api";
import {formatEpochToDate} from "@/common/utils/common-utils";

export default {
  data() {
    return {
      infoFetched: false,
      info: {}
    }
  },

  created() {
    return tenantApi.fetchTenantInfo().then((response) => {
      this.infoFetched = true;
      this.info = response.data;
    });
  },

  computed: {
    planWarningText() {
      return `您当前的${this.info.packagesName}套餐已过期，为不影响正常使用，请及时续费或升级。`;
    },

    storageText() {
      return this.info.planMaxStorage < 1 ? this.info.planMaxStorage * 1000 + 'M' : this.info.planMaxStorage + 'G';
    },

    remainSmsCountForCurrentMonth() {
      if (this.info.usedSmsCountForCurrentMonth < this.info.effectiveMaxSmsCountPerMonth) {
        return this.info.effectiveMaxSmsCountPerMonth - this.info.usedSmsCountForCurrentMonth + this.info.extraRemainSmsCount;
      }

      return this.info.extraRemainSmsCount;
    },

  },

  methods: {
    formatEpochToDate: formatEpochToDate,

    gotoPurchasePage() {
      this.$router.push({name: 'purchase-packages'});
    }
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


.row {
  display: flex;
  height: 36px;
  align-items: center;
}

.title {
  margin-right: 8px;
}

.infoValue {
  flex-grow: 1;
  color: $primaryTextColor;
}

.textButton {
  padding: 0;
  font-size: 14px;
  font-weight: normal;
  text-decoration: underline;
}

.warningText {
  color: $warningYellow;
}

.supportText {
  color: $secondaryTextColor;
  font-size: 13px;
}


</style>

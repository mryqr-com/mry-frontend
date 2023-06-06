<template>
  <div :class="$style.wrapper">
    <main v-if="bindPlateInfo" :class="$style.page">
      <div :class="$style.appName">{{ bindPlateInfo.appName }}</div>
      <div :class="$style.headerSection">
        <div :class="$style.theTitle">绑定码牌</div>
        <div :class="$style.thePlate">({{ bindPlateInfo.plateId }})</div>
      </div>

      <el-form ref="theForm"
               :hide-required-asterisk="true"
               :model="theModel"
               :rules="rules"
               label-position="top"
               @submit.native.prevent>
        <el-form-item :label="`${bindPlateInfo.instanceDesignation}名称`" prop="name">
          <el-input ref="qr-name"
                    v-model="theModel.name"
                    :maxlength="50"
                    :placeholder="`请输入${bindPlateInfo.instanceDesignation}名称`"
                    :spellcheck="false">
          </el-input>
        </el-form-item>

        <el-form-item ref="group-item" :label="`${bindPlateInfo.groupDesignation}`" prop="groupId">
          <ClientDropdown v-model="theModel.groupId"
                          :options="groupReferences"
                          :placeholder="`请选择${bindPlateInfo.groupDesignation}`"
                          key-field="id"
                          label-field="name"
                          value-field="id"
                          @change="onGroupChange">
          </ClientDropdown>
        </el-form-item>

        <div :class="$style.buttonArea">
          <el-button :class="$style.aButton"
                     :disabled="apiInProgress"
                     icon="el-icon-check"
                     type="primary"
                     @click="onSubmit">
            绑定
          </el-button>
        </div>
      </el-form>
    </main>
  </div>
</template>

<script>
import qrApi from '@/common/api/qr-api';

export default {
  props: ['plateId'],

  data() {
    return {
      bindPlateInfo: null,
      groupReferences: [],
      apiInProgress: false,
      theModel: null,
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {max: 50, message: '名称长度不能超过50个字符', trigger: 'change'},
        ],
        groupId: [
          {required: true, message: `请选择`, trigger: 'change'},
        ],
      }
    }
  },

  created() {
    return qrApi.fetchBindQrPlateInfo(this.plateId).then(response => {
      this.bindPlateInfo = response.data;
      let groupReferences = Array.from(new Map(Object.entries(this.bindPlateInfo.selectableGroups)), ([name, value]) => ({
        id: name,
        name: value
      }));

      groupReferences.sort((o1, o2) => o1.name.localeCompare(o2.name, 'zh-CN'));
      this.groupReferences = groupReferences;
      this.theModel = {
        name: null,
        groupId: this.groupReferences.length === 1 ? this.groupReferences[0].id : null,
        plateId: this.bindPlateInfo.plateId,
      }

      document.title = `绑定码牌 - ${this.bindPlateInfo.appName}`;
      this.$nextTick(() => {
        this.$refs['qr-name'].focus();
      });
    });
  },

  methods: {
    onGroupChange() {
      this.$refs['theForm'].validateField('group-item');
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.apiInProgress = true;
        return qrApi.createQrFromPlate(this.theModel).then(() => {
          this.$message({
            type: 'success',
            duration: 1000,
            message: `绑定成功。`,
            center: true
          });
          this.$router.replace({
            name: "new-submission",
            params: {plateId: this.theModel.plateId, pageId: this.bindPlateInfo.homePageId}
          });
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    }
  }
};
</script>

<style lang="scss" module>
.wrapper {
  background-size: cover;
  background-position: center;
  height: 100%;
  background-color: white;
}

.page {
  height: 100%;
  max-width: 650px;
  margin-right: auto;
  margin-left: auto;
  z-index: $clientPageZIndex;
  position: relative;
  box-shadow: $pageShadow;
  background-color: white;
  padding: 10px;

  :global {
    .el-form-item__label {
      margin-top: 10px;
      line-height: normal;
      font-weight: 500;
      padding-bottom: 5px !important;
    }

    .is-error {
      select {
        border-color: red;
      }
    }
  }
}

.appName {
  color: $secondaryTextColor;
}

.headerSection {
  padding-top: 40px;
  padding-bottom: 40px;
}

.theTitle {
  font-size: 18px;
  font-weight: 500;
  padding-bottom: 8px;
  text-align: center;
  color: $primaryTextColor;
}

.thePlate {
  color: $placeholderTextColor;
  text-align: center;
  font-size: 12px;
}

.buttonArea {
  padding-top: 30px;
  padding-bottom: 50px;
  text-align: center;
}

.aButton {
  width: 100%;
}

@media (min-width: $mobileScreenBreakpoint) {
  .wrapper {
    background-image: linear-gradient(white, #b9e3ff);
  }

  .page {
    height: auto;
    margin-top: 50px;
    padding: 25px;
  }

  .aButton {
    width: 50%;
  }

}

</style>

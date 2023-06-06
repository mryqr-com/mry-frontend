<template>
  <div :class="$style.wrapper">
    <div :class="$style.mainContent">
      <div :class="$style.sectionTitle">
        流转状态设置
        <HelpDocLinker class="baseLineAlign" url="//docs.mryqr.com/app-design/circulation-setting"></HelpDocLinker>
      </div>
      <div :class="$style.optionSettingContainer">
        <ColoredOptionSelector v-model="localSetting.options"
                               :max="10"
                               :min="0"
                               buttonText="添加状态"
                               class="marginBottom40"
                               selectorTitle="设置状态"
                               title="设置流转状态选项"
                               @optionDeleted="onOptionDeleted">
        </ColoredOptionSelector>

        <EditTitle>初始状态（可选）</EditTitle>
        <el-select v-model="localSetting.initOptionId"
                   :class="$style.initOption"
                   :placeholder="`表示新增${instanceDesignation}时自动设置为该状态`"
                   class="marginBottom20"
                   clearable
                   size="medium">
          <el-option v-for="option in localSetting.options"
                     :key="option.id"
                     :label="option.name"
                     :value="option.id">
          </el-option>
        </el-select>
      </div>

      <EditTitle>页面提交后状态</EditTitle>
      <div v-for="item in localSetting.statusAfterSubmissions" class="marginBottom10">
        当提交
        <el-select v-model="item.pageId"
                   class="width200"
                   size="medium">
          <el-option v-for="page in allPageSummaries"
                     :key="page.id"
                     :label="page.name"
                     :value="page.id">
          </el-option>
        </el-select>
        页面后，将状态设置为
        <el-select v-model="item.optionId"
                   class="width200"
                   size="medium">
          <el-option v-for="option in localSetting.options"
                     :key="option.id"
                     :label="option.name"
                     :value="option.id">
          </el-option>
        </el-select>
        <i :class="$style.deleteButton"
           class="el-icon-close"
           title="删除"
           @click="deleteSubmission(item.id)">
        </i>
      </div>

      <PlainButton :class="$style.addButton"
                   :disabled="localSetting.statusAfterSubmissions.length >= 10"
                   class="marginBottom40"
                   @click="addSubmission">
        <i class="el-icon-plus"></i>&nbsp;新增设置项（{{ localSetting.statusAfterSubmissions.length }}/10）
      </PlainButton>

      <EditTitle>状态对应的禁止提交页面</EditTitle>
      <div v-for="item in localSetting.statusPermissions" class="marginBottom10">
        当状态为
        <el-select v-model="item.optionId"
                   class="width200"
                   size="medium">
          <el-option v-for="option in localSetting.options"
                     :key="option.id"
                     :label="option.name"
                     :value="option.id">
          </el-option>
        </el-select>
        时，禁止填写以下表单：
        <el-select v-model="item.notAllowedPageIds"
                   :class="$style.pageSelect"
                   :multiple="true"
                   :multiple-limit="20"
                   size="medium">
          <el-option v-for="page in allPageSummaries"
                     :key="page.id"
                     :label="page.name"
                     :value="page.id">
          </el-option>
        </el-select>
        <i :class="$style.deleteButton"
           class="el-icon-close"
           title="删除"
           @click="deletePermission(item.id)">
        </i>
      </div>

      <PlainButton :class="$style.addButton"
                   :disabled="localSetting.statusPermissions.length >= 10"
                   @click="addPermission">
        <i class="el-icon-plus"></i>&nbsp;新增设置项（{{ localSetting.statusPermissions.length }}/10）
      </PlainButton>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {cloneDeep, isEqual} from 'lodash-es';
import ACTIONS from "@/console/app-edit/store/app-edit-actions";
import ColoredOptionSelector from '@/console/app-edit/components/ColoredOptionSelector'
import uuid from 'short-uuid';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    ColoredOptionSelector,
  },

  data() {
    return {
      localSetting: null
    }
  },

  created() {
    this.localSetting = cloneDeep(this.theSetting);
  },

  watch: {
    theSetting: {
      handler: function () {
        this.localSetting = cloneDeep(this.theSetting);
      },
      deep: true
    },

    localSetting: {
      handler: function () {
        if (!isEqual(this.localSetting, this.theSetting)) {
          this.theSetting = this.localSetting;
        }
      },
      deep: true
    }
  },

  computed: {
    ...appEditStore.mapGetters([
      'allPageSummaries',
      'appCirculationStatusSetting',
      'instanceDesignation'
    ]),

    theSetting: {
      get() {
        return this.appCirculationStatusSetting;
      },

      set(config) {
        this[ACTIONS.UPDATE_APP_CIRCULATION_SETTING](config);
      }
    },
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.UPDATE_APP_CIRCULATION_SETTING
    ]),

    onOptionDeleted(id) {
      if (id === this.localSetting.initOptionId) {
        this.localSetting.initOptionId = null;
      }

      this.localSetting.statusAfterSubmissions = this.localSetting.statusAfterSubmissions.filter(it => it.optionId !== id);
      this.localSetting.statusPermissions = this.localSetting.statusPermissions.filter(it => it.optionId !== id);
    },

    addSubmission() {
      this.localSetting.statusAfterSubmissions.push({
        id: uuid.generate(),
        pageId: null,
        optionId: null,
      });
    },

    deleteSubmission(id) {
      this.localSetting.statusAfterSubmissions.splice(this.localSetting.statusAfterSubmissions.findIndex(i => i.id === id), 1);
    },

    addPermission() {
      this.localSetting.statusPermissions.push({
        id: uuid.generate(),
        optionId: null,
        notAllowedPageIds: [],
      });
    },

    deletePermission(id) {
      this.localSetting.statusPermissions.splice(this.localSetting.statusPermissions.findIndex(i => i.id === id), 1);
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.mainContent {
  min-height: 100%;
  padding: 0 24px 24px;
  border: $primary1pxBorder;
  background-color: $whiteBackgroundColor;
}

.sectionTitle {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 500;
  padding-bottom: 5px;
  border-bottom: $secondary1pxBorder;
  max-width: 400px;
  margin-bottom: 20px;
}

.sectionTitle:first-child {
  margin-top: 30px;
}

.optionSettingContainer {
  width: 300px;
}

.initOption {
  width: 100%;
}

.deleteButton {
  cursor: pointer;
  margin-left: 10px;
  font-size: 16px;
}

.deleteButton:hover {
  color: $rejectRed;
}

.addButton {
  width: 300px;
}

.pageSelect {
  width: 400px;
}

</style>

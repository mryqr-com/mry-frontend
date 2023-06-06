<template>
  <div :class="$style.wrapper">
    <div :class="$style.mainContent">
      <div :class="$style.sectionTitle">
        基本设置
        <HelpDocLinker class="baseLineAlign" url="//docs.mryqr.com/app-design/app-setting"></HelpDocLinker>
      </div>
      <div :class="[$style.inputTitle,$style.firstInputTitle]">设置首页</div>
      <el-select v-model="localConfig.homePageId"
                 :class="$style.commonInput"
                 placeholder="请选择页面"
                 size="medium"
                 title="设置应用的首页页面，设置后，扫码时默认将打开该首页页面，另外，只有首页才能配置底部导航菜单">
        <el-option
            v-for="page in allPageSummaries"
            :key="page.id"
            :label="page.name"
            :value="page.id">
        </el-option>
      </el-select>

      <div :class="$style.inputTitle">应用图标</div>
      <SingleFileUploader v-model="localConfig.icon"
                          :class="$style.commonInput"
                          :dnd="true"
                          :dndAreaHeight="40"
                          :imageOnly="true"
                          :ossRequest="appEditOssRequest"
                          dndAreaText="上传图标"
                          title="应用图标，用于在'我的应用'页面显示">
      </SingleFileUploader>

      <div :class="$style.inputTitle">实例称号</div>
      <el-input v-model.trim="localConfig.instanceAlias"
                :class="$style.commonInput"
                :maxlength="5"
                :spellcheck="false"
                placeholder="比如：设备"
                size="medium"
                title="实例对应的称号，用于在系统中代替通用的'实例'或'二维码'字样，使系统界面使用起来更特定于具体的行业领域">
      </el-input>

      <div :class="$style.inputTitle">分组称号</div>
      <el-input v-model.trim="localConfig.groupAlias"
                :class="$style.commonInput"
                :maxlength="5"
                :spellcheck="false"
                size="medium"
                title="分组对应的称号，用于在系统中代替通用的'分组'字样，使系统界面使用起来更特定于具体的行业领域">
      </el-input>

      <div :class="$style.inputTitle">自定义编号称号</div>
      <el-input v-model.trim="localConfig.customIdAlias"
                :class="$style.commonInput"
                :maxlength="10"
                :spellcheck="false"
                size="medium"
                title="自定义编号的称号，用于在系统中代替通用的'自定义编号'字样，使系统界面使用起来更特定于具体的行业领域">
      </el-input>

      <div :class="$style.inputTitle">运营权限</div>
      <el-select v-model="localConfig.operationPermission"
                 :class="$style.commonInput"
                 placeholder="请选择权限"
                 size="medium"
                 title="进入应用的后台运营页面所需的权限，如果该权限小于应用本身的权限，那么系统将自动选择他们中的大者，也即即便拥有应用权限，但是运营权限不足依然无法进入后台运营页面">
        <el-option
            v-for="permissionType in operationPermissionTypes"
            :key="permissionType.type"
            :label="permissionType.text"
            :value="permissionType.type">
        </el-option>
      </el-select>

      <div :class="$style.inputTitle">应用运营着陆页</div>
      <el-select v-model="localConfig.landingPageType"
                 :class="$style.commonInput"
                 placeholder="请选择着陆页"
                 size="medium"
                 title="进入应用运营端所显示的着陆页，同时对电脑端和手机端有效">
        <el-option
            v-for="permissionType in appLandingPageTypes"
            :key="permissionType.type"
            :label="permissionType.text"
            :value="permissionType.type">
        </el-option>
      </el-select>

      <div :class="$style.sectionTitle">
        功能设置
        <HelpDocLinker class="baseLineAlign" url="//docs.mryqr.com/app-design/app-setting/#功能设置"></HelpDocLinker>
      </div>
      <div :title="`是否允许${instanceDesignation}重名`" class="marginBottom10">
        <el-checkbox v-model="localConfig.allowDuplicateInstanceName" size="mini">允许{{ instanceDesignation }}重名
        </el-checkbox>
      </div>

      <div
          :title="`启用定位功能后，可以为每个${instanceDesignation}进行定位，定位控件可以设置提交所在地点与${instanceDesignation}定位的偏移量限制，另外在${instanceDesignation}列表中还可以将最近的${instanceDesignation}显示在最前面`"
          class="marginBottom10">
        <el-checkbox v-model="localConfig.geolocationEnabled" size="mini">启用{{ instanceDesignation }}定位功能</el-checkbox>
      </div>

      <div class="marginBottom10"
           title="启用后，可以在运营端创建批量码牌，并可下载码牌文件以供印刷">
        <el-checkbox v-model="localConfig.plateBatchEnabled" size="mini">启用批量码牌功能</el-checkbox>
      </div>

      <div class="marginBottom10"
           title="启用后，可设置定期性任务，并指定任务责任人按时完成任务，管理人员可查看任务的执行情况">
        <el-checkbox v-model="localConfig.assignmentEnabled"
                     :disabled="!isAssignmentAllowed"
                     size="mini">
          启用任务管理功能
        </el-checkbox>
        <span v-if="!isAssignmentAllowed" :class="$style.assignmentWarningText">
            （{{ assignmentNotAllowedText }}
            <template v-if="isTenantAdmin">如需启用请前往
              <router-link :class="$style.packageWarningLink" :to="{name:'purchase-packages'}">
              套餐购买页面
            </router-link>
            完成套餐升级或续费。
          </template>
          <template v-else>
            如需启用请联系系统管理员完成套餐升级或续费。
          </template>
          ）
          </span>
      </div>

      <div :title="`启用后，可在${instanceDesignation}的基本信息编辑页面编辑简介文本`"
           class="marginBottom10">
        <el-checkbox v-model="localConfig.qrIntroductionEnabled" size="mini">启用{{
            instanceDesignation
          }}简介功能（启用后，可在{{ instanceDesignation }}的基本信息编辑页中编辑简介文本）
        </el-checkbox>
      </div>

      <div :title="`启用后，可在${instanceDesignation}的基本信息编辑页面手动编辑${instanceDesignation}的自定义编号，否则只能通过API的方式进行设置`"
           class="marginBottom10">
        <el-checkbox v-model="localConfig.qrCustomIdManualEditable" size="mini">启用{{
            instanceDesignation
          }}自定义编号手动编辑功能（启用后，可在{{ instanceDesignation }}的基本信息编辑页中设置自定义编号）
        </el-checkbox>
      </div>

      <div class="marginBottom40"
           title="启用后，可以在运营端编辑或查看应用的用户手册">
        <el-checkbox v-model="localConfig.appManualEnabled" size="mini">启用用户手册功能</el-checkbox>
      </div>

      <div :class="$style.sectionTitle">
        Webhook设置
        <HelpDocLinker class="baseLineAlign" url="//docs.mryqr.com/app-design/app-setting/#webhook设置"></HelpDocLinker>
      </div>
      <div :class="$style.webhookSection">

        <div v-if="!isDeveloperAllowed" :class="$style.textWarning">
          {{ webhookNotAllowedText }}
          <template v-if="isTenantAdmin">如需启用请前往
            <router-link :class="$style.packageWarningLink" :to="{name:'purchase-packages'}">
              套餐购买页面
            </router-link>
            完成套餐升级或续费。
          </template>
          <template v-else>
            如需启用请联系系统管理员完成套餐升级或续费。
          </template>
        </div>

        <div v-else-if="!webhookEnabled" :class="$style.textWarning">
          当前应用的Webhook配置未完成，无法启用，如需启用请前往
          <router-link :class="$style.packageWarningLink" :to="{name:'app-list'}">
            应用管理
          </router-link>
          页面完成该应用的Webhook集成配置操作。
        </div>

        <div v-else>
          <div :class="$style.inputTitle">需要发送Webhook的时机</div>
          <el-select ref="typesSelect"
                     v-model="localConfig.qrWebhookTypes"
                     :class="$style.commonInput"
                     :multiple="true"
                     class="settingMarginBottom block"
                     size="medium"
                     title="请选择需要发送Webhook的时机"
                     @change="collapseDropdown('typesSelect')">
            <el-option
                v-for="type in webhookTypes"
                :key="type.type"
                :label="type.text"
                :value="type.type">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import {cloneDeep, isEqual} from 'lodash-es';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import SingleFileUploader from '@/common/components/SingleFileUploader';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    SingleFileUploader,
  },

  data() {
    return {
      localConfig: null
    }
  },

  created() {
    this.localConfig = cloneDeep(this.theConfig);
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.UPDATE_APP_CONFIG
    ]),

    collapseDropdown(select) {
      let _this = this;
      setTimeout(function () {
        _this.$refs[select].blur();
      }, 50);
    },
  },

  watch: {
    theConfig: {
      handler: function () {
        this.localConfig = cloneDeep(this.theConfig);
      },
      deep: true
    },

    localConfig: {
      handler: function () {
        if (!isEqual(this.localConfig, this.theConfig)) {
          this.theConfig = this.localConfig;
        }
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters([
      'isDeveloperAllowed',
      'isTenantAdmin',
      'isCurrentPlanExpired',
      'currentPlanName',
      'isAssignmentAllowed',
    ]),

    ...appEditStore.mapGetters([
      'allPageSummaries',
      'appConfig',
      'webhookEnabled',
      'appEditOssRequest',
      'operationPermissions',
      'landingPageTypes',
      'instanceDesignation',
    ]),

    webhookNotAllowedText() {
      if (this.isCurrentPlanExpired) {
        return `您账户当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法启用Webhook功能；`;
      }

      return `您账户当前是${this.currentPlanName}套餐，无法启用Webhook功能；`
    },

    assignmentNotAllowedText() {
      if (this.isCurrentPlanExpired) {
        return `您账户当前的${this.currentPlanName}套餐已过期，无法启用任务管理功能；`;
      }

      return `您账户当前是${this.currentPlanName}套餐，无法启用任务管理功能；`
    },

    webhookTypes() {
      return [
        {
          type: 'ON_CREATE',
          text: `新增${this.instanceDesignation}时`
        },
        {
          type: 'ON_UPDATE',
          text: `更新${this.instanceDesignation}时`
        },
        {
          type: 'ON_DELETE',
          text: `删除${this.instanceDesignation}时`
        }
      ]
    },

    operationPermissionTypes() {
      return this.operationPermissions;
    },

    appLandingPageTypes() {
      return this.landingPageTypes;
    },

    theConfig: {
      get() {
        return this.appConfig;
      },

      set(config) {
        this[ACTIONS.UPDATE_APP_CONFIG](config)
      }
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

.inputTitle {
  margin-bottom: 5px;
  padding-left: 5px;
  border-left: 3px solid $primaryThemeColor;
}

.commonInput {
  width: 300px;
  margin-bottom: 30px;
}

.assignmentWarningText {
  font-size: 13px;
  font-style: italic;
}

.webhookSection {
  margin-bottom: 50px;
}

.textWarning {
  margin-top: 10px;
  font-style: italic;
  font-size: 13px;
  line-height: 1.6em;
}

.packageWarningLink {
  color: $primaryThemeColor;
  text-decoration: underline;
  cursor: pointer;
}

</style>

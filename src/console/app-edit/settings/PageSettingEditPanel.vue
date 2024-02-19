<template>
  <div v-if="localSetting" :class="$style.wrapper">
    <PanelContent helpUrl="//docs.mryqr.com/app-design/page-setting" title="页面设置">
      <el-collapse v-model="activeNames" :class="$style.settings">
        <el-collapse-item name="formSetting">
          <template slot="title">
            <CollapseTitle>基本设置</CollapseTitle>
          </template>

          <div class="keyValueSettingContainer">
            页面名称：
            <el-input v-model.trim="localSetting.pageName"
                      :class="{elementInputErrorBordered: $v.localSetting.pageName.$invalid }"
                      :maxlength="10"
                      :spellcheck="false"
                      class="width150"
                      size="mini"
                      title="页面名称">
            </el-input>
          </div>

          <div v-if="isCurrentPageFillable" class="keyValueSettingContainer">
            提交方式：
            <el-select :key="submitTypeKey"
                       v-model="localSetting.submitType"
                       :title="`页面表单的提交方式，'新建'表示每次提交均新增一条提交记录；'每成员对每${instanceDesignation}限一份提交'表示每个成员对每${instanceDesignation}最多只能有一份提交，后续提交将覆盖该成员的前次提交；'每${instanceDesignation}限一份提交'表示每个${instanceDesignation}最多只能有一份提交，后续提交将覆盖前次提交`"
                       class="width150"
                       size="mini"
                       @change="onSubmitTypeChange"
                       @visible-change="onSubmitTypeVisibleChange">
              <el-option v-for="submitType in submitTypes"
                         :key="submitType.type"
                         :label="submitType.text"
                         :value="submitType.type">
              </el-option>
            </el-select>
          </div>

          <div class="keyValueSettingContainer">
            {{ isCurrentPageFillable ? '提交权限：' : '查看权限：' }}
            <el-select v-model="localSetting.permission"
                       :title="isCurrentPageFillable ? '页面提交权限，只有具备权限者才能查看并提交表单' : '页面查看权限，只有具备权限者才能查看表单'"
                       class="width150"
                       size="mini">
              <el-option v-for="permissionType in pagePermissionTypes"
                         :key="permissionType.type"
                         :label="permissionType.text"
                         :value="permissionType.type">
              </el-option>
            </el-select>
          </div>

          <div v-if="isCurrentPageFillable" class="keyValueSettingContainer">
            修改权限：
            <el-select v-model="localSetting.modifyPermission"
                       class="width150"
                       size="mini"
                       title="修改表单所需的权限，拥有该权限者在任何时候均可对表单进行修改">
              <el-option v-for="permissionType in modifyPermissionTypes"
                         :key="permissionType.type"
                         :label="permissionType.text"
                         :value="permissionType.type">
              </el-option>
            </el-select>
          </div>

          <template v-if="isCurrentPageFillable && requireLogin">
            <el-checkbox v-model="localSetting.submitterUpdatable"
                         class="settingMarginBottom block"
                         size="mini"
                         title="允许提交人更新自己的提交">
              允许提交者提交后更新
            </el-checkbox>

            <div v-if="localSetting.submitterUpdatable" class="keyValueSettingContainer">
              更新期限：
              <el-select v-model="localSetting.submitterUpdateRange"
                         class="width150"
                         placeholder="请选择限制更新的时间范围"
                         size="mini"
                         title="允许提交人更新表单的时间范围">
                <el-option v-for="range in submitterUpdateRanges"
                           :key="range.type"
                           :label="range.text"
                           :value="range.type">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-collapse-item>

        <template v-if="isCurrentPageFillable">
          <el-collapse-item name="approvalSetting">
            <template slot="title">
              <CollapseTitle>审批设置</CollapseTitle>
            </template>

            <div v-if="!isSubmissionApprovalAllowed" :class="$style.textWarning">
              {{ submissionApprovalAllowedWarningText }}
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

            <template v-else>
              <el-checkbox v-model="localSetting.approvalSetting.approvalEnabled"
                           class="settingMarginBottom block"
                           size="mini"
                           title="启用审批">
                启用审批
              </el-checkbox>

              <template v-if="localSetting.approvalSetting.approvalEnabled">
                <div class="keyValueSettingContainer">
                  审批权限：
                  <el-select v-model="localSetting.approvalSetting.permission"
                             class="width150"
                             placeholder="请选择审批者所须权限"
                             size="mini"
                             title="审批者应该具有的权限">
                    <el-option v-for="permissionType in approvalPermissionTypes"
                               :key="permissionType.type"
                               :label="permissionType.text"
                               :value="permissionType.type">
                    </el-option>
                  </el-select>
                </div>

                <div class="keyValueSettingContainer">
                  通过文本：
                  <el-input v-model="localSetting.approvalSetting.passText"
                            :class="{elementInputErrorBordered: $v.localSetting.approvalSetting.passText.$invalid }"
                            :maxlength="10"
                            class="width150"
                            size="mini"
                            title="审批通过按钮的显示文本">
                  </el-input>
                </div>

                <div class="keyValueSettingContainer">
                  不通过文本：
                  <el-input v-model="localSetting.approvalSetting.notPassText"
                            :class="{elementInputErrorBordered: $v.localSetting.approvalSetting.notPassText.$invalid }"
                            :maxlength="10"
                            class="width150"
                            size="mini"
                            title="审批不通过按钮的显示文本">
                  </el-input>
                </div>
                <el-checkbox v-model="localSetting.approvalSetting.notifySubmitter"
                             class="settingMarginBottom block"
                             size="mini"
                             title="将审批结果通过邮件通知提交者">
                  将审批结果通知提交者
                </el-checkbox>
              </template>
            </template>
          </el-collapse-item>
        </template>

        <el-collapse-item name="displaySetting">
          <template slot="title">
            <CollapseTitle>显示设置</CollapseTitle>
          </template>

          <template v-if="isCurrentPageFillable">
            <div class="keyValueSettingContainer">
              提交动作名称：
              <el-input v-model="localSetting.actionName"
                        :maxlength="10"
                        :spellcheck="false"
                        class="width150"
                        size="mini"
                        title="提交表单的动作名称，主要用于提交历史控件等处，通常为'动词+名称'格式，比如对于维修记录类表单，提交动作名称可设置为'添加维修记录'；该项设置使提交历史控件的文本读起来更自然">
              </el-input>
            </div>

            <div class="keyValueSettingContainer">
              提交人称号：
              <el-input v-model="localSetting.submitterAlias"
                        :maxlength="5"
                        :spellcheck="false"
                        class="width150"
                        size="mini"
                        title="用于替换'提交人'字样，比如可以将设备巡检表单的提交人称号设置为'巡检人'，进而使系统页面阅读起来更贴近于实际的业务场景">
              </el-input>
            </div>

            <div class="keyValueSettingContainer">
              提交时间称号：
              <el-input v-model="localSetting.submitAtAlias"
                        :maxlength="5"
                        :spellcheck="false"
                        class="width150"
                        size="mini"
                        title="用于替换'提交时间'字样，比如可以将设备巡检表单的提交时间称号设置为'巡检时间'，进而使系统页面阅读起来更贴近于实际的业务场景">
              </el-input>
            </div>

            <el-checkbox v-model="localSetting.showAsterisk"
                         class="settingMarginBottom block"
                         size="mini"
                         title="为必填项显示红色星号标记">
              为必填项显示红色星号(<span :class="$style.redAsterisk">*</span>)标记
            </el-checkbox>
          </template>

          <el-checkbox v-model="localSetting.showControlIndex"
                       class="settingMarginBottom block"
                       size="mini"
                       title="为控件显示编号">
            为控件显示数字编号
          </el-checkbox>

          <el-checkbox v-if="tabletView" v-model="localSetting.hideTopBottomBlank"
                       class="settingMarginBottom block"
                       size="mini"
                       title="隐藏页面上下留白">
            隐藏页面上下留白
          </el-checkbox>

          <el-checkbox v-if="tabletView" v-model="localSetting.hideTopBar"
                       class="settingMarginBottom block"
                       size="mini"
                       title="隐藏页面顶部导航栏">
            隐藏顶部导航栏
          </el-checkbox>

          <el-checkbox v-model="localSetting.hideHeader"
                       class="settingMarginBottom block"
                       size="mini"
                       title="隐藏页眉">
            隐藏页眉
          </el-checkbox>

          <el-checkbox v-model="localSetting.hideTitle"
                       class="settingMarginBottom block"
                       size="mini"
                       title="隐藏页面标题">
            隐藏页面标题
          </el-checkbox>

          <el-checkbox v-if="isCurrentHomePage" v-model="localSetting.hideMenu"
                       class="settingMarginBottom block"
                       size="mini"
                       title="隐藏页面底部菜单">
            隐藏底部菜单
          </el-checkbox>

          <div v-if="tabletView" class="keyValueSettingContainer">
            页面最大宽度：
            <el-input-number v-model="localSetting.pageMaxWidth"
                             :max="2000"
                             :min="650"
                             :step="1"
                             :stepStrictly="true"
                             controls-position="right"
                             size="mini"
                             title="页面最大宽度">
            </el-input-number>
          </div>

          <div v-if="tabletView" class="keyValueSettingContainer">
            页面内容最大宽度：
            <el-input-number v-model="localSetting.contentMaxWidth"
                             :max="2000"
                             :min="650"
                             :step="1"
                             :stepStrictly="true"
                             controls-position="right"
                             size="mini"
                             title="页面内容最大宽度">
            </el-input-number>
          </div>

          <div class="keyValueSettingContainer">
            页面背景色：
            <MryColorPicker v-model="localSetting.pageBackgroundColor"
                            title="页面背景色">
            </MryColorPicker>
          </div>

          <template v-if="tabletView">
            <div class="singleLineTitle">页面边框</div>
            <BorderInput v-model="localSetting.border"
                         class="settingMarginBottom">
            </BorderInput>

            <div class="singleLineTitle">页边阴影</div>
            <ShadowInput v-model="localSetting.shadow"
                         class="settingMarginBottom">
            </ShadowInput>

            <div class="keyValueSettingContainer">
              整屏背景色：
              <MryColorPicker v-model="localSetting.viewPortBackgroundColor"
                              title="整个显示器屏幕的背景色">
              </MryColorPicker>
            </div>

            <div class="singleLineTitle">整屏背景图片</div>
            <SingleFileUploader v-model="localSetting.viewPortBackgroundImage"
                                :dnd="true"
                                :dndAreaHeight="36"
                                :imageOnly="true"
                                :ossRequest="appEditOssRequest"
                                class="settingMarginBottom"
                                dndAreaText="上传图片"
                                title="整个显示器屏幕的背景图片，背景图片将覆盖背景色">
            </SingleFileUploader>
          </template>

        </el-collapse-item>

        <el-collapse-item v-if="isCurrentPageFillable" ref="afterSubmitBehaviour" name="afterSubmitSetting">
          <template slot="title">
            <CollapseTitle>提交后页面</CollapseTitle>
          </template>
          <div class="singleLineTitle">提交后显示：</div>
          <el-select v-model="localSetting.afterSubmitBehaviour.type"
                     class="settingMarginBottom block"
                     placeholder="请选择提交后页面类型"
                     size="mini"
                     title="用于设置表单提交后所导向的页面，只对新建提交生效，更新或审批表单时固定为系统默认页面"
                     @change="onAfterSubmitBehaviourChanged">
            <el-option v-for="range in afterSubmitNavigationTypes"
                       :key="range.type"
                       :label="range.text"
                       :value="range.type">
            </el-option>
          </el-select>

          <template v-if="localSetting.afterSubmitBehaviour.type === 'INTERNAL_PAGE'">
            <div class="singleLineTitle">内部页面</div>
            <el-select v-model="localSetting.afterSubmitBehaviour.internalPageId"
                       class="settingMarginBottom block"
                       placeholder="请选择需要导向的内部页面"
                       size="mini"
                       title="设置提交后需要导向的内部页面">
              <el-option
                  v-for="page in allPageSummaries"
                  :key="page.id"
                  :label="page.name"
                  :value="page.id">
              </el-option>
            </el-select>
          </template>

          <template v-if="localSetting.afterSubmitBehaviour.type === 'EXTERNAL_URL'">
            <div class="singleLineTitle">外部页面网址</div>
            <el-input v-model="localSetting.afterSubmitBehaviour.externalUrl"
                      :maxLength="1024"
                      :spellcheck="false"
                      class="settingMarginBottom block"
                      placeholder="例如：https://www.mryqr.com"
                      size="small"
                      type="textarea">
            </el-input>
          </template>

          <template v-if="localSetting.afterSubmitBehaviour.type !== 'DEFAULT'">
            <el-checkbox v-model="localSetting.afterSubmitBehaviour.enableMessage"
                         class="settingMarginBottom block"
                         size="mini"
                         title="显示消息提示">
              显示消息提示
            </el-checkbox>

            <template v-if="localSetting.afterSubmitBehaviour.enableMessage">
              <div class="singleLineTitle">提示消息文本</div>
              <el-input v-model="localSetting.afterSubmitBehaviour.message"
                        :maxLength="100"
                        :spellcheck="false"
                        class="settingMarginBottom block"
                        placeholder="例如：提交成功！"
                        size="small"
                        type="textarea">
              </el-input>
            </template>
          </template>
        </el-collapse-item>

        <el-collapse-item v-if="isCurrentPageFillable"
                          ref="notificationSetting"
                          name="notificationSetting">
          <template slot="title">
            <CollapseTitle>提交后提醒</CollapseTitle>
          </template>

          <div v-if="!isSubmissionNotifyAllowed" :class="$style.textWarning">
            {{ planSubmissionNotifyWarningText }}
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

          <template v-else>
            <el-checkbox v-model="localSetting.notificationSetting.notificationEnabled"
                         class="settingMarginBottom block"
                         size="mini"
                         title="开启提醒功能后，指定人员可以收到表单提交或更新提醒的邮件">
              启用提交后提醒功能
            </el-checkbox>

            <template v-if="localSetting.notificationSetting.notificationEnabled">
              <div class="singleLineTitle">新建表单时提醒</div>
              <el-select ref="onCreateNotificationRolesSelect"
                         v-model="localSetting.notificationSetting.onCreateNotificationRoles"
                         :multiple="true"
                         class="settingMarginBottom block"
                         size="mini"
                         title="请选择新建表单时可以收到提醒的人员角色"
                         @change="collapseDropdown('onCreateNotificationRolesSelect')">
                <el-option
                    v-for="role in notificationRoles"
                    :key="role.type"
                    :label="role.text"
                    :value="role.type">
                </el-option>
              </el-select>

              <div class="singleLineTitle">更新表单时提醒</div>
              <el-select ref="onUpdateNotificationRolesSelect"
                         v-model="localSetting.notificationSetting.onUpdateNotificationRoles"
                         :multiple="true"
                         class="settingMarginBottom block"
                         size="mini"
                         title="请选择更新表单时可以收到提醒的人员角色"
                         @change="collapseDropdown('onUpdateNotificationRolesSelect')">
                <el-option
                    v-for="page in notificationRoles"
                    :key="page.type"
                    :label="page.text"
                    :value="page.type">
                </el-option>
              </el-select>
            </template>
          </template>
        </el-collapse-item>

        <el-collapse-item v-if="isCurrentPageFillable" ref="submissionWebhookSetting" name="submissionWebhookSetting">
          <template slot="title">
            <CollapseTitle>Webhook设置</CollapseTitle>
          </template>

          <div v-if="!isDeveloperAllowed" :class="$style.textWarning">
            {{ planWebhookWarningText }}
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
            当前应用的Webhook功能未启用，如需启用请前往
            <router-link :class="$style.packageWarningLink" :to="{name:'app-list'}">
              应用管理
            </router-link>
            页面完成该应用的Webhook集成配置操作。
          </div>
          <div v-else>
            <div class="singleLineTitle">需要发送Webhook的时机</div>
            <el-select ref="submissionWebhookTypesSelect"
                       v-model="localSetting.submissionWebhookTypes"
                       :multiple="true"
                       class="settingMarginBottom block"
                       size="mini"
                       title="请选择需要发送Webhook的时机"
                       @change="collapseDropdown('submissionWebhookTypesSelect')">
              <el-option
                  v-for="type in webhookTypes"
                  :key="type.type"
                  :label="type.text"
                  :value="type.type">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="!isCurrentHomePage" name="dangerousSetting">
          <template slot="title">
            <CollapseTitle>危险操作</CollapseTitle>
          </template>

          <PlainButton :class="$style.deleteButton"
                       :disabled="isCurrentHomePage"
                       title="删除后该页面对应的所有提交记录也将被自动删除"
                       @click="deleteCurrentPage">
            删除该页面
          </PlainButton>
        </el-collapse-item>
      </el-collapse>
    </PanelContent>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {cloneDeep, isEqual} from 'lodash-es';
import submitterUpdateRanges from '@/console/app-edit/settings/submitter-update-ranges';
import afterSubmitTypes from '@/console/app-edit/settings/after-submit-types';
import {required} from "vuelidate/lib/validators";
import SingleFileUploader from '@/common/components/SingleFileUploader';
import uuid from 'short-uuid';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    SingleFileUploader
  },

  data() {
    return {
      localSetting: null,
      activeNames: ['formSetting'],
      previousSubmitType: null,
      submitTypeKey: uuid.generate(),//解决checkbox无法更新的情况
    }
  },

  mounted() {
    this.localSetting = cloneDeep(this.theSetting);
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.UPDATE_PAGE_SETTING,
      ACTIONS.DELETE_CURRENT_PAGE
    ]),

    collapseDropdown(select) {
      let _this = this;
      setTimeout(function () {
        _this.$refs[select].blur();
      }, 50);
    },

    onSubmitTypeVisibleChange(show) {
      if (show) {
        this.previousSubmitType = this.localSetting.submitType;//暂时存储先前的type
      }
    },

    onSubmitTypeChange(type) {
      if (type === 'ONCE_PER_INSTANCE' || type === 'ONCE_PER_MEMBER') {
        this.$confirm(`提交方式设置为"${this.submitTypeTextOf(type)}"后，该页面的所有既有提交记录将被删除，是否继续？`, '提示', {
          confirmButtonText: '是的，继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //保证"每成员仅限一份提交"时，页面是需要登录的
          if (type === 'ONCE_PER_MEMBER' && this.localSetting.permission === 'PUBLIC') {
            this.localSetting.permission = 'AS_TENANT_MEMBER';
          }
        }).catch(_ => {
          this.localSetting.submitType = this.previousSubmitType;
        }).finally(() => {
          this.submitTypeKey = uuid.generate();
        });
      }
    },

    submitTypeTextOf(type) {
      return this.submitTypes.find(aType => {
        return aType.type === type;
      }).text;
    },

    onAfterSubmitBehaviourChanged() {
      this.localSetting.afterSubmitBehaviour.externalUrl = null;
      this.localSetting.afterSubmitBehaviour.internalPageId = null;

      let _this = this;
      setTimeout(function () {
        _this.$refs['afterSubmitBehaviour'].$el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }, 200);
    },

    deleteCurrentPage() {
      this.$confirm(`确认删除当前页面【${this.currentPageName}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this[ACTIONS.DELETE_CURRENT_PAGE]().then(() => {
          this.$message({
            type: 'success',
            message: `页面 【${this.currentPageName}】 删除成功。`,
            center: true
          });
          this.$router.replace({name: 'app-edit-home',});
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            duration: 5000,
            message: error.message ? error.message : error,
            center: true
          });
        });
      }).catch(_ => {
      });
    },
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
    },

    isCurrentPageFillable: {
      handler: function (val) {
        if (!val) {
          this.localSetting.submitType = 'NEW';
        }
      },
    },
  },

  computed: {
    ...mapGetters([
      'isDeveloperAllowed',
      'isTenantAdmin',
      'isCurrentPlanExpired',
      'currentPlanName',
      'isSubmissionNotifyAllowed',
      'isSubmissionApprovalAllowed',
    ]),

    ...appEditStore.mapGetters([
      'currentPage',
      'currentPageName',
      'appEditOssRequest',
      'isCurrentPageFillable',
      'isCurrentHomePage',
      'approvalPermissions',
      'modifyPermissions',
      'pagePermissions',
      'instanceDesignation',
      'groupDesignation',
      'allPageSummaries',
      'webhookEnabled',
    ]),

    ...appEditStore.mapState([
      'tabletView',
    ]),

    planWebhookWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您账户当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法启用Webhook功能。`;
      }

      return `您账户当前是${this.currentPlanName}套餐，无法启用Webhook功能。`
    },

    planSubmissionNotifyWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您账户当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法启用提交提醒功能。`;
      }

      return `您账户当前是${this.currentPlanName}套餐，无法启用提交提醒功能。`
    },

    submissionApprovalAllowedWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您账户当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法启用审批功能。`;
      }

      return `您账户当前是${this.currentPlanName}套餐，无法启用审批功能。`
    },

    requireLogin() {
      return this.localSetting.permission !== 'PUBLIC';
    },

    pagePermissionTypes() {
      if (this.localSetting.submitType === 'ONCE_PER_MEMBER') {//当为ONCE_PER_MEMBER提交类型时，必须保证成员是登录的
        return this.pagePermissions.filter(permission => {
          return permission.type !== 'PUBLIC';
        });
      }

      return this.pagePermissions;
    },

    approvalPermissionTypes() {
      return this.approvalPermissions;
    },

    modifyPermissionTypes() {
      return this.modifyPermissions;
    },

    submitterUpdateRanges() {
      return submitterUpdateRanges;
    },

    afterSubmitNavigationTypes() {
      return afterSubmitTypes;
    },

    submitTypes() {
      return [
        {
          type: 'NEW',
          text: '新建'
        },
        {
          type: 'ONCE_PER_INSTANCE',
          text: `每${this.instanceDesignation}限一份提交`
        },
        {
          type: 'ONCE_PER_MEMBER',
          text: `每成员对每${this.instanceDesignation}限一份提交`
        },
      ]
    },

    notificationRoles() {
      return [
        {
          type: 'APP_MANAGER',
          text: '应用管理员'
        },
        {
          type: 'GROUP_MANAGER',
          text: `${this.groupDesignation}管理员`
        },
        {
          type: 'SUBMITTER',
          text: `提交者本人`
        }
      ]
    },

    webhookTypes() {
      return [
        {
          type: 'ON_CREATE',
          text: '新建表单时'
        },
        {
          type: 'ON_UPDATE',
          text: '更新表单时'
        },
        {
          type: 'ON_APPROVAL',
          text: '审批表单时'
        },
        {
          type: 'ON_DELETE',
          text: '删除表单时'
        },
      ]
    },

    theSetting: {
      get() {
        return this.currentPage.setting;
      },

      set(setting) {
        this[ACTIONS.UPDATE_PAGE_SETTING](setting);
      }
    }
  },

  validations: {
    localSetting: {
      pageName: {
        required,
      },

      approvalSetting: {
        passText: {
          required
        },

        notPassText: {
          required
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.settings {
  margin-top: 15px;

  :global {
    .el-collapse-item__content {
      line-height: 1;
    }
  }
}

.redAsterisk {
  color: red;
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

.deleteButton {
  color: red !important;
}

</style>

<template>
  <el-dialog v-show="plateTemplates.length > 0"
             :append-to-body="true"
             :class="$style.wrapper"
             :visible.sync="visible"
             title="码牌模板库"
             top="60px"
             width="1200px"
             @close="$emit('update:show', false)"
             @open="init">

    <div :class="$style.contentContainer">
      <el-row :class="$style.contentRow" :gutter="16">
        <el-col v-for="(plateTemplate,index) in plateTemplates"
                :key="index"
                :class="$style.templateCol"
                :span="6">
          <div :class="$style.templateCardContainer">
            <div :class="$style.templateCard">
              <el-dropdown v-if="isMryAppTemplateManageTenant"
                           :class="$style.dropDown"
                           trigger="click"
                           @command="handleCommand">
                <el-button :class="$style.qrDropdownButton" type="text">...</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{command:'editTemplate',parameters:{plateTemplate}}">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item :command="{command:'deleteTemplate',parameters:{plateTemplate}}">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <img v-if="plateTemplate.image"
                   :class="$style.templateImage"
                   :src="plateTemplate.image.fileUrl"
                   alt="图片"/>

              <div v-else :class="$style.plateWrapper">
                <Plate :class="$style.plate"
                       :plate-setting="plateTemplate.plateSetting"
                       :qr="fakeQr"
                       :scale="scaleFor(plateTemplate)">
                </Plate>
              </div>
            </div>
            <div :class="$style.buttonContainer">
              <div :class="$style.sizeText">尺寸：{{ sizeTextOf(plateTemplate) }}</div>
              <el-button :class="$style.applyButton"
                         size="medium"
                         @click="applyTemplate(plateTemplate)">
                使用
              </el-button>
            </div>
            <div v-if="isMryAppTemplateManageTenant" :class="$style.orderRow">顺序：{{ plateTemplate.order }}</div>
          </div>
        </el-col>
      </el-row>

      <UpdatePlateTemplateDialog :plateTemplate="currentPlateTemplate"
                                 :show.sync="editDialogVisible">
      </UpdatePlateTemplateDialog>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from "vuex";
import {cloneDeep} from 'lodash-es';
import plateTemplateApi from '@/common/api/plate-template-api';
import eventBus from '@/common/utils/event-bus';
import Plate from '@/common/components/plate/Plate';
import plateSizeTypes from '@/common/utils/plate-size-types';
import avatarPlaceholder from '@/common/static/avatar-placeholder-dark.svg';
import UpdatePlateTemplateDialog from '@/console/app-edit/plate/UpdatePlateTemplateDialog';
import {plateFakeQrUrl} from "@/common/utils/common-utils";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },

  components: {
    Plate,
    UpdatePlateTemplateDialog,
  },

  data() {
    return {
      visible: this.show,
      editDialogVisible: false,
      currentPlateTemplate: null,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...mapGetters(['isMryAppTemplateManageTenant']),
    ...appEditStore.mapGetters(['plateTemplates']),

    fakeQr() {
      return {
        appName: '设备管理系统',
        tenantName: '小码科技有限公司',
        id: 'QRC291891375580906496',
        name: '1号数控机床',
        headerImageUrl: avatarPlaceholder,
        groupName: '一车间',
        customId: 'SYSK-001',
        plateId: 'MRY291891375580906497',
        url: plateFakeQrUrl(),
        attributes: {},
      }
    }
  },

  methods: {
    ...appEditStore.mapMutations([
      'applyPlateTemplate',
      'setPlateTemplates',
      'deletePlateTemplate',
    ]),

    init() {
      if (this.plateTemplates.length === 0) {
        return plateTemplateApi.listPlateTemplates().then(response => {
          this.setPlateTemplates(response.data);
        });
      }
    },

    applyTemplate(template) {
      this.applyPlateTemplate(cloneDeep(template));
      this.$message({
        type: 'success',
        message: `成功应用码牌模板。`,
        center: true
      });
      eventBus.$emit('plateTemplateApplied');
      this.visible = false;
    },

    sizeTextOf(template) {
      return plateSizeTypes.find(aSize => aSize.key === template.plateSetting.config.size).name;
    },


    handleCommand(command) {
      return this[command.command](command.parameters);
    },

    editTemplate({plateTemplate}) {
      this.currentPlateTemplate = plateTemplate;
      this.editDialogVisible = true;
    },

    deleteTemplate({plateTemplate}) {
      return this.$confirm(`确认删除该模板？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return plateTemplateApi.deletePlateTemplate(plateTemplate.id).then(() => {
          this.deletePlateTemplate(plateTemplate);
          this.$message({
            type: 'success',
            message: `成功从码牌模板库删除。`,
            center: true
          });
        });
      });
    },

    scaleFor(template) {
      let cardHeight = 230;//card的宽度其实是270，设置小一点是为了挤出空白边框
      let cardWidth = 230;
      let widthScale = cardWidth / template.plateSetting.config.width;
      let heightScale = cardHeight / template.plateSetting.config.height;
      return Math.min(widthScale, heightScale);
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-dialog__body {
      padding-bottom: 20px;
      height: calc(100vh - 60px - 60px - 54px);
    }
  }
}

.contentContainer {
  background-color: $primaryBackgroundColor;
  height: 100%;
  overflow: auto;
}

.contentRow {
  margin-top: 16px;
  width: 1144px;
  margin-left: 8px !important;
  margin-right: 8px !important;
}

.templateCol {
  margin-bottom: 16px;
}

.templateCardContainer {
  box-shadow: $primaryShadow;
  background-color: white;
}

.templateCard {
  height: 270px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.templateCard:hover .dropDown {
  display: block;
}

.dropDown {
  display: none;
  position: absolute;
  top: 0;
  right: 15px;
  z-index: 100;
}

.qrDropdownButton {
  font-size: 18px;
  font-weight: 500;
}

.templateImage {
  max-width: 230px;
  max-height: 230px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
}

.plateWrapper {
}

.plate {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
}

.buttonContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-top: $primary1pxBorder;
}

.applyButton {
  width: 90px;
}

.sizeText {
  font-size: 13px;
}

.orderRow {
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
}

</style>

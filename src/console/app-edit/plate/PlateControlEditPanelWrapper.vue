<template>
  <div v-if="currentPlateControl" :class="$style.wrapper">
    <PanelContent :helpUrl="controlHelpDocLinks[theControl.type]" :title="controlTypeName">
      <component :is="theControl.type" v-model="theLocal"/>

      <el-collapse v-model="activeName" :class="$style.settingCollapse">
        <el-collapse-item name="commonSetting">
          <template slot="title">
            <CollapseTitle>控件样式</CollapseTitle>
          </template>

          <div class="singleLineTitle" title="边框设置">边框</div>
          <BorderInput v-model="theLocal.border"
                       class="settingMarginBottom">
          </BorderInput>

          <div class="singleLineTitle" title="圆角">圆角</div>
          <BorderRadiusInput v-model="theLocal.borderRadius"
                             class="settingMarginBottom">
          </BorderRadiusInput>

          <div class="keyValueSettingContainer">
            背景色：
            <MryColorPicker v-model="theLocal.backgroundColor" title="控件背景色"></MryColorPicker>
          </div>

          <div class="keyValueSettingContainer">
            边距设置：
            <el-popover placement="bottom"
                        trigger="click"
                        width="300">
              <el-button slot="reference"
                         class="rightInputWidth"
                         size="mini"
                         title="边距设置"
                         type="plain">
                边距设置...
              </el-button>

              <div class="keyValueSettingContainer">
                顶部外边距：
                <el-input-number v-model="theLocal.marginTop"
                                 :max="500"
                                 :min="-500"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="顶部外边距">
                </el-input-number>
              </div>

              <div class="keyValueSettingContainer">
                底部外边距：
                <el-input-number v-model="theLocal.marginBottom"
                                 :max="500"
                                 :min="0"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="底部外边距">
                </el-input-number>
              </div>

              <div class="keyValueSettingContainer">
                左侧外边距：
                <el-input-number v-model="theLocal.marginLeft"
                                 :max="500"
                                 :min="0"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="左侧外边距">
                </el-input-number>
              </div>

              <div class="keyValueSettingContainer">
                右侧外边距：
                <el-input-number v-model="theLocal.marginRight"
                                 :max="500"
                                 :min="0"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="右侧外边距">
                </el-input-number>
              </div>

              <div class="keyValueSettingContainer">
                顶部内边距：
                <el-input-number v-model="theLocal.paddingTop"
                                 :max="500"
                                 :min="0"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="顶部内边距">
                </el-input-number>
              </div>

              <div class="keyValueSettingContainer">
                底部内边距：
                <el-input-number v-model="theLocal.paddingBottom"
                                 :max="500"
                                 :min="0"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="底部内边距">
                </el-input-number>
              </div>

              <div class="keyValueSettingContainer">
                左侧内边距：
                <el-input-number v-model="theLocal.paddingLeft"
                                 :max="500"
                                 :min="0"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="左侧内边距">
                </el-input-number>
              </div>

              <div class="keyValueSettingContainer">
                右侧内边距：
                <el-input-number v-model="theLocal.paddingRight"
                                 :max="500"
                                 :min="0"
                                 :step="1"
                                 :stepStrictly="true"
                                 controls-position="right"
                                 size="mini"
                                 title="右侧内边距">
                </el-input-number>
              </div>
            </el-popover>
          </div>
        </el-collapse-item>
      </el-collapse>
      <PlainButton :class="$style.deleteButton" title="删除该控件" @click="deleteControl">删除该控件</PlainButton>
    </PanelContent>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import plateControlTypes from "@/common/utils/plate-control-types";
import {cloneDeep, isEqual} from 'lodash-es';
import ACTIONS from "@/console/app-edit/store/app-edit-actions";
import SingleRowTextEditPanel from '@/console/app-edit/plate/control/singlerowtext/SingleRowTextEditPanel';
import QrImageEditPanel from '@/console/app-edit/plate/control/qrimage/QrImageEditPanel';
import TableEditPanel from '@/console/app-edit/plate/control/table/TableEditPanel';
import KeyValueEditPanel from '@/console/app-edit/plate/control/keyvalue/KeyValueEditPanel';
import HeaderImageEditPanel from '@/console/app-edit/plate/control/headerimage/HeaderImageEditPanel';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    SINGLE_ROW_TEXT: SingleRowTextEditPanel,
    QR_IMAGE: QrImageEditPanel,
    TABLE: TableEditPanel,
    KEY_VALUE: KeyValueEditPanel,
    HEADER_IMAGE: HeaderImageEditPanel,
  },

  data() {
    return {
      theLocal: {},
      activeName: 'commonSetting',
    }
  },

  created() {
    this.theLocal = cloneDeep(this.theControl);
  },

  watch: {
    theControl: {
      handler: function () {
        this.theLocal = cloneDeep(this.theControl);
      },
      deep: true
    },

    theLocal: {
      handler: function () {
        if (!isEqual(this.theLocal, this.theControl)) {
          this.theControl = this.theLocal;
        }
      },
      deep: true
    }
  },

  computed: {
    ...appEditStore.mapGetters([
      'currentPlateControl'
    ]),

    controlTypeName() {
      return plateControlTypes[this.theControl.type].name;
    },

    theControl: {
      get() {
        return this.currentPlateControl;
      },

      set(control) {
        this[ACTIONS.UPDATE_PLATE_CONTROL](control);
      }
    },

    controlHelpDocLinks() {
      return {
        SINGLE_ROW_TEXT: '//docs.mryqr.com/plate-controls/text',
        QR_IMAGE: '//docs.mryqr.com/plate-controls/qr-image',
        TABLE: '//docs.mryqr.com/plate-controls/table',
        KEY_VALUE: '//docs.mryqr.com/plate-controls/key-value',
        HEADER_IMAGE: '//docs.mryqr.com/plate-controls/header-image'
      };
    },
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.UPDATE_PLATE_CONTROL,
      ACTIONS.DELETE_PLATE_CONTROL,
    ]),

    deleteControl() {
      this.$confirm(`确认删除当前控件？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this[ACTIONS.DELETE_PLATE_CONTROL](this.theControl.id);
      }).catch(_ => {
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-collapse-item__content {
      line-height: 1;
    }
  }
}

.settingCollapse {
  margin-top: 15px;
  margin-bottom: 20px;
}

.borderRadiusSelect {
  width: 100%;
}

.deleteButton {
  margin-bottom: 20px;
}

</style>

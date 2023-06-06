<template>
  <div :class="$style.wrapper">
    <el-button v-if="qr.active" size="medium" type="text" @click="openQr">打开</el-button>
    <span v-else :class="$style.inactive">禁用</span>
    <el-dropdown :class="$style.opsDropdown"
                 size="medium"
                 trigger="click"
                 @command="handleQrCommand">
      <el-button size="medium"
                 type="text">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="qr.active" command="enterQrOperationPage">
          进入运营页面
        </el-dropdown-item>

        <el-dropdown-item v-if="qr.active" command="openInNewWindow">
          在新窗口中打开
        </el-dropdown-item>

        <el-dropdown-item command="viewQrPlate">
          查看码牌
        </el-dropdown-item>

        <el-dropdown-item v-if="currentAppGeolocationEnabled && qr.geolocation" command="viewQrGeolocation">
          查看定位
        </el-dropdown-item>

        <el-dropdown-item v-if="canManageCurrentApp && managableGroupIds.length > 1" command="changeQrGroup">
          移动到其他{{ groupDesignation }}
        </el-dropdown-item>

        <template v-if="canManageQr(qr)">
          <el-dropdown-item command="resetQrPlate">
            重设码牌编号
          </el-dropdown-item>

          <el-dropdown-item v-if="hasCirculationStatuses" command="resetQrCirculationStatus">
            重设流转状态
          </el-dropdown-item>

          <el-dropdown-item command="renameQr">
            重命名
          </el-dropdown-item>

          <el-dropdown-item command="deleteQr">
            删除
          </el-dropdown-item>

          <el-dropdown-item v-if="!qr.template" command="setAsTemplate">
            设为模板
          </el-dropdown-item>

          <el-dropdown-item v-if="qr.template" command="unSetAsTemplate">
            取消模板
          </el-dropdown-item>

          <el-dropdown-item v-if="!qr.active" command="activate">
            启用
          </el-dropdown-item>

          <el-dropdown-item v-if="qr.active" command="deactivate">
            禁用
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>

    <RenameQrDialog :qr="qr"
                    :show.sync="showRenameQrDialog">
    </RenameQrDialog>

    <ChangeQrsGroupDialog :qrs="[qr]"
                          :show.sync="showChangeQrGroupDialog">
    </ChangeQrsGroupDialog>

    <ResetQrPlateDialog :qr="qr"
                        :show.sync="showResetQrPlateDialog">
    </ResetQrPlateDialog>

    <ResetQrCirculationStatusDialog :qr="qr"
                                    :show.sync="showResetQrCirculationDialog">
    </ResetQrCirculationStatusDialog>

    <SinglePlateViewer :plateSetting="plateSetting"
                       :qr="plateQr"
                       :show.sync="plateViewerVisible"
                       :title="qr.name"
                       :width="plateSetting.config.width+40">
    </SinglePlateViewer>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import RenameQrDialog from '@/console/app-operation/qrs/RenameQrDialog';
import ResetQrPlateDialog from '@/console/app-operation/qrs/ResetQrPlateDialog';
import ResetQrCirculationStatusDialog from '@/console/app-operation/qrs/ResetQrCirculationStatusDialog';
import qrApi from '@/common/api/qr-api';
import ChangeQrsGroupDialog from '@/console/app-operation/qrs/ChangeQrsGroupDialog';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";
import SinglePlateViewer from '@/console/app-operation/qrs/SinglePlateViewer';
import {viewGeoLocation} from '@/common/utils/geolocation-utils'
import {imageDisplayUrl} from "@/common/utils/image-utils";
import {qrUrl} from "@/common/utils/common-utils";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['qr'],

  components: {
    RenameQrDialog,
    ChangeQrsGroupDialog,
    ResetQrPlateDialog,
    ResetQrCirculationStatusDialog,
    SinglePlateViewer,
  },

  data() {
    return {
      showChangeQrGroupDialog: false,
      showResetQrPlateDialog: false,
      showResetQrCirculationDialog: false,
      showRenameQrDialog: false,
      plateViewerVisible: false,
      plateQr: {},
    }
  },

  methods: {
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR,
    ]),

    ...qrListStore.mapMutations([
      'deleteQrById',
      'markQrAsTemplateById',
      'unmarkQrAsTemplateById',
      'setWorkingQrId',
      'activateQrById',
      'deactivateQrById',
    ]),

    handleQrCommand(command) {
      return this[command]();
    },

    openQr() {
      this.$emit('openQr', this.qr);
    },

    enterQrOperationPage() {
      this.$router.push({name: 'qr-operation-workbench', params: {qrId: this.qr.id}});
    },

    openInNewWindow() {
      this.setWorkingQrId(this.qr.id);
      window.open(qrUrl(this.qr.plateId), '_blank');
    },

    viewQrPlate() {
      let queryCommand = {
        appId: this.currentAppId,
        qrIds: [this.qr.id],
      };

      return qrApi.fetchQrPlateAttributeValues(queryCommand).then(response => {
        let qrAttributeValues = response.data[this.qr.id];
        this.plateQr = {
          appName: this.currentAppName,
          tenantName: this.tenantName,
          id: this.qr.id,
          groupId: this.qr.groupId,
          name: this.qr.name,
          headerImageUrl: imageDisplayUrl(this.qr.headerImage),
          groupName: this.groupNameOf(this.qr.groupId),
          customId: this.qr.customId,
          plateId: this.qr.plateId,
          url: qrUrl(this.qr.plateId),
          attributes: qrAttributeValues ? qrAttributeValues : {},
        };
        this.plateViewerVisible = true;
      });
    },

    viewQrGeolocation() {
      viewGeoLocation({
        name: this.qr.name,
        geolocation: this.qr.geolocation
      });
    },

    changeQrGroup() {
      this.showChangeQrGroupDialog = true;
    },

    resetQrPlate() {
      this.showResetQrPlateDialog = true;
    },

    resetQrCirculationStatus() {
      this.showResetQrCirculationDialog = true;
    },

    renameQr() {
      this.showRenameQrDialog = true;
    },

    deleteQr() {
      return this.$confirm(`确认删除【${this.qr.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return qrApi.deleteQr(this.qr.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除【${this.qr.name}】。`,
            center: true
          });
          this.deleteQrById(this.qr.id);
        })
      });
    },

    setAsTemplate() {
      return this.$confirm(`设为模板后，每次提交将自动创建新的${this.instanceDesignation}，确认将【${this.qr.name}】设为模板？`, '提示', {
        confirmButtonText: '是的，设为模板',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return qrApi.markQrAsTemplate(this.qr.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功设置【${this.qr.name}】为模板。`,
            center: true
          });
          this.markQrAsTemplateById(this.qr.id);
          this[QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR](this.qr.id);
        })
      });
    },

    unSetAsTemplate() {
      return this.$confirm(`确认将【${this.qr.name}】取消模板？`, '提示', {
        confirmButtonText: '是的，取消模板',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return qrApi.unmarkQrAsTemplate(this.qr.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功为【${this.qr.name}】取消模板。`,
            center: true
          });
          this.unmarkQrAsTemplateById(this.qr.id);
          this[QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR](this.qr.id);
        })
      });
    },

    activate() {
      return this.$confirm(`确认启用【${this.qr.name}】？`, '提示', {
        confirmButtonText: '是的，启用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return qrApi.activateQr(this.qr.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功启用【${this.qr.name}】。`,
            center: true
          });
          this.activateQrById(this.qr.id);
          this[QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR](this.qr.id);
        })
      });
    },

    deactivate() {
      return this.$confirm(`确认禁用【${this.qr.name}】？`, '提示', {
        confirmButtonText: '是的，禁用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return qrApi.deactivateQr(this.qr.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功禁用【${this.qr.name}】。`,
            center: true
          });
          this.deactivateQrById(this.qr.id);
          this[QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR](this.qr.id);
        })
      });
    },

  },

  computed: {
    ...mapGetters(['tenantName']),
    ...appOperationStore.mapGetters([
      'canManageQr',
      'canManageCurrentApp',
      'managableGroupIds',
      'currentAppGeolocationEnabled',
      'currentAppId',
      'currentAppHomePageId',
      'groupDesignation',
      'groupNameOf',
      'plateSetting',
      'currentAppName',
      'instanceDesignation',
      'hasCirculationStatuses',
    ]),
  }
}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

.opsDropdown {
  margin-left: 15px;
}

.inactive {
  color: transparent;
}

</style>

<template>
  <div :class="$style.wrapper">
    <el-dropdown trigger="click" @command="handleCommand">
      <span :class="$style.qrDropdownButton">...</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="viewQrPlate">查看码牌</el-dropdown-item>

        <el-dropdown-item v-if="canManageApp && managableGroupIds.length > 1"
                          command="changeQrGroup">移动到其他{{ groupDesignation }}
        </el-dropdown-item>

        <template v-if="canManageQr(qr)">
          <el-dropdown-item command="renameQr">重命名</el-dropdown-item>
          <el-dropdown-item command="deleteQr">删除</el-dropdown-item>
        </template>

        <el-dropdown-item v-if="isAppGeolocationEnabled && qr.geolocation"
                          command="viewQrGeolocation">查看定位
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <ClientRenameQrDialog :qr="qr" :show.sync="qrRenameDialogVisible"></ClientRenameQrDialog>
    <ClientChangeQrGroupDialog :qr="qr" :show.sync="changeQrGroupDialogVisible"></ClientChangeQrGroupDialog>
    <ClientSinglePlateViewer :plateSetting="plateSetting"
                             :qr="plateQr"
                             :show.sync="plateViewerVisible"
                             :title="qr.name"
                             :width="plateSetting.config.width+40">
    </ClientSinglePlateViewer>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from "vuex";
import qrApi from "@/common/api/qr-api";
import ClientRenameQrDialog from '@/client/operations/app/qrs/ClientRenameQrDialog';
import ClientChangeQrGroupDialog from '@/client/operations/app/qrs/ClientChangeQrGroupDialog';
import {viewGeoLocation} from '@/common/utils/geolocation-utils'
import ClientSinglePlateViewer from '@/client/common/components/ClientSinglePlateViewer';
import {imageDisplayUrl} from "@/common/utils/image-utils";
import {qrUrl} from "@/common/utils/common-utils";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');
const clientQrListStore = createNamespacedHelpers('CLIENT_QR_LIST_STORE');

export default {
  props: ['qr'],

  components: {
    ClientRenameQrDialog,
    ClientChangeQrGroupDialog,
    ClientSinglePlateViewer,
  },

  data() {
    return {
      qrRenameDialogVisible: false,
      changeQrGroupDialogVisible: false,
      plateViewerVisible: false,
      plateQr: {},
    }
  },

  computed: {
    ...mapGetters(['tenantName']),
    ...clientAppOperationStore.mapGetters([
      'groupDesignation',
      'isAppGeolocationEnabled',
      'managableGroupIds',
      'canManageApp',
      'canManageQr',
      'plateSetting',
      'appName',
      'groupNameOf',
    ]),
  },

  methods: {
    ...clientQrListStore.mapMutations([
      'deleteQrById',
    ]),

    handleCommand(command) {
      return this[command]();
    },

    viewQrPlate() {
      let queryCommand = {
        appId: this.qr.appId,
        qrIds: [this.qr.id],
      };

      return qrApi.fetchQrPlateAttributeValues(queryCommand).then(response => {
        let qrAttributeValues = response.data[this.qr.id];
        this.plateQr = {
          appName: this.appName,
          tenantName: this.tenantName,
          id: this.qr.id,
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

    renameQr() {
      this.qrRenameDialogVisible = true;
    },

    changeQrGroup() {
      this.changeQrGroupDialogVisible = true;
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
            center: true,
            duration: 1000,
          });
          this.deleteQrById(this.qr.id);
        })
      });
    },

    viewQrGeolocation() {
      viewGeoLocation({
        name: this.qr.name,
        geolocation: this.qr.geolocation
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.qrDropdownButton {
  color: $secondaryTextColor;
  font-size: 20px;
  font-weight: 600;
  padding: 0 8px 10px;
  cursor: pointer;
}

.qrDropdownButton:hover {
  color: $primaryThemeColor;
}
</style>

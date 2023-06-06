<template>
  <el-dropdown v-if="batchSelectedQrs.length > 1"
               :class="$style.wrapper"
               trigger="click"
               @command="handleBatchCommand">

    <el-button :class="$style.batchButton"
               :title="`批量操作所选中的${instanceDesignation}`"
               size="medium"
               type="plain">
      批量操作<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="batchDownloadQrsPlateImage" title="下载二维码图片">
        下载码牌
      </el-dropdown-item>

      <!--      <el-dropdown-item command="batchDownloadQrsPlatePdf" title="下载二维码PDF">-->
      <!--        下载码牌（PDF）-->
      <!--      </el-dropdown-item>-->

      <el-dropdown-item v-if="canBatchViewQrsGeolocation" :title="`查看所有${instanceDesignation}的定位`"
                        command="batchViewQrsGeolocation">
        查看定位
      </el-dropdown-item>

      <el-dropdown-item v-if="canManageCurrentApp && managableGroupIds.length > 1" :title="`转移到其他${groupDesignation}`"
                        command="batchChangeQrsGroup">
        移动到其他{{ groupDesignation }}
      </el-dropdown-item>

      <el-dropdown-item v-if="canManageCurrentApp" :title="`删除所选中的${instanceDesignation}`" command="batchDeleteQrs">
        删除
      </el-dropdown-item>
    </el-dropdown-menu>

    <ChangeQrsGroupDialog :qrs="batchSelectedQrs"
                          :show.sync="showChangeQrsGroupDialog">
    </ChangeQrsGroupDialog>

    <PlateDownloadContainer ref="plateDownloadContainer"
                            :fileName="`码牌(${currentAppName})`"
                            :plateSetting="plateSetting"
                            :qrs="plateQrs">
    </PlateDownloadContainer>
  </el-dropdown>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import qrApi from '@/common/api/qr-api';
import ChangeQrsGroupDialog from '@/console/app-operation/qrs/ChangeQrsGroupDialog';
import PlateDownloadContainer from '@/common/components/plate/PlateDownloadContainer';
import {viewGeoLocations} from '@/common/utils/geolocation-utils'
import {imageDisplayUrl} from "@/common/utils/image-utils";
import {qrUrl} from "@/common/utils/common-utils";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    ChangeQrsGroupDialog,
    PlateDownloadContainer
  },

  data() {
    return {
      showChangeQrsGroupDialog: false,
      plateQrAttributeValues: {},
    }
  },

  methods: {
    ...qrListStore.mapMutations([
      'resetBatchSelectedQrs',
      'deleteQrsById',
    ]),

    handleBatchCommand(command) {
      return this[command]();
    },

    batchDownloadQrsPlateImage() {
      return this.batchDownloadQrsPlate('image');
    },

    batchDownloadQrsPlatePdf() {
      return this.batchDownloadQrsPlate('pdf');
    },

    batchDownloadQrsPlate(type) {
      let queryCommand = {
        appId: this.currentAppId,
        qrIds: this.batchSelectedQrs.map(q => q.id),
      };

      return qrApi.fetchQrPlateAttributeValues(queryCommand).then(response => {
        this.plateQrAttributeValues = response.data;
        this.$refs.plateDownloadContainer.downloadPlates(type);
      });
    },

    batchViewQrsGeolocation() {
      let displayPoints = this.batchSelectedQrs.filter(qr => {
        return qr.geolocation;
      }).map(qr => {
        return {
          name: qr.name,
          geolocation: qr.geolocation,
        };
      });

      viewGeoLocations(displayPoints);
    },

    batchChangeQrsGroup() {
      this.showChangeQrsGroupDialog = true;
    },

    batchDeleteQrs() {
      return this.$confirm(`确认删除所选${this.instanceDesignation}？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let command = {
          qrIds: this.batchSelectedQrs.map(q => q.id),
        };
        return qrApi.deleteQrs(command).then(() => {
          this.$message({
            type: 'success',
            message: `删除成功。`,
            center: true
          });
          this.resetBatchSelectedQrs();
          this.deleteQrsById(command.qrIds);
        })
      });
    },

  },

  computed: {
    ...mapGetters(['tenantName']),
    ...qrListStore.mapState(['batchSelectedQrs']),
    ...appOperationStore.mapGetters([
      'canManageCurrentApp',
      'managableGroupIds',
      'currentAppGeolocationEnabled',
      'groupDesignation',
      'instanceDesignation',
      'plateSetting',
      'currentAppId',
      'currentAppName',
      'groupNameOf',
    ]),

    canBatchViewQrsGeolocation() {
      return this.currentAppGeolocationEnabled &&
          this.batchSelectedQrs.some(qr => {
            return qr.geolocation;
          });
    },

    plateQrs() {
      return this.batchSelectedQrs.map(qr => {
        return {
          appName: this.currentAppName,
          tenantName: this.tenantName,
          id: qr.id,
          name: qr.name,
          headerImageUrl: imageDisplayUrl(qr.headerImage),
          groupName: this.groupNameOf(qr.groupId),
          customId: qr.customId,
          plateId: qr.plateId,
          attributes: this.plateQrAttributeValues[qr.id] ? this.plateQrAttributeValues[qr.id] : {},
          url: qrUrl(qr.plateId),
        }
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.batchButton {
  font-weight: normal;
}

</style>

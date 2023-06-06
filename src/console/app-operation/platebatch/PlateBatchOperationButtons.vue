<template>
  <div :class="$style.wrapper">
    <el-button size="medium"
               type="text"
               @click.stop="downloadAllPlatesImage">
      下载码牌
    </el-button>

    <el-dropdown :class="$style.opsDropdown"
                 size="medium"
                 trigger="click"
                 @command="handleMoreCommand">

      <el-button size="medium"
                 type="text">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <!--        <el-dropdown-item command="downloadAllPlatesPdf" title="重命名">-->
        <!--          下载（PDF）-->
        <!--        </el-dropdown-item>-->

        <el-dropdown-item command="downloadUnusedPlatesImage" title="重命名">
          只下载未使用的码牌
        </el-dropdown-item>

        <!--        <el-dropdown-item command="downloadUnusedPlatesPdf" title="重命名">-->
        <!--          只下载未使用的码牌（PDF）-->
        <!--        </el-dropdown-item>-->

        <el-dropdown-item command="rename" title="重命名">
          重命名
        </el-dropdown-item>

        <el-dropdown-item command="deleteBatch" title="删除">
          删除
        </el-dropdown-item>

      </el-dropdown-menu>
    </el-dropdown>

    <RenamePlateBatchDialog :batch="batch" :show.sync="showRenameDialog"></RenamePlateBatchDialog>

    <PlateDownloadContainer ref="plateDownloadContainer"
                            :fileName="`码牌批次(${batch.name})`"
                            :plateSetting="plateSetting"
                            :qrs="plateQrs">
    </PlateDownloadContainer>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import plateBatchApi from '@/common/api/platebatch-api';
import RenamePlateBatchDialog from '@/console/app-operation/platebatch/RenamePlateBatchDialog';
import PlateDownloadContainer from '@/common/components/plate/PlateDownloadContainer';
import {qrUrl} from "@/common/utils/common-utils";

const plateBatchListStore = createNamespacedHelpers('PLATE_BATCH_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['batch'],

  components: {RenamePlateBatchDialog, PlateDownloadContainer},

  data() {
    return {
      showRenameDialog: false,
      plateIds: [],
    }
  },

  computed: {
    ...mapGetters(['tenantName']),
    ...appOperationStore.mapGetters(['plateSetting', 'currentAppName']),

    plateQrs() {
      return this.plateIds.map(plateId => {
        return {
          appName: this.currentAppName,
          tenantName: this.tenantName,
          id: null,
          name: null,
          headerImageUrl: null,
          groupName: null,
          customId: null,
          plateId: plateId,
          attributes: {},
          url: qrUrl(plateId),
        }
      });
    },
  },

  methods: {
    ...plateBatchListStore.mapMutations(['deleteBatchById']),

    downloadAllPlatesImage() {
      return plateBatchApi.allPlateIdsUnderPlateBatch(this.batch.id).then(response => {
        this.plateIds = response.data;
        this.$refs.plateDownloadContainer.downloadPlates('image');
      });
    },

    downloadAllPlatesPdf() {
      return plateBatchApi.allPlateIdsUnderPlateBatch(this.batch.id).then(response => {
        this.plateIds = response.data;
        this.$refs.plateDownloadContainer.downloadPlates('pdf');
      });
    },

    downloadUnusedPlatesImage() {
      return plateBatchApi.unusedPlateIdsUnderPlateBatch(this.batch.id).then(response => {
        this.plateIds = response.data;
        this.$refs.plateDownloadContainer.downloadPlates('image');
      });
    },

    downloadUnusedPlatesPdf() {
      return plateBatchApi.unusedPlateIdsUnderPlateBatch(this.batch.id).then(response => {
        this.plateIds = response.data;
        this.$refs.plateDownloadContainer.downloadPlates('pdf');
      });
    },

    rename() {
      this.showRenameDialog = true;
    },

    deleteBatch() {
      return this.$confirm(`确认删除【${this.batch.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return plateBatchApi.deletePlateBatch(this.batch.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除【${this.batch.name}】。`,
            center: true
          });

          this.deleteBatchById(this.batch.id);
        });
      });
    },

    handleMoreCommand(command) {
      return this[command]();
    },
  },

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


</style>

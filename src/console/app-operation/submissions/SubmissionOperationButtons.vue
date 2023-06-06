<template>
  <div :class="$style.wrapper">
    <el-button v-if="type === 'TO_BE_APPROVED'"
               size="medium"
               type="text"
               @click="approveSubmission">
      审批
    </el-button>
    <el-button v-else
               size="medium"
               type="text"
               @click="viewSubmission">
      查看
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
        <el-dropdown-item command="openInNewTab">
          在新窗口中查看
        </el-dropdown-item>

        <el-dropdown-item v-if="canManageGroup(submission.groupId)" command="deleteSubmission">
          删除
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <DrawerBrowser :show.sync="showDrawerBrowser"
                   :src="currentSubmissionSrc"
                   :title="currentQrName"
                   :wrapperClosableReferenceKey="'submissions_'+currentAppId+type+pageId"
                   @closed="onDrawerBrowserClosed">
    </DrawerBrowser>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import submissionApi from '@/common/api/submission-api';
import DrawerBrowser from '@/common/components/DrawerBrowser';
import SUBMISSION_LIST_ACTIONS from "@/console/app-operation/submissions/store/submission-list-actions";
import {qrUrlWithSubmission} from "@/common/utils/common-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: ['submission'],
  components: {DrawerBrowser},

  data() {
    return {
      showDrawerBrowser: false,
      currentQrName: '',
      currentSubmissionSrc: '',
    }
  },

  methods: {
    ...submissionListStore.mapActions([
      SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION
    ]),

    ...submissionListStore.mapMutations([
      'deleteSubmissionById',
      'setActiveSubmission',
    ]),

    viewSubmissionUrl() {
      let plateId = this.submission.plateId;
      let pageId = this.submission.pageId;
      let submissionId = this.submission.id;
      return qrUrlWithSubmission(plateId, pageId, submissionId);
    },

    approveSubmissionUrl() {
      let plateId = this.submission.plateId;
      let pageId = this.submission.pageId;
      let submissionId = this.submission.id;
      let src = qrUrlWithSubmission(plateId, pageId, submissionId);
      if (this.type === 'TO_BE_APPROVED') {
        src = src + '?approval=true'
      }
      return src;
    },

    openDrawerBrowser(src, name) {
      this.currentSubmissionSrc = src;
      this.currentQrName = name;
      this.showDrawerBrowser = true;
    },

    viewSubmission() {
      this.setActiveSubmission(this.submission.id);
      this.openDrawerBrowser(this.viewSubmissionUrl(), this.submission.qrName);
    },

    approveSubmission() {
      this.setActiveSubmission(this.submission.id);
      this.openDrawerBrowser(this.approveSubmissionUrl(), this.submission.qrName);
    },

    openInNewTab() {
      this.setActiveSubmission(this.submission.id);
      window.open(this.viewSubmissionUrl(), '_blank');
    },

    handleMoreCommand(command) {
      return this[command]();
    },

    onDrawerBrowserClosed() {
      this[SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION]();
    },

    deleteSubmission() {
      return this.$confirm(`确认删除？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return submissionApi.deleteSubmission(this.submission.id).then(() => {
          this.$message({
            type: 'success',
            message: `删除成功。`,
            center: true
          });
          this.deleteSubmissionById(this.submission.id);
        })
      });
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'canManageGroup',
      'currentAppId',
    ]),

    ...submissionListStore.mapState([
      'type',
      'pageId',
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

</style>

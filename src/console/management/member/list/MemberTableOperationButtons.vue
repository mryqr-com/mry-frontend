<template>
  <el-dropdown v-if="isBatchImportMemberAllowed"
               :class="$style.wrapper"
               size="medium"
               trigger="click"
               @command="handleCommand">
    <i class="el-icon-s-tools" title="更多操作"></i>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-if="isBatchImportMemberAllowed" command="importMember">批量导入成员</el-dropdown-item>
    </el-dropdown-menu>

    <ImportMemberDialog :show.sync="importMemberDialogVisible" @fileUpload="onMembersUpload"></ImportMemberDialog>

    <ProgressBar :max="100"
                 :show.sync="memberImportProgressBarVisible"
                 :step="memberImportProgressStep"
                 text="正在上传..."
                 title="导入成员">
    </ProgressBar>

    <ImportMemberResponseDialog :importResponse="memberImportResponse"
                                :show.sync="memberImportResponseDialogVisible">
    </ImportMemberResponseDialog>
  </el-dropdown>
</template>

<script>
import {mapGetters} from 'vuex';
import memberApi from '@/common/api/member-api';
import ImportMemberDialog from '@/console/management/member/list/ImportMemberDialog';
import ImportMemberResponseDialog from '@/console/management/member/list/ImportMemberResponseDialog';

export default {
  components: {
    ImportMemberDialog,
    ImportMemberResponseDialog,
  },

  data() {
    return {
      importMemberDialogVisible: false,
      memberImportProgressBarVisible: false,
      memberImportProgressStep: 0,
      memberImportResponseDialogVisible: false,
      memberImportResponse: null,
    }
  },

  computed: {
    ...mapGetters([
      'isBatchImportMemberAllowed',
    ]),
  },

  methods: {
    handleCommand(command) {
      return this[command]();
    },

    importMember() {
      this.importMemberDialogVisible = true;
    },

    onMembersUpload(formData) {
      this.memberImportProgressBarVisible = true;
      this.memberImportProgressStep = 0;
      let _this = this;
      let interval = setInterval(function () {
        _this.memberImportProgressStep++;
      }, 200);

      return memberApi.importMembers(formData).then((response) => {
        this.memberImportProgressBarVisible = false;
        this.memberImportResponse = response.data;
        this.memberImportResponseDialogVisible = true;
      }).finally(() => {
        clearInterval(interval);
        this.memberImportProgressBarVisible = false;
      });
    }
  },
}
</script>


<style lang="scss" module>
.wrapper {
  cursor: pointer;
}

.wrapper:hover {
  color: $primaryThemeColor;
}

</style>

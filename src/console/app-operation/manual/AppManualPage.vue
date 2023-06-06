<template>
  <div v-if="loaded" :class="$style.wrapper">
    <div v-if="content" :class="$style.content">
      <div :class="$style.title">
        用户手册
        <el-button v-if="canManageCurrentApp"
                   :class="$style.editButton"
                   icon="el-icon-edit-outline"
                   size="small"
                   @click="openEditDialog">
          编辑
        </el-button>
      </div>
      <MarkdownViewer :class="$style.markdownViewer" :markdown-style="markdownStyle" :value="content"></MarkdownViewer>
    </div>

    <div v-else :class="$style.emptySection">
      <div :class="$style.emptyImageContainer" :style="emptyImage"></div>
      <div :class="$style.emptyText">当前无用户手册</div>
      <el-button v-if="canManageCurrentApp"
                 :class="$style.emptyEditButton"
                 icon="el-icon-edit-outline"
                 size="medium"
                 type="primary"
                 @click="openEditDialog">
        编辑用户手册
      </el-button>
    </div>

    <DialogedMarkdownInput v-model="content"
                           :oss-request="ossRequest"
                           :show.sync="markdownDialogVisible"
                           :width="1100"
                           title="编辑用户手册"
                           @input="updateContent">
    </DialogedMarkdownInput>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import appManualApi from '@/common/api/app-manual-api';
import emptyImageUrl from "@/common/static/empty.svg";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
    DialogedMarkdownInput: () => import(/* webpackChunkName: "dialoged-markdown-editor" */ '@/common/components/DialogedMarkdownInput'),
  },

  data() {
    return {
      loaded: false,
      content: null,
      markdownDialogVisible: false,
      markdownStyle: {
        fontStyle: {
          fontFamily: "默认",
          fontSize: 15,
          bold: false,
          italic: false,
          color: 'rgba(68, 68, 68, 1)',
        },
        lineHeight: 1.8
      },
    }
  },

  created() {
    document.title = `用户手册 - ${this.currentAppName}`;

    return appManualApi.fetchAppManual(this.currentAppId).then(response => {
      this.loaded = true;
      if (response.data) {
        this.content = response.data.content;
      } else {
        this.content = null;
      }
    });
  },

  computed: {
    ...mapGetters([
      'tenantId'
    ]),

    ...appOperationStore.mapGetters([
      'currentAppName',
      'currentAppId',
      'canManageCurrentApp',
    ]),

    emptyImage() {
      return {
        backgroundImage: `url('${emptyImageUrl}')`,
      }
    },

    ossRequest() {
      return {
        type: 'APP_EDIT',
        appId: this.currentAppId,
        tenantId: this.tenantId,
      };
    },

  },

  methods: {
    openEditDialog() {
      this.markdownDialogVisible = true;
    },

    updateContent(content) {
      return appManualApi.updateAppManual(this.currentAppId, {content: content}).then(() => {
        this.$message({
          type: 'success',
          message: `用户手册更新成功。`,
          center: true,
        });
      });
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight});
  overflow: scroll;
}

.content {
  width: 700px;
  background-color: white;
  box-shadow: $pageShadow;
  padding: 50px;
  margin: 36px auto 50px;
  min-height: 980px;
}

.title {
  text-align: center;
  font-size: 36px;
  font-weight: 500;
  padding-bottom: 24px;
  padding-top: 50px;
  color: $primaryTextColor;
  position: relative;
  border-bottom: $secondary1pxBorder;
  margin-bottom: 24px;
}

.editButton {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
}

.emptySection {
  margin-top: 200px;
}

.emptyImageContainer {
  background-position: center center;
  background-size: cover;
  width: 200px;
  height: 200px;
  margin: auto;
}

.emptyText {
  text-align: center;
  margin-top: 20px;
  color: $secondaryTextColor;
}

.emptyEditButton {
  width: $pageButtonWidth;
  display: block;
  margin: 15px auto auto;
}

</style>

<template>
  <el-dialog :title="`删除【${app.name}】`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <div>
      <div>
        <el-alert :closable="false"
                  title="警告：删除应用将连带删除该应用下的所有数据，包括分组、实例和提交记录等，相应二维码也将无法扫码，删除后数据无法恢复，请谨慎操作。"
                  type="warning">
        </el-alert>
      </div>

      <el-form ref="theForm"
               label-position="top">
        <el-form-item label="确认应用名称：">
          <el-input ref="name-input"
                    v-model="appName"
                    :class="$style.inputBox"
                    :maxlength="50"
                    :spellcheck="false"
                    placeholder="请输入完整的应用名称"
                    size="medium">
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <el-button :class="$style.cancelButton"
                 size="medium"
                 type="plain"
                 @click="cancelDelete">
        取消
      </el-button>

      <el-button :class="[$style.deleteButton,{[$style.deleteButtonRed]:canDelete}]"
                 :disabled="!canDelete"
                 :type="deleteButtonType"
                 size="medium"
                 @click="deleteApp">
        确认删除
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import {createNamespacedHelpers, mapMutations} from 'vuex';
import appApi from '@/common/api/app-api';

const appListStore = createNamespacedHelpers('APP_LIST_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    app: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      visible: this.show,
      appName: null
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    ...mapMutations(['clearMyAppsCache']),
    ...appListStore.mapMutations(['deleteAppById']),

    init() {
      this.appName = null;
    },

    cancelDelete() {
      this.visible = false;
    },

    deleteApp() {
      this.visible = false;

      return appApi.deleteApp(this.app.id).then(() => {
        this.$message({
          type: 'success',
          message: `成功删除应用【${this.app.name}】。`,
          center: true
        });
        this.clearMyAppsCache();
        this.deleteAppById(this.app.id);
      });
    }
  },

  computed: {
    canDelete() {
      return this.appName === this.app.name;
    },

    deleteButtonType() {
      return this.canDelete ? 'primary' : 'plain';
    }
  }

}
</script>


<style lang="scss" module>
.wrapper {
}

.inputBox {
  width: 100%;
}

.cancelButton {
  width: $dialogButtonWidth;
}

.deleteButton {
  width: $dialogButtonWidth;
}

.deleteButtonRed {
  background-color: $rejectRed;
  border: none;
}

.deleteButtonRed:hover {
  background-color: $rejectRed;
  filter: brightness(110%);
}

</style>


<template>
  <div :class="$style.wrapper">
    <el-button :class="$style.addButton"
               :disabled="isOperationMenuFull"
               :title="buttonTitle"
               icon="el-icon-plus"
               plain
               size="medium"
               type="primary"
               @click="showDialog">
      新建菜单项
    </el-button>

    <OperationMenuItemEditDialog :isNew="true"
                                 :item="newItem"
                                 :show.sync="dialogVisible"
                                 @updated="addItem">
    </OperationMenuItemEditDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import uuid from 'short-uuid';
import OperationMenuItemEditDialog from '@/console/app-edit/operation-menu/OperationMenuItemEditDialog';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {OperationMenuItemEditDialog},
  data() {
    return {
      dialogVisible: false,
      newItem: {},
    }
  },

  computed: {
    ...mapGetters([
      'isOperationMenuFull',
    ]),

    buttonTitle() {
      return this.isOperationMenuFull ? '当前菜单列表已经超过最大可添加菜单数量(20个)，无法继续添加' : '添加菜单项';
    }
  },

  methods: {
    ...mapActions([ACTIONS.ADD_OPERATION_MENU_ITEM,]),

    showDialog() {
      this.newItem = {
        id: uuid.generate(),
        name: null,
        type: null,
        pageId: null
      };

      this.dialogVisible = true;
    },

    addItem(item) {
      this[ACTIONS.ADD_OPERATION_MENU_ITEM](item)
          .catch((error) => {
            this.$message({
              type: 'error',
              message: error.message ? error.message : error,
              center: true
            });
          });
    },

  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.addButton {
  width: $pageButtonWidth;
}

</style>

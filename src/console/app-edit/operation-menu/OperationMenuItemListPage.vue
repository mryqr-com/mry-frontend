<template>
  <div :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">
        运营菜单
        <HelpDocLinker url="//docs.mryqr.com/app-design/operation-menu"></HelpDocLinker>
      </div>

      <div :class="$style.opsButtons">
        <OperationMenuItemAddButton :class="$style.addButton"></OperationMenuItemAddButton>
      </div>
    </div>

    <div :class="$style.tableHeader">
      <div :class="$style.headerColumn">菜单名称</div>
      <div :class="$style.headerColumn">引用页面</div>
      <div :class="$style.headerColumn">菜单类型</div>
      <div :class="$style.headerColumn">操作</div>
    </div>

    <div v-if="allMenuItems.length ===0" :class="$style.emptyHolder" :style="contentHeightStyle">
      暂无自定义运营菜单，请点击右上角"新建菜单项"按钮以创建
    </div>

    <draggable v-else
               v-model="allMenuItems"
               :class="$style.itemList"
               :handle="'.' + $style.dragHandle"
               :style="contentHeightStyle"
               animation="200"
               tag="div">

      <div v-for="menuitem in allMenuItems" :key="menuitem.id" :class="$style.itemRow">
        <div :class="$style.itemColumn">
          <ThreeBarIcon :class="$style.dragHandle"
                        title="上下拖动移位">
          </ThreeBarIcon>
          {{ menuitem.name }}
        </div>
        <div :class="$style.itemColumn">{{ pageNameFor(menuitem.pageId) }}</div>
        <div :class="$style.itemColumn">{{ menuItemTypeName(menuitem.type) }}</div>
        <div :class="[$style.itemColumn,$style.opsColumn]">
          <el-button size="medium"
                     type="text"
                     @click.stop="openUpdateDialog(menuitem)">
            编辑
          </el-button>
          <el-button size="medium"
                     type="text"
                     @click.stop="deleteMenuItem(menuitem)">
            删除
          </el-button>
        </div>
      </div>
    </draggable>

    <OperationMenuItemEditDialog :isNew="false"
                                 :item="menuItemForUpdate"
                                 :show.sync="dialogVisible"
                                 @updated="updateOperationMenuItem">
    </OperationMenuItemEditDialog>
  </div>
</template>

<script>
import OperationMenuItemAddButton from '@/console/app-edit/operation-menu/OperationMenuItemAddButton';
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import draggable from 'vuedraggable';
import submissionListTypes from '@/console/app-edit/operation-menu/submission-list-types';
import OperationMenuItemEditDialog from '@/console/app-edit/operation-menu/OperationMenuItemEditDialog';

const {mapGetters, mapState, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    OperationMenuItemAddButton,
    OperationMenuItemEditDialog,
    draggable
  },

  data() {
    return {
      dialogVisible: false,
      menuItemForUpdate: {},
    }
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_OPERATION_MENUS,
      ACTIONS.UPDATE_OPERATION_MENU_ITEM,
      ACTIONS.DELETE_OPERATION_MENU_ITEM
    ]),

    menuItemTypeName(type) {
      return submissionListTypes.find(e => e.type === type).text;
    },

    pageNameFor(pageId) {
      if (pageId === 'ALL') {
        return '所有页面';
      }

      return this.pageNameOf(pageId);
    },

    openUpdateDialog(menuItem) {
      this.menuItemForUpdate = menuItem;
      this.dialogVisible = true;
    },

    deleteMenuItem(menuItem) {
      this.$confirm(`确认删除菜单项【${menuItem.name}】？`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this[ACTIONS.DELETE_OPERATION_MENU_ITEM](menuItem)
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error.message ? error.message : error,
                center: true
              });
            });
      }).catch(_ => {
      });
    },

    updateOperationMenuItem(menuItem) {
      this[ACTIONS.UPDATE_OPERATION_MENU_ITEM](menuItem)
          .catch((error) => {
            this.$message({
              type: 'error',
              message: error.message ? error.message : error,
              center: true
            });
          });
    }
  },

  computed: {
    ...mapGetters(['allOperationMenuItems', 'pageNameOf']),

    allMenuItems: {
      get() {
        return this.allOperationMenuItems;
      },
      set(items) {
        this[ACTIONS.UPDATE_OPERATION_MENUS](items);
      }
    },

    contentHeightStyle() {
      return {
        height: window.innerHeight - 60 - 24 - 60 - 5 - 24 - 48 + 'px'
      }
    },

  },

}
</script>


<style lang="scss" module>
$content-margin: 24px;
$ops-bar-height: 60px;
$ops-bar-margin-bottom: 5px;


.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin});
  margin: $content-margin;
}

.opsBar {
  padding: 0 16px;
  height: $ops-bar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $whiteBackgroundColor;
  margin-bottom: $ops-bar-margin-bottom;
}

.theTitle {
  font-weight: 500;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.addButton {
  margin-left: 16px;
}

.tableHeader {
  background-color: $whiteBackgroundColor;
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: $secondary1pxBorder;
  padding: 0 24px;
}

.headerColumn {
  flex-grow: 1;
  flex-basis: 100px;
  font-weight: 500;
  color: $primaryTextColor;
}

.emptyHolder {
  background-color: $whiteBackgroundColor;
  display: flex;
  align-items: center;
  justify-content: center;
}

.itemList {
  background-color: $whiteBackgroundColor;
  overflow-y: auto;
}

.itemRow {
  border-bottom: $secondary1pxBorder;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.itemRow:hover {
  background-color: #F5F7FA;
}

.dragHandle {
  cursor: move;
  margin-right: 10px;
}

.itemColumn {
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-basis: 100px;
}

.opsColumn {
  display: flex;
  align-items: center;
}

</style>

<template>
  <div v-if="localMenu" :class="$style.wrapper">
    <PanelContent helpUrl="//docs.mryqr.com/app-design/home-page-menu" title="菜单">
      <EditTitle>菜单项</EditTitle>
      <PageLinkEditor v-model="localMenu.links"
                      :maxLinks="10"
                      :maxTextLength="6">
      </PageLinkEditor>

      <EditTitle>设置</EditTitle>
      <el-checkbox v-model="localMenu.showBasedOnPermission"
                   class="settingMarginBottom block"
                   size="mini"
                   title="勾选时，如果用户对某菜单项所链接的内部页面无权限，那么该菜单项将不予显示，该设置项对于外部链接无效。">
        根据权限显示或隐藏菜单项
      </el-checkbox>
    </PanelContent>
  </div>
</template>

<script>
import PageLinkEditor from '@/console/app-edit/components/PageLinkEditor'
import {createNamespacedHelpers} from 'vuex';
import {cloneDeep, isEqual} from 'lodash-es';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  data() {
    return {
      localMenu: null
    }
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_MENU
    ])
  },

  watch: {
    theMenu: {
      handler: function () {
        this.localMenu = cloneDeep(this.theMenu);
      },
      deep: true
    },

    localMenu: {
      handler: function () {
        if (!isEqual(this.localMenu, this.theMenu)) {
          this.theMenu = this.localMenu;
        }
      },
      deep: true
    }
  },

  mounted() {
    this.localMenu = cloneDeep(this.theMenu);
  },

  components: {
    PageLinkEditor
  },

  computed: {
    ...mapGetters([
      'menu'
    ]),

    theMenu: {
      get() {
        return this.menu;
      },

      set(menu) {
        this[ACTIONS.UPDATE_MENU](menu);
      }
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}


</style>

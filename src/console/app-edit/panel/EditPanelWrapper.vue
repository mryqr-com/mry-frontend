<template>
  <div :class="$style.wrapper">
    <component :is="currentEditType"/>
  </div>
</template>

<script>
import AppTopBarEditPanel from '@/console/app-edit/topbar/AppTopBarEditPanel';
import PageHeaderEditPanel from '@/console/app-edit/header/PageHeaderEditPanel';
import PageTitleEditPanel from '@/console/app-edit/title/PageTitleEditPanel';
import ControlEditPanel from '@/console/app-edit/control/ControlEditPanel';
import PageSettingEditPanel from '@/console/app-edit/settings/PageSettingEditPanel';
import SubmitButtonEditPanel from '@/console/app-edit/submit/SubmitButtonEditPanel';
import MenuEditPanel from '@/console/app-edit/menu/MenuEditPanel';

import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    TOP_BAR: AppTopBarEditPanel,
    HEADER: PageHeaderEditPanel,
    TITLE: PageTitleEditPanel,
    CONTROL: ControlEditPanel,
    PAGE_SETTING: PageSettingEditPanel,
    SUBMIT_BUTTON: SubmitButtonEditPanel,
    MENU: MenuEditPanel
  },

  computed: {
    ...mapGetters([
      'currentEditType'
    ])
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

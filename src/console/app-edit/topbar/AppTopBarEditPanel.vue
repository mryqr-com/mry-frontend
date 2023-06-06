<template>
  <div>
    <PanelContent helpUrl="//docs.mryqr.com/app-design/topbar" title="导航栏">
      <EditTitle>设置</EditTitle>

      <div class="singleLineTitle">边框</div>
      <BorderInput v-model="localBar.border"
                   class="settingMarginBottom">
      </BorderInput>

      <div class="singleLineTitle">边框阴影</div>
      <ShadowInput v-model="localBar.shadow"
                   class="settingMarginBottom">
      </ShadowInput>

      <div class="keyValueSettingContainer">
        水平内边距：
        <el-input-number v-model="localBar.hPadding"
                         :max="100"
                         :min="0"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="mini"
                         title="水平内边距">
        </el-input-number>
      </div>

      <div class="keyValueSettingContainer">
        高度：
        <el-input-number v-model="localBar.height"
                         :max="80"
                         :min="30"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="mini"
                         title="导航栏高度">
        </el-input-number>
      </div>

      <div class="keyValueSettingContainer">
        文本颜色：
        <MryColorPicker v-model="localBar.textColor" title="导航栏中的文本颜色"></MryColorPicker>
      </div>

      <div class="keyValueSettingContainer">
        背景色：
        <MryColorPicker v-model="localBar.backgroundColor" title="导航栏的背景色"></MryColorPicker>
      </div>

    </PanelContent>
  </div>
</template>

<script>
import {cloneDeep, isEqual} from 'lodash-es';
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  data() {
    return {
      localBar: null
    }
  },

  created() {
    this.localBar = cloneDeep(this.theBar);
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_APP_TOP_BAR
    ])
  },

  watch: {
    theBar: {
      handler: function () {
        this.localBar = cloneDeep(this.theBar);
      },
      deep: true
    },

    localBar: {
      handler: function () {
        if (!isEqual(this.localBar, this.theBar)) {
          this.theBar = this.localBar;
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'appTopBar',
    ]),

    theBar: {
      get() {
        return this.appTopBar;
      },

      set(bar) {
        this[ACTIONS.UPDATE_APP_TOP_BAR](bar)
      }
    }
  },
}
</script>

<style lang="scss" module>

</style>

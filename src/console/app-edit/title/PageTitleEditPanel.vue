<template>
  <div>
    <PanelContent helpUrl="//docs.mryqr.com/app-design/page-header" title="页面标题">
      <div class="singleLineTitleWithSuffix">
        <EditTitle>标题</EditTitle>
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <ItalicTextButton slot="reference" title="设置标题样式">样式</ItalicTextButton>
          <BoxedTextStyleInput v-model="localTitle.textStyle"></BoxedTextStyleInput>
        </el-popover>
      </div>

      <el-input v-model="localTitle.text"
                :class="{elementInputErrorBordered: $v.localTitle.text.$invalid }"
                :maxlength="50"
                :spellcheck="false"
                :title="`页面标题，首页的标题将被${instanceDesignation}名称所覆盖`"
                size="mini">
      </el-input>
      <ErrorMessage v-if="!$v.localTitle.text.required">标题不能为空</ErrorMessage>

      <div class="singleLineTitleWithSuffix">
        <EditTitle>
          简介
        </EditTitle>
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <ItalicTextButton slot="reference" title="设置简介样式">样式</ItalicTextButton>
          <MarkdownStyleInput v-model="localTitle.descriptionStyle"></MarkdownStyleInput>
        </el-popover>
      </div>

      <MarkdownEditor v-model="localTitle.description"
                      class="settingMarginBottom"
                      title="标题简介，显示于页面标题之下，采用Markdown格式">
      </MarkdownEditor>

      <StyledButton @click="markdownDialogVisible=true">
        在Markdown编辑器中打开
      </StyledButton>
    </PanelContent>

    <DialogedMarkdownInput v-model="localTitle.description"
                           :oss-request="appEditOssRequest"
                           :show.sync="markdownDialogVisible"
                           title="编辑标题简介">
    </DialogedMarkdownInput>
  </div>
</template>

<script>
import {cloneDeep, isEqual} from 'lodash-es';
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import MarkdownEditor from '@/console/app-edit/components/MarkdownEditor';
import {required} from 'vuelidate/lib/validators';

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  data() {
    return {
      localTitle: null,
      markdownDialogVisible: false
    }
  },

  created() {
    this.localTitle = cloneDeep(this.theTitle);
  },

  components: {
    MarkdownEditor,
    DialogedMarkdownInput: () => import(/* webpackChunkName: "dialoged-markdown-editor" */ '@/common/components/DialogedMarkdownInput'),
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_PAGE_TITLE
    ])
  },

  watch: {
    theTitle: {
      handler: function () {
        this.localTitle = cloneDeep(this.theTitle);
      },
      deep: true
    },

    localTitle: {
      handler: function () {
        if (!isEqual(this.localTitle, this.theTitle)) {
          this.theTitle = this.localTitle;
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'allPages',
      'currentPage',
      'appEditOssRequest',
      'instanceDesignation',
    ]),

    theTitle: {
      get() {
        return this.currentPage.title;
      },

      set(title) {
        this[ACTIONS.UPDATE_PAGE_TITLE](title)
      }
    }
  },
  validations: {
    localTitle: {
      text: {
        required,
      }
    }

  }
}
</script>

<style lang="scss" module>
.markdownIcon {
  cursor: pointer;
}

.markdownIcon:hover {
  color: $primaryThemeColor;
}
</style>

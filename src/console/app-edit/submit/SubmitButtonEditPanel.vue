<template>
  <div v-if="localButton" :class="$style.wrapper">
    <PanelContent helpUrl="//docs.mryqr.com/app-design/submit-button" title="提交按钮">
      <EditTitle>显示文本</EditTitle>
      <div class="settingMarginBottom">
        <el-input v-model="localButton.text"
                  :class="{elementInputErrorBordered: $v.localButton.text.$invalid }"
                  :maxlength="50"
                  :spellcheck="false"
                  size="mini"
                  title="按钮显示文本">
        </el-input>

        <ErrorMessageTransition>
          <ErrorMessage v-if="!$v.localButton.text.required">按钮文本不能为空</ErrorMessage>
        </ErrorMessageTransition>
      </div>

      <div class="keyValueSettingContainer">
        按钮样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference"
                     class="rightInputWidth"
                     size="mini"
                     title="设置按钮样式"
                     type="plain">
            按钮样式...
          </el-button>
          <ButtonStyleInput v-model="localButton.buttonStyle"></ButtonStyleInput>

          <div :class="$style.applyToButton">
            <el-dropdown trigger="click" @command="handleApplyToCommand">
              <ItalicTextButton title="将按钮样式应用于其他页面">应用于...</ItalicTextButton>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="applySubmitButtonStyleToAllPages">
                  所有页面
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-popover>
      </div>
    </PanelContent>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {cloneDeep, isEqual} from 'lodash-es';
import {required} from 'vuelidate/lib/validators';

const {mapState, mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  data() {
    return {
      localButton: null
    }
  },

  mounted() {
    this.localButton = cloneDeep(this.theButton);
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_SUBMIT_BUTTON,
      ACTIONS.APPLY_SUBMIT_BUTTON_STYLE_TO_ALL,
    ]),

    handleApplyToCommand(command) {
      return this[command]();
    },

    applySubmitButtonStyleToAllPages() {
      this[ACTIONS.APPLY_SUBMIT_BUTTON_STYLE_TO_ALL](this.localButton.buttonStyle).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    }
  },

  watch: {
    theButton: {
      handler: function () {
        this.localButton = cloneDeep(this.theButton);
      },
      deep: true
    },
    localButton: {
      handler: function () {
        if (!isEqual(this.localButton, this.theButton)) {
          this.theButton = this.localButton;
        }
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters([
      'currentPage'
    ]),

    theButton: {
      get() {
        return this.currentPage.submitButton;
      },

      set(button) {
        this[ACTIONS.UPDATE_SUBMIT_BUTTON](button);
      }
    }
  },

  validations: {
    localButton: {
      text: {
        required,
      }
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.applyToButton {
  display: flex;
  justify-content: flex-end;
}

</style>

<template>
  <el-dialog :class="$style.wrapper"
             :close-on-click-modal="false"
             :visible.sync="visible"
             title="编辑多级下拉"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theForm"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item prop="titleText">
        <div slot="label">选项标题
          <span :class="$style.tips">
            （以<span :class="$style.splitter">/</span>分隔的各级标题，最多支3个层级）
          </span>
        </div>
        <el-input v-model="theForm.titleText"
                  :class="$style.theInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="省份/城市/区县"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item prop="optionText">
        <div slot="label">选项数据
          <span :class="$style.tips">
            （以<span :class="$style.splitter">/</span>分隔的各级选项数据，选项数据与选项标题需各级分别对应；
            如果需要对选项赋值，可在每行末尾加上数字，文本和数字之间需用<span :class="$style.splitter">:</span>分隔）
          </span>
        </div>
        <el-input v-model="theForm.optionText"
                  :class="$style.theInput"
                  :maxlength="10000"
                  :rows="20"
                  :spellcheck="false"
                  placeholder="广东省/深圳市/福田区
广东省/深圳市/罗湖区
广东省/广州市/荔湾区
四川省/成都市/双流区:123
四川省/成都市/青羊区:345"
                  size="medium"
                  type="textarea">
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消编辑
      </el-button>
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        完成编辑
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    control: {
      type: Object,
      required: true,
    },

    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      visible: this.show,
      theForm: {
        titleText: null,
        optionText: null,
      },

      rules: {
        titleText: [
          {max: 50, message: '选项标题长度不能超过50个字符', trigger: 'change'},
        ],
        optionText: [
          {max: 10000, message: '选项数据长度不能超过10000个字符', trigger: 'change'},
        ]
      }
    };
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    init() {
      this.theForm.titleText = this.control.titleText;
      this.theForm.optionText = this.control.optionText;
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.control.titleText = this.theForm.titleText;
        this.control.optionText = this.theForm.optionText;
        this.visible = false;
      });
    },

    cancel() {
      this.visible = false;
    }

  },
}
</script>


<style lang="scss" module>
.theInput {
  width: 100%;
}

.tips {
  color: $secondaryTextColor;
  font-size: 13px;
}

.splitter {
  color: red;
  font-weight: 600;
  padding-left: 2px;
  padding-right: 2px;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


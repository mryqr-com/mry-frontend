<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>

    <div class="singleLineTitle marginTop10">编辑内容</div>

    <StyledButton @click="openDialog">
      在富文本编辑器中打开
    </StyledButton>

    <DialogedRichTextInput v-model="value.content"
                           :oss-request="appEditOssRequest"
                           :show.sync="dialogVisible"
                           :title="value.name">
    </DialogedRichTextInput>
  </div>
</template>

<script>
import DialogedRichTextInput from '@/common/components/DialogedRichTextInput';
import {createNamespacedHelpers} from "vuex";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    DialogedRichTextInput,
  },


  data() {
    return {
      dialogVisible: false,
    }
  },

  computed: {
    ...mapGetters([
      'appEditOssRequest'
    ]),
  },

  methods: {
    openDialog() {
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

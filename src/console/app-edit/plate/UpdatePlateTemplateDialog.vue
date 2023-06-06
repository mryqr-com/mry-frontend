<template>
  <el-dialog :append-to-body="true"
             :modal-append-to-body="true"
             :visible.sync="visible"
             title="码牌模板设置"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">
    <div class="marginBottom5">码牌图片</div>
    <SingleFileUploader v-model="theModel.image"
                        :dnd="false"
                        :imageOnly="true"
                        :ossRequest="appEditOssRequest"
                        buttonText="上传图片">
    </SingleFileUploader>

    <div class="marginBottom5 marginTop30">显示顺序（越大显示越靠前）</div>
    <el-input-number v-model="theModel.order"
                     :class="$style.orderInput"
                     :max="100000"
                     :min="-100000"
                     :step="1"
                     :stepStrictly="true"
                     controls-position="right"
                     size="medium"
                     title="顺序，越大显示越靠前">
    </el-input-number>

    <div slot="footer" :class="$style.footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import SingleFileUploader from '@/common/components/SingleFileUploader';
import plateTemplateApi from "@/common/api/plate-template-api";
import {createNamespacedHelpers} from "vuex";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    plateTemplate: {
      type: Object,
    },
  },

  components: {
    SingleFileUploader,
  },

  data() {
    return {
      visible: this.show,
      theModel: {
        image: null,
        order: 0,
      },
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...mapGetters([
      'appEditOssRequest'
    ]),
  },

  methods: {
    init() {
      this.theModel.image = this.plateTemplate.image;
      this.theModel.order = this.plateTemplate.order;
    },

    onSubmit() {
      return plateTemplateApi.updatePlateTemplate(this.plateTemplate.id, this.theModel).then(() => {
        this.$message({
          type: 'success',
          message: `更新成功。`,
          center: true
        });
        this.plateTemplate.image = this.theModel.image;
        this.plateTemplate.order = this.theModel.order;
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
.wrapper {
}

.orderInput {
  width: 100%;
}

.footer {
  margin-top: 20px;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


<template>
  <el-dialog :class="$style.wrapper"
             :title="`为${assignmentPlan.name}排除${groupDesignation}`"
             :visible.sync="visible"
             width="600px"
             @close="$emit('update:show', false)"
             @open="init">

    <div>排除{{ groupDesignation }}：</div>
    <el-select ref="excludedGroupSelect"
               v-model="internalExcludedGroupIds"
               :class="$style.theInput"
               :multiple-limit="200"
               :placeholder="`请选择需要排除的${groupDesignation}`"
               filterable
               multiple
               size="medium"
               @change="collapseDropdown('excludedGroupSelect')">
      <el-option v-for="group in groupReferences"
                 :key="group.id"
                 :label="group.name"
                 :value="group.id">
      </el-option>
    </el-select>

    <div class="marginTop10">{{ groupDesignation }}被排除后，系统将不再为其创建任务。</div>

    <div slot="footer">
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
import {createNamespacedHelpers} from 'vuex';
import {cloneDeep} from 'lodash-es';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    assignmentPlan: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      internalExcludedGroupIds: [],
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['groupDesignation', 'groupReferences']),
  },

  methods: {
    init() {
      this.internalExcludedGroupIds = cloneDeep(this.assignmentPlan.excludedGroups);
    },

    onSubmit() {
      this.$emit('updated', this.internalExcludedGroupIds);
      this.visible = false;
    },

    cancel() {
      this.visible = false;
    },

    collapseDropdown(select) {
      let _this = this;
      setTimeout(function () {
        _this.$refs[select].blur();
      }, 50);
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 15px;
    }
  }
}

.theInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

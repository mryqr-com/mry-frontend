<template>
  <el-dialog :class="$style.wrapper"
             :title="theTitle"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item label="管理员（最多10名）：">
        <el-select ref="managerSelect"
                   v-model="theModel.managers"
                   :class="$style.theInput"
                   :multiple-limit="10"
                   filterable
                   multiple
                   placeholder="请选择管理员"
                   size="medium"
                   title="请选择应用管理员"
                   @change="collapseDropdown('managerSelect')">
          <el-option
              v-for="member in allMembers"
              :key="member.id"
              :label="member.showName"
              :value="member.id">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>

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
import appApi from '@/common/api/app-api';
import memberApi from '@/common/api/member-api';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    app: {
      type: Object,
    },
  },

  data() {
    return {
      visible: this.show,
      theModel: {
        managers: [],
      },
      allMembers: [],
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    init() {
      this.theModel.managers = [];

      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = members;
        return appApi.listAppManagers(this.app.id).then((response) => {
          this.theModel.managers = response.data;
        });
      });
    },

    onSubmit() {
      this.visible = false;

      return appApi.setAppManagers(this.app.id, this.theModel).then(() => {
        this.$message({
          type: 'success',
          message: `应用管理员设置成功。`,
          center: true
        });
      });
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

  computed: {
    theTitle() {
      return `为【${this.app.name}】设置管理员`
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

.theInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


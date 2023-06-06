<template>
  <div v-if="loaded" :class="$style.wrapper">
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item label="姓名：" prop="name">
        <el-input v-model="theModel.name"
                  :class="$style.commonInput"
                  :maxlength="50"
                  :spellcheck="false"
                  size="medium"
                  title="姓名">
        </el-input>
      </el-form-item>

    </el-form>

    <el-button :class="$style.saveButton"
               icon="el-icon-check"
               size="medium"
               type="primary"
               @click="onSubmit">
      保存
    </el-button>

  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import memberApi from '@/common/api/member-api';

export default {
  data() {
    return {
      theModel: {
        name: null,
      },
      loaded: false,
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'change'},
          {max: 50, message: '姓名不能超过50个字符', trigger: 'change'},
        ],
      }
    }
  },

  created() {
    this.theModel.name = this.currentMemberName;
    this.loaded = true;
  },

  computed: {
    ...mapGetters(['currentMemberName'])
  },

  methods: {
    ...mapMutations(['updateMemberName']),

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        return memberApi.updateMyBaseSetting(this.theModel).then(() => {
          this.updateMemberName(this.theModel.name);
          this.$message({
            type: 'success',
            message: `基本设置更新成功。`,
            center: true
          });
        });
      });
    },
  },
}
</script>


<style lang="scss" module>
.wrapper {

}

.commonInput {
  width: 300px;
}

.saveButton {
  margin-top: 24px;
  width: $pageButtonWidth;
}

</style>

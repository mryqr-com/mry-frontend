<template>
  <div :class="$style.wrapper">
    <div :class="$style.title">基本设置</div>

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item label="姓名：" prop="name">
        <el-input ref="nameBox"
                  v-model="theModel.name"
                  :class="$style.commonInput"
                  :maxlength="50"
                  :spellcheck="false"
                  title="姓名">
        </el-input>
      </el-form-item>
    </el-form>

    <div :class="$style.buttonArea">
      <el-button :class="$style.aButton"
                 icon="el-icon-close"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>

      <el-button :class="$style.aButton"
                 icon="el-icon-check"
                 type="primary"
                 @click="onSubmit">
        保存
      </el-button>
    </div>
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

      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'change'},
          {max: 50, message: '姓名不能超过50个字符', trigger: 'change'},
        ],
      }
    }
  },

  created() {
    this.theModel.name = this.memberName;
  },

  computed: {
    ...mapGetters(['memberName'])
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
            duration: 2000,
            center: true
          });
          this.$router.push({name: 'client-me'});
        });
      });
    },

    cancel() {
      this.$router.push({name: 'client-me'});
    }
  },
}
</script>


<style lang="scss" module>
.wrapper {
  padding: 15px;
  height: 100%;
  background-color: white;
  position: relative;
  z-index: $clientPageZIndex;
}

.title {
  font-size: 18px;
  font-weight: 500;
  margin-top: 15px;
  margin-bottom: 10px;
}

.commonInput {
  width: 100%;
}

.buttonArea {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.aButton {
  width: $pageButtonWidth;
}

</style>

<template>
  <div :class="$style.wrapper">
    <el-button :class="$style.addButton"
               :disabled="isAttributeFull"
               :title="buttonTitle"
               icon="el-icon-plus"
               plain
               size="medium"
               type="primary"
               @click="showDialog">
      新建属性
    </el-button>

    <AttributeEditDialog :attribute="newAttribute"
                         :isNew="true"
                         :show.sync="dialogVisible"
                         @updated="addAttribute">
    </AttributeEditDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import uuid from 'short-uuid';
import AttributeEditDialog from '@/console/app-edit/attribute/AttributeEditDialog';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {AttributeEditDialog},
  data() {
    return {
      dialogVisible: false,
      newAttribute: {},
    }
  },

  computed: {
    ...mapGetters([
      'isAttributeFull',
    ]),

    buttonTitle() {
      return this.isAttributeFull ? '当前属性列表已经超过最大可添加属性数量(20个)，无法继续添加' : '添加属性';
    }
  },

  methods: {
    ...mapActions([ACTIONS.ADD_ATTRIBUTE,]),

    showDialog() {
      this.newAttribute = {
        id: 'a_' + uuid.generate(),
        name: null,
        type: null,
        fixedValue: null,
        manualInput: true,
        pageId: null,
        controlId: null,
        range: null,
        pcListEligible: true,
        mobileListEligible: false,
        kanbanEligible: false,
        suffix: null,
        precision: 0,
        valueType: 'TEXT_VALUE',
      };

      this.dialogVisible = true;
    },

    addAttribute(attribute) {
      this[ACTIONS.ADD_ATTRIBUTE](attribute)
          .catch((error) => {
            this.$message({
              type: 'error',
              message: error.message ? error.message : error,
              center: true
            });
          });
    },

  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.addButton {
  width: $pageButtonWidth;
}

</style>

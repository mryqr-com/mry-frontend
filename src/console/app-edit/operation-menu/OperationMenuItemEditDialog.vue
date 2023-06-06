<template>
  <el-dialog :title="isNew? '新建运营菜单项':'编辑运营菜单项'"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="internalItem"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="name-item" label="菜单项名称：" prop="name">
        <el-input ref="nameBox"
                  v-model.trim="internalItem.name"
                  :class="$style.fieldInput"
                  :maxlength="10"
                  :spellcheck="false"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item ref="page-id-item" label="引用页面：" prop="pageId">
        <el-select v-model="internalItem.pageId"
                   :class="$style.fieldInput"
                   size="medium"
                   @change="onPageChange()">
          <el-option
              v-for="page in allPages"
              :key="page.id"
              :label="page.name"
              :value="page.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="type-item" label="菜单项类型：" prop="type">
        <el-select v-model="internalItem.type"
                   :class="$style.fieldInput"
                   :disabled="!internalItem.pageId"
                   no-data-text="无可选类型，所选引用页面的所有类型均被占用"
                   size="medium">
          <el-option
              v-for="type in selectableMenuItemTypes"
              :key="type.type"
              :label="type.text"
              :value="type.type">
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
import {createNamespacedHelpers} from 'vuex';
import {cloneDeep} from 'lodash-es';
import submissionListTypes from '@/console/app-edit/operation-menu/submission-list-types';

const {mapState, mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    item: {
      type: Object,
      required: true
    },

    isNew: {
      type: Boolean,
      required: true,
    },
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  data() {
    return {
      visible: this.show,
      internalItem: {},
      rules: {
        name: [
          {required: true, message: '请输入菜单项名称', trigger: 'change'},
          {max: 10, message: '菜单项名称不能超过10个字符', trigger: 'change'},
          {validator: this.noDuplicatedName, trigger: 'change'}
        ],
        pageId: [
          {required: true, message: '引用页面不能为空', trigger: 'change'},
        ],
        type: [
          {required: true, message: '菜单项类型不能为空', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    ...mapGetters([
      'allPageSummaries',
      'allOperationMenuItems',
    ]),

    allPages() {
      return [{id: 'ALL', name: '全部页面'}, ...this.allPageSummaries];
    },

    alreadyOccupiedTypes() {
      if (!this.internalItem.pageId) {
        return [];
      }

      return this.allOperationMenuItems.filter(item => {
        return item.pageId === this.internalItem.pageId && item.id !== this.internalItem.id;
      }).map(item => {
        return item.type;
      });

    },

    selectableMenuItemTypes() {
      return submissionListTypes.filter(item => {
        return !this.alreadyOccupiedTypes.includes(item.type);
      });
    },
  },

  methods: {
    noDuplicatedName(rule, value, callback) {
      let isDuplicated = this.allOperationMenuItems.filter(item => {
        return item.name === value && item.id !== this.internalItem.id;
      }).length > 0;

      if (isDuplicated) {
        callback(new Error('名称已被占用'));
      } else {
        callback();
      }
    },

    onPageChange() {
      this.internalItem.type = null;
      this.$nextTick(() => {
        if (this.$refs['type-item']) this.$refs['type-item'].clearValidate();
      });
    },

    initDialog() {
      this.internalItem = cloneDeep(this.item);
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      this.$refs['theForm'].validate().then(() => {
        this.$emit("updated", this.internalItem);
        this.visible = false;
      }).catch(e => {
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

.fieldInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

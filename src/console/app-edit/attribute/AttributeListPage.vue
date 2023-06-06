<template>
  <div :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">
        属性列表
        <HelpDocLinker url="//docs.mryqr.com/app-design/attributes"></HelpDocLinker>
      </div>

      <div :class="$style.opsButtons">
        <AttributeAddButton :class="$style.addButton"></AttributeAddButton>
      </div>
    </div>

    <div :class="$style.tableHeader">
      <div :class="$style.headerColumn">属性名称</div>
      <div :class="$style.headerColumn">属性类型</div>
      <div :class="$style.headerColumn">引用页面</div>
      <div :class="$style.headerColumn">引用控件</div>
      <div :class="$style.headerColumn">统计范围</div>
      <div :class="$style.headerColumn" :title="`是否在电脑端${instanceDesignation}列表中显示`">电脑端列表显示</div>
      <div :class="$style.headerColumn" :title="`是否在手机端${instanceDesignation}列表中显示`">手机端列表显示</div>
      <div :class="$style.headerColumn" title="是否在手机端应用首页显示为状态看板">看板显示</div>
      <div :class="[$style.headerColumn,$style.opsHeader]">操作</div>
    </div>

    <div v-if="allAttributes.length ===0" :class="$style.emptyHolder" :style="contentHeightStyle">
      暂无自定义属性，请点击右上角"新建属性"按钮以创建
    </div>

    <draggable v-else
               v-model="attributes"
               :class="$style.attributeList"
               :handle="'.' + $style.dragHandle"
               :style="contentHeightStyle"
               animation="200"
               tag="div">

      <div v-for="attribute in attributes" :key="attribute.id" :class="$style.attributeRow">
        <div :class="$style.attributeColumn">
          <ThreeBarIcon :class="$style.dragHandle"
                        title="上下拖动移位">
          </ThreeBarIcon>
          {{ attribute.name }}
        </div>
        <div :class="$style.attributeColumn">{{ attributeTypeNameOf(attribute.type) }}</div>
        <div :class="$style.attributeColumn">{{ pageNameOf(attribute.pageId) }}</div>
        <div :class="$style.attributeColumn">{{ controlFieldNameOf(attribute.controlId) }}</div>
        <div :class="$style.attributeColumn">{{ rangeNameOf(attribute.range) }}</div>
        <div :class="$style.attributeColumn">{{ attribute.pcListEligible ? '是' : '否' }}</div>
        <div :class="$style.attributeColumn">{{ attribute.mobileListEligible ? '是' : '否' }}</div>
        <div :class="$style.attributeColumn">{{ attribute.kanbanEligible ? '是' : '否' }}</div>
        <div :class="[$style.attributeColumn,$style.opsColumn]">
          <el-button size="medium"
                     type="text"
                     @click.stop="openUpdateDialog(attribute)">
            编辑
          </el-button>
          <el-button size="medium"
                     type="text"
                     @click.stop="deleteAttribute(attribute)">
            删除
          </el-button>
        </div>
      </div>
    </draggable>

    <AttributeEditDialog :attribute="attributeForUpdate"
                         :isNew="false"
                         :show.sync="dialogVisible"
                         @updated="updateAttribute">
    </AttributeEditDialog>
  </div>
</template>

<script>
import AttributeAddButton from '@/console/app-edit/attribute/AttributeAddButton';
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import draggable from 'vuedraggable';
import AttributeEditDialog from '@/console/app-edit/attribute/AttributeEditDialog';
import ranges from '@/console/app-edit/attribute/attribute-statistic-ranges';

const {mapGetters, mapState, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    AttributeAddButton,
    AttributeEditDialog,
    draggable
  },

  data() {
    return {
      dialogVisible: false,
      attributeForUpdate: {},
    }
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_ATTRIBUTES,
      ACTIONS.UPDATE_ATTRIBUTE,
      ACTIONS.DELETE_ATTRIBUTE
    ]),

    rangeNameOf(rangeKey) {
      let range = ranges.find(r => r.key === rangeKey);
      return range ? range.name : '';
    },

    openUpdateDialog(attribute) {
      this.attributeForUpdate = attribute;
      this.dialogVisible = true;
    },

    deleteAttribute(attribute) {
      this.$confirm(`确认删除属性【${attribute.name}】？`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this[ACTIONS.DELETE_ATTRIBUTE](attribute)
            .catch((error) => {
              this.$message({
                type: 'error',
                showClose: true,
                duration: 5000,
                message: error.message ? error.message : error,
                center: true
              });
            });
      }).catch(_ => {
      });
    },

    updateAttribute(attribute) {
      this[ACTIONS.UPDATE_ATTRIBUTE](attribute)
          .catch((error) => {
            this.$message({
              type: 'error',
              message: error.message ? error.message : error,
              center: true
            });
          });
    }
  },

  computed: {
    ...mapGetters([
      'allAttributes',
      'pageNameOf',
      'controlFieldNameOf',
      'attributeTypeNameOf',
      'instanceDesignation'
    ]),

    attributes: {
      get() {
        return this.allAttributes;
      },
      set(attributes) {
        this[ACTIONS.UPDATE_ATTRIBUTES](attributes);
      }
    },

    contentHeightStyle() {
      return {
        height: window.innerHeight - 60 - 24 - 60 - 5 - 24 - 48 + 'px'
      }
    },

  },

}
</script>


<style lang="scss" module>
$content-margin: 24px;
$ops-bar-height: 60px;
$ops-bar-margin-bottom: 5px;


.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin});
  margin: $content-margin;
}

.opsBar {
  padding: 0 16px;
  height: $ops-bar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $whiteBackgroundColor;
  margin-bottom: $ops-bar-margin-bottom;
}

.theTitle {
  font-weight: 500;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.addButton {
  margin-left: 16px;
}

.tableHeader {
  background-color: $whiteBackgroundColor;
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #EBEEF5;
  padding: 0 24px;
}

.headerColumn {
  flex-grow: 1;
  flex-basis: 100px;
  font-weight: 500;
  color: $primaryTextColor;
  margin-right: 10px;
}

.opsHeader {
  flex-grow: 0;
}

.emptyHolder {
  background-color: $whiteBackgroundColor;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attributeList {
  background-color: $whiteBackgroundColor;
  overflow-y: auto;
}

.attributeRow {
  border-bottom: 1px solid #EBEEF5;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.attributeRow:hover {
  background-color: #F5F7FA;
}

.dragHandle {
  cursor: move;
  margin-right: 10px;
}

.attributeColumn {
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-basis: 100px;
  margin-right: 10px;
  line-height: 1.3em;
}

.opsColumn {
  display: flex;
  align-items: center;
  flex-grow: 0;
}

</style>

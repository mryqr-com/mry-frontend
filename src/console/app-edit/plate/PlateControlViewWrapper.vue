<template>
  <div :class="[activeClass, $style.wrapper]" @click.stop="activateMe">
    <div :class="$style.deleteIcon" @click.stop="deleteMe">
      <i class="el-icon-close" title="删除"></i>
    </div>
    <component :is="control.type" :control="control" :style="controlStyle"/>
  </div>
</template>

<script>
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {createNamespacedHelpers} from 'vuex';
import SingleRowTextView from '@/console/app-edit/plate/control/singlerowtext/SingleRowTextView';
import TableView from '@/console/app-edit/plate/control/table/TableView';
import QrImageView from '@/console/app-edit/plate/control/qrimage/QrImageView';
import KeyValueView from '@/console/app-edit/plate/control/keyvalue/KeyValueView';
import HeaderImageView from '@/console/app-edit/plate/control/headerimage/HeaderImageView';
import {borderRadiusStyles, borderStyles} from "@/common/utils/common-utils";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    control: {
      type: Object,
      required: true
    },
  },

  components: {
    SINGLE_ROW_TEXT: SingleRowTextView,
    QR_IMAGE: QrImageView,
    TABLE: TableView,
    KEY_VALUE: KeyValueView,
    HEADER_IMAGE: HeaderImageView,
  },

  computed: {
    ...appEditStore.mapGetters([
      'currentPlateControlId',
    ]),

    activeClass() {
      return this.control.id === this.currentPlateControlId ? this.$style.active : null;
    },

    controlStyle() {
      return {
        ...borderStyles(this.control.border),
        backgroundColor: this.control.backgroundColor,
        ...borderRadiusStyles(this.control.borderRadius),
        marginTop: this.control.marginTop + 'px',
        marginBottom: this.control.marginBottom + 'px',
        marginLeft: this.control.marginLeft + 'px',
        marginRight: this.control.marginRight + 'px',

        paddingTop: this.control.paddingTop + 'px',
        paddingBottom: this.control.paddingBottom + 'px',
        paddingLeft: this.control.paddingLeft + 'px',
        paddingRight: this.control.paddingRight + 'px',
      }
    }
  },
  methods: {
    ...appEditStore.mapActions([
      ACTIONS.SET_CURRENT_PLATE_CONTROL,
      ACTIONS.DELETE_PLATE_CONTROL,
    ]),

    activateMe() {
      this[ACTIONS.SET_CURRENT_PLATE_CONTROL]({
        currentEditType: 'PLATE_CONTROL',
        currentControlId: this.control.id
      });
    },

    deleteMe() {
      this.$confirm(`确认删除该控件？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this[ACTIONS.DELETE_PLATE_CONTROL](this.control.id);
      }).catch(_ => {
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: grab;
  background-color: transparent;
  position: relative;
}

.wrapper:hover {
  outline: 1px dashed $primaryThemeColor !important;
  z-index: 10000 !important;
}

.wrapper:hover .deleteIcon {
  display: block;
}

.wrapper::after, .wrapper::before {
  display: table;
  content: '';
}

.active {
  position: relative;
  z-index: 10000 !important;
  outline: 1px dashed $primaryThemeColor !important;
}

.deleteIcon {
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
}

.deleteIcon:hover {
  color: $rejectRed;
}

</style>

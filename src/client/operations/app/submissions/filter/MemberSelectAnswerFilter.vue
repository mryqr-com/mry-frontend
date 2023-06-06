<template>
  <div :class="$style.wrapper">
    <div :class="$style.filterTitle">{{ fieldName }}</div>
    <el-select :key="keepStateKey"
               ref="theSelect"
               v-model="localOptions"
               :class="$style.inputSelect"
               filterable
               multiple
               size="small"
               @change="onOptionChanged('theSelect')"
               @focus="onFocus">
      <el-option
          v-for="member in allMembers"
          :key="member.id"
          :label="member.showName"
          :value="member.id">
        <span style="float: left">{{ member.showName }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import memberApi from "@/common/api/member-api";
import {controlFieldName} from "@/common/utils/common-utils";

const clientSubmissionListStore = createNamespacedHelpers('CLIENT_SUBMISSION_LIST_STORE');

export default {
  props: ['control'],

  data() {
    return {
      allMembers: []
    }
  },

  computed: {
    ...clientSubmissionListStore.mapState([
      'filterables',
      'keepStateKey',
    ]),

    fieldName() {
      return controlFieldName(this.control)
    },

    localOptions: {
      get() {
        return this.filterables.get(this.control.id);
      },

      set(options) {
        let filterable = new Map();
        filterable.set(this.control.id, options);
        this.updateFilterables(filterable);
      }
    }
  },

  methods: {
    ...clientSubmissionListStore.mapMutations([
      'resetInfinite',
      'updateFilterables',
    ]),

    onFocus() {
      if (this.allMembers.length > 0) {
        return;
      }

      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = members;
      });
    },

    onOptionChanged(select) {
      this.resetInfinite();
      let _this = this;
      setTimeout(function () {
        _this.$refs[select].blur();
      }, 50);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.filterTitle {
  font-size: 13px;
  margin-bottom: 5px;
}

.inputSelect {
  width: 100%;
}
</style>

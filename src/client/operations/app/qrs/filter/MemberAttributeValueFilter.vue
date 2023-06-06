<template>
  <div :class="$style.wrapper">
    <div :class="$style.filterTitle">{{ attribute.name }}</div>
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

const clientQrListStore = createNamespacedHelpers('CLIENT_QR_LIST_STORE');

export default {
  props: ['attribute', 'refControl'],

  data() {
    return {
      allMembers: []
    }
  },

  computed: {
    ...clientQrListStore.mapState([
      'filterables',
      'keepStateKey',
    ]),

    localOptions: {
      get() {
        return this.filterables.get(this.attribute.id);
      },

      set(options) {
        let filterable = new Map();
        filterable.set(this.attribute.id, options);
        this.updateFilterables(filterable);
      }
    }
  },

  methods: {
    ...clientQrListStore.mapMutations([
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

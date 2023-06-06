<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <template v-if="isKanbanAllowed">
      <component :is="attribute.valueType"
                 v-if="loaded"
                 :counts="counts"
                 :refControl="refControl"
                 @optionClicked="gotoQrList">
      </component>

      <div v-else :class="$style.loadingMask">
        <template v-if="loadFailed">
          加载失败
          <el-button class="marginLeft5" type="text" @click="fetchData">重新加载</el-button>
        </template>
        <template v-else>
          <i :class="$style.loadingIcon" class="el-icon-loading"></i>加载中...
        </template>
      </div>
    </template>

    <div v-else :class="$style.packagesNotAllowed">您当前账户的有效套餐版本过低，无法使用状态看板功能，请联系管理员升级或续费。</div>
  </div>
</template>

<script>
import kanbanApi from '@/common/api/kanban-api';
import {createNamespacedHelpers, mapGetters} from "vuex";
import ItemStatusKanban from '@/client/operations/app/kanban/ItemStatusKanban';
import PointCheckKanban from '@/client/operations/app/kanban/PointCheckKanban';
import DropdownKanban from '@/client/operations/app/kanban/DropdownKanban';
import RadioKanban from '@/client/operations/app/kanban/RadioKanban';
import CheckboxKanban from '@/client/operations/app/kanban/CheckboxKanban';
import CirculationStatusKanban from '@/client/operations/app/kanban/CirculationStatusKanban';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: ['groupId', 'attribute', 'refControl'],

  components: {
    ITEM_STATUS_VALUE: ItemStatusKanban,
    POINT_CHECK_VALUE: PointCheckKanban,
    DROPDOWN_VALUE: DropdownKanban,
    RADIO_VALUE: RadioKanban,
    CHECKBOX_VALUE: CheckboxKanban,
    CIRCULATION_STATUS_VALUE: CirculationStatusKanban,
  },

  data() {
    return {
      counts: null,
      loaded: false,
      loadFailed: false,
    }
  },

  created() {
    if (this.isKanbanAllowed) {
      return this.fetchData();
    }
  },

  computed: {
    ...mapGetters([
      'isKanbanAllowed',
    ]),

    ...clientAppOperationStore.mapGetters([
      'appId',
      'fetchCachedKanbanDataByKey',
      'appSetting'
    ]),

    wrapperStyle() {
      let singleRowHeight = 66;//通过计算一行为66px
      let height = singleRowHeight;
      if (this.refControl && this.refControl.options && this.refControl.type !== 'POINT_CHECK') {//用于Checkbox等有options的场景
        height = Math.ceil(this.refControl.options.length / 4) * singleRowHeight;
      } else if (this.attribute.valueType === 'CIRCULATION_STATUS_VALUE') {
        height = Math.ceil(this.appSetting.circulationStatusSetting.options.length / 4) * singleRowHeight;
      }

      return {
        height: height + 'px',
      }
    },
  },

  methods: {
    ...clientAppOperationStore.mapMutations([
      'loadKanbanDataCache',
    ]),

    fetchData() {
      this.counts = false;
      this.loaded = false;
      this.loadFailed = false;

      let command = {
        appId: this.appId,
        groupId: this.groupId === 'ALL' ? null : this.groupId,
        attributeId: this.attribute.id
      };

      let kanbanKey = command.appId + command.groupId + command.attributeId;

      let cachedCounts = this.fetchCachedKanbanDataByKey(kanbanKey);
      if (cachedCounts) {
        this.counts = cachedCounts;
        this.loaded = true;
        return;
      }

      return kanbanApi.fetchKanban(command).then(response => {
        this.counts = new Map(response.data.counts.map(it => [it.optionId, it.count]));
        this.loaded = true;
        this.loadKanbanDataCache({key: kanbanKey, data: this.counts});
      }).catch(e => {
        this.loadFailed = true;
      });
    },

    gotoQrList(optionId) {
      let filterable = new Map();
      filterable.set(this.attribute.id, optionId);
      let routeName = this.groupId === 'ALL' ? 'app-qrs' : 'client-group-operation-qr-list';
      this.$router.push({
        name: routeName,
        query: {initFilterableKey: this.attribute.id, initFilterableValue: optionId}
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.loadingMask {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $secondaryTextColor;
}

.loadingIcon {
  font-weight: normal;
  font-size: 20px;
  margin-right: 5px;
}

.packagesNotAllowed {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $secondaryTextColor;
  padding-left: 15px;
  padding-right: 15px;
  line-height: 1.6em;
}
</style>

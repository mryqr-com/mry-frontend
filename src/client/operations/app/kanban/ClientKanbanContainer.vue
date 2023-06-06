<template>
  <div :class="$style.wrapper">
    <div v-for="attribute in allKanbanAttributes"
         :key="attribute.id"
         :class="$style.aKanban">
      <div :class="$style.attributeName">{{ attribute.name }}</div>
      <ClientKanban :attribute="attribute"
                    :groupId="groupId"
                    :refControl="controlOf(attribute.controlId)">
      </ClientKanban>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import ClientKanban from '@/client/operations/app/kanban/ClientKanban';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },
  },

  components: {
    ClientKanban,
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'controlOf',
      'allKanbanAttributes',
    ]),
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.aKanban {
  background-color: white;
  border-top: $primary1pxBorder;
  border-bottom: $primary1pxBorder;
  margin-bottom: 10px;
  padding: 10px;
}

.aKanban:last-child {
  margin-bottom: 0;
}

.attributeName {
  color: $primaryTextColor;
  font-weight: 500;
  margin-bottom: 15px;
  font-size: 15px;
}

</style>

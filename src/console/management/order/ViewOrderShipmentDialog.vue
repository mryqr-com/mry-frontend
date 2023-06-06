<template>
  <el-dialog v-if="shipment"
             :append-to-body="true"
             :class="$style.wrapper"
             :visible.sync="visible"
             title="订单物流信息"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)">
    <div :class="$style.content">
      <div :class="$style.row">
        <span :class="$style.rowKey">订单号：</span>
        <span :class="$style.rowValue">
          {{ shipment.orderId }}
          <span v-if="shipment.signed" :class="$style.signed">（已签收）</span>
        </span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">物流承运商：</span>
        <span :class="$style.rowValue">
          <img :alt="shipment.carrierName" :class="$style.carrierLogo" :src="shipment.carrierLogo"/>
          {{ shipment.carrierName }}
          （{{ shipment.deliveryOrderId }}）
        </span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">物流更新时间：</span>
        <span :class="$style.rowValue">{{ shipment.updateTime }}</span>
      </div>
    </div>

    <el-timeline :class="$style.timeline">
      <el-timeline-item v-for="node in shipment.nodes"
                        :key="node.time"
                        :timestamp="node.time"
                        placement="top">
        <div :class="$style.node">{{ node.status }}</div>
      </el-timeline-item>
    </el-timeline>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="close">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    shipment: {
      type: Object,
    }
  },

  data() {
    return {
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    close() {
      this.visible = false;
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 10px;
    }
  }
}

.content {
  background-color: $lightBackgroundColor;
  padding: 15px;
}

.row {
  display: flex;
  margin-bottom: 5px;
}

.rowKey {
  width: 100px;
  text-align: right;
  flex-shrink: 0;
  flex-grow: 0;
  line-height: 1.6em;
}

.rowValue {
  margin-left: 10px;
  flex-grow: 1;
  line-height: 1.6em;
  color: $primaryTextColor;
}

.carrierLogo {
  max-width: 24px;
  max-height: 24px;
  vertical-align: middle;
}

.timeline {
  margin-top: 30px;
}

.node {
  line-height: 1.6em;
}

.signed {
  color: $passGreen;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


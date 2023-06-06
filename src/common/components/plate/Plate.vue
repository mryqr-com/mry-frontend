<template>
  <div ref="wrapper" :class="$style.wrapper" :style="wrapperStyle">
    <div v-for="(control,index) in plateSetting.controls" :key="control.id" :class="$style.content">
      <component :is="control.type"
                 :class="$style.aControl"
                 :control="control"
                 :qr="qr"
                 :style="controlStyle(index, control)"/>
    </div>
  </div>
</template>

<script>
import uuid from "short-uuid";
import {borderRadiusStyles, borderStyles, zoom} from "@/common/utils/common-utils";
import {imageDisplayUrl} from "@/common/utils/image-utils";
import SingleRowTextContainer from '@/common/components/plate/SingleRowTextContainer';
import KeyValueContainer from '@/common/components/plate/KeyValueContainer';
import QrImageContainer from '@/common/components/plate/QrImageContainer';
import TableContainer from '@/common/components/plate/TableContainer';
import HeaderImageContainer from '@/common/components/plate/HeaderImageContainer';

export default {
  props: {
    plateSetting: {
      type: Object,
      required: true,
    },

    qr: {
      type: Object,
      required: true,
    },

    scale: {
      type: Number,
      default: 1
    }
  },

  components: {
    SINGLE_ROW_TEXT: SingleRowTextContainer,
    QR_IMAGE: QrImageContainer,
    TABLE: TableContainer,
    KEY_VALUE: KeyValueContainer,
    HEADER_IMAGE: HeaderImageContainer,
  },

  data() {
    return {
      id: uuid.generate()
    }
  },

  mounted() {
    if (this.scale !== 1) {
      this.$nextTick(() => {
        let element = this.$refs.wrapper;
        zoom(element, this.scale);
      });
    }
  },

  computed: {
    plateConfig() {
      return this.plateSetting.config;
    },

    wrapperStyle() {
      return {
        width: this.plateConfig.width + 'px',
        height: this.plateConfig.height + 'px',
        borderRadius: this.plateConfig.borderRadius + 'px',
        padding: this.plateConfig.padding + 'px',
        backgroundColor: !this.plateConfig.backgroundImage && this.plateConfig.backgroundColor ?
            this.plateConfig.backgroundColor : 'white',
        backgroundImage: this.plateConfig.backgroundImage ?
            `url('${imageDisplayUrl(this.plateConfig.backgroundImage)}')` : 'none'
      }
    },
  },

  methods: {
    controlStyle(index, control) {
      return {
        zIndex: 10000 - index,
        ...borderStyles(control.border),
        backgroundColor: control.backgroundColor,
        ...borderRadiusStyles(control.borderRadius),

        marginTop: control.marginTop + 'px',
        marginBottom: control.marginBottom + 'px',
        marginLeft: control.marginLeft + 'px',
        marginRight: control.marginRight + 'px',

        paddingTop: control.paddingTop + 'px',
        paddingBottom: control.paddingBottom + 'px',
        paddingLeft: control.paddingLeft + 'px',
        paddingRight: control.paddingRight + 'px',
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  background-size: cover;
  background-position: center;
}

.content::after, .content::before {
  display: table;
  content: '';
}

.aControl {
  position: relative;
}
</style>

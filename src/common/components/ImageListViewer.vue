<template>
  <div :class="$style.wrapper">
    <div v-for="item in images"
         :key="item.id"
         :style="itemStyle">
      <img :class="$style.theImage"
           :src="imageDisplayUrl(item)"
           :style="imageStyle"
           alt="无法显示"/>
      <div v-if="showName" :class="$style.nameWrapper">
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {imageDisplayUrl} from '@/common/utils/image-utils'
import {borderStyles, shadowStyles} from '@/common/utils/common-utils';

export default {
  props: {
    images: {
      type: Array,
      required: true
    },

    showName: {
      type: Boolean,
      default: false
    },

    widthRatio: {
      type: Number,
      default: 100
    },

    verticalMargin: {
      type: Number,
      default: 0
    },

    borderRadius: {
      type: Number,
      default: 5
    },

    shadow: {
      type: Object,
      default: function () {
        return {
          width: 6,
          color: 'rgba(0, 0, 0, .3)'
        };
      }
    },

    border: {
      type: Object,
      default: function () {
        return {
          type: 'NONE',
          width: 1,
          sides: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
          color: 'rgba(220, 223, 230, 1)'
        };
      }
    }
  },

  computed: {
    itemStyle() {
      return {
        width: this.widthRatio + '%',
        marginBottom: this.verticalMargin + 'px'
      }
    },

    imageStyle() {
      return {
        ...{
          borderRadius: this.borderRadius + 'px',
        },
        ...shadowStyles(this.shadow),
        ...borderStyles(this.border)
      };
    }

  },

  methods: {
    imageDisplayUrl,
  }

}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}

.theImage {
  width: 100%;
}

.nameWrapper {
  font-size: 13px;
  text-align: center;
  margin-top: 5px;
}

</style>
'
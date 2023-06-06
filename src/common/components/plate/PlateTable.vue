<template>
  <div :class="$style.wrapper">
    <div v-if="control.headerEnabled"
         :class="$style.tableHeader"
         :style="tableHeaderStyle">
      {{ displayHeaderText }}
    </div>

    <div :class="$style.tableContent" :style="tableContentStyle">
      <div :style="keyColumnStyle">
        <div v-for="value in control.contentTextValues" :key="value.id" :class="$style.cell" :style="cellStyle">
          {{ valueNameOf(value.name) }}
        </div>
      </div>

      <div :class="$style.valueColumn">
        <div v-for="value in wholeRowTextValues" :key="value.id" :class="$style.cell" :style="cellStyle">
          {{ valueOf(value.id) }}
        </div>

        <div v-if="halfRowTextValues.length > 0" :class="$style.qrColumnWrapper">
          <div :class="$style.halfRowValueColumn">
            <div v-for="value in halfRowTextValues" :key="value.id" :class="$style.cell" :style="cellStyle">
              {{ valueOf(value.id) }}
            </div>
          </div>

          <div v-if="control.qrEnabled" :class="$style.qrContainer" :style="qrContainerStyle">
            <PlateQrImage :content="qrContent" :setting="control.qrImageSetting"></PlateQrImage>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {fontStyles, justifyContentOf} from "@/common/utils/common-utils";
import PlateQrImage from '@/common/components/plate/PlateQrImage';

export default {
  props: {
    control: {
      type: Object,
      required: true,
    },

    headerText: {
      type: String,
    },

    contentTexts: {
      type: Array,
    },

    qrContent: {
      type: String,
    },
  },

  components: {
    PlateQrImage,
  },

  computed: {
    displayHeaderText() {
      return this.headerText ? this.headerText : '未命名';
    },

    tableHeaderStyle() {
      return {
        ...fontStyles(this.control.headerFontStyle),
        justifyContent: justifyContentOf(this.control.headerAlignType),
        height: this.control.headerHeight + 'px',
        borderTop: this.border,
        borderLeft: this.border,
        borderRight: this.border,
      }
    },

    tableContentStyle() {
      return {
        border: this.border,
      }
    },

    keyColumnStyle() {
      return {
        borderRight: this.border,
        flexShrink: 0,
      }
    },

    cellStyle() {
      return {
        ...fontStyles(this.control.contentFontStyle),
        borderBottom: this.border,
        height: this.control.cellHeight + 'px',
      }
    },

    wholeRowTextValues() {
      if (!this.control.qrEnabled) {
        return this.control.contentTextValues;
      }

      let numberOfWholeRow = this.control.contentTextValues.length - this.control.qrRows;
      if (numberOfWholeRow < 0) {
        return [];
      }

      return this.control.contentTextValues.slice(0, numberOfWholeRow);
    },

    halfRowTextValues() {
      return this.control.contentTextValues.slice(this.wholeRowTextValues.length, this.control.contentTextValues.length);
    },

    border() {
      return `${this.control.borderWidth}px solid ${this.control.borderColor}`
    },

    qrContainerStyle() {
      return {
        borderLeft: this.border,
      }
    },
  },

  methods: {
    valueNameOf(name) {
      return name ? name : '未命名';
    },

    valueOf(id) {
      let item = this.contentTexts.find(text => text.id === id);
      return item ? item.text : '';
    }

  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.tableHeader {
  padding: 5px;
  display: flex;
  overflow: hidden;
  align-items: center;
}

.tableContent {
  display: flex;
}

.cell {
  display: flex;
  overflow: hidden;
  align-items: center;
  padding: 5px 10px 5px 5px;
}

.cell:last-child {
  border-bottom: none !important;
}

.valueColumn {
  flex-grow: 1;
}

.qrColumnWrapper {
  display: flex;
}

.halfRowValueColumn {
  flex-grow: 1;
}

.qrContainer {
  padding: 1px;
  display: flex;
  align-items: center;
  justify-items: center;
}

</style>

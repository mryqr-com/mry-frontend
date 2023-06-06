<template>
  <div :class="$style.wrapper">
    <div :class="$style.content" :style="contentStyle">
      <template v-if="control.nameSetting.position === 'TOP' && !control.nameSetting.hidden">
        <BoxedTextViewer :textStyle="control.nameSetting.textStyle">
          <span v-if="shouldCurrentPageShowControlIndex">{{ index + 1 }}.</span>
          {{ control.name }}
          <span v-if="shouldShowAsterisk" :class="$style.asterisk">*</span>
          <slot name="titleSuffix"></slot>
        </BoxedTextViewer>

        <BoxedTextViewer v-if="control.description"
                         :textStyle="control.descriptionStyle">
          {{ control.description }}
        </BoxedTextViewer>
      </template>

      <slot></slot>

      <template v-if="control.nameSetting.position === 'BOTTOM' && !control.nameSetting.hidden">
        <BoxedTextViewer :textStyle="control.nameSetting.textStyle">
          <span v-if="shouldCurrentPageShowControlIndex">{{ index + 1 }}.</span>
          {{ control.name }}
          <span v-if="shouldShowAsterisk" :class="$style.asterisk">*</span>
        </BoxedTextViewer>

        <BoxedTextViewer v-if="control.description"
                         :textStyle="control.descriptionStyle">
          {{ control.description }}
        </BoxedTextViewer>
      </template>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {borderRadiusStyles, borderStyles, shadowStyles} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: {
    control: {
      type: Object,
      required: true
    },

    index: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...clientQrStore.mapGetters([
      'shouldCurrentPageShowControlIndex',
      'shouldCurrentPageShowControlAsterisk'
    ]),

    contentStyle() {
      return {
        marginTop: this.control.styleSetting.topMargin + 'px',
        marginBottom: this.control.styleSetting.bottomMargin + 'px',
        backgroundColor: this.control.styleSetting.backgroundColor,
        paddingTop: this.control.styleSetting.vPadding + 'px',
        paddingBottom: this.control.styleSetting.vPadding + 'px',
        paddingLeft: this.control.styleSetting.hPadding + 'px',
        paddingRight: this.control.styleSetting.hPadding + 'px',
        ...shadowStyles(this.control.styleSetting.shadow),
        ...borderStyles(this.control.styleSetting.border),
        ...borderRadiusStyles(this.control.styleSetting.borderRadius),
      }
    },

    shouldShowAsterisk() {
      return this.shouldCurrentPageShowControlAsterisk
          && this.control.fillableSetting
          && this.control.fillableSetting.mandatory;
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
  padding-right: $narrowPageVPadding;
  padding-left: $narrowPageVPadding;
}

.wrapper::after, .wrapper::before {
  display: table;
  content: '';
}

.content {
  //overflow: hidden; //启用后，ClientDropdown的Multiselect无法撑开，故注释掉
}

.asterisk {
  color: red;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .wrapper {
    padding-right: $widePageVPadding;
    padding-left: $widePageVPadding;
  }

  .content {

  }
}

</style>

<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="$style.contentWrapper">
      <TiandituGeolocationInput v-model="answer.geolocation"
                                :allowManualPosition="control.allowRandomPosition"
                                :buttonStyle="control.buttonStyle"
                                :viewOnly="viewOnly">
      </TiandituGeolocationInput>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage v-if="hasRequiredError">
              请完成定位
            </ErrorMessage>

            <ErrorMessage v-if="hasOffsetError">
              定位偏离过大(超过了{{ control.offsetRestrictionRadius }}米)
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>

</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators';
import TiandituGeolocationInput from '@/common/components/geolocation/TiandituGeolocationInput';
import {createNamespacedHelpers} from "vuex";
import {distance} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  components: {TiandituGeolocationInput},

  computed: {
    ...clientQrStore.mapGetters(['qrGeolocation']),

    hasError() {
      return this.$v.answer.geolocation.$dirty && this.$v.answer.geolocation.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.geolocation.$dirty && !this.$v.answer.geolocation.point.longitude.required;
    },

    hasOffsetError() {
      return this.$v.answer.geolocation.$dirty && !this.$v.answer.geolocation.offsetValid;
    },
  },

  methods: {
    isOffsetValid(value) {
      if (!this.control.offsetRestrictionEnabled) {
        return true;
      }

      if (value && value.point && value.point.longitude && this.qrGeolocation && this.qrGeolocation.point && this.qrGeolocation.point.longitude) {
        return distance(value.point, this.qrGeolocation.point) < this.control.offsetRestrictionRadius;
      }

      return true;
    }
  },

  validations() {
    return {
      answer: {
        geolocation: {
          point: {
            longitude: {
              required: requiredIf(() => {
                return this.control.fillableSetting.mandatory;
              }),
            }
          },
          offsetValid: (value) => this.isOffsetValid(value)
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.contentWrapper {
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlContentWidth;
  }
}
</style>

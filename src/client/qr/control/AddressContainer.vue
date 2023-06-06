<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <div :class="$style.provinceRow">
        <ClientDropdown v-model="answer.address.province"
                        :class="$style.provinceSelect"
                        :filterable="false"
                        :options="currentSelectableProvinces"
                        :placeholder="viewOnly?'省份':'请选择省份'"
                        :viewOnly="viewOnly"
                        keyField="name"
                        labelField="name"
                        valueField="name"
                        @change="onProvinceChange">
        </ClientDropdown>
        <PlainButton v-if="control.positionable && !viewOnly"
                     :class="$style.positionButton"
                     :disabled="loading"
                     @click="position">
          <i v-if="!loading" class="el-icon-location-outline"></i>
          <i v-if="loading" class="el-icon-loading"></i>
          当前位置
        </PlainButton>
      </div>

      <ClientDropdown v-if="control.precision > 1"
                      v-model="answer.address.city"
                      :class="$style.hasMarginTop"
                      :filterable="false"
                      :options="currentSelectableCities"
                      :placeholder="viewOnly?'城市':'请选择城市'"
                      :viewOnly="viewOnly"
                      keyField="name"
                      labelField="name"
                      valueField="name"
                      @change="onCityChange">
      </ClientDropdown>

      <ClientDropdown v-if="control.precision > 2"
                      v-model="answer.address.district"
                      :class="$style.hasMarginTop"
                      :filterable="false"
                      :options="currentSelectableDistricts"
                      :placeholder="viewOnly?'区县':'请选择区县'"
                      :viewOnly="viewOnly"
                      keyField="name"
                      labelField="name"
                      valueField="name"
                      @change="onDistrictChange">
      </ClientDropdown>

      <el-input v-if="control.precision > 3"
                v-model="answer.address.address"
                :class="$style.hasMarginTop"
                :placeholder="viewOnly?'详细地址':'请输入街道/道路详细地址'"
                :spellcheck="false"
                type="textarea">
      </el-input>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage>
              {{ defaultErrorMessage }}
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>

    </div>
  </ControlWrapper>

</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators'
import commonApi from '@/common/api/common-api';
import {getCurrentGeolocation} from '@/common/utils/geolocation-utils'

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  data() {
    return {
      country: null,
      loading: false,
    }
  },

  methods: {
    position() {
      this.loading = true;
      getCurrentGeolocation().then(geolocation => {
        this.answer.address = geolocation.address;
      }).catch(() => {
        this.$message({
          type: 'error',
          message: `定位失败。`,
          center: true,
          duration: 1000,
        });
      }).finally(() => {
        this.loading = false;
      });
    },

    isComplete() {
      if (this.control.fillableSetting.mandatory) {
        return this.isValid();
      }

      return this.isValid() || this.isNotFilled;
    },

    isValid() {
      return this.isProvinceValid() &&
          this.isCityValid() &&
          this.isDistrictValid() &&
          this.isAddressValid();
    },

    isProvinceValid() {
      return !!this.answer.address.province;
    },

    isCityValid() {
      if (this.control.precision <= 1) {
        return true;
      }

      return !(!this.answer.address.city && this.currentSelectableCities.length > 0);
    },

    isDistrictValid() {
      if (this.control.precision <= 2) {
        return true;
      }
      return !(!this.answer.address.district && this.currentSelectableDistricts.length > 0);
    },

    isAddressValid() {
      if (this.control.precision <= 3) {
        return true;
      }

      return !!this.answer.address.address;
    },

    onProvinceChange() {
      this.answer.address.city = null;
      this.answer.address.district = null;
      this.answer.address.address = null;
    },

    onCityChange() {
      this.answer.address.district = null;
      this.answer.address.address = null;
    },

    onDistrictChange() {
      this.answer.address.address = null;
    },

  },

  mounted() {
    return commonApi.fetchAdministratives().then(response => {
      this.country = response.data;
    });
  },

  computed: {
    isNotFilled() {
      return !this.answer.address.province &&
          !this.answer.address.city &&
          !this.answer.address.district &&
          !this.answer.address.address;
    },

    currentSelectableProvinces() {
      if (!this.country) {
        return [];
      }

      return this.country.child.map(d => {
        return {name: d.name}
      });
    },

    currentSelectableCities() {
      if (!this.answer.address.province || !this.country) {
        return [];
      }

      let currentProvince = this.country.child.find(p => p.name === this.answer.address.province);

      if (!(currentProvince && currentProvince.child)) {
        return [];
      }

      return currentProvince.child.map(c => ({name: c.name}))
    },

    currentSelectableDistricts() {
      if (!this.answer.address.province || !this.answer.address.city || !this.country) {
        return [];
      }

      let currentProvince = this.country.child.find(p => p.name === this.answer.address.province);
      if (!(currentProvince && currentProvince.child)) {
        return [];
      }

      let currentCity = currentProvince.child.find(c => c.name === this.answer.address.city);
      if (!(currentCity && currentCity.child)) {
        return [];
      }

      return currentCity.child.map(c => ({name: c.name}))
    },

    hasError() {
      return this.$v.answer.$dirty && this.$v.answer.$invalid;
    },

    defaultErrorMessage() {
      if (!this.isProvinceValid()) {
        return '请填写完整地址';
      }

      if (!this.isCityValid()) {
        return '请选择城市';
      }

      if (!this.isDistrictValid()) {
        return '请选择区县';
      }

      if (!this.isAddressValid()) {
        return '请填写详细地址';
      }
    },
  },

  validations() {
    return {
      answer: {
        address: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          complete: () => this.isComplete(),
        }
      }
    }
  }

}
</script>

<style lang="scss" module>
.contentWrapper {
}


.viewOnlyControl {
  pointer-events: none;
}

.provinceRow {
  display: flex;
  justify-content: space-between;
}

.provinceSelect {
  flex-grow: 1;
}

.positionButton {
  flex-shrink: 0;
  width: 100px !important;
  margin-left: 10px;
  height: 36px !important;
  color: $regularTextColor !important;
}

.hasMarginTop {
  margin-top: 6px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlButtonWidth;
  }
}
</style>

<template>
  <el-dialog :class="$style.wrapper"
             :title="isNew? '新增收货地址':'编辑收货地址'"
             :visible.sync="visible"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="internalConsignee"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="name-item" label="收货人姓名：" prop="name">
        <el-input ref="nameBox"
                  v-model.trim="internalConsignee.name"
                  :class="$style.theInput"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item ref="mobile-item" label="收货人手机号：" prop="mobile">
        <el-input ref="mobileBox"
                  v-model.trim="internalConsignee.mobile"
                  :class="$style.theInput"
                  :maxlength="11"
                  :spellcheck="false"
                  :validate-event="validated"
                  size="medium"
                  type="tel">
        </el-input>
      </el-form-item>

      <el-form-item ref="address-item" label="收货人地址：" prop="address">
        <div :class="$style.addressSelectContainer">
          <el-select v-model="internalConsignee.address.province"
                     :class="$style.addressSelect"
                     placeholder="省份"
                     size="medium"
                     @change="onProvinceChange">
            <el-option v-for="province in allSelectableProvinces"
                       :key="province.name"
                       :label="province.name"
                       :value="province.name">
            </el-option>
          </el-select>

          <el-select v-model="internalConsignee.address.city"
                     :class="$style.addressSelect"
                     placeholder="城市"
                     size="medium"
                     @change="onCityChange">
            <el-option v-for="city in allSelectableCities"
                       :key="city.name"
                       :label="city.name"
                       :value="city.name">
            </el-option>
          </el-select>

          <el-select v-model="internalConsignee.address.district"
                     :class="$style.addressSelect"
                     placeholder="区县"
                     size="medium"
                     @change="onDistrictChange">
            <el-option v-for="district in allSelectableDistricts"
                       :key="district.name"
                       :label="district.name"
                       :value="district.name">
            </el-option>
          </el-select>
        </div>

        <el-input v-model="internalConsignee.address.address"
                  :maxlength="100"
                  :rows="3"
                  :spellcheck="false"
                  placeholder="详细地址"
                  size="medium"
                  type="textarea">
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {cloneDeep} from 'lodash-es';
import validations from "@/common/utils/validations";
import commonApi from '@/common/api/common-api';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    consignee: {
      type: Object,
      required: true
    },

    isNew: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      country: null,
      visible: this.show,
      validated: false,
      internalConsignee: {
        id: null,
        name: null,
        mobile: null,
        address: {
          province: null,
          city: null,
          district: null,
          address: null,
        }
      },

      rules: {
        name: [
          {required: true, message: '请输入收货人姓名', trigger: 'change'},
          {max: 50, message: '姓名不能超过50个字符', trigger: 'change'},
        ],

        mobile: [
          {required: true, message: '请输入收货人手机号', trigger: 'change'},
          {validator: validations.MOBILE_RULE, trigger: 'change'}
        ],

        address: [
          {validator: this.addressValidator, trigger: 'change'}
        ]
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  mounted() {
    return commonApi.fetchAdministratives().then(response => {
      this.country = response.data;
    });
  },

  computed: {
    allSelectableProvinces() {
      if (!this.country) {
        return [];
      }

      return this.country.child
          .filter(d => !['香港', '澳门', '台湾省'].includes(d.name))//不售港澳台
          .map(d => {
            return {name: d.name}
          });
    },

    allSelectableCities() {
      if (!this.internalConsignee.address.province || !this.country) {
        return [];
      }

      let currentProvince = this.country.child.find(p => p.name === this.internalConsignee.address.province);

      if (!(currentProvince && currentProvince.child)) {
        return [];
      }

      return currentProvince.child.map(c => ({name: c.name}))
    },

    allSelectableDistricts() {
      if (!this.internalConsignee.address.province || !this.internalConsignee.address.city || !this.country) {
        return [];
      }

      let currentProvince = this.country.child.find(p => p.name === this.internalConsignee.address.province);
      if (!(currentProvince && currentProvince.child)) {
        return [];
      }

      let currentCity = currentProvince.child.find(c => c.name === this.internalConsignee.address.city);
      if (!(currentCity && currentCity.child)) {
        return [];
      }

      return currentCity.child.map(c => ({name: c.name}))
    },

  },

  methods: {
    init() {
      this.validated = false;
      this.internalConsignee = cloneDeep(this.consignee);
      this.$nextTick(() => {
        this.$refs['theForm'].clearValidate();
      });
    },

    onProvinceChange() {
      this.internalConsignee.address.city = null;
      this.internalConsignee.address.district = null;
      this.internalConsignee.address.address = null;
    },

    onCityChange() {
      this.internalConsignee.address.district = null;
      this.internalConsignee.address.address = null;
    },

    onDistrictChange() {
      this.internalConsignee.address.address = null;
    },

    addressValidator(rule, value, callback) {
      if (!this.validated) {
        callback();
        return;
      }

      if (!this.isProvinceValid()) {
        callback(new Error('请填写收货地址'));
        return;
      }

      if (!this.isCityValid()) {
        callback(new Error('请选择城市'));
        return;
      }

      if (!this.isDistrictValid()) {
        callback(new Error('请选择区县'));
        return;
      }

      if (!this.isAddressDetailValid()) {
        callback(new Error('请填写详细地址'));
        return;
      }

      callback();
    },

    isProvinceValid() {
      return !!this.internalConsignee.address.province;
    },

    isCityValid() {
      return !(!this.internalConsignee.address.city && this.allSelectableCities.length > 0);
    },

    isDistrictValid() {
      return !(!this.internalConsignee.address.district && this.allSelectableDistricts.length > 0);
    },

    isAddressDetailValid() {
      return !!this.internalConsignee.address.address;
    },

    onSubmit() {
      this.validated = true;
      this.$refs['theForm'].validate().then(() => {
        if (this.isNew) {
          this.$emit("created", this.internalConsignee);
        } else {
          this.$emit("updated", this.internalConsignee);
        }
        this.visible = false;
      }).catch(e => {
      });
    },

    cancel() {
      this.visible = false;
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 15px;
    }

    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus {
      border-color: rgb(220, 223, 230) !important;
    }
  }
}

.theInput {
  width: 100%;
}

.addressSelectContainer {
  display: flex;
  margin-bottom: 10px;
}

.addressSelect {
  margin-right: 10px;
}

.addressSelect:last-child {
  margin-right: 0;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


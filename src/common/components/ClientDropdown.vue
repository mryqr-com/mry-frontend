<template>
  <div :class="[$style.wrapper,{[$style.viewOnlyControl]: viewOnly}]">
    <MobileDropdown v-if="isMobile() && !multiple && !filterable"
                    v-model="theModel"
                    :class="[$style.theDropdown]"
                    :placeholder="placeholder"
                    @change="onchange">
      <option v-for="option in options"
              :key="option[valueField]"
              :value="option[valueField]">
        {{ option[labelField] }}
      </option>
    </MobileDropdown>

    <Multiselect v-else-if="isMobile()"
                 v-model="theModel"
                 :class="[$style.theDropdown]"
                 :clear-on-select="!multiple"
                 :close-on-select="!multiple"
                 :custom-label="customLabel"
                 :max="multiple?max:false"
                 :multiple="multiple"
                 :options="options.map(type => type[valueField])"
                 :placeholder="placeholder"
                 :searchable="filterable"
                 :showLabels="false"
                 @input="onchange">
      <i slot="caret"
         slot-scope="{ toggle }"
         class="el-icon-arrow-down multiselect__select"
         @mousedown.prevent.stop="toggle">
      </i>
      <span slot="noResult">无匹配数据</span>
      <span slot="noOptions">无数据</span>
      <span slot="maxElements" :class="$style.maxError">{{ maxErrorMessage }}</span>
    </Multiselect>

    <el-select v-else
               v-model="theModel"
               :class="[$style.theDropdown,{[$style.viewOnlyElDropdown]: viewOnly}]"
               :filterable="filterable"
               :multiple="multiple"
               :multipleLimit="max"
               :placeholder="placeholder"
               @change="onchange">
      <el-option
          v-for="option in options"
          :key="option[valueField]"
          :label="option[labelField]"
          :value="option[valueField]">
      </el-option>
    </el-select>

  </div>
</template>

<script>
import {isMobileBrowser} from '@/common/utils/common-utils';

export default {
  components: {
    Multiselect: () => import(/* webpackChunkName: "vue-multiselect" */ 'vue-multiselect'),
  },

  props: {
    value: {
      type: [Array, String],
    },

    options: {
      type: Array,
      required: true
    },

    valueField: {
      type: String,
      required: true
    },

    keyField: {
      type: String,
      required: true
    },

    labelField: {
      type: String,
      required: true
    },

    multiple: {
      type: Boolean,
      default: false
    },

    filterable: {
      type: Boolean,
      default: false
    },

    viewOnly: {
      type: Boolean,
      default: false
    },

    max: {
      type: Number,
      default: 100,
    },

    placeholder: {
      type: String,
    },

    maxErrorMessage: {
      type: String,
      default: '已达最大选项数'
    },

  },

  methods: {
    onchange(value) {
      this.$emit('change', value);
    },

    isMobile() {
      return isMobileBrowser();
    },

    customLabel(value) {
      let option = this.options.find(x => x[this.valueField] === value);
      return option ? option[this.labelField] : '';
    }
  },

  computed: {
    theModel: {
      get: function () {
        return this.value
      },

      set: function (val) {
        this.$emit('input', val)
      }
    }
  }


}
</script>

<style lang="scss" module>
.wrapper {
}

.viewOnlyControl {
  pointer-events: none;
}

.theDropdown {
  width: 100%;
}

.viewOnlyElDropdown {
  :global {
    .el-input__suffix {
      display: none;
    }
  }
}

.maxError {
  color: red;
}

:global {

  fieldset[disabled] .multiselect {
    pointer-events: none
  }

  .multiselect__spinner {
    position: absolute;
    right: 1px;
    top: 1px;
    width: 48px;
    height: 35px;
    background: #fff;
    display: block
  }

  .multiselect__spinner:after, .multiselect__spinner:before {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border-color: $primaryThemeColor transparent transparent;
    border-style: solid;
    border-width: 2px;
    box-shadow: 0 0 0 1px transparent
  }

  .multiselect__spinner:before {
    animation: a 2.4s cubic-bezier(.41, .26, .2, .62);
    animation-iteration-count: infinite
  }

  .multiselect__spinner:after {
    animation: a 2.4s cubic-bezier(.51, .09, .21, .8);
    animation-iteration-count: infinite
  }

  .multiselect__loading-enter-active, .multiselect__loading-leave-active {
    transition: opacity .4s ease-in-out;
    opacity: 1
  }

  .multiselect__loading-enter, .multiselect__loading-leave-active {
    opacity: 0
  }

  .multiselect, .multiselect__input, .multiselect__single {
    font-family: inherit;
    font-size: 14px;
    -ms-touch-action: manipulation;
    touch-action: manipulation
  }

  .multiselect {
    box-sizing: content-box;
    display: block;
    position: relative;
    width: 100%;
    min-height: 36px;
    text-align: left;
    color: $regularTextColor
  }

  .multiselect * {
    box-sizing: border-box
  }

  .multiselect:focus {
    outline: none
  }

  .multiselect--disabled {
    opacity: .6
  }

  .multiselect--active {
    z-index: 1
  }

  .multiselect--active .multiselect__select {
    transform: rotate(180deg)
  }

  .multiselect__input, .multiselect__single {
    position: relative;
    display: inline-block;
    min-height: 20px;
    line-height: 20px;
    border: none;
    background: transparent;
    width: 100%;
    transition: border .1s ease;
    box-sizing: border-box;
    margin-bottom: 8px;
    vertical-align: top
  }

  .multiselect__input::-webkit-input-placeholder {
    color: $placeholderTextColor
  }

  .multiselect__input:-ms-input-placeholder {
    color: $placeholderTextColor
  }

  .multiselect__input::placeholder {
    color: $placeholderTextColor
  }

  .multiselect__tag ~ .multiselect__input, .multiselect__tag ~ .multiselect__single {
    width: auto
  }

  .multiselect__input:hover, .multiselect__single:hover {
    border-color: #cfcfcf
  }

  .multiselect__input:focus, .multiselect__single:focus {
    border-color: #a8a8a8;
    outline: none
  }

  .multiselect__single {
    margin-bottom: 8px
  }

  .multiselect__tags-wrap {
    display: inline
  }

  .multiselect__tags {
    min-height: $formPageInputHeight;
    display: block;
    padding: 10px $formPageInputHeight 0 7px;
    border: 1px solid #E4E7ED;
    background: transparent;
    font-size: 14px
  }

  .multiselect__tags:hover {
    border: 1px solid #C0C4CC;
    cursor: pointer;
  }

  .multiselect__tag {
    position: relative;
    display: inline-block;
    padding: 5px 26px 5px 10px;
    margin-right: 10px;
    font-size: 12px;
    color: #909399;
    line-height: 1;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    background-color: #f0f2f5;
  }

  .multiselect__tag-icon {
    cursor: pointer;
    margin-left: 7px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    font-weight: 700;
    font-style: normal;
    width: 22px;
    text-align: center;
    line-height: 22px;
    transition: all .2s ease;
  }

  .multiselect__tag-icon:after {
    content: "\D7";
    color: #909399;
    font-size: 14px
  }

  .multiselect__tag-icon:focus, .multiselect__tag-icon:hover {
  }

  .multiselect__tag-icon:focus:after, .multiselect__tag-icon:hover:after {
  }

  .multiselect__current {
    min-height: 36px;
    overflow: hidden;
    padding: 8px 12px 0;
    padding-right: 30px;
    white-space: nowrap;
    border: 1px solid #e8e8e8
  }

  .multiselect__select {
    position: absolute;
    top: 12px;
    font-size: 14px;
    color: #C0C4CC;
    right: 10px;
    text-align: center;
    transition: transform .2s ease
  }


  .multiselect__placeholder {
    color: $placeholderTextColor;
    display: inline-block;
    margin-bottom: 10px;
    padding-top: 2px
  }

  .multiselect--active .multiselect__placeholder {
    display: none
  }

  .multiselect__content-wrapper {
    position: absolute;
    display: block;
    background: #fff;
    width: 100%;
    max-height: 240px;
    overflow: auto;
    border: 1px solid #e8e8e8;
    border-top: none;
    z-index: 1;
    -webkit-overflow-scrolling: touch
  }

  .multiselect__content {
    list-style: none;
    display: inline-block;
    padding: 0;
    margin: 0;
    min-width: 100%;
    vertical-align: top
  }

  .multiselect--above .multiselect__content-wrapper {
    bottom: 100%;
    border-bottom: none;
    border-top: 1px solid #e8e8e8
  }

  .multiselect__content::webkit-scrollbar {
    display: none
  }

  .multiselect__element {
    display: block
  }

  .multiselect__option {
    display: block;
    padding: 12px;
    min-height: 36px;
    line-height: 16px;
    text-decoration: none;
    text-transform: none;
    vertical-align: middle;
    position: relative;
    cursor: pointer;
    white-space: nowrap
  }

  .multiselect__option:after {
    top: 0;
    right: 0;
    position: absolute;
    line-height: 40px;
    padding-right: 12px;
    padding-left: 20px;
    font-size: 13px
  }

  .multiselect__option--highlight {
    background: #F5F7FA;
    outline: none;
  }

  .multiselect__option--highlight:after {
    content: attr(data-select);
    background: #F5F7FA;
    color: $primaryThemeColor
  }

  .multiselect__option--selected {
    color: $primaryThemeColor;
    font-weight: 700
  }

  .multiselect__option--selected:after {
    content: attr(data-selected);
    color: silver
  }

  .multiselect__option--selected.multiselect__option--highlight {
    color: $primaryThemeColor
  }

  .multiselect__option--selected.multiselect__option--highlight:after {
    content: attr(data-deselect);
    color: $primaryThemeColor
  }

  .multiselect--disabled {
    background: #ededed;
    pointer-events: none
  }

  .multiselect--disabled .multiselect__current, .multiselect--disabled .multiselect__select, .multiselect__option--disabled {
    background: #ededed;
    color: #a6a6a6
  }

  .multiselect__option--disabled {
    cursor: text;
    pointer-events: none
  }

  .multiselect__option--group {
    background: #ededed;
    color: #35495e
  }

  .multiselect__option--group.multiselect__option--highlight {
    background: #35495e;
    color: $primaryThemeColor
  }

  .multiselect__option--group.multiselect__option--highlight:after {
    background: #35495e
  }

  .multiselect__option--disabled.multiselect__option--highlight {
    background: #dedede
  }

  .multiselect__option--group-selected.multiselect__option--highlight {
    color: $primaryThemeColor
  }

  .multiselect__option--group-selected.multiselect__option--highlight:after {
    content: attr(data-deselect);
    color: $primaryThemeColor
  }

  .multiselect-enter-active, .multiselect-leave-active {
    transition: all .15s ease
  }

  .multiselect-enter, .multiselect-leave-active {
    opacity: 0
  }

  .multiselect__strong {
    margin-bottom: 8px;
    line-height: 20px;
    display: inline-block;
    vertical-align: top
  }

  [dir=rtl] .multiselect {
    text-align: right
  }

  [dir=rtl] .multiselect__select {
    right: auto;
    left: 1px
  }

  [dir=rtl] .multiselect__tags {
    padding: 8px 8px 0 40px
  }

  [dir=rtl] .multiselect__content {
    text-align: right
  }

  [dir=rtl] .multiselect__option:after {
    right: auto;
    left: 0
  }

  [dir=rtl] .multiselect__clear {
    right: auto;
    left: 12px
  }

  [dir=rtl] .multiselect__spinner {
    right: auto;
    left: 1px
  }

  @keyframes a {
    0% {
      transform: rotate(0)
    }
    to {
      transform: rotate(2turn)
    }
  }

}

</style>

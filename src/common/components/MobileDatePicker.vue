<template>
  <div :class="$style.wrapper">
    <label :class="$style.theLabel">
      <input :class="$style.theSelect"
             :value="value"
             type="date"
             @blur="showPlaceholder"
             @change="$emit('input', $event.target.value)"
             @focus="hidePlaceholder">

      <i :class="$style.icon" class="el-icon-date">
                <span v-if="shouldShowPlaceholder"
                      :class="$style.thePlaceholder">
                    {{ placeholder }}
                </span>
        <span v-if="!shouldShowPlaceholder"
              :class="$style.theContent">
                    {{ value }}
                </span>
      </i>
    </label>
  </div>

</template>

<script>
export default {
  props: {
    value: String,

    placeholder: {
      type: String,
      default: '请输入日期'
    }
  },

  data() {
    return {
      shouldShowPlaceholder: !this.value
    }
  },

  methods: {
    hidePlaceholder() {
      this.shouldShowPlaceholder = false;
    },
    showPlaceholder() {
      this.shouldShowPlaceholder = !this.value;
    }

  }

}
</script>

<style lang="scss" module>
.wrapper {

}

.theLabel {
  height: $formPageInputHeight;
  position: relative;
  display: block;
  box-sizing: border-box;

}

.theSelect::-webkit-inner-spin-button,
.theSelect::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

.theSelect {
  font-size: 14px;
  padding-left: 32px;
  background-color: white;
  color: transparent;
  border: 1px solid rgb(220, 223, 230);
  display: block;
  width: 100%;
  height: $formPageInputHeight;
  line-height: $formPageInputHeight;
  -moz-appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;

  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;

  transition: border 0.5s;
}

.theSelect:focus {
  outline: none;
  border: 1px solid $primaryThemeColor;
}

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  color: #C0C4CC;
}

.thePlaceholder {
  padding-left: 2px;
}

.theContent {
  padding-left: 2px;
  color: $regularTextColor;
}

</style>

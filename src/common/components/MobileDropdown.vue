<template>
  <div :class="$style.wrapper">
    <label :class="$style.theLabel">
      <select :class="[$style.theSelect,{[$style.placeholder]: !value || value.length===0}]"
              :value="value"
              @change="onChange($event.target.value)">
        <option disabled value="">{{ !placeholder ? '请选择' : placeholder }}</option>
        <slot></slot>
      </select>
      <i :class="$style.icon" class="el-icon-arrow-down"></i>
    </label>
  </div>

</template>

<script>
export default {
  props: ['value', 'placeholder'],
  methods: {
    onChange(value) {
      this.$emit('input', value);
      this.$emit('change', value);
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
}

.theSelect {
  font-size: 14px;
  color: $regularTextColor;
  padding-left: 8px;
  background-color: transparent;
  border: 1px solid rgb(220, 223, 230);
  display: block;

  width: 100%;
  height: $formPageInputHeight;
  -moz-appearance: none;
  -webkit-appearance: none;

  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;

  transition: border 0.5s;
}

.placeholder {
  color: #C0C4CC !important;
}


.theSelect:focus {
  outline: none;
  border: 1px solid $primaryThemeColor;
}

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  color: #C0C4CC;
}

</style>

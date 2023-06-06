<template>
  <button :class="$style.wrapper" @click="callback($event)">
    <slot>提交</slot>
  </button>

</template>

<script>
export default {
  methods: {
    callback: function (e) {
      this.$emit('click', e);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: block;
  font-size: 13px;
  background-color: #edf1f8;
  color: $primaryTextColor;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  border: $primary1pxBorder;
  width: 100%;
  height: $formPageInputHeight;
  padding: 0;
  transition: background-color 0.5s;
}

.wrapper:hover {
  filter: brightness(95%);
}

.wrapper[disabled=disabled], .wrapper:disabled, .wrapper[disabled] {
  color: #8c939d;
  background-color: #edf1f8;
}

.wrapper[disabled=disabled]:hover, .wrapper:disabled:hover, .wrapper[disabled]:hover {
  cursor: not-allowed;
  filter: brightness(100%);
}

</style>

<template>
  <button :class="$style.wrapper"
          @click="callback($event)">
    <slot></slot>
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
  outline: none;
  text-decoration: none;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  //cursor: pointer;//启用后有正方形点击阴影，不好看
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.85);
  color: $regularTextColor;
}

.wrapper:hover {
  filter: brightness(95%);
}

.wrapper[disabled=disabled]:hover, .wrapper:disabled:hover, .wrapper[disabled]:hover {
  cursor: not-allowed;
  filter: brightness(100%);
}

</style>

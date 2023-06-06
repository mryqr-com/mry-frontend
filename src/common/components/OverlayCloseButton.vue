<template>
  <button :class="$style.wrapper"
          @click="callback($event)">
    <i class="el-icon-close"></i>
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

$buttonSize: 80px;

.wrapper {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100002;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  border: none;
  height: $buttonSize;
  width: $buttonSize;
  background-color: rgba(85, 85, 85, 0.51);
  line-height: $buttonSize;
  color: white;
  font-size: 30px;
  vertical-align: middle;
}

.wrapper:hover {
  background-color: rgba(85, 85, 85, 0.8);
}


</style>

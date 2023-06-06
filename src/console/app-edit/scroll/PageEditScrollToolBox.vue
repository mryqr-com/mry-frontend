<template>
  <div :class="$style.wrapper">
    <button :class="$style.navButton" title="移动到页面顶部" @click.stop="$emit('top')">
      <icon icon="arrow-up"/>
    </button>
    <button :class="$style.navButton" title="将当前所选控件移动至可视区域中央" @click.stop="$emit('target')">
      <icon icon="crosshairs"/>
    </button>
    <button :class="$style.navButton" title="移动到页面底部" @click.stop="$emit('bottom')">
      <icon icon="arrow-down"/>
    </button>
  </div>
</template>

<script>
export default {}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
}

.navButton {
  outline: none;
  text-decoration: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #b1b1b1;
  background-color: transparent;
  border: none;
}

.navButton:hover {
  color: dimgray;
}

</style>

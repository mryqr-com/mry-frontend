<template>
  <span v-if="file"
        :class="$style.wrapper"
        class="underLinedLink"
        @click="onClick">
    {{ file.name }}
  </span>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
    },
  },

  methods: {
    onClick(event) {
      event.stopPropagation();
      window.open(this.file.fileUrl, '_blank');
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

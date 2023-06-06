<template>
  <a v-if="mobile" :class="$style.wrapper" :href="telLink" class="underLinedLink" @click="onClick">{{ mobile }}</a>
</template>

<script>
export default {
  props: ['mobile'],

  computed: {
    telLink() {
      return `tel:${this.mobile}`
    },
  },

  methods: {
    onClick(event) {
      event.stopPropagation();
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

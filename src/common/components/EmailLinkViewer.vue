<template>
  <a v-if="email" :class="$style.wrapper" :href="emailLink" class="underLinedLink" @click="onClick">{{ email }}</a>
</template>

<script>
export default {
  props: ['email'],

  computed: {
    emailLink() {
      return `mailTo:${this.email}`;
    }
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

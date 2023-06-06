<template>
  <MemberWithEmailLinkViewer :member="member"></MemberWithEmailLinkViewer>
</template>

<script>

export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {
    member() {
      if (!this.value) {
        return null;
      }

      return this.value.member;
    },
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

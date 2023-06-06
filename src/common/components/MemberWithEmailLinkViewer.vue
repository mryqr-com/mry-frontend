<template>
   <span v-if="member && member.name" :class="$style.wrapper">
     {{ member.name }}<span v-if="member.email">(<EmailLinkViewer :email="member.email"></EmailLinkViewer>)</span>
  </span>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>


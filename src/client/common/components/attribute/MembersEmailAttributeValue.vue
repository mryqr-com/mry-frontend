<template>
  <span v-if="value" :class="$style.wrapper">
    <MemberWithEmailLinkViewer v-for="member in members"
                               :key="member.id"
                               :class="$style.memberContainer"
                               :member="member">
    </MemberWithEmailLinkViewer>
  </span>
</template>

<script>

export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {
    members() {
      if (!this.value) {
        return [];
      }
      return this.value.members;
    },
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

.memberContainer {
  font: inherit;
  color: inherit;
  padding-right: 10px;
}

</style>

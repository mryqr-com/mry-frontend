<template>
  <div :class="$style.wrapper">
    <div :class="$style.topBarName">
      {{ topBarName }}
      <HelpDocLinker v-if="helpUrl" :url="helpUrl" class="baseLineAlign"></HelpDocLinker>
    </div>
    <section :class="$style.rightSection">
      <MryCustomerServiceEntry :class="$style.rightSectionIcon"
                               :iconSize="16"
                               :textSize="12"
                               color="#909399">
      </MryCustomerServiceEntry>

      <MryDocumentationEntry :class="$style.rightSectionIcon"
                             :iconSize="16"
                             :textSize="12"
                             color="#909399">
      </MryDocumentationEntry>

      <MryMobileEntry :class="$style.rightSectionIcon"
                      :iconSize="16"
                      :textSize="12">
      </MryMobileEntry>
      <Profile></Profile>
    </section>
  </div>
</template>

<script>
import Profile from '@/console/common/Profile';

export default {
  components: {
    Profile
  },

  computed: {
    topBarName() {
      return this.$route.meta.name;
    },

    helpUrl() {
      return this.$route.meta.helpUrl;
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  justify-content: space-between;
  height: $consoleTopBarHeight;
  box-shadow: $primaryShadow;
  align-items: center;
  background-color: $whiteBackgroundColor;
  padding: 0 16px;
}

.topBarName {
  font-size: 18px;
  font-weight: 500;
  color: $primaryTextColor;
}

.rightSection {
  display: flex;
  align-items: center;
}

.rightSectionIcon {
  margin-right: 30px;
}

</style>

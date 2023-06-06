<template>
  <div v-if="links.length > 0" :class="$style.wrapper">
    <MenuLink
        v-for="link in groupedLinks.bottomLinks"
        :key="link.id"
        :class="$style.bottomLink"
        :link="link"
        @click="onLinkClick">
    </MenuLink>

    <div v-if="links.length > 3" :class="$style.moreArea">
      <button :class="$style.moreButton" @click.stop="toggleMoreLinks">
        <i class="el-icon-more"/>
      </button>

      <div :class="[$style.moreLinkContainer,{[$style.moreLinkContainerShow]:showMoreLinks}]">
        <MenuLink
            v-for="link in groupedLinks.moreLinks"
            :key="link.id"
            :class="$style.moreLink"
            :link="link"
            @click="onLinkClick">
        </MenuLink>
      </div>
    </div>
  </div>
</template>

<script>
import MenuLink from '@/common/components/MenuLink';

export default {
  props: {
    links: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      showMoreLinks: false
    }
  },

  components: {
    MenuLink: MenuLink
  },

  methods: {
    toggleMoreLinks() {
      this.showMoreLinks = !this.showMoreLinks;
    },

    hideMoreLinks() {
      this.showMoreLinks = false;
    },

    onLinkClick(link) {
      this.$emit('linkClick', link);
    }
  },

  mounted() {
    document.addEventListener('click', this.hideMoreLinks);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.hideMoreLinks);
  },

  computed: {
    groupedLinks() {
      if (this.links.length <= 3) {
        return {
          bottomLinks: this.links,
          moreLinks: []
        }
      } else {
        return {
          bottomLinks: this.links.slice(0, 3),
          moreLinks: this.links.slice(3, this.links.length).reverse(),
        }
      }
    },


  }
}
</script>

<style lang="scss" module>
.wrapper {
  background-color: whitesmoke;
  border-top: $primary1pxBorder;
  display: flex;
}

.bottomLink {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 50px;
  width: 100%;
  border-left: $primary1pxBorder !important;
}

.bottomLink:first-child {
  border-left: none !important;
}

.moreArea {
  position: relative;
  border-left: $primary1pxBorder;
}

.moreButton {
  background-color: whitesmoke;
  color: $regularTextColor;
  height: $formPageMenuHeight;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $formPageMenuHeight;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  padding: 0;
  flex-grow: 0;
  flex-shrink: 0;
  border: none;
}

.moreButton:hover {
  filter: brightness(97%);
}

.moreLinkContainer {
  background-color: whitesmoke;
  position: absolute;
  right: 0;
  bottom: $formPageMenuHeight+1px;
  width: 0;
  overflow: hidden;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  box-shadow: $primaryShadow;
}

.moreLinkContainerShow {
  width: 150px;
}

.moreLink {
  border-bottom: $primary1pxBorder !important;
  width: 150px;
}

.moreLink:last-child {
  border-bottom: none !important;
}

</style>

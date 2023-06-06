<template>
  <el-drawer :append-to-body="true"
             :class="$style.wrapper"
             :modal-append-to-body="true"
             :visible.sync="visible"
             :with-header="true"
             :wrapperClosable="wrapperClosable"
             size="450px"
             @close="$emit('update:show', false)"
             @closed="$emit('closed')"
             @open="init">
    <div slot="title" :class="$style.theTitle">
      <el-popover
          placement="bottom"
          trigger="hover">
        <el-checkbox v-model="wrapperClosable"
                     size="medium">
          <span>点击外部时自动关闭窗口</span>
        </el-checkbox>
        <span slot="reference" :class="$style.theName">{{ title }}</span>
      </el-popover>
    </div>

    <div :class="$style.iframeWrapper">
      <iframe :class="$style.theIframe" :src="src" allow="geolocation"></iframe>
    </div>
  </el-drawer>
</template>

<script>

export default {
  props: {
    src: {
      type: String,
      required: false
    },

    title: {
      type: String,
      default: ""
    },

    show: {
      type: Boolean,
      default: true,
    },

    wrapperClosableReferenceKey: {
      type: String,
      default: "default"
    },
  },

  data() {
    return {
      visible: this.show,
      internalWrapperClosable: true
    }
  },

  methods: {
    init() {
      this.internalWrapperClosable = 'false' !== localStorage.getItem(this.internalWrapperClosableReferenceKey);
    },

  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    internalWrapperClosableReferenceKey() {
      return 'drawerBrowser_' + this.wrapperClosableReferenceKey;
    },

    wrapperClosable: {
      get() {
        return this.internalWrapperClosable;
      },

      set(value) {
        this.internalWrapperClosable = value;
        localStorage.setItem(this.internalWrapperClosableReferenceKey, value);
      }
    }
  }
}
</script>


<style lang="scss" module>
$headerHeight: 60px;
.wrapper {
  :global {
    .el-drawer {
      display: block;
    }

    .el-drawer__header {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      color: white;
      padding-top: 0;
      height: $headerHeight !important;
      background-color: $primaryThemeColor;
    }
  }
}

.iframeWrapper {
  width: 100%;
  height: calc(100vh - #{$headerHeight});
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='150px' width='80px'><text x='0' y='15' fill='gray'>正在加载...</text>正在加载...</svg>") center center no-repeat;
}

.theIframe {
  width: 100%;
  height: calc(100vh - #{$headerHeight});
}

.theTitle {
  display: flex;
  align-items: center;
}

.theName {
  font-size: 15px;
  font-weight: 500;
  cursor: default;
}

</style>

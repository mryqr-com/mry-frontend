<template>
  <el-popover
      v-if="files.length > 0"
      :title="title"
      placement="bottom"
      trigger="click">
    <div :class="$style.content">
      <el-table :data="files">
        <el-table-column
            align="center"
            label="序号"
            type="index"
            width="50">
        </el-table-column>

        <el-table-column
            :show-overflow-tooltip="true"
            label="名称"
            width="300">
          <template slot-scope="scope">
            <FileLinkViewer :file="scope.row"></FileLinkViewer>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-button slot="reference" size="mini">查看文件</el-button>
  </el-popover>

</template>

<script>

export default {
  props: {
    files: {
      type: Array,
      required: true
    },

    title: {
      type: String,
    }
  },

}
</script>

<style lang="scss" module>
.content {
  max-height: 500px;
  overflow-y: auto;
}

.link {
  color: $primaryThemeColor;
}

</style>

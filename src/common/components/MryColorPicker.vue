<template>
  <el-color-picker
      :predefine="predefinedColors"
      :show-alpha="true"
      :title="title"
      :value="value"
      size="mini"
      @change="onChange"
      @active-change="onChange">
  </el-color-picker>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },

    title: {
      type: String,
      default: '选择颜色'
    }
  },

  methods: {
    onChange(color) {
      this.$emit("input", color);
    }
  },

  computed: {
    predefinedColors() {
      return [
        '#FFFFFF',
        '#F8F8F8',
        '#F5F5F5',
        '#F0F0F0',
        '#eff1f1',
        '#F2F6FC',
        '#EBEEF5',
        '#E8E8E8',
        '#E4E7ED',
        '#DCDFE6',
        '#F2F2F2',
        '#F3F2F2',
        '#F5F0F0',
        '#F6F2EE',
        '#FFFAFA',
        '#FCF9E9',
        '#FFFBE5',
        '#FDFFE6',
        '#F9FFE5',
        '#F2FFE5',
        '#F2F5F0',
        '#F2F9EB',
        '#EEFFE6',
        '#E5FFF2',
        '#E5F9FF',
        '#E7F3FE',
        '#E5ECFF',
        '#E6E7FF',
        '#F6ECF9',
        '#F4E5FF',
        '#E0E0E0',
        '#D3D3D3',
        '#C0C4CC',
        '#A9A9A9',
        '#888888',
        '#606266',
        '#404040',
        '#202020',
        '#303133',
        '#000000',
        '#F0F8FF',
        '#6CB4EE',
        '#7FFFD4',
        '#89CFF0',
        '#7CB9E8',
        '#72A0C1',
        '#6699CC',
        '#007FFF',
        '#1F75FE',
        '#0CAFFF',
        '#00BFFF',
        '#318CE7',
        '#0070BB',
        '#0066b2',
        '#3457D5',
        '#1034A6',
        '#004687',
        '#00308F',
        '#002244',
        '#1F305E',
        '#76FF7A',
        '#9ACD32',
        '#32CD32',
        '#55DD33',
        '#32de84',
        '#50C878',
        '#00AB66',
        '#228B22',
        '#018749',
        '#006A4E',
        '#fd5c63',
        '#E25822',
        '#FF007F',
        '#FF004F',
        '#FF033E',
        '#F2003C',
        '#e41c38',
        '#DE3163',
        '#D2122E',
        '#AA0000',
        '#FFFF00',
        '#F0E68C',
        '#FFD700',
        '#FFC72C',
        '#FEBE10',
        '#FFC0CB',
        '#FF69B4',
        '#F9629F',
        '#FF00FF',
        '#FF00BF',
        '#FEA500',
        '#EE178C',
        '#FE4400',
        '#E64402',
        '#8F00F8',
        '#C30000',
        '#44D144',
        '#00C300',
        '#1EE0A6',
        '#1D88EA',
      ];
    }
  }
}
</script>

<style lang="scss" module>

</style>

<template>
  <div>
    <PanelContent helpUrl="//docs.mryqr.com/app-design/header" title="页眉">
      <div v-if="!isCurrentHomePage">
        <EditTitle>显示方式</EditTitle>
        <el-radio-group v-model="localHeader.type" size="mini">
          <el-radio-button label="INHERITED" title="页眉保持与首页相同">&nbsp;与首页相同&nbsp;
          </el-radio-button>
          <el-radio-button label="CUSTOM" title="自定义页眉">&nbsp;自定义&nbsp;
          </el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="localHeader.type === 'CUSTOM' || isCurrentHomePage">
        <el-checkbox v-model="localHeader.showImage"
                     class="block marginTop20"
                     size="mini"
                     title="是否显示页眉图片">
          显示图片
        </el-checkbox>
        <template v-if="localHeader.showImage">
          <CroppedImageUploader v-model="localHeader.image"
                                :cropType="localHeader.imageCropType"
                                :ossRequest="appEditOssRequest"
                                class="settingMarginBottom"
                                type="rectangle">
          </CroppedImageUploader>

          <div class="singleLineTitle">裁剪比例</div>
          <el-select v-model="localHeader.imageCropType"
                     class="settingMarginBottom block"
                     placeholder="请选择页眉图片裁剪样式"
                     size="mini"
                     title="页眉图片裁剪比例设置">
            <el-option v-for="item in imageCropTypes"
                       :key="item.type"
                       :label="item.text"
                       :value="item.type">
            </el-option>
          </el-select>
        </template>

        <el-checkbox v-model="localHeader.showText"
                     class="settingMarginBottom block marginTop20"
                     size="mini"
                     title="是否显示抬头，抬头包括图标Logo和文字">
          显示抬头
        </el-checkbox>

        <template v-if="localHeader.showText">
          <div class="singleLineTitleWithSuffix">
            <div class="singleLineTitle">抬头文本</div>

            <el-popover
                placement="bottom"
                trigger="click"
                width="300">
              <BoxedTextStyleInput v-model="localHeader.textStyle"></BoxedTextStyleInput>
              <ItalicTextButton slot="reference">样式</ItalicTextButton>
            </el-popover>
          </div>
          <el-input v-model="localHeader.text"
                    :maxlength="50"
                    :spellcheck="false"
                    class="settingMarginBottom"
                    clearable
                    size="mini"
                    title="抬头文字">
          </el-input>

          <div class="singleLineTitle">Logo</div>
          <SingleFileUploader v-model="localHeader.logoImage"
                              :dnd="true"
                              :dndAreaHeight="36"
                              :imageOnly="true"
                              :ossRequest="appEditOssRequest"
                              class="settingMarginBottom"
                              dndAreaText="上传Logo"
                              title="抬头的Logo图片">
          </SingleFileUploader>

          <template v-if="localHeader.logoImage">
            <div class="singleLineTitle" title="文字和Logo的垂直对齐方式">垂直对齐</div>
            <el-radio-group v-model="localHeader.logoAlign"
                            class="settingMarginBottom"
                            size="mini">
              <el-radio-button label="TOP" title="顶部对齐">顶部对齐</el-radio-button>
              <el-radio-button label="MIDDLE" title="居中对齐">居中对齐</el-radio-button>
              <el-radio-button label="BOTTOM" title="底部对齐">底部对齐</el-radio-button>
            </el-radio-group>

            <div class="keyValueSettingContainer">
              Logo尺寸：
              <el-input-number v-model="localHeader.logoHeight"
                               :max="100"
                               :min="10"
                               :step="1"
                               :stepStrictly="true"
                               controls-position="right"
                               size="mini"
                               title="Logo图标的尺寸">
              </el-input-number>
            </div>
          </template>
        </template>
      </div>
    </PanelContent>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {cloneDeep, isEqual} from 'lodash-es';
import SingleFileUploader from '@/common/components/SingleFileUploader';

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    SingleFileUploader,
    CroppedImageUploader: () => import(/* webpackChunkName: "cropped-image-uploader" */ '@/common/components/CroppedImageUploader'),
  },

  data() {
    return {
      localHeader: null
    }
  },

  created() {
    this.localHeader = cloneDeep(this.theHeader);
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_PAGE_HEADER
    ])
  },

  watch: {
    theHeader: {
      handler: function () {
        this.localHeader = cloneDeep(this.theHeader);
      },
      deep: true
    },
    localHeader: {
      handler: function () {
        if (!isEqual(this.localHeader, this.theHeader)) {
          this.theHeader = this.localHeader;
        }
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters([
      'currentPage',
      'isCurrentHomePage',
      'appEditOssRequest'
    ]),

    theHeader: {
      get() {
        return this.currentPage.header;
      },

      set(header) {
        this[ACTIONS.UPDATE_PAGE_HEADER](header)
      }
    },

    imageCropTypes() {
      return [
        {
          type: 'NO_CROP',
          text: '无裁剪'
        },
        {
          type: 'ANY_CROP',
          text: '任意裁剪'
        },
        {
          type: 'TWO_TO_ONE',
          text: '宽:高（2:1）'
        },
        {
          type: 'FOUR_TO_THREE',
          text: '宽:高（4:3）'
        },
        {
          type: 'SIXTEEN_TO_NINE',
          text: '宽:高（16:9）'
        },
        {
          type: 'ONE_TO_ONE',
          text: '宽:高（1:1）'
        },
        {
          type: 'NINE_TO_SIXTEEN',
          text: '宽:高（9:16）'
        },
        {
          type: 'THREE_TO_FOUR',
          text: '宽:高（3:4）'
        },
        {
          type: 'ONE_TO_TWO',
          text: '宽:高（1:2）'
        }
      ]
    }
  },

}
</script>

<style lang="scss" module>

</style>

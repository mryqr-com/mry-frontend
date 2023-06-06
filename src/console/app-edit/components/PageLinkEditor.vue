<template>
  <div :class="$style.wrapper">
    <el-collapse v-if="links.length > 0"
                 v-model="activeName"
                 :class="$style.theCollapse"
                 accordion>
      <draggable v-model="links"
                 :class="$style.theDragWrapper"
                 :handle="'.' + $style.dragHandle"
                 animation="200"
                 tag="div">
        <el-collapse-item v-for="(link,index) in links"
                          :key="link.id"
                          :ref="link.id"
                          :class="$style.optionWrapper"
                          :name="link.id">
          <template slot="title">
            <div :class="$style.linkTitle">
              <div :class="$style.linkName">
                <ThreeBarIcon :class="$style.dragHandle"
                              title="上下拖动移位">
                </ThreeBarIcon>
                <div :key="refreshKey" :class="$style.nameText">
                  {{ linkDisplayName(link) }}
                  <i v-if="isIncomplete(link)"
                     :class="$style.warning"
                     class="el-icon-warning-outline"
                     title="请完善链接设置">
                  </i>
                </div>
              </div>

              <i :class="$style.deleteButton"
                 class="el-icon-close"
                 title="删除"
                 @click="deleteLink(link.id)">
              </i>

            </div>
          </template>

          <div :class="$style.opsArea">
            <template v-if="showName">
              <div class="singleLineTitle">名称</div>
              <div class="marginBottom10">
                <el-input
                    v-model="link.name"
                    :class="[{elementInputErrorBordered: $v.links.$each.$iter[index].name.$invalid }]"
                    :maxlength="maxTextLength"
                    placeholder="请填写名称"
                    size="mini"
                    title="名称">
                </el-input>

                <div v-if="$v.links.$each.$iter[index].name.$invalid"
                     :class="$style.errorMessage">
                  <ErrorMessage v-if="!$v.links.$each.$iter[index].name.required">
                    链接名称不能为空
                  </ErrorMessage>
                </div>
              </div>
            </template>

            <template v-if="showDescription">
              <div class="singleLineTitle">简介</div>
              <el-input v-model="link.description"
                        :maxlength="100"
                        class="marginBottom10"
                        placeholder="简介"
                        rows="2"
                        size="mini"
                        title="简介"
                        type="textarea">
              </el-input>
            </template>

            <template v-if="showButtonText">
              <div class="singleLineTitle">按钮文本</div>
              <el-input v-model="link.buttonText"
                        :maxlength="50"
                        class="marginBottom10"
                        size="mini"
                        title="按钮文本">
              </el-input>
            </template>

            <div class="singleLineTitle">链接类型</div>
            <el-select v-model="link.type"
                       :class="$style.select"
                       class="marginBottom10"
                       placeholder="请选择链接类型"
                       size="mini"
                       @change="onLinkTypeChange(link)">
              <el-option
                  v-for="linkType in linkTypes"
                  :key="linkType.type"
                  :label="linkType.text"
                  :value="linkType.type">
              </el-option>
            </el-select>

            <template v-if="link.type === 'EXTERNAL_URL'">
              <div class="singleLineTitle">链接网址</div>
              <div class="marginBottom10">
                <el-input v-model="link.url"
                          :class="[{elementInputErrorBordered: $v.links.$each.$iter[index].url.$dirty
                            && $v.links.$each.$iter[index].url.$invalid }]"
                          :maxLength="1024"
                          :spellcheck="false"
                          placeholder="例如：https://www.mryqr.com"
                          size="small"
                          type="textarea"
                          @input="$v.links.$each.$iter[index].url.$touch">
                </el-input>

                <div v-if="$v.links.$each.$iter[index].url.$dirty"
                     :class="$style.errorMessage">
                  <ErrorMessage v-if="!$v.links.$each.$iter[index].url.required">
                    链接网址不能为空
                  </ErrorMessage>
                </div>
              </div>
            </template>

            <template v-if="link.type === 'PAGE'">
              <div class="singleLineTitle">链接页面</div>
              <el-select v-model="link.pageId"
                         :class="$style.select"
                         class="marginBottom10"
                         placeholder="请选择页面"
                         size="mini">
                <el-option
                    v-for="page in allPageSummaries"
                    :key="page.id"
                    :label="page.name"
                    :value="page.id">
                </el-option>
              </el-select>
            </template>

            <template v-if="showImage">
              <div class="singleLineTitle">链接{{ imageText }}</div>
              <SingleFileUploader v-model="link.image"
                                  :dnd="true"
                                  :dndAreaHeight="36"
                                  :dndAreaText="`上传`+imageText"
                                  :imageOnly="true"
                                  :ossRequest="appEditOssRequest">
              </SingleFileUploader>
            </template>
          </div>
        </el-collapse-item>
      </draggable>
    </el-collapse>

    <PlainButton :disabled="links.length >= maxLinks"
                 @click="addLink">
      <i class="el-icon-plus"></i>&nbsp;添加链接项（{{ links.length }}/{{ maxLinks }}）
    </PlainButton>

  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators'
import draggable from 'vuedraggable';
import uuid from 'short-uuid';
import {createNamespacedHelpers} from 'vuex';
import SingleFileUploader from '@/common/components/SingleFileUploader';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Array,
      required: true
    },

    maxTextLength: {
      type: Number,
      default: 10
    },

    maxLinks: {
      type: Number,
      default: 10
    },

    showName: {
      type: Boolean,
      default: true,
    },

    showDescription: {
      type: Boolean,
      default: false,
    },

    showButtonText: {
      type: Boolean,
      default: false,
    },

    showImage: {
      type: Boolean,
      default: true,
    },

    isIcon: {
      type: Boolean,
      default: true,
    },

  },

  components: {
    draggable,
    SingleFileUploader,
  },

  data() {
    return {
      refreshKey: uuid.generate(),
      activeName: null,
      linkTypes: [
        {
          type: 'PAGE',
          text: '内部页面链接'
        },
        {
          type: 'EXTERNAL_URL',
          text: '外部网址链接'
        },

      ]
    }
  },

  watch: {
    value: {
      handler: function () {//让linkDisplayName()方法实时生效
        this.refreshKey = uuid.generate();
      },
      deep: true
    },
  },

  computed: {
    ...mapGetters([
      'allPageSummaries',
      'appEditOssRequest'
    ]),

    links: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },

    imageText() {
      return this.isIcon ? '图标' : '图片';
    }
  },

  methods: {
    linkDisplayName(link) {
      if (this.showName) {
        return link.name;
      }

      if (this.showButtonText) {
        return link.buttonText;
      }

      return link.name;
    },

    onLinkTypeChange(link) {
      link.pageId = null;
      link.url = null;
    },

    addLink() {
      if (this.links.length >= this.maxLinks) {
        this.$message({
          type: 'error',
          message: `添加失败，最大只能包含${this.maxLinks}个链接。`,
          center: true
        });
        return;
      }

      let id = uuid.generate();
      this.links.push({
        id: id,
        name: '未命名',
        description: null,
        buttonText: '未命名',
        type: null,
        url: null,
        pageId: null,
        image: null
      });
      this.activeName = id;
    },

    deleteLink(id) {
      this.links.splice(this.links.findIndex(i => i.id === id), 1);
    },

    isIncomplete(link) {
      if (!link.type) {
        return true;
      }

      if (link.type === 'PAGE') {
        return !link.pageId;
      }

      return !link.url;
    }
  },

  validations: {
    links: {
      $each: {
        name: {
          required,
        },
        url: {
          required
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theCollapse {
  margin-bottom: 10px;

  :global {
    .el-collapse-item__arrow {
      display: none;
    }
  }
}

.theDragWrapper {
  max-height: 40vh;
  overflow-y: auto;
  border-left: $primary1pxBorder;
  border-right: $primary1pxBorder;
}

.dragHandle {
  cursor: move;
  margin-right: 15px;
  margin-left: 10px;
}

.optionWrapper:last-child {
  :global {
    .el-collapse-item__header {
      border-bottom-width: 0;
    }

    .el-collapse-item__wrap {
      border-bottom-width: 0;
    }
  }
}

.optionWrapper {
  :global {
    .el-collapse-item__content {
      padding-left: 15px;
      padding-bottom: 15px;
    }
  }
}

.linkTitle {
  width: 100%;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.linkName {
  display: flex;
  align-items: center;
}

.nameText {
  font-weight: 500;
  line-height: normal;
}

.deleteButton {
  cursor: pointer;
  margin-right: 15px;
}

.deleteButton:hover {
  color: $rejectRed;
}

.opsArea {
  margin-left: 10px;
  margin-right: 10px;
}

.select {
  width: 100%;
}

.warning {
  color: $warningYellow;
  cursor: default;
  font-size: 15px;
  font-weight: 500;
}

</style>

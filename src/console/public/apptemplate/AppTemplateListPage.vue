<template>
  <div :class="$style.wrapper">
    <section :class="$style.headerSection">
      <Logo :class="$style.logo" size="small" @click="onLogoClick"></Logo>
      <div :id="scrollRefId" :class="$style.sectionTitle">码如云应用模板库</div>
      <div :class="$style.subSectionTitle">选择适合您的应用模板，快速搭建应用，省时省心</div>
      <div :class="$style.searchContainer">
        <el-input v-model="search"
                  :class="$style.searchInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="搜索模板..."
                  @keyup.enter.native="doSearch">
          <el-button slot="append"
                     :class="$style.searchButton"
                     icon="el-icon-search"
                     type="primary"
                     @click="doSearch">
          </el-button>
        </el-input>
      </div>

      <div :class="$style.searchSettingContainer">
        <div :class="$style.searchSettingRow">
          <span :class="$style.searchSettingTitle">业务场景:</span>
          <el-radio-group v-model="scenario"
                          :class="$style.radioGroup"
                          size="medium"
                          @change="onScenarioChanged">
            <el-radio-button v-for="scenario in scenarios"
                             :key="scenario.key"
                             :label="scenario.key">
              {{ scenario.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div :class="$style.searchSettingRow">
          <span :class="$style.searchSettingTitle">行业领域:</span>
          <el-radio-group v-model="category"
                          :class="$style.radioGroup"
                          size="medium"
                          @change="onCategoryChanged">
            <el-radio-button v-for="category in categories"
                             :key="category.key"
                             :label="category.key">
              {{ category.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div :class="$style.mobileSearchSettingContainer">
        <div :class="$style.searchSettingHalf" class="marginRight30">
          <div :class="$style.searchTitle">业务场景：</div>
          <MobileDropdown v-model="scenario"
                          :class="$style.selectInput"
                          @change="onScenarioChanged">
            <option v-for="scenario in scenarios"
                    :key="scenario.key"
                    :value="scenario.key">
              {{ scenario.name }}
            </option>
          </MobileDropdown>
        </div>

        <div :class="$style.searchSettingHalf">
          <div :class="$style.searchTitle">行业领域：</div>
          <MobileDropdown v-model="category"
                          :class="$style.selectInput"
                          @change="onCategoryChanged">
            <option v-for="category in categories"
                    :key="category.key"
                    :value="category.key">
              {{ category.name }}
            </option>
          </MobileDropdown>
        </div>
      </div>
    </section>

    <section :class="$style.listContentSection">
      <div :class="$style.listContentContainer">
        <template v-if="appTemplates.length >= 1">
          <el-row :gutter="24">
            <el-col v-for="(template,index) in appTemplates"
                    :key="index"
                    :lg="6"
                    :md="6"
                    :sm="12"
                    :xl="6"
                    :xs="24">
              <div :class="$style.templateCard" @click="viewTemplateDetail(template)">
                <div :class="$style.posterImageContainer" :style="posterStyle(template)"></div>
                <div :class="$style.cardTextArea">
                  <div :class="$style.templateName">{{ template.name }}</div>
                  <div :class="$style.templateDescription">{{ template.cardDescription }}</div>
                  <div :class="$style.cardFooter">
                    <span v-for="feature in template.features"
                          :key="feature"
                          :class="$style.feature">{{ feature }}</span>

<!--                    <span :class="$style.planType" class="blueTableTag"></span>-->
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <div v-if="hasPagination" :class="$style.paginationContainer">
            <el-pagination :current-page.sync="pageIndex"
                           :page-size.sync="pageSize"
                           :page-sizes="[20, 30, 50, 100]"
                           :total="totalNumber"
                           layout="total,prev,pager,next,sizes"
                           @current-change="onPageIndexChanged"
                           @size-change="onPageSizeChanged">
            </el-pagination>
          </div>
        </template>
        <div v-else :class="$style.noDataContainer">
          没有找到相关模板
        </div>
      </div>
    </section>

    <MryOfficialSiteFooter :class="$style.footer"></MryOfficialSiteFooter>
  </div>
</template>

<script>
import appTemplateApi from '@/common/api/app-template-api';
import {imageDisplayUrl} from "@/common/utils/image-utils";
import planTypes from '@/common/utils/plan-types';
import uuid from "short-uuid";
import {goToMryOfficialWebsite, isMobileBrowser} from "@/common/utils/common-utils";
import MobileDropdown from '@/common/components/MobileDropdown';
import MryOfficialSiteFooter from '@/console/common/components/MryOfficialSiteFooter';

export default {

  components: {
    MobileDropdown,
    MryOfficialSiteFooter,
  },

  data() {
    return {
      appTemplates: [],
      pageIndex: 1,
      pageSize: isMobileBrowser() ? 20 : 100,
      totalNumber: 0,
      category: 'ALL',
      scenario: 'ALL',
      search: null,
      scrollRefId: uuid.generate(),
    }
  },

  created() {
    document.title = '码如云应用模板库';

    return this.listTemplates();
  },

  computed: {
    categories() {
      return [//从后端拷贝而来，是后端行业的子集
        {
          name: '所有行业',
          key: 'ALL'
        },
        {
          name: '农林牧渔',
          key: 'X72i7oG0RPScgHMS0hWgyA'
        },
        {
          name: '医疗卫生',
          key: 'xbMCyqhmQkepig1EMpjUHA'
        },
        {
          name: '水利水电',
          key: 'wzpAo82ERIOUihEtzszc-g'
        },
        {
          name: '石油化工',
          key: '_ODJvL1FT5Ws9TIL0vXmkQ'
        },
        {
          name: '交通运输',
          key: 'IuepzShUSN-eqKogURV0MQ'
        },
        {
          name: '办公文教',
          key: 'glAJsoGaT_SFGYTVzcCc6A'
        },
        {
          name: '组织机构',
          key: 'GcHgD8QtT3-yjTS6FvSE1A'
        },
        {
          name: '机械机电',
          key: 'aq7gd6uSR4SWmiOvgYI1Kg'
        },
        {
          name: '环保绿化',
          key: 'mrtVhm1CSviLcVN04MleUQ'
        },
        {
          name: '旅游休闲',
          key: 'qZVleuUkQtW0hDb7-Xgfww'
        },
        {
          name: '专业服务',
          key: 'VtiyFWRtRPqjwXOcFEaSRw'
        },
        {
          name: '家居用品',
          key: 'EEZ9nZfTQFqPZnJn4_6fJA'
        },
        {
          name: '轻工食品',
          key: 'ehiAFgvFTT2IK-lEoWsJWg'
        },
        {
          name: '玩具礼品',
          key: 'YkY3sfaOQmaXNJHOQkw-uQ'
        },
        {
          name: '电子电工',
          key: 'HzHGw-gMQJ-CnSIos3JvYA'
        },
        {
          name: '安全防护',
          key: 'QyASA9GPRyidczTUgKXm_w'
        },
        {
          name: '服装纺织',
          key: '5-VCaBt0R6KKUByyeGLcQw'
        },
        {
          name: '冶金矿产',
          key: 'VO42VUhAQD23AvCh-8dX5Q'
        },
        {
          name: '信息产业',
          key: 'yyCpJMCrSs-aQ-dVO1Sj6Q'
        },
        {
          name: '建筑建材',
          key: 'OsOInNp5SgennYYc3i8FdQ'
        },
        {
          name: '体育产业',
          key: 'YVB7H9AiQX2nFSlRGRsiFg'
        },
      ];
    },

    scenarios() {
      return [//从后端拷贝而来，是后端行业的子集
        {
          name: '所有场景',
          key: 'ALL'
        },
        {
          name: '设备管理',
          key: '8i4HpAFkW7MHjBnZSvV4DM'
        },
        {
          name: '巡检维保',
          key: '5Gr6JiLhQMq-Owy1g15Cvg'
        },
        {
          name: '固定资产',
          key: 'mHgmPDIMTaKQRlWvSlv-kQ'
        },
        {
          name: '物品标签',
          key: '3lCRiPZTTuyvfkBXw30IQw'
        },
        {
          name: '信息介绍',
          key: 'Mem4pGyDQXCjWIBi4Xfe_g'
        },
        {
          name: '问卷调查',
          key: 'yC16ZFaoSWSHK0NCa849zA'
        },
        {
          name: '登记申请',
          key: 'MCJPteBbSzqPLFKIu7rQtw'
        },
        {
          name: '意见反馈',
          key: 'xufrCcjVQ7OJ6bz2DGvunA'
        },
        {
          name: '营销获客',
          key: '410M7wy5TZufBKC6WgBdnA'
        },
        {
          name: '教学培训',
          key: 'lVrObWP5RZ200SmuGntzcA'
        },
        {
          name: '考试评分',
          key: '6BNvi2pcRcSx8YwxGCwvPg'
        },
      ]
    },

    hasPagination() {
      return this.totalNumber > this.pageSize;
    },
  },

  methods: {
    onLogoClick() {
      goToMryOfficialWebsite();
    },

    scrollToTop() {
      document.getElementById(this.scrollRefId).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    },

    doSearch() {
      this.pageIndex = 1;
      return this.listTemplates();
    },

    onCategoryChanged() {
      this.pageIndex = 1;
      return this.listTemplates();
    },

    onScenarioChanged() {
      this.pageIndex = 1;
      return this.listTemplates();
    },

    onPageIndexChanged() {
      return this.listTemplates();
    },

    onPageSizeChanged() {
      this.pageIndex = 1;
      return this.listTemplates();
    },

    listTemplates() {
      let command = {
        category: this.category !== 'ALL' ? this.category : null,
        scenario: this.scenario !== 'ALL' ? this.scenario : null,
        search: this.search,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };

      return appTemplateApi.listPublishedAppTemplates(command).then(response => {
        this.appTemplates = response.data.data;
        this.totalNumber = response.data.totalNumber;
        this.scrollToTop();
      });
    },

    posterStyle(template) {
      return {
        backgroundImage: `url('${imageDisplayUrl(template.poster)}')`,
      }
    },

    viewTemplateDetail(template) {
      let href = this.$router.resolve({
        name: 'app-template-detail',
        params: {templateId: template.id},
      }).href;

      window.open(location.origin + href, "_blank");
    },

    planTypeText(template) {
      return planTypes[template.planType].name;
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.logo {
  display: none;
}

.headerSection {
  background-color: white;
  padding: 80px 15px 15px;
}

.sectionTitle {
  font-size: 36px;
  font-weight: 500;
  color: $primaryTextColor;
  margin: auto;
  text-align: center;
}

.subSectionTitle {
  color: $secondaryTextColor;
  font-size: 16px;
  text-align: center;
  margin: 30px auto auto;
  line-height: 1.3em;
}

.searchContainer {
  margin-top: 50px;
  text-align: center;
}

.searchInput {
  width: 500px;

  :global {
    .el-input-group__append {
      border-color: $primaryThemeColor !important;
    }

    .el-input__inner {
      border-right-color: transparent;
    }
  }
}

.searchButton {
  background-color: $primaryThemeColor !important;
  width: 100px;

  :global {
    .el-icon-search {
      color: white;
    }
  }
}

.searchSettingContainer {
  max-width: 1000px;
  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
}

.searchSettingRow {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.searchSettingTitle {
  color: $secondaryTextColor;
  margin-right: 24px;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 6px 12px;
}

.radioGroup {
  flex-grow: 1;

  :global {
    .el-radio-button__inner {
      border: none !important;
      padding: 6px 12px !important;
      box-shadow: none !important;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: transparent;
      font-weight: 600;
      color: $primaryThemeColor;
    }
  }
}

.mobileSearchSettingContainer {
  display: none;
}

.searchSettingHalf {
  flex-grow: 1;
}

.searchTitle {
  margin-bottom: 3px;
  color: $secondaryTextColor;
  font-size: 13px;
}

.selectInput {
  width: 100%;
}

.listContentSection {
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
  justify-content: center;
}

.listContentContainer {
  width: 100%;
  max-width: 1200px;
  margin: 0 24px;
}

.templateCard {
  background-color: white;
  box-shadow: $primaryShadow;
  margin-bottom: 24px;
  transition: transform .3s;
}

.templateCard:hover {
  cursor: pointer;
  box-shadow: $imageShadow;
  transform: scale(1.03)
}

.posterImageContainer {
  aspect-ratio: 1.4;
  background-position: center center;
  background-size: cover;
}

.cardTextArea {
  padding: 20px 15px 15px;
}

.templateName {
  font-size: 16px;
  color: $primaryTextColor;
  font-weight: 500;
  line-height: 1.3em;
  height: 20px;
  overflow: hidden;
}

.templateDescription {
  font-size: 13px;
  color: $secondaryTextColor;
  line-height: 1.8em;
  height: 50px;
  margin-top: 10px;
  overflow: hidden;
  font-weight: 390;
}

.cardFooter {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
  min-height: 15px;
}

.feature {
  background-color: $primaryBackgroundColor;
  padding: 3px 4px;
  font-size: 12px;
  color: $secondaryTextColor;
  margin-right: 4px;
}

.planType {
  padding: 3px 4px;
  font-size: 12px;
}

.paginationContainer {
  margin-top: 15px;
  height: 40px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.noDataContainer {
  margin-top: 100px;
  text-align: center;
  font-size: 16px;
  color: $secondaryTextColor;
}

.footer {
  margin-top: 100px;
}

@media (max-width: $mobileScreenBreakpoint) {
  .wrapper {
  }

  .headerSection {
    position: relative;
    padding-top: 80px;
  }

  .sectionTitle {
    font-size: 32px;
  }

  .subSectionTitle {
    font-size: 15px;
  }

  .logo {
    display: flex;
    position: absolute;
    top: 15px;
    left: 15px;
  }

  .searchInput {
    width: 100%;
  }

  .subSectionTitle {
    display: none;
  }

  .searchContainer {
    margin-top: 40px;
  }

  .searchSettingContainer {
    display: none;
  }

  .mobileSearchSettingContainer {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .listContentSection {
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .listContentContainer {
    margin: 0;
  }

  .posterImageContainer {
    width: calc(100vw - 30px);
    height: calc((100vw - 30px) / 1.4);
    aspect-ratio: auto;
  }

  .templateCard {
    margin-bottom: 15px;
  }

  .templateCard:hover {
    transform: none;
  }

  .templateName {
    font-size: 18px;
  }

  .templateDescription {
    font-size: 14px;
  }

  .footer {
    display: none;
  }
}

</style>

<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]" :title="theTitle">
    <el-timeline v-if="allShowablePages.length >0">
      <el-timeline-item v-for="item in allItems"
                        :key="item.id"
                        :timestamp="item.time"
                        placement="top">
        <el-card :class="$style.elCard" :style="cardStyle">
          <div v-if="control.showPageName" :class="$style.pageName">{{ item.name }}</div>
          <div v-if="control.showSubmitter && item.requireLogin"
               :class="[$style.contentRow,{[$style.contentRowWide]: tabletView}]">
            {{ submitterDesignationOf(item.pageId) }}：
          </div>
          <div v-for="field in item.fields" :key="field.id"
               :class="[$style.contentRow,{[$style.contentRowWide]: tabletView}]">
            {{ field.fieldName }}
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请设置引用页面</i>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {
  appearanceStyles,
  controlFieldName,
  formatEpochToMinute,
  isControlFillable,
  pageActionName,
} from '@/common/utils/common-utils';
import uuid from "short-uuid";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  computed: {
    ...mapGetters([
      'pageNameOf',
      'allFillablePages',
      'submitterDesignationOf',
    ]),

    theTitle() {
      let pageNames = this.control.pageIds.map(pageId => {
        return this.pageNameOf(pageId);
      }).join('，');

      if (pageNames) {
        return `引用页面：${pageNames}`;
      }
    },

    cardStyle() {
      return {
        ...appearanceStyles(this.control.appearanceStyle),
      }
    },

    allShowablePages() {
      return this.allFillablePages.filter(page => {
        return this.control.pageIds.includes(page.id);
      });
    },

    allItems() {
      return this.allShowablePages.map(page => {
        let fields = page.controls.filter(control => {
          return isControlFillable(control) && control.fillableSetting.submissionSummaryEligible;
        }).map(control => {
          return {id: control.id, fieldName: controlFieldName(control) + '：'};
        });
        return {
          id: uuid.generate(),
          pageId: page.id,
          time: formatEpochToMinute(Date.now()),
          name: pageActionName(page),
          requireLogin: page.setting.permission !== 'PUBLIC',
          fields: fields,
        };
      })
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-timeline-item__wrapper {
      padding-left: 15px !important;
    }

    .el-card__body {
      padding: 0 !important;
    }
  }
}

.wrapperWide {
}

.elCard {
  color: $regularTextColor;
}

.pageName {
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.3em;
  color: $primaryTextColor;
}

.contentRow {
  margin-bottom: 8px;
  line-height: 1.3em;
  font-size: 13px;
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $secondaryTextColor;
}

.contentRowWide {
  width: 100px;
}

.contentRow:last-child {
  margin-bottom: 0;
}

.placeholderText {
  color: $warningYellow;
}

</style>

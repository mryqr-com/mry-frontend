<template>
  <div :class="$style.wrapper">
    <template v-if="isAssignmentAllowed">
      <template v-if="detailLoaded">
        <section :class="$style.headerSection">
          <header :class="$style.headerTopBar">
            <div :class="$style.iconButtonContainer">
              <button :class="$style.iconButton"
                      class="majoricon i-left plainButton"
                      title="返回上级"
                      @click="goToUpperLink">
              </button>
            </div>
            <span :class="$style.assignmentName">{{ assignmentDetail.name }}</span>
            <div :class="$style.headerPlaceholder"></div>
          </header>

          <div :class="$style.detailContentContainer">
            <div :class="$style.detailRow">
              <div :class="$style.detailItem">
                周期：<span :class="$style.detailItemValue">{{ assignmentCycle }}</span>
              </div>
            </div>

            <div :class="$style.detailRow">
              <div :class="$style.detailItem">
                {{ groupDesignation }}：
                <span :class="$style.detailItemValue">{{ groupNameOf(assignmentDetail.groupId) }}</span>
              </div>
              <div :class="$style.detailItem">
                状态：<span :class="$style.detailItemValue" :style="statusStyle">{{ statusText }}</span>
              </div>
            </div>

            <div :class="$style.detailRow">
              <div :class="$style.detailItem">
                完成度：<span :class="$style.detailItemValue">{{ progressText }}</span>
              </div>
              <div :class="$style.detailItem">
                执行人：<span :class="$style.detailItemValue">{{ operatorNames }}</span>
              </div>
            </div>
          </div>

          <section :class="$style.statusBarContainer">
            <div :class="$style.statusFilterBar">
              <div
                  :class="[$style.statusFilterItem,{[$style.clickableStatusFilterItem]:assignmentDetail.allQrCount > 0}]"
                  @click="updateToAllStatus()">
                <div :class="[$style.statusCount,$style.allStatus]">{{ assignmentDetail.allQrCount }}</div>
                <div :class="$style.statusName">全部</div>
                <div :class="[$style.statusBottom,{[$style.allStatusBottom]:status === 'ALL'}]"></div>
              </div>

              <div
                  :class="[$style.statusFilterItem,{[$style.clickableStatusFilterItem]:assignmentDetail.finishedQrCount > 0}]"
                  @click="updateToFinishedStatus">
                <div :class="[$style.statusCount,$style.finishedStatus]">{{ assignmentDetail.finishedQrCount }}</div>
                <div :class="$style.statusName">已完成</div>
                <div :class="[$style.statusBottom,{[$style.finishedStatusBottom]:status === 'FINISHED'}]"></div>
              </div>

              <div
                  :class="[$style.statusFilterItem,{[$style.clickableStatusFilterItem]:assignmentDetail.allQrCount - assignmentDetail.finishedQrCount > 0}]"
                  @click="updateToUnfinishedStatus">
                <div :class="$style.statusCount" :style="unfinishedStatusColor">
                  {{ assignmentDetail.allQrCount - assignmentDetail.finishedQrCount }}
                </div>
                <div :class="$style.statusName">未完成</div>
                <div :class="$style.statusBottom" :style="unfinishedStatusBackgroundColor"></div>
              </div>
            </div>

            <div :class="$style.buttonContainer">
              <div :class="$style.filterIconButtonContainer">
                <button :class="[$style.filterIconButton,{[$style.hasFilterButton]:hasFilter}]"
                        class="majoricon i-filter plainButton"
                        title="筛选"
                        @click="openFilterDrawer">
                </button>
              </div>

              <div :class="$style.filterIconButtonContainer">
                <button v-if="isAppGeolocationEnabled"
                        :class="[$style.filterIconButton,{[$style.nearestPointEnabledButton]:nearestPointEnabled}]"
                        class="majoricon i-location plainButton"
                        title="离我最近的排在最前面"
                        @click="toggleGeolocationEnabled">
                </button>
              </div>
            </div>
          </section>
        </section>

        <main :class="$style.mainContent">
          <div v-for="qr in viewableQrs" :class="$style.qrContainer" @click="openQr(qr)">
            <section :class="$style.qrIconSection">
              <QrIcon :fontSize="24" :length="70" :qr="qr"></QrIcon>
            </section>

            <section :class="$style.qrContentSection">
              <div :class="$style.qrNameContainer">
                <div :class="$style.qrName">{{ qr.name }}</div>
                <div :class="$style.statusText" :style="qrStatusStyle(qr)">（{{ qrStatusText(qr) }}）</div>
              </div>

              <div :class="$style.qrContentContainer">
                <div :class="$style.itemRow">
                  <div :class="$style.itemName"> 完成时间：</div>
                  <div :class="$style.itemValue">
                    {{ qr.finishedAt ? formatEpochToMinute(qr.finishedAt) : '' }}
                  </div>
                </div>

                <div :class="$style.itemRow">
                  <div :class="$style.itemName"> 完成人：</div>
                  <div :class="$style.itemValue">{{ qr.operatorName }}</div>
                </div>
              </div>
            </section>

            <div :class="$style.iconButtonContainer">
              <button v-if="isAppGeolocationEnabled && qr.geolocation"
                      :class="[$style.iconButton,$style.locationButton]"
                      class="el-icon-map-location plainButton"
                      title="查看定位"
                      @click.stop="openQrLocation(qr)">
              </button>
            </div>
          </div>

          <InfiniteLoading :key="infiniteKey"
                           spinner="spiral"
                           @infinite="infiniteHandler">
            <div slot="no-more" :class="$style.infiniteMessage">
              <span v-if="qrs.length > 20">没有了</span>
            </div>
            <div slot="no-results" :class="$style.infiniteMessage">无数据</div>
          </InfiniteLoading>
        </main>

        <ClientAssignmentQrListFilterDrawer :show.sync="filterDrawerVisible">
        </ClientAssignmentQrListFilterDrawer>
      </template>
    </template>
    <template v-else>
      <div :class="$style.packageNotAllowedText">
        您当前的套餐版本过低或者已经过期，无法使用任务管理功能，请联系您的系统管理员在码如云官网进行套餐升级或续费。
        <el-button :class="$style.backButton" size="medium" type="primary" @click="goToUpperLink">返回</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from "vuex";
import ACTIONS from '@/client/operations/app/assignment/qrs/store/client-assignment-qr-list-actions';
import {formatEpochToMinute, qrUrlWithPage, qrUrlWithSubmission} from "@/common/utils/common-utils";
import assignmentStatuses from "@/common/utils/assignment-statuses";
import ClientAssignmentQrListFilterDrawer
  from '@/client/operations/app/assignment/qrs/ClientAssignmentQrListFilterDrawer';
import QrIcon from '@/common/components/QrIcon';
import {viewGeoLocation} from "@/common/utils/geolocation-utils";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');
const clientAssignmentQrListStore = createNamespacedHelpers('CLIENT_ASSIGNMENT_QR_LIST_STORE');

export default {
  props: {
    assignmentId: {
      type: String,
      required: true,
    },

    upperLinkName: {
      type: String,
      required: true,
    },
  },

  components: {
    QrIcon,
    ClientAssignmentQrListFilterDrawer,
    InfiniteLoading: () => import(/* webpackChunkName: "infinite-loading" */ 'vue-infinite-loading'),
  },

  data() {
    return {
      detailLoaded: false,
      filterDrawerVisible: false,
    }
  },

  created() {
    if (!this.isAssignmentAllowed) {
      return;
    }

    this.init();
    return this[ACTIONS.FETCH_ASSIGNMENT_DETAIL]().then(() => {
      this.detailLoaded = true;
      document.title = this.assignmentDetail.name;
      document.addEventListener('visibilitychange', this.onVisible);
    });
  },

  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.onVisible);
  },

  computed: {
    ...clientAssignmentQrListStore.mapState([
      'assignmentDetail',
      'status',
      'qrs',
      'infiniteKey',
      'nearestPointEnabled',
    ]),

    ...clientAssignmentQrListStore.mapGetters(['hasFilter']),

    ...mapGetters([
      'isAssignmentAllowed',
      'memberId',
    ]),

    ...clientAppOperationStore.mapGetters([
      'groupNameOf',
      'groupDesignation',
      'isAppGeolocationEnabled',
      'canManageGroup',
    ]),

    viewableQrs() {
      if (this.status === 'UNFINISHED') {
        return this.qrs.filter(qr => !qr.submissionId);
      } else {
        return this.qrs;
      }
    },

    assignmentCycle() {
      let detail = this.assignmentDetail;
      return `${formatEpochToMinute(detail.startAt)} 至 ${formatEpochToMinute(detail.expireAt)}`;
    },

    progressText() {
      let detail = this.assignmentDetail;

      let percentage = Math.floor(detail.finishedQrCount / detail.allQrCount * 100);
      return `${percentage}%（${detail.finishedQrCount} / ${detail.allQrCount}）`
    },

    operatorNames() {
      let result = this.assignmentDetail.operatorNames.join(', ');
      return result ? result : '无';
    },

    statusText() {
      return assignmentStatuses.find(stat => stat.key === this.assignmentDetail.status).name;
    },

    statusStyle() {
      return {
        fontWeight: 500,
        color: assignmentStatuses.find(stat => stat.key === this.assignmentDetail.status).color,
      }
    },

    unfinishedStatusColor() {
      if (this.assignmentDetail.status === 'FAILED') {
        return {
          color: '#ea0000',
        }
      } else {
        return {
          color: '#E6A23C',
        }
      }
    },

    unfinishedStatusBackgroundColor() {
      if (this.status === 'UNFINISHED') {
        if (this.assignmentDetail.status === 'FAILED') {
          return {
            backgroundColor: '#ea0000',
          }
        } else {
          return {
            backgroundColor: '#E6A23C',
          }
        }
      }
    },
  },

  methods: {
    ...clientAssignmentQrListStore.mapActions([
      ACTIONS.FETCH_ASSIGNMENT_DETAIL,
      ACTIONS.LIST_ASSIGNMENT_QRS,
      ACTIONS.FETCH_ASSIGNMENT_QR_DETAIL,
    ]),

    formatEpochToMinute: formatEpochToMinute,

    ...clientAssignmentQrListStore.mapMutations([
      'resetState',
      'initState',
      'updateStatus',
      'updateNearestPointEnabled',
      'resetInfinite',
      'setWorkingQrId',
      'refreshKeepStateKey',
    ]),

    init() {
      this.resetState();
      this.initState({assignmentId: this.assignmentId});
    },

    onVisible() {
      if (document.visibilityState === 'visible') {
        this.refreshKeepStateKey();
        this[ACTIONS.FETCH_ASSIGNMENT_QR_DETAIL]();
      }
    },

    goToUpperLink() {
      this.$router.push({name: this.upperLinkName});
    },

    setStatus(value) {
      this.updateStatus(value);
      this.resetInfinite();
    },

    updateToAllStatus() {
      this.setStatus('ALL');
    },

    updateToFinishedStatus() {
      if (this.assignmentDetail.finishedQrCount > 0) {
        this.setStatus('FINISHED');
      }
    },

    updateToUnfinishedStatus() {
      if (this.assignmentDetail.allQrCount - this.assignmentDetail.finishedQrCount > 0) {
        this.setStatus('UNFINISHED');
      }
    },

    toggleGeolocationEnabled() {
      this.updateNearestPointEnabled(!this.nearestPointEnabled);
      this.resetInfinite();
    },

    openFilterDrawer() {
      this.filterDrawerVisible = true;
    },

    infiniteHandler(infiniteState) {
      return this[ACTIONS.LIST_ASSIGNMENT_QRS](infiniteState);
    },

    canOpenQr(qr) {
      if (this.canManageGroup(this.assignmentDetail.groupId)) {
        return true;
      }

      if (qr.submissionId) {
        return qr.operatorId === this.memberId;
      }

      return this.assignmentDetail.status !== 'FAILED';
    },

    openQr(qr) {
      if (!this.canOpenQr(qr)) {
        return;
      }

      this.setWorkingQrId(qr.id);

      if (qr.submissionId) {
        window.open(qrUrlWithSubmission(qr.plateId, this.assignmentDetail.pageId, qr.submissionId), '_blank');
      } else {
        window.open(qrUrlWithPage(qr.plateId, this.assignmentDetail.pageId), '_blank');
      }
    },

    openQrLocation(qr) {
      viewGeoLocation({
        name: qr.name,
        geolocation: qr.geolocation
      });
    },

    qrStatusText(qr) {
      return qr.finished ? '已完成' : '未完成';
    },

    qrStatusStyle(qr) {
      if (qr.finished) {
        return {
          color: '#10b01b',
        }
      }

      if (this.assignmentDetail.status === 'FAILED') {
        return {
          color: '#ea0000',
        }
      }

      return {
        color: '#E6A23C',
      }
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow-y: auto;
}

$topBarHeight: 70px;
$headerSectionHeight: 256px;

.headerSection {
  height: $headerSectionHeight;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: $clientPageZIndex + 1;
  background-color: white;
  box-shadow: $lightShadow;
}

.headerTopBar {
  width: 100%;
  height: $topBarHeight;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.iconButtonContainer {
  flex-shrink: 0;
  flex-grow: 0;
  padding: 10px;
}

.iconButton {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $clientIconButtonLength;
  width: $clientIconButtonLength;
  color: $regularTextColor;
  font-size: 20px;
}

.assignmentName {
  font-weight: 500;
  color: $primaryTextColor;
  font-size: 18px;
  line-height: 1.2em;
}

.headerPlaceholder {
  width: calc(#{$clientIconButtonLength} + 20px);
  height: $topBarHeight;
}

.detailContentContainer {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 15px;
}

.detailRow {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detailItem {
  flex-shrink: 1;
  flex-grow: 0;
}

.detailItemValue {
  color: $primaryTextColor;
}

.statusBarContainer {
  border-top: $primary1pxBorder;
  display: flex;
}

.statusFilterBar {
  padding-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
}

.statusFilterItem {
  width: 100px;
}

.clickableStatusFilterItem {
  cursor: pointer;
}

.statusCount {
  font-weight: 600;
  font-size: 24px;
  text-align: center;
}

.statusName {
  margin-top: 10px;
  text-align: center;
  color: $secondaryTextColor;
}

.statusBottom {
  height: 4px;
  margin-top: 8px;
  width: 50px;
  margin-left: auto;
  margin-right: auto;
}

.buttonContainer {
  margin-right: 5px;
}

.filterIconButtonContainer {
  padding: 5px;
}

.filterIconButton {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  font-size: 18px;
  color: $secondaryTextColor;

}

.hasFilterButton:before {
  font-weight: 500;
  color: $oppositeThemeColor;
}

.nearestPointEnabledButton:before {
  font-weight: 500;
  color: $oppositeThemeColor;
}

.allStatus {
  color: $normalBlue;
}

.allStatusBottom {
  background-color: $normalBlue;
}

.finishedStatus {
  color: $passGreen;
}

.finishedStatusBottom {
  background-color: $passGreen;
}

.mainContent {
  background-color: $primaryBackgroundColor;
  position: relative;
  z-index: $clientPageZIndex;
  margin-top: $headerSectionHeight;
  padding: 12px 10px;
  height: calc(100vh - #{$headerSectionHeight});
  overflow-y: auto;
}

.qrContainer {
  background-color: white;
  margin-bottom: 12px;
  display: flex;
  cursor: pointer;
}

.qrIconSection {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 10px;
}

.qrContentSection {
  flex-grow: 1;
  padding: 10px 10px 10px 5px;
}

.qrNameContainer {
  display: flex;
  align-items: center;
}

.qrName {
  font-weight: 500;
  color: $primaryTextColor;
  line-height: 1.3em;
  word-break: break-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.statusText {
  flex-grow: 0;
  flex-shrink: 0;
  font-weight: 500;
}

.qrContentContainer {
  margin-top: 10px;
  font-size: 13px;
  color: #b0b5bd;
}

.itemRow {
  margin-bottom: 5px;
  line-height: 1.3em;
  display: flex;
}

.itemRow:last-child {
  margin-bottom: 0;
}

.itemName {
  width: 80px;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.itemValue {
  flex-grow: 1;
  word-break: break-all;
  color: $secondaryTextColor;
}

.locationButton {
  color: $secondaryTextColor;
  margin-left: 5px;
}

.locationButton:before {
  font-size: 16px;
}

.infiniteMessage {
  padding-bottom: 15px;
}

.packageNotAllowedText {
  padding: 15px;
  line-height: 1.8em;
  margin-top: 30vh;
}

.backButton {
  display: block;
  width: $pageButtonWidth;
  margin-left: auto;
  margin-right: auto;
  margin-top: 36px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .mainContent {
    padding: 15px 10px;
  }

  .qrContainer {
    margin-bottom: 15px;
  }

  .itemName {
    width: 100px;
  }
}

</style>

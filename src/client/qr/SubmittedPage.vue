<template>
  <div :class="$style.wrapper">
    <img :class="$style.submittedImage" :src="submittedPageUrl" alt="成功"/>

    <div :class="$style.rightTick">
      <svg :class="$style.checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <circle :class="$style.checkmark__circle" cx="26" cy="26" fill="none" r="25"/>
        <path :class="$style.checkmark__check" d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none"/>
      </svg>

      <div :class="$style.qrMessage">{{ qrName }}</div>
      <div :class="$style.submittedMessage">{{ submittedMessage }}</div>
    </div>

    <div v-if="canViewBackToHomePage" :class="$style.returnButtonWrapper">
      <StyledButton :buttonStyle="currentPageSubmitButton.buttonStyle"
                    :class="$style.returnButton"
                    @click="goToQrHomePage">
        返回首页
      </StyledButton>
    </div>

    <div v-if="canViewSubmission" :class="$style.viewSubmissionSection">
      <span class="underLinedLink" @click="viewSubmission">查看提交</span>
    </div>

  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import PageHeaderContainer from '@/client/qr/PageHeaderContainer'
import submittedPage from '@/common/assets/submitted-page-header.jpeg';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    PageHeaderContainer
  },

  data() {
    return {
      submissionId: null,
    }
  },

  created() {
    if (this.$route.query.submissionId) {
      this.submissionId = this.$route.query.submissionId.toUpperCase();
    }
  },

  methods: {
    viewSubmission() {
      this.$router.replace({
        name: "edit-submission",
        params: {submissionId: this.submissionId}
      });
    },

    goToQrHomePage() {
      this.$router.replace({name: 'new-submission', params: {pageId: this.homePageId}});
    },
  },

  computed: {
    ...clientQrStore.mapState(['mode']),

    ...clientQrStore.mapGetters([
      'isMemberBelongToTenant',
      'isQrTemplate',
      'currentPage',
      'qrName',
      'currentPageSubmitButton',
      'isCurrentPageRequireLogin',
      'hasAccessToPage',
      'homePageId',
    ]),

    submittedPageUrl() {
      return submittedPage;
    },

    submittedMessage() {
      switch (this.mode) {
        case 'DEFAULT': {
          return '提交成功';
        }

        case 'UPDATE': {
          return '更新成功';
        }

        case 'APPROVAL': {
          return '审批成功';
        }
      }
    },

    canViewBackToHomePage() {
      return this.hasAccessToPage(this.homePageId);
    },

    canViewSubmission() {
      if (this.isQrTemplate) {
        return false;
      }

      if (this.mode === 'DEFAULT') {
        return this.isMemberBelongToTenant && this.isCurrentPageRequireLogin;
      }

      return false;
    },

  }
};
</script>

<style lang="scss" module>
.wrapper {
  min-height: 100%;
  padding-bottom: 50px;
}

.submittedImage {
  width: 100%;
}

.rightTick {
  padding-top: 25px;
  padding-bottom: 25px;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 10px auto;
  box-shadow: inset 0 0 0 #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0 0 0 30px #7ac142;
  }
}

.qrMessage {
  text-align: center;
  margin: 18px auto;
}

.submittedMessage {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  margin: 18px auto;
}

.returnButtonWrapper {
  padding-right: $narrowPageVPadding;
  padding-left: $narrowPageVPadding;
  text-align: center;
}

.viewSubmissionSection {
  margin-top: 50px;
  text-align: center;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .wrapper {
    min-height: auto;
  }

  .returnButtonWrapper {
    padding-right: $widePageVPadding;
    padding-left: $widePageVPadding;
  }

  .returnButton {
    width: $maxControlButtonWidth !important;
  }
}

</style>

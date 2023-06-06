<template>
  <LeftNavedPageWrapper v-if="loaded">
    <template v-slot:menu="{fold}">
      <ul>
        <li :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :title="qrName"
                       :to="{name:'qr-operation-workbench',params: { qrId: qrId }}"
                       tag="div">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="home"/></span>
            <span v-if="!fold">{{ qrName }}</span>
          </router-link>
        </li>

        <template v-if="!template">
          <li v-for="menuItem in allViewableGroupOperationMenuItems" :class="$style.menuLi">
            <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                         :title="menuItem.name"
                         :to="operationMenuLink(menuItem)"
                         tag="div">
              <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="menuItem.icon"/></span>
              <span v-if="!fold">{{ menuItem.name }}</span>
            </router-link>
          </li>
        </template>
      </ul>
    </template>
    <div :class="$style.rightSection">
      <QrOperationTopBar :groupId="groupId"
                         :qrName="qrName"
                         :template="template">
      </QrOperationTopBar>
      <router-view :key="$route.path"></router-view>
    </div>
  </LeftNavedPageWrapper>
</template>

<script>
import LeftNavedPageWrapper from '@/console/common/LeftNavedPageWrapper';
import qrApi from '@/common/api/qr-api';
import {createNamespacedHelpers} from "vuex";
import QrOperationTopBar from '@/console/app-operation/qr-operation/QrOperationTopBar';
import eventBus from "@/common/utils/event-bus";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['qrId'],

  components: {
    LeftNavedPageWrapper,
    QrOperationTopBar,
  },

  data() {
    return {
      loaded: false,
      groupId: null,
      qrName: null,
      template: false,
    }
  },

  created() {
    eventBus.$emit('lefeMenuFoldChanged', 'NONE');

    return qrApi.fetchQrSummary(this.qrId).then(response => {
      let qrSummary = response.data;
      this.groupId = qrSummary.groupId;
      this.qrName = qrSummary.name;
      this.template = qrSummary.template;
      this.updateCurrentQr(qrSummary);
      this.loaded = true;
    });
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppId',
      'managableGroupIds',
      'viewableGroupIds',
      'approvableGroupIds',
      'allViewableAppOperationMenuItems'
    ]),

    allViewableGroupOperationMenuItems() {
      return this.allViewableAppOperationMenuItems.filter(item => {
        switch (item.type) {
          case 'ALL_SUBMIT_HISTORY': {
            return this.managableGroupIds.includes(this.groupId);
          }
          case 'SUBMITTER_SUBMISSION': {
            return this.viewableGroupIds.includes(this.groupId);
          }
          case 'TO_BE_APPROVED': {
            return this.approvableGroupIds.includes(this.groupId);
          }
        }
      });
    }
  },

  methods: {
    ...appOperationStore.mapMutations(['updateCurrentQr']),
    operationMenuLink(menuItem) {
      switch (menuItem.type) {
        case 'ALL_SUBMIT_HISTORY': {
          return {
            name: 'qr-operation-submission-history-list',
            params: {appId: this.currentAppId, qrId: this.qrId, pageId: menuItem.pageId}
          };
        }

        case 'SUBMITTER_SUBMISSION': {
          return {
            name: 'qr-operation-submitter-submission-list',
            params: {appId: this.currentAppId, qrId: this.qrId, pageId: menuItem.pageId}
          };
        }

        case 'TO_BE_APPROVED': {
          return {
            name: 'qr-operation-approve-list',
            params: {appId: this.currentAppId, qrId: this.qrId, pageId: menuItem.pageId}
          };
        }
      }
    }
  },
}
</script>


<style lang="scss" module>
.menuLi:hover {
  background-color: $leftBarBackgroundColor;
}

.menuLi {
  :global {
    .router-link-active {
      color: white;
      background-color: $oppositeThemeColor;
    }
  }
}

.link {
  display: flex;
  align-items: center;
  color: $leftBarTextColor;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 30px;
  font-size: 15px;
  cursor: pointer;
}

.foldedLink {
  justify-content: center;
  padding-left: 0;
}

.icon {
  display: inline-block;
  width: 30px;
}

.foldedIcon {
  width: auto;
}

.rightSection {
  height: 100vh;
}

</style>

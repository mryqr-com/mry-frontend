<template>
  <div :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">
        {{ groupDesignation }}列表
        <HelpDocLinker url="//docs.mryqr.com/console-app-operation/group-management/"></HelpDocLinker>
      </div>

      <div :class="$style.opsButtons">
        <el-input v-model="searchTerm"
                  :class="$style.searchInput"
                  :maxlength="50"
                  :spellcheck="false"
                  clearable
                  placeholder="搜索..."
                  size="medium">
        </el-input>
      </div>
    </div>

    <el-table ref="theTable"
              :class="$style.theTable"
              :data="finalGroups"
              :height="tableHeight"
              highlight-current-row>
      <el-table-column class-name="firstColumn"
                       column-key="name"
                       label="名称"
                       min-width="150">
        <template slot-scope="scope">
          <span :class="$style.groupNameContainer" @click="enterGroupOperationPage(scope.row)">
            <span :class="$style.groupName">
            {{ scope.row.name }}
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="medium"
                     title="进入运营页"
                     type="text"
                     @click.stop="enterGroupOperationPage(scope.row)">
            进入运营页
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapMutations} from 'vuex';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  data() {
    return {
      searchTerm: null,
    }
  },

  created() {
    document.title = `${this.groupDesignation}管理 - ${this.currentAppName}`;

    if (this.groupDirty) {
      this.refreshConsoleHomePage();
    }
  },

  methods: {
    ...mapMutations(['refreshConsoleHomePage']),

    enterGroupOperationPage(group) {
      this.$router.push({name: 'group-operation-qr-list', params: {groupId: group.id}});
    },
  },

  computed: {
    ...appOperationStore.mapState(['groupDirty']),

    ...appOperationStore.mapGetters([
      'currentAppName',
      'groupDesignation',
      'viewableGroups',
    ]),

    finalGroups() {
      if (!this.searchTerm) {
        return this.viewableGroups;
      }

      let keywords = this.searchTerm.split(' ');
      return this.viewableGroups.filter(app => keywords.every(keyword => app.name.indexOf(keyword) > -1));
    },

    tableHeight() {
      return window.innerHeight - 60 - 24 - 60 - 5 - 24;
    },
  }
}
</script>


<style lang="scss" module>
$content-margin: 24px;
$ops-bar-height: 60px;
$ops-bar-margin-bottom: 5px;

.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin});
  margin: $content-margin;
}

.opsBar {
  padding: 0 16px;
  height: $ops-bar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $whiteBackgroundColor;
  margin-bottom: $ops-bar-margin-bottom;
}

.theTitle {
  font-size: 15px;
  font-weight: 500;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.searchInput {
  width: 250px;
}

.theTable {
  width: 100%;
  background-color: $whiteBackgroundColor;

  :global {
    th {
      color: $primaryTextColor;
    }

    td {
      padding-top: 0;
      padding-bottom: 0;
    }

    .firstColumn {
      padding-left: 16px;
    }
  }
}

.groupNameContainer {
  display: flex;
  align-items: center;
  padding-top: 18px;
  padding-bottom: 18px;
}

.groupNameContainer:hover {
  color: $primaryThemeColor;
  cursor: pointer;
}

.groupName {
  margin-right: 10px;
}

</style>

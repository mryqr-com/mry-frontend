<template>
  <div v-if="loaded" :class="$style.wrapper">
    <div :class="$style.createButtonContainer">
      <el-button :class="$style.createButton"
                 :disabled="isConsigneeFull"
                 icon="el-icon-plus"
                 size="medium"
                 type="primary"
                 @click="newConsignee">
        新增收货地址 ({{ `${consignees.length}/5` }})
      </el-button>
      最多可以添加5个收货地址
    </div>

    <div v-for="consignee in consignees" :class="$style.consigneeContainer">
      <div :class="$style.consigneeTitle">
        <span :class="$style.consigneeName">{{ consignee.name }}</span>
        <div :class="$style.consigneeOpsContainer">
          <el-button size="small" type="text" @click="updateConsignee(consignee)">更新</el-button>
          <el-button size="small" type="text" @click="deleteConsignee(consignee)">删除</el-button>
        </div>
      </div>
      <div :class="$style.row">
        <span :class="$style.rowKey">收货人：</span>
        <span :class="$style.rowValue">{{ consignee.name }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">手机号：</span>
        <span :class="$style.rowValue">{{ consignee.mobile }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">收货地址：</span>
        <span :class="$style.rowValue">{{ displayAddress(consignee.address) }}</span>
      </div>
    </div>

    <EditConsigneeDialog :consignee="editingConsignee"
                         :isNew="isNew"
                         :show.sync="editDialogVisible"
                         @created="onCreated"
                         @updated="onUpdated">
    </EditConsigneeDialog>
  </div>
</template>

<script>
import tenantApi from '@/common/api/tenant-api';
import EditConsigneeDialog from '@/console/management/tenant/setting/EditConsigneeDialog';
import uuid from 'short-uuid';
import Vue from 'vue';
import {displayAddress} from '@/common/utils/common-utils';

export default {
  components: {
    EditConsigneeDialog,
  },

  data() {
    return {
      loaded: false,
      consignees: [],
      editingConsignee: {},
      isNew: true,
      editDialogVisible: false,
    }
  },

  created() {
    return tenantApi.listConsignees().then((response) => {
      this.consignees = response.data;
      this.loaded = true;
    });
  },

  computed: {
    isConsigneeFull() {
      return this.consignees.length >= 5;
    },
  },

  methods: {
    displayAddress,
    newConsignee() {
      this.editingConsignee = {
        id: uuid.generate(),
        name: null,
        mobile: null,
        address: {
          province: null,
          city: null,
          district: null,
          address: null,
        }
      };
      this.isNew = true;
      this.editDialogVisible = true;
    },

    updateConsignee(consignee) {
      this.editingConsignee = consignee;
      this.isNew = false;
      this.editDialogVisible = true;
    },

    deleteConsignee(consignee) {
      return this.$confirm(`确认删除该收货地址？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return tenantApi.deleteConsignee(consignee.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除收货地址。`,
            center: true
          });

          this.consignees.splice(this.consignees.findIndex(i => i.id === consignee.id), 1);
        });
      });
    },

    onCreated(consignee) {
      return tenantApi.addConsignee({consignee: consignee}).then(() => {
        this.$message({
          type: 'success',
          message: `成功添加收货地址。`,
          center: true
        });
        this.consignees.unshift(consignee);
      });
    },

    onUpdated(consignee) {
      return tenantApi.updateConsignee({consignee: consignee}).then(() => {
        this.$message({
          type: 'success',
          message: `成功更新收货地址。`,
          center: true
        });

        Vue.set(this.consignees, this.consignees.findIndex(e => e.id === consignee.id), consignee);
      });
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.createButtonContainer {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.createButton {
  margin-right: 15px;
}

.consigneeContainer {
  border: $primary1pxBorder;
  padding: 10px 24px;
  width: 700px;
  margin-bottom: 15px;
  min-height: 170px;
}

.consigneeTitle {
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.consigneeName {
  font-size: 16px;
  color: $primaryTextColor;
  font-weight: 500;
}

.row {
  display: flex;
  margin-bottom: 5px;
}

.rowKey {
  width: 80px;
  flex-shrink: 0;
  flex-grow: 0;
  line-height: 1.6em;
}

.rowValue {
  margin-left: 10px;
  flex-grow: 1;
  line-height: 1.6em;
  color: $primaryTextColor;
}

.consigneeOpsContainer {
  text-align: right;
}

</style>

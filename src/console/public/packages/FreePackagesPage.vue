<template>
  <div :class="$style.wrapper">
    <div :class="$style.content">
      <div :class="$style.planTitle">服务价格</div>
      <div :class="$style.contentLine">
        使用码如云是免费的，系统为每个租户分配有默认的数据额度（详情可在"账户管理"页面查看），如果您对数据用量有额外需求，请联系码如云客服，我们将根据您的实际情况为您增加数据额度，并且也是免费的。
      </div>

<!--todo: 加入打赏二维码-->

      <div :class="$style.contentLine">
        如有意开展商务合作，比如源代码采购等，请联系码如云客服。
      </div>
    </div>

    <MryOfficialSiteFooter :class="$style.footer"></MryOfficialSiteFooter>

    <MryCustomerServiceEntry :class="$style.customerService"
                             :iconSize="24"
                             :textSize="13"
                             trigger="hover">
    </MryCustomerServiceEntry>
  </div>
</template>

<script>
import MryOfficialSiteFooter from '@/console/common/components/MryOfficialSiteFooter';

export default {
  components: {
    MryOfficialSiteFooter,
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

.content {
  margin-top: 150px;
}

.planTitle {
  font-size: 36px;
  font-weight: 500;
  color: $primaryTextColor;
  text-align: center;
  margin: auto auto 50px;
}

.contentLine {
  font-size: 16px;
  line-height: 1.6em;
  width: 800px;
  margin: auto auto 30px;
}

.customerService {
  position: fixed;
  top: 100px;
  right: 50px;
  z-index: 200;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>

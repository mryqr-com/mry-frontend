<template>
  <div :class="$style.wrapper">
    <div :class="$style.content">
      <div :class="$style.planTitle">印刷服务</div>
      <div :class="$style.contentLine">
        码如云当前尚不提供码牌印刷服务，您可在淘宝或京东等电商平台自行联系码牌制作商。 此外，码如云先前与以下商家有过合作经历，效果还不错，供参考：
      </div>

      <div :class="$style.contentLine">
        1. <a class="primaryColoredTextLink"
              href="https://shop458295490.taobao.com/shop/view_shop.htm"
              target="_blank">漋晟包装彩印</a>：可定制亚银和PVC材质的二维码标签纸
      </div>

      <div :class="$style.contentLine">
        2. <a class="primaryColoredTextLink"
              href="https://item.taobao.com/item.htm?spm=a21n57.1.0.0.415a224cahXpUd&id=669168953924&ns=1&abbucket=0#detail"
              target="_blank">初见源标识牌工厂店</a>：可定制亚克力材质的二维码牌
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

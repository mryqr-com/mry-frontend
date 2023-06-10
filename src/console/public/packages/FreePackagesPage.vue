<template>
  <div :class="$style.wrapper">
    <div :class="$style.content">
      <div :class="$style.planTitle">服务价格</div>
      <div :class="$style.contentLine">
        使用码如云是<span :class="$style.freeText">免费</span>的，系统为每个租户都分配有默认的数据额度（详情可在"账户管理"页面查看），如果您对数据用量有额外需求，请联系码如云客服，我们将根据您的实际情况为您增加数据额度，并且也是免费的。
      </div>

      <div :class="$style.sectionTitle">为什么免费？</div>
      <div :class="$style.contentLine">
        码如云一开始是其作者为了学习计算机软件技术而开发的一套演示系统，后来发现如果这套系统能有人使用的话将具有更大的价值与意义，于是作者按照商业软件的标准开发出了一套完整的业务系统，并自购阿里云资源搭建起本网站，以供大家免费使用。
      </div>

      <div :class="$style.contentLine">
        您对本网站的每一次访问都能给作者带来愉悦感与满足感。花业余时间运维本网站实属不易，如果您觉得本网站或者本网站的源代码能给您带来实际价值，您可微信扫描以下二维码对作者发起赞赏，以请作者喝杯咖啡。
      </div>

      <img :class="$style.donationImage" alt="给滕云赞赏" src="/images/donation.jpeg"/>

      <div :class="$style.contentLine">
        以下内容对软件开发者可能有用：码如云的源代码是开源的，Github地址：<a class="primaryColoredTextLink"
                                                                target="_blank"
                                                                href="https://github.com/mryqr-com">https://github.com/mryqr-com</a>。
        作者滕云是<a class="primaryColoredTextLink"
                     target="_blank"
                     href="https://book.douban.com/subject/25844633/">《实现领域驱动设计》</a>一书的译者，在码如云的开发过程中，作者全程使用了领域驱动设计（Domain
        Driven Design，DDD）、事件驱动架构（Event Driven Architecture，EDA）和整洁架构（Clean Architecture）等软件思想完成软件的设计与编码。
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
  margin: 120px auto auto;
  max-width: 800px;
  padding: 15px;
}

.planTitle {
  font-size: 36px;
  font-weight: 500;
  color: $primaryTextColor;
  text-align: center;
  margin: auto auto 30px;
}

.contentLine {
  font-size: 16px;
  line-height: 1.6em;
  margin: auto auto 24px;
}

.freeText {
  color: $passGreen;
  font-weight: bold;
}

.sectionTitle {
  font-size: 24px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 10px;
  color: $primaryTextColor;
}

.donationImage {
  max-width: 250px;
  display: block;
  margin: 40px auto;
}

.customerService {
  position: fixed;
  top: 100px;
  right: 50px;
  z-index: 200;
}

.footer {
  margin-top: 150px;
}

@media (max-width: $mobileScreenBreakpoint) {
  .content {
    margin-top: 50px;
  }

  .footer {
    display: none;
  }
}
</style>

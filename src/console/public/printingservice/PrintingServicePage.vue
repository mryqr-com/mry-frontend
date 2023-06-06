<template>
  <div :class="$style.wrapper">
    <section :class="$style.headerSection">
      <div :class="$style.sectionTitle">码如云印刷服务</div>
      <div :class="$style.headerSubTitle">
        <div :class="$style.headerSubTitleRow"> 对于有<a
            class="primaryColoredTextLink"
            href="//docs.mryqr.com/console-app-operation/plate-printing/"
            target="_blank">码牌印刷</a>需求的应用场景，用户除了可以自行印制码牌之外，还可以使用码如云提供的码牌印刷服务。
        </div>
        <div :class="$style.headerSubTitleRow"> 您只需要在线下单，之后我们将把制作好的码牌邮寄给您。</div>
      </div>
    </section>

    <section :class="$style.plateSelectSection">
      <div :class="$style.sectionTitle">请选择码牌材质</div>
      <div :class="$style.plateSelectContent">
        <div v-for="product in products"
             :id="product.id"
             :class="$style.productCard"
             @click="openIntroductionDialog(product)">

          <div :class="$style.productImage" :style="productImageStyle(product)">
            {{ product.image ? null : product.name }}
          </div>

          <div :class="$style.productTextInfo">
            <div :class="$style.productName">{{ product.name }}</div>
            <div :class="$style.productDescription">{{ product.description }}</div>
          </div>

          <div :class="$style.cardFooter">
            <span>
              <span :class="$style.priceText">{{ priceRangeOf(product) }}</span>
              <span :class="$style.priceSuffix">元/个</span>
            </span>
            <el-button :class="$style.purchaseButton"
                       size="small"
                       type="primary"
                       @click.stop="openPurchaseDialog(product)">
              购买
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <section :class="$style.faqSection">
      <div :class="$style.faqSectionTitle">常见问题</div>
      <div :class="$style.faqContentContainer">
        <el-row :class="$style.faqRow" :gutter="100">
          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">下单前需要做些什么准备？</div>
              <div :class="$style.faqContent">
                在下单前，您需要下载码牌图片并打包成zip或rar格式文件（如果下载时已经是zip包则不用了），可通过<a class="primaryColoredTextLink"
                                                                      href="//docs.mryqr.com/console-app-operation/get-qr-plate"
                                                                      target="_blank">下载实例码牌</a>或<a
                  class="primaryColoredTextLink"
                  href="//docs.mryqr.com/console-app-operation/plate-batch"
                  target="_blank">下载批量码牌</a>方式进行下载。
                另外，在下单时请确保所选择的码牌规格和码牌图片规格一致。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">先创建实例还是先印制码牌？</div>
              <div :class="$style.faqContent">二者均可，根据不同的业务场景而定。对于需要经常性新增实例的场景（比如树木的一物一码管理），我们建议先行<a
                  class="primaryColoredTextLink" href="//docs.mryqr.com/console-app-operation/plate-batch"
                  target="_blank">批量印制码牌</a>，这样在之后的运营中就可以直接将新实例绑定到预先印制好的码牌上了，从而省去了反复下单印制码牌的操作。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">什么时候发货？如何查看物流信息？</div>
              <div :class="$style.faqContent">下单成功后，我们将尽快安排工厂印制码牌，通常可在5个工作日内发货，您可在<a class="primaryColoredTextLink"
                                                                                     href="/management/orders"
                                                                                     target="_blank">订单管理</a>页面查看物流信息。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">码牌图片如何在普通打印机中打印？</div>
              <div :class="$style.faqContent">
                您可以使用码如云提供的
                <el-button class="noPadding" type="text" @click="openImagesToPdfConverter">码牌图片转PDF工具</el-button>
                将多张码牌图片转为PDF文件，然后即可使用普通打印机打印了。
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <MryOfficialSiteFooter></MryOfficialSiteFooter>

    <MryCustomerServiceEntry :class="$style.customerService"
                             :iconSize="24"
                             :textSize="13"
                             trigger="hover">
    </MryCustomerServiceEntry>

    <PrintingProductIntroductionDialog :product="selectedProduct"
                                       :show.sync="introductionDialogVisible"
                                       @purchase="openPurchaseDialog">
    </PrintingProductIntroductionDialog>

    <PurchasePrintingProductDialog :product="selectedProduct"
                                   :show.sync="purchaseDialogVisible">
    </PurchasePrintingProductDialog>

    <ImagesToPdfConvertDialog :show.sync="imagesToPdfConverterVisible"></ImagesToPdfConvertDialog>
  </div>
</template>

<script>
import printingProductApi from '@/common/api/printing-product-api';
import {imageDisplayUrl} from "@/common/utils/image-utils";
import MryOfficialSiteFooter from '@/console/common/components/MryOfficialSiteFooter';
import PrintingProductIntroductionDialog from '@/console/public/printingservice/PrintingProductIntroductionDialog';
import PurchasePrintingProductDialog from '@/console/public/printingservice/PurchasePrintingProductDialog';
import ACTIONS from "@/console/console-root-action";
import ImagesToPdfConvertDialog from '@/common/components/ImagesToPdfConvertDialog';
import {mapActions, mapGetters} from 'vuex';

export default {
  components: {
    MryOfficialSiteFooter,
    PrintingProductIntroductionDialog,
    PurchasePrintingProductDialog,
    ImagesToPdfConvertDialog,
  },

  data() {
    return {
      products: [],
      selectedProduct: null,
      introductionDialogVisible: false,
      purchaseDialogVisible: false,
      imagesToPdfConverterVisible: false,
    }
  },

  mounted() {
    document.title = '码如云印刷服务';

    return printingProductApi.listPrintingProducts().then(response => {
      this.products = response.data;
    });
  },

  computed: {
    ...mapGetters([
      'isTenantAdmin',
    ]),
  },

  methods: {
    ...mapActions([
      ACTIONS.FETCH_MY_PROFILE,
    ]),

    productImageStyle(product) {
      return {
        backgroundImage: `url('${imageDisplayUrl(product.image)}')`
      };
    },

    openIntroductionDialog(product) {
      this.selectedProduct = product;
      this.introductionDialogVisible = true;
    },

    priceRangeOf(product) {
      let prices = product.printingTypes.map(type => type.unitPrice);
      let min = Math.min(...prices);
      let max = Math.max(...prices);
      return `${min.toFixed(1)} ~ ${max.toFixed(1)}`
    },

    openPurchaseDialog(product) {
      return this[ACTIONS.FETCH_MY_PROFILE]().then(() => {
        if (!this.isTenantAdmin) {
          this.$message({
            type: 'warning',
            message: `您当前不是系统管理员，无法购买，请联系您的系统管理员进行购买。`,
            center: true
          });
          return;
        }

        this.selectedProduct = product;
        this.purchaseDialogVisible = true;
      });
    },

    openImagesToPdfConverter() {
      this.imagesToPdfConverterVisible = true;
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.headerSection {
  padding-top: 100px;
  padding-bottom: 100px;
  background-color: white;
}

.sectionTitle {
  font-size: 36px;
  font-weight: 500;
  color: $primaryTextColor;
  margin: auto;
  text-align: center;
}

.headerSubTitle {
  width: 1000px;
  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
}

.headerSubTitleRow {
  font-size: 18px;
  text-align: center;
  line-height: 2em;
}

.plateSelectSection {
  padding-top: 80px;
  background-color: $lightBackgroundColor;
  padding-bottom: 50px;
}

.plateSelectContent {
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.productCard {
  border: $primary1pxBorder;
  background-color: white;
  width: 250px;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .16);
  transition: transform .3s;
}

.productCard:hover {
  transform: scale(1.03);
  cursor: pointer;
}

.productImage {
  background-position: center center;
  background-size: cover;
  width: 100%;
  height: 170px;
}

.productTextInfo {
  padding-top: 15px;
  padding-right: 15px;
  padding-left: 15px;
  height: 80px;
  overflow: hidden;
}

.productName {
  font-weight: 500;
  font-size: 18px;
  color: $primaryTextColor;
  line-height: 1.3em;
}

.productDescription {
  margin-top: 5px;
  font-size: 13px;
  font-weight: 340;
  line-height: 1.5em;
  color: $regularTextColor;
}

.cardFooter {
  padding: 10px 15px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priceText {
  font-size: 16px;
  color: $primaryTextColor;
}

.priceSuffix {
  font-size: 13px;
  color: $secondaryTextColor;
}

.purchaseButton {
  font-size: 13px;
  width: 80px;
  background-color: $oppositeThemeColor !important;
  border-color: $oppositeThemeColor !important;
}

.purchaseButton:hover {
  background-color: #ec8303 !important;
  border-color: #ec8303 !important;
}

.faqSection {
  padding-top: 150px;
  padding-bottom: 120px;
  background-color: white;
}

.faqSectionTitle {
  font-size: 36px;
  font-weight: 500;
  color: $primaryTextColor;
  margin: auto;
  text-align: center;
}

.faqContentContainer {
  width: 1200px;
  margin-top: 50px;
  margin-right: auto;
  margin-left: auto;
}

.faqRow {
  display: flex;
  flex-wrap: wrap;
}

.faqItem {
  margin-bottom: 100px;
  width: 100%;
  height: 100%;
}

.faqName {
  font-size: 20px;
  font-weight: 500;
  color: $primaryTextColor;
  margin-bottom: 24px;
}

.faqContent {
  font-size: 15px;
  line-height: 1.8em;
}

.customerService {
  position: fixed;
  top: 100px;
  right: 50px;
  z-index: 200;
}

</style>

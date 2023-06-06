<template>
  <div v-if="plans.length > 0 " :class="$style.wrapper">
    <section :class="$style.planSelectSection">
      <div :class="$style.planTitle">选择适合您的价格套餐</div>
      <div v-if="isLoggedIn && isTenantAdmin" :class="$style.currentPlanLine">{{ currentPlanLineText }}</div>
      <div :class="$style.planContent">
        <div v-for="plan in plans" :key="plan.type" :class="$style.planItem">
          <div :class="$style.planInfoContainer">
            <div :class="$style.planName">{{ plan.name }}
              <template v-if="isLoggedIn && isTenantAdmin && plan.type === currentPlanType">
                <span v-if="isCurrentPlanExpired"
                      :class="[$style.currentPlanText,$style.currentPlanTextExpired]"
                      :title="expiredPlanTip">
                  当前套餐（已过期）
                </span>
                <span v-else :class="$style.currentPlanText" :title="tobeExpiredPlanTip">当前套餐</span>
              </template>
            </div>
            <div :class="[$style.planIntro,{[$style.recommended]:plan.type === 'ADVANCED'}]">{{ plan.shortIntro }}</div>
            <div :class="$style.priceContainer">
              <span :class="$style.priceText">￥</span>
              <span :class="$style.priceNumber">{{ plan.price }}</span>
              <span :class="$style.priceText">/年</span>
            </div>

            <div :class="$style.featureItemContainer">
              <div :class="$style.featureRow">
                <i v-if="plan.type === 'FREE'" :class="$style.freePlanIcon" class="el-icon-right"></i>
                <i v-else :class="$style.numberFeatureIcon" class="el-icon-top"></i>
                {{ plan.maxAppCount }}个 应用
              </div>
              <div :class="$style.featureRow">
                <i v-if="plan.type === 'FREE'" :class="$style.freePlanIcon" class="el-icon-right"></i>
                <i v-else :class="$style.numberFeatureIcon" class="el-icon-top"></i>
                {{ plan.maxMemberCount }}名 成员
              </div>
              <div :class="$style.featureRow">
                <i v-if="plan.type === 'FREE'" :class="$style.freePlanIcon" class="el-icon-right"></i>
                <i v-else :class="$style.numberFeatureIcon" class="el-icon-top"></i>
                {{ plan.controlTypes.length }}种 表单控件
              </div>
              <div :class="$style.featureRow">
                <i v-if="plan.type === 'FREE'" :class="$style.freePlanIcon" class="el-icon-right"></i>
                <i v-else :class="$style.numberFeatureIcon" class="el-icon-top"></i>
                {{ storageText(plan) }} 存储空间
              </div>
              <div :class="$style.featureRow">
                <i v-if="plan.type === 'FREE'" :class="$style.freePlanIcon" class="el-icon-right"></i>
                <i v-else :class="$style.numberFeatureIcon" class="el-icon-top"></i>
                {{ conciseNumberDisplay(plan.maxQrCount) }}个 实例
              </div>
              <div :class="$style.featureRow">
                <i v-if="plan.type === 'FREE'" :class="$style.freePlanIcon" class="el-icon-right"></i>
                <i v-else :class="$style.numberFeatureIcon" class="el-icon-top"></i>
                {{ conciseNumberDisplay(plan.maxSubmissionCount) }}份 表单提交
              </div>

              <div v-for="feature in plan.addedKeyFeatures" :class="$style.featureRow">
                <i v-if="plan.type === 'FREE'" :class="$style.freePlanIcon" class="el-icon-right"></i>
                <i v-else :class="$style.enabledFeatureIcon" class="el-icon-plus"></i>
                {{ featureOf(feature) }}
              </div>
            </div>
          </div>
          <div v-if="shouldShowPlanButton(plan)" :class="$style.planButtonContainer">
            <el-button v-if="plan.type === 'FREE'"
                       :class="$style.planButton"
                       type="plain"
                       @click="goToMyAppsPage">
              开始使用
            </el-button>
            <el-button v-else
                       :class="[$style.purchaseButton,$style.planButton]"
                       type="primary"
                       @click="openPurchasePackageDialog(plan)">
              {{ purchaseButtonText(plan) }}
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <section :class="$style.comparisonSection">
      <div :class="$style.comparisonTitle">各套餐功能对比</div>
      <table :class="$style.planHeaderTable">
        <tr>
          <th :class="$style.featureNameCell">套餐</th>
          <th v-for="plan in plans"
              :key="plan.type"
              :class="$style.featureEnableCell">
            <div :class="$style.tablePlanName"> {{ plan.name }}
              <span :class="$style.tablePriceContainer">
                ￥<span :class="$style.tablePriceNumber">{{ plan.price }}</span>/年
              </span>
            </div>
            <div v-if="shouldShowPlanButton(plan)" :class="$style.tableButtonContainer">
              <el-button v-if="plan.type === 'FREE'"
                         :class="$style.planButton"
                         size="small"
                         type="plain"
                         @click="goToMyAppsPage">
                开始使用
              </el-button>
              <el-button v-else
                         :class="[$style.purchaseButton,$style.planButton]"
                         size="small"
                         type="primary"
                         @click="openPurchasePackageDialog(plan)">
                {{ purchaseButtonText(plan) }}
              </el-button>
            </div>
          </th>
        </tr>
      </table>

      <table :class="$style.planComparisonTable">
        <tr :class="$style.noTopBorder">
          <td :class="[$style.noTopBorder,$style.planCategory]" colspan="6">基本功能</td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="可创建的应用总数"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">应用总数</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ plan.maxAppCount }}个
          </td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="最大实例数"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">实例总数</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ conciseNumberDisplay(plan.maxQrCount) }}个
          </td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="表单提交量总和"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">表单提交总量</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ conciseNumberDisplay(plan.maxSubmissionCount) }}份
          </td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="部门总数"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">部门总数</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ plan.maxDepartmentCount }}个
          </td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="单个应用下所允许的最大分组总数"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">单个应用分组数</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ plan.maxGroupCountPerApp }}个
          </td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="最大允许成员总数"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">成员总数</div>
            </el-tooltip>
            <el-button :class="$style.textButton"
                       size="small"
                       type="text"
                       @click="openPurchaseExtraMemberDialog">
              增购成员
            </el-button>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ plan.maxMemberCount }}名
          </td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="存储空间包括图片、视频等媒体文件所占用的存储空间总和"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">存储空间</div>
            </el-tooltip>
            <el-button :class="$style.textButton"
                       size="small"
                       type="text"
                       @click="openPurchaseExtraStorageDialog">
              增购存储空间
            </el-button>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ storageText(plan) }}
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="每月短信发送量"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">短信量</div>
            </el-tooltip>
            <el-button :class="$style.textButton"
                       size="small"
                       type="text"
                       @click="openPurchaseExtraSmsDialog">
              增购短信量
            </el-button>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ plan.maxSmsCountPerMonth }} 条/月
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="表单页面所允许的控件类型数，控件包括展示类控件和填值类控件"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">表单控件种类</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            {{ plan.controlTypes.length }}个
          </td>
        </tr>
        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="实例对应的二维码是否长期有效"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">二维码长期有效</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('QR_NO_EXPIRE')" :class="$style.enabledIcon" class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="电脑端运营包括实例管理、分组管理、账户管理、成员管理、表单提交及管理，以及数据报表查看等功能"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">电脑端运营</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('PC_OPERATIONS')" :class="$style.enabledIcon" class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="手机端运营包括实例管理、分组管理、表单提交及管理，以及数据报表查看等功能。手机端运营采用H5页面，可通过微信、钉钉等应用以及手机浏览器打开"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">手机端运营</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('MOBILE_OPERATIONS')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="自定义表单页面，可使用数十种控件，具体支持控件范围根据套餐不同而不同"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">自定义表单</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('FORM_CUSTOMIZABLE')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="自定义实例所对应的二维码码牌图案，包括二维码、文本、表格等内容"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">自定义二维码图案</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('PLATE_CUSTOMIZABLE')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="自定义实例属性，属性包含多种类型，可直接人工填写，也可通过表单提交数据自动计算而得"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">自定义实例属性</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('CUSTOM_ATTRIBUTE')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="为应用自定义运营菜单"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">自定义运营菜单</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('CUSTOM_OPS_MENU')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="通过对比实例所在位置与提交表单时提交者所在位置，以达到防止提交作假的目的"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">定位防提交作假</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('GEO_PREVENT_FRAUD')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="提交时，不能选择已有图片，而仅允许手机相机现场拍摄以防止提交作假，该功能需要手机本身的支持"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">现场拍照防提交作假</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('PHOTO_PREVENT_FRAUD')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="为实例生成二维码图片文件并可下载，所下载的二维码图片可进一步用于码牌印刷，码牌内容和结构可自定义"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">生成实例二维码图片</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('PLATE_IMAGE')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="可上传音视频（比如文件上传控件等）"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">可上传音视频</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('VIDEO_AUDIO_ALLOWED')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <td :class="[$style.noTopBorder,$style.planCategory]" colspan="6">高级数据功能</td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="针对单个应用的统计报表，包含饼状图、柱状图、曲线趋势图等多种图表类型，可对分别针对实例属性数据和提交数据进行统计"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">统计报表</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('APP_REPORTING')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="根据自定义属性值统计而得的状态看板，在手机端应用首页显示"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">状态看板</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('KANBAN')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="通过Excel格式文件批量导入成员信息"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">批量导入成员数据</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('MEMBER_BATCH_UPLOAD')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="通过Excel格式文件批量导入实例数据，导入模板可自定义"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">批量导入实例数据</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('QR_BATCH_UPLOAD')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="批量导出实例数据"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">批量导出实例数据</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('QR_EXCEL_EXPORT')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="批量导出提交表单数据"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">批量导出提交数据</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('SUBMISSION_EXCEL_EXPORT')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <td :class="[$style.noTopBorder,$style.planCategory]" colspan="6">团队协作</td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="表单审批功能，可配置审批权限，审批后可通知表单提交人"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">表单审批</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('APPROVAL_ENABLED')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="任务管理功能，通过任务管理自动分配任务给指定成员"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">任务管理</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('ASSIGNMENT_ENABLED')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="表单的查看权限和提交权限设置，可针对整个表单页面进行设置，也可针对单个控件进行设置"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">表单权限控制</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('FORM_PERMISSION')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="单个控件的查看权限和提交权限设置"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">控件权限控制</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('CONTROL_PERMISSION')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="运营端权限控制，可控制哪些角色才能访问应用的运营端页面，同时作用于电脑端和手机端"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">运营端权限控制</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('OPS_PERMISSION')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="表单提交后，推送微信通知到指定的角色"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">提交表单后推送微信消息</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('SUBMISSION_NOTIFY')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <td :class="[$style.noTopBorder,$style.planCategory]" colspan="6">品牌展示</td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="自定义二级子域名，二级子域名仅对电脑运营端有效，比如设置子域名为abc后，即可通过https://abc.mryqr.com访问电脑运营端"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">自定义子域名</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('CUSTOM_SUBDOMAIN')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="自定义登录页面的背景图片，需要完成自定义子域名设置后方可设置"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">自定义登录页面背景</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('CUSTOM_LOGIN_BACKGROUND')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="自定义品牌Logo"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">自定义品牌Logo</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('CUSTOM_LOGO')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="手机端页面隐藏码如云Logo"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">手机端页面隐藏码如云Logo</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('HIDE_BOTTOM_MRY_LOGO')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <!--去除广告，等启用了广告之后可以显示-->
        <!--        <tr :class="$style.noTopBorder">-->
        <!--          <th :class="[$style.featureNameCell,$style.noTopBorder]">-->
        <!--            <el-tooltip :popperClass="$style.tooltip"-->
        <!--                        content="去除广告（比如开屏广告等）"-->
        <!--                        effect="dark"-->
        <!--                        placement="right">-->
        <!--              <div :class="$style.featureName">去除广告</div>-->
        <!--            </el-tooltip>-->
        <!--          </th>-->
        <!--          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">-->
        <!--            <i v-if="plan.allFeatures.includes('HIDE_ADS')" :class="$style.enabledIcon"-->
        <!--               class="el-icon-check"></i>-->
        <!--            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>-->
        <!--          </td>-->
        <!--        </tr>-->

        <tr :class="$style.noTopBorder">
          <td :class="[$style.noTopBorder,$style.planCategory]" colspan="6">开发集成</td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="通过调用码如云开放平台的API以完成数据获取或写入"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">API集成</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('API_ENABLED')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :popperClass="$style.tooltip"
                        content="在某些事件发生时，码如云自动将事件数据通过Webhook方式推送到您自己的IT系统，包括实例和提交相关事件。每个应用可以但单独进行Webhook设置"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">Webhook集成</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.allFeatures.includes('WEBHOOK_ENABLED')" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

        <tr :class="$style.noTopBorder">
          <td :class="[$style.noTopBorder,$style.planCategory]" colspan="6">页面控件</td>
        </tr>

        <tr v-for="controlType in allControlTypes" :class="$style.noTopBorder">
          <th :class="[$style.featureNameCell,$style.noTopBorder]">
            <el-tooltip :content="controlType.title"
                        :popperClass="$style.tooltip"
                        effect="dark"
                        placement="right">
              <div :class="$style.featureName">{{ controlType.name }}</div>
            </el-tooltip>
          </th>
          <td v-for="plan in plans" :key="plan.type" :class="[$style.featureEnableCell,$style.noTopBorder]">
            <i v-if="plan.controlTypes.includes(controlType.type)" :class="$style.enabledIcon"
               class="el-icon-check"></i>
            <i v-else :class="$style.notEnabledIcon" class="el-icon-close"></i>
          </td>
        </tr>

      </table>
    </section>

    <section :class="$style.faqSection">
      <div :class="$style.faqSectionTitle">常见问题</div>
      <div :class="$style.faqContentContainer">
        <el-row :class="$style.faqRow" :gutter="100">
          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">是否有折扣？该选哪个版本？</div>
              <div :class="$style.faqContent">
                当前购买可享受9.5折优惠。对于多数客户来说，码如云推荐购买【高级版】，因为高级版除了不包含技术集成功能外，已经包含了系统的所有其他功能。而对于需要做技术对接或者有大量数据需求的客户，推荐购买更高的版本。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">套餐到期未续费会影响已有二维码扫码吗？</div>
              <div :class="$style.faqContent">
                不会，二维码一旦生成便长期有效，即可正常扫码打开。不过对于表单提交而言，由于套餐到期后将被自动降为免费版，因此如果当月的表单提交量已经超过了免费版的限额，则无法继续提交表单。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">除了套餐外，还可单独购买哪些额度？</div>
              <div :class="$style.faqContent">
                除了套餐外，还可以单独增购成员数量、存储空间和短信量，购买入口请参看本页的"各套餐功能对比"小节。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">可以通过补差价升级套餐吗？</div>
              <div :class="$style.faqContent">可以，可以仅对当前套餐的余下时长进行升级，也可以在续费时一并升级，升级费用 =
                (新套餐价格 - 原套餐价格) * (原套餐剩余天数 /
                365)。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">怎么支付？提供发票吗？</div>
              <div :class="$style.faqContent">当前支持对银行公转账和微信转账支付；可提供增值税普通发票或专用发票，请在<a
                  class="primaryColoredTextLink"
                  href="/management/orders"
                  target="_blank">订单管理</a>页面自行申请；码如云当前为小规模纳税人，无法提供高于3%的增值税发票，不过作为对您的补偿，我们可为您免费延长相应的套餐服务时长，具体请联系
                <MryCustomerServiceText></MryCustomerServiceText>
                。
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div :class="$style.faqItem">
              <div :class="$style.faqName">码如云如何保证数据安全？</div>
              <div :class="$style.faqContent">
                码如云采用阿里云服务器，在数据安全方面包含以下措施：分布式服务器集群、数据传输加密、数据自动备份和数据冗余存储等。
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

    <PurchasePackageDialog :allPlanTypes="allPlanTypes"
                           :initDuration="initDuration"
                           :initPlanType="selectedPlanType"
                           :show.sync="purchaseDialogVisible">
    </PurchasePackageDialog>

    <PurchaseExtraMemberDialog :show.sync="purchaseExtraMemberVisible">
    </PurchaseExtraMemberDialog>

    <PurchaseExtraStorageDialog :show.sync="purchaseExtraStorageVisible">
    </PurchaseExtraStorageDialog>

    <PurchaseExtraSmsDialog :show.sync="purchaseExtraSmsVisible">
    </PurchaseExtraSmsDialog>
  </div>
</template>

<script>
import planApi from '@/common/api/plan-api';
import planFeatures from '@/console/public/packages/plan-features';
import {mapActions, mapGetters} from 'vuex';
import {canPlanCover, conciseNumberDisplay, formatEpochToDate} from '@/common/utils/common-utils';
import MryOfficialSiteFooter from '@/console/common/components/MryOfficialSiteFooter';
import ACTIONS from '@/console/console-root-action';
import PurchasePackageDialog from '@/console/public/packages/PurchasePackageDialog';
import PurchaseExtraMemberDialog from '@/console/public/packages/PurchaseExtraMemberDialog';
import PurchaseExtraSmsDialog from '@/console/public/packages/PurchaseExtraSmsDialog';
import PurchaseExtraStorageDialog from '@/console/public/packages/PurchaseExtraStorageDialog';
import controlTypes from '@/common/utils/control-types';
import playTypes from '@/common/utils/plan-types';

export default {
  components: {
    MryOfficialSiteFooter,
    PurchasePackageDialog,
    PurchaseExtraMemberDialog,
    PurchaseExtraStorageDialog,
    PurchaseExtraSmsDialog,
  },

  data() {
    return {
      plans: [],
      selectedPlanType: null,
      purchaseDialogVisible: false,
      purchaseExtraMemberVisible: false,
      purchaseExtraSmsVisible: false,
      purchaseExtraStorageVisible: false,
      initDuration: 1,
    }
  },

  created() {
    return planApi.listPlans().then(response => {
      this.plans = response.data;
    });
  },

  mounted() {
    document.title = '码如云服务套餐';
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'currentEffectivePlanType',
      'isCurrentPlanExpired',
      'currentPlanType',
      'currentPlanExpireAt',
      'isTenantAdmin',
    ]),

    allControlTypes() {
      return controlTypes;
    },

    currentPlanLineText() {
      if (this.currentPlanType === 'FREE') {
        return '您当前为免费版套餐';
      }

      if (this.isCurrentPlanExpired) {
        return `您当前为${playTypes[this.currentPlanType].name}套餐，${this.expiredPlanTip}`;
      }

      return `您当前为${playTypes[this.currentPlanType].name}套餐，${this.tobeExpiredPlanTip}`;
    },

    expiredPlanTip() {
      return `已于${formatEpochToDate(this.currentPlanExpireAt)}日过期`;
    },

    tobeExpiredPlanTip() {
      if (this.currentEffectivePlanType !== 'FREE') {
        return `将于${formatEpochToDate(this.currentPlanExpireAt)}日过期`;
      }
    },

    allPlanTypes() {
      return this.plans.map(plan => plan.type);
    }
  },

  methods: {
    conciseNumberDisplay,
    ...mapActions([
      ACTIONS.FETCH_MY_PROFILE,
    ]),

    storageText(plan) {
      return plan.maxStorage < 1 ? plan.maxStorage * 1000 + 'M' : plan.maxStorage + 'G';
    },

    featureOf(featureCode) {
      return planFeatures[featureCode];
    },

    shouldShowPlanButton(plan) {
      if (!this.isLoggedIn) {
        return true;
      }

      return canPlanCover(plan.type, this.currentEffectivePlanType);
    },

    purchaseButtonText(plan) {
      if (!this.isLoggedIn || this.currentEffectivePlanType === 'FREE') {
        return '立即购买';
      }

      if (plan.type === this.currentEffectivePlanType) {
        return '续费';
      }

      return '升级到该套餐';
    },

    initDurationFor(plan) {
      if (!this.isLoggedIn || this.currentEffectivePlanType === 'FREE') {
        return 1;
      }

      if (plan.type === this.currentEffectivePlanType) {
        return 1;
      }

      return 0;
    },

    openPurchasePackageDialog(plan) {
      return this[ACTIONS.FETCH_MY_PROFILE]().then(() => {
        if (!this.isTenantAdmin) {
          this.$message({
            type: 'warning',
            message: `您当前不是系统管理员，无法购买套餐，请联系您的系统管理员进行购买。`,
            center: true
          });
          return;
        }

        this.initDuration = this.initDurationFor(plan);
        this.selectedPlanType = plan.type;
        this.purchaseDialogVisible = true;
      });
    },

    openPurchaseExtraMemberDialog() {
      return this[ACTIONS.FETCH_MY_PROFILE]().then(() => {
        if (!this.isTenantAdmin) {
          this.$message({
            type: 'warning',
            message: `您当前不是系统管理员，无法购买，请联系您的系统管理员进行购买。`,
            center: true
          });
          return;
        }

        if (this.currentEffectivePlanType === 'FREE') {
          this.$message({
            type: 'warning',
            message: `您当前有效套餐为免费版，无法增购成员，请升级到付费版再进行购买。`,
            center: true
          });
          return;
        }

        this.purchaseExtraMemberVisible = true;
      });
    },

    openPurchaseExtraSmsDialog() {
      return this[ACTIONS.FETCH_MY_PROFILE]().then(() => {
        if (!this.isTenantAdmin) {
          this.$message({
            type: 'warning',
            message: `您当前不是系统管理员，无法购买，请联系您的系统管理员进行购买。`,
            center: true
          });
          return;
        }

        if (this.currentEffectivePlanType === 'FREE') {
          this.$message({
            type: 'warning',
            message: `您当前有效套餐为免费版，无法增购短信量，请升级到付费版再进行购买。`,
            center: true
          });
          return;
        }

        this.purchaseExtraSmsVisible = true;
      });
    },

    openPurchaseExtraStorageDialog() {
      return this[ACTIONS.FETCH_MY_PROFILE]().then(() => {
        if (!this.isTenantAdmin) {
          this.$message({
            type: 'warning',
            message: `您当前不是系统管理员，无法购买，请联系您的系统管理员进行购买。`,
            center: true
          });
          return;
        }

        if (this.currentEffectivePlanType === 'FREE') {
          this.$message({
            type: 'warning',
            message: `您当前有效套餐为免费版，无法增购存储空间，请升级到付费版再进行购买。`,
            center: true
          });
          return;
        }

        this.purchaseExtraStorageVisible = true;
      });
    },

    goToMyAppsPage() {
      this.$router.push({name: 'my-app-list'});
    },
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

.customerService {
  position: fixed;
  top: 100px;
  right: 50px;
  z-index: 200;
}

.planSelectSection {
  padding-top: 80px;
}

.planTitle {
  font-size: 36px;
  font-weight: 500;
  color: $primaryTextColor;
  margin: auto;
  text-align: center;
}

.currentPlanLine {
  font-size: 16px;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.planContent {
  margin: 50px auto 80px;
  width: 1200px;
  background-color: white;
  min-height: 550px;
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
}

.planItem {
  border-left: $primary1pxBorder;
  flex-grow: 1;
  flex-basis: 200px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.planInfoContainer {
  flex-grow: 1;
}

.planButtonContainer {
  flex-grow: 0;
  margin-bottom: 20px;
  text-align: center;
}

.planButton {
  width: 100%;
}

.purchaseButton {
  background-color: $oppositeThemeColor !important;
  border-color: $oppositeThemeColor !important;
}

.purchaseButton:hover {
  background-color: #ec8303 !important;
  border-color: #ec8303 !important;
}

.planItem:first-child {
  border-left: none;
}

.planName {
  font-size: 24px;
  color: $primaryTextColor;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.currentPlanText {
  font-size: 12px;
  padding: 5px;
  background-color: $passGreen;
  color: white;
  margin-left: 5px;
}

.currentPlanTextExpired {
  background-color: #6f7072;
}

.planIntro {
  font-size: 12px;
  font-weight: 400;
  margin-top: 15px;
  color: $secondaryTextColor;
}

.recommended {
  color: $oppositeThemeColor;
  font-weight: 500;
  font-size: 13px;
}

.priceContainer {
  margin-top: 20px;
  display: flex;
  align-items: end;
}

.priceText {
  font-size: 15px;
  color: $secondaryTextColor;
}

.priceNumber {
  color: $primaryTextColor;
  font-weight: 500;
  font-size: 36px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.featureItemContainer {
  margin-top: 20px;
}

.featureRow {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 13px;
}


.numberFeatureIcon {
  color: $passGreen;
  margin-right: 5px;
  font-weight: 600;
}

.freePlanIcon {
  color: $secondaryTextColor;
  margin-right: 5px;
  font-weight: 600;
}

.enabledFeatureIcon {
  color: $oppositeThemeColor;
  margin-right: 5px;
  font-weight: 600;
}

.comparisonSection {
  padding-top: 60px;
  background-color: white;
}

.comparisonTitle {
  font-size: 36px;
  font-weight: 500;
  color: $primaryTextColor;
  text-align: center;
  margin: auto auto 50px;
}

.planHeaderTable {
  position: sticky;
  z-index: 100;
  top: 60px;
  border-collapse: collapse;
  border: none;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
}

.planHeaderTable tr, .planHeaderTable th {
  border: $primary1pxBorder;
}

.tablePlanName {
  font-size: 20px;
  font-weight: 500;
  color: $primaryTextColor;
  text-align: center;
  padding-top: 15px;
  margin-bottom: 15px;
}

.tablePriceContainer {
  font-size: 12px;
  color: $secondaryTextColor;
  display: inline-flex;
  align-items: center;
}

.tablePriceNumber {
  font-size: 15px;
  color: $primaryTextColor;
}

.tableButtonContainer {
  margin-bottom: 10px;
}

.planComparisonTable {
  border-collapse: collapse;
  border: none;
  margin-left: auto;
  margin-right: auto;
}

.planComparisonTable tr, .planComparisonTable td {
  border: $primary1pxBorder;
}

.featureName {
  display: inline-block;
}

.tooltip {
  max-width: 300px;
}

.planCategory {
  height: 50px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 16px;
  font-weight: 500;
  vertical-align: middle;
  color: $primaryTextColor;
  background-color: $lightBackgroundColor;
}

.noTopBorder {
  border-top: none !important;
}

.textButton {
  padding: 0;
  font-size: 13px;
  font-weight: normal;
  text-decoration: underline;
}

.featureNameCell {
  width: 250px;
  text-align: left;
  height: 50px;
  vertical-align: middle;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 15px;
}

.featureEnableCell {
  width: 190px;
  text-align: center;
  height: 50px;
  vertical-align: middle;
  padding-left: 20px;
  padding-right: 20px;
  color: $primaryTextColor;
  font-size: 16px;
}

.enabledIcon {
  color: $passGreen;
  font-size: 18px;
  font-weight: 600;
}

.notEnabledIcon {
  color: $rejectRed;
  font-size: 18px;
  font-weight: 600;
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
  line-height: 1.3em;
}

.faqContent {
  font-size: 15px;
  line-height: 1.8em;
}

</style>

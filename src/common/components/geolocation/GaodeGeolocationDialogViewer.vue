<template>
  <el-dialog v-show="map" :class="$style.wrapper"
             :visible.sync="visible"
             top="60px"
             width="1000px"
             @open="init">
    <div slot="title">
      <span :class="$style.title">{{ titleText }}</span>
      <icon v-if="points.length === 1"
            :class="$style.gaodeLink"
            icon="external-link-alt"
            title="在高德地图中打开"
            @click="openInGaode">
      </icon>
    </div>
    <div :id="mapId" :class="$style.mapContainer"></div>
  </el-dialog>
</template>

<script>

import AMapLoader from "@/common/utils/AMapLoader";
import eventBus from '@/common/utils/event-bus';
import {randomHtmlElementId} from "@/common/utils/common-utils";

export default {
  data() {
    return {
      visible: false,
      mapId: randomHtmlElementId(),
      map: null,
      title: null,
      points: []
    }
  },

  created() {
    eventBus.$on('view-geolocations', this.openMap);
  },

  beforeDestroy() {
    eventBus.$off('view-geolocations');
  },

  computed: {
    titleText() {
      return this.title ? this.title : '查看定位';
    }
  },

  methods: {
    openMap(data) {
      this.points = data.points;
      this.title = data.title;
      this.visible = true;
    },

    init() {
      if (this.points) {
        let that = this;
        AMapLoader().then(AMap => {
          that.map = that.createMap(AMap);
          let scale = new AMap.Scale({visible: true});
          let toolBar = new AMap.ToolBar({visible: true});
          let overView = new AMap.OverView({visible: true});
          that.map.addControl(scale);
          that.map.addControl(toolBar);
          that.map.addControl(overView);
          that.points.forEach(point => {
            let position = new AMap.LngLat(point.longitude, point.latitude);
            let marker = new AMap.Marker({
              position: position,
              label: {offset: new AMap.Pixel(20, -20), content: `<span class='gaodeMarker'>${point.name}</span>`}
            });
            that.map.add(marker);
          });
          setTimeout(() => {
            that.map.setFitView();
          }, 1000);
        });
      }
    },

    createMap(AMap) {
      return new AMap.Map(this.mapId, {
        resizeEnable: true,
        zoomEnable: true,
        dragEnable: true,
        touchZoom: false,
        scrollWheel: true,
        showIndoorMap: false,
        isHotspot: false,
        rotateEnable: true,
        doubleClickZoom: true,
        keyboardEnable: true,
        jogEnable: false,
        showBuildingBlock: false,
        pitchEnable: false,
        buildingAnimation: false
      });
    },

    openInGaode() {
      let longitude = this.points[0].longitude;
      let latitude = this.points[0].latitude;
      let name = this.points[0].name;
      let url = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${name}&src=mry&callnative=1`;
      window.open(url, '_blank');
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 20px;
    }

    .amap-marker-label {
      background-color: transparent;
      border: 0;
    }

    .gaodeMarker {
      background-color: #3d95f9;
      color: white;
      padding: 5px;
    }
  }
}

.title {
  font-size: 20px;
}

.gaodeLink {
  padding-left: 10px;
  font-size: 12px;
  vertical-align: baseline;
}

.gaodeLink:hover {
  color: $primaryThemeColor;
  cursor: pointer;
}

.mapContainer {
  width: 100%;
  height: 600px;
}

</style>

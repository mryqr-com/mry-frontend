<template>
  <div :class="$style.wrapper">
    <div v-if="viewOnly && !hasPosition">无数据</div>

    <div v-show="shouldShowMap" :class="$style.positionContainer">
      <div :class="$style.addressBar">
        <div :class="$style.address" :style="addressStyle">{{ addressText }}</div>
        <PlainButton v-if="!viewOnly"
                     :class="$style.deletePositionButton"
                     @click="deletePosition">
          <i class="el-icon-delete"></i>
          清除定位
        </PlainButton>
      </div>

      <div :id="mapId" :class="$style.mapContainer"></div>

      <div :class="$style.noteBar">
        <div :class="$style.noteTitle">备注：</div>
        <el-input :class="[$style.noteInput,{[$style.viewOnlyNote]: viewOnly}]"
                  :maxlength="100"
                  :spellcheck="false"
                  :value="localGeolocation.note"
                  size="small"
                  @input="updateNote">
        </el-input>
        <PlainButton v-if="!viewOnly"
                     :class="$style.rePositionButton"
                     :disabled="loading"
                     @click="tryPosition">
          <i v-if="!loading" class="el-icon-location-outline"></i>
          <i v-if="loading" class="el-icon-loading"></i>
          当前位置
        </PlainButton>
      </div>
    </div>

    <StyledButton v-if="!shouldShowMap && !viewOnly"
                  :buttonStyle="buttonStyle"
                  :class="$style.positionButton"
                  :disabled="loading"
                  @click="firstPosition">
      <i v-if="!loading" class="el-icon-location-outline"></i>
      <i v-if="loading" class="el-icon-loading"></i>
      获取当前位置
    </StyledButton>

  </div>
</template>

<script>
import {cloneDeep} from 'lodash-es';
import AMapLoader from '@/common/utils/AMapLoader';
import {displayAddress, randomHtmlElementId} from '@/common/utils/common-utils';

export default {
  props: {
    value: {
      type: Object,
    },

    buttonStyle: {
      type: Object,
      required: false
    },

    allowManualPosition: {
      type: Boolean,
      default: true,
    },

    viewOnly: {
      type: Boolean,
      default: false
    },

  },

  data() {
    return {
      map: null,
      geolocation: null,
      loading: false,
      positioned: false,
      mapId: randomHtmlElementId(),
      flip: true,//trick: cannot position sometimes, use 'flip' to call twice
      marker: null,
      geocoder: null,
    }
  },

  mounted() {
    let that = this;
    if (that.localGeolocation.point.longitude && that.localGeolocation.point.latitude) {
      AMapLoader().then(AMap => {
        that.createMap(AMap);
        setTimeout(() => {
          that.zoomToPositionWithLevel(new AMap.LngLat(that.localGeolocation.point.longitude, that.localGeolocation.point.latitude), 16);
        }, 500);
      });
    }
  },

  computed: {
    hasPosition() {
      return this.localGeolocation &&
          this.localGeolocation.point &&
          this.localGeolocation.point.longitude;
    },

    shouldShowMap() {
      return this.map && this.hasPosition;
    },

    localGeolocation() {
      return this.value ? this.value : this.createEmptyGeolocation();
    },

    addressText() {
      return displayAddress(this.localGeolocation.address)
    },

    addressStyle() {
      if (!this.positioned) {
        return {
          color: '#909399'
        }
      }
    }
  },

  methods: {
    createEmptyGeolocation() {
      return {
        point: {
          longitude: null,
          latitude: null
        },
        address: {
          province: null,
          city: null,
          district: null,
          address: null
        },
        note: null
      };
    },

    zoomToPosition(lnglat) {
      let position = new AMap.LngLat(lnglat.getLng(), lnglat.getLat());
      this.marker.setPosition(position);
      this.map.setCenter(position);
    },

    zoomToPositionWithLevel(lnglat, level) {
      let position = new AMap.LngLat(lnglat.getLng(), lnglat.getLat());
      this.marker.setPosition(position);
      this.map.setZoomAndCenter(level, position);
    },

    buildLocation(position, addressComponent, formattedAddress) {
      let province = addressComponent.province ? addressComponent.province : "";
      let city = addressComponent.city ? addressComponent.city : "";
      let fakeCity = addressComponent.city ? addressComponent.city : province;//处理直辖市
      let district = addressComponent.district ? addressComponent.district : "";

      return {
        point: {
          longitude: position.lng,
          latitude: position.lat
        },
        address: {
          province: province,
          city: fakeCity,
          district: district,
          address: formattedAddress.replace(province + city + district, '')
        },
        note: this.localGeolocation.note
      };
    },

    updateNote(note) {
      let cloned = cloneDeep(this.localGeolocation);
      cloned.note = note;
      this.$emit('input', cloned);
    },

    deletePosition() {
      this.$emit('input', this.createEmptyGeolocation());
    },

    createMap(AMap) {
      let map = new AMap.Map(this.mapId, {
        zoom: 16,
        resizeEnable: false,
        zoomEnable: true,
        dragEnable: true,
        touchZoom: true,
        scrollWheel: true,
        showIndoorMap: false,
        isHotspot: false,
        rotateEnable: false,
        doubleClickZoom: true,
        keyboardEnable: false,
        jogEnable: false,
        showBuildingBlock: false,
        pitchEnable: false,
        buildingAnimation: false
      });

      this.marker = new AMap.Marker();
      map.add(this.marker);

      this.map = map;
      this.geocoder = new AMap.Geocoder({radius: 500, extensions: "all"});

      let that = this;
      that.map.on('click', function (e) {
        if (that.allowManualPosition && !that.viewOnly) {
          that.geocoder.getAddress([e.lnglat.getLng(), e.lnglat.getLat()], function (status, result) {
            if (status === 'complete') {
              that.positioned = true;
              let location = that.buildLocation(e.lnglat, result.regeocode.addressComponent, result.regeocode.formattedAddress);
              that.$emit('input', location);
              that.zoomToPosition(e.lnglat);
            }
          });
        }
      });

      AMap.plugin(['AMap.ToolBar',], function () {
        map.addControl(new AMap.ToolBar({
          liteStyle: true
        }));
      });
      return map;
    },

    createGeolocation(AMap) {
      return new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        showButton: false,
        zoomToAccuracy: false,
        showCircle: false,
        showMarker: false,
        panToLocation: false,
      });
    },

    doPosition() {
      let that = this;
      that.loading = true;
      that.geolocation.getCurrentPosition(function (status, result) {
        that.loading = false;
        if (status === 'complete') {
          that.positioned = true;
          let location = that.buildLocation(result.position, result.addressComponent, result.formattedAddress);
          that.$emit('input', location);
          let position = new AMap.LngLat(result.position.getLng(), result.position.getLat());
          that.zoomToPosition(position);
          if (that.flip) {
            that.flip = !that.flip;
            that.doPosition();
          } else {
            that.flip = !that.flip;
          }
        } else {
          that.$message({
            type: 'error',
            message: `定位失败。`,
            center: true
          });
        }
      });
    },

    tryPosition() {
      let that = this;
      if (!this.geolocation) {
        AMapLoader().then(AMap => {
          that.geolocation = that.createGeolocation(AMap);
          that.doPosition();
        });
      } else {
        that.doPosition();
      }

    },

    firstPosition() {
      if (this.map) {
        this.tryPosition();
        return;
      }
      let that = this;
      that.loading = true;
      AMapLoader().then(AMap => {
        that.createMap(AMap);
        that.tryPosition();
      });
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

.positionContainer {
  border: $primary1pxBorder;
}

.mapContainer {
  width: 100%;
  height: 200px;
  //pointer-events: none;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .mapContainer {
    height: 300px;
  }

  .positionButton {
    max-width: $maxControlInputWidth;
  }

}

.addressBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: $primary1pxBorder;
  min-height: 48px;
}

.address {
  flex-grow: 1;
  line-height: 1.3em;
}

.deletePositionButton {
  flex-shrink: 0;
  width: auto !important;
  margin-left: 10px;
  height: 32px !important;
  padding-right: 8px !important;
  padding-left: 8px !important;
  color: $regularTextColor !important;
}

.noteBar {
  border-top: $primary1pxBorder;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
}

.noteTitle {
  flex-shrink: 0;
}

.viewOnlyNote {
  pointer-events: none;
}

.rePositionButton {
  flex-shrink: 0;
  width: auto !important;
  margin-left: 10px;
  height: 32px !important;
  padding-right: 8px !important;
  padding-left: 8px !important;
  color: $regularTextColor !important;
}

</style>

<template>
  <div :class="$style.wrapper">
    <div v-if="viewOnly && !hasPosition">无数据</div>

    <div v-show="shouldShowMap" :class="$style.positionContainer">
      <div v-show="hasPosition" :class="$style.addressBar">
        <div :class="$style.address" :style="addressStyle">{{ addressText }}</div>
        <PlainButton v-if="!viewOnly"
                     :class="$style.deletePositionButton"
                     @click="deletePosition">
          <i class="el-icon-delete"></i>
          清除定位
        </PlainButton>
      </div>

      <section :class="$style.mapSection">
        <div :id="mapId" :key="mapId" :class="$style.mapContainer"></div>
        <div v-show="loading" :class="$style.loadingOverlay">
          <i :class="$style.loadingIcon" class="el-icon-loading"></i>
        </div>
      </section>

      <div v-show="hasPosition" :class="$style.noteBar">
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
                     @click="doPosition">
          <i class="el-icon-location-outline"></i>
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
import {displayAddress, randomHtmlElementId} from '@/common/utils/common-utils';
import loadTianditu from "@/common/utils/tianditu";
import {
  gcj02ToWgs84,
  geopointToGeolocation,
  getCurrentGeolocation,
  wgs84ToGcj02
} from '@/common/utils/geolocation-utils'

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
      loading: false,
      positioned: false,
      mapId: randomHtmlElementId(),
      marker: null,
    }
  },

  mounted() {
    let _this = this;
    if (_this.localGeolocation.point.longitude && _this.localGeolocation.point.latitude) {
      loadTianditu().then(T => {
        _this.createMap(T);
        setTimeout(() => {
          let wgs84Point = gcj02ToWgs84(_this.localGeolocation.point.longitude, _this.localGeolocation.point.latitude);
          _this.zoomToPosition(new T.LngLat(wgs84Point.longitude, wgs84Point.latitude));
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
      return this.map;
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
      this.marker.setLngLat(lnglat);
      this.map.centerAndZoom(lnglat);
    },

    updateNote(note) {
      if (this.hasPosition) {
        let cloned = cloneDeep(this.localGeolocation);
        cloned.note = note;
        this.$emit('input', cloned);
      }
    },

    deletePosition() {
      this.map = null;
      this.mapId = randomHtmlElementId();
      this.marker = null;
      this.$emit('input', this.createEmptyGeolocation());
    },

    createMap(T) {
      let map = new T.Map(this.mapId, {zoom: 15});
      map.enableDrag();
      map.enableScrollWheelZoom();
      map.enableDoubleClickZoom();
      map.disableKeyboard();
      map.enableInertia();
      map.enableContinuousZoom();
      map.enablePinchToZoom();
      map.enableAutoResize();
      map.addControl(new T.Control.Zoom());
      this.marker = new T.Marker();
      map.addOverLay(this.marker);
      this.map = map;

      let _this = this;
      _this.map.addEventListener('click', function (e) {
        if (_this.allowManualPosition && !_this.viewOnly) {
          let gcj02Point = wgs84ToGcj02(e.lnglat.getLng(), e.lnglat.getLat());
          geopointToGeolocation(gcj02Point).then(geolocation => {
            _this.positioned = true;
            let finalGeolocation = {
              point: geolocation.point,
              address: geolocation.address,
              note: _this.localGeolocation.note
            }
            _this.$emit('input', finalGeolocation);
            _this.zoomToPosition(e.lnglat);
          });
        }
      });
    },

    firstPosition() {
      this.doPosition().catch(() => {
        this.deletePosition();
      });
    },

    doPosition() {
      let _this = this;
      _this.loading = true;

      return loadTianditu().then(T => {
        if (!_this.map) {
          _this.createMap(T);
        }

        return getCurrentGeolocation().then(geolocation => {
          _this.positioned = true;
          let finalGeolocation = {
            point: geolocation.point,
            address: geolocation.address,
            note: _this.localGeolocation.note
          }
          _this.$emit('input', finalGeolocation);

          let wgs84Point = gcj02ToWgs84(geolocation.point.longitude, geolocation.point.latitude);
          _this.zoomToPosition(new T.LngLat(wgs84Point.longitude, wgs84Point.latitude));
        }).catch((e) => {
          _this.$message({
            type: 'error',
            message: `定位失败。`,
            center: true
          });
          throw e;
        }).finally(() => {
          _this.loading = false;
        });
      });
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.positionContainer {
  border: $primary1pxBorder;
}

.mapSection {
  position: relative;
}

.mapContainer {
  width: 100%;
  height: 200px;
  //pointer-events: none;
}


.loadingOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loadingIcon {
  font-size: 20px;
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
  min-height: 50px;
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

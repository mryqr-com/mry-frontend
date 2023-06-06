import loadTianditu from "@/common/utils/tianditu";

export function getCurrentGeopoint() {//代理调用具体的实现
    return getCurrentGeopointByDevice();
}

export function getCurrentGeolocation() {//代理调用具体的实现
    return getCurrentGeolocationByTianditu();
}

export function geopointToGeolocation(point) {//代理调用具体的实现
    return geopointToGeolocationByTianditu(point);
}

function toNamedPoint(namedGeolocation) {
    let name = namedGeolocation.name;
    let note = namedGeolocation.geolocation.note;
    let longitude = namedGeolocation.geolocation.point.longitude;
    let latitude = namedGeolocation.geolocation.point.latitude;
    if (note) {
        name = `${namedGeolocation.name}（${note}）`;
    }

    return {
        name,
        longitude,
        latitude,
    };
}

export function viewGeoLocation(geolocationWithName) {//代理调用具体的实现
    let point = toNamedPoint(geolocationWithName);
    viewGeopointsInGaode([point]);
}

export function viewGeoLocations(namedGeolocations) {//代理调用具体的实现
    let points = namedGeolocations.map(item => toNamedPoint(item));
    viewGeopointsInGaode(points);
}

export function wgs84ToGcj02(wgsLon, wgsLat) {
    let d = delta(wgsLon, wgsLat);
    return {'longitude': wgsLon + d.longitude, 'latitude': wgsLat + d.latitude};
}

export function gcj02ToWgs84(gcjLon, gcjLat) {
    let d = delta(gcjLon, gcjLat);
    return {'longitude': gcjLon - d.longitude, 'latitude': gcjLat - d.latitude,};
}

function viewGeopointsInGaode(points) {
    let gaodePoints = points.map(point => {
        return {
            name: point.name,
            longitude: point.longitude,
            latitude: point.latitude,
        };
    });

    if (gaodePoints.length === 1) {
        let thePoint = gaodePoints[0];
        let longitude = thePoint.longitude;
        let latitude = thePoint.latitude;
        let name = thePoint.name;
        let url = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${name}&src=mry&coordinate=gaode&callnative=1`;
        window.open(url, '_blank');
        return;
    }

    if (gaodePoints.length > 1) {
        let markers = gaodePoints.slice(0, 10).map(point => {
            return `${point.longitude},${point.latitude},${point.name}`;
        }).join('|');

        let url = `https://uri.amap.com/marker?markers=${markers}&src=mry&callnative=1`
        window.open(url, '_blank');
    }
}

function getCurrentGeopointByDevice() {
    if (navigator.geolocation) {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(function (position) {
                    resolve(wgs84ToGcj02(position.coords.longitude, position.coords.latitude))
                },

                function (error) {
                    console.error(error);
                    reject('定位失败。');
                },
                {timeout: 10000, enableHighAccuracy: true});
        });
    } else {
        return Promise.reject('当前浏览器不支持定位。');
    }
}

const PROVINCE_CITY_SAME_NAMES = ['北京市', '天津市', '上海市', '重庆市', '香港'];

function tiandituAddressComponentToAddress(addressComponent) {
    return {
        province: addressComponent.province,
        city: PROVINCE_CITY_SAME_NAMES.includes(addressComponent.province) ?
            addressComponent.province :
            addressComponent.city,
        district: addressComponent.county,
        address: (addressComponent.road + addressComponent.poi).replace(/[;；]/g, ''),
    };
}

function getCurrentGeolocationByTianditu() {
    return new Promise(function (resolve, reject) {
        getCurrentGeopoint().then(point => {
            loadTianditu().then(T => {
                let wgs84Point = gcj02ToWgs84(point.longitude, point.latitude);
                let lngLat = new T.LngLat(wgs84Point.longitude, wgs84Point.latitude);
                let geocoder = new T.Geocoder();
                geocoder.getLocation(lngLat, function (result) {
                    if (result.status === '0' && result.addressComponent) {
                        let geolocation = {
                            point: {
                                longitude: point.longitude,
                                latitude: point.latitude,
                            },
                            address: tiandituAddressComponentToAddress(result.addressComponent),
                        };
                        resolve(geolocation);
                    } else {
                        console.error("天地图逆地址编码解析错误：", result);
                        reject('定位失败。');
                    }
                });
            }).catch(e => {
                console.error(e);
                reject('定位失败。');
            });
        }).catch(e => {
            reject(e);
        });
    });
}

function geopointToGeolocationByTianditu(point) {
    return new Promise(function (resolve, reject) {
        loadTianditu().then(T => {
            let wgs84Point = gcj02ToWgs84(point.longitude, point.latitude);
            let lngLat = new T.LngLat(wgs84Point.longitude, wgs84Point.latitude);
            let geocoder = new T.Geocoder();
            geocoder.getLocation(lngLat, function (result) {
                if (result.status === '0' && result.addressComponent) {
                    resolve({
                        point: point,
                        address: tiandituAddressComponentToAddress(result.addressComponent),
                    });
                } else {
                    console.error("天地图逆地址编码错误：", result)
                    reject('从定位点获取地址失败。');
                }
            });
        });
    });
}

let PI = 3.14159265358979324;

function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
}

function delta(longitude, latitude) {
    let a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    let ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    let dLat = transformLat(longitude - 105.0, latitude - 35.0);
    let dLon = transformLon(longitude - 105.0, latitude - 35.0);
    let radLat = latitude / 180.0 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
    return {'longitude': dLon, 'latitude': dLat};
}

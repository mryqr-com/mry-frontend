/* eslint-disable */

export default function AMapLoader() {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap);
        } else {
            var script = document.createElement('script');
            script.async = true;
            script.charset = 'utf-8';
            script.src = '//webapi.amap.com/maps?v=1.4.5&callback=initAMap&key=9f11e4d6192a69427c220cdc881c8dff&&plugin=AMap.Scale,AMap.OverView,AMap.ToolBar,AMap.Geolocation,AMap.Geocoder';
            script.onerror = reject;
            document.head.appendChild(script);
        }

        window.initAMap = () => {
            resolve(window.AMap);
        }
    })
}
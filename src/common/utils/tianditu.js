/* eslint-disable */

export default function loadTianditu() {
    return new Promise((resolve, reject) => {
        if (window.T) {
            resolve(window.T);
        } else {
            let script = document.createElement('script');
            script.charset = 'utf-8';
            script.src = '//api.tianditu.gov.cn/api?v=4.0&tk=5db6742296bbe4b285ec6bae3d5b767b';
            script.onload = () => {
                resolve(window.T);
            };
            script.onerror = e => {
                reject(e);
            };
            document.head.appendChild(script);
        }
    });
}
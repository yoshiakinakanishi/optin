const encoding = require('encoding-japanese');

/**
 * @returns {Promise} openId
 */
export function logincheck() {
    return fetch('/push/api/v1/logincheck', {
        method: 'GET',
        credentials: 'include',
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .then(data => data.open_id);
}

export function callPCNavi(url) {
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.arrayBuffer();
        })
        .then(buf => new Uint8Array(buf))
        .then((data) => {
            const unicode = encoding.convert(data, {
                to: 'UNICODE',
                from: 'AUTO',
            });
            return encoding.codeToString(unicode);
        });
}

export function callSPNavi(url) {
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
    }).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    });
}

export function utf8ToB64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

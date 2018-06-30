import jQuery from 'jquery';

const { logincheck, callSPNavi, utf8ToB64 } = require('./lib');

(function ($) {
    $(() => {
        // TODO windowから取り出してるのはまずいのでjspluginを修正する
        const { webPush, location } = window;
        const { ENV } = process.env;
        const { R18_FLAG } = process.env;
        const TAID_campaign = process.env.TAID_campaign;
        const TAID_service = process.env.TAID_service;
        const TAID_common = process.env.TAID_common;
        // const NAVI_URL = `${process.env.SP_NAVI_URL}&url=${utf8ToB64(`https://${location.hostname}/${location.pathname}`)}&ua=${utf8ToB64(navigator.userAgent.toLowerCase())}`;
        const urlParam = utf8ToB64(`https://${location.hostname}/${location.pathname}`);
        const NAVI_URL = `${process.env.SP_NAVI_URL}&url=${urlParam}&ua=${utf8ToB64(navigator.userAgent.toLowerCase())}`;

        /* -- push initialize --*/
        const initEvent = webPush
            .event()
            .on('success', () => {
                console.log('init success');
                $('.push__notSupport').hide();
            })
            .on('not-support', (e) => {
                console.log(`init not-support: ${e}`);
                $('.push__notSupport').show();
                $('.wrap').hide();
            })
            .on('error', (e) => {
                console.log(`init error: ${e}`);
                $('.push__notSupport').hide();
            });

        webPush.init(initEvent);

        /* -- UI function --*/
        function changeListener(event) {
            const { openId, env, taid } = event.data;

            if ($(this).prop('checked')) {
                const optInEvent = webPush
                    .event()
                    .on('error', (e) => {
                        $(this).prop('checked', false);
                        console.log(`optIn fail: ${e}`);
                    })
                    .on('success', () => {
                        $(this).prop('checked', true);
                        console.log('optIn success');
                    })
                    .on('denied', (e) => {
                        $(this).prop('checked', false);
                        console.log(`optIn denied: ${e}`);
                        alert('再び通知設定を許可する場合は、ブラウザ通知設定をデフォルトまたは許可にしてください');
                    })
                    .on('default', (e) => {
                        $(this).prop('checked', false);
                        console.log(`optIn default: ${e}`);
                    });

                webPush.optIn(openId, taid, env, optInEvent);
            } else {
                const optOutEvent = webPush
                    .event()
                    .on('error', (e) => {
                        $(this).prop('checked', true);
                        console.log(`optOut error: ${e}`);
                    })
                    .on('success', () => {
                        $(this).prop('checked', false);
                        console.log('optOut success');
                    });

                webPush.optOut(openId, taid, env, optOutEvent);
            }
        }

        function pushPopup() {
            $('.push__popup').fadeIn('fast');

            setTimeout(() => {
                window.location.href = $('#push__popupURL').attr('href');
            }, 5000);
        }

        function setNavi(data) {
            $('#dmmCommon__main').html(data.header);
            $('#dmmCommon__footer').html(data.footer);
            $('.push__notSupport,#dmm_main').appendTo($('#dm-content02-inn'));
            if (R18_FLAG) {
                $('body').append('<script src="https://www.dmm.co.jp/js/common/navigation.sp.js"></script>');
            } else {
                $('body').append('<script src="https://www.dmm.com/js/common/navigation.sp.js"></script>');
            }
            $('#dm-content02-inn').append(data.footer);
        }

        /* -- logincheck --*/
        logincheck()
            .then((openId) => {
                $(':checkbox[data-taid]').each((index, checkbox) => {
                    const getStateEvent = webPush
                        .event()
                        .on('registered', () => {
                            console.log('already registered');
                            $(checkbox).prop('checked', true);
                        })
                        .on('not-registered', () => {
                            console.log('not registered');
                            $(checkbox).prop('checked', false);
                        })
                        .on('error', (e) => {
                            console.log(`getState error: ${e}`);
                        });
                    if (checkbox.dataset.taid === 'campaign') {
                        webPush.getState(openId, TAID_campaign, ENV, getStateEvent);
                    }
                    if (checkbox.dataset.taid === 'service') {
                        webPush.getState(openId, TAID_service, ENV, getStateEvent);
                    }
                    if (checkbox.dataset.taid === 'common') {
                        webPush.getState(openId, TAID_common, ENV, getStateEvent);
                    }
                });
                $('#register1').bind(
                    'change',
                    { openId, env: ENV, taid: TAID_campaign },
                    changeListener
                );
                $('#register2').bind(
                    'change',
                    { openId, env: ENV, taid: TAID_service },
                    changeListener
                );
                $('#register3').bind(
                    'change',
                    { openId, env: ENV, taid: TAID_common },
                    changeListener
                );
            })
            .then(() => callSPNavi(`${NAVI_URL}&login=1`))
            .then((data) => {
                setNavi(data);
            })
            .catch(() =>
                callSPNavi(`${NAVI_URL}&login=0`).then((data) => {
                    setNavi(data);
                    pushPopup();
                }));
    });
}(jQuery));

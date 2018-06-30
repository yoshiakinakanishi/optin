import jQuery from 'jquery';

const { logincheck, callPCNavi } = require('./lib');

(function ($) {
    $(() => {
        // TODO windowから取り出してるのはまずいのでjspluginを修正する
        const { webPush } = window;
        const { ENV } = process.env;

        const TAID_common = process.env.TAID_common;
        const TAID_campaign = process.env.TAID_campaign;
        const TAID_service = process.env.TAID_service;
        const NAVI_HEADER_URL = process.env.PC_NAVI_HEADER_URL;
        const NAVI_FOOTER_URL = process.env.PC_NAVI_FOOTER_URL;

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

        /* -- logincheck --*/
        const headerPromise = callPCNavi(NAVI_HEADER_URL).then((data) => {
            $('#dmmCommon__header').html(data);
        });
        const footerPromise = callPCNavi(NAVI_FOOTER_URL).then((data) => {
            $('#dmmCommon__footer').html(data);
        });
        Promise.all([headerPromise, footerPromise])
            .then(() => logincheck())
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
                    if (checkbox.dataset.taid === 'campaign') { webPush.getState(openId, TAID_campaign, ENV, getStateEvent); }
                    if (checkbox.dataset.taid === 'service') { webPush.getState(openId, TAID_service, ENV, getStateEvent); }
                    if (checkbox.dataset.taid === 'common') { webPush.getState(openId, TAID_common, ENV, getStateEvent); }
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
            .catch(() => {
                pushPopup();
            });
    });
}(jQuery));

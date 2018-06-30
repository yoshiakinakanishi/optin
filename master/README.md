# オプトインページ

オプトインページの静的ファイルのリポジトリ。

## TODO
- [x] webpackの設定に環境ごとのTAIDを設定する
- [x] 各manifestファイルの`gcm_sender_id`を適切な値に書き換る
- [ ] テストを書く
- [ ] 自動デプロイの設定をする
- [x] ナビのポイントを非同期で読み込めるようになったら読み込む

## 構造
```
├── assets            <- DMMで共通するファイルを置くディレクトリ
├── index-r18.html    <- PCかつco.jp用ページ
├── index-sp-r18.html <- SPかつco.jp用ページ
├── index-sp.css      <- SP用のCSS
├── index-sp.html     <- SPかつcom用のページ
├── index.css         <- PC用のCSS
├── index.html        <- PCかつcom用のページ
├── js
│   ├── index-sp.js <- SPページのエントリポイントにあたるJS
│   ├── index.js    <- PCページのエントリポイントにあたるJSの
│   └── lib.js      <- PC/SPの共通処理
├── manifest-r18.json <- R18用のServiceWorkerで必要なファイル
├── manifest.json     <- com用のServiceWorkerで必要なファイル
├── package.json
├── pushlib-bundle.js <- 通知PFが提供しているJS
├── pushlib-sw.js     <- 通知PFが提供しているServiceWorker用JS
├── webpack                     <- 各種環境ごとのWebpackのconfigを格納するディレクトリ
│   ├── webpack.config.base.js <- 設定の共通部分
│   ├── webpack.config.develop.com.js
│   ├── webpack.config.develop.r18.js
│   ├── webpack.config.production.com.js
│   ├── webpack.config.production.r18.js
│   ├── webpack.config.staging.com.js
│   └── webpack.config.staging.r18.js
└── yarn.lock
```

## 注意点
HTML内でのscriptの読み込み順序は、

```html
<script src="./pushlib-bundle.js"></script>
<script src="./index.js"></script>
または
<script src="./index-sp.js"></script>
```

固定でお願いします。

pushlib-bundle.jsでは、windowオブジェクトにwebPushオブジェクトを詰めるやり方でライブラリを提供しており、
index.jsではそれを取り出して使っています。

そのため、`pushlib-bundle.js` -> `index.js` の順序で読み込まないと、pushlib-bundleの機能を使うことができず、
通知の機能を使うことが出来ません。

## 前提
* yarnがインストールされている

## How to use
各種ツールをインストール(初回時のみ)。
```console
$ yarn install
```

`yarn build-(dev|stg|prd)-(com|r18)` で必要な環境用のファイルをビルドする

```console
例) $ yarn build-stg-r18 # ステージング用かつR18用でビルドされる
```

以下のように`dest`ディレクトリに必要なファイルがビルドされているので全部をS3にアップロード。

R18用でファイルをビルドした場合も`index.html`、`index-sp.html`が生成されるが正常な動作になる。

```
dest
├── assets
├── index-sp.css
├── index-sp.html
├── index-sp.js
├── index.css
├── index.html
├── index.js
├── manifest.json
├── pushlib-bundle.js
└── pushlib-sw.js

```

## 環境変数
webpackのconfigにある環境変数の説明です。

| 環境変数           | 説明                                                                                                    |
| ---                | ---                                                                                                     |
| ENV                | コードが動く環境。develop, staging, productionのいずれかを取る。                                        |
| TAID               | アプリケーションごとに管理されるtransmit_application_id。管理画面で確認可能。                           |
| PC_NAVI_HEADER_URL | PCナビヘッダーを呼び出すURL。パラメータを動的に操作していないので全てのパラメータを記述する。           |
| PC_NAVI_FOOTER_URL | PCナビフッターを呼び出すURL。パラメータを動的に操作していないので全てのパラメータを記述する。           |
| SP_NAVI_URL        | SPナビを呼び出すURL。**url、ua、loginパラメータはコード内で動的に操作しているため、それらを含めない。** |

## GTMタグ設置
Google Analyticsでデータを閲覧できるようにするためのGoogle Tag Manager(GTM)スニペットタグです。

タグの設置場所は、タグ発火の遅延が発生しないように、各種htmlファイルのbodyタグ直下に設置しています。

なお、GTMタグを設置してから約24時間経過しないと、Google Analyticsにデータが反映されない仕様となっています。

dmm.com(PC)
```
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-T2DRSB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T2DRSB');</script>
<!-- End Google Tag Manager -->
```
dmm.com(SP)
```
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-TGJ8PK"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TGJ8PK');</script>
<!-- End Google Tag Manager -->
```
.dmm.co.jp(PC)
```
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-5GBJM3"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5GBJM3');</script>
<!-- End Google Tag Manager -->
```
dmm.co.jp(SP)
```
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-MRMJWF"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MRMJWF');</script>
<!-- End Google Tag Manager -->

```

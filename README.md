# AI文章補完アプリケーション

このアプリケーションは、Reactを使用したAI文章補完ツールです。ユーザーがテキストエリアに文章を入力すると、AIが続きの文章を予測し、リアルタイムで表示します。予測されたテキストは、クリックまたはTabキーで入力内容に適用することができます。

## 主な機能

- **リアルタイム文章補完**：ユーザーの入力に基づいて、AIが続きの文章を予測します。
- **予測テキストの適用**：予測されたテキストをクリックまたはTabキーで簡単に適用できます。
- **リトライ機能**：予測結果に満足できない場合、リトライボタンで再度予測を行えます。
- **コピー機能**：入力したテキストをクリップボードにコピーすることができます。
- **キーボードショートカット**：
  - `Tab`キー：予測テキストの適用
  - `Ctrl + R`：リトライ

## 使用方法
以下のリンクにアクセスしてください。
https://ai-completion2.vercel.app/

## 使用技術

- ### フロントエンド
  - **React**：フロントエンドのUI構築に使用。useState, useEffect, useCallback, useRef などのフックを使用しています。
  - **Lucide Icons**：Reactコンポーネントとして使用できるアイコンライブラリ。RefreshCw, Copy, Check, Loaderなどのアイコンを使用しています。
  - **CSS3**：アニメーションやボタンのホバー効果をCSSで実装しています。リトライボタンの一回転アニメーションなども、CSSで管理しています。

- ### バックエンド
  - **Node.js**：APIのリクエストを処理するサーバーを構築。フロントエンドからのリクエストを受け取り、OpenAI APIと連携して補完提案を生成します。フロントエンドとの通信には REST API を使用し、JSON形式でデータの送受信を行います。
  - **OpenAI API**：フロントエンドからの文章をバックエンド経由でOpenAI API(gpt-4o-mini, gpt-4o)に送信し、補完提案を取得します。

- ### インフラ
  - **GCP**：App Engine でNode.jsサーバーをホストしています。

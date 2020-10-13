# 暇ラン(暇人ランキング)

毎日0:00にHTLまたはLTLのトゥート数によるユーザーランキングを投稿するbot。どん廃アラートをユーザー全員で共有するイメージ。
一鯖一つの運用、そのbot鯖はインスタンス内のアカウントしかフォローしないという前提でUSE_HTLが使えます(が、HTLに外部の投稿が流れてきてもカウントはします)。

なおAUTOFOLLOW(自動フォロバ)は同一インスタンス外からのフォローには反応しません。

鯖缶か鯖缶に許可等を取った人、または黙認された人が運用してください。

kirishima.cloud(アスタルテ)用に作ったけど別にそれ以外でも動く

https://kirishima.cloud/@AstarteBot

## 使い方

いるもの Node.js(10と12で確認), yarnとbotアカウント、アクセストークン(read/write必須、AUTOFOLLOWを使うときはfollowも)

* `.env`を設定
* `yarn`
* `yarn db:init`
* `yarn build`
* `yarn start`

任意でforever等を使って永続化します

## アプデ

ほとんどこないけど

* `yarn`
* `yarn build`
* `yarn start`
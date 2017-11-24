<template>
  <div class="about container">
    <div class="message">
      <h2>このサイトについて</h2>
      <img src="/images/bigsight.png">
      <p>にゃんぱす！は同人活動をちょっと快適にするウェブサービスです。</p>
      <p>現在の主な機能として、あなたがフォローしているフレンドのサークル一覧を表示できます。</p>
      <p>今後も同人活動に役立ちそうな機能をちょっとずつ開発していく予定です。</p>
    </div>
    <div>
      <h3>おことわり</h3>
      <ul>
        <li>本サービスの利用は全て自己責任でお願いします。</li>
        <li>本サービスは Twitter から収集された情報を元に構成されている為、
          <ul>
            <li>収集に成功したサークル情報のみ表示されます(全てのサークルが網羅されているわけではありません)。</li>
            <li>表示されるイベントやサークル情報が誤っている可能性があります(正確な情報は公式カタログ等で確認してください)。</li>
            <li>イベント主催者様が発行しているカタログの代替にはなりません(公式カタログの補助としてご利用ください)。</li>
          </ul>
        </li>
        <li>本サービスは、イベント主催者様ならびにサークル様とは一切関係ありません。</li>
        <li>本サービスに起因して生じたあらゆる損害について、開発者は一切の責任を負いません。</li>
      </ul>
    </div>
    <div>
      <h3>しつもん</h3>
      <dl>
        <dt>私のサークルが表示されない</dt>
        <dd>twitterから発見できなかった可能性があります</dd>
      </dl>
    </div>
    <div>
      <h3>れんらく</h3>
      <p>ご質問等ございましたら @nanocloudx までダイレクトメッセージをお願い致しますm(_ _)m</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .about {
    .message {
      text-align: center;
      margin: 30px 0;
    }
    ul {
      li {
        list-style: disc;
        list-style-position: inside;
        margin-bottom: 5px;
        ul {
          margin-left: 20px;
          li {
            margin: 0;
          }
        }
      }
    }
  }
</style>

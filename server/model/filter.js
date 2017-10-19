/**
 * サークル情報を抽出する
 * @param target
 * @param targetEvent
 */
export function filterCircle(target, targetEvent) {

  // MEMO 方針について
  // 抽出する際、例外的な表記に対応するほど正確度が落ちてしまうので、必要以上に対応しない
  // 代わりに抽出できた項目を基準に正確度を算出して、全部抽出できなかった場合も利用者判断できるようにする

  if (!target || !targetEvent) {
    return null
  }
  const event = extractEvent(target, targetEvent)
  target = smoothString(target, targetEvent)
  const day = extractDay(target)
  const week = extractWeek(target)
  const direction = extractDirection(target)
  const block = extractBlock(target)
  const seat = extractSeat(target)
  return {event, day, week, direction, block, seat}
}

/**
 * 文字列を扱いやすくする
 * @param target
 * @param targetEvent
 */
export function smoothString(target, targetEvent) {
  // イベント名を削除
  target = target.replace(targetEvent.toUpperCase(), '').replace(targetEvent.toLowerCase(), '')
  // αβをabに変換
  target = target.replace(/α/g, 'a').replace(/β/g, 'b')
  // 漢字表記の123を変換
  target = target.replace(/一/g, '1').replace(/二/g, '2').replace(/三/g, '3')
  // 全角を半角に変換
  target = target.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
  // 関係なさそうな文字列を削除
  target = target.replace(/[^0-9A-Za-zぁ-んァ-ヶ東西月火水木金土日曜\(\)]/g, '')
  // 注意: Aブロックとaブロックが存在しうるので target.toLowerCase() はできない
  return target
}

/**
 * イベント特定
 * @example c93
 */
export function extractEvent(target, targetEvent) {
  target = target.toLowerCase()
  targetEvent = targetEvent.toLowerCase()
  return !!target.match(targetEvent) ? targetEvent : null
}

/**
 * 日付特定
 * @example 1,2日,3日目
 */
export function extractDay(target) {
  // 「日」の左に数字があれば何日目として判定
  const day = target.match(/\d日/)
  if (day) {
    return day[0].charAt(0)
  }
  return null
}

/**
 * 曜日特定
 * @example 月,金,土曜,日曜日
 */
export function extractWeek(target) {
  // 「日」の左に数字があれば曜日ではないものとして消す(例: 3日日 -> 日)
  const day = target.match(/\d日/)
  if (day) {
    target = target.replace(day[0], '')
  }
  // 「X曜」の表記であればXを返す
  const week1 = target.match(/[月火水木金土日]曜/)
  if (week1) {
    return week1[0].charAt(0)
  }
  // 「(X)」の表記であればXを返す
  const week2 = target.match(/\([月火水木金土日]\)/)
  if (week2) {
    return week2[0].charAt(1)
  }
  // 「X」の表記が一つだけであればXを返す
  const week3 = target.match(/[月火水木金土日]/g)
  if (week3 && week3.length === 1) {
    return week3[0].charAt(0)
  }
  // それ以外は駄目
  return null
}

/**
 * 建物特定
 * @example 東,西
 */
export function extractDirection(target) {
  // 東または西がサークル位置と併記されていれば特定
  const direction1 = target.match(/[東西]\d?.\d\d[ABab]/)
  if (direction1) {
    return direction1[0].charAt(0)
  }
  // 東または西が一つだけならば特定
  const direction2 = target.match(/[東西]/g)
  if (direction2 && direction2.length === 1) {
    return direction2[0].charAt(0)
  }
  // それ以外は駄目
  return null
}

/**
 * ブロック特定
 * @example A,a,あ,ア
 */
export function extractBlock(target) {
  // 「01a」の左に隣接する文字列を取得
  const result = target.match(/[A-Za-zぁ-んァ-ヶ]\d\d[ABab]/)
  if (result) {
    return result[0].charAt(0)
  }
  return null
}

/**
 * 席特定
 * @example 01a, 23b
 */
export function extractSeat(target) {
  const result = target.toLowerCase().match(/\d\d[ab]/)
  if (result) {
    return result[0]
  }
  return null
}

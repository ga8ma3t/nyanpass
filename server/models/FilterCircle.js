/**
 * サークル情報集めるぞい
 * @class
 */
export class FilterCircle {
  constructor(eventName, dateArray) {
    this.eventName = eventName
    this.dateArray = dateArray
  }

  exec(target) {
    if (!target || !this.eventName || !this.dateArray) {
      throw new Error('Error FilterCircle')
    }
    if (Array.isArray(target)) {
      return target.map(t => extractCircle(t, this.eventName, this.dateArray))
    }
    return extractCircle(target, this.eventName, this.dateArray)
  }
}

/**
 * サークル情報を抽出する
 * @param target
 * @param targetEvent
 * @param dateArray
 */
export function extractCircle(target, targetEvent, dateArray) {
  const event = extractEvent(target, targetEvent)
  if (!event) {
    return null
  }
  target = smoothString(target, targetEvent)
  const date = complementDate(extractDay(target), extractWeek(target), dateArray)
  const day = date.day
  const week = date.week
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
  const day = target.match(/.\d日/)
  if (day && isNaN(day[0].charAt(0))) {
    return day[0].charAt(1)
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
  // 西館は企業ブース固定っぽいので
  return '東'

  // // 東または西がサークル位置と併記されていれば特定
  // const direction1 = target.match(/[東西]\d?.\d\d[ABab]/)
  // if (direction1) {
  //   return direction1[0].charAt(0)
  // }
  // // 東または西が一つだけならば特定
  // const direction2 = target.match(/[東西]/g)
  // if (direction2 && direction2.length === 1) {
  //   return direction2[0].charAt(0)
  // }
  // // それ以外は駄目
  // return null
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

/**
 * 日付および曜日情報の補完
 * @param day
 * @param week
 * @param dateArray
 */
export function complementDate(day, week, dateArray) {
  if (day && week && dateArray[parseInt(day) - 1] === week) {
    // 抽出した情報が正確ならば何もしない
    return {day, week}
  } else if (day && week) {
    // 抽出した情報が不正確ならば曜日情報を優先して日付情報の修正を試みる
    day = (dateArray.indexOf(week) + 1).toString()
  } else if (day) {
    // 日付情報のみならば曜日情報を補完する
    week = dateArray[parseInt(day) - 1]
  } else if (week) {
    // 曜日情報のみならば日付情報を補完する
    day = (dateArray.indexOf(week) + 1).toString()
  }
  if (day === '0' || !week) {
    return { day: null, week: null }
  }
  return {day, week}
}

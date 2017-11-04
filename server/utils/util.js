/**
 * ObjectをURLのGETパラメーターに変換する
 * @param obj
 * @returns {string}
 */
export function parameters(obj) {
  return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
}

/**
 * 大文字を小文字に変換する
 * @param str
 * @returns {string|XML|*|void}
 */
export function convertMultiByteToSingleByte(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => {
    return String.fromCharCode(s.charCodeAt(0) - 65248);
  })
}

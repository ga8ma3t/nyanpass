import 'babel-core/register'
import test from 'ava'
import {
  FilterCircle,
  smoothString,
  extractEvent,
  extractDay,
  extractWeek,
  extractDirection,
  extractBlock,
  extractSeat,
  complementDate
} from '../../server/model/FilterCircle'

test('事前文字列変換', t => {
  t.is(smoothString('c93一二三１２３ＸYzαβ', 'c93'), '123123XYzab')
})

test('イベント判定', t => {
  t.is(extractEvent('xxxc93xxx', 'c93'), 'c93')
  t.is(extractEvent('xxxc94xxx', 'c93'), null)
})

test('日付判定', t => {
  t.is(extractDay('xxx1日xxx'), '1')
  t.is(extractDay('xxx2日日xxx'), '2')
  t.is(extractDay('xxx14日xxx'), null)
  t.is(extractDay('xxx3xxx'), null)
  t.is(extractDay('xxx日xxx'), null)
})

test('曜日判定', t => {
  t.is(extractWeek('xxx日xxx'), '日')
  t.is(extractWeek('xxx3日xxx'), null)
  t.is(extractWeek('xxx3日日xxx'), '日')
  t.is(extractWeek('xxx月曜日xxx'), '月')
  t.is(extractWeek('xxx(火)xxx'), '火')
  t.is(extractWeek('xxx月火水木金土日xxx'), null)
})

test('建物判定', t => {
  t.is(extractDirection('xxx東1あ01axxx'), '東')
  t.is(extractDirection('xxx東あ01axxx'), '東')
  t.is(extractDirection('xxx西xxx'), '東')
  t.is(extractDirection('xxx東西xxx'), '東')
})

test('ブロック判定', t => {
  t.is(extractBlock('xxxA01axxx'), 'A')
  t.is(extractBlock('xxxa23bxxx'), 'a')
  t.is(extractBlock('xxxあ45bxxx'), 'あ')
  t.is(extractBlock('xxxあxxx'), null)
  t.is(extractBlock('xxx123axxx'), null)
})

test('席判定', t => {
  t.is(extractSeat('xxx01axxx'), '01a')
  t.is(extractSeat('xxx12bxxx'), '12b')
  t.is(extractSeat('xxx23Axxx'), '23a')
  t.is(extractSeat('xxx34cxxx'), null)
})

test('日付曜日補完', t => {
  t.deepEqual(complementDate('1', '金', ['金','土','日']), { day: '1', week: '金' })
  t.deepEqual(complementDate(null, '土', ['金','土','日']), { day: '2', week: '土' })
  t.deepEqual(complementDate('3', null, ['金','土','日']), { day: '3', week: '日' })
  t.deepEqual(complementDate('1', '日', ['金','土','日']), { day: '3', week: '日' })
  t.deepEqual(complementDate('4', null, ['金','土','日']), { day: null, week: null })
  t.deepEqual(complementDate(null, '月', ['金','土','日']), { day: null, week: null })
  t.deepEqual(complementDate(null, null, ['金','土','日']), { day: null, week: null })
})

test('総合テスト', t => {
  const filterCircle = new FilterCircle('c93', ['金','土','日'])
  t.deepEqual(filterCircle.exec([
    'xxx@C93土曜モ01b',
    'xxx@C93 🍭日ハ24a',
    'xxx@C93(日)東6 ヌ03b',
    'xxx@1日目C93東ホ44b',
    'xxx@C93 土曜 東Ｆ-39b',
    'xxx@C93 3日目日曜日東ウ23b',
    'ああああああああああ'
  ]), [
    {event:'c93',day:'2',week:'土',direction:'東',block:'モ',seat:'01b'},
    {event:'c93',day:'3',week:'日',direction:'東',block:'ハ',seat:'24a'},
    {event:'c93',day:'3',week:'日',direction:'東',block:'ヌ',seat:'03b'},
    {event:'c93',day:'1',week:'金',direction:'東',block:'ホ',seat:'44b'},
    {event:'c93',day:'2',week:'土',direction:'東',block:'F',seat:'39b'},
    {event:'c93',day:'3',week:'日',direction:'東',block:'ウ',seat:'23b'},
    null
  ])
})

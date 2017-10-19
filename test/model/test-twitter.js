import 'babel-core/register'
import test from 'ava'
import {
  filterCircle,
  smoothString,
  extractEvent,
  extractDay,
  extractWeek,
  extractDirection,
  extractBlock,
  extractSeat
} from '../../server/model/filter'

test('事前文字列変換', t => {
  t.is(smoothString('c93一二三１２３ＸYzαβ', 'c93'), '123123XYzab')
})

test('イベント判定', t => {
  t.is(extractEvent('c93', 'c93'), 'c93')
  t.is(extractEvent('c94', 'c93'), null)
})

test('日付判定', t => {
  t.is(extractDay('3日'), '3')
  t.is(extractDay('3日日'), '3')
  t.is(extractDay('3'), null)
  t.is(extractDay('日'), null)
})

test('曜日判定', t => {
  t.is(extractWeek('日'), '日')
  t.is(extractWeek('3日'), null)
  t.is(extractWeek('3日日'), '日')
  t.is(extractWeek('月曜日'), '月')
  t.is(extractWeek('(火)'), '火')
  t.is(extractWeek('月火水木金土日'), null)
})

test('建物判定', t => {
  t.is(extractDirection('東1あ01a'), '東')
  t.is(extractDirection('東あ01a'), '東')
  t.is(extractDirection('西'), '西')
  t.is(extractDirection('東西'), null)
})

test('ブロック判定', t => {
  t.is(extractBlock('A01a'), 'A')
  t.is(extractBlock('a23b'), 'a')
  t.is(extractBlock('あ45b'), 'あ')
  t.is(extractBlock('あ'), null)
  t.is(extractBlock('123a'), null)
})

test('席判定', t => {
  t.is(extractSeat('01a'), '01a')
  t.is(extractSeat('12b'), '12b')
  t.is(extractSeat('23A'), '23a')
  t.is(extractSeat('34c'), null)
})

test('総合テスト', t => {
  t.deepEqual(filterCircle('C93土曜モ01b', 'c93'), {
    event: 'c93',
    day: null,
    week: '土',
    direction: null,
    block: 'モ',
    seat: '01b'
  })
  t.deepEqual(filterCircle('C93 🍭日ハ24a', 'c93'), {
    event: 'c93',
    day: null,
    week: '日',
    direction: null,
    block: 'ハ',
    seat: '24a'
  })
  t.deepEqual(filterCircle('C93(日)東6 ヌ03b', 'c93'), {
    event: 'c93',
    day: null,
    week: '日',
    direction: '東',
    block: 'ヌ',
    seat: '03b'
  })
  t.deepEqual(filterCircle('1日目C93東ホ44b', 'c93'), {
    event: 'c93',
    day: '1',
    week: null,
    direction: '東',
    block: 'ホ',
    seat: '44b'
  })
  t.deepEqual(filterCircle('C93 土曜 東Ｆ-39b', 'c93'), {
    event: 'c93',
    day: null,
    week: '土',
    direction: '東',
    block: 'F',
    seat: '39b'
  })
  t.deepEqual(filterCircle('C93 3日目日曜日東ウ23b', 'c93'), {
    event: 'c93',
    day: '3',
    week: '日',
    direction: '東',
    block: 'ウ',
    seat: '23b'
  })
})

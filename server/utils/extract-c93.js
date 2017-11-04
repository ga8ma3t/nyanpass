import uuidv4 from 'uuid/v4'
import {searchTweets} from '../models/twitter'
import {convertMultiByteToSingleByte} from './util'

export function extractC93LayoutReport(count, cursor, sinceId) {
  return Promise.resolve().then(() => {
    return searchTweets(count, cursor, sinceId)
  }).then(result => {
    console.log(`cursor: ${result.cursor}`)
    return result.statusList.map(format).filter(data => data)
  }).catch(err => {
    console.log(`cursor: ${err.cursor}, error: ${err.error}`)
    return err.statusList.map(format).filter(data => data)
  })
}

function parse(str) {
  return str.match(/貴サークル「?(.*?)」?は、?(.)曜日.*([東])地区(.+)ブロック.*?([0-9][0-9][ab])/)
}

function format(entry) {
  const parsed = parse(entry.text)
  if (!parsed) {
    return
  }
  return {
    meta: {
      tweetId: entry.id
    },
    user: {
      id: uuidv4(),
      name: entry.name,
      twitterId: entry.twitterId,
      twitterName: entry.twitterName
    },
    space: {
      id: uuidv4(),
      name: parsed[1],
      date: convertWeekToDay(parsed[2]),
      district: parsed[3],
      block: convertMultiByteToSingleByte(parsed[4].charAt(parsed[4].length / 2)),
      space: parsed[5]
    }
  }
}

function convertWeekToDay(week) {
  switch (week) {
    case '金':
      return 1
    case '土':
      return 2
    case '日':
      return 3
    default:
      return null
  }
}
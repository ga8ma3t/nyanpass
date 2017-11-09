/* eslint-disable no-console */

import uuidv4 from 'uuid/v4'
import {searchTweets} from '../models/twitter'
import {convertMultiByteToSingleByte} from '../utils/util'
import { fetchEventByName } from '../models/event'
import { findOrCreateUserByTwitterId } from '../models/user'
import { findOrCreateSpace, addSpaceMember } from '../models/space'

export function extractC93LayoutReport(req, res) {
  const count = req.query.count
  const cursor = req.query.cursor
  const sinceId = req.query.sinceId

  execute(count, cursor, sinceId).then(result => {
    res.json(result)
  }).catch(err => {
    res.json(err)
  })
}

async function execute(count, cursor, sinceId) {
  let entryList = []
  try {
    for (let i = 0; i < count; i++) {
      console.log(`limit:${i}, cursor:${cursor}`)
      const result = await searchTweets(cursor, sinceId)
      if (!result.cursor) {
        cursor = null
        break
      }
      const formatted = result.list.map(format).filter(data => data)
      await Promise.all(formatted.map(insertEntry))
      Array.prototype.push.apply(entryList, formatted)
      console.log(entryList.length)
      cursor = result.cursor
    }
    if (cursor) {
      console.log(`cursor: ${cursor}`)
    } else {
      console.log('cursor: null')
    }
  } catch (err) {
    console.log(`cursor: ${err.cursor}, error: ${err}`)
  }
  return entryList
}

function insertEntry({user, space}) {
  return Promise.resolve().then(() => {
    return fetchEventByName('コミックマーケット93')
  }).then((event) => {
    return Promise.all([
      findOrCreateUserByTwitterId(user),
      findOrCreateSpace(Object.assign(space, {eventId: event.id}))
    ])
  }).then(([user, space]) => {
    addSpaceMember(space, user)
  }).catch((err) => {
    // 他のレコードは処理してほしいので、ログだけ出して続ける
    console.log(`space insert error: ${err}`)
    return Promise.resolve()
  })
}

function parse(str) {
  str = str.replace(/\s+/g, '')
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
      imageUrl: entry.imageUrl,
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

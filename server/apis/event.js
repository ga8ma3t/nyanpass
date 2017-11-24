// import {fetchEventByAlternateId, fetchEvents} from '../models/event'

export function fetchEventList(req, res) {
  res.json([{
    alternateId: 'c93',
    dates: ['2017-12-29', '2017-12-30', '2017-12-31'],
    id: 'a2894003-50e1-4cbb-898b-db31aee96996',
    name: 'コミックマーケット93',
    place: '東京ビッグサイト'
  }])
  // fetchEvents().then(result => {
  //   res.json(result)
  // })
}

export function fetchEvent(req, res) {
  res.json({
    alternateId: 'c93',
    dates: ['2017-12-29', '2017-12-30', '2017-12-31'],
    id: 'a2894003-50e1-4cbb-898b-db31aee96996',
    name: 'コミックマーケット93',
    place: '東京ビッグサイト'
  })
  // fetchEventByAlternateId(req.params.eventId).then(result => {
  //   res.json(result)
  // })
}

import {fetchEventByAlternateId, fetchEvents} from '../models/event'

export function fetchEventList(req, res) {
  fetchEvents().then(result => {
    res.json(result)
  })
}

export function fetchEvent(req, res) {
  fetchEventByAlternateId(req.params.eventId).then(result => {
    res.json(result)
  })
}

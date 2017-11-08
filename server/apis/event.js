import {fetchEvents} from '../models/event'

export function fetchEventList (req, res) {
  fetchEvents().then(() => {
    res.json({})
  })
}

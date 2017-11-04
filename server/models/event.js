import {Event} from '../database/models/index'

export function fetchEvent(eventId) {
  return Event.findById(eventId)
}

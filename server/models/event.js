import {Event} from '../database/models/index'

export function fetchEvent(eventId) {
  return Event.findById(eventId)
}

export function fetchEventByName(name) {
  return Event.findOne({where: { name: name }})
}

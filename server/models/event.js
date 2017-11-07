import {Event} from '../database/models/index'

export function fetchEvent(eventId) {
  return Event.findById(eventId)
}

export function fetchEventByName(name) {
  return Event.findOne({where: { name: name }})
}

export function fetchEventByAlternateId(id) {
  return Event.findOne({where: { alternateId: id }})
}

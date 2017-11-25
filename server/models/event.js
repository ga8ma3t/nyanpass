import {Event} from '../database/models/index'

export function fetchEvent(eventId) {
  return Event.findById(eventId)
}

export function fetchEvents() {
  return Event.findAll({
    attributes: ['alternateId', 'name', 'date', 'place']
  })
}

export function fetchEventByName(name) {
  return Event.findOne({where: { name: name }})
}

export function fetchEventByAlternateId(id) {
  return Event.findOne({where: { alternateId: id }})
}

import {Event} from '../database/models/index'

export function fetchEvents() {
  return Event.findAll({
    attributes: ['alternateId', 'name', 'date', 'place']
  })
}

export function fetchEventByAlternateId(id) {
  return Event.findOne({where: { alternateId: id }})
}

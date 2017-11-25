import {Event} from '../database/models/index'

export function fetchEvents() {
  return Event.findAll({
    attributes: ['alternateId', 'name', 'dates', 'place']
  }).then((events) => events.map(datesToArray))
}

export function fetchEventByAlternateId(id) {
  return Event.findOne({where: { alternateId: id }})
    .then((event) => datesToArray(event.get({plain: true})))
}

function datesToArray(event) {
  return Object.assign(event, { dates: event.dates.split(',') })
}

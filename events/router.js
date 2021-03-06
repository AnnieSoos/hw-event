const Router = require('express').Router

const Event = require('./model')

const router = new Router()

/// querying
const Op = Sequelize.Op

const today =  new Date().toJSON().slice(0,10);    /// today, from stackoverflow
////### Creating Events
//   * When events get created, they need to start in the future
//   * Event start dates must be before the end date.
//
// ### Getting All Events
//   * GET /events returns only future events
//   * GET /events returns only the title and dates of an event

///   title, startDate, endDate, description
/// documentation:
/// Post.findAll({
//   where: {
//     authorId: {
//       [Op.or]: [12, 13]
//     }
//   }
// });
/// Op.gt > 6


router.get('/events', (req, res) => {
  Event.findAll({
    attributes: ['title', 'startDate', 'endDate',]
    where: {
      startDate: {
        [Op.gt]: today
      }
    }
  })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500)
      res.json({message: 'Something went wrong'})
    })
});

router.get('/events/:id', (req, res) => {
  Event.findById(req.params.id)({
    attributes: ['title', 'startDate', 'endDate',]
    where: {
      startDate: {
        [Op.gt]: today
      }
    }
  })
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404)
        res.json({ message: 'Not Found' })
      }
    })
    .catch(err => {
      res.status(500)
      res.json({ message: 'There was an error' })
    })
})

router.post('/events', requireEvent, (req, res) => {
  const event = req.body
  event.eventId = req.event.id

  Event.create(event)
    .then(entity => {
      if (entity.startDate < today.toDate) {
        res.status(403).send({
          message: 'You\'re not allowed to create event starting in past!'
        })
      } else if (entity.endDate < today.toDate) {
        res.status(403).send({
          message: 'You\'re not allowed to create event ending in past!'
        })
      }
      else {
        res.status(201)
        return res.json(entity)
      }
    })
    .catch(err => {
      res.status(422)
      res.json({ message: err.message })
    })
})

const updateOrPatch = (req, res) => {
  const eventId = Number(req.params.id)
  const updates = req.body

  Event.findById(req.params.id)
    .then(entity => {
      if (entity.eventId !== req.event.id) {
        res.status(403).send({
          message: 'You\'re not allowed to edit this event!'
        })
      }
      else {
        return entity.update(updates)
      }
    })
    .then(final => {
      res.json(final)
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
}

router.put('/events/:id', requireUser, updateOrPatch)
router.patch('/events/:id', requireUser, updateOrPatch)

router.delete('/events/:id', (req, res) => {
  Event.findById(req.params.id)
    .then(entity => {
      if (entity.eventId !== req.event.id) {
        res.status(403).send({
          message: 'You\'re not allowed to delete this event!'
        })
      }
      else {
        return entity.destroy()
      }
    })
    .then(_ => {
      res.send({
        message: 'The event was deleted succesfully'
      })
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
})

module.exports = router

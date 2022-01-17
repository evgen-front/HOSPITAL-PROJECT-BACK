const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const Appointment = require('../../db/models/appointment/index');

module.exports.getAllAppointments = (req, res, next) => {
  const token = req.headers.authorization;
  const userId = jwt.verify(token, secret).id;
  if (!userId) {
    res.status(401).json({data: 'Token error'})
  }
  Appointment.find({userId}).then(result => {
    res.send({data: result})
  });
};

module.exports.createNewAppointment = (req, res, next) => {
  const token = req.headers.authorization;
  const userId = jwt.verify(token, secret).id;
  if (!userId) {
    res.status(401).json({data: 'Token error'})
  }
  const appointment = new Appointment(req.body);
  appointment.save().then(result => {
    Appointment.find({userId}).then(result => {
      res.send({data: result})
    }).catch(err => res.status(404).json({data: 'Appointments not found'}))
  }).catch(err => res.status(400).json({data: 'Сreation error'}))
};
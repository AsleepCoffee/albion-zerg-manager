// server/controllers/zergController.js

const Zerg = require('../models/zerg');

let zergs = []; // In-memory storage for zergs

exports.getZergs = (req, res) => {
  res.json(zergs);
};

exports.addZerg = (req, res) => {
  const { name, comp, caller, hammers, sets } = req.body;
  const newZerg = new Zerg(name, comp, caller, hammers, sets);
  zergs.push(newZerg);
  res.status(201).json(newZerg);
};

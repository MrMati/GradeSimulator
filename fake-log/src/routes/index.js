const express = require('express');
const router = express.Router();
const protocol = require("../utils/connection");

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'fake-log',
    proto: protocol(req),
    domain: req.get('host')
  });
});

module.exports = router;

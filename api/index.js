const express = require('express');
const { requireAuth } = require('../auth');

const router = express.Router();

const {
  getApplicationsRoute,
  newApplicationRoute,
} = require('./applications');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/applications', requireAuth, catchErrors(getApplicationsRoute));
router.post('/applications', requireAuth, catchErrors(newApplicationRoute));

module.exports = router;

const express = require('express');
const { requireAuth } = require('../auth');

const router = express.Router();

const {
  getApplicationsRoute,
  newApplicationRoute,
  patchApplicationRoute,
  deleteApplicationRoute,
} = require('./applications');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/applications/', requireAuth, catchErrors(getApplicationsRoute));
router.post('/applications', requireAuth, catchErrors(newApplicationRoute));
router.patch('/applications/:id', requireAuth, catchErrors(patchApplicationRoute));
router.delete('/applications/:id', requireAuth, catchErrors(deleteApplicationRoute));

module.exports = router;

const {
  saveApplication,
  fetchApplications,
  fetchApplication,
  conditionalUpdate,
  deleteApplication,
} = require('../db');
const { validateApplication } = require('../validation');

const xss = require('xss');

const { leftpad, compare } = require('../util');

async function getApplicationsRoute(req, res) {
  const { id } = req;
  const { applications } = await fetchApplications(id);
  return res.json(applications);
}

async function newApplicationRoute(req, res) {
  const { id } = req;

  const {
    company,
    posName,
    date,
    process,
  } = req.body;

  let fixedDate = date;
  if (!date) {
    const now = new Date();
    const year = now.getFullYear();
    const month = leftpad(now.getMonth(), 2);
    const day = leftpad(now.getDate(), 2);
    fixedDate = `${year}-${month}-${day}`;
  }

  const application = {
    company,
    posName,
    date: fixedDate,
    process,
  };

  const validationMessage = await validateApplication(application);

  if (validationMessage.length > 0) {
    return res.status(400).json({ errors: validationMessage });
  }

  const result = await saveApplication(id, application);

  return res.status(201).json({ ok: result });
}

async function patchApplicationRoute(req, res) {
  const { id: index } = req.params;
  const { id } = req;

  if (!Number.isInteger(Number(index))) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const { application } = await fetchApplication(id, index);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const validationMessage = await validateApplication(req.body, true);

  if (validationMessage.length > 0) {
    return res.status(400).json({ errors: validationMessage });
  }

  const isset = f => typeof f === 'string' || typeof f === 'number' || typeof f === 'object';

  const {
    company,
    posName,
    date,
    process,
  } = req.body;

  let patchCount = 0;
  if (isset(company) && company !== application.company) {
    patchCount += 1;
    application.company = xss(company);
  }
  if (isset(posName) && posName !== application.posName) {
    patchCount += 1;
    application.posName = xss(posName);
  }
  if (isset(date) && date !== application.date) {
    patchCount += 1;
    application.date = xss(date);
  }
  if (isset(process) && !compare(process, application.process)) {
    patchCount += 1;
    application.process = xss(process);
  }

  if (patchCount === 0) {
    return res.status(400).json({ error: 'Nothing to patch' });
  }

  const result = await conditionalUpdate(id, index, application);


  return res.status(201).json(result);
}

async function deleteApplicationRoute(req, res) {
  const { id: index } = req.params;
  const { id } = req;

  if (!Number.isInteger(Number(index))) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const { application } = await fetchApplication(id, index);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const { result } = await deleteApplication(id, index);

  if (result.ok) {
    return res.status(204).json({});
  }

  return res.status(404).json({ error: 'Application entry not found' });
}

module.exports = {
  getApplicationsRoute,
  newApplicationRoute,
  patchApplicationRoute,
  deleteApplicationRoute,
};

const { saveApplication, fetchApplications } = require('../db');
const { validateApplication } = require('../validation');

const { leftpad } = require('../util');

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
    state,
  } = req.body;

  let fixedDate = date;
  if (!date) {
    const now = new Date();
    fixedDate = `${now.getFullYear()}-${leftpad(now.getMonth(), 2)}-${leftpad(now.getDate(), 2)}`;
  }

  const application = {
    company,
    posName,
    date: fixedDate,
    state,
  };

  const validationMessage = await validateApplication(application);

  if (validationMessage.length > 0) {
    return res.status(400).json({ errors: validationMessage });
  }

  const result = await saveApplication(id, application);

  return res.status(201).json(result);
}

module.exports = {
  getApplicationsRoute,
  newApplicationRoute,
};

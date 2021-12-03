const express = require('express');
const asyncHandler = require('express-async-handler');
const webpush = require('web-push');
require('dotenv').config();

const { getEmployees } = require('../model/employees');

const router = express.Router();

router.get(
  '/employees',
  asyncHandler(async (req, res) => {
    res.json(getEmployees());
  }),
);

// Subscribe
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webpush.setVapidDetails(
  'mailto:palatin.d02@htlwienwest.at',
  publicVapidKey,
  privateVapidKey,
);
const subscriptions = [];
router.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    subscriptions.push(req.body);
    res.status(201).end();
  }),
);
// Notify
router.post('/notify', (req) => {
  const payload = JSON.stringify({ title: 'Push Test', body: req.body });
  for (const sub of subscriptions) {
    try {
      webpush.sendNotification(sub, payload);
    } catch (error) {
      console.error(error);
    }
  }
});

module.exports = router;

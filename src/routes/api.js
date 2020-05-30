var express = require('express');
var path = require('path');
var router = express.Router();

const Api = require('../controllers/api');

router.post('/connectStripe', Api.connectStripe);

router.post('/getStripeAccountInfo', Api.getStripeAccountInfo);
router.post('/createStripeCustomer', Api.createStripeCustomer);
router.post('/createStripeCard', Api.createStripeCard);
router.post('/createStripeCharge', Api.createStripeCharge);
router.post('/chargeTest', Api.chargeTest);

module.exports = router;

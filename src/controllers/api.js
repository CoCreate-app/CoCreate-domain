module.exports.connectStripe = (req, res, next) => {
  
  const stripe = require('stripe')('sk_test_lWZQujOjyjfDq991GZjKmfli');
  
  let params = req.body;
  
  let authorization_code = params.authorization_code;
  
  if (authorization_code) {
    
    console.log(authorization_code);
      
    stripe.oauth.token({
      grant_type: 'authorization_code',
      code: authorization_code,
    }).then(function(response) {
      // asynchronously called
      // var connected_account_id = response.stripe_user_id;
      
      console.log(response);
      
      res.send(response);
    }).catch(function(error) {
      console.log(error)
    });
      
  }
}

module.exports.getStripeAccountInfo = function(req, res, next) {
  
  const stripe = require('stripe')('sk_test_lWZQujOjyjfDq991GZjKmfli');
  
  let params = req.body;
  
  let account_id = params.account_id;
  
  stripe.accounts.retrieve(account_id, (error, account) => {
      console.log(error);
      console.log(account);
  });
}

module.exports.createStripeCustomer = function(req, res, next) {
  
  const stripe = require('stripe')('sk_test_Nf6RdSJMPe7j0nC5RwPXwMJZ00aST8DhA0');
  
  let params = req.body;
  
  let customerParam = JSON.parse(params.customerParam);
  
  stripe.customers.create(customerParam, (err, customer) => {
    console.log(err);
    console.log(customer);
    if (!err && customer) {
      res.send(customer);
    } else if (err) {
      res.send('err');
    }
  });
}

module.exports.createStripeCard = async function(req, res, next) {
  const stripe = require('stripe')('sk_test_Nf6RdSJMPe7j0nC5RwPXwMJZ00aST8DhA0');
  
  let params = req.body;
  
  let cardParam = JSON.parse(params.cardParam);
  let customerId = params.customerId;
  
  console.log(cardParam);
  
  let token = await stripe.tokens.create({
    card: cardParam,
  });
  
  console.log(token);

  if (token) {
    let result = await stripe.customers.createSource(customerId, {source: token.id});  
    
    res.send(result);
  }
}

module.exports.createStripeCharge = async function(req, res, next) {
  const stripe = require('stripe')('sk_test_Nf6RdSJMPe7j0nC5RwPXwMJZ00aST8DhA0');
  
  let params = req.body;
  
  console.log(params);
  
  let customerId = params.customerId;
  let cardId = params.cardId;
  let chargeParam = JSON.parse(params.chargeParam);
  
  let result = await stripe.charges.create({
    ...chargeParam,
    customer: customerId
  });
  
  console.log(result);
  
  res.send(result);
  
  
  
  //// most things will be done in this function
  // in this function, first we should check customer id exist, if customer id exist, we ignore card params....
  
  // if customer id doesn't exist, we should check card params and create card before create charge and use returned id to create charge
  
  /// here let's say we don't have customer id and have card detail
}


module.exports.chargeTest = async function(req, res, next) {
  
  const stripe = require('stripe')('sk_test_Nf6RdSJMPe7j0nC5RwPXwMJZ00aST8DhA0');
  
  console.log('charge test');
  
  let token = await stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2020,
      cvc: '314',
    }
  });
  
  console.log(token);
  
  if (token) {
    let result = await stripe.charges.create({
      amount: "3000",
      currency: "usd",
      test_param: 'test param',
      // customer: "cus_GIL3OALoDLCTdk",
      source: token.id
    });
    
    console.log(result);
  }
}
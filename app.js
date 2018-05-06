const express = require('express');
const stripe = require('stripe')('sk_test_Lp8HXGzeJOVqnhd5yPrUTdBL');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static folder
app.use(express.static(`${__dirname}/public`));

// Index route
app.get('/', (req, res) => {
  res.render('index')
});

// app.get('/success', (req, res) => {
//   res.render('success')
// });

// Charge route
app.post('/charge', (req, res) => {
  const amount = 2500;

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web Development Ebook',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}...`)
});

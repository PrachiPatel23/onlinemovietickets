const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_51PMrqyE02qQiZzAN6T1ICJBjpGmlwjmkjkcQk7Sq7rjISHNvyMgCLLuqd0vIFekW1LmvzPs8cocP1jIlmoFVAc5W00VAOkkaQO");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { ticktesTotal } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: (ticktesTotal*100),
      currency: "inr",
      description: "Movies Payment",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3939, () => {
  console.log("Server is listening on localhost:3939 ...");
});

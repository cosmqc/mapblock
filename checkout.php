<?php
require_once '../secrets.php';
require_once '../vendor/stripe/stripe-php/init.php';

\Stripe\Stripe::setApiKey($stripeSecretKey);

$YOUR_DOMAIN = 'https://localhost';
$content = json_decode(file_get_contents('php://input'), true);
$id = $content['id'];

$checkout_session = \Stripe\Checkout\Session::create([
  'line_items' => [
    [
      'price' => 'price_1OHaEWGWhb3geKf3YT3ozBoV',
      'quantity' => 1,
    ],
  ],
  'mode' => 'payment',
  'success_url' => $YOUR_DOMAIN . '/view.php?donated=true&id=' . $id ,
  'cancel_url' => $YOUR_DOMAIN,
  'automatic_tax' => [
    'enabled' => false,
  ],
]);

echo $checkout_session->url;
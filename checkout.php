<?php
require_once '../secrets.php';

\Stripe\Stripe::setApiKey($stripeSecretKey);

$YOUR_DOMAIN = 'http://localhost';
$content = json_decode(file_get_contents('php://input'), true);
$name = $content["name"];
$price = intval($content['price']*100);

$checkout_session = \Stripe\Checkout\Session::create([
  'line_items' => [[
        'price_data' => [
            'currency' => 'nzd',
            'unit_amount' => $price,
            'product_data' => [
              'name' => $name,
            ],
          ],
        'quantity' => 1,
      ]],
  'mode' => 'payment',
  'success_url' => $YOUR_DOMAIN . '/success.html',
  'cancel_url' => $YOUR_DOMAIN . '/map.html',
  'automatic_tax' => [
    'enabled' => true,
  ],
]);

echo $checkout_session->url;
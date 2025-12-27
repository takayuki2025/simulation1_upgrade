<?php return array (
  'App\\Providers\\EventServiceProvider' => 
  array (
    'Illuminate\\Auth\\Events\\Registered' => 
    array (
      0 => 'Illuminate\\Auth\\Listeners\\SendEmailVerificationNotification',
    ),
    'Illuminate\\Auth\\Events\\Verified' => 
    array (
      0 => 'App\\Listeners\\RedirectAfterEmailVerified',
    ),
    'App\\Modules\\Order\\Domain\\Event\\OrderPaid' => 
    array (
      0 => 'App\\Modules\\Shipment\\Application\\Listener\\CreateShipmentOnOrderPaidListener',
    ),
  ),
  'Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider' => 
  array (
    'Illuminate\\Auth\\Events\\Verified' => 
    array (
      0 => 'App\\Listeners\\RedirectAfterEmailVerified@handle',
    ),
  ),
);
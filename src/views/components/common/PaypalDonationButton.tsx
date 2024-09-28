import React, { useEffect } from 'react';
import { loadScript } from '@paypal/paypal-js';

let paypal;

try {
    paypal = await loadScript({ clientId: 'test' });
} catch (error) {
    console.error('failed to load the PayPal JS SDK script', error);
}

if (paypal) {
    try {
        if (paypal && paypal.Buttons) {
            await paypal.Buttons().render('#your-container-element');
        } else {
            console.error('PayPal Buttons is not available');
        }
    } catch (error) {
        console.error('failed to render the PayPal Buttons', error);
    }
}

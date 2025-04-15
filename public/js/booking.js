import axios from 'axios';
import { showAlert } from "./alert";

const stripe = Stripe("pk_test_51RDOEeSEREsCkQqMre7j6AHemAQe8idY3vznV2WCC5iAqzuBqLXa91ol4FReXC4sDDNhNRJz3CiSEU6jKd6F3UrY00IxgC2vty");

export const bookTour = async tourId => {
    try {
        const session = await axios(
            `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`
        );

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (error) {
        showAlert('error', error)
    }
}
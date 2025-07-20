// Initialize Stripe
const stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Replace with your actual Stripe publishable key

// Plan IDs - replace with your actual Stripe price IDs
const PLANS = {
    adventurer: 'price_adventurer',
    dungeonmaster: 'price_dungeonmaster'
};

// Handle subscription button clicks
document.querySelectorAll('.subscribe-button').forEach(button => {
    button.addEventListener('click', async (e) => {
        const plan = e.target.dataset.plan;
        const priceId = PLANS[plan];

        try {
            // Create checkout session
            const response = await fetch('/.netlify/functions/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    successUrl: window.location.origin + '/success',
                    cancelUrl: window.location.origin + '/pricing',
                }),
            });

            const session = await response.json();

            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                console.error(result.error);
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    });
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add neon glow effect on scroll
window.addEventListener('scroll', () => {
    const features = document.querySelectorAll('.feature-card');
    features.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            card.style.boxShadow = '0 0 15px var(--neon-cyan)';
        } else {
            card.style.boxShadow = 'none';
        }
    });
});

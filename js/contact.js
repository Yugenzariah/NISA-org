// Initialize Email.js using the public key
emailjs.init('K1ztI7l2rSvXO6aco');

// Contact form submit handler
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;

    // Send the form data directly using emailjs.sendForm
    emailjs.sendForm('service_8mo69dc', 'template_g7x4p0r', form)
        .then(function(response) {
            alert('Message sent successfully!');
            form.reset();
        })
        .catch(function(error) {
            alert('Failed to send the message. Please try again later.');
        });
});
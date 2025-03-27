// Initialize EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your user ID
    (function() {
        // EmailJS public key
        emailjs.init("-rwW7EmVz0GRJqEx6");
    })();

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Change button text while sending
            const submitButton = contactForm.querySelector('.btn-submit');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
            submitButton.disabled = true;

            // Show form status
            formStatus.style.display = 'block';
            formStatus.textContent = "Sending your message...";
            formStatus.className = "form-status pending";

            // Prepare template parameters
            const templateParams = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                subject: contactForm.querySelector('#subject').value,
                message: contactForm.querySelector('#message').value,
                to_email: 'sanjidds99@gmail.com'
            };

            // Send the email using EmailJS
            // Using your EmailJS service and template IDs
            emailjs.send('service_uea3gt6', 'template_s4onksw', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formStatus.textContent = "Message sent successfully!";
                    formStatus.className = "form-status success";
                    contactForm.reset();

                    // Restore button after delay
                    setTimeout(function() {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    }, 2000);

                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        formStatus.textContent = '';
                        formStatus.style.display = 'none';
                    }, 5000);
                }, function(error) {
                    console.log('FAILED...', error);
                    formStatus.textContent = "Failed to send message. Please try again later.";
                    formStatus.className = "form-status error";

                    // Restore button
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }
});

/**
 * EmailJS Configuration:
 *
 * The contact form is configured with the following EmailJS details:
 * - Public API Key: -rwW7EmVz0GRJqEx6
 * - Service ID: service_uea3gt6
 * - Template ID: template_8dlh0i3
 * - Recipient Email: sanjidds99@gmail.com
 *
 * Template Variables:
 * - {{name}} - Sender's name
 * - {{email}} - Sender's email
 * - {{subject}} - Message subject
 * - {{message}} - Message content
 * - {{to_email}} - Your email (sanjidds99@gmail.com)
 *
 * If you need to make changes to the email template:
 * 1. Log in to your EmailJS account
 * 2. Navigate to the Email Templates section
 * 3. Edit the template_8dlh0i3 template
 *
 * Contact form submissions will be sent to your email (sanjidds99@gmail.com)
 */

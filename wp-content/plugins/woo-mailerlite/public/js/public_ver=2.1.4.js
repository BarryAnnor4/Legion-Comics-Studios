jQuery(document).ready(function(a) {
    const allowedInputs = ['billing_email', 'billing_first_name', 'billing_last_name', 'woo_ml_subscribe'];
    triggerAddEvents();

    if (jQuery('#woo_ml_preselect_enabled')?.val() == 'yes') {
        jQuery('#woo_ml_subscribe').prop('checked', true);
    }


    document.addEventListener('DOMNodeRemoved', ({ target }) => {
        if (allowedInputs.includes((target.id)?.replace('_field', ''))) {
            triggerAddEvents();
        }
    });



    function triggerAddEvents() {
        const email = document.querySelector('#billing_email');
        const first_name_field = document.querySelector('#billing_first_name');
        const last_name_field = document.querySelector('#billing_last_name');
        const signup = document.querySelector('#woo_ml_subscribe');

        if (email !== null) {
            email.addEventListener('change', (event) => {
                event.stopImmediatePropagation();
                validateMLSub(event);
            });
        }

        if (first_name_field !== null) {
            first_name_field.addEventListener('change', (event) => {
                if(first_name_field.value.length > 0) {
                    event.stopImmediatePropagation();
                    validateMLSub(event);
                }
            });
        }

        if (last_name_field !== null) {
            last_name_field.addEventListener('change', (event) => {
                if(last_name_field.value.length > 0) {
                    event.stopImmediatePropagation();
                    validateMLSub(event);
                }
            });
        }

        if (signup !== null) {
            a(document).on('change', signup, function(event) {
                if (event.target.id == 'woo_ml_subscribe') {
                    event.stopImmediatePropagation();
                    validateMLSub(event);
                }
            });
        }
    }

    function validateMLSub(e) {

        if(document.querySelector('#billing_email') !== null && document.querySelector('#billing_email').value.length > 0) {
                checkoutMLSub(e);
        }
    }

    function checkoutMLSub(e) {
        if (!allowedInputs.includes(e.target.id)) {
            return false;
        }
        /** set cookie before sending request to server
         * since multiple checkout update requests can be sent
         * and server cookies won't get updated, so send the saved
         * cookie as a request parameter
        **/

        if (!getCookie('mailerlite_checkout_token')) {
            var now = new Date();
            now.setTime(now.getTime() + 48 * 3600 * 1000);
            document.cookie = `mailerlite_checkout_token=${(+new Date).toString()}; expires=${now.toUTCString()}; path=/`;
        }

        const accept_marketing = document.querySelector('#woo_ml_subscribe').checked;

        let first_name = document.querySelector('#billing_first_name')?.value ?? '';
        let last_name = document.querySelector('#billing_last_name')?.value ?? '';
        const email = document.querySelector('#billing_email')?.value;

        jQuery.ajax({
            url: woo_ml_public_post.ajax_url,
            type: "post",
            data: {
                action: "post_woo_ml_email_cookie",
                email: email,
                signup: accept_marketing,
                language: woo_ml_public_post.language,
                first_name: first_name,
                last_name: last_name,
                cookie_mailerlite_checkout_token:getCookie('mailerlite_checkout_token')
            }
        });
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift()
    }
    return null;
}
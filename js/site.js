/* Lark Doula: records contact actions in Google Analytics.
   Events sent:
     phone_click          someone taps the Lark Doula phone number
     email_click          someone taps the Lark Doula email address
     call_button_click    someone clicks a "Schedule a Free 30-Minute Call" style button
     inquiry_form_submit  the inquiry form on the Contact page is sent successfully
   Each click event also says where the link was: header, footer, or page. */
(function () {
  var PHONE = 'tel:+14142853445';
  var EMAIL = 'mailto:amanda@larkdoula.com';

  function send(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }
  function where(el) {
    return el.closest('footer') ? 'footer' : el.closest('header') ? 'header' : 'page';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href === PHONE) {
      send('phone_click', { link_location: where(a) });
    } else if (href === EMAIL) {
      send('email_click', { link_location: where(a) });
    } else if (a.classList.contains('button') && /(^|\/)contact$/.test(href)) {
      send('call_button_click', { link_location: where(a) });
    }
  });

  /* Inquiry form: send it in the background, then show the thank-you message in its place.
     If scripts are blocked, the form still submits the ordinary way. */
  var form = document.getElementById('inquiry-form');
  if (form && window.fetch && window.FormData) {
    var thanks = document.getElementById('inquiry-thanks');
    var servicesError = document.getElementById('f-services-error');
    var formError = document.getElementById('f-form-error');
    var button = form.querySelector('button[type="submit"]');
    var subject = form.querySelector('input[name="_subject"]');
    var baseSubject = subject.value;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formError.hidden = true;

      // "Which services" is required: at least one box must be ticked
      var picked = form.querySelectorAll('input[name="Services"]:checked').length > 0;
      servicesError.hidden = picked;
      if (!picked) {
        document.getElementById('f-services').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Email subject becomes "Doula Inquiry Form Submission: Their Name"
      var name = form.querySelector('input[name="Name"]').value.trim();
      subject.value = name ? baseSubject + ': ' + name : baseSubject;

      button.disabled = true;
      button.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error('Form service returned ' + response.status);
          send('inquiry_form_submit');
          form.hidden = true;
          thanks.hidden = false;
          thanks.focus();
          thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          formError.hidden = false;
          button.disabled = false;
          button.textContent = 'Send Inquiry';
        });
    });
  }
})();

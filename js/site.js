/* Lark Doula: records contact actions in Google Analytics.
   Events sent:
     phone_click          someone taps the Lark Doula phone number
     email_click          someone taps the Lark Doula email address
     call_button_click    someone clicks a Reach Out button (goes to the Contact page)
     booking_click        someone clicks a Book a Free Call button (goes to the booking calendar on the
                          Contact page) or the link to the Google booking page
     inquiry_form_submit  the message form on the Contact page is sent successfully
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
    } else if (/(^|\/)contact#book$/.test(href) || /^https:\/\/calendar\.app\.google\//.test(href)) {
      send('booking_click', { link_location: where(a) });
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
    var buttonText = button.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formError.hidden = true;

      // "Which services" is required when the form has it: at least one box must be ticked
      var picked = !servicesError || form.querySelectorAll('input[name="Services"]:checked').length > 0;
      if (servicesError) servicesError.hidden = picked;
      if (!picked) {
        document.getElementById('f-services').scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.querySelector('input[name="Services"]').focus({ preventScroll: true });
        return;
      }

      // Email subject becomes "Doula Inquiry Form Submission: Their Name"
      var name = form.querySelector('input[name="Name"]').value.trim();
      subject.value = name ? baseSubject + ': ' + name : baseSubject;

      button.disabled = true;
      button.textContent = 'Sending...';
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
          button.textContent = buttonText;
        });
    });
  }
})();

/* Opens a closed FAQ answer when a link points inside it, such as the
   "prenatal visits" links on the Services package cards, then scrolls to it.
   Also works when the page is opened with that address (services#prenatal-visits). */
(function () {
  function openTarget(hash) {
    if (!hash || hash.length < 2) return false;
    var el = document.getElementById(hash.slice(1));
    if (!el) return false;
    var box = el.closest('details');
    if (!box) return false;
    box.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute('href');
    if (openTarget(hash)) {
      e.preventDefault();
      history.pushState(null, '', hash);
    }
  });
  if (location.hash) openTarget(location.hash);
})();

/* Phones and narrow windows (52rem and under): the pinned menu hides while you scroll down
   and comes back when you scroll up. After a jump link (like Services), it stays hidden so it
   doesn't cover the heading you jumped to. */
(function () {
  var header = document.querySelector('.site-header');
  if (!header || !window.matchMedia) return;
  var narrow = window.matchMedia('(max-width: 52rem)');
  var lastY = window.scrollY;
  var holdUntil = 0;

  function hide() { header.classList.add('nav-hidden'); }
  function show() { header.classList.remove('nav-hidden'); }

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (!narrow.matches || y <= header.offsetHeight) { show(); lastY = y; return; }
    if (Date.now() < holdUntil) { lastY = y; return; }
    if (y > lastY + 4) hide();
    else if (y < lastY - 4) show();
    lastY = y;
  }, { passive: true });

  // Jump links on the same page, and opening the page at a section (from another page)
  function afterJump() { if (narrow.matches) { hide(); holdUntil = Date.now() + 1200; } }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.pathname !== location.pathname) return;
    if (a.hash && a.hash.length > 1) afterJump();
  });
  if (location.hash.length > 1) afterJump();
  narrow.addEventListener && narrow.addEventListener('change', function () { if (!narrow.matches) show(); });
})();

/* Home page: the menu underlines the section you're reading (Meet Amanda, or Services for
   the packages, high-risk, and FAQ sections), and Home when you're above them. */
(function () {
  var home = document.querySelector('.nav-bar nav a[href="./"]');
  var links = document.querySelectorAll('.nav-bar nav a[href^="#"]');
  if (!home || !links.length) return;
  var sections = { about: 'about', services: 'services', 'nicu-support': 'services', faq: 'services' };
  var linkFor = {};
  links.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
  var ids = Object.keys(sections).filter(function (id) { return document.getElementById(id) && linkFor[sections[id]]; });
  if (!ids.length) return;
  var all = [home].concat(Array.prototype.slice.call(links));

  function mark() {
    var line = window.innerHeight * 0.4, current = home;
    ids.forEach(function (id) {
      var r = document.getElementById(id).getBoundingClientRect();
      if (r.top <= line) current = linkFor[sections[id]];
    });
    all.forEach(function (a) {
      if (a === current) a.setAttribute('aria-current', a === home ? 'page' : 'location');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', mark, { passive: true });
  window.addEventListener('resize', mark);
  mark();
})();

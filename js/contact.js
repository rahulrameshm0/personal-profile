const contactForm = document.querySelector('#contact-form');
const contactPage = document.querySelector('.contact-page');

if (contactPage) {
  try {
    if (window.sessionStorage.getItem('contact-page-entering') === '1') {
      window.sessionStorage.removeItem('contact-page-entering');
      contactPage.classList.add('contact-page--entering');
      contactPage.querySelector('.contact-page__form-wrap')?.addEventListener('animationend', () => {
        contactPage.classList.remove('contact-page--entering');
      }, { once: true });
    }
  } catch (error) {
    // The contact page works normally if session storage is unavailable.
  }
}

if (contactForm) {
  const formNote = document.querySelector('#form-note');

  contactForm.addEventListener('input', () => {
    if (formNote?.dataset.state === 'error') {
      formNote.textContent = 'Your email app will open with the message ready to send.';
      delete formNote.dataset.state;
    }
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalidField = Array.from(contactForm.elements).find((field) =>
      typeof field.checkValidity === 'function' && !field.checkValidity()
    );

    if (invalidField) {
      invalidField.focus();
      const label = contactForm.querySelector(`label[for="${invalidField.id}"]`);
      if (formNote) {
        formNote.textContent = `Please check ${label?.textContent.toLowerCase() || 'this field'}.`;
        formNote.dataset.state = 'error';
      }
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const sender = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const body = `From: ${name}\nReply to: ${sender}\n\n${message}`;
    const mailto = `mailto:rahulrameshm98@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (formNote) {
      formNote.textContent = 'Opening your email app with your message…';
      formNote.dataset.state = 'ready';
    }
    window.location.href = mailto;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reveal panels on scroll/load using IntersectionObserver
  const panels = document.querySelectorAll('.card-panel');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const panelObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, observerOptions);

  panels.forEach(panel => {
    panelObserver.observe(panel);
  });

  // Fallback for browsers that don't support IntersectionObserver (or in case layout delays occur)
  if (!window.IntersectionObserver) {
    panels.forEach(panel => {
      panel.classList.add('visible');
    });
  }

  // 2. Project tab switching (TSSRS vs AbansiBabayi)
  const tabs = document.querySelectorAll('.project-tab');
  const showcases = document.querySelectorAll('.project-showcase');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetProject = tab.getAttribute('data-project');

      // Update active states on tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show/Hide project showcases
      showcases.forEach(showcase => {
        const isTarget = showcase.id === `project-${targetProject}`;
        if (isTarget) {
          showcase.classList.add('active');
          showcase.removeAttribute('hidden');
        } else {
          showcase.classList.remove('active');
          showcase.setAttribute('hidden', '');
        }
      });
    });
  });

  // 3. Contact Form validation and submission handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const firstNameInput = document.getElementById('firstName');
      const lastNameInput = document.getElementById('lastName');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const firstName = firstNameInput ? firstNameInput.value.trim() : '';
      const lastName = lastNameInput ? lastNameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validate inputs
      if (!firstName || !lastName || !email || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.textContent = 'Please enter a valid e-mail address.';
        formStatus.className = 'form-status error';
        return;
      }

      // Display sending state
      formStatus.textContent = 'Sending message...';
      formStatus.className = 'form-status';

      // Simulate network request/latency
      setTimeout(() => {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      }, 1500);
    });
  }

  // 4. Developer photo slider
  const prevBtn = document.getElementById('prevDevPhoto');
  const nextBtn = document.getElementById('nextDevPhoto');
  const slides = document.querySelectorAll('.slider-image');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;

  if (prevBtn && nextBtn && slides.length > 0 && dots.length > 0) {
    const updateSlider = (index) => {
      // Handle index wrapping
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      // Update slide active class
      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update dot active class
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    // Event listeners for buttons
    prevBtn.addEventListener('click', () => {
      updateSlider(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
      updateSlider(currentSlide + 1);
    });

    // Event listeners for dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateSlider(idx);
      });
    });
  }
});

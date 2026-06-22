document.addEventListener('DOMContentLoaded', () => {

  renderProjects();
  setupProjectTabs();
  initializeCarousel();

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

  // 3. Contact Form validation and submission handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Retrieve form values
      const firstNameInput = document.getElementById('firstName');
      const lastNameInput = document.getElementById('lastName');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const phoneNoInput = document.getElementById('phoneNo');

      const firstName = firstNameInput ? firstNameInput.value.trim() : '';
      const lastName = lastNameInput ? lastNameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const phoneNo = phoneNoInput ? phoneNoInput.value.trim() : '';

      // Validate inputs
      if (!firstName || !lastName || !email || !message || !phoneNo) {
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

      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbwCy4rLvlW0G9fEtIuF_27sYhkF7YL5BwtGba8w83Jy6I27EICoH1zPHIfZ7XOnJv5V/exec";

      try {

        const formData = new FormData(contactForm);

        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: formData
        });

        if (response.ok) {

          formStatus.textContent =
            "Thank you! Your message has been sent successfully.";

          formStatus.className =
            "form-status success";

          contactForm.reset();

        } else {

          formStatus.textContent =
            "Failed to send message.";

          formStatus.className =
            "form-status error";
        }

      } catch (error) {

        console.error(error);

        formStatus.textContent =
          "An error occurred while sending.";

        formStatus.className =
          "form-status error";
      }
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

function renderProjects() {


  const tabsContainer = document.querySelector(".project-tabs");
  const projectsContainer = document.querySelector(".projects-container");

  if (!tabsContainer || !projectsContainer) return;

  tabsContainer.innerHTML = "";
  projectsContainer.innerHTML = "";

  projects.forEach((project, index) => {
    tabsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <button
        class="project-tab ${index === 0 ? "active" : ""}"
        role="tab"
        aria-selected="${index === 0}"
        data-project="${project.id}">
        ${project.name}
      </button>
      `
    );

    projectsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <article
        class="project-showcase ${index === 0 ? "active" : ""}"
        id="project-${project.id}"
        ${index !== 0 ? "hidden" : ""}>

        <div class="project-carousel">

            <div class="image-carousel"></div>

        </div>

        <h2 class="project-title">${project.name}</h2>

        <p class="project-tagline">
          ${project.tagline}
        </p>

        <p class="project-description">
          ${project.description}
        </p>

        <div class="project-meta">
          <span>${project.technologies}</span>
          <span>${project.year}</span>
        </div>

        ${project.public
        ? `
              <a
                href="${project.url}"
                class="btn-outline"
                target="_self"
                rel="noopener noreferrer">
                View Story
              </a>
            `
        : `
              <button
                class="btn-outline"
                disabled
                title="Private deployment">
                View Project
              </button>
            `
      }
      </article>
      `
    );
  });


}

function setupProjectTabs() {
  const tabs = document.querySelectorAll(".project-tab");
  const showcases = document.querySelectorAll(".project-showcase");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetProject = tab.dataset.project;

      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      showcases.forEach(showcase => {
        const isTarget =
          showcase.id === `project-${targetProject}`;

        if (isTarget) {
          showcase.classList.add("active");
          showcase.removeAttribute("hidden");
        } else {
          showcase.classList.remove("active");
          showcase.setAttribute("hidden", "");
        }
      });
    });
  });
}

function initializeCarousel() {
  const showcases = document.querySelectorAll('.project-showcase');

  showcases.forEach((projectEl) => {
    const carousel = projectEl.querySelector('.image-carousel');
    const leftBtn = projectEl.querySelector('.left-button');
    const rightBtn = projectEl.querySelector('.right-button');

    if (!carousel) return;

    const projectId = projectEl.id.replace('project-', '');
    const project = projects.find(p => p.id === projectId);

    if (!project || !project.images || project.images.length === 0) return;

    let centerIndex = 0;
    const allImages = [];

    // ----------------------------
    // Build carousel items
    // ----------------------------
    project.images.forEach((src, index) => {
      const placeholder = document.createElement('div');
      placeholder.classList.add('image-placeholder');

      const img = document.createElement('img');
      img.src = src;
      img.alt = project.name;
      img.loading = 'lazy';

      placeholder.appendChild(img);
      carousel.appendChild(placeholder);

      allImages.push(img);

      // Click image → center it
      img.addEventListener('click', () => {
        centerIndex = index;
        updateCarousel();
      });
    });

    // ----------------------------
    // Update layout function
    // ----------------------------
    function updateCarousel() {
      allImages.forEach((img, index) => {
        const el = img.parentElement;

        el.classList.remove(
          'center',
          'left',
          'right',
          'left-offscreen',
          'right-offscreen',
          'invisible'
        );

        if (index === centerIndex) {
          el.classList.add('center');
        }
        else if (index === centerIndex - 1) {
          el.classList.add('left');
        }
        else if (index === centerIndex + 1) {
          el.classList.add('right');
        }
        else if (index === centerIndex - 2) {
          el.classList.add('left-offscreen');
        }
        else if (index === centerIndex + 2) {
          el.classList.add('right-offscreen');
        }
        else {
          el.classList.add('invisible');
        }
      });

      updateArrows();
    }

    // ----------------------------
    // Arrow state
    // ----------------------------
    function updateArrows() {
      if (!leftBtn || !rightBtn) return;

      leftBtn.style.opacity = centerIndex <= 0 ? '0.3' : '1';
      rightBtn.style.opacity = centerIndex >= allImages.length - 1 ? '0.3' : '1';
    }

    // ----------------------------
    // Arrow controls
    // ----------------------------
    if (leftBtn) {
      leftBtn.addEventListener('click', () => {
        if (centerIndex > 0) {
          centerIndex--;
          updateCarousel();
        }
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener('click', () => {
        if (centerIndex < allImages.length - 1) {
          centerIndex++;
          updateCarousel();
        }
      });
    }

    // ----------------------------
    // Reset when clicking outside
    // ----------------------------
    document.addEventListener('click', (event) => {
      const isImage = event.target.closest('.image-placeholder img');
      const isLeft = event.target.closest('.left-button');
      const isRight = event.target.closest('.right-button');

      if (!projectEl.contains(event.target)) return;

      if (!isImage && !isLeft && !isRight) {
        centerIndex = Math.floor(allImages.length / 2);
        updateCarousel();
      }
    });

    // Initial render
    centerIndex = centerIndex = Math.floor(allImages.length / 2);
    updateCarousel();
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.card-panel');
  const storySections = document.querySelectorAll('.story-section');
  const progressDots = document.querySelectorAll('.story-progress-dot');
  const progressFill = document.querySelector('.story-top-progress-fill');
  const chapterLabel = document.querySelector('.story-top-chapter');
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  const chapterNames = {
    '01': 'Introduction',
    '01.1': 'The Summary',
    '02': 'The Observation',
    '03': 'Workflow First',
    '04': 'Mapping the System',
    '05': 'Designing TSSRS',
    '06': 'Built for Roles',
    '07': 'People Before Code',
    '08': 'Beyond Features',
    '09': 'The Question'
  };

  const panelObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  panels.forEach(panel => {
    panelObserver.observe(panel);
    if (panel.getBoundingClientRect().top < window.innerHeight) {
      panel.classList.add('visible');
    }
  });

  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        const sectionNum = entry.target.dataset.section;
        progressDots.forEach(dot => {
          dot.classList.toggle('active', dot.dataset.section === sectionNum);
        });

        if (chapterLabel && chapterNames[sectionNum]) {
          chapterLabel.textContent = chapterNames[sectionNum];
        }
      }
    });
  }, { threshold: 0.4 });

  storySections.forEach(section => storyObserver.observe(section));

  if (storySections.length > 0) {
    storySections[0].classList.add('in-view');
    if (progressDots.length > 0) {
      progressDots[0].classList.add('active');
    }
    if (chapterLabel) {
      chapterLabel.textContent = chapterNames['01'];
    }
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

  parallaxEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (center - window.innerHeight / 2) * 0.05;
    el.style.setProperty('--parallax-y', `${offset}px`);
  });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateScrollProgress();
});

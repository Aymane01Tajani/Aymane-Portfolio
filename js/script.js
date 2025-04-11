// Smooth scrolling for navigation links
document.querySelectorAll('.top-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSection(entry.target);
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

function animateSection(section) {
    // Apply different animations based on section ID
    const id = section.id;
    const cards = section.querySelectorAll('.card');
    
    switch(id) {
        case 'profile':
            section.querySelector('.profile-text').classList.add('fade-in-left');
            section.querySelector('.profile-image').classList.add('fade-in-right');
            break;
            
        case 'education':
            section.querySelector('h2').classList.add('fade-in-down');
            cards.forEach((card, index) => {
                card.classList.add('fade-in-up', `delay-${index + 1}`);
            });
            break;
            
        case 'experiences':
            section.querySelector('h2').classList.add('fade-in-down');
            cards.forEach((card, index) => {
                card.classList.add('fade-in-left', `delay-${index % 3 + 1}`);
            });
            break;
            
        case 'projects':
            section.querySelector('h2').classList.add('fade-in-down');
            cards.forEach((card, index) => {
                card.classList.add('fade-in-right', `delay-${index + 1}`);
            });
            break;
            
        case 'skills':
            section.querySelector('h2').classList.add('fade-in-down');
            cards.forEach((card, index) => {
                card.classList.add('zoom-in', `delay-${index % 3 + 1}`);
            });
            break;
            
        case 'certifications':
            section.querySelector('h2').classList.add('fade-in-down');
            cards.forEach((card, index) => {
                card.classList.add('fade-in-up', `delay-${index % 3 + 1}`);
            });
            break;
            
        case 'languages':
            section.querySelector('h2').classList.add('fade-in-down');
            cards.forEach((card, index) => {
                card.classList.add('fade-in-up', `delay-${index + 1}`);
            });
            break;
            
        case 'interests':
            section.querySelector('h2').classList.add('fade-in-down');
            cards.forEach((card, index) => {
                card.classList.add('rotate-in', `delay-${index + 1}`);
            });
            break;
            
        case 'contact':
            section.querySelector('h2').classList.add('fade-in-down');
            const contactItems = section.querySelectorAll('.contact-item');
            contactItems.forEach((item, index) => {
                item.classList.add('fade-in-right', `delay-${index + 1}`);
            });
            section.querySelector('.cv-download').classList.add('fade-in-up', 'delay-3');
            break;
    }
}

// Add scroll animations to sections
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
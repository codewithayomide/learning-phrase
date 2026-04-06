// TESTIMONIALS FUNCTIONALITY
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('testRating');

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = parseInt(star.dataset.value);
    ratingInput.value = value;
    
    // Select this star and all stars with higher values
    stars.forEach(s => {
      const starValue = parseInt(s.dataset.value);
      if (starValue <= value) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  });
  
  // Hover effect
  star.addEventListener('mouseover', () => {
    const value = parseInt(star.dataset.value);
    stars.forEach(s => {
      const starValue = parseInt(s.dataset.value);
      if (starValue <= value) {
        s.style.color = '#FFD700';
      } else {
        s.style.color = '#ddd';
      }
    });
  });
});

// Reset hover effect
document.querySelector('.stars').addEventListener('mouseout', () => {
  stars.forEach(s => {
    if (s.classList.contains('active')) {
      s.style.color = '#FFD700';
    } else {
      s.style.color = '#ddd';
    }
  });
});

// TESTIMONIAL FORM SUBMISSION
const testimonialForm = document.getElementById('testimonialForm');
let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];

if (testimonialForm) {
  testimonialForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('testName').value;
    const email = document.getElementById('testEmail').value;
    const comment = document.getElementById('testComment').value;
    const rating = document.getElementById('testRating').value;
    
    const newTestimonial = {
      name: name,
      email: email,
      comment: comment,
      rating: parseInt(rating)
    };
    
    // Send email using EmailJS
    try {
      await emailjs.send("service_reymide", "template_testimonial", {
        to_email: "your-email@reymide.com",
        customer_name: name,
        customer_email: email,
        rating: rating,
        message: comment
      });
      
      // Add new testimonial and keep only 10
      testimonials.unshift(newTestimonial);
      if (testimonials.length > 10) {
        testimonials.pop();
      }
      
      localStorage.setItem('testimonials', JSON.stringify(testimonials));
      
      // Reset form
      testimonialForm.reset();
      ratingInput.value = '5';
      stars.forEach(s => s.classList.remove('active'));
      
      // Show success message
      alert('Thank you! Your feedback has been posted.');
      
      // Update display
      displayTestimonials();
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error submitting feedback. Please try again.');
    }
  });
}

// DISPLAY TESTIMONIALS FROM STORAGE
function displayTestimonials() {
  const grids = document.querySelectorAll('.testimonials-column');
  const stored = JSON.parse(localStorage.getItem('testimonials')) || [];
  
  if (stored.length > 0) {
    grids.forEach(grid => grid.innerHTML = '');
    
    stored.forEach((test) => {
      // Distribute evenly across columns
      const gridIndex = stored.indexOf(test) % grids.length;
      const grid = grids[gridIndex];
      
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      const stars = '★'.repeat(test.rating) + '☆'.repeat(5 - test.rating);
      card.innerHTML = `
        <h4 class="testimonial-name">${test.name}</h4>
        <div class="testimonial-stars">${stars}</div>
        <p class="testimonial-text">${test.comment}</p>
      `;
      grid.appendChild(card);
    });
  }
}

// Load stored testimonials on page load
document.addEventListener('DOMContentLoaded', displayTestimonials);

// WHATSAPP TOOLTIP - SHOW AFTER 30 SECONDS
setTimeout(() => {
  const tooltip = document.querySelector('.whatsapp-tooltip');
  if (tooltip) {
    tooltip.classList.add('show');
    
    // Hide after 8 seconds
    setTimeout(() => {
      tooltip.classList.remove('show');
    }, 8000);
  }
}, 30000);

// HERO LINE SCROLL EFFECT
const heroLine = document.querySelector('.hero-line');

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    heroLine.style.opacity = '0';
  } else {
    heroLine.style.opacity = '1';
  }
});

// HERO SLIDER
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slider .slide');
const heroSlider = document.querySelector('.hero-slider');
const totalSlides = slides.length;

function moveToSlide(index, animate = true) {
  if (animate) {
    heroSlider.style.transition = 'transform 0.8s ease-in-out';
  } else {
    heroSlider.style.transition = 'none';
  }
  heroSlider.style.transform = `translateX(-${index * 100}%)`;
}

setInterval(() => {
  currentSlide++;
  
  // If we've passed the last slide, reset to beginning instantly
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
    moveToSlide(0, false);
  } else {
    // Move with animation to next slide
    moveToSlide(currentSlide, true);
  }
}, 4500);

// MODAL FUNCTIONALITY
const modal = document.getElementById('productModal');
const modalSlide1 = document.getElementById('modalSlide1');
const modalSlide2 = document.getElementById('modalSlide2');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalWhatsapp = document.getElementById('modalWhatsapp');
const slidesContainer = document.querySelector('.modal-slides-container');
const dots = document.querySelectorAll('.dot');

let currentModalSlide = 0;

function updateModalSlider() {
  slidesContainer.style.transform = `translateX(-${currentModalSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentModalSlide));
}

window.changeModalSlide = function(dir) {
  currentModalSlide = (currentModalSlide + dir + 2) % 2;
  updateModalSlider();
};

window.goToModalSlide = function(index) {
  currentModalSlide = index;
  updateModalSlider();
};

window.openModal = function(productSlug, title, desc, price) {
  currentModalSlide = 0;
  modal.style.display = 'flex';
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalPrice.textContent = price;
  
  // Map product slugs to front and back images
  const imageMap = {
    'black-tuxedo': {
      front: 'images/hero3.png',
      back: 'images/Use AI Image Mar 30, 2026, 09_32_46.png'
    },
    'gray-suit': {
      front: 'images/Use AI Image Mar 30, 2026, 09_40_26.png',
      back: 'images/Use AI Image Mar 31, 2026, 14_30_32.png'
    }
  };
  
  const images = imageMap[productSlug] || { 
    front: 'images/hero1.png', 
    back: 'images/Use AI Image Mar 31, 2026, 14_55_50.png' 
  };
  
  modalSlide1.src = images.front;
  modalSlide2.src = images.back;
  updateModalSlider();

  const message = encodeURIComponent(
    `Hi, I'm interested in the ${title} (${price}). Check it out!`
  );
  modalWhatsapp.href = `https://wa.me/2349074474406?text=${message}`;

  if (typeof gtag === 'function') gtag('event', 'whatsapp_click', { product: title });
  if (typeof fbq === 'function') fbq('track', 'ViewContent');
};

window.closeModal = function() {
  modal.style.display = 'none';
};

window.handleModalOutsideClick = function(event) {
  if (event.target === modal) closeModal();
};
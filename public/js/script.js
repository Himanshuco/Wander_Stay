(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

window.addEventListener("DOMContentLoaded", () => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
      document.body.classList.add("dark-mode");
      const toggleBtn = document.getElementById("darkToggle");
      if (toggleBtn) toggleBtn.textContent = "☀️ Light Mode";
    }
    
    // Mobile-specific enhancements
    initializeMobileEnhancements();
});

// Toggle and persist dark mode
document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "darkToggle") {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      e.target.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
});

// Mobile-specific enhancements
function initializeMobileEnhancements() {
    // Auto-hide navbar on scroll for mobile
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (window.innerWidth <= 768 && navbar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Improve touch interactions for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Enhance form inputs for mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Prevent zoom on iOS when focusing on inputs
        if (input.type !== 'file') {
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            });
        }
    });
    
    // Improve dropdown behavior on mobile
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = this.nextElementSibling;
                if (menu.classList.contains('show')) {
                    menu.classList.remove('show');
                } else {
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                        menu.classList.remove('show');
                    });
                    menu.classList.add('show');
                }
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
    
    // Add loading states for buttons on mobile
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;
                
                // Reset after a delay (in case of form validation errors)
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 3000);
            }
        });
    });
    
    // Improve search functionality on mobile
    const searchForm = document.querySelector('form[action="/listings"]');
    if (searchForm && window.innerWidth <= 768) {
        const searchInput = searchForm.querySelector('input[name="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                // Add visual feedback for search
                if (this.value.length > 0) {
                    this.style.borderColor = '#007bff';
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    }
    
    // Add swipe gestures for category buttons on mobile
    const categoryContainer = document.querySelector('.d-flex.justify-content-center.flex-wrap');
    if (categoryContainer && window.innerWidth <= 768) {
        let startX = 0;
        let scrollLeft = 0;
        
        categoryContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX - categoryContainer.offsetLeft;
            scrollLeft = categoryContainer.scrollLeft;
        });
        
        categoryContainer.addEventListener('touchmove', function(e) {
            if (!startX) return;
            const x = e.touches[0].pageX - categoryContainer.offsetLeft;
            const walk = (x - startX) * 2;
            categoryContainer.scrollLeft = scrollLeft - walk;
        });
        
        categoryContainer.addEventListener('touchend', function() {
            startX = 0;
        });
    }
}

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // Reinitialize mobile enhancements after orientation change
        initializeMobileEnhancements();
    }, 100);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initializeMobileEnhancements();
    }, 250);
});
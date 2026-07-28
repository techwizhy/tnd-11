// =============================================
    // Form Validation & Submission Handler
    // =============================================
    (function() {
      const form = document.getElementById('enrollment-form');
      const feedback = document.getElementById('form-feedback');
      const mobileInput = document.getElementById('mobile-number');
      const mobileError = document.getElementById('mobile-error');
      const mobileErrorText = document.getElementById('mobile-error-text');

      // Invalid mobile number patterns
      const INVALID_MOBILES = [
        '0000000000', '1111111111', '2222222222', '3333333333',
        '4444444444', '5555555555', '6666666666', '7777777777',
        '8888888888', '9999999999',
        '0123456789', '1234567890', '9876543210'
      ];

      function validateMobile(val) {
        val = val.trim();
        if (!val) {
          return { valid: false, msg: 'Mobile number is required.' };
        }
        if (!/^\d{10}$/.test(val)) {
          return { valid: false, msg: 'Please enter a valid 10-digit mobile number.' };
        }
        if (INVALID_MOBILES.includes(val)) {
          return { valid: false, msg: 'Please enter a genuine 10-digit mobile number.' };
        }
        if (/^(\d)\1{9}$/.test(val)) {
          return { valid: false, msg: 'Repeated digits are not allowed.' };
        }
        return { valid: true, msg: '' };
      }

      if (mobileInput) {
        mobileInput.addEventListener('input', function() {
          this.value = this.value.replace(/\D/g, '').slice(0, 10);
          if (mobileError && mobileError.classList.contains('visible')) {
            const result = validateMobile(this.value);
            if (result.valid) {
              mobileError.classList.remove('visible');
              this.style.borderColor = '';
            }
          }
        });
      }

      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();

          // Mobile validation
          const mobileVal = mobileInput ? mobileInput.value : '';
          const mobileResult = validateMobile(mobileVal);
          if (!mobileResult.valid) {
            mobileError.classList.add('visible');
            mobileErrorText.textContent = mobileResult.msg;
            if (mobileInput) {
              mobileInput.style.borderColor = '#c0392b';
              mobileInput.focus();
            }
            return;
          }

          // PIN code validation
          const pincode = document.getElementById('pincode');
          if (pincode && pincode.value.length !== 6) {
            pincode.focus();
            return;
          }

          // Age validation
          const age = document.getElementById('age');
          if (age) {
            const ageVal = parseInt(age.value, 10);
            if (isNaN(ageVal) || ageVal < 18 || ageVal > 99) {
              age.focus();
              return;
            }
          }

          // Check native validity for required fields
          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }

          // Success
          feedback.style.display = 'block';
          form.reset();
          mobileError.classList.remove('visible');
          if (mobileInput) mobileInput.style.borderColor = '';

          setTimeout(function() {
            feedback.style.display = 'none';
          }, 6000);
        });
      }
    })();

    // =============================================
    // Floating Gold Dust Particles Simulation
    // =============================================
    (function() {
      const canvas = document.getElementById('gold-dust-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 30;
        
        const resizeCanvas = () => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
          constructor() {
            this.reset(true);
          }
          
          reset(init = false) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height : canvas.height + 15;
            this.size = Math.random() * 2 + 0.6;
            this.speedY = Math.random() * 0.35 + 0.15;
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.maxLife = Math.random() * 350 + 200;
            this.life = init ? Math.random() * this.maxLife : this.maxLife;
            this.opacity = 0;
          }
          
          update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.life--;
            
            if (this.life > this.maxLife * 0.85) {
              this.opacity = (this.maxLife - this.life) / (this.maxLife * 0.15);
            } else if (this.life < this.maxLife * 0.25) {
              this.opacity = this.life / (this.maxLife * 0.25);
            } else {
              this.opacity = 1;
            }
            
            if (this.life <= 0 || this.y < -10 || this.x < 0 || this.x > canvas.width) {
              this.reset(false);
            }
          }
          
          draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (document.body.classList.contains('light-theme')) {
              ctx.fillStyle = `rgba(180, 83, 9, ${this.opacity * 0.25})`;
            } else {
              ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.2})`;
            }
            ctx.fill();
          }
        }
        
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
        
        const drawLoop = () => {
          if (document.hidden) {
            requestAnimationFrame(drawLoop);
            return;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(p => {
            p.update();
            p.draw();
          });
          requestAnimationFrame(drawLoop);
        };
        
        requestAnimationFrame(drawLoop);
      }

      // FAQ Accordion Toggle JS (Single active item at a time)
      const faqHeaders = document.querySelectorAll('.faq-section .accordion-header');
      faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const item = header.parentElement;
          const content = item.querySelector('.accordion-content');
          const isActive = item.classList.contains('active');
          
          // Close all other items
          document.querySelectorAll('.faq-section .accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherHeader = otherItem.querySelector('.accordion-header');
              const otherContent = otherItem.querySelector('.accordion-content');
              if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
              if (otherContent) otherContent.style.maxHeight = '0';
            }
          });
          
          // Toggle active state on clicked item
          if (isActive) {
            item.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0';
          } else {
            item.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = `${content.scrollHeight}px`;
          }
        });
      });

      // ── Timeline items stagger reveal (IntersectionObserver) ──
      const timelineItems = document.querySelectorAll('.timeline-item-new');
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(timelineItems).indexOf(entry.target);
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateX(0)';
            }, index * 150);
            timelineObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
      });
    })();

    // =============================================
    // GSAP Greensign-5 Scroll Fan Animation
    // =============================================
    window.addEventListener("load", function() {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        let lenis;
        if (typeof Lenis !== 'undefined') {
          lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            infinite: false,
            gestureOrientation: "vertical"
          });

          lenis.on("scroll", ScrollTrigger.update);

          gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });

          gsap.ticker.lagSmoothing(500, 33);
        }

        let mm = gsap.matchMedia();

        // DESKTOP: 5-Card Fan Expansion Scroll Animation
        mm.add("(min-width: 768px)", () => {
          const section = document.querySelector(".why-choose-section.greensign-5");
          if (section) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=20%",
                scrub: 0.8,
                pin: true,
                anticipatePin: 1
              }
            });

            const farLeftCard = section.querySelectorAll(".card-far-left .our-edge-card");
            const leftCard = section.querySelectorAll(".card-left .our-edge-card");
            const middleCard = section.querySelectorAll(".card-middle .our-edge-card");
            const rightCard = section.querySelectorAll(".card-right .our-edge-card");
            const farRightCard = section.querySelectorAll(".card-far-right .our-edge-card");

            // 1. FAR LEFT CARD
            tl.fromTo(farLeftCard, { xPercent: 210 }, { xPercent: 0, duration: 0.9, ease: "none" }, 0);
            tl.fromTo(farLeftCard, { rotation: -14 }, { rotation: -14, duration: 0.9, ease: "none" }, 0);
            tl.to(farLeftCard, { rotation: 0, duration: 0.1, ease: "none" }, 0.9);

            // 2. LEFT CARD
            tl.fromTo(leftCard, { xPercent: 105 }, { xPercent: 0, duration: 0.9, ease: "none" }, 0);
            tl.fromTo(leftCard, { rotation: -7 }, { rotation: -7, duration: 0.9, ease: "none" }, 0);
            tl.to(leftCard, { rotation: 0, duration: 0.1, ease: "none" }, 0.9);

            // 3. MIDDLE CARD
            tl.fromTo(middleCard, { rotation: 1 }, { rotation: 1, duration: 0.9, ease: "none" }, 0);
            tl.to(middleCard, { rotation: 0, duration: 0.1, ease: "none" }, 0.9);

            // 4. RIGHT CARD
            tl.fromTo(rightCard, { xPercent: -105 }, { xPercent: 0, duration: 0.9, ease: "none" }, 0);
            tl.fromTo(rightCard, { rotation: 7 }, { rotation: 7, duration: 0.9, ease: "none" }, 0);
            tl.to(rightCard, { rotation: 0, duration: 0.1, ease: "none" }, 0.9);

            // 5. FAR RIGHT CARD
            tl.fromTo(farRightCard, { xPercent: -210 }, { xPercent: 0, duration: 0.9, ease: "none" }, 0);
            tl.fromTo(farRightCard, { rotation: 14 }, { rotation: 14, duration: 0.9, ease: "none" }, 0);
            tl.to(farRightCard, { rotation: 0, duration: 0.1, ease: "none" }, 0.9);

            gsap.set([farLeftCard, leftCard, middleCard, rightCard, farRightCard], {
              transformOrigin: "center 85%"
            });
          }
        });

        // MOBILE & TABLET: Vertical stack staggered fade-in
        mm.add("(max-width: 767px)", () => {
          const grid = document.querySelector(".greensign-5 .our-edge-grid");
          if (grid) {
            const cards = grid.querySelectorAll(".our-edge-card");
            gsap.from(cards, {
              opacity: 0,
              y: 45,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: grid,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            });
          }
        });
      }
    });

    /* 3D Footer Cards Rubber Tilt Effect */
    function initFooter3dCardTilt() {
      const cards = document.querySelectorAll('.footer-journey-box, .footer-contact-box, .footer-flag-card-inner');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const px = (x / rect.width) - 0.5;
          const py = (y / rect.height) - 0.5;
          
          // Much larger tilt and translate coefficients for a highly flexible rubber feel
          const rotateY = px * 38;
          const rotateX = -py * 38;
          const translateX = px * 25;
          const translateY = py * 25;
          
          const isDark = document.documentElement.classList.contains('dark-theme');
          const activeShadow = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(15, 58, 52, 0.16)';
          
          card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate(${translateX}px, ${translateY}px) scale(1.05)`;
          card.style.boxShadow = `0 35px 75px ${activeShadow}, 0 0 45px rgba(212, 175, 55, 0.35)`;
          card.style.borderColor = `rgba(212, 175, 55, 0.65)`;
          card.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out, border-color 0.2s ease';
        });
        
        card.addEventListener('mouseleave', () => {
          // Revert styles to trigger clean fallback to CSS idle styles
          card.style.transform = '';
          card.style.boxShadow = '';
          card.style.borderColor = '';
          card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.6s ease';
        });
      });
    }

    /* 3D Popout Cards Tilt Effect (replicated from home.html) */
    function initPopout3dCardTilt() {
      const cards = document.querySelectorAll('.popout-card');
      cards.forEach(card => {
        const bg = card.querySelector('.popout-card-bg');
        const info = card.querySelector('.popout-card-info');
        
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const px = (x / rect.width) - 0.5;
          const py = (y / rect.height) - 0.5;
          
          const rotateY = px * 12;
          const rotateX = -py * 12;
          
          const isDark = document.documentElement.classList.contains('dark-theme');
          const activeBgShadow = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(15, 58, 52, 0.12)';
          
          card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
          card.style.transition = 'transform 0.1s ease-out';
          
          if (bg) {
            bg.style.boxShadow = `0 35px 70px ${activeBgShadow}, 0 0 40px rgba(212, 164, 55, 0.35)`;
            bg.style.borderColor = `rgba(212, 164, 55, 0.45)`;
            bg.style.transition = 'box-shadow 0.1s ease-out, border-color 0.3s ease';
          }
          
          if (info) {
            info.style.boxShadow = `0 15px 30px rgba(0, 0, 0, 0.12), 0 0 20px rgba(212, 164, 55, 0.15)`;
            info.style.transition = 'box-shadow 0.1s ease-out';
          }
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
          card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          
          if (bg) {
            bg.style.boxShadow = '';
            bg.style.borderColor = '';
            bg.style.transition = 'box-shadow 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.8s ease';
          }
          
          if (info) {
            info.style.boxShadow = '';
            info.style.transition = 'box-shadow 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          }
        });
      });
    }

    // Initialize 3D tilt effects
    function initAll3dTilts() {
      initFooter3dCardTilt();
      initPopout3dCardTilt();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll3dTilts);
    } else {
      initAll3dTilts();
    }

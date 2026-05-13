import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/*
 * useNexora() — single hook that powers ALL 10 premium animations.
 * Call once in App.jsx. It auto-detects elements by CSS class.
 *
 * Classes it watches:
 *   .text-reveal        → wraps words, staggers reveal on scroll
 *   .line-draw           → horizontal line draw on scroll
 *   .counter-value[data-target]  → odometer count-up
 *   .parallax-img        → scroll-linked translateY
 *   .stagger-item        → fade-in from left, staggered
 *   .nexora-cursor       → magnetic cursor (auto-created)
 */

export default function useNexora() {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorPos = useRef({ x: -100, y: -100 });
  const cursorTarget = useRef({ x: -100, y: -100 });

  useEffect(() => {
    /* ═══ 3. LENIS SMOOTH SCROLL ═══ */
    if (window.location.pathname.startsWith('/admin')) return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    /* ═══ INTERSECTION OBSERVER (shared) ═══ */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;

        const el = e.target;

        // 1. Text Reveal
        if (el.classList.contains('text-reveal') && !el.dataset.revealed) {
          el.dataset.revealed = '1';
          const text = el.textContent;
          el.innerHTML = '';
          text.split(' ').forEach((word, i) => {
            const mask = document.createElement('span');
            mask.className = 'word-mask';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.textContent = word;
            mask.appendChild(inner);
            el.appendChild(mask);
            if (i < text.split(' ').length - 1) {
              el.appendChild(document.createTextNode(' '));
            }
            setTimeout(() => inner.classList.add('revealed'), i * 80);
          });
        }

        // 4. Line Draw
        if (el.classList.contains('line-draw')) {
          el.classList.add('drawn');
        }

        // 5. Counter Odometer
        if (el.classList.contains('counter-value') && !el.dataset.counted) {
          el.dataset.counted = '1';
          const target = parseInt(el.dataset.target, 10) || 0;
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quint
            const eased = 1 - Math.pow(1 - progress, 5);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }

        // 8. Stagger Items
        if (el.classList.contains('stagger-item') && !el.dataset.entered) {
          el.dataset.entered = '1';
          // Find siblings in same parent to stagger
          const parent = el.parentElement;
          const siblings = parent.querySelectorAll('.stagger-item:not(.entered)');
          siblings.forEach((sib, i) => {
            sib.dataset.entered = '1';
            setTimeout(() => sib.classList.add('entered'), i * 50);
          });
        }
      });
    }, { threshold: 0.15 });

    // Observe all relevant elements
    function observe() {
      document.querySelectorAll('.text-reveal, .line-draw, .counter-value[data-target], .stagger-item').forEach((el) => {
        io.observe(el);
      });
    }
    observe();

    // Re-observe on DOM changes (SPA navigation)
    const mo = new MutationObserver(() => {
      observe();
      setupParallax();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    /* ═══ 6. PARALLAX DRIFT ═══ */
    function setupParallax() {
      const parallaxEls = document.querySelectorAll('.parallax-img');
      if (!parallaxEls.length) return;

      function onScroll() {
        parallaxEls.forEach((img) => {
          const rect = img.parentElement.getBoundingClientRect();
          const viewH = window.innerHeight;
          if (rect.bottom < 0 || rect.top > viewH) return;
          const center = (rect.top + rect.height / 2 - viewH / 2) / viewH;
          img.style.transform = `translateY(${center * -60}px)`;
        });
      }

      lenis.on('scroll', onScroll);
    }
    setupParallax();

    /* ═══ 2. MAGNETIC CURSOR ═══ */
    if (window.matchMedia('(hover: hover)').matches) {
      const cursor = document.createElement('div');
      cursor.className = 'nexora-cursor';
      document.body.appendChild(cursor);
      cursorRef.current = cursor;

      function onMouseMove(e) {
        cursorTarget.current = { x: e.clientX, y: e.clientY };
      }

      function onMouseEnterMagnetic(e) {
        cursor.classList.add('hovering');
      }
      function onMouseLeaveMagnetic() {
        cursor.classList.remove('hovering');
      }

      // Lerp animation
      function animateCursor() {
        const lerp = 0.15;
        cursorPos.current.x += (cursorTarget.current.x - cursorPos.current.x) * lerp;
        cursorPos.current.y += (cursorTarget.current.y - cursorPos.current.y) * lerp;
        cursor.style.left = cursorPos.current.x + 'px';
        cursor.style.top = cursorPos.current.y + 'px';
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      document.addEventListener('mousemove', onMouseMove);

      // Attach magnetic effect to interactive elements
      function attachMagnetic() {
        document.querySelectorAll('a, button, .glass-btn, .nav-link, .contact-btn, .service-card, .glass-card').forEach((el) => {
          if (!el.dataset.magnetic) {
            el.dataset.magnetic = '1';
            el.addEventListener('mouseenter', onMouseEnterMagnetic);
            el.addEventListener('mouseleave', onMouseLeaveMagnetic);
          }
        });
      }
      attachMagnetic();

      // Re-attach on DOM changes
      const magneticMo = new MutationObserver(attachMagnetic);
      magneticMo.observe(document.body, { childList: true, subtree: true });
    }

    /* ═══ CLEANUP ═══ */
    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      io.disconnect();
      mo.disconnect();
      if (cursorRef.current) {
        cursorRef.current.remove();
      }
    };
  }, []);

  return lenisRef;
}

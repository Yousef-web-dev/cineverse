import Lenis from 'lenis';

let lenisInstance = null;

export const initSmoothScroll = () => {
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenisInstance = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
};

// عشان أي component تاني (زي ScrollToTop) يقدر يوصل لنفس الـ lenis instance
export const getLenis = () => lenisInstance;
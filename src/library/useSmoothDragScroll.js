export const initDragScroll = (lenisInstance) => {
  let isMouseDown = false;
  let startY = 0;
  let scrollStart = 0;

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('a, button, input, textarea')) return;

    isMouseDown = true;
    startY = e.pageY;
    scrollStart = window.scrollY;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const onMouseUp = () => {
    isMouseDown = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const dy = e.pageY - startY;

    if (lenisInstance) {
      lenisInstance.scrollTo(scrollStart - dy * 1.2, { immediate: false });
    } else {
      window.scrollTo(0, scrollStart - dy * 1.2);
    }
  };

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);

  return () => {
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
  };
};
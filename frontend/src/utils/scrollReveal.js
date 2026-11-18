export function observeScrollReveals(root, selector) {
  if (!root) return () => {};

  const elements = Array.from(root.querySelectorAll(selector)).filter(
    (element) => !element.classList.contains('active')
  );
  elements.forEach((element, index) => {
    element.classList.add('reveal');
    if (!element.style.getPropertyValue('--delay')) {
      element.style.setProperty('--delay', `${index * 120}ms`);
    }
  });

  if (typeof IntersectionObserver === 'undefined') {
    elements.forEach((element) => element.classList.add('active'));
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

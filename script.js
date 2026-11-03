const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--scroll', `${total > 0 ? (window.scrollY / total) * 100 : 0}%`);
}, { passive: true });

window.addEventListener('pointermove', event => {
  document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(element => {
    element.addEventListener('pointermove', event => {
      const bounds = element.getBoundingClientRect();
      const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
      const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -5;
      element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}

const timeNode = document.querySelector('#local-time');
const yearNode = document.querySelector('#year');

function updateTime() {
  const now = new Date();
  timeNode.textContent = `NPT · ${new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(now)}`;
  yearNode.textContent = now.getFullYear();
}

updateTime();
setInterval(updateTime, 60000);

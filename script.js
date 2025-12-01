// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme){
  if(theme === 'dark'){
    root.setAttribute('data-theme','dark');
    themeToggle.setAttribute('aria-pressed','true');
  } else {
    root.removeAttribute('data-theme');
    themeToggle.setAttribute('aria-pressed','false');
  }
}
themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  setTheme(isDark ? 'light' : 'dark');
});

// Progress circles animation
function animateCircles(){
  const circles = document.querySelectorAll('.circle');
  circles.forEach(circle => {
    const svg = circle.querySelector('.progress-ring');
    const progress = svg.querySelector('.progress');
    const percentText = svg.querySelector('.percent');
    const value = Number(circle.dataset.value || 0); // 0-100
    const color = circle.dataset.color || getComputedStyle(document.documentElement).getPropertyValue('--accent');

    // stroke length calculations for circle path based on viewBox radius
    const radius = 15.9155; // chosen in path data
    const circumference = 2 * Math.PI * radius;

    progress.style.strokeDasharray = `${circumference} ${circumference}`;
    progress.style.strokeDashoffset = `${circumference}`;

    // Animate from 0 -> value
    let start = null;
    const duration = 1200 + (value * 6); // slight scaling
    function step(ts){
      if(!start) start = ts;
      const elapsed = ts - start;
      const progressPct = Math.min(1, elapsed / duration);
      const current = Math.round(progressPct * value);
      const offset = circumference - (current / 100) * circumference;
      progress.style.strokeDashoffset = offset;
      percentText.textContent = `${current}%`;
      // update stroke color according to dataset but not full opacity
      progress.style.stroke = color;
      if(progressPct < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // Hover effect: change color when mouse over
    circle.addEventListener('mouseenter', () => {
      // compute hover color (lighten) or use a set color
      progress.style.stroke = shadeColor(color, -12);
    });
    circle.addEventListener('mouseleave', () => {
      progress.style.stroke = color;
    });
  });
}

// small utility to lighten/darken hex color
function shadeColor(hex, percent) {
  try {
    let c = hex.replace('#','');
    if(c.length === 3) c = c.split('').map(ch => ch+ch).join('');
    const num = parseInt(c,16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);
    return '#' + ( (1<<24) + (r<<16) + (g<<8) + b ).toString(16).slice(1);
  } catch(e){
    return hex;
  }
}

// Timeline hover interactions
function setupTimeline(){
  const items = document.querySelectorAll('.tl-item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // add hovered class to this, remove from others
      items.forEach(i => i.classList.remove('hovered'));
      item.classList.add('hovered');

      // optionally show year/title elsewhere or change text color
      const year = item.dataset.year;
      const title = item.dataset.title;
      // For example, we could show them in the header (not implemented by default)
      // console.log(year, title);
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('hovered');
    });
  });
}

// Initialize all when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // run animations
  animateCircles();
  setupTimeline();
});

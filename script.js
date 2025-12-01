// Animate skills progress rings
document.querySelectorAll('.circle').forEach(circle => {
  const value = circle.dataset.value;
  const progress = circle.querySelector('.progress');
  const percentText = circle.querySelector('.percent');
  let current = 0;

  const animate = setInterval(() => {
    if(current >= value){
      clearInterval(animate);
    } else {
      current++;
      const offset = 100 - current;
      progress.style.strokeDasharray = `${current} ${100-current}`;
      percentText.textContent = current + '%';
    }
  }, 20);
});

// Timeline hover effect
document.querySelectorAll('.tl-item').forEach(item => {
  item.addEventListener('mouseenter', () => item.classList.add('hovered'));
  item.addEventListener('mouseleave', () => item.classList.remove('hovered'));
});

// Download PDF
document.getElementById("downloadCvBtn").addEventListener("click", () => {
  const cv = document.getElementById("cvCard");
  html2pdf()
    .from(cv)
    .set({ margin: 10, filename: 'CV.pdf', html2canvas: { scale: 2 } })
    .save();
});

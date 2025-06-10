const gatherButtons = document.querySelectorAll('.gatherButton');
gatherButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    spawnFloatingText(e.clientX, e.clientY);
  });
});

function spawnFloatingText(startX,startY){
  const el=document.createElement('span'); 
  el.className='floating-text'; 
  el.textContent='+1'; 
  document.body.appendChild(el);
  el.style.left=`${startX}px`; 
  el.style.top=`${startY}px`; 
  el.style.opacity='1';
  const angle=Math.random()*2*Math.PI; 
  const vx=Math.cos(angle)*80; 
  const vy=Math.sin(angle)*80;
  const duration=1000; 
  let start;
  function animate(ts){ 
    if(!start)start=ts; 
    const t=Math.min((ts-start)/duration,1); 
    el.style.left=`${startX+vx*t}px`; 
    el.style.top=`${startY+vy*t}px`; 
    el.style.opacity=`${1-t}`; 
    if(t<1) requestAnimationFrame(animate); else el.remove(); 
  }
  requestAnimationFrame(animate);
}

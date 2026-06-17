'use strict';
// TOB OS v19 Motion Engine: transform/opacity-only animation helpers for low-memory devices.
window.TOB_Motion = {
  spring({from=0,to=1,stiffness=0.14,damping=0.78,onUpdate,onComplete}){
    let x=from,v=0,done=0;
    const step=()=>{
      v += (to-x)*stiffness;
      v *= damping;
      x += v;
      onUpdate && onUpdate(x);
      if(Math.abs(to-x)<0.001 && Math.abs(v)<0.001) done++; else done=0;
      if(done<3) requestAnimationFrame(step); else { onUpdate&&onUpdate(to); onComplete&&onComplete(); }
    };
    requestAnimationFrame(step);
  },
  animateWindowLaunch(el, rect){
    const target=el.getBoundingClientRect();
    const sx=Math.max(.08, rect.width/Math.max(target.width,1));
    const sy=Math.max(.08, rect.height/Math.max(target.height,1));
    const dx=(rect.left+rect.width/2)-(target.left+target.width/2);
    const dy=(rect.top+rect.height/2)-(target.top+target.height/2);
    el.style.transformOrigin='center center';
    el.style.opacity='0';
    this.spring({from:0,to:1,stiffness:.18,damping:.72,onUpdate:p=>{
      const inv=1-p;
      el.style.transform=`translate3d(${dx*inv}px,${dy*inv}px,0) scale(${sx+(1-sx)*p},${sy+(1-sy)*p})`;
      el.style.opacity=String(p);
    },onComplete:()=>{el.style.transform='';el.style.opacity='';el.style.willChange='';}});
  },
  bootReady(){
    const boot=document.getElementById('boot');
    if(!boot) return;
    boot.style.willChange='opacity,transform';
    requestAnimationFrame(()=>requestAnimationFrame(()=>boot.classList.add('fade')));
  },
  setIslandState(state){
    document.getElementById('dynamic-island-container')?.setAttribute('data-ai-state',state);
  }
};

(() => {
  const intro = document.getElementById("intro");
  const startButton = document.getElementById("startButton");
  const countdownEl = document.getElementById("countdown");
  const fireworks = document.getElementById("fireworks");
  let count = 10;

  startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    countdownEl.classList.remove("hidden");
    startCountdown();
  });

  function startCountdown() {
    const interval = setInterval(() => {
      count--;
      countdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(interval);
        document.body.classList.add("rose");
        intro.style.opacity = "0";
        setTimeout(() => {
          intro.style.display = "none";
          fireworks.classList.remove("hidden");
          fireworks.classList.add("visible");
          startFireworks();
        }, 2500);
      }
    }, 1000);
  }

  /* ---------------------- FEU D’ARTIFICE ROSE DOUX ---------------------- */
function startFireworks() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  function resizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr,dpr);
    w = window.innerWidth;
    h = window.innerHeight;
  }
  let w = window.innerWidth, h = window.innerHeight;
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const GRAVITY = 0.07;
  const FRICTION = 0.98;
  const PARTICLE_COUNT = 150;
  const COLORS = ['#ac46a1','#ff66cc','#6411ad','#ffb3e6','#e60073','#c71585','#ff5aa5', '#ff99cc'];

  function rand(min,max){ return Math.random()*(max-min)+min; }
  function randInt(min,max){ return Math.floor(rand(min,max+1)); }

  class Particle {
    constructor(x,y,color,angle,speed,fade){
      this.x=x; this.y=y;
      this.vx=Math.cos(angle)*speed;
      this.vy=Math.sin(angle)*speed;
      this.alpha=1;
      this.size=rand(2,4);
      this.color=color;
      this.fade=fade;
      this.trail=[];
    }
    update(){
      this.trail.push({x:this.x,y:this.y});
      if(this.trail.length>5) this.trail.shift();
      this.vx*=FRICTION;
      this.vy*=FRICTION;
      this.vy+=GRAVITY;
      this.x+=this.vx;
      this.y+=this.vy;
      this.alpha-=this.fade;
    }
    draw(){
      ctx.globalAlpha=Math.max(this.alpha,0);
      ctx.fillStyle=this.color;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();
      ctx.globalAlpha=1;
      // optionnel: traînée nette
      if(this.trail.length>1){
        ctx.strokeStyle=this.color;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x,this.trail[0].y);
        for(let i=1;i<this.trail.length;i++) ctx.lineTo(this.trail[i].x,this.trail[i].y);
        ctx.stroke();
      }
    }
  }

  const particles=[];

  function createExplosion(x,y){
    for(let i=0;i<PARTICLE_COUNT;i++){
      const angle=rand(0,Math.PI*2);
      const speed=rand(2,6);
      const fade=rand(0.01,0.02);
      const color=COLORS[randInt(0,COLORS.length-1)];
      particles.push(new Particle(x,y,color,angle,speed,fade));
    }
  }

  let lastExplosion=0;
  function loop(){
    // Effacer doucement, mais pas trop pour garder net
    ctx.fillStyle='rgba(255,77,154,0.1)';
    ctx.fillRect(0,0,w,h);

    const now=Date.now();
    if(now-lastExplosion>rand(1000,2000)){
      lastExplosion=now;
      createExplosion(rand(100,w-100),rand(50,h/2));
    }

    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.update();
      p.draw();
      if(p.alpha<=0) particles.splice(i,1);
    }

    requestAnimationFrame(loop);
  }

  loop();
}
})();
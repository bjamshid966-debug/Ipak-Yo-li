// Ma'lumotlar
const cities=[
{n:"Xiva",t:"Ichan-Qala, sahroning durdonasi",x:.06,p:"Xorazm vohasining poytaxti. Devor bilan o'ralgan eski shahar karvonlarning g'arbiy darvozasi bo'lgan.",f:["Kalta Minor minorasi moviy koshinlar bilan qoplangan","Ichan-Qala jahon merosi ro'yxatida"]},
{n:"Buxoro",t:"Gumbazli savdo shahri",x:.28,p:"Bozor gumbazlari ostida zargarlar, tangachilar va gilamchilar bir-biriga qo'shni o'tirgan.",f:["Poyi Kalon majmuasi","Ark qal'asi ming yildan ortiq tarixga ega"]},
{n:"Samarqand",t:"Sharq gavhari",x:.52,p:"Afrosiyobdan Temuriylar davrigacha. Registon maydoni uch madrasa bilan karvonlarni kutib olgan.",f:["Registon, Go'ri Amir, Shohi Zinda","Ulug'bek rasadxonasi XV asrda qurilgan"]},
{n:"Shahrisabz",t:"Amir Temur tug'ilgan shahar",x:.74,p:"Oqsaroy saroyining ulkan peshtoqi hamon osmonga ko'tarilib turadi.",f:["Oqsaroy qurilishi 1380-yilda boshlangan","Dorus-Siyodat va Dorut-Tilovat majmualari"]},
{n:"Toshkent",t:"Chochdan hozirgi poytaxtgacha",x:.94,p:"Sharqqa ketayotgan yo'llar Toshkent vohasida birlashgan. Bu yerda Chor-Su bozori hanuz gavjum.",f:["Kukaldosh madrasasi","Hast-Imom majmuasi, qadimiy Qur'on nusxasi bilan"]}
];
const $=s=>document.querySelector(s);
const nodes=$('#nodes'),camel=$('#camel'),panel=$('#panel'),path=$('#path'),line=$('#line');
function pt(f){const L=path.getTotalLength(),p=path.getPointAtLength(L*f);const vb=1000,h=120;
 return{x:p.x/vb*line.clientWidth,y:p.y/h*line.clientHeight}}
function show(i){
 const c=cities[i];
 $('#pName').textContent=c.n;$('#pTag').textContent=c.t;$('#pText').textContent=c.p;
 $('#pFacts').innerHTML=c.f.map(x=>`<li>${x}</li>`).join('');
 panel.classList.remove('swap');void panel.offsetWidth;panel.classList.add('swap');
 [...nodes.children].forEach((b,j)=>b.classList.toggle('on',j===i));
 const q=pt(c.x);camel.style.left=q.x+'px';camel.style.top=q.y+'px';
 if(audioOn)blip(300+i*90);
}
function build(){
 nodes.innerHTML='';
 cities.forEach((c,i)=>{const q=pt(c.x),b=document.createElement('button');
  b.style.left=q.x+'px';b.style.top=q.y+'px';b.setAttribute('aria-label',c.n);
  b.innerHTML=`<span>${c.n}</span>`;b.onclick=()=>show(i);nodes.appendChild(b)});
}
let cur=2;
build();show(cur);
addEventListener('resize',()=>{build();show(cur)});
nodes.addEventListener('click',e=>{const b=e.target.closest('button');if(b)cur=[...nodes.children].indexOf(b)});

// Progress + reveal
addEventListener('scroll',()=>{const h=document.documentElement;
 $('#progress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});
document.querySelectorAll('.tl li,.craft,.panel,h2').forEach(e=>e.classList.add('reveal'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));

// Audio (Web Audio) — pentatonik tovush
let ac,audioOn=false;
function blip(f){if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();
 o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.12,ac.currentTime);
 g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+1.2);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+1.2)}
$('#sound').onclick=e=>{audioOn=!audioOn;e.target.setAttribute('aria-pressed',audioOn);
 if(audioOn&&!ac)ac=new (window.AudioContext||window.webkitAudioContext)();blip(440)};

// Canvas: sakkiz qirrali yulduzlar + karvon zarralari
const cv=$('#stars'),ctx=cv.getContext('2d');
let W,H,mx=-999,my=-999,dpr=Math.min(devicePixelRatio||1,2);
const S=96,parts=Array.from({length:70},()=>({t:Math.random(),s:.0002+Math.random()*.0004,o:Math.random()*40-20,r:Math.random()*1.6+.6}));
function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
size();addEventListener('resize',size);
$('#top').addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
function star(x,y,r,a){ctx.beginPath();for(let k=0;k<2;k++){const o=a+k*Math.PI/4;
 for(let i=0;i<4;i++){const t=o+i*Math.PI/2,px=x+Math.cos(t)*r,py=y+Math.sin(t)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath()}ctx.stroke()}
function frame(now){
 ctx.clearRect(0,0,W,H);ctx.lineWidth=1;
 for(let y=S/2;y<H+S;y+=S)for(let x=S/2;x<W+S;x+=S){
  const d=Math.hypot(x-mx,y-my),k=Math.max(0,1-d/260),ang=Math.atan2(my-y,mx-x)*.25*k+now*.00006;
  ctx.strokeStyle=k>0?`rgba(${46+k*187|0},${196-k*16|0},${182-k*106|0},${.12+k*.7})`:'rgba(46,196,182,.12)';
  star(x,y,S*.34+k*S*.14,ang)}
 // karvon zarralari
 ctx.fillStyle='rgba(233,180,76,.85)';
 parts.forEach(p=>{p.t=(p.t+p.s*16)%1;const x=p.t*W,y=H*.78+Math.sin(p.t*6.28*1.5+p.o)*46+p.o;
  ctx.globalAlpha=Math.sin(p.t*Math.PI);ctx.beginPath();ctx.arc(x,y,p.r,0,6.3);ctx.fill()});
 ctx.globalAlpha=1;
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(frame)
}
requestAnimationFrame(frame);

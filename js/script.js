'use strict';

// Los ocho pétalos se pueden editar aquí sin tocar el resto del sitio.
const MENSAJES = [
  { icono:'🌻', nombre:'Tu sonrisa', titulo:'La sonrisa que ilumina mis días', texto:'Hoy te regalo esta flor amarilla por esa sonrisa tuya que tanto me encanta. Gracias por darle luz a mis días, ratoncita.' },
  { icono:'💛', nombre:'Tu cariño', titulo:'Tu forma tan bonita de querer', texto:'Esta flor es por tu cariño, tus pequeños detalles y esa manera tan tuya de hacerme sentir especial. Te amo, ratoncita.' },
  { icono:'📷', nombre:'Nuestros recuerdos', titulo:'Por todos nuestros momentos', texto:'Guardo nuestras risas, nuestras conversaciones y cada instante juntos. Desde el 19/04/2026 empezamos a escribir una historia que quiero cuidar mucho.' },
  { icono:'🐁', nombre:'Mi ratoncita', titulo:'Mi ratoncita querida', texto:'Una flor amarilla para mi ratoncita 🐁🫶🏻. Me encanta llamarte así, porque detrás de ese apodo hay tanto amor que a veces no sé cómo expresarlo.' },
  { icono:'💍', nombre:'Nuestro futuro', titulo:'Mi compañera y mi prometida', texto:'Gracias por ser mi compañera y mi prometida. Me ilusiona compartir nuestros sueños, celebrar cada paso y construir contigo muchos recuerdos más.' },
  { icono:'📚', nombre:'Educación Inicial', titulo:'Qué orgullo verte cumplir tus sueños', texto:'Estoy muy orgulloso de tu reciente ingreso a Educación Inicial, la carrera que te gusta. Tienes ternura, paciencia y una vocación muy especial. Quiero verte brillar.' },
  { icono:'✨', nombre:'Tus sueños', titulo:'Un jardín de posibilidades', texto:'Así como crecen estas flores, deseo que crezcan tus sueños. Que esta nueva etapa te regale aprendizajes, alegría y muchos motivos para sentirte orgullosa de ti.' },
  { icono:'❤️', nombre:'Te amo', titulo:'Hoy y todos los 21 de septiembre', texto:'Hoy, en el Día de las Flores Amarillas, quiero recordarte algo: te amo muchísimo, mi ratoncita. Estas flores son para ti, hoy y todos los días.' }
];
const $ = (selector, root=document) => root.querySelector(selector);
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const petalDialog=$('#petal-dialog');
const giftDialog=$('#gift-dialog');
const grid=$('#petals-grid');
const progress=$('#petals-progress');
const announcement=$('#announcement');
const discovered=new Set();
const storageKey='ratoncita-eileen-flores-21sep-v2';

function tell(message){announcement.textContent=message;}
function openDialog(dialog){ if(!dialog) return; if(typeof dialog.showModal==='function') dialog.showModal(); else dialog.setAttribute('open',''); }
function closeDialog(dialog){ if(!dialog) return; if(typeof dialog.close==='function') dialog.close(); else dialog.removeAttribute('open'); }
function save(){try{sessionStorage.setItem(storageKey,JSON.stringify([...discovered]));}catch{/* El sitio sigue funcionando sin almacenamiento. */}}
function restore(){try{const old=JSON.parse(sessionStorage.getItem(storageKey)||'[]');if(Array.isArray(old)) old.filter(i=>Number.isInteger(i)&&i>=0&&i<MENSAJES.length).forEach(i=>discovered.add(i));}catch{/* Se empieza desde cero cuando no hay datos válidos. */}}
function updateProgress(){
  progress.textContent=`${discovered.size} de ${MENSAJES.length} flores amarillas descubiertas ${discovered.size===MENSAJES.length?'❤️':'♡'}`;
  grid.querySelectorAll('.petal').forEach(button=>button.setAttribute('aria-pressed',String(discovered.has(Number(button.dataset.index)))));
}
function makePetals(){
  const fragment=document.createDocumentFragment();
  MENSAJES.forEach((data,index)=>{
    const button=document.createElement('button');button.type='button';button.className='petal';button.dataset.index=String(index);
    button.style.setProperty('--delay',`${index*.07}s`);
    button.setAttribute('aria-label',`Descubrir flor amarilla ${index+1}: ${data.nombre}`);
    const emoji=document.createElement('span');emoji.className='petal-icon';emoji.setAttribute('aria-hidden','true');emoji.textContent=data.icono;
    const name=document.createElement('span');name.className='petal-name';name.textContent=data.nombre;
    const hint=document.createElement('span');hint.className='petal-hint';hint.textContent='Descubre mi mensaje 💛';
    const flower=document.createElement('span');flower.className='sunflower-icon';flower.setAttribute('aria-hidden','true');
    for(let petal=0;petal<10;petal++){const piece=document.createElement('span');piece.className='sunflower-petal';piece.style.setProperty('--petal-index',String(petal));flower.append(piece);}
    const disk=document.createElement('span');disk.className='sunflower-disk';flower.append(disk);
    const label=document.createElement('span');label.className='petal-icon-badge';label.append(emoji);
    button.append(flower,label,name,hint);
    button.addEventListener('click',()=>{
      discovered.add(index);save();updateProgress();
      $('#petal-dialog-emoji').textContent=data.icono;
      $('#petal-dialog-title').textContent=data.titulo;
      $('#petal-dialog-body').textContent=data.texto;
      openDialog(petalDialog);tell(`Flor ${index+1} de ${MENSAJES.length}: ${data.titulo}`);makeHearts(8);
    });fragment.append(button);
  });grid.append(fragment);updateProgress();
}
function makeHearts(count=5){
  if(reduceMotion.matches||document.hidden)return;
  const root=$('#ambient-hearts');
  const frag=document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const heart=document.createElement('span');heart.className='heart-particle';heart.textContent=Math.random()>.74?'🌻':(Math.random()>.45?'✦':'♥');
    heart.style.setProperty('--x',`${Math.random()*100}%`);
    heart.style.setProperty('--size',`${11+Math.random()*18}px`);
    heart.style.setProperty('--drift',`${Math.random()*180-90}px`);
    heart.style.setProperty('--duration',`${8+Math.random()*7}s`);
    heart.addEventListener('animationend',()=>heart.remove(),{once:true});frag.append(heart);
  }root.append(frag);while(root.childElementCount>45)root.firstElementChild.remove();
}
function setupDialogs(){
  [petalDialog,giftDialog].forEach(dialog=>{
    dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>closeDialog(dialog)));
    dialog.addEventListener('click',event=>{
      const rect=dialog.getBoundingClientRect();
      if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))closeDialog(dialog);
    });
  });
  $('#open-gift').addEventListener('click',()=>{openDialog(giftDialog);makeHearts(13);});
}
function setupReveal(){
  const targets=document.querySelectorAll('.reveal');
  if(reduceMotion.matches||!('IntersectionObserver' in window)){targets.forEach(el=>el.classList.add('is-visible'));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.11,rootMargin:'0px 0px 20px 0px'});
  targets.forEach(el=>observer.observe(el));
}
function setupMusic(){
  const button=$('#music-button');const symbol=$('#music-symbol');const label=$('#music-label');
  // Música opcional: sustituye este archivo por una canción propia si deseas compartir sin Internet.
  const audio=new Audio('https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/AUDIO/Flores%20amarillas.mp3');
  audio.loop=true;audio.volume=.35;audio.preload='none';
  const refresh=()=>{const playing=!audio.paused;button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Pausar música':'Reproducir música');symbol.textContent=playing?'Ⅱ':'♫';label.textContent=playing?'Pausar':'Música';};
  button.addEventListener('click',async()=>{
    if(!audio.paused){audio.pause();refresh();return;}
    try{await audio.play();refresh();}catch{tell('No se pudo reproducir la canción. La dedicatoria funciona igualmente sin música.');refresh();}
  });
  audio.addEventListener('pause',refresh);audio.addEventListener('play',refresh);
  audio.addEventListener('error',()=>{tell('El audio externo no está disponible en este momento.');refresh();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&!audio.paused)audio.pause();});
  window.addEventListener('pagehide',()=>audio.pause());
  refresh();
}
function init(){restore();makePetals();setupDialogs();setupReveal();setupMusic();if(!reduceMotion.matches){makeHearts(12);window.setInterval(()=>makeHearts(4),6500);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

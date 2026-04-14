/* WikiRace — Shared JS */

/* ── LOGO SVG (consistent across all pages) ── */
function logoSVG(size){
  size = size || 40;
  return `<svg width="${size}" height="${size}" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="48" r="44" fill="#1a1612"/>
    <circle cx="48" cy="48" r="36" stroke="#3a3228" stroke-width="1.5"/>
    <ellipse cx="48" cy="48" rx="18" ry="36" stroke="#3a3228" stroke-width="1.5"/>
    <line x1="12" y1="48" x2="84" y2="48" stroke="#3a3228" stroke-width="1.5"/>
    <line x1="17" y1="32" x2="79" y2="32" stroke="#3a3228" stroke-width="1"/>
    <line x1="17" y1="64" x2="79" y2="64" stroke="#3a3228" stroke-width="1"/>
    <path d="M26 34 L32 56 L38 42 L44 56 L50 34" stroke="#6aaa64" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M52 48 L70 48" stroke="#c9b458" stroke-width="3" stroke-linecap="round"/>
    <polyline points="64,41 71,48 64,55" stroke="#c9b458" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="53" y1="43" x2="62" y2="43" stroke="#c9b458" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>
    <line x1="53" y1="53" x2="62" y2="53" stroke="#c9b458" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>
    <circle cx="48" cy="48" r="44" stroke="#538d4e" stroke-width="2" opacity=".4"/>
  </svg>`;
}

/* ── NAV ACTIVE STATE ── */
(function(){
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function(a){
    if(a.getAttribute('href') === page) a.classList.add('active');
  });
})();

/* ── DAILY PAIR (shared logic) ── */
var DAILY_PAIRS_SHARED=[
  {s:'Pulpo',e:'Adolf Hitler'},{s:'Gazpacho',e:'Agujero negro'},{s:'Flamenco',e:'Albert Einstein'},
  {s:'Paella',e:'Segunda Guerra Mundial'},{s:'Sangría',e:'Universo'},{s:'Bilbao',e:'Mecánica cuántica'},
  {s:'Don Quijote',e:'Big Bang'},{s:'Antoni Gaudí',e:'Revolución francesa'},
  {s:'Pelota vasca',e:'Darwin'},{s:'Jamón ibérico',e:'Napoleón Bonaparte'},
  {s:'Sagrada Familia',e:'Revolución industrial'},{s:'Córdoba',e:'Homo sapiens'},
  {s:'Toledo',e:'Primera Guerra Mundial'},{s:'Burgos',e:'Isaac Newton'}
];
function getDailyPairShared(){
  var d=new Date();
  return DAILY_PAIRS_SHARED[(d.getFullYear()*366+d.getMonth()*31+d.getDate())%DAILY_PAIRS_SHARED.length];
}
function getDayNumber(){
  var d=new Date(), start=new Date('2024-01-01');
  return Math.floor((d-start)/86400000)+1;
}
function getDateStr(){
  return new Date().toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

/* ── LEADERBOARD STORAGE ── */
var LS_KEY = 'wikirace_scores';
function saveScore(entry){
  var scores = getScores();
  entry.date = new Date().toISOString();
  scores.unshift(entry);
  if(scores.length > 200) scores = scores.slice(0,200);
  try{ localStorage.setItem(LS_KEY, JSON.stringify(scores)); }catch(e){}
}
function getScores(){
  try{ return JSON.parse(localStorage.getItem(LS_KEY)||'[]'); }catch(e){ return []; }
}
function getTopScores(n){
  return getScores().sort(function(a,b){return b.score-a.score;}).slice(0,n||20);
}
function getMyBest(){
  var s=getScores();
  if(!s.length) return null;
  return s.sort(function(a,b){return b.score-a.score;})[0];
}
function getTodayScores(){
  var today=new Date().toDateString();
  return getScores().filter(function(s){return new Date(s.date).toDateString()===today;}).sort(function(a,b){return b.score-a.score;});
}

/* ── NAV HAMBURGER (shared) ── */
function initNav(){
  var ham = document.querySelector('.nav-hamburger');
  var drawer = document.querySelector('.nav-drawer');
  var overlay = document.querySelector('.nav-overlay');
  if(!ham||!drawer) return;

  function openDrawer(){
    drawer.classList.add('open');
    if(overlay) overlay.classList.add('show');
    ham.innerHTML = '✕';
    document.body.style.overflow='hidden';
  }
  function closeDrawer(){
    drawer.classList.remove('open');
    if(overlay) overlay.classList.remove('show');
    ham.innerHTML = '☰';
    document.body.style.overflow='';
  }
  ham.addEventListener('click', function(){
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if(overlay) overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a,button').forEach(function(el){
    el.addEventListener('click', function(){ setTimeout(closeDrawer,80); });
  });
}
document.addEventListener('DOMContentLoaded', initNav);

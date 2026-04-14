/* WikiRace — Shared JS  v3 */

/* ── LOGO SVG ── */
function logoSVG(size){
  size = size || 40;
  /* Canonical WikiRace logo: dark circle, globe grid (subtle),
     W in Wordle-green, golden racing arrow with speed lines */
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">'
    /* Background */
    +'<circle cx="48" cy="48" r="46" fill="#18120c"/>'
    /* Globe meridians — subtle */
    +'<circle cx="48" cy="48" r="36" stroke="#2e2318" stroke-width="1.5"/>'
    +'<ellipse cx="48" cy="48" rx="16" ry="36" stroke="#2e2318" stroke-width="1.5"/>'
    +'<line x1="12" y1="48" x2="84" y2="48" stroke="#2e2318" stroke-width="1.5"/>'
    +'<line x1="18" y1="30" x2="78" y2="30" stroke="#2e2318" stroke-width="1"/>'
    +'<line x1="18" y1="66" x2="78" y2="66" stroke="#2e2318" stroke-width="1"/>'
    /* W — Wordle green, clean and bold */
    +'<path d="M24 32 L30 56 L38 40 L46 56 L52 32" stroke="#6aaa64" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    /* Racing arrow — golden */
    +'<path d="M56 48 L76 48" stroke="#c9b458" stroke-width="3.5" stroke-linecap="round"/>'
    +'<path d="M68 40 L76 48 L68 56" stroke="#c9b458" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    /* Speed lines */
    +'<line x1="56" y1="43" x2="65" y2="43" stroke="#c9b458" stroke-width="2" stroke-linecap="round" opacity=".45"/>'
    +'<line x1="56" y1="53" x2="65" y2="53" stroke="#c9b458" stroke-width="2" stroke-linecap="round" opacity=".45"/>'
    /* Green accent ring */
    +'<circle cx="48" cy="48" r="46" stroke="#538d4e" stroke-width="1.5" opacity=".35"/>'
    +'</svg>';
}

/* ── ARROW SVG (horizontal, for pair displays) ── */
function arrowSVG(size){
  size = size || 18;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" class="arrow-svg">'
    +'<path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    +'<path d="M15 8l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    +'</svg>';
}

/* ── DARK MODE (shared across ALL pages) ── */
var DM_KEY = 'wikirace_dark';

function isDark(){
  return document.body.classList.contains('dark');
}
function applyDark(on, save){
  document.body.classList.toggle('dark', on);
  /* update all dm toggles on the page */
  document.querySelectorAll('.nav-dark-toggle').forEach(function(btn){
    btn.innerHTML = on ? sunIcon() : moonIcon();
    btn.title = on ? 'Modo claro' : 'Modo oscuro';
  });
  document.querySelectorAll('.nav-drawer-dm').forEach(function(btn){
    btn.querySelector('.dm-label').textContent = on ? 'Modo claro' : 'Modo oscuro';
    btn.querySelector('.dm-icon').innerHTML = on ? sunIcon() : moonIcon();
  });
  if(save !== false) try{ localStorage.setItem(DM_KEY, on ? '1' : '0'); }catch(e){}
}
function toggleDark(){
  applyDark(!isDark(), true);
}
function initDarkMode(){
  var saved = null;
  try{ saved = localStorage.getItem(DM_KEY); }catch(e){}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
  applyDark(saved === '1' || (saved === null && prefersDark), false);
}

function moonIcon(){
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function sunIcon(){
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

/* ── DAILY PAIR ── */
var DAILY_PAIRS_SHARED=[
  {s:'Pulpo Paul',e:'Adolf Hitler'},{s:'Gazpacho',e:'Agujero negro'},{s:'Flamenco',e:'Albert Einstein'},
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

/* ── STORAGE ── */
var LS_KEY='wikirace_scores';
function saveScore(entry){
  var scores=getScores();entry.date=new Date().toISOString();scores.unshift(entry);
  if(scores.length>200)scores=scores.slice(0,200);
  try{localStorage.setItem(LS_KEY,JSON.stringify(scores));}catch(e){}
}
function getScores(){ try{return JSON.parse(localStorage.getItem(LS_KEY)||'[]');}catch(e){return [];} }
function getTopScores(n){ return getScores().sort(function(a,b){return b.score-a.score;}).slice(0,n||20); }
function getMyBest(){ var s=getScores();if(!s.length)return null;return s.sort(function(a,b){return b.score-a.score;})[0]; }
function getTodayScores(){
  var today=new Date().toDateString();
  return getScores().filter(function(s){return new Date(s.date).toDateString()===today;}).sort(function(a,b){return b.score-a.score;});
}

/* ── NAV INIT (hamburger + dark toggle + logo) ── */
function initNav(){
  /* inject logo into all .nav-logo spans */
  document.querySelectorAll('.nav-logo-icon').forEach(function(el){
    el.innerHTML = logoSVG(parseInt(el.getAttribute('data-size')) || 26);
  });

  /* inject dark toggle into .nav-dark-toggle buttons */
  var dark = isDark();
  document.querySelectorAll('.nav-dark-toggle').forEach(function(btn){
    btn.innerHTML = dark ? sunIcon() : moonIcon();
    btn.title = dark ? 'Modo claro' : 'Modo oscuro';
    btn.addEventListener('click', toggleDark);
  });

  /* drawer dm buttons */
  document.querySelectorAll('.nav-drawer-dm').forEach(function(btn){
    btn.querySelector('.dm-icon').innerHTML = dark ? sunIcon() : moonIcon();
    btn.querySelector('.dm-label').textContent = dark ? 'Modo claro' : 'Modo oscuro';
    btn.addEventListener('click', toggleDark);
  });

  /* hamburger */
  var ham = document.querySelector('.nav-hamburger');
  var drawer = document.querySelector('.nav-drawer');
  var overlay = document.querySelector('.nav-overlay');
  if(!ham||!drawer) return;
  var hamOpen = false;
  function openDrawer(){
    hamOpen=true;drawer.classList.add('open');
    if(overlay)overlay.classList.add('show');
    ham.innerHTML = xIcon();
    document.body.style.overflow='hidden';
  }
  function closeDrawer(){
    hamOpen=false;drawer.classList.remove('open');
    if(overlay)overlay.classList.remove('show');
    ham.innerHTML = menuIcon();
    document.body.style.overflow='';
  }
  ham.innerHTML = menuIcon();
  ham.addEventListener('click',function(){ hamOpen ? closeDrawer() : openDrawer(); });
  if(overlay)overlay.addEventListener('click',closeDrawer);
  drawer.querySelectorAll('a').forEach(function(el){
    el.addEventListener('click',function(){setTimeout(closeDrawer,80);});
  });
  drawer.querySelectorAll('button:not(.nav-drawer-dm)').forEach(function(el){
    el.addEventListener('click',function(){setTimeout(closeDrawer,80);});
  });

  /* active nav link */
  var page=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-link').forEach(function(a){
    if(a.getAttribute('href')===page)a.classList.add('active');
  });
}

function menuIcon(){
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}
function xIcon(){
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

document.addEventListener('DOMContentLoaded', function(){
  initDarkMode();
  initNav();
});

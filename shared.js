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

/* ── i18n: full-page language system ── */
var LANG_KEY = 'wikirace_lang';
var CURRENT_LANG = 'es';

var TRANSLATIONS = {
  es:{
    'nav.home':'Inicio','nav.howto':'Cómo jugar','nav.leaderboard':'Clasificación',
    'nav.stats':'Stats','nav.about':'Acerca de','nav.play':'Jugar →',
    'nav.multi':'VS Multi',
    'hero.tagline':'Navega de una entrada de Wikipedia a otra usando solo los enlaces. Simple. Adictivo.',
    'hero.play':'Jugar ahora','hero.howto':'Cómo jugar','hero.lb':'Clasificación',
    'how.label':'El juego','how.title':'Simple como adictivo','how.desc':'Tres pasos para empezar',
    'step1.title':'Empieza en una entrada','step1.desc':'Lee el artículo de Wikipedia asignado como punto de partida.',
    'step2.title':'Sigue los enlaces azules','step2.desc':'Cada enlace te lleva a una nueva entrada. Cada clic cuenta.',
    'step3.title':'Llega al destino','step3.desc':'Menos saltos y menos tiempo = mayor puntuación final.',
    'score.label':'Puntuación','score.title':'Empiezas con 1.000 pts','score.desc':'Cada acción resta puntos. El objetivo: perder los mínimos.',
    'sc1.title':'Por enlace','sc1.desc':'La acción principal. Planifica tu ruta.',
    'sc2.title':'Cada 30 segundos','sc2.desc':'Presión de tiempo suave pero constante.',
    'sc3.title':'Volver atrás','sc3.desc':'El doble que avanzar. Úsalo con cabeza.',
    'ex.label':'Partidas populares','ex.title':'¿Puedes llegar?','ex.desc':'Prueba estas rutas desafiantes',
    'ex.cta':'Crear mi propia ruta →',
    'cta.title':'¿Listo para tu primera carrera?','cta.sub':'Sin registro. Sin descargas. Solo abre y juega.',
    'cta.btn':'Jugar ahora →',
    'diff.easy':'Fácil','diff.med':'Media','diff.hard':'Difícil',
    'hero.tagline2':'usando <strong>solo los enlaces</strong>. Simple. Adictivo.',
    'hero.prepared':'¿Preparado?','hero.play.main':'Jugar ahora',
    'hero.multi':'Multijugador','hero.howto.btn':'Cómo jugar','hero.lb.btn':'Clasificación',
    'stats.played':'Partidas jugadas','stats.best':'Tu mejor score','stats.day':'Partida #',
    'step1.num':'01','step2.num':'02','step3.num':'03',
    'sc1.pts':'-40','sc2.pts':'-30','sc3.pts':'-80',
    'ex.cta.btn':'Crear mi propia ruta →',
    'cta.btn.text':'Jugar ahora →',
    'footer.made':'Hecho con','footer.wiki':'Wikipedia',
    'foot.howto':'Cómo jugar','foot.lb':'Clasificación','foot.about':'Acerca de',
  },
  en:{
    'nav.home':'Home','nav.howto':'How to play','nav.leaderboard':'Leaderboard',
    'nav.stats':'Stats','nav.about':'About','nav.play':'Play →',
    'nav.multi':'VS Multi',
    'hero.tagline':'Navigate from one Wikipedia article to another using only links. Simple. Addictive.',
    'hero.play':'Play now','hero.howto':'How to play','hero.lb':'Leaderboard',
    'how.label':'The game','how.title':'Simple yet addictive','how.desc':'Three steps to start',
    'step1.title':'Start at an article','step1.desc':'Read the Wikipedia article assigned as your starting point.',
    'step2.title':'Follow the blue links','step2.desc':'Each link takes you to a new article. Every click counts.',
    'step3.title':'Reach the destination','step3.desc':'Fewer hops and less time = higher final score.',
    'score.label':'Scoring','score.title':'You start with 1,000 pts','score.desc':'Each action costs points. The goal: lose as few as possible.',
    'sc1.title':'Per link','sc1.desc':'The main action. Plan your route.',
    'sc2.title':'Every 30 seconds','sc2.desc':'Gentle time pressure that builds up.',
    'sc3.title':'Going back','sc3.desc':'Double the cost of moving forward. Use it wisely.',
    'ex.label':'Popular routes','ex.title':'Can you make it?','ex.desc':'Try these challenging routes',
    'ex.cta':'Create my own route →',
    'cta.title':'Ready for your first race?','cta.sub':'No sign-up. No download. Just open and play.',
    'cta.btn':'Play now →',
    'diff.easy':'Easy','diff.med':'Medium','diff.hard':'Hard',
    'hero.tagline2':'using <strong>only links</strong>. Simple. Addictive.',
    'hero.prepared':'Ready?','hero.play.main':'Play now',
    'hero.multi':'Multiplayer','hero.howto.btn':'How to play','hero.lb.btn':'Leaderboard',
    'stats.played':'Games played','stats.best':'Your best score','stats.day':'Game #',
    'step1.num':'01','step2.num':'02','step3.num':'03',
    'sc1.pts':'-40','sc2.pts':'-30','sc3.pts':'-80',
    'ex.cta.btn':'Create my own route →',
    'cta.btn.text':'Play now →',
    'footer.made':'Made with','footer.wiki':'Wikipedia',
    'foot.howto':'How to play','foot.lb':'Leaderboard','foot.about':'About',
  },
  eu:{
    'nav.home':'Hasiera','nav.howto':'Nola jokatu','nav.leaderboard':'Sailkapena',
    'nav.stats':'Stats','nav.about':'Honi buruz','nav.play':'Jokatu →',
    'nav.multi':'VS Multi',
    'hero.tagline':'Wikipedia-ko sarrera batetik bestera nabigatu, estekak erabiliz soilik. Sinplea. Menperatzailea.',
    'hero.play':'Orain jokatu','hero.howto':'Nola jokatu','hero.lb':'Sailkapena',
    'how.label':'Jolasa','how.title':'Sinplea baina menperatzailea','how.desc':'Hasi hiru pausotan',
    'step1.title':'Hasi sarrera batean','step1.desc':'Abiapuntu gisa esleitu zaizun Wikipedia artikulua irakurri.',
    'step2.title':'Jarraitu esteka urdinen','step2.desc':'Esteka bakoitzak sarrera berri batera eramaten zaitu.',
    'step3.title':'Iritsi helburura','step3.desc':'Salto gutxiago eta denbora gutxiago = puntuazio altuagoa.',
    'score.label':'Puntuazioa','score.title':'1.000 pt-ekin hasten zara','score.desc':'Ekintza bakoitzak puntuak kendu. Helburua: ahalik eta gutxien galtzea.',
    'sc1.title':'Esteka bakoitzeko','sc1.desc':'Ekintza nagusia. Planifikatu zure bidea.',
    'sc2.title':'30 segundoro','sc2.desc':'Denbora-presioa pixkanaka.',
    'sc3.title':'Atzera joatea','sc3.desc':'Aurrera joatearen kostu bikoitza.',
    'ex.label':'Partida ezagunak','ex.title':'Iritsi al zaitezke?','ex.desc':'Proba itzazu erronka hauek',
    'ex.cta':'Nire bidea sortu →',
    'cta.title':'Prest zure lehen lasterketa?','cta.sub':'Ez du erregistrorik behar.',
    'cta.btn':'Orain jokatu →',
    'diff.easy':'Erraza','diff.med':'Ertaina','diff.hard':'Zaila',
    'hero.tagline2':'<strong>estekak soilik</strong> erabiliz. Sinplea. Menperatzailea.',
    'hero.prepared':'Prest?','hero.play.main':'Orain jokatu',
    'hero.multi':'Anitz-jokalari','hero.howto.btn':'Nola jokatu','hero.lb.btn':'Sailkapena',
    'stats.played':'Jokatutako partidak','stats.best':'Zure puntuaziorik onena','stats.day':'Partida #',
    'step1.num':'01','step2.num':'02','step3.num':'03',
    'sc1.pts':'-40','sc2.pts':'-30','sc3.pts':'-80',
    'ex.cta.btn':'Nire bidea sortu →',
    'cta.btn.text':'Orain jokatu →',
    'footer.made':'Eginda','footer.wiki':'Wikipedia',
    'foot.howto':'Nola jokatu','foot.lb':'Sailkapena','foot.about':'Honi buruz',
  },
  ca:{
    'nav.home':'Inici','nav.howto':'Com jugar','nav.leaderboard':'Classificació',
    'nav.stats':'Stats','nav.about':'Sobre WikiRace','nav.play':'Jugar →',
    'nav.multi':'VS Multi',
    'hero.tagline':"Navega d'una entrada de Wikipedia a una altra usant només els enllaços. Simple. Addictiu.",
    'hero.play':'Jugar ara','hero.howto':'Com jugar','hero.lb':'Classificació',
    'how.label':'El joc','how.title':'Simple com addictu','how.desc':'Tres passos per començar',
    'step1.title':'Comença en una entrada','step1.desc':"Llegeix l'article de Wikipedia assignat com a punt de partida.",
    'step2.title':'Segueix els enllaços blaus','step2.desc':'Cada enllaç porta a una nova entrada. Cada clic compta.',
    'step3.title':'Arriba a la destinació','step3.desc':'Menys salts i menys temps = puntuació final més alta.',
    'score.label':'Puntuació','score.title':'Comences amb 1.000 pts','score.desc':"Cada acció resta punts. L'objectiu: perdre'n el mínim.",
    'sc1.title':'Per enllaç','sc1.desc':'Planifica la teva ruta.',
    'sc2.title':'Cada 30 segons','sc2.desc':'Pressió de temps suau però constant.',
    'sc3.title':'Tornar enrere','sc3.desc':'El doble que avançar. Fes-ho servir amb cap.',
    'ex.label':'Partides populars','ex.title':'Pots arribar?','ex.desc':'Prova aquestes rutes desafiants',
    'ex.cta':'Crear la meva ruta →',
    'cta.title':'A punt per la teva primera cursa?','cta.sub':'Sense registre. Sense descàrregues.',
    'cta.btn':'Jugar ara →',
    'diff.easy':'Fàcil','diff.med':'Mitjana','diff.hard':'Difícil',
    'hero.tagline2':'usant <strong>només els enllaços</strong>. Simple. Addictiu.',
    'hero.prepared':'A punt?','hero.play.main':'Jugar ara',
    'hero.multi':'Multijugador','hero.howto.btn':'Com jugar','hero.lb.btn':'Classificació',
    'stats.played':'Partides jugades','stats.best':'La teva millor puntuació','stats.day':'Partida #',
    'step1.num':'01','step2.num':'02','step3.num':'03',
    'sc1.pts':'-40','sc2.pts':'-30','sc3.pts':'-80',
    'ex.cta.btn':'Crear la meva ruta →',
    'cta.btn.text':'Jugar ara →',
    'footer.made':'Fet amb','footer.wiki':'Wikipedia',
    'foot.howto':'Com jugar','foot.lb':'Classificació','foot.about':'Sobre WikiRace',
  }
};

function t(key){ return (TRANSLATIONS[CURRENT_LANG]||TRANSLATIONS.es)[key] || (TRANSLATIONS.es[key]||key); }

function setLang(code){
  CURRENT_LANG = code;
  try{ localStorage.setItem(LANG_KEY, code); }catch(e){}
  // update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k = el.getAttribute('data-i18n');
    var v = t(k);
    if(!v) return;
    if(el.tagName === 'INPUT'||el.tagName==='TEXTAREA') el.placeholder = v;
    else if(v.indexOf('<') !== -1) el.innerHTML = v;
    else el.textContent = v;
  });
  // update lang toggle labels
  document.querySelectorAll('.lang-toggle-lbl').forEach(function(el){ el.textContent = code.toUpperCase(); });
  // mark active in dropdowns
  document.querySelectorAll('.lang-dd button[data-lang]').forEach(function(b){
    b.classList.toggle('lang-active', b.getAttribute('data-lang')===code);
  });
  // update lang toggle label
  document.querySelectorAll('.lang-toggle-lbl').forEach(function(el){ el.textContent = code.toUpperCase(); });
  // update <html lang>
  document.documentElement.lang = code;
  // close any lang dropdown
  document.querySelectorAll('.lang-dd').forEach(function(d){ d.classList.remove('open'); });
}

function initLang(){
  var saved = null;
  try{ saved = localStorage.getItem(LANG_KEY); }catch(e){}
  CURRENT_LANG = saved || 'es';
  setLang(CURRENT_LANG);
}

/* Run on load */
function toggleLangDD(btn){
  var dd = btn.nextElementSibling;
  if(!dd) return;
  var isOpen = dd.classList.contains('open');
  document.querySelectorAll('.lang-dd').forEach(function(d){ d.classList.remove('open'); });
  if(!isOpen){
    dd.classList.add('open');
    dd.querySelectorAll('button[data-lang]').forEach(function(b){
      b.classList.toggle('lang-active', b.getAttribute('data-lang')===CURRENT_LANG);
    });
  }
}
document.addEventListener('click', function(e){
  if(!e.target.closest || !e.target.closest('.lang-dd-wrap')){
    document.querySelectorAll('.lang-dd').forEach(function(d){ d.classList.remove('open'); });
  }
});

document.addEventListener('DOMContentLoaded', function(){
  initDarkMode();
  initNav();
  initLang();
});

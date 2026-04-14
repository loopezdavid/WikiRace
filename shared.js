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
    'htp.title':'Cómo jugar a WikiRace','htp.sub':'Elige tu punto de partida y tu destino',
    'htp.steps.label':'Los pasos','htp.steps.title':'Cómo se juega',
    'htp.score.title':'El sistema de puntos',
    'htp.tips.label':'Consejos','htp.tips.title':'Estrategia ganadora',
    'lb.title':'Ranking de jugadores',
    'st.title':'Mis estadísticas','st.sub':'Toda tu actividad en WikiRace en este dispositivo',
    'st.empty.title':'Aún no has jugado','st.empty.desc':'Juega tu primera partida para ver tus estadísticas aquí.',
    'st.play.btn':'Jugar ahora →',
    'lb.eyebrow':'Clasificación',
    'lb.sub':'Tus mejores partidas y las puntuaciones más altas guardadas en este dispositivo',
    'lb.tab1':'Mis partidas',
    'lb.tab2':'Partidas de hoy',
    'lb.tab3':'Mis mejores',
    'lb.daily.label':'Palabras del día',
    'lb.daily.btn':'Jugar ahora',
    'lb.stat.games':'Partidas',
    'lb.stat.best':'Mejor score',
    'lb.stat.avg':'Media',
    'lb.stat.days':'Días jugados',
    'lb.clear':'Borrar historial',
    'lb.empty.title':'Sin partidas todavía',
    'lb.empty.desc':'Juega tu primera partida para ver tus resultados aquí.',
    'lb.empty.btn':'Jugar ahora →',
    'st.eyebrow':'Perfil',
    'st.empty.btn':'Jugar ahora →',
    'st.chart':'Evolución de puntuación',
    'st.best5':'Top 5 puntuaciones',
    'st.days':'Días jugados',
    'st.stat.games':'Partidas',
    'st.stat.best':'Mejor score',
    'st.stat.avg':'Media',
    'st.stat.days':'Días jugados',
    'htp.eyebrow':'Aprende a jugar',
    'htp.sub2':'Todo lo que necesitas saber para navegar Wikipedia como un profesional.',
    'htp.step1.tag':'Paso 01',
    'htp.step1.h':'Elige tu punto de partida y tu destino',
    'htp.step1.p':'Cada partida tiene una entrada inicial y un destino. Tu misión: llegar del punto A al B.',
    'htp.step2.tag':'Paso 02',
    'htp.step2.h':'Lee el artículo y haz clic en un enlace',
    'htp.step2.p':'Verás el artículo de Wikipedia completo. Los enlaces azules te llevan a otras entradas.',
    'htp.step3.tag':'Paso 03',
    'htp.step3.h':'Navega hasta llegar al destino',
    'htp.step3.p':'Sigue saltando de entrada en entrada hasta llegar al destino con la máxima puntuación.',
    'htp.score.section':'Empiezas con 1.000 puntos',
    'htp.score.desc':'Cada acción tiene un coste. El reto es perder los mínimos puntos posibles.',
    'htp.tips.section':'Consejos de los mejores',
    'htp.tips.desc':'Trucos para conseguir las puntuaciones más altas',
    'htp.t1.num':'TIP 01',
    'htp.t1.title':'Pasa siempre por países o ciudades',
    'htp.t1.desc':'Los artículos de países y ciudades grandes tienen muchos enlaces hacia otros temas.',
    'htp.t2.num':'TIP 02',
    'htp.t2.title':'Las guerras lo conectan todo',
    'htp.t2.desc':'Segunda Guerra Mundial, Primera Guerra Mundial... son artículos hub con miles de conexiones.',
    'htp.t3.num':'TIP 03',
    'htp.t3.title':'Lee el indicador caliente/frío',
    'htp.t3.desc':'El panel lateral te dice si te estás acercando o alejando del destino.',
    'htp.t4.num':'TIP 04',
    'htp.t4.title':'El índice es tu aliado',
    'htp.t4.desc':'Los artículos largos tienen un índice. Úsalo para localizar secciones relevantes rápido.',
    'htp.t5.num':'TIP 05',
    'htp.t5.title':'Personas famosas como puente',
    'htp.t5.desc':'Los artículos de científicos, políticos y artistas conectan con muchos otros temas.',
    'htp.t6.num':'TIP 06',
    'htp.t6.title':'No uses "atrás" a la ligera',
    'htp.t6.desc':'Volver atrás cuesta el doble que avanzar. Antes de retroceder, explora más el artículo.',
    'htp.faq.title':'Dudas habituales',
    'htp.faq1.q':'¿Qué son las "Palabras del día"?',
    'htp.faq1.a':'Cada día hay un par de entradas fijo que es igual para todos los jugadores del mundo.',
    'htp.faq2.q':'¿Puedo crear mis propias rutas?',
    'htp.faq2.a':'Sí, con la partida personalizada puedes buscar cualquier entrada de Wikipedia.',
    'htp.faq3.q':'¿En qué idiomas está disponible?',
    'htp.faq3.a':'WikiRace está disponible en español, inglés, euskera y catalán.',
    'htp.faq4.q':'¿Se guarda mi historial?',
    'htp.faq4.a':'Tus partidas y puntuaciones se guardan localmente en tu navegador.',
    'htp.faq5.q':'¿Qué pasa si no puedo llegar al destino?',
    'htp.faq5.a':'Puedes rendirte en cualquier momento. Se registrará tu puntuación hasta ese punto.',
    'htp.cta.btn':'Empezar primera partida →',
    'ab.title':'Sobre WikiRace',
    'ab.sub':'Un juego de curiosidad, cultura y conexiones inesperadas',
    'ab.hist.label':'Nuestra historia',
    'ab.v1.title':'Aprender sin darte cuenta',
    'ab.v1.desc':'Cada partida te lleva por artículos que no habrías leído nunca.',
    'ab.v2.title':'Simple de entender, difícil de dominar',
    'ab.v2.desc':'Las reglas caben en dos líneas. Pero conseguir puntuaciones altas requiere estrategia.',
    'ab.v3.title':'El conocimiento como mapa',
    'ab.v3.desc':'Wikipedia es el mayor grafo de conocimiento humano jamás creado.',
    'ab.wiki.title':'Impulsado por Wikipedia',
    'ab.wiki.sub':'Toda la información viene de Wikipedia en tiempo real',
    'ab.cta.title':'Ahora ya sabes todo',
    'ab.cta.sub':'¿Empezamos una partida?',
    'ab.cta.btn':'Jugar WikiRace →',
    'dm.dark':'Modo oscuro',
    'dm.light':'Modo claro',
    'ml.solo':'Modo solo',
    'ml.badge':'Multijugador',
    'ml.tagline1':'Reta a tus amigos en tiempo real.',
    'ml.tagline2':'Mismas palabras, a ver quién llega antes.',
    'ml.name.label':'Tu nombre en la sala',
    'ml.name.ph':'¿Cómo te llamas?',
    'ml.create.title':'Crear sala',
    'ml.create.desc':'Genera un código y compártelo con tus amigos',
    'ml.join.title':'Unirse',
    'ml.join.desc':'Introduce el código de sala de un amigo',
    'ml.code.label':'Código de sala',
    'ml.join.btn':'Unirse →',
    'ml.capacity':'Hasta <strong>8 jugadores</strong> por sala · Sin registro · Gratis',
    'ml.leave':'Salir',
    'ml.room.code.label':'Código de sala',
    'ml.game.title':'Partida',
    'ml.host.badge':'ANFITRIÓN',
    'ml.guest.badge':'INVITADO',
    'ml.start.label':'Inicio',
    'ml.end.label':'Destino',
    'ml.rand.btn':'Aleatoria',
    'ml.daily.btn':'Del día',
    'ml.apply.btn':'Aplicar',
    'ml.players.label':'Jugadores',
    'ml.waiting.host':'Esperando más jugadores…',
    'ml.waiting.guest':'Esperando al anfitrión…',
    'ml.copy.btn':'Copiar código',
    'ml.share.btn':'Compartir enlace',
    'ml.cd.label':'De aquí…',
    'ml.cd.go':'¡YA!',
    'ml.cd.sub':'Prepárate…',
    'ml.sb.pts.lbl':'Mis puntos',
    'ml.sb.loading':'Cargando…',
    'ml.sb.time':'Tiempo',
    'ml.sb.hops':'Saltos',
    'ml.sb.backs':'Atrás',
    'ml.sb.target':'Objetivo',
    'ml.sb.start.tag':'INICIO',
    'ml.sb.end.tag':'META',
    'ml.sb.rivals':'Rivales',
    'ml.sb.live':'EN VIVO',
    'ml.sb.path':'Mi ruta',
    'ml.sb.back.btn':'← Volver atrás',
    'ml.sb.give':'Rendirse',
    'ml.winner.title':'¡Alguien llegó primero!',
    'ml.winner.sub':'Sigue intentando — ¡aún puedes completarla!',
    'ml.res.badge':'Resultados',
    'ml.res.end':'Fin de la partida',
    'ml.res.paths':'Rutas comparadas',
    'ml.res.rematch':'Revancha',
    'ml.res.solo':'Jugar solo',
    'ml.res.home':'Inicio',
    'ml.you':'TÚ',
    'ml.you.lbl':'(tú)',
    'ab.manifesto.title':'Wikipedia contiene el conocimiento de la humanidad. <em>WikiRace</em> lo convierte en un juego.',
    'ab.p1':'WikiRace nació de una idea simple: ¿y si la forma en que está conectado el conocimiento humano se pudiera explorar como un reto? Wikipedia tiene más de 60 millones de artículos interconectados. Cada enlace es un puente entre ideas.',
    'ab.p2':'El juego del WikiRace lleva décadas existiendo de forma informal entre amigos que se retaban mutuamente en el navegador. Nosotros quisimos darle forma, reglas claras, puntuación y una experiencia cuidada.',
    'ab.p3':'La idea es sencilla: empieza en un artículo, llega a otro usando solo los enlaces internos. Pero ejecutarlo bien requiere conocimiento general, intuición sobre cómo está organizado el saber humano y, a veces, un poco de suerte.',
    'ab.v1.desc':'Cada partida te lleva por artículos que no habrías leído nunca. Ciencia, historia, geografía, cultura popular — todo conectado.',
    'ab.v2.desc':'Las reglas caben en dos líneas. Pero conseguir puntuaciones altas requiere estrategia, conocimiento y práctica.',
    'ab.v3.desc':'Wikipedia es el mayor grafo de conocimiento humano jamás creado. WikiRace te hace consciente de esas conexiones.',
    'ab.wiki.desc':'WikiRace usa la API pública de Wikipedia para mostrar los artículos completos en tiempo real. Cada partida es una ventana al conocimiento de la humanidad.',
    'htp.step1.p.full':'Cada partida tiene una entrada inicial y un destino. Tu misión: llegar del punto A al B usando solo los enlaces internos de Wikipedia.',
    'htp.step2.p.full':'Verás el artículo de Wikipedia completo con imágenes, índice y toda la información. Los enlaces azules son tu camino.',
    'htp.step3.p.full':'Sigue saltando de entrada en entrada hasta llegar al destino. El panel lateral muestra tu puntuación y progreso en tiempo real.',
    'htp.sc.link':'Enlace pulsado',
    'htp.sc.time':'Cada 30 segundos',
    'htp.sc.back':'Volver atrás',
    'htp.sc.link.pts':'−40 pts',
    'htp.sc.time.pts':'−30 pts',
    'htp.sc.back.pts':'−80 pts',
    'htp.sc.link.desc':'La acción más común. Planifica bien antes de pulsar.',
    'htp.sc.time.desc':'Presión de tiempo suave pero constante.',
    'htp.sc.back.desc':'El doble que avanzar. Úsalo con cabeza.',
    'lb.title.h1':'Ranking de jugadores',
    'st.last20':'Últimas 20 partidas',
    'st.best.games':'Mejores partidas',
    'page.title.index':'WikiRace — Navega Wikipedia como un juego',
    'page.title.htp':'WikiRace — Cómo jugar',
    'page.title.lb':'WikiRace — Clasificación',
    'page.title.about':'WikiRace — Sobre el juego',
    'page.title.stats':'WikiRace — Mis estadísticas',
    'page.title.multi':'WikiRace — Multijugador',
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
    'htp.title':'How to play WikiRace','htp.sub':'Choose your start and destination article',
    'htp.steps.label':'The steps','htp.steps.title':'How to play',
    'htp.score.title':'The scoring system',
    'htp.tips.label':'Tips','htp.tips.title':'Winning strategy',
    'lb.title':'Player rankings',
    'st.title':'My statistics','st.sub':'All your WikiRace activity on this device',
    'st.empty.title':'No games yet','st.empty.desc':'Play your first game to see your stats here.',
    'st.play.btn':'Play now →',
    'lb.eyebrow':'Leaderboard',
    'lb.sub':'Your best games and highest scores saved on this device',
    'lb.tab1':'My games',
    'lb.tab2':'Today's games',
    'lb.tab3':'My best',
    'lb.daily.label':'Word of the day',
    'lb.daily.btn':'Play now',
    'lb.stat.games':'Games',
    'lb.stat.best':'Best score',
    'lb.stat.avg':'Average',
    'lb.stat.days':'Days played',
    'lb.clear':'Clear history',
    'lb.empty.title':'No games yet',
    'lb.empty.desc':'Play your first game to see your results here.',
    'lb.empty.btn':'Play now →',
    'st.eyebrow':'Profile',
    'st.empty.btn':'Play now →',
    'st.chart':'Score evolution',
    'st.best5':'Top 5 scores',
    'st.days':'Days played',
    'st.stat.games':'Games',
    'st.stat.best':'Best score',
    'st.stat.avg':'Average',
    'st.stat.days':'Days played',
    'htp.eyebrow':'Learn to play',
    'htp.sub2':'Everything you need to know to navigate Wikipedia like a pro.',
    'htp.step1.tag':'Step 01',
    'htp.step1.h':'Choose your start and destination',
    'htp.step1.p':'Each game has a starting article and a destination. Your mission: get from A to B.',
    'htp.step2.tag':'Step 02',
    'htp.step2.h':'Read the article and click a link',
    'htp.step2.p':'You will see the full Wikipedia article. Blue links take you to other articles.',
    'htp.step3.tag':'Step 03',
    'htp.step3.h':'Navigate until you reach the destination',
    'htp.step3.p':'Keep jumping from article to article until you reach the destination with max score.',
    'htp.score.section':'You start with 1,000 points',
    'htp.score.desc':'Every action costs points. The challenge is to lose as few as possible.',
    'htp.tips.section':'Tips from the best',
    'htp.tips.desc':'Tricks to get the highest scores',
    'htp.t1.num':'TIP 01',
    'htp.t1.title':'Always go through countries or cities',
    'htp.t1.desc':'Articles about large countries and cities have many links to other topics.',
    'htp.t2.num':'TIP 02',
    'htp.t2.title':'Wars connect everything',
    'htp.t2.desc':'World War II, World War I... hub articles with thousands of connections.',
    'htp.t3.num':'TIP 03',
    'htp.t3.title':'Read the hot/cold indicator',
    'htp.t3.desc':'The sidebar tells you whether you are getting closer or further from the destination.',
    'htp.t4.num':'TIP 04',
    'htp.t4.title':'The index is your ally',
    'htp.t4.desc':'Long articles have a table of contents. Use it to locate relevant sections quickly.',
    'htp.t5.num':'TIP 05',
    'htp.t5.title':'Famous people as bridges',
    'htp.t5.desc':'Articles about scientists, politicians and artists connect to many other topics.',
    'htp.t6.num':'TIP 06',
    'htp.t6.title':'Do not go back lightly',
    'htp.t6.desc':'Going back costs double going forward. Explore the article more before backtracking.',
    'htp.faq.title':'Common questions',
    'htp.faq1.q':'What are the "Words of the day"?',
    'htp.faq1.a':'Every day there is a fixed pair of articles that is the same for all players worldwide.',
    'htp.faq2.q':'Can I create my own routes?',
    'htp.faq2.a':'Yes, with a custom game you can search any Wikipedia article.',
    'htp.faq3.q':'What languages are available?',
    'htp.faq3.a':'WikiRace is available in Spanish, English, Basque and Catalan.',
    'htp.faq4.q':'Is my history saved?',
    'htp.faq4.a':'Your games and scores are saved locally in your browser.',
    'htp.faq5.q':'What if I cannot reach the destination?',
    'htp.faq5.a':'You can give up at any time. Your score up to that point will be recorded.',
    'htp.cta.btn':'Start first game →',
    'ab.title':'About WikiRace',
    'ab.sub':'A game of curiosity, culture and unexpected connections',
    'ab.hist.label':'Our story',
    'ab.v1.title':'Learning without realising',
    'ab.v1.desc':'Every game takes you through articles you would never have read otherwise.',
    'ab.v2.title':'Simple to understand, hard to master',
    'ab.v2.desc':'The rules fit in two lines. But getting high scores requires strategy.',
    'ab.v3.title':'Knowledge as a map',
    'ab.v3.desc':'Wikipedia is the largest graph of human knowledge ever created.',
    'ab.wiki.title':'Powered by Wikipedia',
    'ab.wiki.sub':'All information comes from Wikipedia in real time',
    'ab.cta.title':'Now you know everything',
    'ab.cta.sub':'Shall we start a game?',
    'ab.cta.btn':'Play WikiRace →',
    'dm.dark':'Dark mode',
    'dm.light':'Light mode',
    'ml.solo':'Solo mode',
    'ml.badge':'Multiplayer',
    'ml.tagline1':'Challenge your friends in real time.',
    'ml.tagline2':'Same words, see who gets there first.',
    'ml.name.label':'Your name in the room',
    'ml.name.ph':'What is your name?',
    'ml.create.title':'Create room',
    'ml.create.desc':'Generate a code and share it with your friends',
    'ml.join.title':'Join',
    'ml.join.desc':'Enter a friend's room code',
    'ml.code.label':'Room code',
    'ml.join.btn':'Join →',
    'ml.capacity':'Up to <strong>8 players</strong> per room · No sign-up · Free',
    'ml.leave':'Leave',
    'ml.room.code.label':'Room code',
    'ml.game.title':'Game',
    'ml.host.badge':'HOST',
    'ml.guest.badge':'GUEST',
    'ml.start.label':'Start',
    'ml.end.label':'Destination',
    'ml.rand.btn':'Random',
    'ml.daily.btn':'Daily',
    'ml.apply.btn':'Apply',
    'ml.players.label':'Players',
    'ml.waiting.host':'Waiting for more players…',
    'ml.waiting.guest':'Waiting for the host…',
    'ml.copy.btn':'Copy code',
    'ml.share.btn':'Share link',
    'ml.cd.label':'From here…',
    'ml.cd.go':'GO!',
    'ml.cd.sub':'Get ready…',
    'ml.sb.pts.lbl':'My points',
    'ml.sb.loading':'Loading…',
    'ml.sb.time':'Time',
    'ml.sb.hops':'Hops',
    'ml.sb.backs':'Back',
    'ml.sb.target':'Target',
    'ml.sb.start.tag':'START',
    'ml.sb.end.tag':'GOAL',
    'ml.sb.rivals':'Rivals',
    'ml.sb.live':'LIVE',
    'ml.sb.path':'My route',
    'ml.sb.back.btn':'← Go back',
    'ml.sb.give':'Give up',
    'ml.winner.title':'Someone arrived first!',
    'ml.winner.sub':'Keep trying — you can still complete it!',
    'ml.res.badge':'Results',
    'ml.res.end':'End of game',
    'ml.res.paths':'Compared routes',
    'ml.res.rematch':'Rematch',
    'ml.res.solo':'Play solo',
    'ml.res.home':'Home',
    'ml.you':'YOU',
    'ml.you.lbl':'(you)',
    'ab.manifesto.title':'Wikipedia contains the knowledge of humanity. <em>WikiRace</em> turns it into a game.',
    'ab.p1':'WikiRace was born from a simple idea: what if the way human knowledge is connected could be explored as a challenge? Wikipedia has over 60 million interconnected articles. Every link is a bridge between ideas.',
    'ab.p2':'The WikiRace game has existed informally for decades among friends who challenged each other in their browsers. We wanted to give it shape, clear rules, a scoring system and a polished experience.',
    'ab.p3':'The idea is simple: start at one article, reach another using only internal links. But doing it well requires general knowledge, intuition about how human knowledge is organised and sometimes a little luck.',
    'ab.v1.desc':'Every game takes you through articles you would never have read otherwise. Science, history, geography, pop culture — all connected.',
    'ab.v2.desc':'The rules fit in two lines. But getting high scores requires strategy, knowledge and practice.',
    'ab.v3.desc':'Wikipedia is the largest graph of human knowledge ever created. WikiRace makes you aware of those connections.',
    'ab.wiki.desc':'WikiRace uses the public Wikipedia API to display full articles in real time. Every game is a window into the knowledge of humanity.',
    'htp.step1.p.full':'Each game has a starting article and a destination. Your mission: get from A to B using only internal Wikipedia links.',
    'htp.step2.p.full':'You will see the full Wikipedia article with images, index and all information. The blue links are your path.',
    'htp.step3.p.full':'Keep jumping from article to article until you reach the destination. The sidebar shows your score and progress in real time.',
    'htp.sc.link':'Link clicked',
    'htp.sc.time':'Every 30 seconds',
    'htp.sc.back':'Going back',
    'htp.sc.link.pts':'−40 pts',
    'htp.sc.time.pts':'−30 pts',
    'htp.sc.back.pts':'−80 pts',
    'htp.sc.link.desc':'The most common action. Plan well before clicking.',
    'htp.sc.time.desc':'Gentle but constant time pressure.',
    'htp.sc.back.desc':'Double the cost of going forward. Use it wisely.',
    'lb.title.h1':'Player rankings',
    'st.last20':'Last 20 games',
    'st.best.games':'Best games',
    'page.title.index':'WikiRace — Navigate Wikipedia like a game',
    'page.title.htp':'WikiRace — How to play',
    'page.title.lb':'WikiRace — Leaderboard',
    'page.title.about':'WikiRace — About the game',
    'page.title.stats':'WikiRace — My statistics',
    'page.title.multi':'WikiRace — Multiplayer',
    'cta.btn.text':'Play now →',
    'diff.hard':'Hard',
    'diff.med':'Medium',
    'ex.cta.btn':'Create my own route →',
    'foot.about':'About',
    'foot.howto':'How to play',
    'foot.lb':'Leaderboard',
    'footer.made':'Made with',
    'footer.wiki':'Wikipedia',
    'hero.howto.btn':'How to play',
    'hero.lb.btn':'Leaderboard',
    'hero.multi':'Multiplayer',
    'hero.play.main':'Play now',
    'hero.prepared':'Ready?',
    'hero.tagline2':'using <strong>only links</strong>. Simple. Addictive.',
    'sc1.pts':'-40',
    'sc2.pts':'-30',
    'sc3.pts':'-80',
    'stats.best':'Your best score',
    'stats.day':'Game #',
    'stats.played':'Games played',
    'step1.num':'01',
    'step2.num':'02',
    'step3.num':'03',
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
    'htp.title':'WikiRace nola jokatu','htp.sub':'Aukeratu hasiera eta helmuga',
    'htp.steps.label':'Pausoak','htp.steps.title':'Nola jokatzen den',
    'htp.score.title':'Puntuazio sistema',
    'htp.tips.label':'Aholkuak','htp.tips.title':'Estrategia irabazlea',
    'lb.title':'Jokalarien sailkapena',
    'st.title':'Nire estatistikak','st.sub':'WikiRacen jarduera guztia gailu honetan',
    'st.empty.title':'Oraindik ez duzu jokatu','st.empty.desc':'Jokatu zure lehen partida estatistikak ikusteko.',
    'st.play.btn':'Orain jokatu →',
    'lb.eyebrow':'Sailkapena',
    'lb.sub':'Zure partida onenak eta puntuaziorik altuenak gailu honetan gordeak',
    'lb.tab1':'Nire partidak',
    'lb.tab2':'Gaurko partidak',
    'lb.tab3':'Nire onenak',
    'lb.daily.label':'Eguneko hitzak',
    'lb.daily.btn':'Orain jokatu',
    'lb.stat.games':'Partidak',
    'lb.stat.best':'Puntuaziorik onena',
    'lb.stat.avg':'Batezbestekoa',
    'lb.stat.days':'Jokatutako egunak',
    'lb.clear':'Historial ezabatu',
    'lb.empty.title':'Oraindik partidarik ez',
    'lb.empty.desc':'Jokatu zure lehen partida emaitzak ikusteko.',
    'lb.empty.btn':'Orain jokatu →',
    'st.eyebrow':'Profila',
    'st.empty.btn':'Orain jokatu →',
    'st.chart':'Puntuazioaren bilakaera',
    'st.best5':'Top 5 puntuazioak',
    'st.days':'Jokatutako egunak',
    'st.stat.games':'Partidak',
    'st.stat.best':'Puntuaziorik onena',
    'st.stat.avg':'Batezbestekoa',
    'st.stat.days':'Jokatutako egunak',
    'htp.eyebrow':'Ikasi jokatzen',
    'htp.sub2':'Wikipedia profesional bat bezala nabigatzeko behar duzun guztia.',
    'htp.step1.tag':'1. Pausoa',
    'htp.step1.h':'Aukeratu hasiera eta helmuga',
    'htp.step1.p':'Partida bakoitzak hasierako eta helmugako sarrera du. Zure misioa: A-tik B-ra iristea.',
    'htp.step2.tag':'2. Pausoa',
    'htp.step2.h':'Irakurri artikulua eta sakatu esteka bat',
    'htp.step2.p':'Wikipedia artikulu osoa ikusiko duzu. Esteka urdinek beste sarreretara eramaten zaituzte.',
    'htp.step3.tag':'3. Pausoa',
    'htp.step3.h':'Nabigatu helmugara iritsi arte',
    'htp.step3.p':'Jarraitu sarreratik sarrerara saltatzen puntuazio maximoarekin helmugara iritsi arte.',
    'htp.score.section':'1.000 ptrekin hasten zara',
    'htp.score.desc':'Ekintza bakoitzak puntuak kentzen ditu. Erronka ahalik eta gutxien galtzea da.',
    'htp.tips.section':'Onenen aholkuak',
    'htp.tips.desc':'Puntuazio altuenak lortzeko trikimailuak',
    'htp.t1.num':'AHOLKUA 01',
    'htp.t1.title':'Beti pasa herrialde edo hirien bidez',
    'htp.t1.desc':'Herrialde eta hiri handiei buruzko artikuluek esteka asko dituzte beste gai batzuetarako.',
    'htp.t2.num':'AHOLKUA 02',
    'htp.t2.title':'Gerrek dena lotzen dute',
    'htp.t2.desc':'Bigarren Mundu Gerra, Lehen Mundu Gerra... hub artikuluak dira milaka konexiorekin.',
    'htp.t3.num':'AHOLKUA 03',
    'htp.t3.title':'Irakurri bero/hotz adierazlea',
    'htp.t3.desc':'Alboko panelak helmugara hurbiltzen ari zaren edo urruntzen ari zaren esaten dizu.',
    'htp.t4.num':'AHOLKUA 04',
    'htp.t4.title':'Aurkibidea zure laguna da',
    'htp.t4.desc':'Artikulu luzeek aurkibidea dute. Erabili sekzio garrantzitsuak azkar aurkitzeko.',
    'htp.t5.num':'AHOLKUA 05',
    'htp.t5.title':'Pertsona ospetsuak zubi gisa',
    'htp.t5.desc':'Zientzialarien, politikarien eta artistei buruzko artikuluek gai askorekin lotzen dute.',
    'htp.t6.num':'AHOLKUA 06',
    'htp.t6.title':'Ez itzuli atzera erraz',
    'htp.t6.desc':'Atzera joatea bikoitza balio du aurrera baino. Atzera egin baino lehen, artikulua gehiago aztertu.',
    'htp.faq.title':'Ohiko galderak',
    'htp.faq1.q':'Zer dira "Eguneko hitzak"?',
    'htp.faq1.a':'Egunero pare bat sarrera finko dago mundu guztiko jokalari guztientzat berdina dena.',
    'htp.faq2.q':'Nire ibilbideak sor ditzaket?',
    'htp.faq2.a':'Bai, partida pertsonalizatuarekin edozein Wikipedia sarrera bila dezakezu.',
    'htp.faq3.q':'Zein hizkuntzatan dago eskuragarri?',
    'htp.faq3.a':'WikiRace gaztelaniaz, ingelesez, euskaraz eta katalanez dago eskuragarri.',
    'htp.faq4.q':'Nire historia gordetzen al da?',
    'htp.faq4.a':'Zure partidak eta puntuazioak nabigatzailean lokalki gordetzen dira.',
    'htp.faq5.q':'Zer gertatzen da helmugara irits ez banaiteke?',
    'htp.faq5.a':'Edozein unetan eman diezaiokezu. Puntu horretara arteko puntuazioa erregistratuko da.',
    'htp.cta.btn':'Hasi lehen partida →',
    'ab.title':'WikiRace-i buruz',
    'ab.sub':'Jakin-min, kultura eta ustekabeko konexioen jolas bat',
    'ab.hist.label':'Gure historia',
    'ab.v1.title':'Ohartu gabe ikastea',
    'ab.v1.desc':'Partida bakoitzak inoiz irakurriko ez zenituen artikuluetatik eramaten zaitu.',
    'ab.v2.title':'Ulertzeko erraza, menderatzeko zaila',
    'ab.v2.desc':'Arauak bi lerratan sartzen dira. Baina puntuazio altoak lortzeak estrategia eskatzen du.',
    'ab.v3.title':'Ezagutza mapa gisa',
    'ab.v3.desc':'Wikipedia inoiz sortu den giza ezagutzaren grafiko handiena da.',
    'ab.wiki.title':'Wikipedia-k bultzatua',
    'ab.wiki.sub':'Informazio guztia Wikipedia-tik dator denbora errealean',
    'ab.cta.title':'Orain dena dakizu',
    'ab.cta.sub':'Partida bat hasten al dugu?',
    'ab.cta.btn':'WikiRace jokatu →',
    'dm.dark':'Modu iluna',
    'dm.light':'Modu argia',
    'ml.solo':'Bakarkako modua',
    'ml.badge':'Anitz-jokalari',
    'ml.tagline1':'Erronka iezaiezu zure lagunei denbora errealean.',
    'ml.tagline2':'Hitz berdinak, ikus dezagun nor iristen den lehena.',
    'ml.name.label':'Zure izena gelan',
    'ml.name.ph':'Nola deitzen zara?',
    'ml.create.title':'Gela sortu',
    'ml.create.desc':'Sortu kode bat eta partekatu zure lagunekin',
    'ml.join.title':'Sartu',
    'ml.join.desc':'Sartu lagunaren gelako kodea',
    'ml.code.label':'Gelako kodea',
    'ml.join.btn':'Sartu →',
    'ml.capacity':'<strong>8 jokalari</strong> arte gelako · Erregistrorik gabe · Doan',
    'ml.leave':'Irten',
    'ml.room.code.label':'Gelako kodea',
    'ml.game.title':'Partida',
    'ml.host.badge':'ANFITRIOIAK',
    'ml.guest.badge':'GONBIDATUA',
    'ml.start.label':'Hasiera',
    'ml.end.label':'Helmuga',
    'ml.rand.btn':'Ausazkoa',
    'ml.daily.btn':'Egunekoa',
    'ml.apply.btn':'Aplikatu',
    'ml.players.label':'Jokalariak',
    'ml.waiting.host':'Jokalari gehiago zain…',
    'ml.waiting.guest':'Anfitrioiaren zain…',
    'ml.copy.btn':'Kodea kopiatu',
    'ml.share.btn':'Esteka partekatu',
    'ml.cd.label':'Hemendik…',
    'ml.cd.go':'AURRERA!',
    'ml.cd.sub':'Prestatu…',
    'ml.sb.pts.lbl':'Nire puntuak',
    'ml.sb.loading':'Kargatzen…',
    'ml.sb.time':'Denbora',
    'ml.sb.hops':'Saltuak',
    'ml.sb.backs':'Atzera',
    'ml.sb.target':'Helmuga',
    'ml.sb.start.tag':'HASIERA',
    'ml.sb.end.tag':'HELMUGA',
    'ml.sb.rivals':'Aurkariak',
    'ml.sb.live':'ZUZENEAN',
    'ml.sb.path':'Nire ibilbidea',
    'ml.sb.back.btn':'← Atzera joan',
    'ml.sb.give':'Amore eman',
    'ml.winner.title':'Norbait lehena iritsi da!',
    'ml.winner.sub':'Jarraitu saiatzen — oraindik osatu dezakezu!',
    'ml.res.badge':'Emaitzak',
    'ml.res.end':'Partidaren amaiera',
    'ml.res.paths':'Alderatutako ibilbideak',
    'ml.res.rematch':'Berrikusi',
    'ml.res.solo':'Bakarrik jokatu',
    'ml.res.home':'Hasiera',
    'ml.you':'ZU',
    'ml.you.lbl':'(zu)',
    'ab.manifesto.title':'Wikipedia-k gizateriaren ezagutza du. <em>WikiRace</em>-k jolas bihurtzen du.',
    'ab.p1':'WikiRace ideia sinple batetik jaio zen: zer gertatuko litzateke giza ezagutza nola konektatuta dagoen erronka gisa esploratzeko? Wikipedia-k 60 milioi artikulu elkarlotuak baino gehiago ditu. Esteka bakoitza ideia arteko zubi bat da.',
    'ab.p2':'WikiRace jolasak hamarkadak daramatza lagunartean informalki existitzen. Forma, arau argiak, puntuazio sistema eta esperientzia zaindua eman nahi genion.',
    'ab.p3':'Ideia sinplea da: hasi artikulu batean, iritsi beste batera barneko estekak soilik erabiliz. Baina ondo egiteak ezagutza orokorra, intuizioa eta zortea behar ditu.',
    'ab.v1.desc':'Partida bakoitzak inoiz irakurriko ez zenituen artikuluetatik eramaten zaitu. Zientzia, historia, geografia, kultura — dena konektatuta.',
    'ab.v2.desc':'Arauak bi lerratan sartzen dira. Baina puntuazio altoak lortzeak estrategia, ezagutza eta praktika eskatzen du.',
    'ab.v3.desc':'Wikipedia inoiz sortu den giza ezagutzaren grafiko handiena da. WikiRace konexio horiei buruz ohartarazten zaitu.',
    'ab.wiki.desc':'WikiRace-k Wikipedia-ren API publikoa erabiltzen du artikuluak denbora errealean bistaratzeko.',
    'htp.step1.p.full':'Partida bakoitzak hasierako eta helmugako sarrera du. Zure misioa: A-tik B-ra iristea Wikipedia-ren barneko estekak soilik erabiliz.',
    'htp.step2.p.full':'Wikipedia artikulu osoa ikusiko duzu irudietan, aurkibidean eta informazio guztiarekin. Esteka urdinek dira zure bidea.',
    'htp.step3.p.full':'Jarraitu sarreratik sarrerara saltatzen helmugara iritsi arte. Alboko panelak puntuazioa eta aurrerapena erakusten ditu.',
    'htp.sc.link':'Esteka sakatu',
    'htp.sc.time':'30 segundoro',
    'htp.sc.back':'Atzera joatea',
    'htp.sc.link.pts':'−40 ptu',
    'htp.sc.time.pts':'−30 ptu',
    'htp.sc.back.pts':'−80 ptu',
    'htp.sc.link.desc':'Ekintza ohikoena. Planifikatu ongi sakatu aurretik.',
    'htp.sc.time.desc':'Denbora presioa mantsoa baina etengabea.',
    'htp.sc.back.desc':'Aurrera joatearen kostu bikoitza.',
    'lb.title.h1':'Jokalarien sailkapena',
    'st.last20':'Azken 20 partidak',
    'st.best.games':'Partida onenak',
    'page.title.index':'WikiRace — Wikipedia jolas gisa nabigatu',
    'page.title.htp':'WikiRace — Nola jokatu',
    'page.title.lb':'WikiRace — Sailkapena',
    'page.title.about':'WikiRace — Jolasari buruz',
    'page.title.stats':'WikiRace — Nire estatistikak',
    'page.title.multi':'WikiRace — Anitz-jokalari',
    'cta.btn.text':'Orain jokatu →',
    'diff.hard':'Zaila',
    'diff.med':'Ertaina',
    'ex.cta.btn':'Nire bidea sortu →',
    'foot.about':'Honi buruz',
    'foot.howto':'Nola jokatu',
    'foot.lb':'Sailkapena',
    'footer.made':'Eginda',
    'footer.wiki':'Wikipedia',
    'hero.howto.btn':'Nola jokatu',
    'hero.lb.btn':'Sailkapena',
    'hero.multi':'Anitz-jokalari',
    'hero.play.main':'Orain jokatu',
    'hero.prepared':'Prest?',
    'hero.tagline2':'<strong>estekak soilik</strong> erabiliz. Sinplea. Menperatzailea.',
    'sc1.pts':'-40',
    'sc2.pts':'-30',
    'sc3.pts':'-80',
    'stats.best':'Zure puntuaziorik onena',
    'stats.day':'Partida #',
    'stats.played':'Jokatutako partidak',
    'step1.num':'01',
    'step2.num':'02',
    'step3.num':'03',
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
    'htp.title':'Com jugar a WikiRace','htp.sub':'Tria el teu punt de partida i destinació',
    'htp.steps.label':'Els passos','htp.steps.title':'Com es juga',
    'htp.score.title':'El sistema de puntuació',
    'htp.tips.label':'Consells','htp.tips.title':'Estratègia guanyadora',
    'lb.title':'Rànquing de jugadors',
    'st.title':'Les meves estadístiques','st.sub':'Tota la teva activitat a WikiRace en aquest dispositiu',
    'st.empty.title':'Encara no has jugat','st.empty.desc':'Juga la teva primera partida per veure les estadístiques.',
    'st.play.btn':'Jugar ara →',
    'lb.eyebrow':'Classificació',
    'lb.sub':'Les teves millors partides i puntuacions més altes guardades en aquest dispositiu',
    'lb.tab1':'Les meves partides',
    'lb.tab2':'Partides d'avui',
    'lb.tab3':'Les meves millors',
    'lb.daily.label':'Paraules del dia',
    'lb.daily.btn':'Jugar ara',
    'lb.stat.games':'Partides',
    'lb.stat.best':'Millor puntuació',
    'lb.stat.avg':'Mitjana',
    'lb.stat.days':'Dies jugats',
    'lb.clear':'Esborrar historial',
    'lb.empty.title':'Encara no has jugat',
    'lb.empty.desc':'Juga la teva primera partida per veure els teus resultats aquí.',
    'lb.empty.btn':'Jugar ara →',
    'st.eyebrow':'Perfil',
    'st.empty.btn':'Jugar ara →',
    'st.chart':'Evolució de la puntuació',
    'st.best5':'Top 5 puntuacions',
    'st.days':'Dies jugats',
    'st.stat.games':'Partides',
    'st.stat.best':'Millor puntuació',
    'st.stat.avg':'Mitjana',
    'st.stat.days':'Dies jugats',
    'htp.eyebrow':'Aprèn a jugar',
    'htp.sub2':'Tot el que necessites saber per navegar Wikipedia com un professional.',
    'htp.step1.tag':'Pas 01',
    'htp.step1.h':'Tria el teu punt de partida i destinació',
    'htp.step1.p':'Cada partida té un article inicial i un de destinació. La teva missió: anar de A a B.',
    'htp.step2.tag':'Pas 02',
    'htp.step2.h':'Llegeix l'article i clica un enllaç',
    'htp.step2.p':'Veuràs l'article de Wikipedia complet. Els enllaços blaus porten a altres articles.',
    'htp.step3.tag':'Pas 03',
    'htp.step3.h':'Navega fins arribar a la destinació',
    'htp.step3.p':'Continua saltant d'article en article fins arribar a la destinació amb la màxima puntuació.',
    'htp.score.section':'Comences amb 1.000 punts',
    'htp.score.desc':'Cada acció té un cost. El repte és perdre el mínim possible.',
    'htp.tips.section':'Consells dels millors',
    'htp.tips.desc':'Trucs per aconseguir les puntuacions més altes',
    'htp.t1.num':'CONSELL 01',
    'htp.t1.title':'Passa sempre per països o ciutats',
    'htp.t1.desc':'Els articles sobre països i ciutats grans tenen molts enllaços cap a altres temes.',
    'htp.t2.num':'CONSELL 02',
    'htp.t2.title':'Les guerres ho connecten tot',
    'htp.t2.desc':'Segona Guerra Mundial, Primera Guerra Mundial... articles hub amb milers de connexions.',
    'htp.t3.num':'CONSELL 03',
    'htp.t3.title':'Llegeix l'indicador calent/fred',
    'htp.t3.desc':'El panell lateral et diu si t'estàs acostant o allunyant de la destinació.',
    'htp.t4.num':'CONSELL 04',
    'htp.t4.title':'L'índex és el teu aliat',
    'htp.t4.desc':'Els articles llargs tenen un índex. Usa'l per localitzar seccions rellevants ràpidament.',
    'htp.t5.num':'CONSELL 05',
    'htp.t5.title':'Persones famoses com a pont',
    'htp.t5.desc':'Els articles de científics, polítics i artistes connecten amb molts altres temes.',
    'htp.t6.num':'CONSELL 06',
    'htp.t6.title':'No tornis enrere a la lleugera',
    'htp.t6.desc':'Tornar enrere costa el doble que avançar. Explora més l'article abans de retrocedir.',
    'htp.faq.title':'Dubtes habituals',
    'htp.faq1.q':'Què són les "Paraules del dia"?',
    'htp.faq1.a':'Cada dia hi ha un parell d'entrades fix que és igual per a tots els jugadors del món.',
    'htp.faq2.q':'Puc crear les meves pròpies rutes?',
    'htp.faq2.a':'Sí, amb la partida personalitzada pots cercar qualsevol article de Wikipedia.',
    'htp.faq3.q':'En quins idiomes està disponible?',
    'htp.faq3.a':'WikiRace està disponible en espanyol, anglès, basc i català.',
    'htp.faq4.q':'Es guarda el meu historial?',
    'htp.faq4.a':'Les teves partides i puntuacions es guarden localment al teu navegador.',
    'htp.faq5.q':'Què passa si no puc arribar a la destinació?',
    'htp.faq5.a':'Pots rendir-te en qualsevol moment. Es registrarà la teva puntuació fins aquell punt.',
    'htp.cta.btn':'Començar primera partida →',
    'ab.title':'Sobre WikiRace',
    'ab.sub':'Un joc de curiositat, cultura i connexions inesperades',
    'ab.hist.label':'La nostra història',
    'ab.v1.title':'Aprendre sense adonar-te'n',
    'ab.v1.desc':'Cada partida et porta per articles que mai hauries llegit.',
    'ab.v2.title':'Simple d'entendre, difícil de dominar',
    'ab.v2.desc':'Les regles caben en dues línies. Però aconseguir puntuacions altes requereix estratègia.',
    'ab.v3.title':'El coneixement com a mapa',
    'ab.v3.desc':'Wikipedia és el major graf del coneixement humà mai creat.',
    'ab.wiki.title':'Impulsat per Wikipedia',
    'ab.wiki.sub':'Tota la informació prové de Wikipedia en temps real',
    'ab.cta.title':'Ara ja ho saps tot',
    'ab.cta.sub':'Comencem una partida?',
    'ab.cta.btn':'Jugar WikiRace →',
    'dm.dark':'Mode fosc',
    'dm.light':'Mode clar',
    'ml.solo':'Mode solitari',
    'ml.badge':'Multijugador',
    'ml.tagline1':'Repte als teus amics en temps real.',
    'ml.tagline2':'Mateixes paraules, a veure qui arriba primer.',
    'ml.name.label':'El teu nom a la sala',
    'ml.name.ph':'Com et dius?',
    'ml.create.title':'Crear sala',
    'ml.create.desc':'Genera un codi i comparteix-lo amb els teus amics',
    'ml.join.title':'Unir-se',
    'ml.join.desc':'Introdueix el codi de sala d'un amic',
    'ml.code.label':'Codi de sala',
    'ml.join.btn':'Unir-se →',
    'ml.capacity':'Fins a <strong>8 jugadors</strong> per sala · Sense registre · Gratis',
    'ml.leave':'Sortir',
    'ml.room.code.label':'Codi de sala',
    'ml.game.title':'Partida',
    'ml.host.badge':'AMFITRIÓ',
    'ml.guest.badge':'CONVIDAT',
    'ml.start.label':'Inici',
    'ml.end.label':'Destinació',
    'ml.rand.btn':'Aleatòria',
    'ml.daily.btn':'Del dia',
    'ml.apply.btn':'Aplicar',
    'ml.players.label':'Jugadors',
    'ml.waiting.host':'Esperant més jugadors…',
    'ml.waiting.guest':'Esperant l'amfitrió…',
    'ml.copy.btn':'Copiar codi',
    'ml.share.btn':'Compartir enllaç',
    'ml.cd.label':'D'aquí…',
    'ml.cd.go':'JA!',
    'ml.cd.sub':'Prepara't…',
    'ml.sb.pts.lbl':'Els meus punts',
    'ml.sb.loading':'Carregant…',
    'ml.sb.time':'Temps',
    'ml.sb.hops':'Salts',
    'ml.sb.backs':'Enrere',
    'ml.sb.target':'Objectiu',
    'ml.sb.start.tag':'INICI',
    'ml.sb.end.tag':'META',
    'ml.sb.rivals':'Rivals',
    'ml.sb.live':'EN DIRECTE',
    'ml.sb.path':'La meva ruta',
    'ml.sb.back.btn':'← Tornar enrere',
    'ml.sb.give':'Rendir-se',
    'ml.winner.title':'Algú ha arribat primer!',
    'ml.winner.sub':'Continua intentant-ho — encara pots completar-ho!',
    'ml.res.badge':'Resultats',
    'ml.res.end':'Fi de la partida',
    'ml.res.paths':'Rutes comparades',
    'ml.res.rematch':'Revancha',
    'ml.res.solo':'Jugar sol',
    'ml.res.home':'Inici',
    'ml.you':'TU',
    'ml.you.lbl':'(tu)',
    'hero.tagline':'Navega d\'una entrada de Wikipedia a una altra usant només els enllaços. Simple. Addictiu.',
    'score.desc':'Cada acció resta punts. L\'objectiu: perdre\'n el mínim possible.',
    'step1.desc':'Llegeix l\'article de Wikipedia assignat com a punt de partida.',
    'ab.manifesto.title':'Wikipedia conté el coneixement de la humanitat. <em>WikiRace</em> el converteix en un joc.',
    'ab.p1':'WikiRace va néixer d\'una idea simple: i si la forma en què el coneixement humà està connectat es pogués explorar com un repte? Wikipedia té més de 60 milions d\'articles interconnectats.',
    'ab.p2':'El joc de WikiRace porta dècades existint de forma informal entre amics. Volíem donar-li forma, regles clares, puntuació i una experiència acurada.',
    'ab.p3':'La idea és senzilla: comença en un article, arriba a un altre usant només els enllaços interns. Però fer-ho bé requereix coneixement general, intuïció i una mica de sort.',
    'ab.v1.desc':'Cada partida et porta per articles que mai hauries llegit. Ciència, història, geografia, cultura popular — tot connectat.',
    'ab.v2.desc':'Les regles caben en dues línies. Però aconseguir puntuacions altes requereix estratègia, coneixement i pràctica.',
    'ab.v3.desc':'Wikipedia és el major graf del coneixement humà mai creat. WikiRace et fa conscient d\'aquestes connexions.',
    'ab.wiki.desc':'WikiRace usa l\'API pública de Wikipedia per mostrar articles complets en temps real.',
    'htp.step1.p.full':'Cada partida té un article inicial i un de destinació. La teva missió: anar de A a B usant només els enllaços interns de Wikipedia.',
    'htp.step2.p.full':'Veuràs l\'article de Wikipedia complet amb imatges, índex i tota la informació. Els enllaços blaus són el teu camí.',
    'htp.step3.p.full':'Continua saltant d\'article en article fins arribar a la destinació. El panell lateral mostra la teva puntuació en temps real.',
    'htp.sc.link':'Enllaç clicat',
    'htp.sc.time':'Cada 30 segons',
    'htp.sc.back':'Tornar enrere',
    'htp.sc.link.pts':'−40 pts',
    'htp.sc.time.pts':'−30 pts',
    'htp.sc.back.pts':'−80 pts',
    'htp.sc.link.desc':'L\'acció més comuna. Planifica bé abans de clicar.',
    'htp.sc.time.desc':'Pressió de temps suau però constant.',
    'htp.sc.back.desc':'El doble que avançar. Fes-ho servir amb cap.',
    'lb.title.h1':'Rànquing de jugadors',
    'st.last20':'Últimes 20 partides',
    'st.best.games':'Millors partides',
    'page.title.index':'WikiRace — Navega Wikipedia com un joc',
    'page.title.htp':'WikiRace — Com jugar',
    'page.title.lb':'WikiRace — Classificació',
    'page.title.about':'WikiRace — Sobre el joc',
    'page.title.stats':'WikiRace — Les meves estadístiques',
    'page.title.multi':'WikiRace — Multijugador',
    'cta.btn.text':'Jugar ara →',
    'diff.hard':'Difícil',
    'diff.med':'Mitjana',
    'ex.cta.btn':'Crear la meva ruta →',
    'foot.about':'Sobre WikiRace',
    'foot.howto':'Com jugar',
    'foot.lb':'Classificació',
    'footer.made':'Fet amb',
    'footer.wiki':'Wikipedia',
    'hero.howto.btn':'Com jugar',
    'hero.lb.btn':'Classificació',
    'hero.multi':'Multijugador',
    'hero.play.main':'Jugar ara',
    'hero.prepared':'A punt?',
    'hero.tagline2':'usant <strong>només els enllaços</strong>. Simple. Addictiu.',
    'sc1.pts':'-40',
    'sc2.pts':'-30',
    'sc3.pts':'-80',
    'stats.best':'La teva millor puntuació',
    'stats.day':'Partida #',
    'stats.played':'Partides jugades',
    'step1.num':'01',
    'step2.num':'02',
    'step3.num':'03',
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
  // update dark mode labels
  document.querySelectorAll('.dm-label').forEach(function(el){
    var isDk = document.body.classList.contains('dark');
    el.textContent = isDk ? t('dm.light') : t('dm.dark');
  });
  // update <html lang>
  document.documentElement.lang = code;
  // close any lang dropdown
  document.querySelectorAll('.lang-dd').forEach(function(d){ d.classList.remove('open'); });
  // update page <title>
  var pageTitleKey = document.body.getAttribute('data-title-key');
  if(pageTitleKey){ var pt = (TRANSLATIONS[code]||TRANSLATIONS.es||{})[pageTitleKey]; if(pt) document.title = pt; }
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

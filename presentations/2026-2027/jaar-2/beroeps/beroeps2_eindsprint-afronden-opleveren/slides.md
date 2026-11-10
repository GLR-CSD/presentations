<!-- frontmatter
title: "Eindsprint: afronden & opleveren"
cohort: "2026-2027"
leerjaar: 2
periode: 2
auteur: "Docententeam CSD"
tags: ["Beroeps", "Agile", "Eindsprint", "Oplevering", "Plesk", "Stand-up", "Werkles"]
-->

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:40px"></div>
<p class="kicker kicker--lime">Beroeps 2 · Stop de ontkoking · Eindsprint</p>
<h1 class="title title--xl" style="color:#fff">Eindsprint.<br>Donderdag staat het online.</h1>
<div class="rows" style="margin-top:20px">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Vandaag + donderdag</h3><p>Afmaken en opleveren.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Donderdag</h3><p>Uitleg over het opnemen van je eindpresentatie.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Volgende week</h3><p>Testen en een testverslag schrijven.</p></div></div>
</div>
<div class="defbox" style="margin-top:20px;max-width:980px">
  <span class="k">Nu direct · bij binnenkomst</span>
  <ul class="check" style="margin-top:4px">
    <li>Ga bij je <strong style="color:#fff">Agile-team</strong> zitten en open bord, repo, VS Code en Plesk.</li>
    <li>Telefoon <strong style="color:#fff">weg</strong>, in je tas.</li>
  </ul>
</div>
<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">01</span></div>

Note: Laat deze slide op het scherm staan als de studenten binnenkomen. Geen uitleg vooraf. Maak daarna in één minuut duidelijk: er zijn nog twee bouwlessen (vandaag en donderdag). Donderdag krijgen ze ook uitleg over het opnemen van de eindpresentatie (Release Video). Volgende week wordt er niet meer gebouwd, maar getest en een testverslag geschreven.

---

## Opgeleverd is pas opgeleverd als het werkt, online staat en gedocumenteerd is

<div class="cards">
  <div class="glr-card glr-card--accent fragment"><span class="k">01 · Op main</span><h3>Gemerged</h3><p>Alle Musts uit jullie MoSCoW werken, via gereviewde PR's. <code>database.sql</code> is actueel.</p></div>
  <div class="glr-card fragment"><span class="k">02 · Online</span><h3>Op Plesk</h3><p>App draait op de server, database geïmporteerd, live-URL werkt op je telefoon.</p></div>
  <div class="glr-card fragment"><span class="k">03 · Gedocumenteerd</span><h3>README + docs</h3><p>README met live-URL, installatie en team. Docs 01 t/m 04 compleet in <code>/docs/</code>.</p></div>
</div>
<div class="callout fragment"><span class="dot"></span><div><h3>Let op</h3><p>Volgende week testen we wat online staat, niet wat op je laptop draait.</p></div></div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">02</span></div>

Note: Dit is de Definition of Done voor de oplevering. Verwijs naar de MVP-MoSCoW uit de scope-reset-les: tabel recepten + database.sql, overzicht en detail, filter, toevoegen, responsive en Git Golden Path. Login en admin zijn geschrapt. Should/Could (UPDATE/DELETE, favorieten) pas oppakken als alle Musts op main staan. Vraag per punt: hoeveel teams hebben dit al?

---

<div class="row">
  <div class="col" style="flex:1 1 64%">
    <p class="kicker">Stap 1 · Daily stand-up · max. 5 minuten</p>
    <h2 class="title title--sm">Wat staat er nog tussen jullie en de oplevering?</h2>
    <div class="rows">
      <div class="listrow fragment"><span class="n">01</span><div><h3>Welke Must of welk opleverpunt is nog niet af?</h3></div></div>
      <div class="listrow fragment"><span class="n">02</span><div><h3>Welk issue pak ik vandaag, en wat staat er donderdag van mij op main?</h3></div></div>
      <div class="listrow fragment"><span class="n">03</span><div><h3>Waar loop ik vast, of welke PR wacht op review?</h3></div></div>
    </div>
    <p class="body" style="margin-top:24px"><strong>Scrum Master:</strong> zet het resterende werk als issues op het bord, verdeeld over vandaag en donderdag. Past het niet? Dan naar <em>Won't</em>.</p>
  </div>
  <div class="col" style="flex:1 1 36%">
    <div class="timer" data-timer="05:00" role="group" aria-label="Stand-up-timer 5 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">05:00</span><span class="t-label">Stand-up</span></div>
      </div>
      <div class="t-btns">
        <button class="t-btn t-start" type="button">Start</button>
        <button class="t-btn t-reset" type="button">Reset</button>
      </div>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">03</span></div>

Note: Start de timer: maximaal vijf minuten voor het hele team. Loop langs de tafels en luister mee. Zorg dat elk team de Plesk-deploy als eigen issue op naam op het bord heeft staan; dat wordt anders vaak vergeten tot donderdag. Schakel daarna door naar de volgende slide en laat die de rest van de les staan.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar bar--thin" style="margin-top:20px"></div>
<p class="kicker kicker--lime">Stap 2 · Aan de slag · tot het einde van de les</p>
<h2 class="title" style="color:#fff;font-size:68px">Afmaken gaat vóór uitbreiden.</h2>

<div class="rules">
  <div class="rule">
    <span class="k">01 · Must eerst</span>
    <h3>Geen nieuwe features</h3>
    <p>Zolang er een Must open staat.</p>
  </div>
  <div class="rule">
    <span class="k">02 · Vandaag al online</span>
    <h3>Eerste versie op Plesk</h3>
    <p>Wacht er niet mee tot donderdag.</p>
  </div>
  <div class="rule">
    <span class="k">03 · Alles via een PR</span>
    <h3>Review en merge naar main</h3>
    <p>Geen directe pushes.</p>
  </div>
  <div class="rule rule--alert">
    <span class="k">04 · Vast?</span>
    <h3>Eerst je team, na 15 minuten de docent</h3>
    <p>Telefoon in je tas, alleen projectwerk op je scherm.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">04</span></div>

Note: Deze slide blijft de hele werktijd op het scherm staan. Loop rond en check: heeft iedereen een issue op naam in In progress? Staat er al een eerste versie online? Aan het eind van de les noemt elke Scrum Master hoeveel van de drie opleverpunten (main, online, README + docs) af zijn. Donderdag gaan we hiermee verder.

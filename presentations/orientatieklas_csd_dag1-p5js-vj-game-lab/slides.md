<!-- frontmatter
title: "Dag 1 · The Interactive VJ & Game Lab (p5.js)"
cohort: "2026-2027"
leerjaar: "oriëntatieklas"
periode: 1
auteur: "Docententeam CSD"
tags: ["Oriëntatieklas", "CSD", "p5.js", "Creative Coding", "JavaScript", "Game", "VJ", "Kaleidoscoop", "Vuurwerk", "Aim-Trainer"]
-->

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar bar--thin glr-r1" style="margin-top:34px;background:#A6E22E"></div>
<p class="kicker kicker--lime glr-r1" style="letter-spacing:0.16em">GLR · Creative Software Developer · Oriëntatieklas · Dag 1 · The VJ &amp; Game Lab</p>

<h1 class="title glr-r2" style="color:#fff;font-size:116px;line-height:0.92;margin:22px 0 0">Vandaag ben jij<br><span class="glr-maker" style="color:#A6E22E;text-shadow:0 0 30px rgba(166,226,46,0.6)">de maker.</span></h1>

<p class="lede glr-r3" style="color:#EDEDED;font-size:28px;max-width:900px;margin-top:24px">Met p5.js bouw je vandaag een neon-kaleidoscoop, een vuurwerk-engine en je eigen mini-game.</p>

<div class="glr-r4" style="background:#0D0E12;border:2px solid #333;padding:16px 22px;max-width:780px;margin:26px auto 0;text-align:left;font-family:Consolas,Monaco,monospace;font-size:18px;line-height:1.6">
  <span style="color:#A6E22E">&gt;</span> <span style="color:#fff">start glr-studio --dag1</span><br>
  <span style="color:#A6E22E">&gt;</span> <span style="color:#EDEDED">p5.js geladen</span> <span style="color:#76B800">✓</span><br>
  <span style="color:#A6E22E">&gt;</span> <span style="color:#EDEDED">neon · vuurwerk · game</span> <span style="color:#76B800">✓</span><br>
  <span style="color:#A6E22E">&gt;</span> <span style="color:#A6E22E">wachten op jou</span> <span class="glr-cursor" style="color:#fff">▊</span>
</div>

<div class="glr-r5" style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
  <span style="border:1px solid #444;color:#EDEDED;padding:6px 14px;font-size:15px">Nu: <strong style="color:#A6E22E">reader</strong> open — tab 01</span>
  <span style="border:1px solid #444;color:#EDEDED;padding:6px 14px;font-size:15px"><strong style="color:#A6E22E">editor.p5js.org</strong> open</span>
  <span style="border:1px solid #444;color:#EDEDED;padding:6px 14px;font-size:15px">telefoon <strong style="color:#A6E22E">weg</strong></span>
</div>

<style>
@keyframes glr-glow { 0%,100% { text-shadow:0 0 16px rgba(166,226,46,.45),0 0 32px rgba(166,226,46,.25); } 50% { text-shadow:0 0 28px rgba(166,226,46,.9),0 0 64px rgba(166,226,46,.55),0 0 90px rgba(166,226,46,.35); } }
.glr-glow { animation:glr-glow 2.4s ease-in-out infinite; }
@keyframes glr-blink { 0%,49% { opacity:1; } 50%,100% { opacity:0; } }
.glr-cursor { animation:glr-blink 1s steps(1) infinite; }
@keyframes glr-up { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
@keyframes glr-in { from { opacity:0; } to { opacity:1; } }
@keyframes glr-pop { 0% { opacity:0; transform:scale(.72); } 60% { opacity:1; transform:scale(1.05); } 100% { transform:scale(1); } }
.glr-r1 { animation:glr-up .6s ease-out .15s both; }
.glr-r2 { animation:glr-up .6s ease-out .4s both; }
.glr-maker { animation:glr-pop .65s cubic-bezier(.16,.84,.28,1) .72s both, glr-glow 2.4s ease-in-out 1.5s infinite; }
.glr-r3 { animation:glr-up .6s ease-out 1.05s both; }
.glr-r4 { animation:glr-in .7s ease-out 1.4s both; }
.glr-r5 { animation:glr-up .6s ease-out 1.75s both; }
</style>

<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">01</span></div>

Note: Laat deze slide staan terwijl studenten binnenkomen; er hoeft nog niets te worden uitgelegd. Praat kort door het 'terminal'-blok heen als visuele hook: vandaag geen theorie-college, maar zelf aan de knoppen. Controleer dat iedereen de reader (tab 01) en de p5.js-editor open heeft en de telefoon weg is. Dit is een oriëntatieklas van 4 uur, dus het tempo mag laagdrempelig en speels.

---





<div class="row" style="margin-top:36px;align-items:center">
  <div class="col" style="flex:0 0 260px">
    <div style="width:230px;height:230px;border:2px dashed #C9CBD1;background:#F4F4F6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#A0A2A8;font-family:'Space Grotesk',sans-serif;">
      <span style="font-size:38px;line-height:1">&#128247;</span>
      <span style="font-size:14px;text-transform:uppercase;letter-spacing:0.14em">Foto</span>
    </div>
  </div>
  <div class="col" style="flex:1 1 auto;text-align:left">
    <p class="kicker">Even voorstellen</p>
    <h2 class="title" style="font-size:80px;line-height:1;margin:12px 0 18px">Dhr. Loos</h2>
    <p class="body" style="font-size:23px;margin:0">Docent <strong>Creative Software Developer</strong></p>
    <p class="body" style="font-size:19px;color:#6B6E76;max-width:600px;margin-top:8px">Grafisch Lyceum Rotterdam · deze week laat ik je zien dat code net zo creatief is als een penseel.</p>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span></div>

Note:
Stel jezelf in ±2 minuten voor. Zet een (pas)foto of ander plaatje in het fotovlak links en vervang de tekst met je eigen gegevens (voornaam, rol, een kort persoonlijk feitje). Houd het beknopt en vertel kort wat de komende week te wachten staat.
---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:60px"></div>
<p class="kicker kicker--lime">Straks bouw jij dit · zelf, met code</p>
<p class="big-q">Drie dingen die jij zo meteen laat draaien:</p>
<div class="rows rows--tight">
  <div class="listrow"><span class="n">01</span><div><h3>Een laser-kaleidoscoop die je muis volgt</h3><p class="fragment">Vier spiegels uit één lijn code.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>Een vuurwerk dat ontploft als je klikt</h3><p class="fragment">Zestig neon-bollen per muisklik.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>Een eigen Aim-Trainer game</h3><p class="fragment">Klik op doelen, bouw een score.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">02</span></div>

Note: Laat de drie eindresultaten één voor één verschijnen (fragment). Vraag nog niet om code-uitleg: dit is bedoeld om zin te maken en te laten zien dat het doel van vandaag concreet en haalbaar is. Optioneel: zet alvast een werkend kaleidoscoop-voorbeeld open als 'appetizer' naast deze slide.

---

<p class="kicker">Even opwarmen · Denk – deel · 2 minuten</p>
<p class="big-q">Heb jij weleens code gezien, gespeeld of zelf geprobeerd?</p>
<p class="lede" style="font-size:26px;max-width:900px;margin-top:26px">Minecraft-redstone? Een game-mod? Een website-builder? Scratch? Vertel je buur: <strong>wat deed jij al — en vond je het leuk?</strong></p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">03</span></div>

Note: Bewust superlaagdrempelig: het is een eerste kennismaking, dus er is geen 'juiste' voorkennis. Het doel is dat studenten ontdekken dat ze al meer met logica/code hebben gedaan dan ze denken. Haal na 2 minuten 3 à 4 antwoorden op en benoem telkens de link: 'dat is óók programmeren!' Houd het positief en zonder oordeel.

---

<p class="kicker">Doelen · waar werken we naartoe?</p>
<h2 class="title title--md">Aan het einde van deze les kun je …</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Een werkend p5.js-voorbeeld remixen</h3><p>Voorbeeld openen in de editor en zelf aanpassen.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Tekenen met lijnen, kleuren en de muis</h3><p>Je begrijpt <code>setup</code> en <code>draw</code> in de kern.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Een mini-game uitbouwen en testen</h3><p>Eigen remix laten zien tijdens de Gallery Walk.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">04</span></div>

Note: Houd dit kort: drie concrete doelen in gewone taal (geen jargon). Koppel elk doel meteen aan de drie quests uit de reader, zodat studenten snappen dat elk doel samenhangt met iets dat ze vandaag écht gaan maken. Laat één student elk doel hardop lezen.

---

<p class="kicker">Route · hoe vullen we de 4 uur?</p>
<h2 class="title title--md">Eerst kijken, dan zelf bouwen, dan delen</h2>
<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3>Inloop & wat is een CSD?</h3><p>~20 min · reader + editor openen, lesoverzicht.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>Remixen uitgelegd + korte demo</h3><p>~20 min · het remix-model en de p5.js-tools.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>Bouwlab · Tier 1 → 2 → 3</h3><p>~2 uur · in je eigen tempo.</p></div></div>
  <div class="listrow"><span class="n">04</span><div><h3>Gallery Walk & reflectie</h3><p>~30 min · laat je game zien, vul je Kompas in.</p></div></div>
  <div class="listrow"><span class="n">05</span><div><h3>Buffer / uitloop</h3><p>~30 min · bewust leeg: doorbouwen of helpen.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">05</span></div>

Note: Dit is bewust géén volgeplande 4 uur: er zit structurele buffer in (blok 05) en de pauze verschuift naar behoefte. Benoem expliciet dat studenten op hun eigen tier werken en dat niemand op de rest hoeft te wachten. Pas de tijden aan de daadwerkelijke start aan.

---

<p class="kicker">De kern · hoe echte developers werken</p>
<h2 class="title title--md">Developers schrijven niet vanaf een leeg scherm — ze remixen.</h2>
<p class="lede" style="max-width:940px">Je opent een werkend voorbeeld uit de documentatie en bouwt het om. Dat is precies wat professionals elke dag doen.</p>
<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3>Zoeken · kies een voorbeeld</h3><p>Ga naar <strong>p5js.org/examples</strong> en kies iets dat jou aanspreekt.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>Openen · plak in de editor</h3><p>Druk op <strong>Play</strong> in <strong>editor.p5js.org</strong> en kijk.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>Verbouwen · verander getallen</h3><p>Elke aanpassing zie je direct terug op je scherm.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">06</span></div>

Note: Dit is de belangrijkste conceptuele slide: het 'remix-model' haalt de prestatiedruk weg (niemand hoeft vanaf nul te coderen). Demo de drie stappen live: open een voorbeeld van p5js.org, plak het in de editor en verander één getal zodat iedereen ziet dat niets 'stuk' kan gaan. Benoem dat fouten maken hier juist hoort.

---

<p class="kicker">De bouwstenen · even kort</p>
<h2 class="title title--md">Elke p5.js-sketch heeft twee onderdelen</h2>
<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3><code>setup()</code> · één keer</h3><p>Runt één keer bij de start: canvas, kleurmodus, achtergrond.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3><code>draw()</code> · keer op keer</h3><p>Runt ~60× per seconde: hier gebeuren animatie en muis-tracking.</p></div></div>
</div>
<p class="body" style="margin-top:26px;max-width:940px">Je hoeft dit niet uit je hoofd te kennen. Je leest het af van de voorbeelden en verandert <code>getallen</code> en <code>kleuren</code> — dat is vandaag genoeg.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">07</span></div>

Note: Bewust kort: dit is géén volledige programmeerles. De boodschap is 'je hoeft het niet te kennen, alleen af te lezen en te veranderen'. Wijs op de twee plekken: Voorbeelden om te kiezen, Editor om te bouwen. Laat kort zien waar de Play-knop staat in editor.p5js.org.

---

<p class="kicker">Opdracht · vandaag</p>
<h2 class="title title--md">Drie quests, drie levels: kies je eigen uitdaging</h2>
<div class="rows">
  <div class="listrow"><span class="n">1.1</span><div><h3>Neon Laser Kaleidoscoop</h3><p><strong>Tier 1</strong> · spiegel een lijn vier keer en laat hem je muis volgen.</p></div></div>
  <div class="listrow"><span class="n">1.2</span><div><h3>Vuurwerk &amp; zwaartekracht</h3><p><strong>Tier 2</strong> · zestig neon-bollen die exploderen als je klikt.</p></div></div>
  <div class="listrow"><span class="n">1.3</span><div><h3>Aim-Trainer game</h3><p><strong>Tier 3</strong> · klikbaar doelwit met live score, of een eigen remix.</p></div></div>
</div>
<p class="body" style="margin-top:22px;max-width:940px">De volledige startcode (met <code>TODO</code>-stappen en oplossingen) staat in de <strong>reader</strong> onder tab 01. Kopieer van daar.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">08</span></div>

Note: De reader (tab 01 · Dag 1) bevat per tier de kant-en-klare startcode mét kopieer-knop, de TODO-stappen en de volledige oplossing. Benoem dat niemand de code hoeft te typen of te onthouden: kopiëren uit de reader, plakken in de editor, en veranderen. Iedereen start bij Tier 1; wie klaar is gaat door. De tiers zijn bewust open (eigen tempo, eigen niveau).

---

<p class="kicker">Tier 1 · Foundations</p>
<h2 class="title title--md">De Neon Laser Kaleidoscoop</h2>
<p class="lede" style="max-width:940px">Gebaseerd op het officiële <strong>Kaleidoscope</strong>-voorbeeld van p5.js. Drie kleine stappen:</p>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Laat je lijn vervagen tot neon-licht</h3><p>Verander <code>background(0, 0, 0, 25)</code> naar <code>background(0, 0, 0, 6)</code>.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Zet de spiegel aan</h3><p>Haal <code>//</code> weg voor de regel <code>line(width - pmouseX, ...)</code>.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Spiegel ook de hoogte</h3><p>Kopieer de regel nog twee keer, nu met <code>height - pmouseY</code>.</p></div></div>
</div>
<p class="body" style="margin-top:20px"><strong>Klaar?</strong> Vink Quest 1.1 af in de reader en ga door naar Tier 2.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">09</span></div>

Note: Dit is de 'uitgelegde' tier: loop de drie stappen voor op het scherm terwijl studenten meedoen. Leg kort uit dat `//` 'comment-out' betekent (JavaScript negeert die regel). Het vierde getal in background is de doorzichtigheid: lager = langer na-licht. Zodra iemand zijn kaleidoscoop ziet bewegen, is de 'wow' er meteen — gebruik dat moment om energie vast te houden.

---

<p class="kicker">Tier 2 · Application</p>
<h2 class="title title--md">Particle Fountain & Vuurwerk</h2>
<p class="lede" style="max-width:940px">Voeg zwaartekracht toe en laat zestig neon-bollen ontploffen op elke muisklik:</p>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Zwaartekracht</h3><p>Typ in de loop: <code>p.vy += 0.2;</code></p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Meer deeltjes</h3><p>Verander <code>i &lt; 5</code> naar <code>i &lt; 60</code>.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>De knal</h3><p>Snelheid naar <code>random(-12, 12)</code> voor een grote explosie.</p></div></div>
</div>
<p class="body" style="margin-top:20px">Dit level leert je het kernidee achter elk spel: <strong>beweging + krachten</strong>.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">10</span></div>

Note: Zwaartekracht is het conceptuele hoogtepunt: bij élk deeltje voeg je elke frame een beetje snelheid naar beneden toe (vy += 0.2), precies hoe een bal valt. Laat de klas dit nu grotendeels zelf doen; loop rond en help individueel. Wie het snapt, mag kleur of grootte zelf aanpassen. Vink Quest 1.2 af in de reader.

---

<p class="kicker">Tier 3 · Boss level</p>
<h2 class="title title--md">Aim-Trainer game (of je eigen remix)</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Een klikbaar doelwit</h3><p>Een cirkel die reageert als je erop klikt.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Een live scoreteller</h3><p>Tel elke hit op en toon de score op het scherm.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Óf: eigen remix</h3><p>Kies een ander voorbeeld op <strong>p5js.org/examples</strong> en bouw het om.</p></div></div>
</div>
<p class="body" style="margin-top:20px">Test je game goed — straks laat je hem zien tijdens de <strong>Gallery Walk</strong>.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">11</span></div>

Note: De vrije tier: wie Tier 2 af heeft, bouwt een klikbaar doelwit met score, of kiest zélf een voorbeeld om te remixen (geschikt voor snelle én creatieve studenten). Moedig eigen keuzes aan. De Gallery Walk is het stok achter de deur: je game moet op het scherm werken. Vink Quest 1.3 af in de reader.

---

<div class="row">
  <div class="col" style="flex:1 1 62%">
    <p class="kicker">Bouwlab · tot de Gallery Walk</p>
    <h2 class="title title--sm">Aan de slag — in je eigen tempo</h2>
    <div class="rows">
      <div class="listrow"><span class="n">01</span><div><h3>Start bij Tier 1</h3><p>Iedereen begint met de kaleidoscoop.</p></div></div>
      <div class="listrow"><span class="n">02</span><div><h3>Vast? Eerst je buur, dan de docent</h3><p>Vraag iemand naast je voordat je je hand opsteekt.</p></div></div>
      <div class="listrow"><span class="n">03</span><div><h3>Klaar? Ga door of help</h3><p>Volgende tier pakken, of een klasgenoot op weg helpen.</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:1 1 38%">
    <div class="timer" data-timer="45:00" role="group" aria-label="Bouwtijd 45 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">45:00</span><span class="t-label">Bouwlab</span></div>
      </div>
      <div class="t-btns">
        <button class="t-btn t-start" type="button">Start</button>
        <button class="t-btn t-reset" type="button">Reset</button>
      </div>
    </div>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">12</span></div>

Note: Werk-slide; laat hem de hele bouwtijd staan als geheugensteun. Start de timer (45 min als richtlijn; pauze verschuift naar behoefte). Loop rond, help individueel en vier kleine successen hardop. Let op studenten die afhaken en moedig de 'help je buur'-stap aan — samen praten is óók de maker-mindset.

---

<p class="kicker">Gallery Walk · laat het zien</p>
<h2 class="title title--md">Loop langs elkaars schermen en geef feedback</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Vertel wat je hebt gebouwd</h3><p>Welke tier heb je gehaald, en wat heb je zelf veranderd?</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Benoem één cool ding bij een ander</h3><p>Wat vind je sterk aan de sketch van je klasgenoot?</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Stel één 'hoe?'-vraag</h3><p>Bijvoorbeeld: hoe heb je die explosie zo fel gekregen?</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">13</span></div>

Note: Laat de klas opstaan en kort rondlopen langs 3 à 4 schermen. Doel is tweeledig: trots en feedback. Studenten zien dat klasgenoten tot dezelfde 'wow' kwamen en krijgen concrete tips. 10-15 minuten is genoeg. Haal daarna klassikaal 2 mooie vondsten naar voren en koppel ze aan de leerdoelen van slide 4.

---

<p class="kicker">Check · wat heb je vandaag gehaald?</p>
<h2 class="title title--md">Vink je quests af in de reader</h2>
<ul class="check">
  <li><strong>Quest 1.1</strong> — kaleidoscoop die je muis volgt en spiegelend tekent.</li>
  <li><strong>Quest 1.2</strong> — zwaartekracht toegevoegd en een vuurwerk-explosie van 60 bollen.</li>
  <li><strong>Quest 1.3</strong> — een doelwit met score, of een eigen remix getest in de Gallery Walk.</li>
</ul>
<p class="body" style="margin-top:18px;max-width:940px">Nog niet alles af? <strong>Geen stress</strong> — de buffer aan het einde is er juist voor. Vink af wat je hebt.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">14</span></div>

Note: Laat studenten zelf hun voortgang afvinken in de reader (tab 01); dat is meteen de zelfevaluatie. Benadruk dat dit géén cijfer is en dat 'niet af' hoort bij het verkennen van de opleiding. Peil met een simpele stemronde wie welke tier heeft gehaald — dat geeft jou een beeld en de klas een succesmoment.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar bar--thin" style="margin-top:20px"></div>
<p class="kicker kicker--lime">Wat neem je mee?</p>
<h2 class="title" style="color:#fff;font-size:60px">Drie dingen om te onthouden</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Code is een penseel</h3><p>Verander een getal, zie direct resultaat.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Developers remixen</h3><p>Werkende voorbeelden verbouwen, niet vanaf nul beginnen.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Fouten maken hoort erbij</h3><p>Niets gaat 'stuk'; je bouwt en probeert gewoon.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">15</span></div>

Note: Vat samen in drie pakkende zinnetjes en laat een student elk punt aan een eigen voorbeeld uit de les koppelen. Dit legt de basis voor de reflectievraag op de volgende slide: past 'iets maken met code' bij mij?

---

<p class="kicker">Reflectie & vooruitblik</p>
<h2 class="title title--md">Welke maker ben jij — en wat komt er morgen?</h2>
<div class="row" style="margin-top:10px">
  <div class="col" style="flex:1 1 55%">
    <p class="body">Vond je het <strong>vet</strong> om met code visueel te toveren? Open in de reader het tabblad <strong>Studiekeuze-Kompas</strong> en vink aan waar jij energie van kreeg.</p>
  </div>
  <div class="col" style="flex:1 1 45%">
    <p class="kicker">Morgen · Dag 2</p>
    <ul class="check">
      <li>VR-wereld bouwen in de browser (A-Frame)</li>
      <li>Geheime 3D-inspector: Ctrl+Alt+I</li>
      <li>Rondlopen met de Meta Quest 2</li>
    </ul>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 1 · p5.js</span><span class="num">16</span></div>

Note:
Sluit af met twee dingen: (1) de reflectie via het Studiekeuze-Kompas in de reader (aansluiting op studiekeuze), en (2) een teaser voor Dag 2 (WebVR + Quest 2) om nieuwsgierigheid naar de rest van de week op te bouwen. Bedank de klas en benoem nogmaals: dit was écht programmeren — en jullie hebben het zojuist zelf gedaan.

Morgen (Dag 2) stap je een wereld binnen: je bouwt in de browser een 3D-wereld met A-Frame en wandelt er doorheen met de Meta Quest 2.
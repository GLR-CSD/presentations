<!-- frontmatter
title: "Dag 2 · VR Experience & No-Code 3D Studio (A-Frame)"
cohort: "2026-2027"
leerjaar: "oriëntatieklas"
periode: 1
auteur: "Dhr. Loos"
tags: ["Oriëntatieklas", "CSD", "A-Frame", "WebXR", "VR", "Meta Quest 2", "Moon Rider", "FrameVR", "CodePen", "No-Code", "Unity", "DIM"]
-->

<!-- .slide: class="dark" data-background-color="#111111" -->

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
.vr-btn { display:inline-block;background:#111;color:#A6E22E;border:2px solid #A6E22E;padding:10px 16px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;margin:6px 4px; }
</style>

<div class="bar bar--thin glr-r1" style="margin-top:34px;background:#A6E22E"></div>
<p class="kicker kicker--lime glr-r1" style="letter-spacing:0.16em">GLR · Creative Software Developer · Oriëntatieklas · Dag 2 · VR Experience &amp; 3D Studio</p>
<h1 class="title glr-r2" style="color:#fff;font-size:116px;line-height:0.92;margin:22px 0 0">Vandaag stap je<br><span class="glr-maker" style="color:#A6E22E;text-shadow:0 0 30px rgba(166,226,46,0.6)">erin.</span></h1>
<p class="lede glr-r3" style="color:#EDEDED;font-size:28px;max-width:900px;margin-top:24px">Je test VR-games op de Meta Quest 2, bouwt zonder code een eigen 3D-wereld en strijdt mee om de GLR Studio Awards.</p>
<div class="glr-r4" style="background:#0D0E12;border:2px solid #333;padding:16px 22px;max-width:780px;margin:26px auto 0;text-align:left;font-family:Consolas,Monaco,monospace;font-size:18px;line-height:1.6">
  <span style="color:#A6E22E">&gt;</span> <span style="color:#fff">start glr-studio --dag2</span><br>
  <span style="color:#A6E22E">&gt;</span> <span style="color:#EDEDED">10× Meta Quest 2 opgeladen</span> <span style="color:#76B800">✓</span><br>
  <span style="color:#A6E22E">&gt;</span> <span style="color:#EDEDED">A-Frame geladen · x y z</span> <span style="color:#76B800">✓</span><br>
  <span style="color:#A6E22E">&gt;</span> <span style="color:#A6E22E">wachten op jou</span> <span class="glr-cursor" style="color:#fff">▊</span>
</div>
<div class="glr-r5" style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
  <span style="border:1px solid #444;color:#EDEDED;padding:6px 14px;font-size:15px">Nu: <strong style="color:#A6E22E">reader</strong> open — tab 02</span>
  <span style="border:1px solid #444;color:#EDEDED;padding:6px 14px;font-size:15px"><strong style="color:#A6E22E">codepen.io</strong> open</span>
  <span style="border:1px solid #444;color:#EDEDED;padding:6px 14px;font-size:15px">telefoon <strong style="color:#A6E22E">weg</strong></span>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span></div>

Note: Inloop 09:15–09:25: laat deze slide staan terwijl studenten binnenkomen; de animatie speelt vanzelf. Check dat de 10 Quests opgeladen klaarliggen en de Guardian/grens per plek is ingesteld. Studenten openen alvast de reader (tab 02) en codepen.io. Om 09:25 start je met het filmpje op de volgende slide. Dag van 09:15–14:00 met pauzes 10:15–10:30 en 12:30–13:00 (netto ±230 min les).

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<p class="kicker kicker--lime">09:25 · we beginnen met een filmpje</p>
<h2 class="title title--md" style="color:#fff">Deze werelden draaien gewoon in een browser, en straks die van jou ook</h2>
<figure class="embed" style="max-width:820px;margin:16px auto 0">
  <iframe data-src="https://www.youtube-nocookie.com/embed/1MskH9uqOyQ" title="WebVR and A-Frame Showcase in Firefox" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
</figure>
<p class="body" style="color:#EDEDED;margin-top:14px;text-align:center">Kijkvraag: <strong style="color:#A6E22E">welke wereld zou jij binnenstappen?</strong></p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">01</span></div>

Note: Fase 1 DIM — aandacht trekken (09:25). Stel de kijkvraag vóór je op Play drukt: "Welke wereld zou jij binnenstappen, en waarom?" Video: "WebVR and A-Frame Showcase in Firefox" (Mozilla Hacks), https://www.youtube.com/watch?v=1MskH9uqOyQ. Haal na afloop 2–3 antwoorden op en benoem de kern: dit is allemaal gemaakt met A-Frame, gewoon HTML in de browser, precies waarmee jullie vandaag werken. Werkt de embed niet (schoolnetwerk), open dan de YouTube-link in een nieuw tabblad.

---

<p class="kicker">Terugblik · gisteren → vandaag</p>
<h2 class="title title--md">Gisteren tekende je met x en y, vandaag komt er een z bij</h2>
<div class="row" style="margin-top:14px;align-items:center">
  <div class="col" style="flex:1 1 50%;text-align:center">
    <svg style="display:block;margin:0 auto" width="300" height="230" viewBox="0 0 300 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="2D-assenstelsel met x en y, zoals in p5.js">
      <rect x="20" y="10" width="260" height="190" fill="#F4F4F6" stroke="#111111" stroke-width="2"/>
      <line x1="40" y1="30" x2="250" y2="30" stroke="#111111" stroke-width="3"/>
      <polygon points="258,30 246,24 246,36" fill="#111111"/>
      <text x="262" y="56" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="18" fill="#111111">x</text>
      <line x1="40" y1="30" x2="40" y2="180" stroke="#111111" stroke-width="3"/>
      <polygon points="40,188 34,176 46,176" fill="#111111"/>
      <text x="52" y="186" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="18" fill="#111111">y</text>
      <circle cx="160" cy="110" r="10" fill="#A6E22E" stroke="#111111" stroke-width="2"/>
      <text x="150" y="222" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-size="15" fill="#555555">Dag 1 · p5.js · plat scherm</text>
    </svg>
  </div>
  <div class="col" style="flex:1 1 50%;text-align:center">
    <svg style="display:block;margin:0 auto" width="300" height="230" viewBox="0 0 300 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="3D-assenstelsel met x, y en z, zoals in A-Frame">
      <rect x="20" y="10" width="260" height="190" fill="#0D0E12" stroke="#111111" stroke-width="2"/>
      <line x1="120" y1="140" x2="250" y2="140" stroke="#FF0055" stroke-width="3"/>
      <polygon points="258,140 246,134 246,146" fill="#FF0055"/>
      <text x="252" y="128" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="18" fill="#FF0055">x</text>
      <line x1="120" y1="140" x2="120" y2="30" stroke="#A6E22E" stroke-width="3"/>
      <polygon points="120,22 114,34 126,34" fill="#A6E22E"/>
      <text x="132" y="36" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="18" fill="#A6E22E">y</text>
      <line x1="120" y1="140" x2="56" y2="186" stroke="#00AAFF" stroke-width="3"/>
      <polygon points="50,191 58,179 64,188" fill="#00AAFF"/>
      <text x="40" y="176" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="18" fill="#00AAFF">z</text>
      <polygon points="170,70 210,70 210,105 170,105" fill="none" stroke="#A6E22E" stroke-width="2"/>
      <polygon points="170,70 186,58 226,58 210,70" fill="none" stroke="#00AAFF" stroke-width="2"/>
      <line x1="210" y1="105" x2="226" y2="93" stroke="#00AAFF" stroke-width="2"/>
      <line x1="226" y1="58" x2="226" y2="93" stroke="#00AAFF" stroke-width="2"/>
      <text x="150" y="222" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-size="15" fill="#555555">Dag 2 · A-Frame · een ruimte</text>
    </svg>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">02</span></div>

Note: Fase 1 DIM — voorkennis activeren (±2 min). Vraag: "Wat betekende mouseX gisteren?" (horizontale plek). Dan: in een 3D-wereld heb je een derde richting nodig, z = diepte (naar je toe / van je af). Koppel aan het filmpje: zonder z kun je er niet in rondlopen. Houd het luchtig; de meeste studenten hoeven vandaag geen code te typen.

---

<p class="kicker">Leerdoelen · vandaag</p>
<h2 class="title title--md">Aan het einde van vandaag kun je …</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Beoordelen wat een VR-ervaring goed of juist duizelig maakt</h3><p>Blok 2.1 · als Game Jury op de Meta Quest 2.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Zonder code een eigen 3D-wereld stylen</h3><p>Blok 2.2 · met de 1-Klik Knoppenbalk of FrameVR.io.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Een 360°-game spelen, remixen en laten testen</h3><p>Blok 2.3 · het Kristallen-Zoekspel op iMac én Quest.</p></div></div>
  <div class="listrow fragment"><span class="n">04</span><div><h3>Het werk van je klasgenoten jureren</h3><p>Blok 2.4 · het VR-Festival en de GLR Studio Awards.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">03</span></div>

Note: Fase 2 DIM — doeloriëntatie (±1 min). Vier doelen, één per blok. Benadruk: je hoeft vandaag niets te installeren en (bijna) niets te typen; de school-iMacs zijn vergrendeld, dus alles werkt in de browser.

---

<p class="kicker">Kies je studio-rol · iedereen maakt, ieder op zijn manier</p>
<h2 class="title title--md">In een echte studio heeft iedereen een eigen rol</h2>
<div class="cards">
  <div class="glr-card"><span class="k">Rol A · no-code</span><h3>3D Worldbuilder &amp; Art Director</h3><p>Je ontwerpt een planeet, filmset of 3D-expositie met knoppen of in FrameVR.io.</p></div>
  <div class="glr-card"><span class="k">Rol B · beleving</span><h3>VR Scout, Regisseur &amp; Playtester</h3><p>Je test alles op de Quest, regisseert de battles en zit in de jury.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">Rol C · code</span><h3>Creative Coder &amp; Tech Lead</h3><p>Aan de VIP-tafel: echte VR-lasertriggers in A-Frame en een kijkje in Unity VR.</p></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">04</span></div>

Note: Fase 2 DIM — differentiatie (±3 min). Achtergrond (niet hardop): wij zijn de laatste opleiding in de carrousel; ±18 van de 20 hebben al voor een andere GLR-opleiding gekozen (Mediavormgeven/3D → Rol A; AV, Podiumtechniek, Mediamanagement → Rol B). ±2 studenten met serieuze CSD-interesse → Rol C aan jouw VIP-tafel. Laat iedereen kiezen met een handopsteek en noteer de Rol C-studenten. Kerntaken: A = P2-K1 ontwerpen, B = P1-K1 concept + P4-K1 testen, C = P3-K1 realiseren. Rol B werkt in Blok 2.2 ook mee aan een wereld, zodat er straks genoeg te testen valt.

---

<p class="kicker">Route · 4 blokken · 09:25–14:00</p>
<h2 class="title title--md">Vandaag: testen, bouwen, spelen en vieren</h2>
<div class="rows rows--tight">
  <div class="listrow"><span class="n">1</span><div><h3>09:40 · VR Arcade &amp; Experience Battle</h3><p>Moon Rider en het Kristallen-Zoekspel op de Quest 2.</p></div></div>
  <div class="listrow"><span class="n">–</span><div><h3>10:15 · pauze</h3><p>15 min · brillen aan de lader.</p></div></div>
  <div class="listrow"><span class="n">2</span><div><h3>10:40 · No-Code 3D Worldbuilding</h3><p>Pakket 1 in CodePen of FrameVR.io.</p></div></div>
  <div class="listrow"><span class="n">3</span><div><h3>11:30 · 360° Kristallen Battle</h3><p>Pakket 2: verstoppen, zoeken, winnen.</p></div></div>
  <div class="listrow"><span class="n">–</span><div><h3>12:30 · lunchpauze</h3><p>30 min.</p></div></div>
  <div class="listrow"><span class="n">4</span><div><h3>13:00 · VR-Festival &amp; GLR Studio Awards</h3><p>Rondgang, jury en prijsuitreiking. Einde om 14:00.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">05</span></div>

Note: Fase 2 DIM — informeer over de opzet (±1 min). Volledige planning: 09:15–09:25 inloop · 09:25–09:40 start · 09:40–10:15 Blok 2.1 · 10:15–10:30 pauze · 10:30–10:40 nabespreking 2.1 · 10:40–11:30 Blok 2.2 · 11:30–12:30 Blok 2.3 · 12:30–13:00 lunch · 13:00–13:40 VR-Festival · 13:40–13:50 Awards · 13:50–14:00 afsluiting.

---

<p class="kicker">Blok 2.1 · eerst veilig · daarna spelen</p>
<h2 class="title title--md">In VR ben je blind voor de klas, dus je duo bewaakt je ruimte</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Je duo is je spotter</h3><p>Let op snoeren, tafels en mensen.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Blijf binnen je grens (Guardian)</h3><p>Rooster in beeld? Terug naar het midden.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Misselijk of duizelig? Bril meteen af</h3><p>Even zitten. Dat is slim, geen falen.</p></div></div>
  <div class="listrow fragment"><span class="n">04</span><div><h3>Polsband om, bril schoon terug</h3><p>Lenzen niet aanraken.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">06</span></div>

Note: Fase 3 DIM — voordoen (±4 min). Zet zelf een Quest op en laat zien: Guardian, polsband, waar de Moon Rider-link staat. 10 brillen, ±20 studenten = duo's. Benoem dat duizeligheid normaal is en dat afzetten slim is. Hygiëne: hygiënedoekjes bij elke plek.

---

<p class="kicker">Blok 2.1 · jullie zijn de Game Jury · 09:45–10:15</p>
<h2 class="title title--md">Test twee VR-games en scoor ze zoals een echte Game Jury</h2>
<div class="row" style="margin-top:10px">
  <div class="col" style="flex:1 1 55%">
    <div class="rows">
      <div class="listrow"><span class="n">A</span><div><h3>Moon Rider · <code>moonrider.xyz</code></h3><p>Ritme-game: sla op de beat van de muziek.</p></div></div>
      <div class="listrow"><span class="n">B</span><div><h3>360° Kristallen-Zoekspel</h3><p>Zoek de 6 kristallen rondom je heen.</p></div></div>
      <div class="listrow"><span class="n">⟳</span><div><h3>Wissel elke ±8 minuten</h3><p>Speler wordt spotter, spotter wordt speler.</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:1 1 45%">
    <div class="defbox">
      <span class="k">Jury-scorekaart · 1 tot 5 sterren</span>
      <p><strong>Comfort</strong> · word je er duizelig van?<br><strong>Onderdompeling</strong> · voel je dat je er écht bent?<br><strong>Interactie</strong> · reageert de wereld op jou?</p>
    </div>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">07</span></div>

Note: Fase 6 DIM — zelf ervaren (±30 min). Kerntaak P1-K1/P4-K1 (beleving & testen). Elk duo test beide games en noteert per game 1–5 sterren op de drie criteria (in de reader of op papier). Loop rond en stel vragen: "Wat deed de game om je niet duizelig te maken?" Rol B neemt de regie per plek (wie is aan de beurt, timer). Om 10:15 stoppen: brillen aan de lader, pauze.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<p class="kicker kicker--lime">Pauze · 10:15 – 10:30</p>
<h2 class="title" style="color:#fff;font-size:72px;line-height:1;margin-top:12px">Even weg van het scherm.</h2>
<p class="lede" style="color:#EDEDED;font-size:24px;margin-top:12px">Brillen aan de lader, scorekaart bewaren. Om <strong style="color:#A6E22E">10:30</strong> bespreken we wat de jury vond.</p>
<div class="timer" data-timer="15:00" role="group" aria-label="Timer 15 minuten pauze" style="margin-top:8px;transform:scale(.78);transform-origin:top center">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Pauze</span></div>
  </div>
  <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">08</span></div>

Note: Pauze 10:15–10:30. Zet alle 10 Quests aan de lader en controleer het batterijpercentage; ze zijn in Blok 2.3 en 2.4 weer nodig. Start de timer.

---

<p class="kicker">Begripscheck · 10:30 · steek 1, 2 of 3 vingers op</p>
<h2 class="title title--md">Waarom word je in sommige VR-games duizelig?</h2>
<div class="rows rows--tight">
  <div class="listrow"><span class="n">1</span><div><h3>A · Het scherm in de bril is te fel</h3></div></div>
  <div class="listrow"><span class="n">2</span><div><h3>B · Je ogen zien beweging, maar je lichaam staat stil</h3></div></div>
  <div class="listrow"><span class="n">3</span><div><h3>C · De bril is te zwaar voor je hoofd</h3></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">09</span></div>

Note: Fase 4 DIM — diagnostische begripscheck (Peer Instruction). Juist: B (2 vingers). Je evenwichtsorgaan voelt geen beweging terwijl je ogen die wel zien: die mismatch heet motion sickness. Beslisprotocol: >80% goed → één student laat het uitleggen; 30–80% → 60 sec tweetallen-overleg + herstemming; <30% → koppel aan de ervaring: "Bij welke game werd je duizelig, en bewoog jij toen zelf, of bewoog de camera?"

---

<p class="kicker">Jury-oogst · wat hebben jullie ontdekt?</p>
<h2 class="title title--md">Goede VR laat jóu bewegen, niet de camera</h2>
<div class="row" style="margin-top:14px">
  <div class="col" style="flex:1 1 50%">
    <div class="defbox fragment" style="min-height:190px">
      <span class="k">Voelt goed</span>
      <p>Jij bepaalt waar je kijkt · je beweegt met je eigen lichaam · alles reageert direct · een vast punt in beeld (horizon, cockpit).</p>
    </div>
  </div>
  <div class="col" style="flex:1 1 50%">
    <div class="defbox fragment" style="min-height:190px">
      <span class="k">Maakt duizelig</span>
      <p>De camera draait of versnelt zonder jou · haperend beeld · geen vast punt · te snel draaien met de joystick.</p>
    </div>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">10</span></div>

Note: Fase 7 DIM — feedback en nabespreking (±6 min). Laat 3–4 duo's hun hoogste en laagste score noemen, met reden. Vraag eerst zelf uit de klas, en klap pas daarna de voorbeelden aan. Brug naar Blok 2.2: "Straks bouw je zelf een wereld. Houd deze regels in je achterhoofd: jouw bezoekers moeten zich er prettig voelen." Om 10:40 door naar Blok 2.2.

---

<p class="kicker">Blok 2.2 · kijk mee (ik doe voor) · 10:40</p>
<h2 class="title title--md">Een A-Frame-wereld is gewoon HTML: elke tag is een 3D-object</h2>
<div class="row" style="margin-top:12px;align-items:center">
<div class="col code-sm" style="flex:1 1 66%">

```html [1|2|3|4]
<a-scene>
  <a-box position="0 1 -3" color="lime"></a-box>
  <a-sphere position="2 1 -4" color="red"></a-sphere>
  <a-sky color="black"></a-sky>
</a-scene>
```

</div>
<div class="col" style="flex:1 1 34%">
<div class="defbox"><span class="k">position = "x y z"</span><p><strong>x</strong> links/rechts · <strong>y</strong> omhoog · <strong>z</strong> naar je toe of van je af. <code>-3</code> betekent: 3 meter vóór je.</p></div>
</div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">11</span></div>

Note: Fase 3 DIM — modelling, kort (±3 min). Laat zien dat er achter elke VR-wereld uit het filmpje gewoon tags zitten, net als een webpagina. Loop met de regel-focus door de vier regels. Denk hardop: "Ik wil de kubus verder weg: dan maak ik z negatiever." Benadruk: Rol A en B hoeven deze code niet te typen; de knoppenbalk doet het voor je. Rol C gaat hier straks wél in duiken.

---

<p class="kicker">Blok 2.2 · samen (jij doet met mij)</p>
<h2 class="title title--md">In vier klikken staat jouw 3D-wereld in de browser</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Open de reader (tab 02) en kopieer <strong>Pakket 1</strong></h3><p>Eén knop: alles staat al klaar.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Ga naar <code>codepen.io/pen</code></h3><p>Geen account of installatie nodig.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Plak alles in het <strong>HTML</strong>-vak</h3><p>Na een paar seconden verschijnt je 3D-wereld.</p></div></div>
  <div class="listrow fragment"><span class="n">04</span><div><h3>Klik op <strong>[1. Wissel Planeet]</strong></h3><p>Werkt het? Duim omhoog.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">12</span></div>

Note: Fase 5 DIM — begeleide inoefening (±5 min). Laat de klas letterlijk meeklikken en wacht tot iedereen een duim opsteekt. Veelvoorkomend: het plakken gebeurt in het CSS- of JS-vak → alles moet in HTML. Tip: zet CodePen op "Change View → Full Page" voor een groot beeld. Wie wil opslaan: inloggen bij CodePen (gratis) of de code bewaren in een notitie.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<p class="kicker kicker--lime">Blok 2.2 · de GLR 1-Klik Knoppenbalk</p>
<h2 class="title title--md" style="color:#fff">Vier knoppen, nul sneltoetsen: je stylet je wereld met de muis</h2>
<div style="margin-top:22px;text-align:center">
  <span class="vr-btn">1. Wissel Planeet</span><span class="vr-btn">2. + Nieuw 3D Object</span><span class="vr-btn">3. Kleuren Remix</span><span class="vr-btn">4. Open Visuele 3D Editor</span>
</div>
<div class="rows" style="margin-top:22px">
  <div class="listrow"><span class="n" style="color:#A6E22E">1</span><div><h3 style="color:#fff">Tron, Forest, Japan, Egypt, Mars, Dream, Starry, Goldmine</h3><p style="color:#EDEDED">Kies de sfeer van je planeet of filmset.</p></div></div>
  <div class="listrow"><span class="n" style="color:#A6E22E">4</span><div><h3 style="color:#fff">De Visuele Editor: slepen, draaien, kleuren</h3><p style="color:#EDEDED">Klik een object aan en pas het aan, zonder één regel code.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">13</span></div>

Note: Fase 3/5 DIM — demo van de knoppenbalk (±3 min). Knop 4 roept via JavaScript scene.components.inspector.openInspector() aan, dus geen Ctrl+Option+i nodig (die sneltoets botst op de iMac met de Web Inspector van de browser). Knop 2 spawnt zwevende objecten, knop 3 geeft set en robot met één klik een nieuw kleurenpalet. Laat zien hoe je in de Editor een object selecteert en positie/kleur aanpast.

---

<p class="kicker">Blok 2.2 · jij alleen · 10:50–11:30</p>
<h2 class="title title--md">Bouw de wereld waar jij straks bezoekers in rondleidt</h2>
<div class="cards">
  <div class="glr-card"><span class="k">Rol A</span><h3>Style je planeet of filmset</h3><p>Knoppen 1–4 in Pakket 1, óf een 3D-expositie met je eigen beelden in <strong>FrameVR.io</strong>.</p></div>
  <div class="glr-card"><span class="k">Rol B</span><h3>Bouw mee en bedenk testvragen</h3><p>Maak een wereld en schrijf 3 testvragen voor het festival.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">Rol C · VIP-tafel</span><h3>Programmeer een VR-lasertrigger</h3><p><code>cursor</code> + <code>raycaster</code>: kijk of wijs naar een object en er gebeurt iets.</p></div>
</div>
<p class="body" style="margin-top:18px">Vast? Eerst <strong>Boek</strong> (reader), dan <strong>Buur</strong>, dan <strong>Baas</strong>.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">14</span></div>

Note: Fase 6 DIM — zelfstandige verwerking (±35 min). Kerntaak A: P2-K1, C: P3-K1. FrameVR.io werkt volledig in de browser, slaat automatisch op in de cloud en geeft een link die direct op de Quest 2 werkt: ideaal voor vormgevers met eigen beeldmateriaal. Jij zit grotendeels aan de VIP-tafel bij de 2 Rol C-studenten (cursor/raycaster, click-event dat kleur of positie verandert). Loop elke ±10 min een rondje langs Rol A/B. Rond 11:15 de begripscheck op de volgende slide.

---

<p class="kicker">Begripscheck · steek 1, 2 of 3 vingers op</p>
<h2 class="title title--md">Je maakt de robot paars in de Visuele Editor en ververst de pagina. Wat zie je?</h2>
<div class="rows rows--tight">
  <div class="listrow"><span class="n">1</span><div><h3>A · De robot is nog steeds paars</h3></div></div>
  <div class="listrow"><span class="n">2</span><div><h3>B · De robot heeft weer zijn oude kleur</h3></div></div>
  <div class="listrow"><span class="n">3</span><div><h3>C · De hele wereld is verdwenen</h3></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">15</span></div>

Note: Fase 4 DIM — begripscheck met een praktische valkuil (±3 min, rond 11:15). Juist: B. De A-Frame Inspector kan wijzigingen alleen opslaan met het hulpprogramma aframe-watcher, en dat mag op de vergrendelde school-iMacs niet geïnstalleerd worden. Les: ververs niet tijdens het bouwen, maak screenshots van je mooiste versie, noteer de waarden die je wilt houden of bouw in FrameVR (slaat wel op). Dit voorkomt tranen vlak voor het festival.

---

<p class="kicker">Blok 2.3 · 360° Kristallen-Zoekspel · 11:30</p>
<h2 class="title title--md">Met één klik verstop je zes kristallen rondom de speler</h2>
<div class="row" style="margin-top:10px;align-items:center">
  <div class="col" style="flex:1 1 58%">
    <div class="rows">
      <div class="listrow"><span class="n">01</span><div><h3>Plak <strong>Pakket 2</strong> (reader tab 02) in een nieuwe pen</h3><p>Zelfde trucje als bij Pakket 1.</p></div></div>
      <div class="listrow"><span class="n">02</span><div><h3>Klik <strong>[Verstop Kristallen op Nieuwe Plekken!]</strong></h3><p>Alle 6 kristallen krijgen een willekeurige plek in 360°.</p></div></div>
      <div class="listrow"><span class="n">03</span><div><h3>Open je pen op de Quest</h3><p>Full Page-link in de Quest-browser → zoeken maar.</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:1 1 42%;text-align:center">
    <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Speler in het midden met zes verstopte kristallen rondom en een scoreteller">
      <rect width="280" height="280" fill="#0D0E12"/>
      <circle cx="140" cy="140" r="96" fill="none" stroke="#333333" stroke-width="2" stroke-dasharray="6 6"/>
      <circle cx="140" cy="140" r="12" fill="#A6E22E"/>
      <text x="140" y="170" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="13" fill="#A6E22E">jij</text>
      <polygon points="140,36 148,48 140,60 132,48" fill="#00AAFF"/>
      <polygon points="222,84 230,96 222,108 214,96" fill="#00AAFF"/>
      <polygon points="222,180 230,192 222,204 214,192" fill="#00AAFF"/>
      <polygon points="140,222 148,234 140,246 132,234" fill="#00AAFF"/>
      <polygon points="58,180 66,192 58,204 50,192" fill="#00AAFF"/>
      <polygon points="58,84 66,96 58,108 50,96" fill="#00AAFF"/>
      <text x="140" y="270" text-anchor="middle" font-family="Consolas, Monaco, monospace" font-size="13" fill="#EDEDED">KRISTALLEN GEVONDEN: 0 / 6</text>
    </svg>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">16</span></div>

Note: Fase 3/5 DIM — korte instructie (±5 min). Demo: plak Pakket 2, klik de verstopknop een paar keer en laat zien dat de kristallen springen en de teller op 0/6 staat. Op de Quest: open de browser en ga naar de Full Page-URL van de pen (zet die eventueel als korte link op het bord). Test dit vóór de les op één bril.

---

<p class="kicker">Blok 2.3 · de Battle · 11:35–12:25</p>
<h2 class="title title--md">Het snelste duo dat alle zes kristallen vindt, wint de ronde</h2>
<div class="row" style="margin-top:10px">
  <div class="col" style="flex:1 1 55%">
    <div class="rows">
      <div class="listrow"><span class="n">01</span><div><h3>Duo A verstopt</h3><p>Klik op verstoppen en zet de pen klaar op de Quest.</p></div></div>
      <div class="listrow"><span class="n">02</span><div><h3>Duo B zoekt, Duo A klokt</h3><p>Stopwatch aan bij de eerste blik, uit bij 6 / 6.</p></div></div>
      <div class="listrow"><span class="n">03</span><div><h3>Wissel en remix</h3><p>Rol B houdt de tijden bij op het scorebord.</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:1 1 45%">
    <div class="defbox">
      <span class="k">Rol C · VIP-tafel · 20 min</span>
      <p>Sneak-peek in een echt <strong>Unity VR-project</strong> uit jaar 2.</p>
    </div>
  </div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">17</span></div>

Note: Fase 6 DIM — spelen en remixen (±50 min). Kerntaak B: P4-K1 (testen). Snelle duo's mogen het spel remixen: kleuren, planeet of eigen objecten via de knoppenbalk, of verder aan hun wereld uit Blok 2.2. Jij geeft de 2 Rol C-studenten ±20 min een live demo/hands-on van een Unity VR-project uit de Minor van jaar 2 (zorg dat het project vooraf open staat en op een Quest gestreamd kan worden). Om 12:25 stoppen: wereld bewaren, brillen aan de lader.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<p class="kicker kicker--lime">Lunchpauze · 12:30 – 13:00</p>
<h2 class="title" style="color:#fff;font-size:72px;line-height:1;margin-top:12px">Na de lunch: het VR-Festival.</h2>
<p class="lede" style="color:#EDEDED;font-size:24px;margin-top:12px">Sla je wereld op of maak een screenshot. Om <strong style="color:#A6E22E">13:00</strong> zet je je beste werk klaar voor bezoekers.</p>
<div class="timer" data-timer="30:00" role="group" aria-label="Timer 30 minuten lunchpauze" style="margin-top:8px;transform:scale(.78);transform-origin:top center">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">30:00</span><span class="t-label">Lunch</span></div>
  </div>
  <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">18</span></div>

Note: Lunchpauze 12:30–13:00. Herinner aan de valkuil van de Visuele Editor: niet verversen! Pennen open laten of opslaan. Brillen aan de lader. Vraag de jury (Rol B) om na de lunch vooraan te beginnen.

---

<p class="kicker">Blok 2.4 · het VR-Festival · 13:00–13:40</p>
<h2 class="title title--md">Op het festival is jouw wereld de tentoonstelling</h2>
<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3>Zet je beste wereld of game klaar</h3><p>Op je iMac of op een Quest.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>Rondes van ±8 minuten</h3><p>Helft presenteert, helft bezoekt, dan wisselen.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>Bezoekers geven één compliment en één tip</h3><p>Wat voelde goed? Wat zou je anders doen?</p></div></div>
  <div class="listrow"><span class="n">04</span><div><h3>De jury (Rol B) scoort elke wereld</h3><p>Op de drie awards.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">19</span></div>

Note: Fase 7 DIM — presenteren en peer-feedback (±40 min). Verdeel de klas in twee helften (presenteren/bezoeken) en wissel na ±15–20 min. De jury (Rol B) loopt in beide rondes langs alle werelden en gebruikt de criteria van slide 20. Rol C laat de lasertrigger zien. Gebruik de jury-regels van Blok 2.1: comfort, onderdompeling, interactie.

---

<p class="kicker">Blok 2.4 · waar let de jury op?</p>
<h2 class="title title--md">Drie awards, drie manieren om te winnen</h2>
<div class="cards">
  <div class="glr-card"><span class="k">Award 01</span><h3>Beste Sfeer</h3><p>Kleur, licht en planeet kloppen: je voelt meteen waar je bent.</p></div>
  <div class="glr-card"><span class="k">Award 02</span><h3>Beste 360° Game</h3><p>Slim verstopt, spannend om te spelen en je wordt er niet duizelig van.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">Award 03</span><h3>Tech-Wizard</h3><p>Iets wat niemand verwachtte: een trigger, een slimme remix of een eigen idee.</p></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">20</span></div>

Note: Laat deze slide tijdens het festival op het grote scherm staan, zodat jury en makers de criteria zien. Tech-Wizard hoeft niet automatisch naar Rol C: ook een slimme no-code-oplossing telt. Om 13:40 trekt de jury zich 3 min terug voor overleg.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<p class="kicker kicker--lime">13:40 · de jury heeft beslist</p>
<h1 class="title" style="color:#fff;font-size:100px;line-height:0.95;margin-top:36px">De GLR <span class="glr-glow" style="color:#A6E22E">Studio Awards</span></h1>
<div class="cards" style="margin-top:34px">
  <div class="fragment glr-card"><span class="k">Award 01</span><h3>Beste Sfeer</h3></div>
  <div class="fragment glr-card"><span class="k">Award 02</span><h3>Beste 360° Game</h3></div>
  <div class="fragment glr-card glr-card--accent"><span class="k">Award 03</span><h3>Tech-Wizard</h3></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">21</span></div>

Note: Prijsuitreiking (±7 min). Laat de jury (Rol B) zelf de winnaars aankondigen en in één zin uitleggen waarom. Winnaars laten hun wereld 30 seconden op het grote scherm zien. Applaus voor iedereen: iedereen heeft vandaag iets in 3D gemaakt.

---

<p class="kicker">Check · vink je quests af · OVG · 13:50</p>
<h2 class="title title--md">Wat heb jij vandaag gemaakt en getest?</h2>
<ul class="check">
  <li><strong>Quest 2.1</strong> — twee VR-games getest en gescoord als Game Jury.</li>
  <li><strong>Quest 2.2</strong> — een eigen 3D-wereld gestyled (Pakket 1, FrameVR of lasertrigger).</li>
  <li><strong>Quest 2.3</strong> — het Kristallen-Zoekspel gespeeld, geremixt en laten testen.</li>
</ul>
<p class="body" style="margin-top:16px;max-width:940px"><strong>Voldoende</strong> = je wereld werkt en je hebt getest · <strong>Goed</strong> = je eigen keuzes zijn zichtbaar én je hebt feedback gegeven.</p>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">22</span></div>

Note: Fase 7 DIM + formatieve OVG-check (±3 min). Studenten vinken zelf af in de reader. Geen cijfer, wel bewijs van eigen kunnen. Snelle handopsteek per quest.

---

<p class="kicker">Wat neem je mee · en wat komt er morgen?</p>
<h2 class="title title--md">Een vormgever ontwerpt de wereld, een developer laat hem werken</h2>
<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Elke VR-wereld is een samenwerking</h3><p>Art director, playtester en coder: vandaag zat je zelf in zo'n team.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Vul je Studiekeuze-Kompas in</h3><p>Reader tab 04: welke rol gaf jou vandaag de meeste energie?</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Morgen · Dag 3 · de Micro:bit</h3><p>LED pixel-art, 8-bit muziek en een draadloze radio-hack.</p></div></div>
</div>
<div class="footer"><span>CSD Oriëntatieklas · Dag 2 · VR</span><span class="num">23</span></div>

Note: Fase 7 DIM — terugblik en transfer (±5 min, tot 14:00). Kernboodschap voor de ±18 studenten die een andere GLR-opleiding kiezen: later werk je in projecten samen met developers, en nu weet je wat zij kunnen. Laat iedereen het Kompas invullen vóór ze vertrekken. Teaser Dag 3: Micro:bit in de browser-simulator (makecode.microbit.org), zelfs zonder USB-kabel.

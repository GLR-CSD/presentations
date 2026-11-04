---
title: "Mega Villains Inc. — Les 2: flowchart, wireframes en moodboard"
cohort: "2026-2027"
leerjaar: "vmbo (BB/KB/GL)"
periode: 1
auteur: "GLR Creative Software Developer"
tags: ["Keuzevak", "MVI K09", "Applicatieontwikkeling", "vmbo", "Flowchart", "Wireframes", "Knoppen", "Moodboard", "Figma", "Villain Card"]
<!-- .slide: data-visibility="hidden" -->
---

<!-- .slide: class="bleed" -->

<div class="mv-grid"></div>
<div class="mv-hood">
  <svg viewBox="0 0 200 240" aria-hidden="true">
    <defs><filter id="glow-title" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M30 168 C10 182 2 210 0 240 L200 240 C198 210 190 182 170 168 C130 152 70 152 30 168 Z" fill="#1A1026" stroke="#3B1460" stroke-width="2"/>
        <path d="M100 8 C58 8 36 46 34 92 C32 124 40 146 30 168 C70 152 130 152 170 168 C160 146 168 124 166 92 C164 46 142 8 100 8 Z" fill="#1F1430" stroke="#4A2A7A" stroke-width="2"/>
        <ellipse cx="100" cy="104" rx="38" ry="46" fill="#05030A"/>
        <g filter="url(#glow-title)" fill="#A6E22E">
          <ellipse cx="85" cy="102" rx="10" ry="3.5" transform="rotate(14 85 102)"/>
          <ellipse cx="115" cy="102" rx="10" ry="3.5" transform="rotate(-14 115 102)"/>
        </g>
  </svg>
</div>
<div class="bleed-content">
  <div class="bar" style="margin-top:120px"></div>
  <p class="kicker">GLR · Creative Software Developer · Keuzevak MVI K09 Applicatieontwikkeling</p>
  <h1 class="mv-logo" style="font-size:104px">Mega<br><b>Villains</b><small>Inc.</small></h1>
  <p class="lede" style="font-size:30px;color:var(--mv-soft);max-width:700px;margin-top:26px">Welkom bij Les 2! Vandaag teken je de blauwdruk van jouw webshop en duiken we Figma in.</p>
  <p style="margin-top:22px"><span class="pill">Les 2 · Structuur, Wireframes &amp; Moodboard</span></p>
  <div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">01</span></div>
</div>

Note: **Gagné 1: aandacht trekken (tijdens binnenkomst, ± 3 min; blok 1 samen ± 10 min).** Laat deze slide staan terwijl de leerlingen binnenkomen. Leg op elke tafel: werkboekje, potlood, liniaal en gum. Openingszin: "Vorige week wisten jullie voor wie je bouwt. Vandaag maak je de bouwtekening." Rode draad (ABT): jullie kennen je koper (EN), MAAR als je meteen in Figma gaat klikken verdwaal je en wordt het een rommeltje (MAAR), DAAROM teken je eerst de route en de bouwtekening op papier en kies je daarna pas de stijl (DAAROM). **Let op:** het Figma-blok en de Villain Card uit Les 1 zijn niet gedaan; die halen we vandaag na de pauze in. Zeg dat kort, zonder te benadrukken wat er gemist is.
---

<p class="kicker">Blok 1 · Opwarmer · Even terughalen</p>

## Wie shopt er in jouw webshop en welke 3 pagina's bouwen we?

<div class="row" style="margin-top:20px;flex:0 0 auto">
  <div class="col" style="flex:0 0 360px">
    <div class="panel panel--neon" style="flex:1;justify-content:center;display:flex;flex-direction:column">
      <span class="k">Check met je buur · 30 sec</span>
      <p style="font-size:24px"><strong>1.</strong> Hoe heet jouw <strong>persona</strong> (Opdracht 1) en wat wil die écht?</p>
      <p style="font-size:24px;margin-top:14px"><strong>2.</strong> Welke <strong>3 pagina's</strong> staan bij Opdracht 4 op nummer 1?</p>
    </div>
  </div>
  <div class="col">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px"><div class="panel" style="padding:14px 16px"><div class="wf" style="height:130px" aria-hidden="true"><div class="wf-bar"><i></i><i></i><i></i></div><div class="wf-body"><div class="wf-head"><span class="wf-logo"></span><span class="wf-l" style="width:40px"></span><span class="wf-search"></span></div><div class="wf-banner" style="font-size:11px">NIEUW</div><div class="wf-cats" style="flex-basis:22px"><div>GAME</div><div>COMIC</div></div></div></div><h3 style="margin-top:12px;font-size:23px">Homepage</h3><p style="font-size:19px">Verleiden</p></div><div class="panel" style="padding:14px 16px"><div class="wf" style="height:130px" aria-hidden="true"><div class="wf-bar"><i></i><i></i><i></i></div><div class="wf-body"><div class="wf-head"><span class="wf-logo"></span><span class="wf-l" style="width:40px"></span><span class="wf-search"></span></div><div class="wf-grid"><div class="wf-prod"><div class="wf-img"></div><div class="wf-btn"></div></div><div class="wf-prod"><div class="wf-img"></div><div class="wf-btn"></div></div><div class="wf-prod"><div class="wf-img"></div><div class="wf-btn"></div></div><div class="wf-prod"><div class="wf-img"></div><div class="wf-btn"></div></div><div class="wf-prod"><div class="wf-img"></div><div class="wf-btn"></div></div><div class="wf-prod"><div class="wf-img"></div><div class="wf-btn"></div></div></div></div></div><h3 style="margin-top:12px;font-size:23px">Overzichtspagina</h3><p style="font-size:19px">Kiezen</p></div><div class="panel" style="padding:14px 16px"><div class="wf" style="height:130px" aria-hidden="true"><div class="wf-bar"><i></i><i></i><i></i></div><div class="wf-body"><div class="wf-head"><span class="wf-logo"></span><span class="wf-l" style="width:40px"></span><span class="wf-search"></span></div><div class="wf-detail"><div class="wf-img"></div><div class="wf-info"><span class="wf-l" style="width:80%"></span><div class="wf-btn wf-btn--lg" style="height:14px;font-size:7px">WINKELWAGEN</div></div></div></div></div><h3 style="margin-top:12px;font-size:23px">Detailpagina</h3><p style="font-size:19px">Kopen</p></div></div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">02</span></div>

Note: **Gagné 1 + 3: aandacht en voorkennis activeren (± 3 min).** Laat de leerlingen hun werkboekje van vorige week openslaan bij Opdracht 1 en 4. Geef 30 seconden voor de buur-check en laat daarna 2 leerlingen hun persona noemen. Vraag door: "Wat wil jouw persona écht?" Klik op de rechterkant en laat de klas de drie taken raden: verleiden, kiezen, kopen. **Differentiatie:** wie vorige week niet klaar was met de persona, rondt dat nu in 3 minuten af terwijl de rest de buur-check doet; de persona is nodig voor het moodboard na de pauze. Wie er vorige week niet was, kijkt mee bij de buur.
---

<p class="kicker">Blok 1 · Planning en doelen</p>

## Vandaag maak je de bouwtekening op papier én je stijl in Figma

<div class="row" style="margin-top:4px">
  <div class="col">
    <div class="rows rows--tight">
      <div class="listrow listrow--time"><span class="n">25 min</span><div><h3>De route: Flowchart (Opdracht 5)</h3><p>Je tekent hoe alle pagina's met pijlen verbonden zijn.</p></div></div>
      <div class="listrow listrow--time"><span class="n">60 min</span><div><h3>3 Sprints: Wireframes &amp; Knoppen (Opdr. 9 &amp; 8)</h3><p>Je schetst in 3 × 15 min je pagina's en noteert je knoppen.</p></div></div>
      <div class="listrow listrow--time listrow--break"><span class="n">15 min</span><div><h3>Pauze</h3></div></div>
      <div class="listrow listrow--time"><span class="n">15 min</span><div><h3>Figma Kickstart: de 4 basis-tools</h3><p>Je leert frames, kleuren, vormen en tekst maken in Figma.</p></div></div>
      <div class="listrow listrow--time"><span class="n">45 min</span><div><h3>Figma Challenge: Moodboard (Opdr. 10)</h3><p>Je bouwt je eigen sfeerbord. Snel klaar? Dan maak je een Villain Card!</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:0 0 340px;justify-content:center">
    <div class="panel panel--neon">
      <span class="k">Je hebt nodig</span>
      <ul class="checklist" style="margin-top:4px">
        <li>Je werkboekje</li>
        <li>Potlood + liniaal + gum</li>
        <li>iMac met Figma</li>
        <li>Je Persona uit Les 1</li>
      </ul>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">03</span></div>

Note: **Gagné 2: doelen delen (± 3 min).** Loop de vijf onderdelen kort door en lees de grijze zinnen als leerdoelen in gewone taal. Zeg erbij: "Voor de pauze gebruik je alleen papier, na de pauze alleen Figma." Eerst tekenen, dan pas bouwen: zo doen ontwerpbureaus het ook. Tijdsverdeling: 10 min intro (nu), 25 min flowchart, 60 min sprints, 15 min pauze, 15 min Figma-tools, 45 min challenge, 10 min showcase en afsluiting. Check of alle leerlingen potlood, liniaal en gum hebben. Iedereen die nog niet in Figma is ingelogd, doet dat in de pauze.
---

<p class="kicker">Blok 2 · Structuur · De Flowchart</p>

## Een flowchart is de wegenkaart van je webshop: blokjes en pijlen

<div class="row" style="margin-top:4px;flex:1;min-height:0">
  <div class="col">
    <div class="fc" role="img" aria-label="Flowchart: bovenaan Homepage, daaronder twee blokken Overzicht Game Boeven en Overzicht Comic Boeven, daaronder Detailpagina Product. Pijlen wijzen omlaag naar de volgende pagina.">
      <div><div class="fc-node">Homepage<small>Index</small></div></div>
      <div class="fragment fc-arr"><span>↙</span><span>↘</span></div>
      <div class="fragment fc-row"><div class="fc-node fc-node--purple">Overzicht: Game Boeven</div><div class="fc-node fc-node--purple">Overzicht: Comic Boeven</div></div>
      <div class="fragment fc-arr" style="gap:150px"><span>↘</span><span>↙</span></div>
      <div class="fragment"><div class="fc-node fc-node--red">Detailpagina Product</div></div>
      <p class="fc-back fragment">Via het menu klik je altijd weer terug: <b>↔</b></p>
    </div>
  </div>
  <div class="col" style="flex:0 0 340px;justify-content:center">
    <div class="defbox defbox--sm">
      <span class="k">Flowchart</span>
      <p style="font-size:23px">Een schema met <strong>blokjes</strong> (de pagina's) en <strong>pijlen</strong> (waar je naartoe klikt). Je tekent hier nog géén plaatjes of vormgeving!</p>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">04</span></div>

Note: **Gagné 4 + 5: inhoud presenteren en begeleiden (± 5 min).** Bouw de boom met kliks op: Home, de splitsing, de overzichten, het detail. Vraag bij elke stap: "Waar kun je vanaf hier naartoe klikken?" Laat de klas de pijlen zelf noemen vóór je ze toont. Benadruk daarna dat je via het menu altijd weer terug kunt klikken (↔): een pijl in beide richtingen. Vergelijk met een plattegrond van een station: je tekent de routes, niet de gebouwen. Vraag door: "Waarom staat er geen plaatje of kleur in zo'n flowchart?" (het gaat alleen om de route). **Differentiatie:** KB/GL mogen zelf extra pagina's bedenken (winkelwagen, contact) als de basis klopt; BB houdt het bij deze drie.
---

<p class="kicker">Blok 2 · Doe-opdracht · Werkboekje</p>

## Opdracht 5: teken de flowchart van jouw webshop in je werkboekje

<div class="row" style="margin-top:22px">
  <div class="col stack-y">
    <ol class="steps">
      <li><span>Zet bovenaan het blokje <strong>Homepage</strong>.</span></li>
      <li><span>Teken daaronder de pagina's waar je naartoe kunt klikken (<strong>Overzichtspagina / Categorieën</strong> en <strong>Detailpagina</strong>).</span></li>
      <li><span>Verbind de pagina's met <strong>logische pijlen</strong>.</span></li>
      <li><span><strong>Check bij je buur:</strong> kun je vanaf elke pagina bij een product komen én weer terug?</span></li>
    </ol>
  </div>
  <div class="col" style="flex:0 0 280px">
    <div class="timer timer--lg" data-timer="17:00" role="group" aria-label="Opdracht 5-timer 17 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">17:00</span><span class="t-label">Opdracht 5</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">05</span></div>

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (17 min).** Start de timer en loop meteen rond. Veelgemaakte fout: leerlingen tekenen alleen pijlen naar beneden. Vraag: "Hoe kom je weer terug bij de homepage?" (pijl terug of menu). Een tweede fout is dat ze plaatjes of kleuren toevoegen; zeg dan: "Alleen blokjes en pijlen." **Feedback in de laatste 3 min:** buur-check volgens stap 4, daarna laat je één flowchart zien op het digibord (foto met je telefoon of loop er naartoe) en vraagt de klas: "Kan ik vanaf elk blokje bij een product komen?" **Differentiatie:** BB heeft aan de drie vaste blokken genoeg. Wie snel klaar is (KB/GL), voegt een Winkelwagen-blokje toe en bedenkt van welke pagina's je erheen kunt.
---

<p class="kicker">Blok 3 · Bouwtekening · De Wireframe</p>

## Teken geen poppetjes! Een wireframe maak je met liniaal, kruizen en lijnen

<div class="row" style="margin-top:10px;flex:1;min-height:0">
  <div class="col" style="flex:0 0 340px">
    <div class="panel panel--red" style="flex:1">
      <span class="k">Verboden bij wireframes</span>
      <div class="nolist">
        <div><b>✗</b>Poppetjes tekenen</div>
        <div><b>✗</b>Logo's mooi inkleuren</div>
        <div><b>✗</b>Schetsen zonder liniaal</div>
        <div class="ok"><b>✓</b>Alleen blokken en kruizen [X]</div>
      </div>
      <p style="font-size:18px;margin-top:12px;color:var(--mv-muted)">Inkleuren is zonde van je tijd.</p>
    </div>
  </div>
  <div class="col">
    <div class="panel panel--neon" style="flex:1">
      <span class="k">De 4 vaste symbolen · extra punten bij de beoordeling</span>
      <div class="syms">
        <div class="sym"><div class="sym-ex"><div class="wf-x"><span class="wf-play" style="width:22px;height:22px;font-size:10px">▶</span></div></div><div><strong>Rechthoek met kruis [X]</strong> = afbeelding of video (kruis + ▶)</div></div>
        <div class="sym"><div class="sym-ex"><div class="wf-lines"><i class="t"></i><i class="w1"></i><i class="w2"></i></div></div><div><strong>Rechte lijnen ———</strong> = tekst of kopje</div></div>
        <div class="sym"><div class="sym-ex"><span class="wf-box">[ SHOP NOW ]</span></div><div><strong>Kader met tekst</strong> = knop (button) of zoekbalk</div></div>
        <div class="sym"><div class="sym-ex"><div class="sym-bars"><i></i><i></i></div></div><div><strong>Bovenbalk &amp; onderbalk</strong> = header (logo [X], zoekbalk, menu) en footer</div></div>
      </div>
    </div>
  </div>
</div>

<div class="defbox defbox--sm" style="margin-top:14px;padding:12px 22px">
  <span class="k">Wireframe</span>
  <p style="font-size:22px">Een snelle zwart-wit bouwtekening van één pagina. Zo zie je meteen <strong>waar</strong> tekst, foto's, video en knoppen komen.</p>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">06</span></div>

Note: **Gagné 4 + 5: inhoud en begeleiding (± 5 min).** Begin met de oorzaak van tekenschaamte: "Wie denkt: ik kan niet tekenen?" Zeg dan: "Goed nieuws: je hoeft ook niet te tekenen. Alleen een liniaal en vier symbolen." Laat het voorbeeld zien en benadruk dat iedereen met een liniaal er netjes uit ziet. **Peer Instruction-check (Gagné 6):** wijs een symbool aan zonder de tekst en vraag: "Welk onderdeel is een knop? Vingers: 1, 2, 3 of 4?" Laat 2 leerlingen met verschillende antwoorden uitleggen en herstem. Zeg dat de 4 symbolen extra punten opleveren bij de beoordeling van Opdracht 9 (check het exacte puntenschema in de module). **Afspraken:** liniaal voor alle lijnen, geen poppetjes, geen kleur, een kruis in elk beeldvak. **Differentiatie:** BB begint met de symbolen op een los blaadje oefenen (1 min), KB/GL gaan meteen door.
---

<p class="kicker">Blok 3 · Bouwtekening · Knoppen &amp; Functies</p>

## Elke knop die je tekent, heeft een taak: schrijf die meteen op bij Opdracht 8

<div class="beat" aria-label="Sprintritme: teken een pagina, schrijf de knoppen op, en ga door naar de volgende pagina. Dit herhaal je drie keer 15 minuten.">
  <div class="s"><span>Stap 1</span>Teken 1 pagina</div><div class="ar">→</div>
  <div class="s"><span>Stap 2</span>Noteer de knoppen (Opdr. 8)</div><div class="ar">→</div>
  <div class="s"><span>Stap 3</span>Volgende sprint</div>
</div>

<table class="mtab mtab--btn" style="margin-top:20px" aria-label="Voorbeelden van knoppen en wat ze doen">
  <thead><tr><th>Knop</th><th>Wat doet hij?</th></tr></thead>
  <tbody>
    <tr><td><b>Logo / Home</b></td><td>Gaat terug naar de homepage.</td></tr>
    <tr><td><b>Game Boeven</b></td><td>Opent de overzichtspagina met alle game-schurken.</td></tr>
    <tr><td><b>In winkelwagen</b></td><td>Zet de gekozen action figure in het winkelmandje.</td></tr>
  </tbody>
</table>

<p class="small" style="margin-top:14px;font-size:20px"><strong>3 sprints van 15 minuten.</strong> Na elke pagina schrijf je meteen op wat de knoppen doen.</p>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">07</span></div>

Note: **Gagné 4 + 5: inhoud en voorbeelden (± 4 min).** Leg het sprintritme uit: 15 minuten tekenen én noteren, dan stop je en begin je met de volgende pagina. Zo heb je aan het einde 3 wireframes én een complete knoppenlijst. Lees de voorbeelden niet voor; vraag de klas: "Wat doet de knop 'Bekijk' bij een poppetje?" (opent de detailpagina) en "Wat doet het logo?" (terug naar home). Een goede beschrijving begint met een werkwoord: opent, gaat naar, zet in. Controleer de werkboekpagina bij Opdracht 8 (Knop, Wat doet hij?). **Differentiatie:** BB schrijft minimaal 3 knoppen per pagina op, KB/GL alle knoppen en wat er daarna gebeurt.
---

<p class="kicker">Blok 3 · Sprint 1 · Wireframe Homepage</p>

## Sprint 1 (15 min): teken je Homepage (met video!) en schrijf je knoppen op

<div class="sprint">
  <div>
    <div class="wf wf--lg" role="img" aria-label="Wireframe van de homepage: header met logo, zoekbalk en menu; een banner met tekstlijnen, een knop en een videovlak; daaronder twee categorieblokken"><div class="wf-bar"><i></i><i></i><i></i></div><div class="wf-body">
      <div class="wf-head"><span class="wf-x" style="width:26px;height:22px"></span><span class="wf-l" style="width:40px"></span><span class="wf-search"></span><span class="wf-l" style="width:34px"></span></div>
      <div class="wf-hero">
        <div class="wf-lines"><i class="t"></i><i class="w1"></i><i class="w2"></i><span class="wf-box wf-box--fill" style="margin-top:8px">[ SHOP NOW ]</span></div>
        <div class="wf-x"><span class="wf-play">▶</span></div>
      </div>
      <div class="wf-cats"><div>GAME BOEVEN</div><div>COMIC BOEVEN</div></div>
    </div></div>
  </div>
  <ol class="steps steps--sm">
      <li><span>Teken bovenaan de <strong>header</strong> (logo [X], zoekbalk, menu).</span></li>
      <li><span>Teken de grote <strong>banner</strong> met lijnen voor tekst, een knop én een <strong>videovlak</strong> ([X] + ▶).</span></li>
      <li><span>Teken eronder de 2 categorieblokken: <strong>Game Boeven</strong> en <strong>Comic Boeven</strong>.</span></li>
      <li><span><strong>Opdracht 8:</strong> schrijf nu meteen op wat je menu-, banner- en categorieknoppen doen!</span></li>
  </ol>
  <div class="timer timer--lg" data-timer="15:00" role="group" aria-label="Sprint 1-timer 15 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Sprint 1 · Home</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">08</span></div>

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (15 min).** Start de timer en loop rond. Het voorbeeld is een model; leerlingen tekenen hun eigen versie in het werkboek. Controleer: liniaal gebruikt, kruis in het videovlak, geen poppetjes. Het video-vlak staat in de matrix op prioriteit 2, maar het vlak teken je nu al zodat de plek vastligt. Vraag bij het rondlopen: "Wat doet de knop in je banner?" Na 12 minuten: "Nog 3 minuten: schrijf nu je knoppen op." **Differentiatie:** BB tekent de header, banner en categorieën en noteert minimaal 3 knoppen. KB/GL voegen een zoekbalk-uitleg en een tweede knop in de banner toe. Wie klaar is, begint al aan het overzicht.
---

<p class="kicker">Blok 3 · Sprint 2 · Wireframe Overzichtspagina</p>

## Sprint 2 (15 min): teken je Overzichtspagina en noteer je nieuwe knoppen

<div class="sprint">
  <div>
    <div class="wf wf--lg" role="img" aria-label="Wireframe van de overzichtspagina: header, paginatitel, een filterkolom en een rooster van zes productkaartjes met foto, tekstlijnen en knop"><div class="wf-bar"><i></i><i></i><i></i></div><div class="wf-body">
      <div class="wf-head"><span class="wf-x" style="width:26px;height:22px"></span><span class="wf-l" style="width:40px"></span><span class="wf-search"></span><span class="wf-l" style="width:34px"></span></div>
      <div class="wf-lines" style="flex:0 0 auto"><i class="t"></i></div>
      <div class="wf-side">
        <div class="wf-filter">Filter<i></i><i></i><i></i></div>
        <div class="wf-grid"><div class="wf-pcard"><div class="wf-x"></div><div class="wf-lines"><i class="w1"></i><i class="w3"></i></div><div class="wf-btn"></div></div><div class="wf-pcard"><div class="wf-x"></div><div class="wf-lines"><i class="w1"></i><i class="w3"></i></div><div class="wf-btn"></div></div><div class="wf-pcard"><div class="wf-x"></div><div class="wf-lines"><i class="w1"></i><i class="w3"></i></div><div class="wf-btn"></div></div><div class="wf-pcard"><div class="wf-x"></div><div class="wf-lines"><i class="w1"></i><i class="w3"></i></div><div class="wf-btn"></div></div><div class="wf-pcard"><div class="wf-x"></div><div class="wf-lines"><i class="w1"></i><i class="w3"></i></div><div class="wf-btn"></div></div><div class="wf-pcard"><div class="wf-x"></div><div class="wf-lines"><i class="w1"></i><i class="w3"></i></div><div class="wf-btn"></div></div></div>
      </div>
    </div></div>
  </div>
  <ol class="steps steps--sm">
      <li><span>Teken bovenaan weer dezelfde <strong>header</strong> en de paginatitel.</span></li>
      <li><span>Optioneel (extra): teken links een kolom voor <strong>filters</strong>.</span></li>
      <li><span>Teken een strak rooster (grid) met <strong>productkaartjes</strong> (elk kaartje = foto [X], lijntje voor naam/prijs en een knop).</span></li>
      <li><span><strong>Opdracht 8:</strong> schrijf op wat de productknoppen (<em>Bekijk</em> / <em>Bestel</em>) en eventuele filters doen!</span></li>
  </ol>
  <div class="timer timer--lg" data-timer="15:00" role="group" aria-label="Sprint 2-timer 15 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Sprint 2 · Overzicht</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">09</span></div>

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (15 min).** Tip: teken één kaartje netjes met liniaal en kopieer het idee 5 keer; zo gaat het sneller en wordt het een strak rooster. Minimaal 6 kaartjes (zie briefing). Wijs op consistentie: dezelfde header als op de homepage. Filters zijn extra (prioriteit 3): alleen als er tijd is. Loop rond en vraag: "Waar klik je om naar het detail te gaan?" **Differentiatie:** BB tekent 6 kaartjes zonder filters en noteert 2 knoppen. KB/GL tekenen de filters erbij en beschrijven wat er gebeurt als je een filter kiest. **Feedback:** laat in de laatste minuut buren elkaars rooster checken: staan alle kaartjes even groot?
---

<p class="kicker">Blok 3 · Sprint 3 · Wireframe Detailpagina</p>

## Sprint 3 (15 min): teken je Detailpagina en maak je knoppenlijst compleet

<div class="sprint">
  <div>
    <div class="wf wf--lg" role="img" aria-label="Wireframe van de detailpagina: grote productfoto met drie kleine foto-vakjes, daarnaast naam, grote prijs, aantal kiezen en een knop In winkelwagen, onderaan drie gerelateerde producten"><div class="wf-bar"><i></i><i></i><i></i></div><div class="wf-body">
      <div class="wf-head"><span class="wf-x" style="width:26px;height:22px"></span><span class="wf-l" style="width:40px"></span><span class="wf-search"></span><span class="wf-l" style="width:34px"></span></div>
      <div class="wf-detail">
        <div class="wf-detail-col"><div class="wf-x"></div><div class="wf-thumbs"><div class="wf-x"></div><div class="wf-x"></div><div class="wf-x"></div></div></div>
        <div class="wf-info"><div class="wf-lines"><i class="t"></i><i class="w1"></i><i class="w2"></i></div><span class="wf-price">€ 34,99</span><div class="wf-qty"><i></i><i></i><i></i></div><div class="wf-btn wf-btn--lg">IN WINKELWAGEN</div></div>
      </div>
      <div class="wf-related"><div class="wf-x"></div><div class="wf-x"></div><div class="wf-x"></div></div>
    </div></div>
  </div>
  <ol class="steps steps--sm">
      <li><span>Teken links een <strong>grote productfoto [X]</strong> (met kleine foto-vakjes eronder).</span></li>
      <li><span>Teken rechts: naam, <strong>grote prijs</strong>, lijnen voor productinfo, aantal kiezen (− 1 +) en een grote knop <strong>IN WINKELWAGEN</strong>.</span></li>
      <li><span>Teken onderaan 3 kleine blokjes voor <em>Gerelateerde producten</em>.</span></li>
      <li><span><strong>Opdracht 8:</strong> voeg de knop <em>In winkelwagen</em> en de plus- en min-knoppen (<em>− 1 +</em>) toe aan je lijst!</span></li>
  </ol>
  <div class="timer timer--lg" data-timer="15:00" role="group" aria-label="Sprint 3-timer 15 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Sprint 3 · Detail</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">10</span></div>

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (15 min).** Dit is de belangrijkste pagina: hier beslist de koper. Herinner aan wat je op de homepage zei: de prijs is groot en de knop valt op. Loop rond en controleer of de knop IN WINKELWAGEN het grootste kader op de pagina is. **Afsluiting van het blok (laatste 2 min):** loop de checklist langs: 3 wireframes, per pagina de knoppen opgeschreven. Wie nog iets mist, rondt dat na de pauze niet af maar thuis of volgende week; na de pauze gaan we naar Figma. **Differentiatie:** BB laat de gerelateerde producten weg als de tijd te krap is. KB/GL voegen reviews met sterren toe (extra) en beschrijven de knoppen volledig.
---

<!-- .slide: data-state="pauze" -->

<p class="kicker">Blok 4 · Pauze · 15 minuten</p>

<div class="row" style="align-items:center">
  <div class="col">
    <p class="break-title">Pauze!</p>
    <h2 style="font-size:36px;margin-top:22px;max-width:640px">Leg je potlood en liniaal neer. Na de pauze gaan we achter de iMac bouwen in Figma!</h2>
    <ul class="checklist" style="margin-top:24px">
      <li>Weg van je scherm</li>
      <li>Even lopen of water drinken</li>
      <li>Na de pauze: klaar zitten achter Figma</li>
    </ul>
    <p class="back-at">Terug om <span data-back-at="15">over 15 min</span></p>
  </div>
  <div class="col" style="flex:0 0 320px">
    <div class="timer timer--lg" data-timer="15:00" role="group" aria-label="Pauze-timer 15 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Pauze</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">11</span></div>

Note: **Pauze (15 min).** Ga pas naar deze slide als de pauze echt begint en start de timer; de tijd bij "Terug om" wordt automatisch ingevuld (nu + 15 minuten). Laat de werkboekjes open op tafel liggen. Loop even langs de tafels en bekijk hoe ver iedereen is met de wireframes en de knoppen. Zet in de pauze Figma klaar op het digibord (ingelogd, leeg bestand) en zorg dat het geluid en de projector goed staan. Leerlingen die nog niet in Figma zijn ingelogd, doen dat nu.
---

<p class="kicker">Blok 5 · Praktijk · Figma-kickstart</p>

## Met deze 4 tools bouw je in Figma vandaag je eigen Moodboard

<div class="tools">
  <div class="tool">
    <div class="keys"><span class="key">+</span></div>
    <h3>1 · Nieuw ontwerp</h3>
    <p>Klik op <strong>+ New</strong> → <strong>Design file</strong> en noem je bestand <strong>MVI_JouwNaam</strong>.</p>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">F</span></div>
    <h3>2 · Frame trekken</h3>
    <p>Sleep een groot vlak. Noem het meteen <strong>Moodboard</strong>.</p>
    <div class="layers" aria-label="Lagenpaneel: Frame 1 is fout, Moodboard is goed">
      <div class="bad">Frame 1 <b>✗</b></div>
      <div class="good">Moodboard <b>✓</b></div>
    </div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key key--wide">FILL</span></div>
    <h3>3 · Kleur kiezen</h3>
    <p>Klik op je frame of vorm en kies rechts bij <strong>Fill</strong> een schurkenkleur.</p>
    <div class="fillbar"><i></i>#3B1460</div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">R</span><span class="key">T</span></div>
    <h3>4 · Rechthoek &amp; Tekst</h3>
    <p><strong>R</strong> voor kleurvlakken en knoppen, <strong>T</strong> voor kopjes en tekst.</p>
  </div>
</div>

<div class="hotkeys">
  <span class="k-label">Handig bij vastlopen</span>
  <div><span class="key key--sm">Ctrl/⌘ Z</span>ongedaan maken</div>
  <div><span class="key key--sm">Ctrl/⌘ D</span>dupliceren</div>
  <div><span class="key key--sm">Spatie + slepen</span>scherm verschuiven</div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">12</span></div>

Note: **Gagné 4 + 5: voordoen, "ik doe, wij doen" (± 15 min, inclusief meedoen).** Dit is het stuk uit Les 1 dat we niet gehaald hebben. Doe het live voor in Figma op het grote scherm; na elke tool doen de leerlingen hem meteen na. 1: nieuw Design file, naam MVI_JouwNaam. 2: druk op F, sleep een vlak en dubbelklik in de lagenlijst op de naam: "Moodboard", niet "Frame 1". Leg uit waarom: "Straks heb je veel frames. Als alles Frame 1 en Frame 2 heet, vind je niks meer terug." 3: frame selecteren, rechts bij Fill een donkere kleur, bijvoorbeeld #3B1460. 4: R voor een rechthoek, T voor tekst. Eindresultaat: **iedereen heeft een frame met de naam Moodboard openstaan** voor je naar de volgende slide gaat. Loop rond en help leerlingen die vastlopen; laat de sneltoetsen gebruiken in plaats van de werkbalk. **Differentiatie:** BB doet alles stap voor stap mee; KB/GL die voorlopen proberen alvast Ctrl/⌘ D en maken meerdere kleurvlakken.
---

<p class="kicker">Blok 5 · Praktijk · Opdracht 10 · Het Moodboard</p>

## Met een moodboard laat je in één oogopslag de sfeer van je webshop zien

<div class="tools tools--mb" style="margin-top:20px;grid-template-columns:repeat(3,1fr)">
  <div class="tool">
    <div class="keys"><span class="key">1</span></div>
    <h3>Kleurenpalet</h3>
    <div class="mini" aria-hidden="true"><i style="background:#0B0710"></i><i style="background:#3B1460"></i><i style="background:#8B0F1A"></i><i style="background:#A6E22E"></i></div>
    <p>4 tot 5 vierkanten (<strong>R</strong> + <strong>Fill</strong>): zwart, paars, donkerrood en een accentkleur.</p>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">2</span></div>
    <h3>Logo &amp; plaatjes</h3>
    <div class="mini" aria-hidden="true"><div class="wf-x"></div><div class="wf-x"></div><div class="wf-x"></div></div>
    <p>Het MVI-logo en minstens 3 stoere plaatjes van figures (<strong>Ctrl/⌘ V</strong>).</p>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">3</span></div>
    <h3>Lettertypes</h3>
    <div class="mini-aa" aria-hidden="true"><b>Aa</b><span>Aa</span></div>
    <p>Met <strong>T</strong>: een font voor <strong>kopjes</strong> (groot, stoer) en een voor <strong>gewone tekst</strong> (leesbaar).</p>
  </div>
</div>

<div class="defbox defbox--sm" style="margin-top:20px;padding:14px 22px">
  <span class="k">Belangrijk</span>
  <p style="font-size:23px">Zorg dat je moodboard past bij <strong>jouw Persona</strong> uit Les 1!</p>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">13</span></div>

Note: **Gagné 4: inhoud presenteren (± 3 min).** Loop de vier onderdelen langs en laat bij elk onderdeel zien dat het in Figma met één van de vier tools uit de vorige slide kan. Verwijs naar het voorbeeld in de module (Opdracht 10) en laat dat indien mogelijk even zien. Kleuren: de basis is zwart, paars en donkerrood; neongroen of rood is voor knoppen die moeten opvallen (zie de stijl uit Les 1). Lettertypes: kopjes in een stoer font (bijvoorbeeld Space Grotesk, Orbitron, Bebas Neue of Russo One), gewone tekst in een rustig leesbaar font. Zet de fontnaam erbij. Vraag: "Welk font past bij jouw persona?" De Villain Card is een aparte bonus-opdracht voor wie het moodboard af heeft; noem hem hier niet, zodat het moodboard niet met de productkaart verward wordt. **Differentiatie:** BB maakt eerst het palet en de plaatjes (1 en 2); KB/GL werken alle drie uit.
---

<p class="kicker">Blok 5 · Praktijk · Voorbeeld</p>

## Voorbeeld: zo ziet een moodboard in Figma eruit

<div class="mboard-wrap" style="grid-template-columns:1fr">
  <div class="mboard" role="img" aria-label="Voorbeeld van een moodboard-frame met een kleurenpalet van zwart, paars, donkerrood en neongroen, een voorbeeld van een kop- en een tekstlettertype en drie plaatjes van schurken">
    <div class="mboard-name"><i></i>Moodboard</div>
    <p class="mv-logo mb-logo">Mega <b>Villains</b></p>
    <div class="mb-sw">
      <div style="background:#0B0710">Zwart</div>
      <div style="background:#3B1460">Paars</div>
      <div style="background:#8B0F1A">Rood</div>
      <div class="neon">Neon</div>
      <div style="background:#1F1430">Donker</div>
    </div>
    <div class="mb-type">
      <div><small>Kopjes · Space Grotesk Bold</small><span class="mb-h">Wij verkopen het kwaad</span></div>
      <div><small>Gewone tekst · Hanken Grotesk</small><span class="mb-p">Verzamel de gemeenste schurken uit games en comics.</span></div>
    </div>
    <div class="mb-pics"><div class="wf-x">Schurk 1</div><div class="wf-x">Schurk 2</div><div class="wf-x">Schurk 3</div></div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">14</span></div>

Note: **Gagné 5: leerbegeleiding met uitgewerkt voorbeeld (± 2 min).** Wijs aan hoe de onderdelen samenhangen: het palet in het bovenste deel, de lettertypes met naam eronder en de plaatjes onderaan. Zeg: "Maak dit niet na, maak je eigen versie met de kleuren en schurken die bij jouw persona passen." In de echte opdracht staan op de plek van de grijze vakken echte plaatjes. Vraag: "Welke kleur gebruik je alleen voor dingen die moeten opvallen?" (de accentkleur). Let op: de voorbeeldplaatjes zijn met opzet grijze vakken; leerlingen zoeken zelf passende plaatjes en gebruiken alleen schurken, geen helden (huisregel).
---

<p class="kicker">Blok 5 · Doe-opdracht · Figma</p>

## Figma-challenge (40 min): bouw jouw Moodboard!

<div class="challenge" style="grid-template-columns:1fr 330px 250px">
  <ol class="steps steps--sm">
    <li><span>Controleer of je frame <strong>Moodboard</strong> heet.</span></li>
    <li><span>Teken met <strong>R</strong> minstens <strong>4 kleurvlakken</strong> (donkere basiskleuren + 1 felle accentkleur).</span></li>
    <li><span>Plak het <strong>MVI-logo</strong> en <strong>3 plaatjes van schurken</strong> in je frame.</span></li>
    <li><span>Typ met <strong>T</strong> een <strong>kopje</strong> (stoer font) en <strong>gewone tekst</strong> (leesbaar font) + zet de fontnaam erbij.</span></li>
  </ol>
  <div class="panel panel--neon" style="align-self:center"><span class="k">Klaar voor de tijd?</span><p>Pak de <strong>bonus-challenge</strong> op de volgende slide: de Villain Product Card.</p></div>
  <div class="timer timer--lg" data-timer="40:00" role="group" aria-label="Moodboard-timer 40 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">40:00</span><span class="t-label">Moodboard</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">15</span></div>

Note: **Gagné 6 (40 min).** Start de timer en loop rond. Plaatje invoegen: zoek een afbeelding (alleen schurken), rechtermuisknop → Afbeelding kopiëren, in Figma Ctrl/⌘ V. Een png met transparante achtergrond ziet er het mooist uit. Font: selecteer de tekst, kies rechts bij Text een ander font. De knop is een rechthoek (R) met een neongroene Fill en tekst (T) erop. Check bij het rondlopen: heet het frame **Moodboard**, passen de kleuren bij de persona, staat de fontnaam erbij? Na 25 minuten: "Wie heeft al een palet, plaatjes én lettertypes?" **Differentiatie:** BB maakt stap 1 tot en met 3; stap 4 mag met een voorbeeld-font. KB/GL werken alle stappen af. **Snel klaar? Dan door naar de bonus-challenge (volgende slide):** de Villain Product Card. Dat is een aparte opdracht in een eigen frame, dus het moodboard blijft een moodboard. Reserveer de laatste 5 minuten om te bewaren en een moodboard klaar te zetten voor de showcase.
---

<p class="kicker">Blok 5 · Bonus-challenge · Figma</p>

## Bonus voor snelle makers: bouw een Villain Product Card in een eigen frame

<div class="challenge" style="grid-template-columns:1fr 280px 250px">
  <ol class="steps steps--sm">
    <li><span>Maak met <strong>F</strong> een nieuw frame <em>naast</em> je moodboard en noem het <strong>Villain Card</strong>.</span></li>
    <li><span>Geef het een donkere <strong>schurkenkleur</strong> uit je moodboard.</span></li>
    <li><span>Plak een <strong>plaatje</strong> van jouw favoriete villain erin.</span></li>
    <li><span>Zet <strong>naam en prijs</strong> erbij in je kopjes-font.</span></li>
    <li><span>Maak met <strong>R</strong> en <strong>T</strong> een neongroene of rode <strong>BESTEL NU</strong>-knop.</span></li>
  </ol>
  <div class="vcard" role="img" aria-label="Voorbeeld van een Villain Product Card: donkere kaart met een silhouet van een schurk met kap en groene ogen, de naam Dr. Duister, de prijs 29,99 euro en een neongroene knop Bestel nu">
    <div class="img">
      <svg viewBox="0 0 200 240" aria-hidden="true">
        <defs><filter id="glow-card-16" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M30 168 C10 182 2 210 0 240 L200 240 C198 210 190 182 170 168 C130 152 70 152 30 168 Z" fill="#1A1026" stroke="#5A3A8A" stroke-width="2"/>
        <path d="M100 8 C58 8 36 46 34 92 C32 124 40 146 30 168 C70 152 130 152 170 168 C160 146 168 124 166 92 C164 46 142 8 100 8 Z" fill="#1F1430" stroke="#6A4A9A" stroke-width="2"/>
        <ellipse cx="100" cy="104" rx="38" ry="46" fill="#05030A"/>
        <g filter="url(#glow-card-16)" fill="#A6E22E">
          <ellipse cx="85" cy="102" rx="10" ry="3.5" transform="rotate(14 85 102)"/>
          <ellipse cx="115" cy="102" rx="10" ry="3.5" transform="rotate(-14 115 102)"/>
        </g>
      </svg>
    </div>
    <span class="from">Mega Villains Originals · 18 cm</span>
    <h3>Dr. Duister</h3>
    <span class="price">€ 29,99</span>
    <div class="buy">BESTEL NU</div>
  </div>
  <div class="panel panel--neon" style="align-self:center"><span class="k">Alleen als je klaar bent</span><p>Eerst je <strong>Moodboard</strong> af. Dit is een extra opdracht, geen onderdeel van het moodboard.</p></div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">16</span></div>

Note: **Gagné 6 + 9: toepassen en transfer, differentiatie (geen vaste tijd; voor wie klaar is met Opdracht 10).** Laat deze slide pas zien als de eerste leerlingen hun moodboard af hebben, of noem hem kort bij het rondlopen. Het is een losse opdracht in een eigen frame: zo blijft duidelijk wat het moodboard is en wat een productkaart is (die komt in Les 3 terug op de overzichts- en detailpagina). De voorbeeldkaart laat zien waar je naartoe werkt; maak hem niet na, maar maak je eigen versie met je favoriete schurk en de kleuren en fonts van je moodboard. Plaatje invoegen: afbeelding kopiëren en in Figma Ctrl/⌘ V. De knop is een rechthoek (R) met neongroene Fill en tekst (T) erop. Check: heet het frame **Villain Card**? **Verdieping:** dupliceer de kaart met Ctrl/⌘ D en maak een tweede kaart van een andere schurk; zet ze netjes uitgelijnd naast elkaar, zoals op de overzichtspagina. Leerlingen die dit niet halen, missen niets: het is geen verplicht onderdeel.
---

<p class="kicker">Blok 6 · Showcase · Feedback</p>

## Showcase: past dit moodboard bij een stoere schurken-webshop?

<div class="showq">
  <div class="q"><b>1</b><div><h3>Straalt het stoer, eng en geheimzinnig uit?</h3><p>Kijk naar kleuren en plaatjes.</p></div></div>
  <div class="q"><b>2</b><div><h3>Zijn de letters goed leesbaar op de donkere achtergrond?</h3><p>Kopjes én gewone tekst.</p></div></div>
  <div class="q"><b>3</b><div><h3>Passen de kleuren en lettertypes bij elkaar én bij de persona?</h3><p>Kijk ook naar de accentkleur: valt die op de goede plek op?</p></div></div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">17</span></div>

Note: **Gagné 7: feedback geven (± 6 min).** Kies 2 of 3 moodboards (vraag vrijwilligers; zorg dat er niet steeds dezelfde leerlingen aan de beurt zijn) en laat ze op het grote scherm zien, bijvoorbeeld via een scherm delen of door de leerling aan de iMac van de docent te laten staan. Heeft iemand een Villain Card gemaakt? Laat die dan als bonus kort zien en vraag: "Valt de BESTEL NU-knop meteen op?" Stel per moodboard de drie vragen en laat de klas steeds met duimen stemmen: omhoog, zijwaarts of omlaag. Vraag daarna een toelichting aan twee leerlingen met verschillende stemmen. Geef zelf feedback volgens de regel top-tip-top: eerst iets positiefs, dan één tip, dan weer iets positiefs. Leg uit dat dit precies is hoe een klant naar een ontwerp kijkt.
---

<p class="kicker">Blok 6 · Afsluiting · Check</p>

## Check je werkboekje en Figma: ben je helemaal bij voor Les 3?

<div class="row" style="margin-top:18px;flex:0 0 auto">
  <div class="col">
    <div class="panel" style="flex:1">
      <span class="k">Heb je dit af?</span>
      <ul class="checklist">
        <li><span><strong>Opdracht 5:</strong> mijn flowchart met pijlen staat in mijn werkboekje.</span></li>
        <li><span><strong>Opdracht 8:</strong> ik heb per pagina opgeschreven welke knoppen ik heb en wat ze doen.</span></li>
        <li><span><strong>Opdracht 9:</strong> ik heb 3 strakke wireframes getekend (inclusief plek voor de video!).</span></li>
        <li><span><strong>Opdracht 10:</strong> mijn Moodboard staat in Figma in een frame met een goede naam.</span></li>
        <li><span><strong>Bonus:</strong> mijn Villain Card staat in een eigen frame.</span></li>
      </ul>
    </div>
  </div>
  <div class="col" style="flex:0 0 430px">
    <div class="panel panel--neon" style="flex:1">
      <span class="k">Volgende week · Les 3: opleveren Plan van Aanpak</span>
      <div class="next">
        <div><span>01</span>Hardware &amp; Software (Opdracht 6)</div>
        <div><span>02</span>Planning maken (Opdracht 7) &amp; PvA afronden!</div>
        <div><span>03</span>Starten met het uitwerken van je echte pagina's in Figma</div>
      </div>
    </div>
  </div>
</div>

<div class="defbox defbox--sm" style="margin-top:18px;padding:14px 22px">
  <span class="k">Exit-vraag · Laat zien aan je buur</span>
  <p style="font-size:24px">Welke <strong>kleur</strong> en welk <strong>lettertype</strong> op jouw moodboard vind je het best gelukt?</p>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 2</span><span class="num">18</span></div>

Note: **Gagné 8 + 9: beoordelen en transfer (± 4 min).** Lees de checklist voor en laat iedereen in het werkboekje afvinken. Vraag: "Steek je hand op als je alle vier de opdrachten af hebt." Wie iets mist, weet nu wat thuis of volgende week eerst af moet. **Exit-vraag:** eerst 30 seconden aan de buur laten zien (op de iMac), daarna 3 of 4 leerlingen hardop. Vooruitblik: volgende week rondt iedereen het Plan van Aanpak af (hardware en software, planning) en begint hij met het uitwerken van de echte pagina's in Figma, waarbij het moodboard en de wireframes de basis zijn. Neem het werkboekje weer mee. Laat de iMacs netjes afsluiten, sla de Figma-bestanden op (gebeurt automatisch) en ruim de potloden en linialen op. Sluit af met: "Goed gedaan, schurken. Tot volgende week!"

<!-- frontmatter
title: "Mega Villains Inc. — Les 4: Plan van Aanpak afronden en Homepage bouwen"
cohort: "2026-2027"
leerjaar: "vmbo jaar 2-3 (BB/KB/GL)"
periode: 1
auteur: "GLR Creative Software Developer"
tags: ["Keuzevak", "MVI K09", "Applicatieontwikkeling", "vmbo", "Plan van Aanpak", "SE1", "Figma", "Homepage", "Header", "Hero-banner", "Footer", "Opdracht 11"]
-->

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
  <p class="lede" style="font-size:30px;color:var(--mv-soft);max-width:700px;margin-top:26px">Welkom bij Les 4! Vandaag bouw je je eigen Homepage in Figma.</p>
  <p style="margin-top:22px"><span class="pill">Les 4 · Werkboekje af &amp; Homepage bouwen</span></p>
  <div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">01</span></div>
</div>

Note: **Gagné 1: aandacht trekken (± 3 min; blok 1 samen ± 10 min).** Laat deze slide staan bij binnenkomst. Op tafel: werkboekje, pen en wireframes uit Les 2. iMacs meteen aan. Openingszin: "Vorige week ging er veel mis en de helft had toetsweek. Vandaag maken we dat goed. Aan het eind van de les staat jouw Homepage." **Voorbereiding docent:** presentielijst van Les 3 bij de hand (wie is Spoor B?), SE1-beoordelingsformulieren, de MVI-afbeeldingenmap met het logo op de gedeelde schijf of in Teams, en je eigen Figma-demobestand met een moodboard open op het digibord.

---

<p class="kicker">Blok 1 · Op weg naar de kerstvakantie</p>

## Nog 3 lessen, dan is je webshop klaar

<div class="falls" style="margin-top:22px" role="img" aria-label="Roadmap tot de kerstvakantie in vier stappen: vandaag in Les 4 SE1 bijtrekken en pagina 1, de Homepage, bouwen; volgende week in Les 5 pagina 2 en 3 bouwen; over twee weken in Les 6 de webshop klikbaar maken en testen; de laatste les voor kerst is extra speling en een game- of kerstafsluiting.">
  <div class="fall fall--now" style="--i:0"><b>1</b><div><h3>Werkboekje af + Homepage bouwen<span class="tag">Vandaag</span></h3><p>We bouwen samen, stap voor stap.</p></div><span class="wk">Les 4</span></div>
  <div class="fall" style="--i:1"><b>2</b><div><h3>Pagina 2 en Pagina 3 bouwen</h3><p>Gaat snel: je kopieert de Header en Footer.</p></div><span class="wk">Les 5</span></div>
  <div class="fall" style="--i:2"><b>3</b><div><h3>Webshop klikbaar maken</h3><p>Je klikt echt door je eigen shop.</p></div><span class="wk">Les 6</span></div>
  <div class="fall" style="--i:3"><b>4</b><div><h3>Inhalen + kerstafsluiting</h3><p>Werk bij, daarna iets leuks met de klas!</p></div><span class="wk">Laatste les</span></div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">02</span></div>

Note: **Gagné 1 + 2: aandacht en doelen delen (± 3 min).** Wijs stap 1 aan: dat is vandaag. Les 5 gaat snel omdat we vandaag al een kopie maken (slide 12). De laatste les is de beloning: wie op schema is, heeft tijd voor een game of de kerstafsluiting; wie achterloopt, haalt dan in. Vraag: "Wat betekent 'klikbaar maken'?" (je klikt op een knop en gaat naar een andere pagina). Kort houden.

---

<p class="kicker">Blok 1 · Planning</p>

## Dit gaan we vandaag doen

<div class="row" style="margin-top:4px">
  <div class="col">
    <div class="rows rows--tight">
      <div class="listrow listrow--time"><span class="n">40 min</span><div><h3>Kies je spoor</h3><p>B: werkboekje af · A: Figma en plaatjes klaarzetten.</p></div></div>
      <div class="listrow listrow--time"><span class="n">15 min</span><div><h3>Demo: zet je pagina klaar</h3><p>Samen met de hele klas.</p></div></div>
      <div class="listrow listrow--time"><span class="n">20 min</span><div><h3>Sprint 1: de Header</h3><p>De balk bovenaan.</p></div></div>
      <div class="listrow listrow--time listrow--break"><span class="n">15 min</span><div><h3>Pauze</h3></div></div>
      <div class="listrow listrow--time"><span class="n">25 min</span><div><h3>Sprint 2: de Hero-banner</h3><p>Groot blok met knop en video.</p></div></div>
      <div class="listrow listrow--time"><span class="n">25 min</span><div><h3>Sprint 3: Categorieën &amp; Footer</h3><p>Game Boeven, Comic Boeven en de onderbalk.</p></div></div>
      <div class="listrow listrow--time"><span class="n">20 min</span><div><h3>Check &amp; Pagina 2 klaarzetten</h3><p>Zo start je snel in Les 5.</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:0 0 340px;justify-content:center">
    <div class="panel panel--neon">
      <span class="k">Je hebt nodig</span>
      <ul class="checklist" style="margin-top:4px">
        <li>Werkboekje + wireframes</li>
        <li>iMac met Figma</li>
        <li>Je moodboard uit Les 2</li>
      </ul>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">03</span></div>

Note: **Gagné 2: doelen delen (± 3 min).** Tijd (180 min): 10 intro, 40 twee sporen, 15 demo, 20 sprint 1, 15 pauze, 25 sprint 2 (incl. Figma-tip, slide 10), 25 sprint 3, 20 check en kopie, 10 showcase en afsluiting. Leg uit: "Een **sprint** is een kort blok met één doel en een timer." Zeg: "Vanaf de demo doet iedereen hetzelfde." Check of iedereen werkboekje en wireframes heeft; wie het werkboekje heeft ingeleverd, krijgt het terug of gebruikt een foto.

---

<p class="kicker">Blok 2 · Twee groepen</p>

## Kies jouw spoor

<div class="row" style="margin-top:16px;align-items:stretch">
  <div class="col">
    <div class="panel" style="flex:1;padding:16px 20px">
      <span class="k">Spoor B · Vorige week toetsweek</span>
      <p style="font-size:19px;margin-bottom:10px">Kom naar voren met je werkboekje. Dit telt voor 40% van je cijfer!</p>
      <ol class="steps steps--sm">
        <li style="font-size:18px"><span>Maak <strong>opdracht 6a en 6</strong> af: welke computer en programma's gebruik je?</span></li>
        <li style="font-size:18px"><span>Maak <strong>opdracht 7</strong> af: je planning.</span></li>
        <li style="font-size:18px"><span>Laat je werkboekje <strong>aftekenen</strong>. Log daarna in op Figma.</span></li>
      </ol>
    </div>
  </div>
  <div class="col">
    <div class="panel panel--neon" style="flex:1;padding:16px 20px">
      <span class="k">Spoor A · Was er vorige week</span>
      <p style="font-size:19px;margin-bottom:10px">Zet alles klaar. Dan bouw je straks sneller.</p>
      <ol class="steps steps--sm">
        <li style="font-size:18px"><span><strong>Log in op Figma</strong> en open je moodboard. Werkt het niet? Steek je hand op.</span></li>
        <li style="font-size:18px"><span>Maak een map <strong>MVI_Beelden</strong>. Zet daarin het <strong>logo</strong> + <strong>6 schurken</strong>. Geen helden!</span></li>
        <li style="font-size:18px"><span>Tijd over? Maak je moodboard mooier.</span></li>
      </ol>
    </div>
  </div>
  <div class="col" style="flex:0 0 230px">
    <div class="timer timer--lg" data-timer="40:00" role="group" aria-label="Voorbereiding-timer 40 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">40:00</span><span class="t-label">Voorbereiding</span></div>
      </div>
      <div class="t-btns">
        <button class="t-btn t-start" type="button">Start</button>
        <button class="t-btn t-reset" type="button">Reset</button>
      </div>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">04</span></div>

Note: **Gagné 3 + 6: voorkennis activeren en prestatie uitlokken (40 min).** Lees met de presentielijst van Les 3 voor wie Spoor B is; zij komen voorin zitten. Start de timer. **Spoor B (docent zit erbij):** 15 min opdracht 6a en 6 ("Hardware kun je vastpakken, software zijn de programma's"; "Shopt jouw persona op telefoon of pc? Waarom?"), 15 min opdracht 7 (watervalplanning: fases, taak, deadline), 10 min SE1-check en aftekenen. Zinsstarter: "Ik kies ... omdat mijn persona ...". **Voldoende:** hardware, software, device en een planning met 5 fases en deadlines. **Goed:** waarom-zinnen bij device en Figma. **Spoor A (zelfstandig):** check eerst of iedereen écht ingelogd is. Schurken: mix van game en comic, liefst png met transparante achtergrond (tip: zoek op "png transparent"). Snelle leerlingen zoeken alvast een groot plaatje voor het videovlak. **Na 40 min:** iedereen Figma open; Spoor B afgetekend of inhaalafspraak genoteerd.

---

<p class="kicker">Blok 3 · Demo · Doe mee!</p>

## Zet je Homepage klaar in Figma

<div class="tools">
  <div class="tool">
    <div class="keys"><span class="key key--wide">OPEN</span></div>
    <h3>1 · Bestand openen</h3>
    <p>Open je bestand met je <strong>moodboard</strong>.</p>
    <div class="layers" aria-label="Lagenpaneel met het frame Moodboard">
      <div class="good">Moodboard <b>✓</b></div>
    </div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">F</span></div>
    <h3>2 · Desktop Frame</h3>
    <p>Druk op <strong>F</strong>. Kies rechts <strong>Desktop</strong>.</p>
    <div class="layers" aria-label="Lijst met frame-formaten: Desktop 1440 bij 1024 is de goede keuze">
      <div>iPhone 16 · 393 × 852</div>
      <div class="good">Desktop · 1440 × 1024 <b>✓</b></div>
    </div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key key--wide">NAAM</span></div>
    <h3>3 · Goede naam</h3>
    <p>Dubbelklik op de naam. Typ <strong>1. Homepage</strong>.</p>
    <div class="layers" aria-label="Lagenpaneel: Desktop - 1 is fout, 1. Homepage is goed">
      <div class="bad">Desktop - 1 <b>✗</b></div>
      <div class="good">1. Homepage <b>✓</b></div>
    </div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">I</span></div>
    <h3>4 · Kleur prikken</h3>
    <p>Druk op <strong>I</strong>. Klik op de donkere kleur in je moodboard.</p>
    <div class="fillbar"><i style="background:#0B0710"></i>#0B0710</div>
  </div>
</div>

<div class="hotkeys">
  <span class="k-label">Vast? Probeer dit</span>
  <div><span class="key key--sm">Ctrl/⌘ + scroll</span>zoomen</div>
  <div><span class="key key--sm">Spatie + slepen</span>schuiven</div>
  <div><span class="key key--sm">Ctrl/⌘ Z</span>terug</div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">05</span></div>

Note: **Gagné 4 + 5: voordoen, "ik doe, wij doen" (15 min).** Hele klas doet mee. Doe elke stap voor; leerlingen doen hem na en steken hun hand op. Ga pas door als (bijna) iedereen zover is. 1: bij Recent het eigen bestand uit Les 2. Spoor B zonder moodboard: leeg bestand, straks met de buur 4 kleuren kiezen. 2: kies Desktop 1440 × 1024, sleep het frame naast het moodboard. "Een **frame** is je pagina: alles wat je bouwt, zet je erin." 3: het nummer zorgt dat pagina 1, 2 en 3 op volgorde staan. 4: eerst het frame selecteren. Lukt de pipet niet? Typ de kleurcode bij **Fill**. Laat de sneltoetsen onderaan meteen oefenen. **Check:** iedereen heeft "1. Homepage" met een donkere Fill.

---

<p class="kicker">Blok 3 · Opdracht 11 · Wat bouwen we?</p>

## Wireframe = waar. Moodboard = hoe.

<div class="w2d">
  <div>
    <span class="k-label">Wireframe 1 · de indeling</span>
    <div class="wf wf--lg wf--num" style="height:340px" role="img" aria-label="Wireframe van de homepage met drie genummerde delen: 1 de header met logo, zoekbalk en menu; 2 de banner met tekstlijnen, een knop en een videovlak; 3 de twee categorieblokken en een footer"><div class="wf-bar"><i></i><i></i><i></i></div><div class="wf-body">
      <div class="wf-head"><span class="wf-x" style="width:26px;height:22px"></span><span class="wf-l" style="width:40px"></span><span class="wf-search"></span><span class="wf-l" style="width:34px"></span><em class="wf-n">1</em></div>
      <div class="wf-hero"><em class="wf-n">2</em>
        <div class="wf-lines"><i class="t"></i><i class="w1"></i><i class="w2"></i><span class="wf-box wf-box--fill" style="margin-top:8px">[ SHOP NU ]</span></div>
        <div class="wf-x"><span class="wf-play">▶</span></div>
      </div>
      <div class="wf-cats"><em class="wf-n">3</em><div>GAME BOEVEN</div><div>COMIC BOEVEN</div></div>
      <div class="wf-foot"></div>
    </div></div>
  </div>
  <div>
    <span class="k-label">3 delen · van boven naar beneden</span>
    <div class="zones">
      <div class="zone"><b>1</b><div><h3>Header<small>De balk bovenaan</small></h3><p>Logo, naam, zoekbalk en menu.</p></div></div>
      <div class="zone"><b>2</b><div><h3>Hero-banner<small>Het grote blok</small></h3><p>Titel, knop en een <strong>videovlak</strong> ▶.</p></div></div>
      <div class="zone"><b>3</b><div><h3>Categorieën &amp; Footer<small>Onderaan</small></h3><p><strong>Game Boeven</strong>, <strong>Comic Boeven</strong> en de onderbalk.</p></div></div>
    </div>
    <div class="style-strip">
      <span class="k-label">+ jouw Moodboard</span>
      <div class="mini" aria-hidden="true"><i style="background:#0B0710"></i><i style="background:#3B1460"></i><i style="background:#8B0F1A"></i><i style="background:#A6E22E"></i></div>
      <div class="mini-aa" aria-hidden="true"><b>Aa</b><span>Aa</span></div>
      <span>kleuren &amp; lettertypes</span>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">06</span></div>

Note: **Gagné 4 + 5: inhoud presenteren (± 3 min, binnen de demotijd).** Wijs de drie delen in de wireframe aan: deel 1 is sprint 1, deel 2 sprint 2, deel 3 sprint 3. **Header** = balk bovenaan elke pagina, **Hero-banner** = groot blok dat je als eerste ziet, **Footer** = onderbalk met contact en info. Vraag: "Wat betekent het kruis [X]?" (een foto of het videovlak). Huisregel: alleen schurken, geen helden. **Voldoende (Opdracht 11, Homepage):** header met logo, menu en zoekbalk; hero met titel, tekst, knop en videovlak; 2 categorieën met knop; footer. **Goed:** daarnaast consequent de kleuren en fonts van het moodboard, netjes uitgelijnd, de accentkleur alleen op knoppen en passende beelden. Check het exacte puntenschema in de module.

---

<p class="kicker">Blok 3 · Sprint 1 · Opdracht 11 · Header</p>

## Sprint 1: bouw je Header

<div class="sprint">
  <div>
    <div class="mock mock--focus" role="img" aria-label="Voorbeeld van een uitgewerkte homepage in donkere schurkenstijl. De header bovenaan is uitgelicht: een groen logo, de naam Mega Villains Inc., een zoekbalk met Zoek een schurk, de menuknoppen met Home in de accentkleur, en een winkelwagen."><div class="wf-bar"><i></i><i></i><i></i></div><div class="mock-body">
      <div class="mk-head mk-zone on"><span class="mk-logo"></span><span class="mk-name">MEGA VILLAINS INC.</span><span class="mk-search">Zoek een schurk...</span><span class="mk-menu"><span style="color:var(--mv-neon)">Home</span><span>Alle Figuren</span><span>Game Boeven</span><span>Comic Boeven</span></span><span class="mk-cart"></span></div>
      <div class="mk-hero mk-zone"><div class="mk-copy"><span class="mk-title">Alleen voor echte <b>schurken</b></span><div class="mk-lines"><i style="width:92%"></i><i style="width:74%"></i></div><span class="mk-btn">SHOP NU</span></div><div class="mk-video"><svg viewBox="0 0 200 240" aria-hidden="true"><path d="M30 168 C10 182 2 210 0 240 L200 240 C198 210 190 182 170 168 C130 152 70 152 30 168 Z" fill="#1A1026" stroke="#5A3A8A" stroke-width="2"/><path d="M100 8 C58 8 36 46 34 92 C32 124 40 146 30 168 C70 152 130 152 170 168 C160 146 168 124 166 92 C164 46 142 8 100 8 Z" fill="#1F1430" stroke="#6A4A9A" stroke-width="2"/><ellipse cx="100" cy="104" rx="38" ry="46" fill="#05030A"/><g fill="#A6E22E"><ellipse cx="85" cy="102" rx="10" ry="3.5" transform="rotate(14 85 102)"/><ellipse cx="115" cy="102" rx="10" ry="3.5" transform="rotate(-14 115 102)"/></g></svg><span class="mk-play">▶</span></div></div>
      <div class="mk-bottom mk-zone"><span class="mk-sub">Kies jouw categorie</span><div class="mk-cats"><div class="mk-cat"><b class="mk-ct">GAME BOEVEN</b><div class="mk-figs"><i></i><i></i></div><span class="mk-more">BEKIJK ALLES</span></div><div class="mk-cat"><b class="mk-ct">COMIC BOEVEN</b><div class="mk-figs"><i></i><i></i></div><span class="mk-more">BEKIJK ALLES</span></div></div></div>
      <div class="mk-foot mk-zone">Contact · FAQ · Verzending · © Mega Villains Inc.</div>
    </div></div>
  </div>
  <ol class="steps steps--sm">
    <li><span>Druk op <strong>R</strong>. Teken bovenaan een balk over de <strong>hele breedte</strong>.</span></li>
    <li><span>Zet links het <strong>logo</strong>. Typ met <strong>T</strong> de naam ernaast.</span></li>
    <li><span>Maak een <strong>zoekbalk</strong> en zet rechts het <strong>menu</strong>.</span></li>
  </ol>
  <div class="timer timer--lg" data-timer="20:00" role="group" aria-label="Sprint 1-timer 20 minuten">
    <div class="t-dial">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="t-track" cx="60" cy="60" r="54"></circle>
        <circle class="t-prog" cx="60" cy="60" r="54"></circle>
      </svg>
      <div class="t-face"><span class="t-time">20:00</span><span class="t-label">Sprint 1 · Header</span></div>
    </div>
    <div class="t-btns">
      <button class="t-btn t-start" type="button">Start</button>
      <button class="t-btn t-reset" type="button">Reset</button>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">07</span></div>

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (20 min).** Doe stap 1 en 2 samen voor (± 5 min), start dan de timer. Het voorbeeld is een model, geen kopieeropdracht. **Tips bij het rondlopen:** balk: W 1440, H 95, X en Y 0. Naam: MEGA VILLAINS INC. Logo uit MVI_Beelden (Spoor B: map van de docent). Zoekbalk: R met corner radius ± 20 en tekst "Zoek een schurk...". Menu: Home (accentkleur), Alle Figuren, Game Boeven, Comic Boeven + winkelwagen. **Veelgemaakte fout:** dingen staan náást het frame; check of alles onder "1. Homepage" staat in het lagenpaneel. Vraag: "Waarom krijgt alleen Home de accentkleur?" (zo zie je waar je bent). **Voldoende:** balk over de volle breedte met logo, naam, zoekbalk en menuknoppen. **Goed:** menuknoppen op gelijke afstand en netjes uitgelijnd, de fonts uit het moodboard, een winkelwagen-icoon en de accentkleur alleen op Home. **Differentiatie:** BB richt zich op Voldoende; KB/GL zetten de menuknoppen in een Auto layout (Shift + A) zodat de afstanden automatisch gelijk zijn.

---

<!-- .slide: data-state="pauze" -->

<p class="kicker">Blok 4 · Pauze · 15 minuten</p>

<div class="row" style="align-items:center">
  <div class="col">
    <p class="break-title">Pauze!</p>
    <h2 style="font-size:36px;margin-top:22px;max-width:640px">Je Header is klaar! Na de pauze: de Hero-banner.</h2>
    <ul class="checklist" style="margin-top:24px">
      <li>Even weg van de iMac</li>
      <li>Loop een rondje</li>
      <li>Laat je Figma-tabblad openstaan</li>
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

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">08</span></div>

Note: **Pauze (15 min).** Start de timer als de pauze begint; "Terug om" vult zich vanzelf in. Complimenteer de klas: iedereen heeft een Header, ook Spoor B. Kijk rond wie nog geen logo of zoekbalk heeft; die krijgen na de pauze 3 min hulp. Zet je demobestand klaar bij de hero-banner.

---

<p class="kicker">Blok 5 · Sprint 2 · Opdracht 11 · Hero-banner</p>

## Sprint 2: bouw je Hero-banner

<div class="sprint">
  <div>
    <div class="mock mock--focus" role="img" aria-label="Voorbeeld van een uitgewerkte homepage in donkere schurkenstijl. De hero-banner is uitgelicht: links de titel Alleen voor echte schurken, twee tekstregels en een groene knop Shop nu; rechts een videovlak met een schurk en een grote play-knop."><div class="wf-bar"><i></i><i></i><i></i></div><div class="mock-body">
      <div class="mk-head mk-zone"><span class="mk-logo"></span><span class="mk-name">MEGA VILLAINS INC.</span><span class="mk-search">Zoek een schurk...</span><span class="mk-menu"><span style="color:var(--mv-neon)">Home</span><span>Alle Figuren</span><span>Game Boeven</span><span>Comic Boeven</span></span><span class="mk-cart"></span></div>
      <div class="mk-hero mk-zone on"><div class="mk-copy"><span class="mk-title">Alleen voor echte <b>schurken</b></span><div class="mk-lines"><i style="width:92%"></i><i style="width:74%"></i></div><span class="mk-btn">SHOP NU</span></div><div class="mk-video"><svg viewBox="0 0 200 240" aria-hidden="true"><path d="M30 168 C10 182 2 210 0 240 L200 240 C198 210 190 182 170 168 C130 152 70 152 30 168 Z" fill="#1A1026" stroke="#5A3A8A" stroke-width="2"/><path d="M100 8 C58 8 36 46 34 92 C32 124 40 146 30 168 C70 152 130 152 170 168 C160 146 168 124 166 92 C164 46 142 8 100 8 Z" fill="#1F1430" stroke="#6A4A9A" stroke-width="2"/><ellipse cx="100" cy="104" rx="38" ry="46" fill="#05030A"/><g fill="#A6E22E"><ellipse cx="85" cy="102" rx="10" ry="3.5" transform="rotate(14 85 102)"/><ellipse cx="115" cy="102" rx="10" ry="3.5" transform="rotate(-14 115 102)"/></g></svg><span class="mk-play">▶</span></div></div>
      <div class="mk-bottom mk-zone"><span class="mk-sub">Kies jouw categorie</span><div class="mk-cats"><div class="mk-cat"><b class="mk-ct">GAME BOEVEN</b><div class="mk-figs"><i></i><i></i></div><span class="mk-more">BEKIJK ALLES</span></div><div class="mk-cat"><b class="mk-ct">COMIC BOEVEN</b><div class="mk-figs"><i></i><i></i></div><span class="mk-more">BEKIJK ALLES</span></div></div></div>
      <div class="mk-foot mk-zone">Contact · FAQ · Verzending · © Mega Villains Inc.</div>
    </div></div>
  </div>
  <ol class="steps steps--sm">
    <li><span>Typ links een <strong>grote titel</strong>. Zet er 2 korte regels tekst onder.</span></li>
    <li><span>Maak een knop <strong>SHOP NU</strong> in je felle kleur.</span></li>
    <li><span><strong>Moet erin:</strong> rechts een <strong>videovlak</strong>. Een foto van een schurk met een <strong>▶</strong> erop.</span></li>
  </ol>
  <div class="timer timer--lg" data-timer="25:00" role="group" aria-label="Sprint 2-timer 25 minuten">
    <div class="t-dial">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="t-track" cx="60" cy="60" r="54"></circle>
        <circle class="t-prog" cx="60" cy="60" r="54"></circle>
      </svg>
      <div class="t-face"><span class="t-time">25:00</span><span class="t-label">Sprint 2 · Hero</span></div>
    </div>
    <div class="t-btns">
      <button class="t-btn t-start" type="button">Start</button>
      <button class="t-btn t-reset" type="button">Reset</button>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">09</span></div>

Note: **Gagné 5 + 6: leerbegeleiding en prestatie uitlokken (25 min).** Vraag na de pauze: "Wat zie je als eerste als je een webshop opent?" (groot beeld met een knop: de hero). Doe titel en knop kort voor (± 5 min), start dan de timer. **Tips bij het rondlopen:** titel in het kopjes-font, 64–80 px (bijv. "ALLEEN VOOR ECHTE SCHURKEN"); tekst 18–20 px, licht op donker. Knop: R met ronde hoeken + T, groeperen met Ctrl/⌘ G. **Videovlak:** grote rechthoek, schurkenfoto erin slepen (of Fill → Image). Play: cirkel (O + Shift) met ▶ erin. Een echte video hoeft nog niet. Vraag: "Is je tekst goed leesbaar?" **Voldoende:** titel, tekst, knop en videovlak met play-knop. **Goed:** duidelijk verschil tussen kop- en tekstfont, de knop is het felste element, alles netjes uitgelijnd en het beeld past bij de persona. **Differentiatie:** BB mag de voorbeeldtitel overnemen; KB/GL bedenken een eigen slogan en een tweede, rustigere knop (bijvoorbeeld "Bekijk video"). Laat in de laatste 2 minuten de Figma-tip van de volgende slide zien.

---

<p class="kicker">Blok 5 · Figma-tip · Vóór Sprint 3</p>

## 2 handige Figma-trucs

<div class="row" style="margin-top:26px;align-items:stretch">
  <div class="col">
    <div class="panel" style="flex:1">
      <span class="k">Meer ruimte nodig?</span>
      <h3>Maak je frame langer</h3>
      <ol class="steps steps--sm" style="margin-top:12px">
        <li><span>Klik op de naam <strong>1. Homepage</strong>.</span></li>
        <li><span>Sleep de <strong>onderkant</strong> naar beneden.</span></li>
      </ol>
      <p style="margin-top:14px;font-size:20px;color:var(--mv-soft)">Een webpagina mag lang zijn!</p>
    </div>
  </div>
  <div class="col">
    <div class="panel panel--neon" style="flex:1">
      <span class="k">Niet 2× tekenen!</span>
      <h3>Groeperen &amp; kopiëren</h3>
      <ol class="steps steps--sm" style="margin-top:12px">
        <li><span>Selecteer je blok. Groepeer met <span class="key key--sm">Ctrl/⌘ G</span></span></li>
        <li><span>Kopieer met <span class="key key--sm">Ctrl/⌘ D</span></span></li>
      </ol>
    </div>
  </div>
</div>

<div class="defbox defbox--sm" style="margin-top:20px;padding:12px 22px">
  <span class="k">Groeperen</span>
  <p style="font-size:21px">Losse delen worden <strong>één blok</strong>. Zo verplaats je alles in één keer.</p>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">10</span></div>

Note: **Gagné 4 + 5: inhoud presenteren en voordoen (± 3 min, eind Sprint 2).** Doe beide trucs live voor. Links: frame via de naam selecteren, onderrand omlaag slepen (bijv. van 1024 naar 1400), of bij H een groter getal typen. Rechts: rechthoek + tekst selecteren met Shift, Ctrl/⌘ G, laat de "Group" in het lagenpaneel zien en noem hem "Game Boeven". Dan Ctrl/⌘ D en de kopie naar rechts slepen. **Check (vingers opsteken):** "Wat doe je eerst: dupliceren of groeperen?" (eerst groeperen, anders kopieer je maar één onderdeel). Noem de truc "werk één keer, gebruik twee keer": die komt in Les 5 terug bij de 6 productkaartjes.

---

<p class="kicker">Blok 5 · Sprint 3 · Opdracht 11 · Categorieën &amp; Footer</p>

## Sprint 3: bouw je categorieën en Footer

<div class="sprint">
  <div>
    <div class="mock mock--focus" role="img" aria-label="Voorbeeld van een uitgewerkte homepage in donkere schurkenstijl. Onderaan zijn uitgelicht: de tussenkop Kies jouw categorie, twee blokken Game Boeven en Comic Boeven met elk twee plaatjes en een knop Bekijk alles, en een donkere footer met Contact, FAQ, Verzending en copyright Mega Villains Inc."><div class="wf-bar"><i></i><i></i><i></i></div><div class="mock-body">
      <div class="mk-head mk-zone"><span class="mk-logo"></span><span class="mk-name">MEGA VILLAINS INC.</span><span class="mk-search">Zoek een schurk...</span><span class="mk-menu"><span style="color:var(--mv-neon)">Home</span><span>Alle Figuren</span><span>Game Boeven</span><span>Comic Boeven</span></span><span class="mk-cart"></span></div>
      <div class="mk-hero mk-zone"><div class="mk-copy"><span class="mk-title">Alleen voor echte <b>schurken</b></span><div class="mk-lines"><i style="width:92%"></i><i style="width:74%"></i></div><span class="mk-btn">SHOP NU</span></div><div class="mk-video"><svg viewBox="0 0 200 240" aria-hidden="true"><path d="M30 168 C10 182 2 210 0 240 L200 240 C198 210 190 182 170 168 C130 152 70 152 30 168 Z" fill="#1A1026" stroke="#5A3A8A" stroke-width="2"/><path d="M100 8 C58 8 36 46 34 92 C32 124 40 146 30 168 C70 152 130 152 170 168 C160 146 168 124 166 92 C164 46 142 8 100 8 Z" fill="#1F1430" stroke="#6A4A9A" stroke-width="2"/><ellipse cx="100" cy="104" rx="38" ry="46" fill="#05030A"/><g fill="#A6E22E"><ellipse cx="85" cy="102" rx="10" ry="3.5" transform="rotate(14 85 102)"/><ellipse cx="115" cy="102" rx="10" ry="3.5" transform="rotate(-14 115 102)"/></g></svg><span class="mk-play">▶</span></div></div>
      <div class="mk-bottom mk-zone on"><span class="mk-sub">Kies jouw categorie</span><div class="mk-cats"><div class="mk-cat"><b class="mk-ct">GAME BOEVEN</b><div class="mk-figs"><i></i><i></i></div><span class="mk-more">BEKIJK ALLES</span></div><div class="mk-cat"><b class="mk-ct">COMIC BOEVEN</b><div class="mk-figs"><i></i><i></i></div><span class="mk-more">BEKIJK ALLES</span></div></div></div>
      <div class="mk-foot mk-zone on">Contact · FAQ · Verzending · © Mega Villains Inc.</div>
    </div></div>
  </div>
  <ol class="steps steps--sm">
    <li><span>Bouw het blok <strong>GAME BOEVEN</strong>: 2 foto's en een knop.</span></li>
    <li><span>Groepeer en kopieer het blok. Maak er <strong>COMIC BOEVEN</strong> van.</span></li>
    <li><span>Teken onderaan een donkere <strong>Footer</strong>-balk met <em>Contact · FAQ</em>.</span></li>
  </ol>
  <div class="timer timer--lg" data-timer="25:00" role="group" aria-label="Sprint 3-timer 25 minuten">
    <div class="t-dial">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="t-track" cx="60" cy="60" r="54"></circle>
        <circle class="t-prog" cx="60" cy="60" r="54"></circle>
      </svg>
      <div class="t-face"><span class="t-time">25:00</span><span class="t-label">Sprint 3 · Categorieën</span></div>
    </div>
    <div class="t-btns">
      <button class="t-btn t-start" type="button">Start</button>
      <button class="t-btn t-reset" type="button">Reset</button>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">11</span></div>

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (25 min).** Start de timer en loop rond. Eerst het frame langer maken (vorige slide). Tussenkop boven de blokken: bijv. "KIES JOUW CATEGORIE". Eerst één blok helemaal af (vlak, titel, 2 plaatjes, knop BEKIJK ALLES in dezelfde stijl als SHOP NU), dán groeperen en kopiëren. Plaatje vervangen: Fill → Image. Vergroten met Shift, zodat niets uitrekt. Footer: 1440 px breed, kleine tekst (Contact · FAQ · Verzending · © Mega Villains Inc.), zelfde kleur als de header. Vraag: "Zie je meteen het verschil tussen Game en Comic?" **Veelgemaakte fout:** game- en comicschurken door elkaar, of een held tussen de schurken. **Voldoende:** tussenkop, 2 blokken met plaatjes en een knop, en een footer. **Goed:** beide blokken even groot en netjes uitgelijnd, dezelfde knopstijl als in de hero en een footer die bij de header past. **Differentiatie:** BB gebruikt 2 plaatjes per blok; KB/GL zetten 3 plaatjes met een naam en prijs eronder.

---

<p class="kicker">Blok 5 · Eindcheck · Alvast voor Les 5</p>

## Check je werk en zet Pagina 2 klaar

<div class="row" style="margin-top:18px">
  <div class="col">
    <ol class="steps steps--sm">
      <li><span><strong>Check met je buur:</strong> zijn Header, Hero met video, 2 categorieën en Footer er?</span></li>
      <li><span><strong>Groepeer</strong> je Header. Groepeer ook je Footer.</span></li>
      <li><span>Kopieer <strong>1. Homepage</strong> met <strong>Ctrl/⌘ D</strong>. Noem hem <strong>2. Overzichtspagina</strong>. Haal het midden weg, Header en Footer blijven staan.</span></li>
    </ol>
  </div>
  <div class="col" style="flex:0 0 250px">
    <span class="k-label">Zo moet het eruitzien</span>
    <div class="layers" style="margin-top:6px;font-size:18px" aria-label="Lagenpaneel met twee frames: 1. Homepage en 2. Overzichtspagina, allebei goed">
      <div class="good">1. Homepage <b>✓</b></div>
      <div class="good">2. Overzichtspagina <b>✓</b></div>
    </div>
  </div>
  <div class="col" style="flex:0 0 230px">
    <div class="timer timer--lg" data-timer="20:00" role="group" aria-label="Check en kopie-timer 20 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">20:00</span><span class="t-label">Check &amp; Kopie</span></div>
      </div>
      <div class="t-btns">
        <button class="t-btn t-start" type="button">Start</button>
        <button class="t-btn t-reset" type="button">Reset</button>
      </div>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">12</span></div>

Note: **Gagné 7 + 9: feedback en transfer (20 min: 10 duo-check + 10 kopie).** **Duo-check:** leerlingen kijken bij de buur: logo, zoekbalk, menu, hero, video, 2 categorieën, footer, en is alles leesbaar? Ontbreekt iets, dan bouwt de eigenaar het meteen bij. Zelf feedback geven met top-tip-top. **Kopie:** doe stap 2 en 3 eerst voor. Let op: klik op de frame-naam, niet op iets ín het frame. Midden weghalen: hero en categorieën Shift-klikken in het lagenpaneel, Delete. **Check (handen op):** "Wie heeft twee frames naast elkaar?" **Transfer:** "Zo werken echte ontwerpers: één keer bouwen, slim hergebruiken." **Differentiatie:** KB/GL maken alvast een derde kopie: **3. Detailpagina**.

---

<p class="kicker">Blok 6 · Showcase · Op het grote scherm</p>

## Laat zien: past dit bij Mega Villains?

<div class="showq">
  <div class="q"><b>1</b><div><h3>Zie je meteen dat hier schurken verkocht worden?</h3><p>Kijk 1 seconde naar de pagina.</p></div></div>
  <div class="q"><b>2</b><div><h3>Zie je de knop en de video meteen?</h3><p>Waar kijk je als eerste naar?</p></div></div>
  <div class="q"><b>3</b><div><h3>Past het bij het moodboard?</h3><p>Leg ze naast elkaar.</p></div></div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">13</span></div>

Note: **Gagné 7: feedback geven (± 6 min).** Laat 2 homepages zien op het digibord (vrijwilligers, of bewust één uit Spoor B). Per vraag stemmen met duimen (omhoog, zijwaarts, omlaag); vraag twee leerlingen met een andere stem om uitleg. Bij vraag 3 het moodboard ernaast zetten. Sluit af met top-tip-top en bedank de ontwerper. Koppel terug aan de beoordeling: alles aanwezig is Voldoende, vraag 2 en 3 maken het verschil voor Goed.

---

<p class="kicker">Blok 6 · Afsluiting · Check</p>

## Klaar? Check deze 3 dingen

<div class="row" style="margin-top:18px;flex:0 0 auto">
  <div class="col">
    <div class="panel" style="flex:1">
      <span class="k">Heb je dit af?</span>
      <ul class="checklist">
        <li><span><strong>Werkboekje (SE1)</strong> is afgetekend.</span></li>
        <li><span><strong>1. Homepage</strong> is helemaal af.</span></li>
        <li><span><strong>2. Overzichtspagina</strong> staat klaar.</span></li>
      </ul>
    </div>
  </div>
  <div class="col" style="flex:0 0 470px">
    <div class="panel panel--neon" style="flex:1">
      <span class="k">Volgende week · Les 5</span>
      <div class="next">
        <div><span>01</span>Pagina 2 vullen met 6 schurken</div>
        <div><span>02</span>Pagina 3 bouwen voor je favoriete schurk</div>
      </div>
    </div>
  </div>
</div>

<div class="defbox defbox--sm" style="margin-top:18px;padding:14px 22px">
  <span class="k">Exit-vraag · Vertel je buur</span>
  <p style="font-size:24px">Welke schurk staat nu het <strong>grootst</strong> op jouw Homepage?</p>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">14</span></div>

Note: **Gagné 8 + 9: beoordelen en transfer (± 4 min).** Lees de checklist voor: "Hand op als je alle drie de vinkjes hebt." Checklist in detail: SE1 = werkboekje opdracht 1 t/m 9 afgetekend; Homepage = Header, Hero met video, 2 categorieën en Footer; Pagina 2 = kopie met dezelfde Header en Footer. Spoor B zonder aftekening: inhaalafspraak noteren. Homepage niet af? Eerste 15 min van Les 5. **Exit-vraag:** 30 sec aan de buur, daarna 3 of 4 hardop: "Waarom die schurk? Past hij bij je persona?" **Vooruitblik:** Les 5 vóór de pauze pagina 2 met 6 productkaartjes (Villain Card uit Les 1) en filters, ná de pauze de detailpagina. Map MVI_Beelden bewaren. iMacs netjes afsluiten (Figma slaat zelf op). Sluit af met: "Goed gedaan, schurken. Iedereen is weer bij. Tot volgende week!"

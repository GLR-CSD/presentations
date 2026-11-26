<!-- frontmatter
title: "Mega Villains Inc. — Les 4: Plan van Aanpak afronden en Homepage bouwen"
cohort: "2026-2027"
leerjaar: "vmbo (BB/KB/GL)"
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
  <p class="lede" style="font-size:30px;color:var(--mv-soft);max-width:700px;margin-top:26px">Welkom bij Les 4! Vandaag trekken we iedereen gelijk en bouwen we stap voor stap jouw echte Homepage in Figma.</p>
  <p style="margin-top:22px"><span class="pill">Les 4 · Plan van Aanpak afronden &amp; Homepage bouwen</span></p>
  <div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">01</span></div>
</div>

Note: **Gagné 1: aandacht trekken (tijdens binnenkomst, ± 3 min; blok 1 samen ± 10 min).** Laat deze slide staan terwijl de leerlingen binnenkomen. Op tafel: werkboekje, pen en de wireframes uit Les 2. De iMacs gaan meteen aan: vandaag testen we de techniek vóórdat we gaan bouwen. Openingszin: "Vorige week ging er van alles mis: de techniek deed raar en de helft van jullie had toetsweek. Vandaag maken we dat goed. Aan het eind van de les staat jouw Homepage." Rode draad (ABT): jullie hebben de bouwtekening en de stijl al (EN), MAAR nog niet iedereen heeft zijn Plan van Aanpak ingeleverd en niemand heeft de Homepage al echt gebouwd (MAAR), DAAROM trekken we eerst in 40 minuten iedereen gelijk en bouwen we daarna samen, stap voor stap (DAAROM). **Voorbereiding docent:** presentielijst van Les 3 bij de hand (wie is Spoor B?), SE1-beoordelingsformulieren, de MVI-afbeeldingenmap met het logo op de gedeelde schijf of in Teams, en je eigen Figma-demobestand met een moodboard open op het digibord.

---

<p class="kicker">Blok 1 · Het grote plaatje · Op weg naar de kerstvakantie</p>

## In 3 lessen bouwen we je klikbare webshop, dan blijft de laatste les vrij voor iets leuks!

<div class="falls" style="margin-top:22px" role="img" aria-label="Roadmap tot de kerstvakantie in vier stappen: vandaag in Les 4 SE1 bijtrekken en pagina 1, de Homepage, bouwen; volgende week in Les 5 pagina 2 en 3 bouwen; over twee weken in Les 6 de webshop klikbaar maken en testen; de laatste les voor kerst is extra speling en een game- of kerstafsluiting.">
  <div class="fall fall--now" style="--i:0"><b>1</b><div><h3>SE1 bijtrekken + Pagina 1: Homepage<span class="tag">Vandaag</span></h3><p>Iedereen gelijk, daarna bouwen we samen stap voor stap de Homepage.</p></div><span class="wk">Les 4</span></div>
  <div class="fall" style="--i:1"><b>2</b><div><h3>Pagina 2 (Overzicht) &amp; Pagina 3 (Detail)</h3><p>Gaat snel: Header en Footer kopieer je met een slimme truc.</p></div><span class="wk">Les 5</span></div>
  <div class="fall" style="--i:2"><b>3</b><div><h3>Je webshop klikbaar maken &amp; testen</h3><p>Knoppen koppelen in Figma, zodat je echt door je shop klikt.</p></div><span class="wk">Les 6</span></div>
  <div class="fall" style="--i:3"><b>4</b><div><h3>Extra speling + Game / Kerst-afsluiting</h3><p>Tijd om bij te werken en daarna iets gezelligs met de klas!</p></div><span class="wk">Laatste les</span></div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">02</span></div>

Note: **Gagné 1 + 2: aandacht en doelen delen (± 3 min).** Laat zien dat er een duidelijk einde in zicht is: "Nog 3 lessen bouwen, en dan hebben jullie een webshop waar je echt doorheen kunt klikken." Wijs op stap 1: dat is vandaag, met de groene rand. Benadruk dat Les 5 snel gaat omdat we vandaag al een slimme kopie maken (slide 12). Noem de laatste les als beloning: wie op schema blijft, heeft daar vrije tijd voor een game of de kerstafsluiting. Wie achterloopt, gebruikt die les als inhaalles. Vraag: "Wat denk je dat 'klikbaar maken' betekent?" (je klikt op een knop en gaat naar een andere pagina, net als in een echte webshop). Kort houden: de planning van vandaag staat op de volgende slide.

---

<p class="kicker">Blok 1 · Planning en doelen</p>

## Na 40 minuten voorbereiden bouwt de hele klas samen de Homepage

<div class="row" style="margin-top:4px">
  <div class="col">
    <div class="rows rows--tight">
      <div class="listrow listrow--time"><span class="n">40 min</span><div><h3>Start in 2 Sporen</h3><p>Spoor B: SE1 afmaken · Spoor A: Figma-check &amp; 6 schurken verzamelen.</p></div></div>
      <div class="listrow listrow--time"><span class="n">15 min</span><div><h3>Figma Demo (Hele klas)</h3><p>Desktop-frame (1440 × 1024) klaarzetten.</p></div></div>
      <div class="listrow listrow--time"><span class="n">20 min</span><div><h3>Sprint 1: De Header</h3><p>Logo, naam, zoekbalk en menu bouwen.</p></div></div>
      <div class="listrow listrow--time listrow--break"><span class="n">15 min</span><div><h3>Pauze</h3></div></div>
      <div class="listrow listrow--time"><span class="n">25 min</span><div><h3>Sprint 2: Hero &amp; Video</h3><p>Knallende banner met knop én videovlak.</p></div></div>
      <div class="listrow listrow--time"><span class="n">25 min</span><div><h3>Sprint 3: Categorieën &amp; Footer</h3><p><em>Game Boeven</em>, <em>Comic Boeven</em> en onderbalk.</p></div></div>
      <div class="listrow listrow--time"><span class="n">20 min</span><div><h3>Check &amp; Pagina 2 klaarzetten</h3><p>Dupliceren voor een vliegende start in Les 5!</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:0 0 340px;justify-content:center">
    <div class="panel panel--neon">
      <span class="k">Je hebt nodig</span>
      <ul class="checklist" style="margin-top:4px">
        <li>Je werkboekje + Wireframes</li>
        <li>iMac met werkend Figma-account</li>
        <li>Je <em>Moodboard</em> uit Les 2</li>
      </ul>
    </div>
  </div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">03</span></div>

Note: **Gagné 2: doelen delen (± 3 min).** Lees de grijze zinnen voor als leerdoelen in gewone taal. Tijdsverdeling (samen 180 min): 10 min intro (nu), 40 min twee sporen, 15 min demo, 20 min sprint 1, 15 min pauze, 25 min sprint 2 (inclusief Figma-tip, slide 10), 25 min sprint 3, 20 min check en kopie, 10 min showcase en afsluiting. Zeg erbij: "Vanaf de demo doet iedereen hetzelfde, op hetzelfde moment. Niemand loopt achter, niemand verveelt zich." Leg uit waarom we in **sprints** werken: korte blokjes met één duidelijk doel en een timer, zodat je steeds iets afmaakt. Check het rechterblok: heeft iedereen het werkboekje en de wireframes bij zich? Wie het werkboekje vorige week heeft ingeleverd, krijgt het nu terug of werkt met de foto van de wireframes.

---

<p class="kicker">Blok 2 · Parallelblok · Kies jouw spoor</p>

## Spoor B maakt het werkboekje af, Spoor A verzamelt alvast 6 vette schurken

<div class="row" style="margin-top:16px;align-items:stretch">
  <div class="col">
    <div class="panel" style="flex:1;padding:16px 20px">
      <span class="k">Spoor B · Vorige week toetsweek</span>
      <p style="font-size:19px;margin-bottom:10px">Kom naar voren met je werkboekje en maak <strong>SE1</strong> af (40% van je cijfer!):</p>
      <ol class="steps steps--sm">
        <li style="font-size:18px"><span><strong>Opdracht 6a &amp; 6:</strong> welke hardware, software en welk doel-device gebruik je (+ waarom)?</span></li>
        <li style="font-size:18px"><span><strong>Opdracht 7:</strong> vul je watervalplanning met fases en deadlines in.</span></li>
        <li style="font-size:18px"><span>Laat je werkboekje <strong>aftekenen</strong>, maak een foto van je <strong>Wireframes</strong> en log alvast in op Figma!</span></li>
      </ol>
    </div>
  </div>
  <div class="col">
    <div class="panel panel--neon" style="flex:1;padding:16px 20px">
      <span class="k">Spoor A · Was er vorige week</span>
      <p style="font-size:19px;margin-bottom:10px">Zet je iMac en beelden klaar, dan bouw je straks razendsnel:</p>
      <ol class="steps steps--sm">
        <li style="font-size:18px"><span><strong>Tech-check:</strong> log nu in op Figma en open je bestand met je <em>Moodboard</em>. Werkt iets niet? Meld het direct!</span></li>
        <li style="font-size:18px"><span><strong>Asset-jacht:</strong> maak een mapje <strong>MVI_Beelden</strong> met het <strong>MVI-logo</strong> + minstens <strong>6 foto's van game- en comicschurken</strong>. Géén helden! Tip: zoek op <em>png transparent</em>.</span></li>
        <li style="font-size:18px"><span><strong>Finetunen:</strong> maak je <em>Moodboard</em> en proef-knop helemaal strak.</span></li>
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

Note: **Gagné 3 + 6: voorkennis activeren en prestatie uitlokken (40 min).** Lees met de presentielijst van Les 3 hardop voor wie Spoor B is; zij pakken hun werkboekje en komen voorin bij elkaar zitten. Start de timer. **Spoor B (docent zit erbij):** doe Opdracht 6a en 6 samen in ± 15 min. Herhaal kort: "Hardware kun je vastpakken, software zijn de programma's." Vraag per leerling: "Waarop shopt jouw persona: telefoon of pc? Waarom?" Daarna Opdracht 7 in ± 15 min: fases in de goede volgorde, per fase een taak en een deadline. Laatste 10 min: SE1-check met het beoordelingsformulier en aftekenen. **Voldoende:** hardware, software, device en een watervalplanning met 5 fases en deadlines. **Goed:** waarom-zinnen bij device en Figma. **Spoor A (zelfstandig):** loop tussendoor één rondje. Check eerst of iedereen écht ingelogd is: technische problemen los je nú op, niet tijdens de demo. Check bij de asset-jacht: 6 verschillende schurken (mix game en comic), geen helden, liefst png met transparante achtergrond. Mapje op het bureaublad of in Downloads, zodat ze het straks snel vinden. **Differentiatie:** BB in Spoor B mag de zinsstarter "Ik kies ... omdat mijn persona ..." gebruiken. Snelle Spoor A-leerlingen (KB/GL) zoeken alvast een groot, sfeervol schurkenplaatje voor het videovlak. **Na 40 min:** iedereen Figma open, werkboekjes van Spoor B zijn afgetekend of er is een inhaalafspraak genoteerd.

---

<p class="kicker">Blok 3 · Praktijk · Live demo · Doe mee!</p>

## Zo zet je in Figma jouw echte Homepage klaar naast je Moodboard

<div class="tools">
  <div class="tool">
    <div class="keys"><span class="key key--wide">OPEN</span></div>
    <h3>1 · Bestand openen</h3>
    <p>Ga naar je eigen Figma-bestand waar je <strong>Moodboard</strong> in staat.</p>
    <div class="layers" aria-label="Lagenpaneel met het frame Moodboard">
      <div class="good">Moodboard <b>✓</b></div>
    </div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">F</span></div>
    <h3>2 · Desktop Frame</h3>
    <p>Druk op <strong>F</strong> en klik rechts bij <em>Frames</em> op <strong>Desktop</strong>.</p>
    <div class="layers" aria-label="Lijst met frame-formaten: Desktop 1440 bij 1024 is de goede keuze">
      <div>iPhone 16 · 393 × 852</div>
      <div class="good">Desktop · 1440 × 1024 <b>✓</b></div>
    </div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key key--wide">NAAM</span></div>
    <h3>3 · Goede naam</h3>
    <p>Dubbelklik op <strong>Desktop - 1</strong> en noem je frame meteen <strong>1. Homepage</strong>.</p>
    <div class="layers" aria-label="Lagenpaneel: Desktop - 1 is fout, 1. Homepage is goed">
      <div class="bad">Desktop - 1 <b>✗</b></div>
      <div class="good">1. Homepage <b>✓</b></div>
    </div>
  </div>
  <div class="tool">
    <div class="keys"><span class="key">I</span></div>
    <h3>4 · Kleur prikken</h3>
    <p>Klik op <strong>1. Homepage</strong>, druk op <strong>I</strong> (pipetje) en prik je donkere basiskleur uit je Moodboard!</p>
    <div class="fillbar"><i style="background:#0B0710"></i>#0B0710</div>
  </div>
</div>

<div class="hotkeys">
  <span class="k-label">Handig bij vastlopen</span>
  <div><span class="key key--sm">Ctrl/⌘ + scroll</span>in- en uitzoomen</div>
  <div><span class="key key--sm">Spatie + slepen</span>canvas bewegen</div>
  <div><span class="key key--sm">Ctrl/⌘ Z</span>ongedaan maken</div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">05</span></div>

Note: **Gagné 4 + 5: voordoen, "ik doe, wij doen" (15 min, inclusief meedoen).** Vanaf nu doet de hele klas mee, Spoor A en B samen. Doe elke stap live voor op het digibord; na elke stap doen de leerlingen hem meteen na en steken ze hun hand op als het gelukt is. Ga pas door als (bijna) iedereen zover is. 1: open Figma en kies bij Recent je eigen bestand uit Les 2 (bijvoorbeeld MVI_JouwNaam). Spoor B-leerlingen zonder moodboard maken een leeg bestand en kiezen straks samen met de buur 4 kleuren. 2: druk op F; rechts verschijnt een lijst met formaten. Kies onder Desktop het formaat 1440 × 1024 en sleep het frame naast je moodboard. Leg uit: "Een **frame** is je pagina: alles wat je bouwt, zet je erin." 3: dubbelklik op de naam boven het frame of in het lagenpaneel en typ "1. Homepage". Waarom het nummer? "Straks heb je pagina 2 en 3; zo staan ze netjes op volgorde." 4: frame selecteren, op I drukken en op de donkere kleur in je moodboard klikken. Lukt de pipet niet? Klik rechts bij **Fill** (de opvulkleur) op het kleurvakje en typ de kleurcode over. Laat de sneltoetsen onderaan meteen oefenen: inzoomen, canvas verschuiven, ongedaan maken. **Check:** iedereen heeft een frame "1. Homepage" met een donkere Fill voordat je doorklikt.

---

<p class="kicker">Blok 3 · Opdracht 11 · Wat bouwen we vandaag?</p>

## Je combineert vandaag je Wireframe (de indeling) met je Moodboard (de stijl)

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
    <span class="k-label">3 bouwblokken · volgens de briefing</span>
    <div class="zones">
      <div class="zone"><b>1</b><div><h3>Sprint 1 · Header<small>Vóór de pauze</small></h3><p>MVI-logo, naam <em>Mega Villains Inc.</em>, zoekbalk en menuknoppen.</p></div></div>
      <div class="zone"><b>2</b><div><h3>Sprint 2 · Hero-banner + Video<small>Ná de pauze</small></h3><p>Stoere hoofdtitel, korte tekst, opvallende knop én het <strong>videovlak</strong> met Play-knop ▶.</p></div></div>
      <div class="zone"><b>3</b><div><h3>Sprint 3 · Categorieën &amp; Footer<small>Onderaan</small></h3><p>De 2 grote blokken <strong>Game Boeven</strong> en <strong>Comic Boeven</strong> + de donkere onderbalk.</p></div></div>
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

Note: **Gagné 4 + 5: inhoud presenteren en leerbegeleiding (± 3 min, binnen de demotijd).** Wijs de drie genummerde delen in de wireframe aan en koppel ze aan de sprints rechts: we bouwen van boven naar beneden. Leg de drie woorden uit: **Header** = de vaste balk bovenaan elke pagina, **Hero-banner** = het grote opvallende blok dat je als eerste ziet, **Footer** = de onderbalk met contact en info. Zeg: "De wireframe zegt **wáár** iets komt, het moodboard zegt **hoe** het eruitziet." Vraag: "Wat staat er in de wireframe als kruis [X]? Wat wordt dat straks?" (een echte foto of het videovlak). Herinner aan de huisregel: alleen schurken, geen helden. **Voldoende (Opdracht 11, Homepage):** header met logo, menu en zoekbalk; hero met titel, tekst, knop en videovlak; 2 categorieën met knop; footer. **Goed:** daarnaast consequent de kleuren en fonts van het moodboard, netjes uitgelijnd, de accentkleur alleen op knoppen en passende beelden. Check het exacte puntenschema in de module.

---

<p class="kicker">Blok 3 · Sprint 1 · Opdracht 11 · Header</p>

## Sprint 1 (20 min): bouw bovenaan je Header met logo, zoekbalk en menu

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
    <li><span>Teken met <strong>R</strong> bovenaan je frame een balk over de hele breedte (<strong>1440 px</strong> breed, ongeveer <strong>95 px</strong> hoog).</span></li>
    <li><span>Plak helemaal links het <strong>MVI-logo</strong> en typ er met <strong>T</strong> naast: <strong>MEGA VILLAINS INC.</strong></span></li>
    <li><span>Teken in het midden een <strong>zoekbalk</strong> (rechthoek met afgeronde hoekjes + tekst <em>Zoek een schurk...</em>).</span></li>
    <li><span>Zet rechts de <strong>menuknoppen</strong> op één lijn: <em>Home</em> (in je accentkleur!), <em>Alle Figuren</em>, <em>Game Boeven</em>, <em>Comic Boeven</em> + winkelwagen.</span></li>
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

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (20 min).** Doe stap 1 en 2 eerst samen voor (± 5 min), start daarna de timer voor de rest. Het voorbeeld links is een model, geen kopieeropdracht: leerlingen gebruiken hun eigen kleuren, fonts en wireframe. **Tips bij het rondlopen:** teken de balk met R en typ rechts bij W en H precies 1440 en 95, en bij X en Y een 0; dan staat hij strak bovenaan. Logo: sleep het uit het mapje MVI_Beelden het frame in (Spoor B zonder mapje: gebruik de MVI-afbeeldingenmap van de docent). Zoekbalk: R, en rechts bij de hoekafronding (corner radius) bijvoorbeeld 20 invullen. **Veelgemaakte fout:** dingen staan náást het frame in plaats van erin. Check in het lagenpaneel of alles ingesprongen onder "1. Homepage" staat. Vraag: "Is je zoekbalk goed leesbaar op je donkere header?" en "Waarom krijgt alleen Home de accentkleur?" (zo zie je op welke pagina je bent). **Voldoende:** balk over de volle breedte met logo, naam, zoekbalk en menuknoppen. **Goed:** menuknoppen op gelijke afstand en netjes uitgelijnd, de fonts uit het moodboard, een winkelwagen-icoon en de accentkleur alleen op Home. **Differentiatie:** BB richt zich op Voldoende; KB/GL zetten de menuknoppen in een Auto layout (Shift + A) zodat de afstanden automatisch gelijk zijn.

---

<!-- .slide: data-state="pauze" -->

<p class="kicker">Blok 4 · Pauze · 15 minuten</p>

<div class="row" style="align-items:center">
  <div class="col">
    <p class="break-title">Pauze!</p>
    <h2 style="font-size:36px;margin-top:22px;max-width:640px">Je Header staat! Na de pauze bouwen we de Hero-banner met video en de 2 categorieblokken.</h2>
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

Note: **Pauze (15 min).** Ga pas naar deze slide als de pauze echt begint en start de timer; de tijd bij "Terug om" wordt automatisch ingevuld (nu + 15 minuten). Complimenteer de klas kort: iedereen heeft nu een Header, ook Spoor B. Gebruik de pauze om rond te kijken: wie heeft nog geen logo of zoekbalk? Die leerlingen krijgen na de pauze in de eerste 3 minuten even hulp. Zet je eigen demobestand klaar bij de hero-banner en check of de ingeleverde werkboekjes van Spoor B allemaal zijn afgetekend.

---

<p class="kicker">Blok 5 · Sprint 2 · Opdracht 11 · Hero-banner</p>

## Sprint 2 (25 min): trek meteen de aandacht met je Hero-banner én videovlak

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
    <li><span>Typ links onder je header een <strong>grote, stoere hoofdtitel</strong> in jouw kopjes-lettertype (bijv. <em>"ALLEEN VOOR ECHTE SCHURKEN"</em>).</span></li>
    <li><span>Zet daaronder 2 of 3 korte regels uitleg in jouw goed leesbare lettertype (lichte tekst op donkere achtergrond!).</span></li>
    <li><span>Bouw daaronder een opvallende <strong>knop (SHOP NU)</strong> met <strong>R</strong> + jouw felle accentkleur (neongroen of felrood).</span></li>
    <li><span><strong>Verplicht onderdeel:</strong> bouw rechts het <strong>videovlak</strong>: een grote foto van een schurk met in het midden een duidelijke cirkel + <strong>Play-driehoek ▶</strong>!</span></li>
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

Note: **Gagné 5 + 6: leerbegeleiding en prestatie uitlokken (25 min).** Start na de pauze met een vraag: "Wat zie je als eerste als je een webshop opent?" (een groot beeld met een knop: de hero). Doe de titel en de knop kort voor (± 5 min), start dan de timer. Dit is het belangrijkste blok van de pagina: hier moet de bezoeker "wow" denken. **Tips bij het rondlopen:** titel groot (bijvoorbeeld 64 tot 80 px), gewone tekst 18 tot 20 px. Knop: een rechthoek (R) met afgeronde hoeken en tekst (T) erop; selecteer beide en groepeer met Ctrl/⌘ G. **Videovlak:** teken een grote rechthoek en sleep er een schurkenfoto uit MVI_Beelden in (of kies bij Fill → Image). Play-knop: een cirkel (O, houd Shift ingedrukt voor een perfecte cirkel) met daarin een driehoek: typ ▶ met T, of kies de Polygon-vorm met 3 hoeken en draai die. Er hoeft nog geen echte video in: het vlak laat zien wáár de video komt. Vraag: "Waar kijkt een bezoeker als eerste naar?" en "Is je tekst goed leesbaar op de donkere achtergrond?" **Voldoende:** titel, tekst, knop en videovlak met play-knop. **Goed:** duidelijk verschil tussen kop- en tekstfont, de knop is het felste element, alles netjes uitgelijnd en het beeld past bij de persona. **Differentiatie:** BB mag de voorbeeldtitel overnemen; KB/GL bedenken een eigen slogan en een tweede, rustigere knop (bijvoorbeeld "Bekijk video"). Laat in de laatste 2 minuten de Figma-tip van de volgende slide zien.

---

<p class="kicker">Blok 5 · Figma-tip · Vóór Sprint 3</p>

## Past het niet op je scherm? Zo maak je je frame langer en kopieer je slim

<div class="row" style="margin-top:26px;align-items:stretch">
  <div class="col">
    <div class="panel" style="flex:1">
      <span class="k">Meer ruimte nodig?</span>
      <h3>Maak je frame langer</h3>
      <ol class="steps steps--sm" style="margin-top:12px">
        <li><span>Klik op de naam <strong>1. Homepage</strong> linksboven je frame.</span></li>
        <li><span>Sleep het <strong>onderste randje</strong> naar beneden, bijv. van <strong>1024</strong> naar <strong>1400</strong> hoog.</span></li>
      </ol>
      <p style="margin-top:14px;font-size:20px;color:var(--mv-soft)">Een webpagina mag scrollen!</p>
    </div>
  </div>
  <div class="col">
    <div class="panel panel--neon" style="flex:1">
      <span class="k">Niet 2× tekenen!</span>
      <h3>Groeperen &amp; dupliceren</h3>
      <ol class="steps steps--sm" style="margin-top:12px">
        <li><span>Bouw eerst het blok <strong>Game Boeven</strong> helemaal af.</span></li>
        <li><span>Selecteer alles en groepeer met <span class="key key--sm">Ctrl/⌘ G</span></span></li>
        <li><span>Dupliceer met <span class="key key--sm">Ctrl/⌘ D</span> voor <strong>Comic Boeven</strong>!</span></li>
      </ol>
    </div>
  </div>
</div>

<div class="defbox defbox--sm" style="margin-top:20px;padding:12px 22px">
  <span class="k">Groeperen</span>
  <p style="font-size:21px">Je plakt losse vormen en teksten aan elkaar vast tot <strong>één blok</strong>. Dan verschuif of kopieer je alles in één keer.</p>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">10</span></div>

Note: **Gagné 4 + 5: inhoud presenteren en voordoen (± 3 min, aan het eind van Sprint 2).** Doe beide trucs live voor in je demobestand. Links: selecteer het frame via de naam, pak de onderrand en sleep omlaag; laat zien dat de inhoud blijft staan en er onderaan ruimte bijkomt. Of typ rechts bij H een groter getal. Zeg: "Een echte webshop is ook langer dan je scherm: je scrollt naar beneden." Rechts: bouw een mini-blok (rechthoek + tekst), selecteer beide met Shift, Ctrl/⌘ G, en laat in het lagenpaneel zien dat er nu één map "Group" staat. Dubbelklik op de groepsnaam en noem hem "Game Boeven". Daarna Ctrl/⌘ D en sleep de kopie naar rechts. **Check (vingers opsteken):** "Wat doe je eerst: dupliceren of groeperen?" (eerst groeperen, anders kopieer je maar één onderdeel). Noem de truc "werk één keer, gebruik twee keer": die komt in Les 5 terug bij de 6 productkaartjes.

---

<p class="kicker">Blok 5 · Sprint 3 · Opdracht 11 · Categorieën &amp; Footer</p>

## Sprint 3 (25 min): bouw Game Boeven, Comic Boeven en sluit af met een Footer

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
    <li><span>Zet onder je Hero-banner een duidelijke tussenkop (bijv. <strong>KIES JOUW CATEGORIE</strong>).</span></li>
    <li><span>Bouw links het blok <strong>GAME BOEVEN</strong> met 2 schurkenfoto's en een knop <strong>BEKIJK ALLES</strong>.</span></li>
    <li><span>Groepeer (<strong>Ctrl/⌘ + G</strong>) en dupliceer (<strong>Ctrl/⌘ + D</strong>) dit blok naar rechts en maak er <strong>COMIC BOEVEN</strong> van, met comic-schurken.</span></li>
    <li><span>Teken helemaal onderaan een donkere <strong>Footer-balk</strong> (<strong>1440 px</strong> breed) met <em>Contact · FAQ · Verzending · © Mega Villains Inc.</em></span></li>
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

Note: **Gagné 6 + 7: prestatie uitlokken en feedback (25 min).** Start de timer en loop rond. Eerst het frame langer maken (vorige slide), anders past alles niet. Laat ze één categorieblok helemaal afmaken (vlak, titel, 2 plaatjes, knop) vóór ze groeperen en dupliceren; dan hoeven ze in het tweede blok alleen de tekst en plaatjes te vervangen. Plaatje vervangen in de kopie: selecteer het plaatje, kies rechts bij Fill → Image een andere schurk uit MVI_Beelden. Plaatjes vergroten met Shift ingedrukt, zodat ze niet uitrekken. **BEKIJK ALLES-knop:** zelfde stijl als de SHOP NU-knop, dat ziet er rustig en professioneel uit. Footer: weer een balk van 1440 px breed met kleine tekst, in dezelfde kleur als de header. Vraag: "Zie je meteen het verschil tussen Game en Comic?" (bijvoorbeeld paars tegenover rood als accent). **Veelgemaakte fout:** game- en comicschurken door elkaar, of een held tussen de schurken. **Voldoende:** tussenkop, 2 blokken met plaatjes en een knop, en een footer. **Goed:** beide blokken even groot en netjes uitgelijnd, dezelfde knopstijl als in de hero en een footer die bij de header past. **Differentiatie:** BB gebruikt 2 plaatjes per blok; KB/GL zetten 3 plaatjes met een naam en prijs eronder.

---

<p class="kicker">Blok 5 · Eindcheck · Voorsprong voor Les 5</p>

## Check je Homepage met je buur en zet in 2 klikken Pagina 2 alvast klaar!

<div class="row" style="margin-top:18px">
  <div class="col">
    <ol class="steps steps--sm">
      <li><span><strong>Duo-check (10 min):</strong> zitten logo, zoekbalk, menu, hero-banner, <strong>video</strong>, 2 categorieën en footer er allemaal in? En zijn alle teksten scherp leesbaar?</span></li>
      <li><span><strong>Groepeer je Header</strong> (<strong>Ctrl/⌘ + G</strong>) en <strong>groepeer je Footer</strong> (<strong>Ctrl/⌘ + G</strong>).</span></li>
      <li><span><strong>De Kopieer-truc voor Les 5:</strong> klik op de naam <strong>1. Homepage</strong> → druk op <strong>Ctrl/⌘ + D</strong> → noem het nieuwe frame <strong>2. Overzichtspagina</strong>.</span></li>
      <li><span>Gooi op <strong>2. Overzichtspagina</strong> het middenstuk leeg, maar <strong>laat je Header en Footer staan</strong>!</span></li>
    </ol>
  </div>
  <div class="col" style="flex:0 0 250px">
    <span class="k-label">Zo ziet je lagenpaneel eruit</span>
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

Note: **Gagné 7 + 9: feedback en transfer (20 min: 10 duo-check + 10 kopie).** **Duo-check (10 min):** leerlingen draaien hun stoel naar de iMac van de buur en lopen de lijst van stap 1 hardop af. Ontbreekt er iets? Dan zegt de buur het, en de eigenaar bouwt het meteen bij. Geef zelf feedback volgens top-tip-top: eerst iets positiefs, dan één tip, dan weer iets positiefs. Vraag: "Waar kijk je als eerste naar op de pagina van je buur? Is dat ook het belangrijkste?" **Kopie (10 min):** doe stap 2 t/m 4 eerst live voor, daarna doet iedereen mee. Benadruk: klik op de frame-naam, niet op iets ín het frame, anders kopieer je alleen dat ene onderdeel. Na Ctrl/⌘ D staat de kopie er meteen naast. Hernoemen: dubbelklik op de naam. Middenstuk leegmaken: selecteer de hero en de categorieën (Shift-klik in het lagenpaneel) en druk op Delete; dankzij het groeperen blijven Header en Footer heel. **Check (handen op):** "Wie heeft twee frames naast elkaar staan?" **Transfer:** "Dit is precies hoe echte ontwerpers werken: één keer bouwen, daarna slim hergebruiken. Volgende week vul je pagina 2 in één les." **Differentiatie:** KB/GL maken alvast een derde kopie: **3. Detailpagina**.

---

<p class="kicker">Blok 6 · Showcase · Op het grote scherm</p>

## Showcase: straalt deze Homepage echt Mega Villains Inc. uit?

<div class="showq">
  <div class="q"><b>1</b><div><h3>Zie je in één seconde dat deze webshop alleen schurken verkoopt?</h3><p>Kijk eerst alleen even snel naar de hele pagina.</p></div></div>
  <div class="q"><b>2</b><div><h3>Springen de SHOP NU-knop en het videovlak meteen in het oog?</h3><p>Wijs aan waar je ogen als eerste naartoe gaan.</p></div></div>
  <div class="q"><b>3</b><div><h3>Klopt de stijl met het Moodboard van de ontwerper?</h3><p>Leg het moodboard en de homepage naast elkaar.</p></div></div>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">13</span></div>

Note: **Gagné 7: feedback geven (± 6 min).** Kies 2 homepages om op het digibord te laten zien: vraag vrijwilligers, of kies bewust één leerling uit Spoor B (zo zien ze dat ze de achterstand hebben ingehaald). Laat per homepage eerst 1 seconde de hele pagina zien en stel dan vraag 1. Laat de klas bij elke vraag met duimen stemmen: omhoog, zijwaarts of omlaag. Vraag daarna aan twee leerlingen met een verschillende stem om uitleg. Vraag 3: zet het moodboard van de ontwerper ernaast in beeld. Sluit elke homepage af met top-tip-top en bedank de ontwerper. Koppel terug aan de beoordeling: alles aanwezig is Voldoende, vraag 2 en 3 maken het verschil voor Goed.

---

<p class="kicker">Blok 6 · Afsluiting · Check</p>

## Pagina 1 is af en Pagina 2 staat al klaar! Check voor je uitlogt:

<div class="row" style="margin-top:18px;flex:0 0 auto">
  <div class="col">
    <div class="panel" style="flex:1">
      <span class="k">Heb je dit af?</span>
      <ul class="checklist">
        <li><span><strong>SE1 ingeleverd:</strong> mijn hele werkboekje (Opdracht 1 t/m 9) is afgetekend.</span></li>
        <li><span><strong>1. Homepage compleet:</strong> Header, Hero-banner met video, 2 categorieën en Footer zijn af.</span></li>
        <li><span><strong>2. Overzichtspagina staat klaar:</strong> gekopieerd frame met dezelfde Header en Footer staat ernaast.</span></li>
      </ul>
    </div>
  </div>
  <div class="col" style="flex:0 0 470px">
    <div class="panel panel--neon" style="flex:1">
      <span class="k">Volgende week · Les 5: Overzicht &amp; Detailpagina</span>
      <div class="next">
        <div><span>01</span>Voor de pauze: Overzichtspagina vullen met 6 schurken + filters</div>
        <div><span>02</span>Na de pauze: Detailpagina bouwen voor jouw top-villain!</div>
      </div>
    </div>
  </div>
</div>

<div class="defbox defbox--sm" style="margin-top:18px;padding:14px 22px">
  <span class="k">Exit-vraag · Vertel je buur</span>
  <p style="font-size:24px">Welke schurk staat nu het <strong>grootst</strong> op jouw Homepage?</p>
</div>

<div class="footer"><span>Mega Villains Inc. · Les 4</span><span class="num">14</span></div>

Note: **Gagné 8 + 9: beoordelen en transfer (± 4 min).** Lees de checklist voor en vraag: "Steek je hand op als je alle drie de vinkjes hebt." Spoor B-leerlingen die SE1 nog niet afgetekend hebben: noteer een inhaalafspraak op het beoordelingsformulier. Wie de homepage nog niet af heeft, maakt die in de eerste 15 minuten van Les 5 af. **Exit-vraag:** eerst 30 seconden aan de buur vertellen, daarna 3 of 4 leerlingen hardop. Vraag door: "Waarom juist die schurk? Past hij bij je persona?" **Vooruitblik:** volgende week vul je pagina 2 met minimaal 6 productkaartjes (je Villain Card uit Les 1 komt terug!) en filters, en na de pauze bouw je de detailpagina voor jouw favoriete schurk. Vraag iedereen het mapje MVI_Beelden te bewaren: die 6 schurken heb je volgende week nodig. Laat de iMacs netjes afsluiten (Figma slaat automatisch op). Sluit af met: "Goed gedaan, schurken. Iedereen is weer bij. Tot volgende week!"

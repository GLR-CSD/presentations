---
title: "Van design naar issues — en dan parallel bouwen"
cohort: "2026-2027"
leerjaar: 2
periode: 2
auteur: "Docententeam CSD"
tags: ["Beroeps", "Agile", "Design Thinking", "GitHub Projects", "Issues", "User Stories", "Definition of Ready", "Teamwork"]
<!-- .slide: data-visibility="hidden" -->
---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:150px"></div>
<p class="kicker kicker--lime">Beroeps 2 · Workshop · 2 lesuren</p>
<h1 class="title title--xl" style="color:#fff">Van ontwerp naar bouwen — zonder dat iemand zit te wachten</h1>
<p class="lede" style="color:#EDEDED;font-size:30px">Je Design Thinking-documenten worden issues die klaar zijn om te bouwen. Daarna verdeel je ze, zodat het hele team tegelijk werkt.</p>
<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">01</span></div>

Note: Welkom. Vandaag is een workshop: ongeveer de helft van de tijd werken teams aan hun eigen project. Laat studenten bij binnenkomst bij hun team zitten met laptop, repo en GitHub Project open. Ook de Design Thinking-documenten (docs/) moeten open staan. Dit is een verdieping op de les "De bouwworkflow in 5 stappen": die liet de route zien, vandaag leren we de lastige stukken tussen de stappen. Tijd: 00:00–00:03.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:60px"></div>
<p class="kicker kicker--lime">Het scenario · 10:15 op maandagochtend</p>
<h2 class="title" style="color:#fff;max-width:1050px">Drie developers, één issue: “Maak de website”. Wie doet wat?</h2>
<ul class="check" style="margin-top:30px">
  <li class="fragment" style="color:#EDEDED">Eén begint aan de database, de twee anderen wachten op tabelnamen.</li>
  <li class="fragment" style="color:#EDEDED">Eén bouwt de header — en de ander ook. Straks: merge-conflict.</li>
  <li class="fragment" style="color:#EDEDED">Niemand weet wanneer “Maak de website” af is.</li>
</ul>
<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">02</span></div>

Note: Gagné 1 — aandacht trekken met een herkenbaar probleem. Vraag: wie heeft dit zelf meegemaakt? Laat 2 of 3 studenten reageren. Onthul de drie gevolgen per klik. Sluit af met: hoe komt dat? Het ontwerp is er wél, maar het is niet vertaald naar werk dat je kunt verdelen. Dat repareren we vandaag. Tijd: 00:03–00:08.

---

<p class="kicker">Leerdoelen</p>

## Aan het einde van deze les kun je …

1. bevindingen uit je Design Thinking-documenten omzetten naar **testbare eisen** met bronvermelding;
2. een eis opknippen in kleine, **verticale** issues die los van elkaar te bouwen zijn;
3. een issue toetsen aan de <span class="highlight">Definition of Ready</span>;
4. **afhankelijkheden** zichtbaar maken en issues zo verdelen dat iedereen tegelijk kan bouwen.

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">03</span></div>

Note: Gagné 2 — doelen benoemen. Leerdoel 1 hoort bij blok A, 2 bij blok B, 3 bij blok C en 4 bij blok D en E. Aan het eind van de les passen ze alles toe op hun eigen project; de exit-ticket meet of de doelen gehaald zijn.

---

<p class="kicker">Waar zitten we · Terug naar de route</p>

## De route kennen jullie — vandaag zoomen we in op de pijlen

<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3>Oogst</h3><p>Eisen uit je docs</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>Epics &amp; user stories</h3><p>Modules en wat de gebruiker wil</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>Issues</h3><p>Taken van maximaal één dag</p></div></div>
  <div class="listrow"><span class="n">04</span><div><h3>Bouwen op een branch</h3><p>Claimen, bouwen, PR</p></div></div>
</div>

<p class="lede" style="margin-top:20px">Vandaag: hoe knip je goed, wanneer is een issue <em>klaar om te bouwen</em>, en wie pakt wat?</p>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">04</span></div>

Note: Gagné 3 — voorkennis activeren. Vraag: wat weten jullie nog van de bouwworkflow? Laat een student de vier stappen noemen. De route staat; het gevaar zit in de overgangen. Een slechte overgang geeft vage issues en dus wachtende developers. Vandaag oefenen we met een neutraal voorbeeld, Buurtbieb, en daarna met jullie eigen project. Tijd: 00:08–00:12.

---

<p class="kicker">Ons voorbeeld · Buurtbieb</p>

## Buurtbieb: buren lenen spullen van elkaar

<div class="cards">
  <div class="glr-card">
    <span class="k">Epic 1</span>
    <h3>Account</h3>
    <p>Registreren, inloggen, profiel.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Epic 2</span>
    <h3>Spullen aanbieden &amp; zoeken</h3>
    <p>Boormachine of ladder toevoegen, zoeken, filteren.</p>
  </div>
  <div class="glr-card">
    <span class="k">Epic 3</span>
    <h3>Reserveren &amp; teruggeven</h3>
    <p>Een item aanvragen, goedkeuren, terugmelden.</p>
  </div>
</div>

<p class="body" style="margin-top:18px">Techniek: PHP + MySQL. Tabellen uit het ERD: <code>users</code>, <code>items</code>, <code>reservations</code>.</p>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">05</span></div>

Note: Dit is het rode-draad-voorbeeld voor de theorie. Het is bewust niet jullie eigen project, zodat we vrij kunnen oefenen. Drie epics, drie tabellen. Als ze vragen: dit is een verzonnen casus.

---

<p class="kicker">Blok A · Van document naar eis</p>

## Elk Design Thinking-document levert een ander soort issue op

<div class="grid2">
  <div class="glr-card">
    <span class="k">01-empathize · 02-define</span>
    <h3>User stories</h3>
    <p>Wie is de gebruiker en wat wil die? Hieruit komen de stories en hun acceptatiecriteria.</p>
  </div>
  <div class="glr-card">
    <span class="k">03-ideate · 04-prototype</span>
    <h3>Schermen &amp; componenten</h3>
    <p>Elk scherm in het prototype wordt een of meer UI-issues.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">05-test</span>
    <h3>Verbeterpunten &amp; prioriteit</h3>
    <p>Wat testpersonen lastig vonden bepaalt wat eerst moet.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Moodboard · ERD</span>
    <h3>Stijl- en schema-issues</h3>
    <p>Kleuren en lettertypes als CSS-variabelen; elke tabel in het ERD als database-issue.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">06</span></div>

Note: Leg uit dat elk document een ander type werk oplevert. Dat is handig om niets te vergeten: loop je docs langs en vraag per document: welke issues komen hieruit? Voorbeeld Buurtbieb: uit 01-empathize "buren willen weten of een ladder echt beschikbaar is" komt een story over beschikbaarheid tonen. Uit het ERD komt een issue "Tabel reservations aanmaken".

---

<p class="kicker">Blok A · Traceerbaarheid</p>

## Zet bij elk issue waar het vandaan komt

<div class="grid2">
  <div class="glr-card">
    <span class="k">Zonder bron</span>
    <p>“Maak een zoekbalk.”</p>
    <p>Waarom? Voor wie? Mag je het schrappen als de tijd op is?</p>
  </div>
  <div class="glr-card glr-card--accent fragment">
    <span class="k">Met bron</span>
    <p>“Zoekbalk op de overzichtspagina.”</p>
    <p><strong>Bron:</strong> <code>05-test.md</code> — testpersoon 2 kon de ladder niet vinden.</p>
  </div>
</div>

**Waarom het ertoe doet:** je kunt keuzes verantwoorden bij de opdrachtgever, en bij scopekeuzes weet je welk issue je veilig kunt laten vallen.

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">07</span></div>

Note: Bronvermelding kost tien seconden per issue en levert veel op. Bij de beoordeling kun je laten zien dat je bouwt wat uit het onderzoek volgt. En als de scope krimpt, zie je direct welke issues door onderzoek onderbouwd zijn en welke "leuk-om-te-hebben". Verwijs naar het formaat: een regel "Bron:" bovenaan de beschrijving.

---

<p class="kicker">Blok B · Opknippen</p>

## Knip in taartpunten, niet in lagen

<div class="grid2">
  <div class="glr-card">
    <span class="k">Horizontaal (laag)</span>
    <p>1. Eerst de hele database</p>
    <p>2. Dan alle PHP-logica</p>
    <p>3. Dan alle schermen</p>
    <p><strong>Resultaat:</strong> niets werkt tot het einde, en iedereen wacht op de vorige laag.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Verticaal (taartpunt)</span>
    <p>“Een item toevoegen”: formulier + PHP + tabelrij, dun maar werkend.</p>
    <p>“Een item bekijken”: lijstpagina + query.</p>
    <p><strong>Resultaat:</strong> na elk issue werkt er iets dat je kunt laten zien.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">08</span></div>

Note: Het belangrijkste inzicht van de les. Teken eventueel op het bord een taart: horizontaal snijden geeft lagen (alleen bodem, alleen room), verticaal snijden geeft punten waar je alles van proeft. Een verticaal issue raakt UI, logica en data, maar alleen het stukje dat nodig is. Nuance: één verticaal issue wordt door één persoon gebouwd, dus front-end en back-end hoeven niet over twee mensen verdeeld. Dat komt terug in blok E. Tijd: 00:25.

---

<p class="kicker">Blok B · Knipregels</p>

## Vier manieren om een grote story kleiner te maken

<div class="rows">
  <div class="listrow fragment"><span class="n">1</span><div><h3>Per scherm</h3><p>Overzicht, detailpagina en formulier zijn drie issues.</p></div></div>
  <div class="listrow fragment"><span class="n">2</span><div><h3>Per actie (CRUD)</h3><p>Toevoegen, tonen, wijzigen en verwijderen apart.</p></div></div>
  <div class="listrow fragment"><span class="n">3</span><div><h3>Happy path eerst</h3><p>Eerst werkt het als alles goed gaat; foutmeldingen en randgevallen later.</p></div></div>
  <div class="listrow fragment"><span class="n">4</span><div><h3>Per variant</h3><p>Filter op categorie en filter op afstand zijn twee issues.</p></div></div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">09</span></div>

Note: Geef bij elke regel een Buurtbieb-voorbeeld. Per scherm: spullenlijst, spullen-detail, spullen-formulier. Per actie: spullen toevoegen vs. spullen verwijderen. Happy path: eerst reserveren als de datum vrij is; "datum al bezet" is een apart issue. Per variant: zoeken op naam vs. zoeken op categorie. Dit zijn gereedschappen: je hoeft ze niet allemaal te gebruiken.

---

<p class="kicker">Blok B · De toets</p>

## Een goed issue is onafhankelijk, klein en testbaar

<div class="cards">
  <div class="glr-card">
    <span class="k">Onafhankelijk</span>
    <h3>Staat op zichzelf</h3>
    <p>Kan gebouwd worden zonder dat een ander eerst klaar moet zijn (of de afhankelijkheid is benoemd).</p>
  </div>
  <div class="glr-card">
    <span class="k">Klein</span>
    <h3>Maximaal één dag</h3>
    <p>Past in één dag werk. Anders: knip nog een keer.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Testbaar</span>
    <h3>Je kunt “af” aanwijzen</h3>
    <p>Iemand anders kan zien of het werkt, zonder jou te vragen.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">10</span></div>

Note: Dit is een lichte versie van INVEST, het bekende Agile-acroniem. Houd het bij deze drie. Als een issue één van de drie niet haalt, is het nog niet goed geknipt. Vooral testbaar wordt vaak vergeten: "Maak het mooi" is niet testbaar, "knoppen zijn minstens 44x44 px" wel.

---

<p class="kicker">Check-in · Denk – deel · 4 minuten</p>

## Knip: “Als buurtbewoner wil ik spullen kunnen lenen”

<p class="lede">Schrijf alleen of in tweetallen minstens <strong>vier</strong> verticale issues op. Controleer elk issue op: onafhankelijk, klein, testbaar.</p>

<div class="timer" data-timer="04:00" role="group" aria-label="Werk-timer 4 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">04:00</span><span class="t-label">Knippen</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">11</span></div>

Note: Gagné 6 — prestatie uitlokken. Start de timer. Loop rond en let op studenten die in lagen knippen ("database maken"). Vraag daarna 2 of 3 tweetallen hun lijst voor te lezen. Antwoord op de volgende slide (pijl omlaag). Tijd: 00:30–00:36.

--

<p class="kicker">Check-in · Uitwerking</p>

## Een mogelijke knip

<ul class="check">
  <li class="fragment"><strong>Spullen-overzicht tonen</strong> — lijstpagina met alle beschikbare spullen (happy path).</li>
  <li class="fragment"><strong>Spullen-detail bekijken</strong> — pagina met foto, beschrijving en eigenaar.</li>
  <li class="fragment"><strong>Reservering aanvragen</strong> — knop + formulier met begin- en einddatum.</li>
  <li class="fragment"><strong>Aanvraag goedkeuren of weigeren</strong> — de eigenaar ziet openstaande aanvragen.</li>
  <li class="fragment"><strong>Datum al bezet</strong> — foutmelding bij overlappende reservering (randgeval, later).</li>
</ul>

<p class="body" style="margin-top:16px">Er zijn meerdere goede knips. Belangrijk: elk issue levert iets op dat werkt en dat je kunt testen.</p>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">12</span></div>

Note: Gagné 7 — feedback. Dit is één mogelijke knip, geen enige juiste. Vergelijk met wat studenten bedachten. Let op dat "Datum al bezet" bewust apart staat omdat het een randgeval is. Veelgemaakte fout: "Reserveringstabel maken" als losse stap, dat is een laag.

---

<p class="kicker">Blok C · Definition of Ready</p>

## Pas als een issue ready is, mag iemand eraan beginnen

<p class="lede">Een issue is <span class="highlight">ready</span> als je het kunt oppakken zonder iemand een vraag te stellen.</p>

<ul class="check">
  <li class="fragment">Duidelijke <strong>titel</strong> en <strong>user story</strong> (“Als … wil ik … zodat …”).</li>
  <li class="fragment"><strong>Bron</strong> uit je Design Thinking-docs en een <strong>link naar het ontwerp</strong> (scherm, moodboard, ERD).</li>
  <li class="fragment"><strong>Acceptatiecriteria</strong>: wanneer is het af? Concreet en testbaar.</li>
  <li class="fragment"><strong>Afhankelijkheden</strong> benoemd (“geblokkeerd door #4”) en een <strong>grootte</strong> (S, M of L).</li>
  <li class="fragment"><strong>Label</strong>: fundament, front-end of back-end.</li>
</ul>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">13</span></div>

Note: De Definition of Ready is de poort tussen "Backlog" en "Ready". Alleen issues die door de poort komen mogen opgepakt worden. De testvraag: kan een teamgenoot dit oppakken terwijl jij niet in de buurt bent? Zo nee, dan ontbreekt er iets. Dit lost het probleem op dat mensen halverwege bij je aankloppen met "wat bedoel je eigenlijk?" Tijd: 00:40.

---

<p class="kicker">Blok C · Eén template voor het hele team</p>

## Leg de structuur vast in een issue-template

```markdown [1-3|5-7|9-11|13-14]
name: Feature
about: Een implementatieklaar issue
labels: ready-check

**Als** [gebruiker] **wil ik** [functie], **zodat** [waarde].
**Bron:** [document + regel/testpersoon]
**Ontwerp:** [link of bestandsnaam]

## Acceptatiecriteria
- [ ] Gegeven …, als …, dan …
- [ ] Gegeven …, als …, dan …

## Afhankelijkheden
Geblokkeerd door: #… · Grootte: S / M / L
```

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">14</span></div>

Note: Dit bestand zet je in .github/ISSUE_TEMPLATE/feature.md in de repo. Als je daarna op GitHub "New issue" kiest, staat de structuur er al. Loop met de pijltjes door de vier delen: eerst de kop met naam (GitHub leest dit), dan de story met bron en ontwerp, dan acceptatiecriteria in Gegeven-Als-Dan-vorm, en tot slot afhankelijkheden en grootte. Eén template betekent dat iedereen issues op dezelfde manier schrijft. Wie het template vandaag nog niet heeft: dit is werkblok 2.

---

<p class="kicker">Blok C · Voor en na</p>

## Van vage kreet naar issue dat klaar is om te bouwen

<div class="grid2">
  <div class="glr-card">
    <span class="k">Vaag</span>
    <h3>Reserveren maken</h3>
    <p>Geen story, geen bron, geen criteria. Hoe groot is dit? Wie begint waar?</p>
  </div>
  <div class="glr-card glr-card--accent fragment">
    <span class="k">Ready · #7</span>
    <h3>Reservering aanvragen voor een item</h3>
    <p><strong>Als</strong> buurtbewoner <strong>wil ik</strong> een item reserveren voor een periode, <strong>zodat</strong> ik weet dat het beschikbaar is.</p>
    <p><strong>Bron:</strong> 02-define.md. <strong>Criteria:</strong> begin- en einddatum kiezen · aanvraag verschijnt in <code>reservations</code> met status “open”. <strong>Blocked by:</strong> #3. <strong>Grootte:</strong> M.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">15</span></div>

Note: Laat eerst de linkerkant zien en vraag wat er mist. Onthul dan de rechterkant. Wijs de onderdelen aan: story, bron, criteria die je letterlijk kunt aanvinken, blokkerend issue #3 (de spullen-detailpagina waar de knop op komt), en een grootte. Met dit issue kan iemand beginnen zonder vragen.

---

<p class="kicker">Check-in · Is dit ready? · 3 minuten</p>

## Welke van deze drie issues is ready — en wat mist er bij de andere twee?

<div class="cards">
  <div class="glr-card">
    <span class="k">Issue A</span>
    <p>“Inlogpagina mooi maken volgens het moodboard.”</p>
  </div>
  <div class="glr-card">
    <span class="k">Issue B</span>
    <p>“Als gebruiker wil ik inloggen met e-mail en wachtwoord. Criteria: foute combinatie geeft melding · na inloggen sta je op het overzicht. Bron: 02-define. Groot: S. Geblokkeerd door #2 (users-tabel).”</p>
  </div>
  <div class="glr-card">
    <span class="k">Issue C</span>
    <p>“Database en login en profiel bouwen.”</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">16</span></div>

Note: Denk-deel-herstem: stel de vraag, geef 1 minuut stilte, 1 minuut overleg met de buurman, dan klassikaal. Antwoord op de volgende slide.

--

<p class="kicker">Check-in · Antwoord</p>

## Alleen B is ready

<ul class="check">
  <li class="fragment"><strong>A</strong> mist een story en testbare criteria. “Mooi” is niet te controleren; zeg bijvoorbeeld welke kleuren, lettertypes en afmetingen.</li>
  <li class="fragment"><strong>C</strong> is drie issues in één en dus te groot: database, login en profiel zijn aparte taken.</li>
  <li class="fragment"><strong>B</strong> heeft story, criteria, bron, grootte en afhankelijkheid.</li>
</ul>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">17</span></div>

Note: Leg de koppeling met de eerdere regel: C is "horizontaal en te groot", A is niet testbaar. B mag zo naar de Ready-kolom. Tijd: 00:50 — daarna korte pauze indien gewenst.

---

<p class="kicker">Blok D · Afhankelijkheden</p>

## Bouw eerst het fundament, dan pas de rest

<p class="lede">Sommige dingen heeft <em>iedereen</em> nodig. Die doe je als eerste — en snel.</p>

<div class="cards">
  <div class="glr-card glr-card--accent">
    <span class="k">Fundament 1</span>
    <h3>Database-schema</h3>
    <p><code>db.php</code> + tabellen uit het ERD, met een paar testrijen.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Fundament 2</span>
    <h3>Layout &amp; stijl</h3>
    <p>Header, footer en CSS-variabelen uit het moodboard.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Fundament 3</span>
    <h3>Pagina-structuur</h3>
    <p>Mappen, routing en naamafspraken, zodat iedereen weet waar code komt.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">18</span></div>

Note: Dit is de enige plek waar een laag-issue goed is: het fundament. Hou het klein, een dagdeel. Verdeel het fundament over het hele team zodat het snel klaar is (één doet de database, één de layout, één de structuur) en pas daarna splitst iedereen naar eigen features. Valkuil: een fundament dat een week duurt, dan wacht iedereen weer.

---

<p class="kicker">Blok D · Contract-first</p>

## Spreek de koppelvlakken af vóór je gaat bouwen

<div class="grid2">
  <div class="glr-card">
    <span class="k">Afspreken</span>
    <p>Tabel- en kolomnamen (<code>items.title</code>)</p>
    <p>Functienamen (<code>getItems()</code>)</p>
    <p>Pagina- en bestandsnamen (<code>items.php</code>)</p>
  </div>
  <div class="glr-card glr-card--accent fragment">
    <span class="k">Het resultaat</span>
    <p>De ene developer bouwt de lijstpagina met <strong>dummy-data</strong>.</p>
    <p>De andere schrijft de query erachter.</p>
    <p>Daarna klik je ze aan elkaar.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">19</span></div>

Note: Als twee issues aan elkaar raken, spreek dan de naad af. Voorbeeld: "getItems() geeft een array terug met id, title en photo". Nu kan de ene persoon met een nep-array het scherm bouwen, en de ander de echte query. Zo verdwijnt wachten. Zet de afspraken in de beschrijving van beide issues of in TEAM.md.

---

<p class="kicker">Blok D · Afhankelijkheidskaart</p>

## Zet issues in golven: fundament, golf 1, golf 2

<div class="cards">
  <div class="glr-card glr-card--accent">
    <span class="k">Fundament</span>
    <p>#1 Database-schema</p>
    <p>#2 Layout &amp; CSS-variabelen</p>
    <p>#3 Pagina-structuur</p>
  </div>
  <div class="glr-card">
    <span class="k">Golf 1 · tegelijk</span>
    <p>#4 Registreren</p>
    <p>#5 Spullen toevoegen</p>
    <p>#6 Spullen-overzicht</p>
  </div>
  <div class="glr-card">
    <span class="k">Golf 2 · bouwt voort</span>
    <p>#7 Reservering aanvragen (← #5, #6)</p>
    <p>#8 Aanvraag goedkeuren (← #7)</p>
  </div>
</div>

<p class="body" style="margin-top:18px">In GitHub: gebruik <strong>sub-issues</strong>, het veld <em>Blocked by</em> of een label <code>golf-1</code>/<code>golf-2</code>.</p>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">20</span></div>

Note: Dit is de afhankelijkheidskaart. Alles in een golf kan tegelijk. Pas als de blokkerende issues uit de vorige golf klaar zijn begint de volgende. Het doel is dat in elke golf minstens zoveel issues staan als er developers zijn. Zo niet, dan moet je anders knippen. Laat zien hoe je in GitHub de afhankelijkheid noteert: een regel "Geblokkeerd door #5" in de beschrijving is het minimum.

---

<p class="kicker">Blok E · Verdelen</p>

## Verdeel per feature, niet per laag

<div class="grid2">
  <div class="glr-card">
    <span class="k">Per laag</span>
    <p>“Jij doet front-end, ik de back-end.”</p>
    <p>De front-ender wacht op de back-ender, en omgekeerd. Eén persoon weet niets van de database.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Per feature</span>
    <p>“Jij bouwt Spullen toevoegen, ik Registreren.”</p>
    <p>Eén persoon bouwt een heel taartpunt: formulier, PHP en tabelrij. Niemand wacht.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">21</span></div>

Note: Veel teams delen "wie front-end, wie back-end". Dat voelt logisch maar zorgt voor wachten en voor mensen die maar de helft van het project begrijpen. Verdeel per feature: één eigenaar per verticaal stuk. Bij de individuele beoordeling is breed werk ook een voordeel. Tijd: 01:00.

---

<p class="kicker">Blok E · Vier verdeelregels</p>

## Zo houd je de verdeling eerlijk en conflictvrij

<div class="rows">
  <div class="listrow fragment"><span class="n">1</span><div><h3>Eén tegelijk (WIP-limiet 1)</h3><p>Niemand heeft twee issues “In progress”. Eerst afmaken, dan pas het volgende.</p></div></div>
  <div class="listrow fragment"><span class="n">2</span><div><h3>Mix S, M en L eerlijk</h3><p>Niet één persoon alle grote issues en een ander alle kleine.</p></div></div>
  <div class="listrow fragment"><span class="n">3</span><div><h3>Niet tegelijk in hetzelfde bestand</h3><p>Twee issues die dezelfde file raken? Geef ze aan één persoon of werk om de beurt.</p></div></div>
  <div class="listrow fragment"><span class="n">4</span><div><h3>Wissel front- en back-end</h3><p>Iedereen raakt beide kanten, zodat niemand een eilandje wordt.</p></div></div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">22</span></div>

Note: Regel 3 voorkomt de meeste merge-conflicten. Bekijk bij het verdelen welke bestanden elk issue gaat raken. Regel 1 is de WIP-limiet uit de eerdere les over het bord met te veel kaarten in "In progress". Regel 4 sluit aan bij de individuele beoordeling: de docent wil bij iedereen zowel front-end als back-end zien.

---

<p class="kicker">Blok E · GitHub Projects</p>

## Eén blik op het bord laat zien of de verdeling klopt

<div class="grid2">
  <div class="glr-card">
    <span class="k">Velden</span>
    <p><strong>Status</strong>: Backlog · Ready · In progress · Review · Done</p>
    <p><strong>Grootte</strong>: S / M / L</p>
    <p><strong>Golf</strong>: fundament / 1 / 2</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">View “per persoon”</span>
    <p>Kies <em>Group by → Assignees</em> in de table-weergave.</p>
    <p>Je ziet direct: wie heeft te veel, wie heeft niets, en wie wacht?</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">23</span></div>

Note: Doe dit eventueel live voor als demo in een voorbeeldproject. Voeg de velden Grootte en Golf toe via het plusje in de tabelkop. Maak een tweede view met Group by Assignees. De kolom Ready is de belangrijkste: alleen issues die de Definition of Ready halen komen daar, en daar pakt iedereen uit.

---

<p class="kicker">Check-in · Teamopdracht · 5 minuten</p>

## Verdeel deze 8 Buurtbieb-issues over 3 personen zodat niemand wacht

<div class="grid2">
  <div class="glr-card">
    <span class="k">Fundament</span>
    <p>#1 Database <em>(M)</em> · #2 Layout <em>(S)</em> · #3 Structuur <em>(S)</em></p>
  </div>
  <div class="glr-card">
    <span class="k">Golf 1</span>
    <p>#4 Registreren <em>(M)</em> · #5 Spullen toevoegen <em>(M)</em> · #6 Spullen-overzicht <em>(S)</em></p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Golf 2</span>
    <p>#7 Reservering aanvragen <em>(M, na #5 en #6)</em> · #8 Aanvraag goedkeuren <em>(M, na #7)</em></p>
  </div>
  <div class="glr-card">
    <span class="k">Regels</span>
    <p>WIP 1 · eerlijke mix S/M · geen wachtrij</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">24</span></div>

Note: Teams van 3 wijzen binnen 5 minuten aan wie welk issue pakt. Laat daarna 2 teams hun verdeling zien. Antwoord op de volgende slide. Tijd: 01:05–01:12.

--

<p class="kicker">Check-in · Een mogelijke verdeling</p>

## Iedereen heeft vanaf minuut één iets te doen

<div class="cards">
  <div class="glr-card">
    <span class="k">Persoon A</span>
    <p>#1 Database → #5 Spullen toevoegen → #7 Reservering aanvragen</p>
  </div>
  <div class="glr-card">
    <span class="k">Persoon B</span>
    <p>#2 Layout → #6 Spullen-overzicht → #8 Aanvraag goedkeuren</p>
  </div>
  <div class="glr-card">
    <span class="k">Persoon C</span>
    <p>#3 Structuur → #4 Registreren</p>
  </div>
</div>

<p class="body" style="margin-top:18px">Let op: A en B bouwen #7 en #8 pas als #5 en #6 klaar zijn. Daarom krijgt C ondertussen #4 en past er nog werk bij als C vroeg klaar is.</p>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">25</span></div>

Note: Er zijn meer goede verdelingen. Controle: in het fundament start iedereen tegelijk. In golf 1 is niemand afhankelijk van een ander. Pas in golf 2 is er een volgorde, en die is van tevoren bekend. Eventueel kan C nadat #4 klaar is een ander issue van golf 2 helpen. Sluit af: nu doen jullie dit voor jullie eigen project.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:50px"></div>
<p class="kicker kicker--lime">Werkblok 1 · Oogsten · 10 minuten</p>
<h2 class="title title--sm" style="color:#fff">Maak de oogsttabel van jullie eigen project</h2>
<ul class="check">
  <li style="color:#EDEDED">Loop elk Design Thinking-document langs (<strong style="color:#fff">01 t/m 05</strong>, moodboard, ERD).</li>
  <li style="color:#EDEDED">Schrijf per document minstens <strong style="color:#fff">twee testbare eisen</strong> op, mét bron.</li>
  <li style="color:#EDEDED">Groepeer de eisen in <strong style="color:#fff">epics</strong> en schrijf per epic de eerste user stories.</li>
</ul>

<div class="timer" data-timer="10:00" role="group" aria-label="Werk-timer 10 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">10:00</span><span class="t-label">Oogsten</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">26</span></div>

Note: Start de werkfase. Teams hebben nog geen tabel? Dan schrijven ze die in een bestand docs/06-eisen.md in de repo of in een gedeeld document. Loop rond en stel de vraag: waar komt deze eis vandaan? Tijd: 01:12–01:22.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:50px"></div>
<p class="kicker kicker--lime">Werkblok 2 · Issues ready maken · 25 minuten</p>
<h2 class="title title--sm" style="color:#fff">Schrijf de issues en controleer elkaars werk</h2>
<ul class="check">
  <li style="color:#EDEDED">Voeg het <strong style="color:#fff">issue-template</strong> toe aan de repo (<code>.github/ISSUE_TEMPLATE/feature.md</code>).</li>
  <li style="color:#EDEDED">Knip jullie eisen in <strong style="color:#fff">verticale issues</strong> en schrijf ze uit volgens het template.</li>
  <li style="color:#EDEDED">Wissel van laptop en toets elkaars issues aan de <strong style="color:#fff">Definition of Ready</strong>. Mist er iets? Aanvullen.</li>
</ul>

<div class="timer" data-timer="25:00" role="group" aria-label="Werk-timer 25 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">25:00</span><span class="t-label">Issues</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">27</span></div>

Note: Dit is het hart van de workshop. Streef niet naar alle issues, maar naar genoeg issues voor de eerste twee weken, dus ongeveer twee per teamlid plus het fundament. Loop rond en gebruik de drie testvragen: onafhankelijk, klein, testbaar. Pak studenten die in lagen knippen bij de kladden. Tijd: 01:22–01:47.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:50px"></div>
<p class="kicker kicker--lime">Werkblok 3 · Afhankelijkheden &amp; verdeling · 10 minuten</p>
<h2 class="title title--sm" style="color:#fff">Zet issues in golven en wijs ze toe</h2>
<ul class="check">
  <li style="color:#EDEDED">Wijs de <strong style="color:#fff">fundament-issues</strong> aan en verdeel die over het hele team.</li>
  <li style="color:#EDEDED">Zet per issue <strong style="color:#fff">grootte en golf</strong> en noteer wat door wat geblokkeerd wordt.</li>
  <li style="color:#EDEDED">Verdeel <strong style="color:#fff">per feature</strong> met de vier verdeelregels en maak de view “per persoon”.</li>
</ul>

<div class="timer" data-timer="10:00" role="group" aria-label="Werk-timer 10 minuten">
  <div class="t-dial">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="t-track" cx="60" cy="60" r="54"></circle>
      <circle class="t-prog" cx="60" cy="60" r="54"></circle>
    </svg>
    <div class="t-face"><span class="t-time">10:00</span><span class="t-label">Verdelen</span></div>
  </div>
  <div class="t-btns">
    <button class="t-btn t-start" type="button">Start</button>
    <button class="t-btn t-reset" type="button">Reset</button>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">28</span></div>

Note: Teams moeten hier consequent zijn: één persoon mag niet alle fundament-issues pakken. Kijk of elk teamlid minstens één issue "In progress" heeft en één in de Ready-kolom wacht. Tijd: 01:47–01:57.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:50px"></div>
<p class="kicker kicker--lime">Exit-ticket · Laat je bord zien</p>
<h2 class="title title--sm" style="color:#fff">Niemand verlaat het lokaal zonder deze vijf vinkjes</h2>

<ul class="check">
  <li style="color:#EDEDED">Minstens één <strong style="color:#fff">fundament-issue</strong> staat op “In progress”.</li>
  <li style="color:#EDEDED">Elk teamlid heeft <strong style="color:#fff">één issue In progress</strong> en <strong style="color:#fff">één Ready</strong> in de rij.</li>
  <li style="color:#EDEDED">Elk issue heeft een <strong style="color:#fff">bron</strong> en <strong style="color:#fff">acceptatiecriteria</strong>.</li>
  <li style="color:#EDEDED">Afhankelijkheden staan in de beschrijving of als <strong style="color:#fff">Blocked by</strong>.</li>
  <li style="color:#EDEDED">Het bord heeft een view <strong style="color:#fff">per persoon</strong>.</li>
</ul>

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">29</span></div>

Note: Gagné 8 — prestatie beoordelen. Loop langs de teams en bekijk het bord op het scherm. Dit is niet beoordeeld, maar wel verplicht; teams die niet klaar zijn maken het af voor de volgende les. Tijd: 01:57–02:00.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar"></div>
<p class="kicker kicker--lime">Afronding · Onthoud dit</p>

## Van ontwerp naar parallel bouwen — in vier stappen

<div class="cards">
  <div class="glr-card">
    <span class="k">1</span>
    <h3>Oogsten</h3>
    <p>Elke bevinding wordt een testbare eis, met bron.</p>
  </div>
  <div class="glr-card">
    <span class="k">2</span>
    <h3>Knippen</h3>
    <p>Verticaal: onafhankelijk, klein, testbaar.</p>
  </div>
  <div class="glr-card">
    <span class="k">3</span>
    <h3>Ready maken</h3>
    <p>Pas als de Definition of Ready klopt mag iemand beginnen.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">4</span>
    <h3>Verdelen</h3>
    <p>Fundament samen, daarna per feature in golven.</p>
  </div>
</div>

**Vervolgstap:** volgende les start iedereen direct op een eigen feature-branch, zonder te wachten op een ander.

<div class="footer"><span>Beroeps 2 · Van design naar issues</span><span class="num">30</span></div>

Note: Gagné 9 — retentie en transfer. Loop de vier stappen langs en koppel terug aan de leerdoelen. Transfervraag: bij welk volgend project ga je dit weer gebruiken? Vervolgstap is concreet: volgende les claimt iedereen het eerste Ready-issue, maakt een feature-branch en bouwt.

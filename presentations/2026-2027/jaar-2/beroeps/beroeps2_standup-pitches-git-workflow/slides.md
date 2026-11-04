<!-- frontmatter
title: "De bouwworkflow in 5 stappen"
cohort: "2026-2027"
leerjaar: 2
periode: 1
auteur: "Docententeam CSD"
tags: ["Beroeps", "Agile", "Git", "GitHub", "Pull Request", "Stand-up"]
-->

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:130px"></div>
<p class="kicker kicker--lime">Beroeps 2 · Stop de Ontkoking · GLR Food Freaks</p>
<h1 class="title title--xl" style="color:#fff">De bouwworkflow in 5 stappen</h1>
<p class="lede" style="color:#EDEDED;font-size:30px">Van design-oogst naar Pull Request.</p>
<p class="body" style="color:#BDBDBD;max-width:820px;margin-top:22px">Van jullie Design Thinking-oogst, via epics en issues op een <strong style="color:#fff">GitHub Project</strong>-bord, tot de <strong style="color:#fff">Pull Request</strong> waarmee je team de kookapp voor GLR Food Freaks bouwt.</p>
<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">01</span></div>

Note: Welkom terug bij BEROEPS2, project Stop De Ontkoking. Jullie opdrachtgever is GLR Food Freaks, jullie doelgroep de Gen Z-student: die bestelt te veel duur eten, wil gezond koken maar dan wel in maximaal twintig minuten. Jullie kookapp lost dat op. Het ontwerp is klaar — vandaag zet je het om in bouwen, in vijf vaste stappen. Ga bij je team zitten, we beginnen meteen.

---

<p class="kicker">Leerdoelen</p>

## Aan het einde van deze les kun je …

1. harde eisen **oogsten** uit je Design Thinking-documenten (empathize t/m test, moodboard en ERD);
2. het prototype opdelen in **epics** en **user stories**;
3. een **GitHub Project**-werkbord inrichten en de afspraken vastleggen in `TEAM.md`;
4. **issues** schrijven als mini-contracten met acceptatiecriteria;
5. bouwen op een **feature-branch** en kwaliteit bewaken met een **Pull Request** en review.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">02</span></div>

Note: Benoem de vijf doelen en koppel ze aan de vijf stappen van vandaag (Gagné, gebeurtenis 2). Aan het eind kun je het hele traject zelf doorlopen in jullie eigen repository.

---

<div class="row">
  <div class="col vcenter" style="flex:1 1 64%">
    <p class="kicker">Opwarmer · Reflectie · 2 minuten</p>
    <h2 class="title title--sm">Wat maakt jullie stand-up zinvol — en wanneer is hij tijdverspilling?</h2>
    <p class="lede">Jullie draaien nu een paar weken een stand-up op het Stop De Ontkoking-project. Overleg met je buur en deel straks klassikaal: één ding dat goed werkt, en één ding dat beter kan.</p>
  </div>
  <div class="col" style="flex:1 1 36%">
    <div class="timer" data-timer="02:00" role="group" aria-label="Overleg-timer 2 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">02:00</span><span class="t-label">Overleg</span></div>
      </div>
      <div class="t-btns">
        <button class="t-btn t-start" type="button">Start</button>
        <button class="t-btn t-reset" type="button">Reset</button>
      </div>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">03</span></div>

Note: We trappen af met een reflectie. Vraag de klas: wat maakt een stand-up zinvol, en wanneer is hij tijdverspilling? Start de timer en laat tweetallen twee minuten overleggen en inventariseer klassikaal: één ding dat goed werkt en één ding dat beter kan. Verzamel de antwoorden op het bord. Op de volgende slide hang je er de theorie aan: de 3 vragen, wie wat doet en waarom het bord actueel moet blijven.

---

<p class="kicker">Ritme · Daily stand-up</p>

## Een stand-up houdt je project elke dag op koers

<div class="cards">
  <div class="glr-card">
    <span class="k">De 3 vragen</span>
    <h3>Kort en staand</h3>
    <p>Wat heb je gedaan? Wat ga je doen? Waar loop je vast? Maximaal 15 minuten.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">De scrummaster</span>
    <h3>Samenvatting in Teams</h3>
    <p>Plaatst na de stand-up een samenvatting in het Teams-kanaal “Daily Standup”.</p>
  </div>
  <div class="glr-card">
    <span class="k">Iedereen</span>
    <h3>Bord up-to-date</h3>
    <p>Houdt het projectboard van de kookapp actueel: klaar, bezig, geblokkeerd.</p>
  </div>
</div>

**Elke les, zelfde tijd:** stand-up → samenvatting in Teams → bord bijgewerkt.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">04</span></div>

Note: De daily stand-up is het hart van jullie ritme. Iedereen beantwoordt drie vragen: wat heb ik gedaan, wat ga ik doen, en waar loop ik vast. Het duurt maximaal een kwartier en draait om afstemmen, niet om verantwoording afleggen. Twee afspraken erbij: de scrummaster zet na elke stand-up een korte samenvatting in het Teams-kanaal “Daily Standup”, en iedereen zorgt dat het projectboard in GitHub klopt.

---

<p class="kicker">Vandaag · De bouw in vijf stappen</p>

## Van design-oogst naar Pull Request

<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>De Oogst</h3><p>Harde eisen uit de docs: empathize t/m test, moodboard en ERD.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Epics &amp; user stories</h3><p>Groepeer het prototype in modules en schrijf user stories.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>GitHub Project</h3><p>Een Kanban-bord inrichten; afspraken in <code>TEAM.md</code>.</p></div></div>
  <div class="listrow fragment"><span class="n">04</span><div><h3>Issues uitschrijven</h3><p>Front-end en back-end taken met titel, beschrijving en criteria.</p></div></div>
  <div class="listrow fragment"><span class="n">05</span><div><h3>Bouw &amp; Pull Request</h3><p>Claim een issue, werk op een feature-branch en open een PR.</p></div></div>
</div>

Het ritme eromheen: elke les een **stand-up** · een **pitch** voor de Go/No-go.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">05</span></div>

Note: Dit is de route van vandaag, in vijf stappen. Eén: de Oogst — haal harde eisen uit je Design Thinking-documenten. Twee: van concept naar epics en user stories. Drie: een GitHub Project-werkbord inrichten. Vier: issues uitschrijven als mini-contracten. Vijf: bouwen en kwaliteit bewaken met pull requests. Elke stap krijgt hierna eigen slides. Daaromheen loopt het vaste ritme: elke les een stand-up, en de pitch voor de Go/No-go.

---

<p class="kicker">Vandaag · Elevator pitches</p>

## De laatste teams halen hun definitieve akkoord op

<div class="cards">
  <div class="glr-card glr-card--accent">
    <span class="k">De pitchers</span>
    <h3>Pitch voor de Go of No-go</h3>
    <p>Pitch jullie kookapp-concept aan de docent — in de rol van <strong>GLR Food Freaks</strong>.</p>
  </div>
  <div class="glr-card">
    <span class="k">De andere teams</span>
    <h3>Werken rustig door</h3>
    <p>Pak taken op, maak branches en review elkaars PR’s.</p>
  </div>
</div>

<div class="grid2">
  <div class="glr-card fragment">
    <span class="k">Go</span>
    <p>Definitief akkoord: het concept is goedgekeurd, jullie bouwen verder aan de MVP.</p>
  </div>
  <div class="glr-card fragment">
    <span class="k">No-go</span>
    <p>Nog niet akkoord: scherp het concept aan en pitch opnieuw op een afgesproken moment.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">06</span></div>

Note: De teams die nog niet aan de beurt waren, pitchen vandaag hun concept. Je pitcht aan de docent, die de rol van GLR Food Freaks — jullie opdrachtgever — speelt. Aan het eind krijg je een definitieve beslissing: een Go of een No-go. Een Go betekent: het concept is goedgekeurd, jullie mogen doorbouwen aan de MVP. Een No-go betekent: het is nog niet overtuigend genoeg, scherp het aan en kom op een afgesproken moment terug. De andere teams gaan ondertussen rustig door met hun project.

---

<p class="kicker">Stap 1 · De Oogst</p>

## Haal harde eisen uit je Design Thinking-documenten

<p class="lede">Voordat je bouwt, oogst je: elk document levert één eis op.</p>

<div class="grid2">
  <div class="glr-card">
    <span class="k">Conclusies</span>
    <h3>Waarom en wat</h3>
    <p>Analyseer <code>01-empathize.md</code> t/m <code>03-ideate.md</code>.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Testfeedback</span>
    <h3>Wat blijft er over?</h3>
    <p>Evalueer <code>05-test.md</code> en stel de definitieve functionaliteiten van <code>04-prototype.md</code> vast.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Visuele eisen</span>
    <h3>Kleur, type, stijl</h3>
    <p>Inventariseer uit <code>moodboard.jpeg</code> en de rest van <code>docs/assets/</code>.</p>
  </div>
  <div class="glr-card">
    <span class="k">Databasestructuur</span>
    <h3>Tabellen en relaties</h3>
    <p>Vertaal <code>erd.jpeg</code> naar een lijst met tabellen en relaties.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">07</span></div>

Note: Stap één: de Oogst. Voordat er ook maar een regel code geschreven wordt, halen we de harde eisen uit het ontwerpwerk. Vier bronnen. Eén: jullie Design Thinking-documenten — analyseer de conclusies uit 01-empathize.md tot en met 03-ideate.md. Twee: de testfase — bekijk de feedback in 05-test.md en bepaal daarmee de definitieve functionaliteiten van jullie prototype. Drie: het visuele — haal de kleuren, lettertypes en stijl uit moodboard.jpeg en docs/assets/. Vier: de data — vertaal het ERD in erd.jpeg naar een concrete lijst met tabellen en relaties. Dit is je boodschappenlijstje voor de rest van het project.

---

<p class="kicker">Stap 1 · Van bevinding naar eis</p>

## Een oogst is pas nuttig als er een eis uit komt

<div class="grid2">
  <div class="glr-card">
    <span class="k">Bevinding (in de docs)</span>
    <p>“Studenten willen gezond eten, maar het mag max. 20 min. duren.” (01-empathize)</p>
    <p>“De testpersonen vonden de knoppen te klein.” (05-test)</p>
    <p>“erd.jpeg: recepten, ingrediënten, favorieten.”</p>
  </div>
  <div class="glr-card glr-card--accent fragment">
    <span class="k">Eis (voor de bouw)</span>
    <p>Recepten tonen hun bereidingstijd; filter op minder dan 20 minuten.</p>
    <p>Actieknoppen zijn minstens 44 bij 44 px.</p>
    <p>Tabellen: <code>recepten</code>, <code>ingredienten</code>, <code>favorieten</code>.</p>
  </div>
</div>

Elke bevinding uit de docs vertaal je naar één concrete, testbare eis. Die eisen zijn de basis voor je epics en issues.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">08</span></div>

Note: Een oogst is pas nuttig als er een harde eis uit komt. Links zie je een bevinding zoals die in de documenten staat; rechts de eis die je ervan maakt voor de bouw. Zo wordt elke vage bevinding een concrete, testbare eis. Die eisen nemen we mee naar de volgende stap: epics en user stories.

---

<p class="kicker">Stap 2 · Epics</p>

## Groepeer je prototype in grote modules

<p class="lede">Kijk naar jullie prototype en de eisen uit de Oogst, en groepeer.</p>

<div class="cards">
  <div class="glr-card">
    <span class="k">Epic 1</span>
    <h3>Account &amp; favorieten</h3>
    <p>Inloggen, profiel en recepten opslaan als favoriet.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Epic 2</span>
    <h3>Recepten &amp; filter</h3>
    <p>Zoeken en filteren op tijd, budget en ingrediënten.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Epic 3</span>
    <h3>Boodschappenlijst</h3>
    <p>Ingrediënten van een recept omzetten naar een lijst.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">09</span></div>

Note: Stap twee: van concept naar epics. Een epic is een grote module — een verzameling functionaliteiten die logisch bij elkaar horen. Kijk naar jullie prototype en de eisen uit de Oogst, en groepeer. Voor de kookapp krijg je bijvoorbeeld drie epics: Account & favorieten, Recepten & filter en Boodschappenlijst. Elk epic splits je straks op in user stories, en elke user story in taken van maximaal één dag.

---

<p class="kicker">Stap 2 · User stories</p>

## Schrijf per epic wat de gebruiker wil

<div class="grid2">
  <div class="glr-card">
    <span class="k">Het formaat</span>
    <p><strong>Als</strong> [gebruiker] <strong>wil ik</strong> [functie], <strong>zodat</strong> [waarde].</p>
    <p>De gebruiker komt uit <code>empathy-map-v1.jpeg</code>.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Voorbeeld — epic “Recepten &amp; filter”</span>
    <p>“Als Gen Z-student wil ik recepten filteren op tijd (minder dan 20 min) en budget, zodat ik snel en goedkoop iets gezonds kook in plaats van te bestellen.”</p>
  </div>
</div>

**Denk klassikaal mee:** splits samen “als student wil ik recepten ontdekken die ik snel kan koken”. Welke kleinere stories zie jij?

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">10</span></div>

Note: Stap twee, de user stories. Per epic beschrijf je wat de eindgebruiker moet kunnen. De gebruiker ken je uit de empathy-map: in ons geval de Gen Z-student. Het formaat is vast: als [gebruiker] wil ik [functie], zodat [waarde]. Denk klassikaal mee en splits de story op in kleinere stories: filteren op bereidingstijd, filteren op budget, filteren op ingrediënten die ik al heb, of sorteren op het snelste recept.

---

<p class="kicker">Stap 3 · GitHub Project</p>

## Richt één Kanban-bord in voor al het werk

<p class="lede">Maak een Project aan, koppel het aan je repository, en sleep issues door de kolommen.</p>

<div class="cards">
  <div class="glr-card">
    <span class="k">To Do</span>
    <p>#12 Filter op tijd</p>
    <p>#13 Recept-detail</p>
  </div>
  <div class="glr-card">
    <span class="k">In Progress</span>
    <p>#14 Boodschappenlijst</p>
  </div>
  <div class="glr-card">
    <span class="k">Review / Test</span>
    <p>#11 Receptenlijst</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Done</span>
    <p>#10 Inloggen</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">11</span></div>

Note: Stap drie: het werkbord. Maak in GitHub een Project aan en koppel dat aan jullie repository, zodat issues uit de repo automatisch op het bord verschijnen. Richt vier kolommen in: To Do, In Progress, Review/Test en Done. Alles wat gebouwd wordt, staat als kaart op dit bord — niets gebeurt buiten het bord om. Sleep een kaart door zodra de status verandert. Vandaag koppel je de branch-conventie eraan: issue #12 wordt branch feature/#12-filter-tijd.

---

<p class="kicker">Stap 3 · Afspraken vastleggen</p>

## Leg de samenwerking vast in `TEAM.md`

<div class="grid2">
  <div class="glr-card">
    <span class="k">Taakverdeling</span>
    <p>Wie pakt welk epic of issue? Wie is scrummaster? Wie reviewt?</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Werkafspraken</span>
    <p>Wanneer is iets klaar? Hoe vaak stand-up? Hoe reviewen we elkaars PR’s?</p>
  </div>
</div>

**Eén bron van waarheid:** afspraken staan in `TEAM.md` in de repo — niet in losse chatberichten.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">12</span></div>

Note: Bij stap drie hoort ook een afspraak op papier. Leg de samenwerking vast in een TEAM.md-bestand in jullie repository: wie pakt welk epic, wie is scrummaster, en wie reviewt wiens code, plus de werkafspraken (wanneer is een taak klaar, hoe vaak stand-up, en hoe reviewen we elkaars pull requests). Waarom in de repo en niet in de chat? Omdat het dan één bron van waarheid is, naast de code, en altijd terug te vinden. Zo weet iedereen wat er is afgesproken — ook als iemand een les mist.

---

<p class="kicker">Stap 4 · Issues uitschrijven</p>

## Knip het werk op: front-end en back-end issues

<div class="grid2">
  <div class="glr-card glr-card--accent">
    <span class="k">Front-end</span>
    <p>UI-componenten, met een verwijzing naar de styling uit <code>moodboard.jpeg</code>.</p>
    <p>Bijv. “Filter-balk met tijd en budget, volgens het moodboard.”</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Back-end</span>
    <p>Database en data, direct afgeleid van de entiteiten in <code>erd.jpeg</code>.</p>
    <p>Bijv. “Zet de tabel <code>recepten</code> op met tijd en budget.”</p>
  </div>
</div>

**Eén taak per issue:** houd elk issue klein genoeg voor ongeveer één dag — dan kun je het los oppakken en parallel werken.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">13</span></div>

Note: Stap vier: issues uitschrijven. Knip het werk per epic op in losse issues, met onderscheid tussen front-end en back-end. Front-end issues gaan over UI-componenten — verwijs daarbij naar de stylingrichtlijnen uit moodboard.jpeg. Back-end issues gaan over de database en data, afgeleid van de entiteiten in erd.jpeg; staat er een tabel “recepten” in het ERD, dan komt daar een issue voor. Houd elk issue klein genoeg voor ongeveer één dag werk, zodat je het los kunt oppakken en met zijn allen parallel kunt werken.

---

<p class="kicker">Stap 4 · Een goed issue</p>

## Een issue is geen vage kreet, maar een mini-contract

<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Titel</h3><p>Kort en concreet: “Filter op bereidingstijd”.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Beschrijving</h3><p>Wat moet er gebeuren, en waarom? Verwijs naar het epic.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Acceptatiecriteria</h3><p>Wanneer is het echt af? Concrete, testbare punten.</p></div></div>
</div>

**Denk klassikaal mee:** schrijf samen de acceptatiecriteria voor “Filter op bereidingstijd”. Wanneer is dit issue echt af?

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">14</span></div>

Note: Een goed issue is het halve werk: geen vage kreet, maar een mini-contract. Elk issue heeft drie dingen. Eén: een duidelijke titel, kort en concreet. Twee: een beschrijving van de taak — wat moet er gebeuren, waarom, en bij welk epic het hoort. Drie: acceptatiecriteria — de afspraak over wanneer het echt af is. Bij het filter op bereidingstijd bijvoorbeeld: “je kunt kiezen uit 15, 30 en 60 minuten”, “de lijst past direct aan” en “zonder resultaten zie je een nette melding”. Denk klassikaal mee: waar moet het filter allemaal aan voldoen voordat we het af noemen?

---

<p class="kicker">Stap 4 → 5 · Waarom parallel</p>

## Atomic taken laten 3–4 developers tegelijk bouwen

<div class="grid2">
  <div class="glr-card">
    <span class="k">Eén grote taak</span>
    <p>“Bouw de kookapp” — één developer werkt, de rest wacht, en alles hangt aan elkaar vast.</p>
  </div>
  <div class="glr-card glr-card--accent fragment">
    <span class="k">Atomic issues</span>
    <p>Filter op tijd · recept-detail · boodschappenlijst — iedereen pakt er één op, tegelijk. Elk issue staat op zichzelf.</p>
  </div>
</div>

**Zo werk je parallel:** klein en zelfstandig werk = geen wachten, geen botsingen.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">15</span></div>

Note: Waarom al dat opknippen? Omdat atomic taken parallel werken mogelijk maken. Links: één grote taak als “bouw de kookapp” — dan werkt één developer en moet de rest wachten. Rechts: kleine, zelfstandige issues zoals “filter op tijd”, “recept-detail” en “boodschappenlijst”. Nu kan iedereen er één oppakken, tegelijk, zonder op elkaar te wachten. Dat is precies wat we straks met gitflow mogelijk maken.

---

<p class="kicker">Stap 5 · Bouwen op een branch</p>

## Claim een issue, maak een feature-branch en werk parallel

<p class="lede">Drie developers, drie branches — niemand raakt <code>main</code> direct aan.</p>

<div class="rows">
  <div class="listrow fragment"><span class="n">1</span><div><h3>dev 1 · feature/filter-tijd</h3><p>PR → review → merge</p></div></div>
  <div class="listrow fragment"><span class="n">2</span><div><h3>dev 2 · feature/recept-detail</h3><p>PR → review → merge</p></div></div>
  <div class="listrow fragment"><span class="n">3</span><div><h3>dev 3 · feature/boodschappenlijst</h3><p>PR → review → merge</p></div></div>
</div>

**main · protected** — alle branches komen hier samen, altijd werkend.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">16</span></div>

Note: Stap vijf: de bouw. Je pakt een issue van het bord — je “claimt” het — en maakt daarvoor een eigen feature-branch aan. De één bouwt het filter op bereidingstijd, de ander de recept-detailpagina, de derde de boodschappenlijst. Ze zitten elkaar niet in de weg, want ze raken main nooit direct aan. Elke branch gaat via een pull request met review terug naar main. Omdat jullie issues klein en zelfstandig zijn, blijven branches kort — daardoor bijna nooit conflicten. De regel: main is altijd werkend.

---

<p class="kicker">Stap 5 · De regels</p>

## Twee soorten branches dekken al je werk

<div class="cards">
  <div class="glr-card">
    <span class="k">main — protected</span>
    <p>Altijd werkend en vergrendeld. Direct pushen kan niet; alles gaat via een pull request.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">feature/…</span>
    <p>Nieuw werk bouwen: <code>feature/filter-tijd</code>, <code>feature/recept-detail</code>. Eén taak per branch.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">fix/…</span>
    <p>Een bug verhelpen: <code>fix/aanmeldbug</code>, <code>fix/filter-bug</code>.</p>
  </div>
</div>

<div class="cards">
  <div class="glr-card">
    <span class="k">Eén issue = één branch</span>
    <p>Noem je branch naar het issue op je bord: <code>feature/#12-filter-tijd</code>.</p>
  </div>
  <div class="glr-card">
    <span class="k">Kleine branches</span>
    <p>Kort en klein werk is makkelijker te reviewen en sneller te mergen.</p>
  </div>
  <div class="glr-card">
    <span class="k">Duidelijke commits</span>
    <p>Schrijf wát en waarom. Geen <code>fix</code> of <code>stuff</code>.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">17</span></div>

Note: Jullie gebruiken twee soorten branches. De main-branch is beschermd: GitHub blokkeert pushen naar main, je komt er alleen via een goedgekeurde pull request. Daarnaast heb je feature-branches voor nieuw werk, zoals feature/filter-tijd, en fix-branches voor een bug, zoals fix/aanmeldbug. Noem de branch naar de taak, niet naar jezelf. Drie extra gewoontes: koppel je branch aan je bord, houd branches klein en kort, en schrijf duidelijke commit-berichten — wát je deed en waarom.

---

<p class="kicker">Check-in · Denk – deel</p>

## Je pakt issue #12 “Filter op bereidingstijd”. Welke branchnaam klopt?

<div class="grid2">
  <div class="glr-card"><span class="k">A</span><p><code>main</code></p></div>
  <div class="glr-card"><span class="k">B</span><p><code>feature/#12-filter-tijd</code></p></div>
  <div class="glr-card"><span class="k">C</span><p><code>mijn-branch</code></p></div>
  <div class="glr-card"><span class="k">D</span><p><code>fix/stuff</code></p></div>
</div>

<div class="defbox fragment">
  <span class="k">Antwoord · B</span>
  <p>Eén issue = één branch, genoemd naar de taak. <code>main</code> is protected, <code>mijn-branch</code> zegt niets over het werk en <code>fix/</code> is voor bugs.</p>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">18</span></div>

Note: Peer Instruction. Laat iedereen eerst individueel stemmen met de vingers (1 = A t/m 4 = D). Is de klas verdeeld? Laat buren elkaar één minuut overtuigen en stem opnieuw. Onthul dan het antwoord: B. Bespreek kort waarom de andere drie fout zijn — dat is de herhaling van de branch-regels van de vorige slide.

---

<p class="kicker">Stap 5 · De Pull Request</p>

## Open een PR naar `main` — met de vaste checklist

<p class="lede">Gebruik <code>.github/PULL_REQUEST_TEMPLATE.md</code>, zodat de review soepel loopt.</p>

<div class="cards">
  <div class="glr-card">
    <span class="k">Welke issues?</span>
    <p>Koppel de issue(s) die deze PR oplost, bijv. <code>Closes #12</code>.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Wat is getest?</span>
    <p>Welke acceptatiecriteria heb je gecontroleerd, en hoe?</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Wie reviewt?</span>
    <p>Wijs je teamgenoten aan — automatisch via CODEOWNERS.</p>
  </div>
</div>

**Nooit direct naar main:** één approve van een teamgenoot — dán pas mergen.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">19</span></div>

Note: Stap vijf, het tweede deel: de pull request. Als je code af is, push je je branch en open je een Pull Request naar main. Gebruik daarvoor verplicht de template in .github/PULL_REQUEST_TEMPLATE.md, dan vult iedereen systematisch hetzelfde in. Drie dingen staan daarin: welke issues deze PR oplost (bijvoorbeeld “Closes #12”), wat je hebt getest, en wie de code moet nakijken. De reviewers worden automatisch voorgesteld via CODEOWNERS. De regel: je pusht nooit direct naar main — pas na minimaal één goedkeuring van een teamgenoot mag de PR gemerged worden.

---

<p class="kicker">Stap 5 · Automatische reviewers</p>

## Wijs reviewers automatisch toe met één bestand: CODEOWNERS

```text
# .github/CODEOWNERS
# Wijs je hele team automatisch toe als reviewer bij elke PR

*   @jouw-naam  @teamgenoot-2  @teamgenoot-3
```

<div class="cards">
  <div class="glr-card">
    <span class="k"># commentaar</span>
    <p>Regels met een hekje zijn uitleg — die negeert GitHub.</p>
  </div>
  <div class="glr-card">
    <span class="k">* alle bestanden</span>
    <p>Het sterretje betekent: deze regel geldt voor het hele project.</p>
  </div>
  <div class="glr-card">
    <span class="k">@naam reviewer</span>
    <p>De GitHub-gebruikersnaam van iemand uit je team.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">20</span></div>

Note: Je kunt reviewers automatisch laten toewijzen met een klein bestandje: CODEOWNERS, in de map .github, zonder extensie. Regels die met een hekje beginnen zijn commentaar. De regel met het sterretje betekent: geldt voor alle bestanden in het project. Daarachter zet je de GitHub-gebruikersnamen van je teamleden, elk met een apenstaartje. Vanaf het moment dat dit bestand in main staat, wordt bij elke nieuwe pull request automatisch je hele team als reviewer voorgesteld. Dat geldt ook voor jullie Design Thinking-documenten in de /docs-map: die gaan óók via een pull request.

---

<p class="kicker">Stap 5 · Zo zet je het op</p>

## Drie stappen naar automatische reviews

<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Maak het bestand</h3><p>Voeg <code>.github/CODEOWNERS</code> toe in je repository, op de <code>main</code>-branch.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Zet je team erin</h3><p>Schrijf je gebruikersnamen (met <code>@</code>) achter <code>*</code>, gescheiden door spaties.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Zet de eis aan</h3><p>Vink bij branch protection “Require review from Code Owners” aan.</p></div></div>
</div>

**Resultaat:** elke PR krijgt automatisch je teamleden als verplichte reviewers.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">21</span></div>

Note: Hoe zet je dit op in drie stappen? Stap één: maak het bestand .github/CODEOWNERS aan op de main-branch. Stap twee: zet je teamgebruikersnamen erin, elk met een @, achter het sterretje. Stap drie: zet bij branch protection de optie “Require review from Code Owners” aan. Vanaf dan krijgt elke pull request automatisch je teamleden als verplichte reviewers.

---

<p class="kicker">Stap 5 · Zo review je een PR</p>

## Een reviewer checkt vier dingen

<div class="grid2">
  <div class="glr-card">
    <span class="k">Werkt het?</span>
    <p>Draait de feature zoals bedoeld? Test of het filter echt alleen recepten onder de 20 minuten toont.</p>
  </div>
  <div class="glr-card">
    <span class="k">Is het leesbaar?</span>
    <p>Snap je de code? Duidelijke namen, geen dode code, geen onnodige rommel.</p>
  </div>
  <div class="glr-card">
    <span class="k">Geen rommel of geheimen</span>
    <p>Geen wachtwoorden of API-keys, geen debug-logs of <code>console.log</code>-puin.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Kleine, duidelijke stap</span>
    <p>Eén helder doel per PR, met een titel en uitleg die je meteen snapt.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">22</span></div>

Note: Je hebt een PR gekregen om te reviewen — bijvoorbeeld de branch feature/filter-tijd. Wat kijk je dan na? Vier dingen. Eén: werkt het? Test of het filter echt alleen recepten onder de twintig minuten toont. Twee: is het leesbaar? Snap je de code, zijn de namen duidelijk, staat er geen dode code in? Drie: geen rommel of geheimen — geen wachtwoorden of API-keys, geen debug-logs of console.log die je vergeet weg te halen. Vier: is het één kleine, duidelijke stap met een heldere titel en uitleg? Reageer vriendelijk en concreet. Je keurt pas goed als je echt tevreden bent.

---

<p class="kicker">Check-in · Review-oefening</p>

## Je reviewt <code>feature/filter-tijd</code>. Wat keur jij af?

```javascript [|1|4]
const API_KEY = "sk_live_4f9a2c81d7e6";

function filterOpTijd(recepten, max) {
  console.log("hier!!", recepten);
  return recepten.filter((r) => r.tijd <= max);
}
```

<div class="defbox fragment">
  <span class="k">Request changes</span>
  <p>De API-key hoort in <code>.env</code> (en die in <code>.gitignore</code>) — nooit in Git. En het <code>console.log</code>-puin gaat eruit vóór de merge.</p>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">23</span></div>

Note: Retrieval practice op de review-checklist. Laat tweetallen dertig seconden kijken: wat zou jij afkeuren? Loop daarna met de pijltjes langs de regels: eerst de API-key (geheim in de code), dan de console.log (debug-rommel). Onthul tot slot de conclusie: request changes. Dit is meteen de brug naar de volgende slide over wat niet in de repository hoort.

---

<p class="kicker">Stap 5 · Een schone repo</p>

## Niet alles hoort in de repository

<div class="cards">
  <div class="glr-card">
    <span class="k">Geheimen</span>
    <p>Wachtwoorden, API-keys, tokens — nooit in Git. Zet ze in een <code>.env</code>-bestand.</p>
  </div>
  <div class="glr-card">
    <span class="k">Lokale rommel</span>
    <p>Lokale configuraties (<code>.env</code>, <code>.DS_Store</code>, editor-instellingen), <code>node_modules</code> en zware bestanden horen er niet in.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">De oplossing: .gitignore</span>
    <p>Zet in <code>.gitignore</code> wat Git moet negeren — en leef het na. Zo blijft je repo schoon en veilig.</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">24</span></div>

Note: Tot slot een gewoonte die je repo netjes houdt: niet alles hoort in Git. Geheimen zoals wachtwoorden, API-keys en tokens komen nooit in de repository — als je die per ongeluk commit, moet je ze meteen intrekken en vervangen, want de geschiedenis onthoudt alles. En irrelevante bestanden horen er ook niet in: lokale configuraties zoals een .env-bestand, .DS_Store of editor-instellingen, de map node_modules, en zware bestanden. De oplossing is het .gitignore-bestand. Let bij jullie kookapp ook op de Figma-bronbestanden: die horen niet in de repo; de geëxporteerde PNG’s in docs/assets/ wél.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar"></div>
<p class="kicker kicker--lime">Afronding · Onthoud dit</p>

## Van design-oogst naar Pull Request — in vijf stappen

<div class="cards">
  <div class="glr-card">
    <span class="k">1</span>
    <h3>De Oogst</h3>
    <p>Harde eisen uit je Design Thinking-docs.</p>
  </div>
  <div class="glr-card">
    <span class="k">2</span>
    <h3>Epics &amp; user stories</h3>
    <p>Grote modules, klein gemaakt.</p>
  </div>
  <div class="glr-card">
    <span class="k">3</span>
    <h3>GitHub Project</h3>
    <p>Kanban-bord en afspraken in <code>TEAM.md</code>.</p>
  </div>
  <div class="glr-card">
    <span class="k">4</span>
    <h3>Issues</h3>
    <p>Mini-contracten met acceptatiecriteria.</p>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">5</span>
    <h3>Bouw &amp; PR</h3>
    <p>Feature-branch en Pull Request met review.</p>
  </div>
</div>

**Vervolgstap:** kies één epic, schrijf de eerste issues uit op je bord en claim je eerste taak — op je eigen feature-branch.

<div class="footer"><span>Beroeps 2 · Bouwworkflow</span><span class="num">25</span></div>

Note: Sluit af met de vijf stappen en verwijs terug naar de leerdoelen. De vervolgstap is concreet: kies één epic, schrijf de eerste issues uit en claim je eerste taak op een eigen feature-branch.

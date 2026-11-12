<!-- frontmatter
title: "Oplevering Project: Stop de Ontkoking"
cohort: "2026-2027"
leerjaar: 2
periode: 1
auteur: "Docententeam CSD"
tags: ["Beroeps 2", "Oplevering Project", "Stop de Ontkoking", "GitHub", "Plesk"]
-->

<!-- .slide: class="bleed dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:28px"></div>
<p class="kicker kicker--lime">Beroeps 2 · 2026-2027</p>
<h1 class="title" style="color:#fff;font-size:72px">Oplevering Project</h1>
<p class="lede" style="color:#EDEDED;font-size:27px;max-width:1000px">Release Day voor 'Stop de Ontkoking': livegang op Plesk, definitieve merge naar de main branch en oplevering via een professionele screencapture.</p>
<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">01</span></div>

Note:
Heet alle projectgroepen welkom bij de eindoplevering (Fase 4) van het project 'Stop de ontkoking' voor opdrachtgever GLR Food Freaks. Vandaag ronden we de ontwikkelcyclus af: de code gaat op slot (code freeze), de applicatie gaat live op de Plesk-server en in plaats van een klassikale presentatie leveren jullie een strakke screencapture in via Microsoft Teams.

---

<p class="kicker">Lesprogramma · 09:15 – 12:30 uur</p>

## De ochtend bestaat uit een code freeze, live deployment en video-opname

<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3>09:15 – 10:15 · Instructie, Code Freeze & Plesk Deployment</h3><p>Plenaire briefing, laatste Pull Requests mergen naar <code>main</code> en de applicatie + database live zetten op Plesk (10:15 – 10:30 pauze).</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>10:30 – 11:00 · Opdrachtgever Spreekuur & Scripten</h3><p>Spoor A bereidt het opnamescript en de tabbladen voor. Spoor B dient bij de docent een onderbouwd uitstelverzoek in met het GitHub Projects-bord.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>11:00 – 12:30 · Opnemen Screencapture, Laatste Sprint & Inleveren</h3><p>Opnemen van de screencapture (max. 6 min) of wegwerken van afgesproken issues. Om 12:15 uur plenaire stand-up en controle in MS Teams.</p></div></div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">02</span></div>

Note:
Loop het tijdpad van vandaag kort door. Benadruk dat het uur vóór de pauze bedoeld is om technische blokkades (merge-conflicten op de protected main branch en database-connecties op Plesk) op te lossen. Na de pauze splitsen we in groepen die direct gaan opnemen (Spoor A) en groepen die op gesprek komen voor een formeel uitstelverzoek (Spoor B).

---

<p class="kicker">Definition of Done · Technische Eisen</p>

## Alleen werk in de main branch en live op de Plesk-server telt mee voor beoordeling

<div class="cards">
  <div class="glr-card glr-card--accent"><span class="k">01</span><h3>Live op Plesk</h3><p>De applicatie draait live op jullie school-hosting (Plesk) met een werkende databasekoppeling. Opnames vanaf <code>localhost</code> worden niet geaccepteerd.</p></div>
  <div class="glr-card"><span class="k">02</span><h3>Protected Main Branch</h3><p>Alle code is via goedgekeurde Pull Requests gemerged naar <code>main</code>. Buiten de <code>main</code> branch wordt niets beoordeeld.</p></div>
  <div class="glr-card"><span class="k">03</span><h3>Projectplan & SQL-dump</h3><p>Het volledige Projectplan (incl. MoSCoW, ERD en Datadictionary) staat in Markdown in <code>main</code>, samen met een actuele <code>.sql</code> database-export.</p></div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">03</span></div>

Note:
Dit zijn de harde gatekeepers voor Fase 4. Als een onderdeel alleen op een feature-branch staat of lokaal op een laptop draait, is het niet opgeleverd. Controleer bij het rondlopen tussen 09:35 en 10:15 specifiek of de database-export (.sql) daadwerkelijk in de repository is gepusht.

---

<p class="kicker">Repository Ingang · Documentatie</p>

## De README.md in de main branch vormt het startpunt voor de opdrachtgever

<div class="row">
  <div class="col">
    <ul class="check">
      <li>Naam van het platform en volledige namen + studentnummers van alle groepsleden.</li>
      <li>Directe, klikbare URL naar de live omgeving op de Plesk-server.</li>
      <li>Verwijzing naar de map met het Projectplan (<code>.md</code>) en de database-export (<code>.sql</code>).</li>
    </ul>
  </div>
  <div class="col">
    <div class="terminal-window">
      <div class="terminal-window__bar"><span class="dot"></span><span class="dot"></span><span class="dot dot--lime"></span><span class="title">README.md</span></div>
      <pre><code># Platform: KookGenZ
Team: Naam 1 (12345), Naam 2 (23456), Naam 3 (34567)

## Live Omgeving (Plesk)
https://kookgenz.jouwdomein.glr.nl

## Projectdocumentatie & Database
- Projectplan & MoSCoW: `/docs/projectplan.md`
- Database export: `/database/kookgenz_dump.sql`</code></pre>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">04</span></div>

Note:
Wanneer de docent de opdracht nakijkt, is de README.md het eerste wat geopend wordt. Laat studenten dit sjabloon direct overnemen bovenaan hun README op de main branch, zodat je tijdens het nakijken niet hoeft te zoeken naar de Plesk-URL of de locatie van de SQL-dump.

---

<p class="kicker">Videopresentatie · Kaders & Eisen</p>

## Elk groepslid licht in een screencapture van maximaal zes minuten het eigen werk toe

<div class="row">
  <div class="col">
    <div class="defbox"><span class="k">Kwaliteitseisen Video</span><p>Maximaal <strong>6 minuten</strong>, scherp beeld (min. 1080p) met de <strong>volledige browser inclusief URL-balk</strong> zichtbaar en helder verstaanbare voice-over.</p></div>
  </div>
  <div class="col">
    <div class="callout"><span class="dot"></span><div><h3>Verplichte individuele deelname (B1-K1-W1)</h3><p>Elk groepslid dat op papier in de groep zit, moet hoorbaar in de video het woord voeren en de eigen technische en projectmatige bijdrage aantonen.</p></div></div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">05</span></div>

Note:
Benadruk de harde grens van 6 minuten (gebaseerd op principes van cognitive load en selectievermogen: bereid een script voor en zet tabbladen vooraf klaar). Leg ook direct uit dat voor het werkproces B1-K1-W1 (Samenwerken) iedereen die bij de groep hoort in de opname zijn of haar eigen werk moet laten zien en toelichten.

---

<p class="kicker">Structuur Screencapture · 4 Onderdelen</p>

## De screencapture volgt een vaste opbouw van live product naar GitHub-bewijs

<div class="rows">
  <div class="listrow"><span class="n">A</span><div><h3>Introductie, UI/UX & Responsiviteit (ca. 1 min)</h3><p>Toon de live landingspagina op Plesk (URL zichtbaar), pitch hoe de UI/UX aansluit op Generatie Z en demonstreer responsiviteit via de Browser DevTools (mobiele weergave).</p></div></div>
  <div class="listrow"><span class="n">B</span><div><h3>Demonstratie MoSCoW-features & Database (ca. 2,5 – 3 min)</h3><p>Pak jullie (afgestemde) MoSCoW-analyse erbij. Elk lid demonstreert live de zelfgebouwde features met echte databasewerking (overzicht, categorieën, zoeken, login/registratie, CRUD en admin).</p></div></div>
  <div class="listrow"><span class="n">C</span><div><h3>Projectplan in Markdown (ca. 30 sec)</h3><p>Schakel naar de <code>main</code> branch op GitHub en toon kort de structuur van het Projectplan in Markdown, het ERD, de Datadictionary en de aanwezige <code>.sql</code>-export.</p></div></div>
  <div class="listrow"><span class="n">D</span><div><h3>Individuele GitHub-verantwoording (ca. 1,5 min · Iedereen aan het woord)</h3><p>Filter 1-voor-1 het GitHub Projects-bord en het tabblad Pull Requests op het eigen account. Licht toe welke PR's en Issues jij hebt opgeleverd en welke code-reviews je hebt gedaan.</p></div></div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">06</span></div>

Note:
Laat deze slide tijdens het voorbereiden van de opnames eventueel op het bord staan. Wijs erop dat groepen niet een standaardlijst hoeven af te vinken, maar hun eigen (met jou als docent afgestemde) MoSCoW-analyse naast de demo houden. Bij onderdeel D geldt: heb je weinig of geen commits/PR's op de main branch? Dan licht je in de video eerlijk toe wat jouw rol is geweest.

---

<p class="kicker">Tooling · Schermopname Maken</p>

## Gebruik op de iMac of eigen laptop direct beschikbare software voor de schermopname

<div class="cards">
  <div class="glr-card"><span class="k">macOS / iMac</span><h3>Cmd + Shift + 5 / QuickTime</h3><p>Gebruik de ingebouwde macOS Schermopname of QuickTime Player. Klik op <em>Opties</em> om jullie headset of microfoon te selecteren voor een scherp <code>.mov</code>-bestand.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">Mac & Windows</span><h3>Microsoft Teams</h3><p>Start met je projectgroep een eigen Teams-vergadering, deel het scherm met geluidsopname aan en klik op <em>Opname starten</em>. De video staat direct in MS Stream.</p></div>
  <div class="glr-card"><span class="k">Windows / Studio</span><h3>OBS of Knipprogramma</h3><p>Gebruik OBS Studio (Screen Capture + Audio Input Capture) of het standaard Windows 11 Knipprogramma (<code>Win + Shift + S</code> en kies het video-icoon).</p></div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">07</span></div>

Note:
Geef de praktische tip mee om eerst een testopname van 10 seconden te maken en terug te luisteren. Niets is zo zonde als een opname van 6 minuten waarbij achteraf blijkt dat de microfoon in QuickTime of OBS op 'Geen' stond ingesteld.

---

<p class="kicker">Deadline & Onderhandeling · Client Change Request</p>

## Lever uiterlijk om 12:30 uur in via Teams of onderhandel professioneel over uitstel

<div class="row">
  <div class="col">
    <div class="opcard"><span class="k">Inleveren · 12:30 uur</span><h3>Microsoft Teams Assignment</h3><p>Lever met 1 persoon per groep in: (1) het videobestand of een toegankelijke MS Stream-link, (2) de link naar jullie GitHub-repo en (3) de live Plesk-URL.</p></div>
  </div>
  <div class="col">
    <div class="callout"><span class="dot"></span><div><h3>Opdrachtgever Spreekuur (10:30 – 11:00 uur)</h3><p>Gaat opleveren om 12:30 uur ten koste van de kwaliteit? Vraag tussen 10:30 en 11:00 uur met jullie GitHub Projects-bord formeel uitstel aan tot uiterlijk <strong>zondagochtend 09:00 uur</strong>.</p></div></div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">08</span></div>

Note:
Kader het professionele gedrag (authentiek leren): zonder goedkeuring van de opdrachtgever tijdens het spreekuur (10:30 - 11:00 uur) geldt de harde deadline van vandaag 12:30 uur. Wie uitstel aanvraagt, laat op het GitHub Projects-bord exact zien welke openstaande Issues/PR's nog door wie worden afgerond vóór zondag 09:00 uur en werkt tot 12:30 uur in de les door aan deze sprint.

---

<p class="kicker">Kwalificatiedossier · Beoordeling & Vervolg</p>

## De beoordeling koppelt groepskwaliteit aan individueel aantoonbare bijdrage

<div class="cards">
  <div class="glr-card"><span class="k">B1-K1-W2 & B1-K2-W2</span><h3>Projectplan & Documentatie</h3><p>Volledigheid van het Projectplan in Markdown (PvE, MoSCoW, FO, GO, ERD/Datadictionary) en herleidbare keuzes in GitHub Projects en PR's.</p></div>
  <div class="glr-card"><span class="k">B1-K1-W3</span><h3>Productkwaliteit & Klanteisen</h3><p>Aansprekende Gen Z UI/UX, responsive weergave en een werkende applicatie + database op Plesk volgens jullie afgestemde MoSCoW-scope.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">B1-K1-W1 & Fase 5</span><h3>Individuele Bijdrage & Vervolg</h3><p>Individuele beoordeling op basis van de video en GitHub Insights. Volgende week volgt Fase 5: peer-testen (Testrapport) en individuele reflectie.</p></div>
</div>

<div class="footer"><span>Beroeps 2 · Oplevering Project</span><span class="num">09</span></div>

Note:
Vat kort samen waar je op zondagochtend met de beoordelingschecklist naar kijkt en blik alvast vooruit op volgende week (Fase 5: elkaar testen op basis van het PvE voor het Testrapport, plus het individuele Reflectieverslag en eventuele korte mondelinge toelichtingen). Zet de groepen nu direct aan het werk met de Code Freeze en Plesk-deployment!

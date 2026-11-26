<!-- frontmatter
title: "Week 1 · Les 2: repo, testronde 1 en backlog"
cohort: "2026-2027"
leerjaar: 2
periode: 2
auteur: "Docententeam CSD"
tags: ["Beroeps", "PROCES", "Git", "Usability Testing", "Backlog", "Mobile-First"]
-->

<!-- .slide: class="dark" data-background-color="#111111" -->

<p class="kicker">Inloop · Minuut 00 – 15</p>

## Direct starten: open je projectplan

<div class="alert-bar">Deur sluit op minuut 15. Wacht niet op uitleg, start direct.</div>

<div class="row row--lanes">
  <div class="lane">
    <span class="k">Kolom A</span>
    <h3>Heb je al een groep?</h3>
    <ol>
      <li>Open jullie gekozen projectplan.</li>
      <li>Verdeel de 4 rollen:<div class="roles"><span>Product &amp; Backlog</span><span>UX &amp; Mobile CSS</span><span>Backend &amp; Data</span><span>Git/CI &amp; Release</span></div></li>
      <li>Pak je zelfevaluatie van het vorige project: noteer per persoon je grootste valkuil en hoe het team je eraan herinnert (voor <code>TEAM.md</code>).</li>
    </ol>
  </div>
  <div class="lane lane--muted" style="flex:.62">
    <span class="k">Kolom B</span>
    <h3>Afwezig in les 1?</h3>
    <p>Meld je direct aan de <strong>voorste tafel</strong>: groepsindeling en projectcase kiezen.</p>
    <div class="timer" data-timer="15:00" role="group" aria-label="Timer 15 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Deur dicht</span></div>
      </div>
      <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
    </div>
  </div>
</div>

<div class="signoff">
  <div>Vandaag 3x aftekenen</div>
  <div><b>Min 65</b>Repo + <code>TEAM.md</code> + localhost:8000</div>
  <div><b>Min 130</b>2x Figma Usability Test in Git</div>
  <div><b>Min 180</b>GitHub Backlog gevuld</div>
</div>

<div class="footer"><span>Beroeps 2 · Week 1 · Les 2</span><span class="num">01</span></div>

Note: Inloop, minuut 00–15. Deze slide staat al op het bord als studenten binnenkomen; start de timer bij de start van het lesuur. Teams met een groep beginnen meteen met kolom A; studenten die les 1 misten, vang je op aan de voorste tafel (indeling en case kiezen, laat ze slide 2 zien). De deur sluit strikt op minuut 15. Leerdoelen van vandaag (benoem kort op minuut 15): aan het einde van deze les kun je (1) een teamrepo met CODEOWNERS, TEAM.md en een werkende lokale omgeving opzetten, (2) een think-aloud usability test afnemen en vastleggen via een Pull Request, en (3) Must-have eisen vertalen naar GitHub Issues met acceptatiecriteria. Drie aftekenmomenten: min 65, 130 en 180.

---

<p class="kicker">Oriëntatie · voor inhaalgroepen</p>

## Vijf mobile-first cases: kies op ambitie

<div class="case-grid">
  <div class="case case--basis"><span class="n">1</span><h3>Yume Ramen</h3><span class="track">Basisspoor</span><p>Mobile UX en een snelle bestelflow.</p><span class="stack">PHP · MySQL</span></div>
  <div class="case case--midden"><span class="n">2</span><h3>Music Magnet Magazine</h3><span class="track">Middelspoor</span><p>Dynamische DOM met de JS <code>fetch()</code> API.</p><span class="stack">JS · PHP · MySQL</span></div>
  <div class="case case--hard"><span class="n">3</span><h3>GLR Modellenbureau</h3><span class="track">Uitdagend spoor</span><p>Full-stack CRUD, 3 rollen en beveiliging.</p><span class="stack">PHP · MySQL · Auth</span></div>
  <div class="case case--hard"><span class="n">4</span><h3>GLR Crowdfunding</h3><span class="track">Uitdagend spoor</span><p>Full-stack CRUD, keuringsflow en formulieren.</p><span class="stack">PHP · MySQL · Forms</span></div>
  <div class="case case--klant"><span class="n">5</span><h3>Poppodium Baroeg</h3><span class="track">Uitdagend spoor</span><span class="flag">Potentiële klantcase</span><p>Live concert-feed, filters en beheer/CMS.</p><span class="stack">PHP · MySQL · CMS</span></div>
</div>

<div class="footer"><span>Beroeps 2 · Week 1 · Les 2</span><span class="num">02</span></div>

Note: Alleen voor de inhaalgroep aan de voorste tafel (minuut 00–15); de rest van de klas werkt al. Alle vijf de cases zijn mobile-first en draaien op PHP en MySQL. Basis: Yume Ramen. Midden: Music Magnet Magazine (fetch en dynamische DOM). Uitdagend: Modellenbureau, Crowdfunding en Poppodium Baroeg. Baroeg is een potentiële echte klantcase: live concert-feed, filters en een beheeromgeving. Meerdere groepen mogen dezelfde case kiezen.

---

<p class="kicker">Blok 1 · Minuut 15 – 65 · na 10 min demo</p>

## Repo kickstart, TEAM.md en local dev

<div class="steps">
  <div class="step"><span class="n">1</span><div><h3>Maak de groepsrepo</h3><p>Via <strong>Use this template</strong>. Geef alle teamleden én de docent toegang.</p></div></div>
  <div class="step"><span class="n">2</span><div><h3>Plan &amp; eigenaren</h3><p>Projectplan in <code>/docs/projectplan/</code>. Alle GitHub-namen in <code>.github/CODEOWNERS</code>.</p></div></div>
  <div class="step"><span class="n">3</span><div><h3>Vul <code>TEAM.md</code> in de root</h3><p>De 4 rollen + per persoon je aandachtspunt uit de zelfevaluatie en een concrete teamafspraak. <strong>Afspraken in chats tellen niet.</strong></p></div></div>
  <div class="step"><span class="n">4</span><div><h3>Start lokaal</h3><p><code>bash scripts/dev.sh</code> in de terminal. Check <code>http://localhost:8000</code> en DBngin.</p></div></div>
</div>

<div class="checkpoint">
  <div class="cp-k">Checkpoint 1<b>10:15</b></div>
  <p>Repo live, <code>CODEOWNERS</code> en <code>TEAM.md</code> gepusht naar GitHub, en <code>localhost:8000</code> draait aan tafel.</p>
</div>

<div class="footer"><span>Beroeps 2 · Week 1 · Les 2</span><span class="num">03</span></div>

Note: Minuut 15–25: korte demo (10 min) van Use this template, toegang geven (Settings > Collaborators), CODEOWNERS en bash scripts/dev.sh. Daarna werken de teams zelfstandig tot minuut 65. Let bij TEAM.md op concreetheid: niet "we helpen elkaar", maar "als Sam na 2 dagen geen PR heeft, vraagt de Git-lead in de stand-up waar hij of zij vastzit". Afspraken die alleen in een groepschat staan, tellen niet. Aftekenen aan tafel: repo bekijken op GitHub en localhost:8000 laten zien op de laptop.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<p class="kicker">Pauze · Minuut 65 – 80</p>

<div class="pause">
  <div>
    <div class="big">15 min<br><span>pauze</span></div>
    <p class="restart">Herstart stipt op <b>10:30</b></p>
    <div class="defbox"><span class="k">Tussenstand</span><p>Nog geen vinkje voor Checkpoint 1? Vraag direct hulp, zodat alles draait vóór Blok 2.</p></div>
  </div>
  <div class="timer timer--lg" data-timer="15:00" role="group" aria-label="Timer 15 minuten">
    <div class="t-dial">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="t-track" cx="60" cy="60" r="54"></circle>
        <circle class="t-prog" cx="60" cy="60" r="54"></circle>
      </svg>
      <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Pauze</span></div>
    </div>
    <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Week 1 · Les 2</span><span class="num">04</span></div>

Note: Minuut 65–80. Kijk vóór de pauze op het voortgangsbord (slide 7) welke teams Checkpoint 1 nog missen en loop daar direct na de pauze als eerste langs. Zonder werkende repo kan het testrapport in Blok 2 niet via een PR.

---

<p class="kicker">Blok 2 · PROCES2 · Minuut 80 – 130</p>

## Usability testronde 1 op een echte telefoon

<p class="goal"><strong>Doel:</strong> test het klikbare Figma-prototype uit jullie projectplan op een smartphone, bij medestudenten <strong>buiten je eigen groep</strong>.</p>

<div class="rules">
  <div class="rule"><span class="k">Gouden regel 1</span><h3>Geef een taak, laat hardop denken</h3><p>Kies een taak uit tabel <code>T1</code>–<code>T5</code>. De proefpersoon zegt alles wat hij of zij denkt.</p></div>
  <div class="rule"><span class="k">Gouden regel 2</span><h3>Niet helpen, niet voorzeggen</h3><p>En verdedig het ontwerp niet. Stilte is data.</p></div>
  <div class="rule"><span class="k">Gouden regel 3</span><h3>Eén begeleidt, één noteert</h3><p>Noteer letterlijk waar twijfel of foutklikken ontstaan.</p></div>
</div>

<div class="wf"><span>Werkwijze</span><span><code>/docs/testrapport.md</code></span><i>→</i><span>feature branch</span><i>→</i><span>Pull Request</span><i>→</i><span>review via <code>CODEOWNERS</code></span></div>

<div class="checkpoint">
  <div class="cp-k">Checkpoint 2<b>11:45</b></div>
  <p>Minimaal 2 volledige testobservaties staan via een goedgekeurde PR op <code>main</code> in <code>/docs/testrapport.md</code>.</p>
</div>

<div class="footer"><span>Beroeps 2 · Week 1 · Les 2</span><span class="num">05</span></div>

Note: Minuut 80–130, PROCES2. Teams wisselen proefpersonen uit met een andere groep: de helft van het team test, de andere helft is proefpersoon bij een ander team, daarna wisselen. Open het prototype op de telefoon (Figma-app of mobiele browser), niet op de laptop. Loop rond en grijp in als testleiders gaan uitleggen of helpen. Een volledige observatie bevat: taak (T-code), wat de proefpersoon deed en zei (letterlijk), waar het misging en een eerste conclusie. Het rapport gaat via een feature branch en een PR die een ander teamlid via CODEOWNERS goedkeurt.

---

<p class="kicker">Blok 3 · Minuut 130 – 180</p>

## Van projectplan naar GitHub backlog

<div class="row bl" style="gap:28px;margin-top:14px">
  <div class="col">
    <span class="sub-k">GitHub Project Board</span>
    <div class="kanban"><span>Todo</span><span>In Progress</span><span>Review</span><span>Done</span></div>
    <ul class="check" style="margin-top:18px">
      <li>Elke Must-have eis <code>E1</code>–<code>E5</code> wordt een los Issue.</li>
      <li>Elke eerste testbevinding uit Blok 2 ook.</li>
      <li>Ieder Issue krijgt acceptatiecriteria en een eigenaar.</li>
    </ul>
  </div>
  <div class="col" style="flex:1.15">
    <span class="sub-k">Voorbeeld-issue</span>
    <div class="issue">
      <div class="issue-head"><span class="lbl">Must</span><span>Issue · Poppodium Baroeg</span></div>
      <div class="issue-t">[E2] Duidelijke statusbadges op concertagenda (Uitverkocht / Geannuleerd)</div>
      <div class="issue-ac"><span class="k">Acceptatiecriteria</span><b>Gegeven</b> een bezoeker op 375px mobiel, <b>wanneer</b> een show geannuleerd of uitverkocht is, <b>dan</b> toont de kaart direct een leesbare Nederlandse statusbadge met hoog contrast.</div>
    </div>
  </div>
</div>

<div class="checkpoint">
  <div class="cp-k">Checkpoint 3 · Exit<b>12:30</b></div>
  <p>Project Board gevuld met alle Must-haves + eigenaren voor Week 2, en Checkpoints 1, 2 en 3 afgetekend op het klasbord.</p>
</div>

<div class="footer"><span>Beroeps 2 · Week 1 · Les 2</span><span class="num">06</span></div>

Note: Minuut 130–170 werken, 170–180 exit-ticket. Laat het voorbeeld-issue zien: één eis per Issue, E-code in de titel, acceptatiecriteria in Gegeven/wanneer/dan-vorm en concreet toetsbaar (375px, Nederlandse tekst, hoog contrast). Testbevindingen uit Blok 2 worden ook Issues, met verwijzing naar de T-code. Exit-ticket (170–180): elk team laat het board zien, iedere Must-have heeft een eigenaar voor week 2, en de docent tekent af op slide 7. Afsluiting: volgende week bouwen jullie de eerste Must-haves via feature branches; Deeloplevering 1 is einde week 2.

---

<p class="kicker">Klassikaal voortgangsbord · aftekenmatrix</p>

## Welke teams hebben hun checkpoint gehaald?

<table class="board">
  <colgroup><col class="c-g"><col class="c-p"><col><col><col></colgroup>
  <thead>
    <tr><th>Groep</th><th>Projectcase</th><th>Checkpoint 1<small>Repo, TEAM.md &amp; Dev · min 65</small></th><th>Checkpoint 2<small>2x Figma test via PR · min 130</small></th><th>Checkpoint 3<small>Backlog &amp; exit-ticket · min 180</small></th></tr>
  </thead>
  <tbody>
    <tr><td>Groep 1</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 2</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 3</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 4</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 5</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 6</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 7</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 8</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Groep 9</td><td></td><td></td><td></td><td></td></tr>
  </tbody>
</table>

<div class="footer"><span>Beroeps 2 · Week 1 · Les 2</span><span class="num">07</span></div>

Note: Zet deze slide tijdens de werkblokken op een tweede scherm of teken af met het chalkboard (toets C voor het notitie-canvas over de slide, B voor het bord). Of neem de tabel over op het fysieke whiteboard. Vul de projectcase in zodra een team gekozen heeft. Teams zonder vinkje bij het volgende checkpoint krijgen als eerste begeleiding.

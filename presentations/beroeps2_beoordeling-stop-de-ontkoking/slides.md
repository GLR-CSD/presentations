<!-- frontmatter
title: "Beoordeling Stop De Ontkoking"
cohort: "2026-2027"
leerjaar: 2
periode: 1
auteur: "Docententeam CSD"
tags: ["Beroeps 2", "Stop De Ontkoking", "PDO", "CRUD", "Git"]
-->

<!-- .slide: class="bleed dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:28px"></div>
<p class="kicker kicker--lime">Beroeps 2 · Leerjaar 2 · Periode 1 · 2026-2027</p>
<h1 class="title" style="color:#fff;font-size:72px">Beoordeling Stop De Ontkoking</h1>
<p class="lede" style="color:#EDEDED;font-size:27px;max-width:1000px">Individuele PDO-CRUD oplevering en live aftekenen aan de iMac (09:15 – 12:30).</p>
<div class="footer"><span>Beroeps 2 · Beoordeling Stop De Ontkoking</span><span class="num">01</span></div>

Note:
Korte kick-off (maximaal 5 minuten). Deel de fysieke Werkafspraak-Kaarten uit (achterzijde met Terminal & PDO Cheat-Sheet naar boven). Wie de zelfevaluatie in Teams nog niet heeft ingevuld, doet dat direct om 09:20 als eerste.

---

<p class="kicker">Planning · Donderdag 09:15 – 12:30</p>

## Bouw je module af voor de Code Freeze van 11:15 en laat je direct aftekenen

<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3>09:20 – 10:15 · Bouwsprint 1 & Vroege Aftekening</h3><p>Werk op <code>~/Desktop</code> in je eigen map. Al klaar? Steek je hand op om direct af te tekenen. <strong>Commit vóór de pauze!</strong></p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>10:15 – 10:30 · Pauze</h3><p>Zorg dat je code vóór 10:15 via de terminal op GitHub staat.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>10:30 – 11:15 · Bouwsprint 2 tot Code Freeze (11:15)</h3><p>Rond <code>edit.php</code>, <code>delete.php</code> en het filter af, push via de terminal, open je Pull Request en zet je issues op <code>Closed</code>.</p></div></div>
  <div class="listrow"><span class="n">04</span><div><h3>11:15 – 12:30 · Eindbeoordeling langs de iMacs</h3><p>4-minuten check aan je scherm. Log pas uit nadat je laatste commit op GitHub staat en je fysieke kaart is ingeleverd.</p></div></div>
</div>

<div class="footer"><span>Beroeps 2 · Beoordeling Stop De Ontkoking</span><span class="num">02</span></div>

Note:
Loop tussen 09:20 en 10:15 alvast langs de studenten van wie de backend al grotendeels stond, zodat zij vóór of vlak na de pauze van 10:15–10:30 al afgetekend zijn. Om 11:15 geldt de harde Code Freeze voor de rest.

---

<p class="kicker">Criterium 06 & 15 · De 5 Verplichte Eisen</p>

## Alleen een eigen module met 5 kolommen, GET-filter en PDO prepared statements wordt goedgekeurd

<div class="row">
  <div class="col">
    <ul class="check">
      <li><strong>1. Eigen Map & Branch:</strong> Werk op branch <code>feature/module-[naam]</code> in <code>/module-[naam]/</code> (<code>index</code>, <code>create</code>, <code>edit</code>, <code>delete</code>).</li>
      <li><strong>2. Tabel (5 kolommen):</strong> <code>id</code>, tekstveld, verplichte <code>&lt;select&gt;</code> dropdown, getalveld én <code>toegevoegd_door</code> (eigen naam + studentnr).</li>
      <li><strong>3. Filter in index.php:</strong> Werkend categorie-filter via <code>$_GET</code> en <code>WHERE</code>.</li>
      <li><strong>4. Veilige PDO:</strong> Overal <code>prepare()</code> + <code>execute()</code> en <code>htmlspecialchars()</code>.</li>
      <li><strong>5. Git-Flow:</strong> Terminal commits, SQL in <code>/sql/</code>, Pull Request & 4 issues op <code>Closed</code>.</li>
    </ul>
  </div>
  <div class="col">
    <div class="terminal-window">
      <div class="terminal-window__bar"><span class="dot"></span><span class="dot"></span><span class="dot dot--lime"></span><span class="title">Snelle SQLite Fallback (db.php)</span></div>
      <pre><code>&lt;?php
$pdo = new PDO('sqlite:' . __DIR__ . '/db.sqlite');
$pdo-&gt;setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo-&gt;exec("CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titel TEXT, categorie TEXT,
  aantal INTEGER, toegevoegd_door TEXT
)");</code></pre>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Beoordeling Stop De Ontkoking</span><span class="num">03</span></div>

Note:
Alle 5 eisen + de SQLite-fallback voor studenten die vastlopen op een kapotte groeps-config of Plesk staan hier op één overzichtelijke slide. Wijs voor de terminal-commando's naar de achterzijde van hun fysieke kaart.

---

<p class="kicker">Aftekenen · Laat deze slide openstaan</p>

## Zet deze drie vensters open voor je 4-minuten beoordeling en live code-mutatie

<div class="row">
  <div class="col">
    <div class="cards">
      <div class="glr-card glr-card--accent"><span class="k">01</span><h3>Browser + Demo</h3><p>Toon Create, Read + Filter, Update en Delete met jouw 5 kolommen.</p></div>
      <div class="glr-card glr-card--accent"><span class="k">02</span><h3>Editor + 90s Mutatie</h3><p>Leg de PDO data-flow uit en typ <strong>live zonder AI</strong> 1 kleine aanpassing in.</p></div>
      <div class="glr-card"><span class="k">03</span><h3>GitHub + Kaart</h3><p>Toon je 4 <code>Closed</code> issues, je Pull Request en lever je fysieke kaart in.</p></div>
    </div>
    <div class="callout"><span class="dot"></span><div><h3>Niet uitloggen zonder git push!</h3><p>De Desktop van de iMac wordt gewist bij uitloggen. Push je laatste code en lever je kaart in bij de docent.</p></div></div>
  </div>
  <div class="col">
    <div class="timer" data-timer="50:00" role="group" aria-label="Timer 50 minuten tot pauze">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">50:00</span><span class="t-label">Tot Pauze</span></div>
      </div>
      <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Beoordeling Stop De Ontkoking</span><span class="num">04</span></div>

Note:
Laat deze slide openstaan tijdens het werken. Start om 09:25 de timer van 50 minuten tot de pauze van 10:15. Na de pauze (10:30) zet je de timer op 45 minuten tot de Code Freeze van 11:15.

<!-- frontmatter
title: "Projecten: Architectuur, Planbord & De Eerste Branch"
cohort: "2026-2027"
leerjaar: 1
periode: 1
auteur: "Docententeam CSD"
tags: ["Beroeps 1", "Proces 1", "Git", "CSS-architectuur", "Sprint 0"]
-->

<!-- .slide: class="bleed dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:28px"></div>
<p class="kicker kicker--lime">Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</p>
<h1 class="title" style="color:#fff;font-size:68px">Wat staat er vrijdag online als 4 developers tegelijk in <code>style.css</code> typen?</h1>
<p class="lede" style="color:#EDEDED;font-size:27px;max-width:1000px">Losse bestanden via Discord sturen zorgt gegarandeerd voor overschreven code en kapotte links.</p>
<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">01</span></div>

Note:
Gagné 1 · Aandacht trekken (00–04 min). Schets het scenario van de "Horror Projectmap" (Home Pagina.HTML, style_definitief_v3.css). Vraag de klas wat er gebeurt als vier developers tegelijk op regel 15 van style.css typen. Vandaag richten we daarom eerst Sprint 0 strak in.

---

<p class="kicker">Leerdoelen · Sprint 0</p>

## Na deze les staat jullie projectfundament klaar op GitHub

<ul class="check">
  <li>mappen en bestanden inrichten volgens <code>kebab-case</code> (Toepassen);</li>
  <li><code>css/global.css</code> koppelen naast een eigen paginastylesheet (Toepassen);</li>
  <li>taken en huisstijl vastleggen op het planbord en in <code>README.md</code> (Toepassen);</li>
  <li>een eigen <code>feature/</code>-branch aanmaken en pushen via GitHub Desktop (Toepassen).</li>
</ul>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">02</span></div>

Note:
Gagné 2 · Leerdoelen communiceren (04–06 min). Benoem dat we in Les 1 (van 2) nog géén pagina-inhoud bouwen of mergen. Om cognitieve overbelasting te voorkomen richten we vandaag alleen de architectuur, het planbord en de eigen branches in.

---

<p class="kicker">Voorkennis activeren · INTERFACE1 &amp; PROGRAM1</p>

## Waarom crasht een project met <code>Over Ons.HTML</code> en één gedeelde <code>style.css</code>?

<div class="callout"><span class="dot"></span><div><h3>Denk-Deel-Wissel (2 minuten)</h3><p>Bespreek met je buur wat er misgaat met spaties in bestandsnamen en gelijktijdig typen in hetzelfde CSS-bestand.</p></div></div>

<div class="cards">
  <div class="glr-card"><span class="k">01</span><h3>Kapotte paden</h3><p>Spaties en hoofdletters breken op een webserver of andere laptop.</p></div>
  <div class="glr-card"><span class="k">02</span><h3>Merge conflicts</h3><p>Tegelijk werken in één CSS-bestand overschrijft elkaars code.</p></div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">03</span></div>

Note:
Gagné 3 · Voorkennis activeren (06–08 min). Haal de kennis uit INTERFACE1 (:root variabelen, relatieve paden) en PROGRAM1 (mappenstructuur) op. Laat studenten kort overleggen en vraag 2 duo's om hun antwoord.

---

<p class="kicker">Nieuwe stof · Assertion-Evidence (1/4)</p>

## Met <code>kebab-case</code> werken bestandsnamen op elke laptop en webserver

<p class="lede">Gebruik voor mappen en bestanden uitsluitend kleine letters en koppeltekens.</p>

<div class="defbox"><span class="k">kebab-case</span><p>Geen spaties of hoofdletters: schrijf <strong>over-ons.html</strong> en <strong>team-foto.webp</strong> (alleen <code>README.md</code> is een uitzondering).</p></div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">04</span></div>

Note:
Gagné 4a · Inhoud presenteren (08–10 min). Leg uit dat Windows hoofdletterongevoelig is, maar een Linux-webserver niet. Over Ons.HTML geeft online direct een 404-fout.

--

<p class="kicker">Nieuwe stof · Assertion-Evidence (2/4)</p>

## Elk teamlid beheert één eigen HTML-bestand en één eigen CSS-bestand

<div class="terminal-window">
  <div class="terminal-window__bar"><span class="dot"></span><span class="dot"></span><span class="dot dot--lime"></span><span class="title">glr-groepsproject-team1</span></div>
  <pre><code>├── index.html          # Eigenaar: Student 1 (Home)
├── over-ons.html       # Eigenaar: Student 2
├── projecten.html      # Eigenaar: Student 3
├── contact.html        # Eigenaar: Student 4
├── README.md           # Teamcontract &amp; link naar planbord
├── .gitignore          # Blokkeert .DS_Store en Thumbs.db
├── css/
│   ├── global.css      # GEDEELD: :root variabelen, header &amp; footer
│   ├── home.css        # ALLEEN Student 1
│   ├── over-ons.css    # ALLEEN Student 2
│   ├── projecten.css   # ALLEEN Student 3
│   └── contact.css     # ALLEEN Student 4
└── assets/img/         # Afbeeldingen in kebab-case</code></pre>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">05</span></div>

Note:
Gagné 4b · Inhoud presenteren (10–12 min). De terminal staat hier op volle breedte zodat de boomstructuur goed leesbaar is. Wijs op de strikte scheiding in de map css/ en leg kort uit wat .gitignore doet (systeembestanden van macOS/Windows negeren).

--

<p class="kicker">Nieuwe stof · Assertion-Evidence (3/4)</p>

## Een 2-laags CSS-architectuur voorkomt dat jullie in hetzelfde bestand werken

<div class="row">
  <div class="col vcenter">
    <p class="kicker">Twee lagen</p>
    <p class="lede">Samen vullen jullie één keer <code>css/global.css</code> in. Daarna werkt ieder in zijn eigen paginastylesheet.</p>
  </div>
  <div class="col">
    <figure class="fig-fill">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'%3E%3Crect width='640' height='400' fill='%23F4F4F6'/%3E%3Crect x='140' y='24' width='360' height='110' rx='8' fill='%23111111' stroke='%2376B800' stroke-width='4'/%3E%3Ctext x='320' y='62' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='20' fill='%23FFFFFF'%3ELaag 1: css/global.css (op main)%3C/text%3E%3Ctext x='320' y='92' text-anchor='middle' font-family='sans-serif' font-size='15' fill='%23EDEDED'%3E:root variabelen · reset · header · footer%3C/text%3E%3Cline x1='200' y1='134' x2='100' y2='220' stroke='%23111111' stroke-width='3'/%3E%3Cline x1='280' y1='134' x2='245' y2='220' stroke='%23111111' stroke-width='3'/%3E%3Cline x1='360' y1='134' x2='395' y2='220' stroke='%23111111' stroke-width='3'/%3E%3Cline x1='440' y1='134' x2='540' y2='220' stroke='%23111111' stroke-width='3'/%3E%3Crect x='25' y='220' width='140' height='130' rx='6' fill='%23FFFFFF' stroke='%23111111' stroke-width='2'/%3E%3Ctext x='95' y='258' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='15' fill='%23111111'%3Efeature/home%3C/text%3E%3Ctext x='95' y='288' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%23444444'%3Eindex.html%3C/text%3E%3Ctext x='95' y='312' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2376B800' font-weight='bold'%3Ecss/home.css%3C/text%3E%3Crect x='175' y='220' width='140' height='130' rx='6' fill='%23FFFFFF' stroke='%23111111' stroke-width='2'/%3E%3Ctext x='245' y='258' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='15' fill='%23111111'%3Efeature/over-ons%3C/text%3E%3Ctext x='245' y='288' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%23444444'%3Eover-ons.html%3C/text%3E%3Ctext x='245' y='312' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2376B800' font-weight='bold'%3Ecss/over-ons.css%3C/text%3E%3Crect x='325' y='220' width='140' height='130' rx='6' fill='%23FFFFFF' stroke='%23111111' stroke-width='2'/%3E%3Ctext x='395' y='258' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='15' fill='%23111111'%3Efeature/projecten%3C/text%3E%3Ctext x='395' y='288' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%23444444'%3Eprojecten.html%3C/text%3E%3Ctext x='395' y='312' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2376B800' font-weight='bold'%3Ecss/projecten.css%3C/text%3E%3Crect x='475' y='220' width='140' height='130' rx='6' fill='%23FFFFFF' stroke='%23111111' stroke-width='2'/%3E%3Ctext x='545' y='258' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='15' fill='%23111111'%3Efeature/contact%3C/text%3E%3Ctext x='545' y='288' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%23444444'%3Econtact.html%3C/text%3E%3Ctext x='545' y='312' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2376B800' font-weight='bold'%3Ecss/contact.css%3C/text%3E%3C/svg%3E" alt="Diagram van de 2-laags CSS-architectuur met global.css bovenaan en vier losse feature-branches daaronder.">
      <figcaption>Bron: GLR Architectuurblauwdruk BEROEPS1</figcaption>
    </figure>
  </div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">06</span></div>

Note:
Gagné 4c · Inhoud presenteren (12–14 min). Leg uit dat iedereen dankzij global.css dezelfde header, footer en kleurvariabelen heeft, zonder elkaars paginacode te raken.

--

<p class="kicker">Nieuwe stof · Assertion-Evidence (4/4)</p>

## Door op een eigen <code>feature/</code>-branch te werken blijft <code>main</code> altijd stabiel

<div class="cards">
  <div class="glr-card"><span class="k">01</span><h3>Setup op <code>main</code></h3><p>De Repo-beheerder plaatst het startpakket, vult <code>README.md</code> en <code>global.css</code> in en nodigt het team uit.</p></div>
  <div class="glr-card"><span class="k">02</span><h3>Klonen &amp; Branchen</h3><p>Ieder teamlid kloont de repo in GitHub Desktop en maakt een eigen branch, zoals <code>feature/over-ons</code>.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">03</span><h3>Publish Branch</h3><p>Maak je eigen bestanden aan, commit en klik op <strong>Publish branch</strong>.</p></div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">07</span></div>

Note:
Gagné 4d · Inhoud presenteren (14–16 min). Benadruk de gouden regel: na de gezamenlijke opzet in de eerste 8 minuten werkt niemand meer rechtstreeks op main.

---

<p class="kicker">Worked example · Stap 1 van 2</p>

## Leg eerst samen jullie huisstijl vast in <code>css/global.css</code>

<div class="terminal-window">
  <div class="terminal-window__bar"><span class="dot"></span><span class="dot"></span><span class="dot dot--lime"></span><span class="title">css/global.css</span></div>
  <pre><code data-line-numbers="1-8|10-15" class="language-css">/* Stap 1: Kies samen 3 kleuren en 1 font op main */
:root {
  --color-primary: #76B800;
  --color-dark: #111111;
  --color-light: #F4F4F6;
  --font-main: system-ui, sans-serif;
}

/* Stap 2: Gebruik deze variabelen in je eigen CSS */
.hero-banner {
  background-color: var(--color-dark);
  color: var(--color-primary);
}</code></pre>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">08</span></div>

Note:
Gagné 5a · Leerbegeleiding bieden (16–18 min). Loop met de pijltjes door blok 1-8 (:root in global.css) en blok 10-15 (hoe je de variabele aanroept in je eigen CSS-bestand).

--

<p class="kicker">Worked example · Stap 2 van 2</p>

## Laad in je HTML-bestand altijd eerst <code>global.css</code> en daarna jouw eigen CSS

<div class="terminal-window">
  <div class="terminal-window__bar"><span class="dot"></span><span class="dot"></span><span class="dot dot--lime"></span><span class="title">over-ons.html</span></div>
  <pre><code data-line-numbers="4-5|7-8|10-11" class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="nl"&gt;
&lt;head&gt;
  &lt;!-- 1. Pas de titel aan naar jouw eigen pagina --&gt;
  &lt;title&gt;Ons Project | Over ons&lt;/title&gt;

  &lt;!-- 2. Laad ALTIJD eerst het gedeelde global.css --&gt;
  &lt;link rel="stylesheet" href="css/global.css"&gt;

  &lt;!-- 3. Koppel daaronder jouw EIGEN paginastylesheet --&gt;
  &lt;link rel="stylesheet" href="css/over-ons.css"&gt;
&lt;/head&gt;</code></pre>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">09</span></div>

Note:
Gagné 5b · Leerbegeleiding bieden (18–20 min). Vraag de klas waarom de volgorde op regel 8 en 11 cruciaal is. Laat daarna kort in GitHub Desktop zien hoe je een nieuwe branch aanmaakt (Current Branch -> New Branch -> feature/over-ons).

---

<p class="kicker">Zelfstandig toepassen · Deel 1 (P1-K1)</p>

## Sprint 0 Stap A: Verdeel de pagina's en richt jullie planbord in

<div class="row">
  <div class="col">
    <div class="opcard"><span class="k">Teamopdracht · 12 minuten</span><h3>Plannen &amp; Huisstijl kiezen</h3><p>Regel dit samen met je groep (3–4 studenten):</p><ul><li>Kies 1 <strong>Repo-beheerder</strong> en verdeel de 4 pagina's.</li><li>Zet ieders pagina op <strong>Doing</strong> in Trello of GitHub Projects.</li><li>Kies samen 3 hex-kleuren en 1 font.</li></ul></div>
  </div>
  <div class="col col--narrow">
    <div class="timer" data-timer="12:00" role="group" aria-label="Timer 12 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">12:00</span><span class="t-label">Plannen</span></div>
      </div>
      <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">10</span></div>

Note:
Gagné 6a · Prestatie uitlokken (20–32 min). Start de timer van 12 minuten. Loop rond en controleer of elk teamlid een eigen pagina heeft en het planbord op Doing staat.

--

<p class="kicker">Zelfstandig toepassen · Deel 2 (P3-K1)</p>

## Sprint 0 Stap B: Kloon de groepsrepo en push jouw eigen <code>feature/</code>-branch

<div class="row">
  <div class="col">
    <div class="opcard"><span class="k">Hands-on Studio · 20 minuten</span><h3>Repo Setup &amp; Branchen</h3><p>Voer deze twee stappen op volgorde uit:</p><ul><li><strong>Min 0–8 (Samen):</strong> Repo-beheerder vult <code>README.md</code> en <code>global.css</code> in op <code>main</code> en nodigt het team uit (<em>Collaborators</em>).</li><li><strong>Min 8–20 (Ieder):</strong> Kloon de repo, maak je <code>feature/</code>-branch, voeg je eigen <code>.html</code> en <code>.css</code> toe en klik op <strong>Publish branch</strong>.</li></ul></div>
  </div>
  <div class="col col--narrow">
    <div class="timer" data-timer="20:00" role="group" aria-label="Timer 20 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">20:00</span><span class="t-label">Branchen</span></div>
      </div>
      <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">11</span></div>

Note:
Gagné 6b · Prestatie uitlokken (32–52 min). Helpt eerst de Repo-beheerders bij het uitnodigen van Collaborators. Let daarna scherp op studenten die vergeten van branch te wisselen voordat ze hun bestanden aanmaken.

---

<p class="kicker">Feedback &amp; bespreking · 60-Seconden Repo Check</p>

## Controleer in GitHub Desktop altijd eerst je actieve branch voordat je codeert

<div class="cards">
  <div class="glr-card"><span class="k">Veelgemaakte fout</span><h3>Direct bouwen op <code>main</code></h3><p>Je maakt je HTML-bestand al aan voordat je van branch wisselt, of laat <code>css/home.css</code> in je gekopieerde HTML staan.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">Best practice</span><h3>Eerst branchen, dan bouwen</h3><p>Zet <strong>Current Branch</strong> eerst op <code>feature/[jouw-pagina]</code>, koppel je eigen CSS en klik op <strong>Publish branch</strong>.</p></div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">12</span></div>

Note:
Gagné 7 · Feedback geven (52–56 min). Bespreek een veelvoorkomende fout uit de zaal. Laat elk team op GitHub.com controleren of alle 4 de feature-branches gepusht zijn.

---

<p class="kicker">Begripscheck · Formatieve check</p>

## Hoe pas je een kleur aan zonder een merge conflict te veroorzaken?

<div class="cards">
  <div class="glr-card"><span class="k">A</span><h3>Zelf in <code>global.css</code></h3><p>Je past op jouw branch direct <code>:root</code> aan en pusht zonder overleg.</p></div>
  <div class="glr-card glr-card--accent fragment custom"><span class="k">B</span><h3>Eigen CSS of samen</h3><p>Paginastijlen zet je in je eigen CSS; <code>global.css</code> pas je alleen in overleg aan.</p></div>
  <div class="glr-card"><span class="k">C</span><h3>Kopie <code>global2.css</code></h3><p>Je maakt een tweede globale stylesheet aan voor jouw eigen pagina.</p></div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">13</span></div>

Note:
Gagné 8 · Prestatie beoordelen (56–58 min). Peer Instruction: laat studenten stemmen met vingers (1=A, 2=B, 3=C). Na kort overleg met de buur klik je om antwoord B op te laten lichten.

---

<p class="kicker">Transfer · Vooruitblik Les 2 &amp; Stage</p>

## Op je stage en in Les 2 vormt jouw <code>feature/</code>-branch de basis voor een Pull Request

<div class="defbox"><span class="k">Praktijk &amp; Stage (Leerjaar 3)</span><p>Bij webbureaus is <code>main</code> beveiligd: elke taak op het sprintbord krijgt een eigen <code>feature/</code>-branch en wordt pas na een review samengevoegd.</p></div>

<div class="rows">
  <div class="listrow"><span class="n">01</span><div><h3>Nu aftekenen (Green-Light Check)</h3><p>Toon jullie planbord, <code>README.md</code>, <code>global.css</code> en alle gepushte branches op GitHub.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>Volgende les (Les 2 van 2)</h3><p>Pagina's bouwen op je eigen branch en samenvoegen via een <strong>Pull Request &amp; Merge</strong>.</p></div></div>
</div>

<div class="footer"><span>Beroeps 1 · Projecten: Architectuur, Planbord &amp; De Eerste Branch</span><span class="num">14</span></div>

Note:
Gagné 9 · Retentie en transfer bevorderen (58–60 min). Koppel de werkwijze aan leerjaar 3 (stage) en blik vooruit naar Les 2. Teken bij elk groepje de Green-Light Kickoff Kit af volgens de OVG-rubric.

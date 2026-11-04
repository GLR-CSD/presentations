<!-- frontmatter
title: "Eindsprint & Scope Reset"
cohort: "2026-2027"
leerjaar: 2
periode: 1
auteur: "Docententeam CSD"
tags: ["Beroeps", "Agile", "MVP", "PHP", "MySQL", "Pull Request", "Fist to Five", "Release Video", "Zelfevaluatie", "Scope"]
-->

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:28px"></div>
<p class="kicker kicker--lime">Beroeps2 · GLR Food Freaks · Laatste 4 lessen</p>
<h1 class="title" style="color:#fff;font-size:72px">Stop de ontkoking.<br>De Eindsprint &amp; Scope Reset.</h1>
<p class="lede" style="color:#EDEDED;font-size:27px;max-width:1000px">Van formatieve tussenstand naar een werkende PHP/MySQL-applicatie en een 4-minuten Release Video in 10 lesuren.</p>
<div class="defbox" style="margin-top:26px;max-width:980px">
  <span class="k">Nu direct · bij binnenkomst</span>
  <ul class="check" style="margin-top:4px">
    <li>Ga direct bij je <strong style="color:#fff">Agile-team (3 personen)</strong> zitten.</li>
    <li>Open jullie <strong style="color:#fff">GitHub-repository</strong> (tabblad <em>Pull Requests</em>), het <strong style="color:#fff">GitHub Project-bord</strong> en jullie lokale ontwikkelomgeving (<strong style="color:#fff">XAMPP/MAMP + VS Code</strong>).</li>
    <li>Leg <strong style="color:#fff">pen en papier</strong> klaar — die heb je zo nodig.</li>
  </ul>
</div>
<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">01</span></div>

Note: Gagné 1 — aandacht trekken door direct te activeren. Laat deze slide al op het scherm staan als de studenten binnenkomen. Geen uitleg vooraf: iedereen gaat bij het eigen team zitten en opent repo (tabblad Pull Requests), Project-bord, XAMPP/MAMP en VS Code. Iedereen heeft pen en papier nodig voor de volgende slide. Pas als alle laptops open staan begin je. Tijd: 00:00–00:05.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:40px"></div>
<p class="kicker kicker--lime">Zelfevaluatie · Stap 1 · Gevoel · 1 minuut</p>
<h2 class="title" style="color:#fff;font-size:64px;max-width:1000px">Hoeveel procent van jullie project is af?</h2>
<p class="lede" style="font-size:28px;max-width:900px">Schrijf stil één getal op je papiertje, van 0 tot 100%. Niet overleggen. Vouw het daarna dicht.</p>
<p class="big-q" aria-hidden="true">__ %</p>
<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">02</span></div>

Note: Zelfevaluatie, deel 1 (Gagné 3 — voorkennis activeren, metacognitief). Vraag ieder teamlid om stil en zonder overleg één percentage op te schrijven: hoeveel van jullie project is af? Laat het papiertje dichtvouwen; we openen het straks pas, naast het bewijs. Doel: het verschil tussen gevoel en bewijs zichtbaar maken. Benadruk: er is geen fout antwoord, dit wordt niet beoordeeld. Tijd: 1 minuut.

---

<div class="row">
  <div class="col" style="flex:1 1 66%">
    <p class="kicker">Zelfevaluatie · Stap 2 · Bewijscheck in je team · 5 minuten</p>
    <h2 class="title title--sm">Tel wat aantoonbaar op <code>main</code> staat, niet wat “bijna af” is</h2>
    <div class="tally">
      <div class="tally-row"><span class="tally-n">A</span><div><h3>Docs op <code>main</code></h3><p><code>01</code> t/m <code>04</code>, ERD en wireframes</p></div><span class="tally-a">__ / 6</span></div>
      <div class="tally-row"><span class="tally-n">B</span><div><h3>Must-features op <code>main</code></h3><p>Uit jullie <strong>eigen</strong> <code>02-define.md</code> — werkend en gemerged</p></div><span class="tally-a">__ / __</span></div>
      <div class="tally-row"><span class="tally-n">C</span><div><h3>Tempo</h3><p>Features erbij in de laatste 2 lessen (<em>Pull Requests → Closed</em>)</p></div><span class="tally-a">+ __</span></div>
      <div class="tally-row tally-row--sum"><span class="tally-n">D</span><div><h3>Projectie na 4 bouwlessen</h3><p>Zelfde tempo: B + 2 × C</p></div><span class="tally-a">__ / __</span></div>
    </div>
    <p class="small" style="margin-top:12px">Een open branch, een open PR of “werkt bij mij lokaal” telt als <strong>0</strong>.</p>
  </div>
  <div class="col" style="flex:1 1 34%">
    <div class="timer" data-timer="05:00" role="group" aria-label="Bewijscheck-timer 5 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">05:00</span><span class="t-label">Bewijscheck</span></div>
      </div>
      <div class="t-btns">
        <button class="t-btn t-start" type="button">Start</button>
        <button class="t-btn t-reset" type="button">Reset</button>
      </div>
    </div>
  </div>
</div>
<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">03</span></div>

Note: Zelfevaluatie, deel 2 — tellen, geen schatten. Uren inschatten is in development notoir lastig; daarom kijken we naar bewijs en naar het tempo van de afgelopen lessen ("yesterday's weather" uit Scrum). A: welke docs staan echt op main? B: hoeveel van de Must-features uit jullie EIGEN 02-define.md werken en zijn gemerged? C: hoeveel features kwamen er de afgelopen 2 lessen bij — kijk in Pull Requests → Closed. D: we hebben nog 4 bouwlessen (vandaag t/m Les 4; in Les 5 en 6 wordt er getest en opgeleverd). C is het tempo per 2 lessen, dus met hetzelfde tempo kom je op B + 2 × C. Strikte regel: alleen gemerged op main telt. Heeft een team geen bruikbare 02-define.md, tel dan de kaarten op het Project-bord (Done tegenover totaal). Start de timer: 5 minuten.

---

<p class="kicker">Zelfevaluatie · Stap 3 · Gevoel tegenover bewijs</p>

## Past de rest van jullie plan in 4 bouwlessen?

<p class="lede">Scrum Masters noemen B en D. Vouw daarna je papiertje open: hoe verhoudt jouw gevoel zich tot het bewijs?</p>

<div class="cards">
  <div class="glr-card"><span class="k">D = alle Must-features</span><h3>Past</h3><p>Op koers. Jullie mogen straks aan Should-haves denken.</p></div>
  <div class="glr-card"><span class="k">D = bijna alles</span><h3>Past net</h3><p>Geen ruimte voor tegenvallers of bugs uit de testweek.</p></div>
  <div class="glr-card glr-card--warn"><span class="k">D ruim onder het totaal</span><h3>Past niet</h3><p>Met dit tempo is jullie eigen plan niet af vóór de testweek.</p></div>
</div>

<div class="defbox fragment">
  <span class="k">Past het niet?</span>
  <p>Dan heb je maar drie knoppen: <strong>meer tijd</strong>, <strong>minder kwaliteit</strong> of <strong>minder scope</strong>.</p>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">04</span></div>

Note: Zelfevaluatie, deel 3 (Sparkline: "wat is"). Teken op het whiteboard een tabel: team · gevoel (gemiddelde van de papiertjes) · B op main · D projectie · past / past net / past niet. Laat elke Scrum Master de getallen noemen en vul de tabel live. Vraag daarna: wat valt jullie op? Laat studenten zelf het patroon benoemen (meestal: het gevoel ligt hoger dan het bewijs, en D haalt het totaal niet). Klik dan het fragment: als het niet past, heb je maar drie knoppen. Dat leidt naar de volgende slide. Tijd voor stap 1–3 samen: 00:05–00:15.

---

<p class="kicker">Scope-onderhandeling · Zo werkt het in de praktijk</p>

## Als de tijd vastligt, beweegt de scope, niet de kwaliteit

<div class="row" style="margin-top:14px">
  <div class="col triangle" style="flex:0 0 470px">
    <svg viewBox="0 0 470 400" role="img" aria-label="Driehoek met drie hoeken: Tijd ligt vast (nog 4 bouwlessen), Kwaliteit ligt vast (werkend en via de Git-workflow), Scope beweegt (MoSCoW).">
      <polygon points="235,62 72,300 398,300" fill="#F4F4F6" stroke="#111111" stroke-width="4" stroke-linejoin="round"></polygon>
      <circle cx="235" cy="62" r="54" fill="#111111"></circle>
      <text x="235" y="58" text-anchor="middle" class="tri-name" fill="#FFFFFF">Tijd</text>
      <text x="235" y="82" text-anchor="middle" class="tri-tag" fill="#A6E22E">VAST</text>
      <circle cx="72" cy="300" r="54" fill="#111111"></circle>
      <text x="72" y="296" text-anchor="middle" class="tri-name" fill="#FFFFFF">Kwaliteit</text>
      <text x="72" y="320" text-anchor="middle" class="tri-tag" fill="#A6E22E">VAST</text>
      <circle cx="398" cy="300" r="54" fill="#A6E22E" stroke="#111111" stroke-width="4" stroke-dasharray="10 7"></circle>
      <text x="398" y="296" text-anchor="middle" class="tri-name" fill="#111111">Scope</text>
      <text x="398" y="320" text-anchor="middle" class="tri-tag" fill="#111111">BEWEEGT</text>
      <text x="235" y="385" text-anchor="middle" class="tri-sub" fill="#424936">Kies welke hoek meegeeft</text>
    </svg>
  </div>
  <div class="col vcenter">
    <div class="rows rows--tight" style="margin-top:0">
      <div class="listrow fragment"><span class="n">01</span><div><h3>Tijd ligt vast</h3><p>Nog 4 bouwlessen, daarna testen en opleveren.</p></div></div>
      <div class="listrow fragment"><span class="n">02</span><div><h3>Kwaliteit ligt vast</h3><p>Werkend op <code>main</code>, via gereviewde PR's.</p></div></div>
      <div class="listrow fragment"><span class="n">03</span><div><h3>Dus beweegt de scope</h3><p>Minder features, maar wél af en werkend.</p></div></div>
    </div>
    <div class="defbox defbox--sm fragment">
      <span class="k">Scope change request</span>
      <p>Normaal in elk project: je laat de klant het bewijs zien en spreekt <strong>samen</strong> een kleinere scope af.</p>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">05</span></div>

Note: Gagné 4 en 5 — de ijzeren driehoek uit projectmanagement. Elk project heeft drie hoeken: tijd, kwaliteit en scope. Bij ons ligt de tijd vast: er zijn nog 4 bouwlessen, daarna wordt er in Les 5 en 6 getest en opgeleverd. De kwaliteit ligt ook vast: werkend op main, via gereviewde PR's — dat is wat jullie stagebedrijf straks ook verwacht. Dan kan alleen de scope bewegen. Benadruk de boodschap: een scope-aanpassing is geen falen. Op stage en in je baan heet dit een scope change request en dat gebeurt continu, mits je het in overleg met de klant doet en het onderbouwt met bewijs — precies wat jullie net gemeten hebben.

---

<p class="kicker">Check-in · Denk – deel – herstem</p>

## Wat doet een professioneel team met deze tussenstand?

<p class="lede" style="margin-top:10px">Team Bitterbal: <strong>3 van de 8</strong> Must-features op <code>main</code>, tempo <strong>+1</strong> per 2 lessen, nog 4 bouwlessen.</p>

<div class="grid2">
  <div class="glr-card"><span class="k">A</span><p>Thuis extra uren maken en alle 8 features bouwen zoals beloofd.</p></div>
  <div class="glr-card"><span class="k">B</span><p>Stilletjes de lastige features weglaten en hopen dat de klant het niet merkt.</p></div>
  <div class="glr-card"><span class="k">C</span><p>Met het bord en de PR-historie een kleinere MVP voorstellen aan de klant en akkoord vragen.</p></div>
  <div class="glr-card"><span class="k">D</span><p>Reviews en Pull Requests overslaan, zodat het bouwen sneller gaat.</p></div>
</div>

<div class="defbox defbox--sm fragment">
  <span class="k">Antwoord · C</span>
  <p>Scope bijstellen doe je <strong>met bewijs en in overleg</strong>. A is onrealistisch (projectie: 5 van 8), B schaadt het vertrouwen van de klant en D offert de kwaliteit op die vastligt.</p>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">06</span></div>

Note: Peer Instruction (Gagné 6 en 7). Eén: iedereen stemt individueel en tegelijk met de vingers (1 = A t/m 4 = D), zonder overleg. Twee: is de klas verdeeld? Laat buren met een ander antwoord elkaar één minuut overtuigen. Drie: stem opnieuw. Onthul dan het antwoord C en bespreek waarom de andere drie fout zijn. A: met tempo +1 per 2 lessen kom je in 4 bouwlessen op 5 van 8 — extra uren lossen dat niet op. B: de klant merkt het altijd, en dan ben je het vertrouwen kwijt. D: kwaliteit ligt vast, zie de driehoek. Transfervraag: wanneer kom je dit op stage tegen? Tijd: ±4 minuten.

---

<p class="kicker">Nieuw bericht · Antwoord van de opdrachtgever</p>

## De opdrachtgever gaat akkoord met een kleinere, haalbare scope

<div class="msg">
  <dl class="msg-head">
    <dt>Van</dt><dd><strong>GLR Food Freaks</strong> (Opdrachtgever)</dd>
    <dt>Aan</dt><dd>Alle Scrum Masters &amp; Development Teams</dd>
    <dt>Onderwerp</dt><dd>Re: jullie signaal over de scope</dd>
  </dl>
  <div class="msg-body">
    <p>“Bedankt voor jullie eerlijke tussenstand. Akkoord: we brengen de bouw-eisen terug naar een haalbare <span class="highlight">MVP</span> en vervangen de live eindpresentatie door een <span class="highlight">4-minuten Release Video</span>. Jullie Git-workflow en Docs-as-Code blijven de lat.”</p>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">07</span></div>

Note: Speel GLR Food Freaks: dit is het antwoord op het signaal dat de klas net zelf heeft afgegeven met de bewijscheck. De volledige boodschap: jullie hebben de afgelopen weken geïnvesteerd in een professionele Git-workflow, Branch Protection, Pull Requests en Docs-as-Code. Dat is zwaar, maar goud waard voor jullie stagejaar. Omdat er nog 4 lessen (10 uur) resteren én teams verschillend presteren op code of documentatie, gaan we akkoord met een haalbare MVP, en de klassikale eindpresentatie wordt een 4-minuten Release Video. Benadruk: dit is wat er gebeurt als je een scope-wijziging met bewijs voorlegt — de klant denkt mee.

---

<p class="kicker">Leerdoelen</p>

## Aan het einde van deze les kun je …

1. je projectvoortgang **beoordelen** met bewijs uit `main` en een scope-aanpassing **onderbouwen** richting de klant;
2. de projectscope **terugbrengen** naar een haalbare MVP in `02-define.md`;
3. als team **parallel werken** op eigen branches volgens Categorie A of Categorie B;
4. jullie werk **bewijzen** op `main` met een gemergde Code-PR, Docs-PR en huiswerk-issues op naam.

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">08</span></div>

Note: Gagné 2 — leerdoelen communiceren. Het eerste doel hebben jullie net al gedeeltelijk gedaan: beoordelen met bewijs en onderbouwen richting de klant. Bewust staan de doelen hier pas na de zelfevaluatie: het probleem moesten jullie eerst zelf zien. Koppel de vier doelen aan de stappen op de volgende slide. Het laatste doel is meetbaar: om 01:45 kijk ik in jullie repo of het er staat.

---

<p class="kicker">Vandaag · De triage in vier stappen</p>

## Zo trekken we elk project vandaag in 2 uur vlot

<div class="rows">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Zelfevaluatie &amp; de nieuwe MVP</h3><p>Het bewijs op <code>main</code> laat zien wat haalbaar is; schrap de ballast in <code>02-define.md</code>.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Dubbele Fist-to-Five</h3><p>Stand-up en peiling op zowel <em>Docs</em> als <em>Code</em> — op basis van de bewijscheck.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Categorie A of Categorie B</h3><p>Geforceerd parallel werken (70 min) op basis van jullie specifieke achterstand.</p></div></div>
  <div class="listrow fragment"><span class="n">04</span><div><h3>De PR-Exit-Ticket</h3><p>Niemand verlaat het lokaal zonder 1 gemergde Code-PR, 1 gemergde Docs-PR en 3 toegewezen huiswerk-issues.</p></div></div>
</div>

**Het ritme van vandaag:** Eerlijk meten → Werk splitsen → Parallel bouwen → Bewijzen op `main`.

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">09</span></div>

Note: Het overzicht van de rest van de les, stap voor stap per klik. Eén: de zelfevaluatie is gedaan; nu leggen we de nieuwe MVP vast in 02-define.md. Twee: korte stand-up plus de dubbele Fist-to-Five, gebaseerd op de bewijscheck. Drie: elk team werkt in Categorie A of B — 70 minuten parallel. Vier: de exit-ticket. Sluit af met het ritme onderaan. Tijd scope-gesprek (slides 5–9): 00:15–00:25.

---

<p class="kicker">Stap 1 · Scope reductie in 02-define.md</p>

## Kwaliteit en Git-workflow wegen zwaarder dan kwantiteit

<div class="cards cards--moscow">
  <div class="glr-card glr-card--accent">
    <span class="k">Must have · Ondergrens voor een GO</span>
    <ul class="tight">
      <li><strong>MySQL Database:</strong> werkende tabel <code>recepten</code> + geëxporteerd <code>database.sql</code> in de repo.</li>
      <li><strong>Overzicht &amp; Detail (<code>READ</code>):</strong> recepten dynamisch uit MySQL op <code>index.php</code>, doorklikken naar <code>detail.php?id=X</code>.</li>
      <li><strong>Filter (<code>SELECT WHERE</code>):</strong> filteren op minstens één Gen-Z eis (bijv. bereidingstijd <code>&lt; 20 min</code> of categorie).</li>
      <li><strong>Toevoegen (<code>CREATE</code>):</strong> formulier dat via een <code>INSERT</code>-query een nieuw recept opslaat.</li>
      <li><strong>Responsive &amp; Git Golden Path:</strong> mobiel bruikbaar én alle code via gereviewde PR's op <code>main</code>.</li>
    </ul>
  </div>
  <div class="glr-card">
    <span class="k">Should / Could · 7,5 tot 10</span>
    <ul class="tight">
      <li>Recepten aanpassen (<code>UPDATE</code>) en verwijderen (<code>DELETE</code>).</li>
      <li>Favorieten of boodschappenlijstje.</li>
      <li>Gecombineerde zoekfilters op meerdere ingrediënten.</li>
    </ul>
  </div>
  <div class="glr-card glr-card--muted">
    <span class="k">Won't have · Officieel geschrapt</span>
    <ul class="tight">
      <li>Volledig registratie- en inlogsysteem met sessies.</li>
      <li>Apart Administrator-dashboard voor gebruikersbeheer.</li>
      <li>Losse Word-verslagen of logboeken: <code>/docs/</code> + Kanban-bord + PR-historie ís je projectplan en logboek.</li>
    </ul>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">10</span></div>

Note: Gagné 4 — inhoud presenteren. Dit is de nieuwe MoSCoW waar de klant mee akkoord is. Links de ondergrens: zonder deze vijf punten geen GO en geen voldoende. Let op het laatste Must-punt — de Git Golden Path is net zo hard als de code zelf (de vaste kwaliteitshoek van de driehoek). Midden: wie dat op orde heeft, scoort hoger met UPDATE/DELETE, favorieten of gecombineerde filters. Rechts: officieel geschrapt — geen inlogsysteem, geen admin-dashboard, geen losse Word-verslagen. Vergelijk dit met jullie bewijscheck: hoeveel van deze vijf staan er al? Opdracht: werk deze MoSCoW vandaag bij in 02-define.md.

---

<p class="kicker">Stap 2 · Daily stand-up &amp; management sync</p>

## Waar staat jullie team op dit moment echt?

<div class="grid2">
  <div class="glr-card">
    <span class="k">Eerst in je team · 3 min Daily Stand-up</span>
    <ul class="tight">
      <li>Wat heb ik vorige les en thuis gecommit?</li>
      <li>Welk issue op het bord pak ik nu op?</li>
      <li>Welke PR staat nog open voor review?</li>
    </ul>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Daarna Scrum Masters naar voren · Dubbele Fist-to-Five</span>
    <div class="scale" aria-label="Schaal van 0 (vuist, stilstand) tot 5 (klaar voor GO)"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
    <ul class="tight">
      <li><strong>Peiling 1 · Docs &amp; Plan:</strong> <code>01-empathize.md</code> t/m <code>04-prototype.md</code> + ERD en wireframes in <code>/docs/assets/</code>.</li>
      <li><strong>Peiling 2 · PHP &amp; MySQL:</strong> de database-koppeling en dynamische pagina's.</li>
      <li><strong>Baseer je vingers op de bewijscheck</strong> (A en B), niet op gevoel.</li>
    </ul>
  </div>
</div>

<div class="defbox fragment">
  <span class="k">Op basis van deze twee scores</span>
  <p>deelt de docent jullie team direct in <strong>Categorie A</strong> of <strong>Categorie B</strong> in.</p>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">11</span></div>

Note: Eerst drie minuten stand-up aan tafel met de drie vragen. Daarna komen alle Scrum Masters naar voren. Op jouw teken steken ze tegelijk hun vingers op: 0 is een vuist (stilstand), 5 is klaar voor GO. Twee rondes: eerst docs en plan, dan PHP en MySQL. Belangrijk: de vingers volgen uit de bewijscheck (A voor docs, B voor code), niet uit het gevoel. Tegelijk opsteken voorkomt dat teams naar elkaar kijken. Noteer de scores; de volgende slide laat zien welk categorie daarbij hoort. Tijd slides 10–14: 00:25–00:35.

---

<p class="kicker">Stap 2 · Van score naar categorie</p>

## Jullie twee scores bepalen in welk categorie je vandaag werkt

<div class="matrix">
  <div class="mx-y">Docs<br>hoog</div>
  <div class="mx-cell mx-a"><span class="k">Docs op orde · code achter</span><h3>Categorie A</h3><p>Drie developers bouwen PHP/MySQL.</p></div>
  <div class="mx-cell mx-ghost"><span class="k">Beide op koers</span><h3>Docent beslist</h3><p>Korte huddle met de docent.</p></div>
  <div class="mx-y">Docs<br>laag</div>
  <div class="mx-cell mx-ghost"><span class="k">Beide achter</span><h3>Docent beslist</h3><p>Korte huddle met de docent.</p></div>
  <div class="mx-cell mx-b"><span class="k">Code loopt · docs achter</span><h3>Categorie B</h3><p>Twee op docs, één lead dev.</p></div>
  <div></div>
  <div class="mx-x">Code laag</div>
  <div class="mx-x">Code hoog</div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">12</span></div>

Note: Gagné 7 — feedback op de peiling. Zet de scores van elk team in deze matrix: verticaal de docs-score, horizontaal de code-score (3 of hoger = hoog). Docs hoog en code laag: Categorie A. Docs laag en code hoog: Categorie B. Staan beide hoog of beide laag? Dan beslis je zelf in een korte huddle met dat team. Noem per team hardop het categorie, zodat elk team weet waar het aan toe is.

---

<p class="kicker">Stap 3 · Parallel werken afdwingen</p>

## Niemand kijkt vandaag met drie man naar één scherm

<div class="grid2">
  <div class="glr-card glr-card--warn">
    <span class="k">De valkuil · Tijdverspilling</span>
    <ul class="tight">
      <li>Met z'n drieën achter één laptop meekijken hoe één iemand typt.</li>
      <li>Wachten tot het ontwerp "helemaal perfect" is in Figma voordat de database wordt gebouwd.</li>
      <li>Eind van de les: nul Pull Requests gemerged en vage afspraken voor thuis.</li>
    </ul>
  </div>
  <div class="glr-card glr-card--accent fragment">
    <span class="k">De sprint-aanpak vandaag · 3 developers = 3 branches</span>
    <ul class="tight">
      <li>Elk teamlid heeft een eigen taak, een eigen issue en een eigen branch (<code>feature/...</code> of <code>docs/...</code>).</li>
      <li>Ontbrekende ERD's of wireframes mogen vandaag op papier/whiteboard en als scherpe foto in <code>/docs/assets/</code> (kost 15 minuten).</li>
      <li>Eind van de les: keihard bewijs op <code>main</code> via gemergde Pull Requests.</li>
    </ul>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">13</span></div>

Note: Gagné 5 — non-voorbeeld vóór voorbeeld. Vraag eerst: wie herkent links iets uit het eigen team? Meestal gaan er handen omhoog. Klik dan naar rechts: drie developers is drie branches. Benadruk de shortcut: een ontbrekend ERD of wireframe hoeft niet in Figma — een scherpe foto van een whiteboardschets in /docs/assets/ is vandaag goed genoeg en kost een kwartier.

---

<p class="kicker">Stap 3 · Taakverdeling voor de komende 70 minuten</p>

## Elke developer pakt nu direct de eigen rol op

<div class="grid2">
  <div class="glr-card">
    <span class="k">Categorie A · Docs op orde, achterstand met bouwen</span>
    <div class="role"><h4>Developer 1 · Database &amp; Back-end</h4><p>Tabel <code>recepten</code> uit het ERD, <code>db.php</code>, 3 testrecepten, <code>database.sql</code> in de repo → PR.</p></div>
    <div class="role"><h4>Developer 2 · Front-end UI</h4><p>Responsive HTML/CSS voor <code>index.php</code> en <code>create.php</code> op een eigen branch → PR.</p></div>
    <div class="role"><h4>Developer 3 · Scrum &amp; Integratie</h4><p>Bouw-issues op het bord, <code>.gitignore</code> + <code>CODEOWNERS</code> checken, met Dev 1 de eerste <code>SELECT</code>.</p></div>
  </div>
  <div class="glr-card">
    <span class="k">Categorie B · Wel code, onvolledig projectplan/docs</span>
    <p class="rule">Regel: vandaag verboden om met z'n drieën aan de code te werken!</p>
    <div class="role"><h4>Teamlid 1 · Docs 1 &amp; 2</h4><p><code>01-empathize.md</code> en <code>02-define.md</code> (nieuwe MoSCoW) bijwerken in korte bullets → PR.</p></div>
    <div class="role"><h4>Teamlid 2 · Docs 3 &amp; 4 + Assets</h4><p><code>03-ideate.md</code> en <code>04-prototype.md</code> af, ERD + wireframes in <code>/docs/assets/</code> → PR.</p></div>
    <div class="role"><h4>Teamlid 3 · Lead Dev</h4><p>Bouwt als enige door aan PHP/MySQL én reviewt en merget vandaag beide docs-PR's.</p></div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">14</span></div>

Note: Elk team weet nu of het A of B is. Laat ze binnen één minuut de rollen verdelen en elk lid een issue op het bord claimen. Categorie A in detail — Developer 1: maakt de MySQL-tabel recepten aan op basis van het ERD, bouwt db.php, voert 3 testrecepten in, exporteert database.sql naar de repo en opent een PR. Developer 2: bouwt op een eigen branch de responsive HTML/CSS voor de overzichtspagina (index.php) en het toevoeg-formulier (create.php) en opent een PR. Developer 3: zet alle ontbrekende bouw-issues op het Kanban-bord, controleert .gitignore en CODEOWNERS en koppelt samen met Dev 1 de eerste SELECT-query. Categorie B — Teamlid 1: werkt 01-empathize.md en 02-define.md (met de nieuwe MoSCoW) compleet bij in korte, bondige bulletpoints en opent een PR. Teamlid 2: maakt 03-ideate.md en 04-prototype.md af, plaatst het ERD en de wireframes in /docs/assets/ (export of scherpe foto van een schets) en opent een PR. Teamlid 3: bouwt als enige door aan PHP/MySQL en reviewt en merget verplicht de twee documentatie-PR's. Loop in de eerste vijf minuten langs: zitten er drie mensen aan dezelfde code in Categorie B? Direct ingrijpen.

---

<p class="kicker">Stap 4 · Harde oplevering · Laat om 01:45 je repo zien</p>

## Niemand verlaat het lokaal zonder de PR&#8209;Exit&#8209;Ticket

<div class="rows rows--tight">
  <div class="listrow fragment"><span class="n">01</span><div><h3>Minstens 1 gemergde Code-PR van vandaag</h3><p>Nieuw PHP-, SQL- of HTML/CSS-werk dat gereviewd en gemerged is naar <code>main</code>.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Minstens 1 gemergde Docs-PR van vandaag</h3><p>Aangevulde Markdown-bestanden of assets in <code>/docs/</code> die gereviewd en gemerged zijn naar <code>main</code>.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>3 individuele huiswerk-issues op naam</h3><p>Elk teamlid wijst zichzelf op het Project-bord <strong>één specifiek issue</strong> toe dat vóór Les 2 (de 3-uursles) thuis af is.</p></div></div>
</div>

<div class="defbox defbox--alert defbox--sm">
  <span class="k">Consequentie · Start Les 2</span>
  <p>We openen per groep de tabbladen <em>Pull Requests</em> en <em>Contributors</em>. Geen huiswerk-PR klaargezet? Dan telt dat direct mee voor <strong>B1-K1-W1 (Samenwerken)</strong> en past de Scrum Master de sanctie uit <code>TEAM.md</code> toe.</p>
</div>

<p class="small" style="margin-top:14px"><strong>Op stage:</strong> een scope-wijziging vraag je aan mét bewijs en in overleg, nooit stilletjes.</p>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">15</span></div>

Note: Gagné 8 — prestatie beoordelen, vooraf aangekondigd. Drie aftekenpunten, per klik: één gemergde code-PR, één gemergde docs-PR, en drie huiswerk-issues op naam. Wees helder over de consequentie: aan het begin van Les 2 kijken we per groep naar de tabbladen Pull Requests en Contributors. Wie het huiswerk-issue niet via een PR heeft klaargezet, merkt dat in de individuele beoordeling op B1-K1-W1 en krijgt de sanctie die het team zelf in TEAM.md heeft afgesproken. Gagné 9 — transfer: noem de regel onderaan. Vraag bij het aftekenen aan elk team: waar ga je dit op je stageplek tegenkomen?

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="row">
  <div class="col" style="flex:1 1 66%">
    <div class="bar bar--thin"></div>
    <p class="kicker kicker--lime">Aan de slag · Sprint timer: 70 minuten</p>
    <h2 class="title title--sm">Eén issue, één branch, één doel. Start nu.</h2>
    <div class="rows rows--tight">
      <div class="listrow listrow--time"><span class="n">00:25 – 00:35</span><div><h3>Stand-up &amp; Sync</h3><p>3 min stand-up aan tafel → Scrum Masters direct naar voren voor de dubbele <em>Fist-to-Five</em>.</p></div></div>
      <div class="listrow listrow--time"><span class="n">00:35 – 01:45</span><div><h3>Parallelle Sprint (70 min)</h3><p><strong style="color:#fff">Categorie A</strong> (MySQL + PHP) of <strong style="color:#fff">Categorie B</strong> (2 op Docs, 1 op Code). Elke taak op een eigen branch!</p></div></div>
      <div class="listrow listrow--time"><span class="n">Vastgelopen?</span><div><h3>Tech Huddle</h3><p>Langer dan 15 minuten vast op een SQL-query of PHP-fout? Vraag direct een korte <em>Tech Huddle</em> aan bij de docent.</p></div></div>
      <div class="listrow listrow--time"><span class="n">01:45 – 02:00</span><div><h3>Exit-Ticket &amp; vooruitblik</h3><p>Toon jullie <strong style="color:#fff">gemergde Code-PR + Docs-PR</strong> van vandaag én de <strong style="color:#fff">3 huiswerk-issues</strong> op naam voor Les 2.</p></div></div>
    </div>
  </div>
  <div class="col" style="flex:1 1 34%">
    <div class="timer timer--lg" data-timer="70:00" role="group" aria-label="Sprint-timer 70 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">70:00</span><span class="t-label">Sprint</span></div>
      </div>
      <div class="t-btns">
        <button class="t-btn t-start" type="button">Start</button>
        <button class="t-btn t-reset" type="button">Reset</button>
      </div>
    </div>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">16</span></div>

Note: Deze slide blijft het hele werkblok op het scherm staan. Start de timer om 00:35, zodra de categories zijn ingedeeld. Herhaal de vier afspraken: stand-up gedaan, 70 minuten parallel op eigen branches, na 15 minuten vastlopen een Tech Huddle aanvragen, en om 01:45 het exit-ticket aftekenen. De slides hierna (roadmap, video-eisen, script en beoordeling) zijn de vooruitblik voor het exit-ticketvenster van 01:45 tot 02:00. Vervolgstap voor thuis: het eigen huiswerk-issue via een PR klaarzetten vóór Les 2.

---

<p class="kicker">Vooruitblik · De laatste 10 lesuren</p>

## Van Triage naar Video-oplevering in vier gerichte sprints

<div class="cards">
  <div class="glr-card glr-card--accent">
    <span class="pill" style="background:#111;color:#A6E22E">Vandaag · 2 uur</span>
    <h3>Les 1 · Triage &amp; Parallelle Sprint</h3>
    <ul class="tight">
      <li>Zelfevaluatie en scope reset naar MVP.</li>
      <li>Opsplitsen in Categorie A of B.</li>
      <li>Exit-ticket: 1 Code-PR + 1 Docs-PR gemerged + huiswerk op naam.</li>
    </ul>
  </div>
  <div class="glr-card">
    <span class="pill pill--ghost">Deze week · 3 uur</span>
    <h3>Les 2 · Grote PHP/MySQL Integratie</h3>
    <ul class="tight">
      <li>Start: huiswerk-audit op GitHub.</li>
      <li>Focus: <code>SELECT</code>, <code>WHERE</code> en <code>INSERT</code>.</li>
      <li>Vastgelopen teams lenen 20 min een back-end dev.</li>
      <li><strong>Einde: freeze op Docs 01 t/m 04.</strong></li>
    </ul>
  </div>
  <div class="glr-card">
    <span class="pill pill--ghost">Volgende week · 2 uur</span>
    <h3>Les 3 · Peer Testing &amp; Bugfixing</h3>
    <ul class="tight">
      <li>30 min wissel-test: 3 studenten uit een ander team testen jullie app; vul live <code>05-test.md</code> in.</li>
      <li>Testpunten → drie <code>fix/...</code>-branches: bugs + responsive.</li>
    </ul>
  </div>
  <div class="glr-card">
    <span class="pill pill--ghost">Volgende week · 3 uur</span>
    <h3>Les 4 · Release Video &amp; Eindoplevering</h3>
    <ul class="tight">
      <li>Uur 1: laatste PR's, definitieve <code>database.sql</code>, repo schoon (<code>.gitignore</code>).</li>
      <li>Uur 2: <strong>4-minuten Release Video</strong> opnemen (link in <code>README.md</code>).</li>
      <li>Uur 3: <code>REFLECTIE-NAAM.md</code> via laatste PR.</li>
    </ul>
  </div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">17</span></div>

Note: Vooruitblik — toon tijdens het exit-ticketvenster (01:45–02:00). De roadmap tot de eindstreep. Vandaag de triage. Les 2 is de grote integratieles: we beginnen met de huiswerk-audit, daarna SELECT, WHERE en INSERT; teams die vastlopen lenen twintig minuten een back-end developer van een ander team. Aan het eind van Les 2 gaan de docs 01 t/m 04 op slot. Les 3: wisseltest met een ander team, testpunten worden fix-branches. Les 4: opschonen, de video opnemen en de individuele reflectie inleveren.

---

<p class="kicker">Vooruitblik Les 4 · Vervanging van de live presentatie</p>

## Geen presentatiestress voor de klas, </br >wél strenge eisen aan jullie video

<p class="lede" style="margin-top:12px"><span class="pill">Onvoldoende kwaliteit = Geen GO</span> &nbsp;Drie niet-onderhandelbare eisen.</p>

<div class="rows rows--tight">
  <div class="listrow fragment"><span class="n">01</span><div><h3>1080p schermopname &amp; 125%–150% zoom</h3><p>Neem je scherm op met OBS Studio, Loom of Teams. <strong>Verboden</strong> om met een telefoon een laptopscherm te filmen! Zoom browser en VS Code in op <strong>125% tot 150%</strong> zodat code en GitHub-tekst direct leesbaar zijn.</p></div></div>
  <div class="listrow fragment"><span class="n">02</span><div><h3>Alle 3 de teamleden helder verstaanbaar</h3><p>Elk teamlid spreekt minimaal 60 seconden en demonstreert het eigen gebouwde onderdeel. Rustige audio, geen ruis of achtergrondmuziek.</p></div></div>
  <div class="listrow fragment"><span class="n">03</span><div><h3>Strak 4:00 minuten — nul gestuntel</h3><p>Zet vóór de opname de 4 verplichte tabbladen klaar (GitHub, werkende web-app, phpMyAdmin en VS Code). Zoek tijdens de opname niet naar bestanden of wachtwoorden. Zet de videolink helemaal bovenaan in <code>README.md</code>.</p></div></div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">18</span></div>

Note: Vooruitblik op Les 4, zodat iedereen er vanaf vandaag naartoe werkt. Geen live presentatie meer voor de klas, maar wel drie harde eisen. Eén: een echte schermopname in 1080p, ingezoomd op 125 tot 150 procent — een telefoon die een laptopscherm filmt wordt direct afgekeurd. Twee: alle drie de teamleden zijn minstens een minuut te horen en laten het eigen werk zien. Drie: exact vier minuten, alle tabbladen vooraf klaar, en de link bovenaan in de README.

---

<p class="kicker">Vooruitblik Les 4 · Het verplichte video-script</p>

## Wat laten jullie per minuut zien in de Release Video?

<div class="rows rows--tight">
  <div class="listrow listrow--time fragment"><span class="n">00:00 – 00:45</span><div><h3>Deel 1 · Concept &amp; Design Oogst <span class="small">· Teamlid 1 / Scrum Master</span></h3><p>Toon kort de <code>/docs/</code>-map in GitHub, benoem jullie Gen-Z probleemstelling (POV) en laat het ERD en het visuele prototype zien.</p></div></div>
  <div class="listrow listrow--time fragment"><span class="n">00:45 – 02:15</span><div><h3>Deel 2 · Live demo van de kook-app <span class="small">· Teamlid 2 / Front-end</span></h3><p>Toon de overzichtspagina en schakel in DevTools kort naar <em>Mobile View</em>. Voer live een filter uit, klik door naar een detailpagina én voeg live een recept toe.</p></div></div>
  <div class="listrow listrow--time fragment"><span class="n">02:15 – 03:15</span><div><h3>Deel 3 · Onder de motorkap: PHP &amp; MySQL <span class="small">· Teamlid 3 / Back-end</span></h3><p>Toon in phpMyAdmin dat het nieuwe recept echt in de tabel staat. Laat in VS Code één belangrijk stuk PHP/SQL zien (bijv. de <code>INSERT</code>- of filter-query) en leg uit hoe het werkt.</p></div></div>
  <div class="listrow listrow--time fragment"><span class="n">03:15 – 04:00</span><div><h3>Deel 4 · Bewijs van Agile &amp; Git-workflow <span class="small">· Samen</span></h3><p>Toon het Project-bord (<code>Done</code>-kolom), de gesloten Pull Requests en open één PR waarin jullie elkaars code hebben gereviewd.</p></div></div>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">19</span></div>

Note: Het script ligt vast, zodat niemand hoeft te improviseren. Elk deel heeft een eigenaar. Deel 1: de Scrum Master laat de docs-map, de POV, het ERD en het prototype zien. Deel 2: de front-ender doet de live demo inclusief Mobile View, filter, detailpagina en een nieuw recept. Deel 3: de back-ender laat zien dat dat recept in phpMyAdmin staat en legt één query uit. Deel 4 samen: bord, gesloten PR's en een PR met echte review. Tip: oefen het script één keer met een timer vóór de echte opname.

---

<p class="kicker">Vooruitblik · Beoordeling &amp; individuele inzet</p>

## Hoe word je over twee weken beoordeeld?

<div class="grid2">
  <div class="glr-card">
    <span class="k">Groepsscore · Product &amp; documentatie</span>
    <div class="role"><h4><span class="pill pill--ghost">B1-K1-W2</span> <span class="pill pill--ghost">B1-K2-W2</span> Projectplan &amp; ontwerpkeuzes</h4><p>Compleetheid van <code>TEAM.md</code>, <code>01-empathize.md</code> t/m <code>05-test.md</code>, ERD, wireframes en het GitHub Kanban-bord.</p></div>
    <div class="role"><h4><span class="pill pill--ghost">B1-K1-W3</span> Kwaliteit &amp; klanteisen</h4><p>Werkende PHP/MySQL MVP (of extra bonus-features), schone repository (<code>.gitignore</code>), naleving van de PR-workflow en de 4-minuten Release Video.</p></div>
  </div>
  <div class="glr-card glr-card--accent">
    <span class="k">Individuele correctie · B1-K1-W1 Samenwerken &amp; bijdrage</span>
    <ul class="tight">
      <li>In Les 4 levert elk teamlid via een eigen PR het bestand <code>REFLECTIE-[JOUWNAAM].md</code> in.</li>
      <li>Daarin plak je de directe links naar <strong>jouw 3 belangrijkste Pull Requests</strong> en verdeel je 100 waarderingspunten over de 3 teamleden.</li>
    </ul>
  </div>
</div>

<div class="defbox defbox--alert defbox--sm">
  <span class="k">Let op</span>
  <p>Wie geen eigen commits en PR's in de GitHub-historie heeft staan, kan het vak niet behalen op het werk van groepsgenoten.</p>
</div>

<div class="footer"><span>Beroeps 2 · Eindsprint</span><span class="num">20</span></div>

Note: Transparantie over de beoordeling. Links de groepsscore: projectplan en ontwerpkeuzes (W2-werkprocessen) en kwaliteit en klanteisen (W3). Rechts de individuele correctie op samenwerken: de reflectie met jouw drie belangrijkste PR's en de verdeling van 100 punten over het team. Sluit af met de harde regel: de GitHub-historie is het bewijs — net als bij de bewijscheck aan het begin van de les. Geen eigen commits en PR's betekent niet slagen op het werk van een ander.

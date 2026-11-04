<!-- frontmatter
title: "Input velden"
cohort: "2026-2027"
leerjaar: 1
periode: 1
auteur: "Docententeam CSD"
tags: ["Interface1", "HTML", "Formulieren", "form", "input", "label", "textarea", "select", "GET en POST", "JavaScript", "Events"]
-->

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:150px"></div>
<p class="kicker kicker--lime">Interface1 · Hoofdstuk 5 · Creative Software Developer</p>
<h1 class="title title--xl" style="color:#fff">Input velden</h1>
<p class="lede" style="color:#EDEDED;font-size:30px">Van een leeg formulier naar een pagina die live reageert op wat jij typt.</p>
<div class="footer"><span>Interface1 · Input velden</span><span class="num">01</span></div>

Note: Welkom. Tot nu toe hebben jullie pagina's gebouwd die iets laten zien. Vandaag draaien we het om: de gebruiker geeft óns informatie. Rode draad (ABT): bijna alles wat je op een website invult gaat via een formulier, EN daar zijn kant-en-klare HTML-tags voor, MAAR een slordig formulier frustreert gebruikers en stuurt de verkeerde data door, DAAROM leer je vandaag hoe je een formulier goed opbouwt en hoe je met JavaScript live op invoer reageert. Laat deze slide staan terwijl studenten binnenkomen.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:60px"></div>
<p class="kicker kicker--lime">Even nadenken · Denk – deel · 1 minuut</p>
<p class="big-q">Waar heb jij vandaag al iets ingevuld op een website of app?</p>
<p class="lede" style="font-size:28px;max-width:900px;margin-top:26px">Noem er twee aan je buur. Wat moest je invullen, en hoe zag dat veld eruit?</p>
<div class="footer"><span>Interface1 · Input velden</span><span class="num">02</span></div>

Note: Gagné 1 en 3: aandacht en voorkennis. Eén minuut met je buur, haal daarna 3 à 4 voorbeelden op. Vaak genoemd: inloggen, zoeken op YouTube of Google, een bericht in een chat, adresgegevens bij een webshop, je aanmelden voor een nieuwsbrief. Vraag door op de vorm: was het een klein veld, een groot tekstvak, een lijstje om uit te kiezen, een kalendertje? Die verschillen zijn precies wat we vandaag leren bouwen.

---

<p class="kicker">Lesdoelen</p>

## Aan het einde van deze les kun je …

1. **uitleggen** wat `<form>`, `<input>`, `<label>`, `<textarea>` en `<select>` doen;
2. een formulier **bouwen** met passende input types en attributen zoals `required` en `readonly`;
3. **aantonen** wat het verschil is tussen `method="get"` en `method="post"`;
4. met `addEventListener` en `event.target.value` de invoer **uitlezen** en live op de pagina **tonen**.

<div class="footer"><span>Interface1 · Input velden</span><span class="num">03</span></div>

Note: Gagné 2: doelen. Van begrijpen (doel 1) via toepassen (doel 2 en 4) naar analyseren (doel 3: je toont het verschil zelf aan in opdracht 5.B). Elk doel komt terug in een opdracht: 5.A voor doel 1 en 2, 5.B voor doel 3, 5.C voor doel 4.

---

<p class="kicker">Route</p>

## Eerst de bouwstenen, dan zelf bouwen, dan JavaScript

<div class="rows rows--tight">
  <div class="listrow"><span class="n">5.1</span><div><h3>Formulieren: form, input en label</h3><p>Wat doet elke tag, en welke attributen heb je echt nodig?</p></div></div>
  <div class="listrow"><span class="n">5.2</span><div><h3>Opdracht 5.A: je eerste formulier</h3><p>Starten met een stukje code en dat in zes stappen uitbreiden.</p></div></div>
  <div class="listrow"><span class="n">5.3</span><div><h3>Input types</h3><p>Hoe het type bepaalt wat de browser je laat zien.</p></div></div>
  <div class="listrow"><span class="n">5.4</span><div><h3>Speciale velden: textarea en select · opdracht 5.B</h3><p>Lange tekst, vaste keuzes, en verzenden met GET en POST.</p></div></div>
  <div class="listrow"><span class="n">5.5</span><div><h3>Input velden en JavaScript · opdracht 5.C</h3><p>Een kop die live meeverandert met wat je typt.</p></div></div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">04</span></div>

Note: De nummers volgen de paragrafen in de reader (hoofdstuk 5), zodat studenten thuis makkelijk kunnen terugbladeren. Kort doorlopen, niet uitweiden.

---

<p class="kicker">5.1 · Formulieren</p>

## Een formulier bestaat uit een form met labels en inputs

<div class="row" style="margin-top:8px">
<div class="col code-sm" style="flex:1 1 62%">

```html [1,7|2,4|3,5|6]
<form>
  <label for="voornaam">Voornaam:</label><br>
  <input type="text" id="voornaam" name="voornaam"><br>
  <label for="achternaam">Achternaam:</label><br>
  <input type="text" id="achternaam" name="achternaam"><br><br>
  <input type="submit" value="Verstuur">
</form>
```

</div>
<div class="col" style="flex:1 1 38%">
<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">index.html</span></div>
  <div class="browser__body">
    <form data-page="index.html">
      <label for="d51-voornaam">Voornaam:</label><br>
      <input type="text" id="d51-voornaam" name="voornaam"><br>
      <label for="d51-achternaam">Achternaam:</label><br>
      <input type="text" id="d51-achternaam" name="achternaam"><br><br>
      <input type="submit" value="Verstuur">
    </form>
  </div>
</div>
<p class="small" style="margin-top:14px">Dit is een echt formulier. Vul het in en klik op Verstuur.</p>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">05</span></div>

Note: Gagné 4: inhoud. Loop met de pijltjes door de code. Stap 1: het form-element is de ouder (parent) van alle invoervelden. Stap 2: de label-tags, de tekst bij een veld. Stap 3: de input-tags, de velden zelf. Stap 4: een input met type submit is de verstuurknop. De br-tags zijn niet belangrijk voor het formulier: zie ze als de enter in HTML (een nieuwe regel). Vul daarna live je naam in rechts en klik op Verstuur: kijk naar de adresbalk. Daar komen we zo op terug bij method.

---

<p class="kicker">5.1 · De form-tag</p>

## De `<form>`-tag is de ouder van al je invoervelden

```html
<form action="betalen.php" method="post" autocomplete="on" novalidate>
```

<div class="cards">
  <div class="glr-card fragment"><span class="k">action</span><h3>Waarheen?</h3><p>De URL waar de gegevens naartoe gaan. Bijvoorbeeld: na je adres invullen door naar de betaalpagina.</p></div>
  <div class="glr-card fragment"><span class="k">method</span><h3>Hoe?</h3><p>De manier van versturen: <code>get</code> of <code>post</code>. Het verschil zie je op de volgende slide.</p></div>
  <div class="glr-card fragment"><span class="k">autocomplete</span><h3>Onthouden?</h3><p><code>on</code> of <code>off</code>: de browser stelt eerder ingevulde waarden voor, op basis van het <code>name</code>-attribuut.</p></div>
  <div class="glr-card fragment"><span class="k">novalidate</span><h3>Niet controleren</h3><p>De browser checkt de <code>required</code>-velden niet meer. Geen waarde nodig: alleen het woord is genoeg.</p></div>
</div>

<p class="small" style="margin-top:18px">Alle attributen uitproberen? <a href="https://www.w3schools.com/tags/tag_form.asp">W3Schools: de form-tag</a></p>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">06</span></div>

Note: In het eerste voorbeeld had de form-tag geen attributen, maar in de praktijk heb je ze wel nodig. Onthul de vier kaarten één voor één. Action: de webshop-analogie, je wilt na het opslaan van je adres naar de betaalpagina, niet op dezelfde pagina blijven. Method: zo meteen in een demo. Autocomplete: het lijstje met eerder ingevulde waarden dat je browser toont; dat werkt via het name-attribuut. Novalidate: handig tijdens het testen; het werkt zonder waarde, net als required.

--

<p class="kicker">5.1 · method</p>

## Met GET zie je de gegevens terug in de URL, met POST niet

<div class="grid2" style="margin-top:6px">
<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">webshop.nl/bestelling</span></div>
  <div class="browser__body">
    <form method="get" data-page="webshop.nl/bestelling">
      <p style="font-weight:700;margin-bottom:6px">method="get"</p>
      <div class="field"><label for="dget-order">Ordernummer</label><input type="text" id="dget-order" name="orderId" value="1234" style="width:140px"></div>
      <div class="field"><label for="dget-klant">Klantnummer</label><input type="text" id="dget-klant" name="clientId" value="2345" style="width:140px"></div>
      <input type="submit" value="Verstuur">
    </form>
  </div>
</div>
<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">webshop.nl/bestelling</span></div>
  <div class="browser__body">
    <form method="post" data-page="webshop.nl/bestelling">
      <p style="font-weight:700;margin-bottom:6px">method="post"</p>
      <div class="field"><label for="dpost-order">Ordernummer</label><input type="text" id="dpost-order" name="orderId" value="1234" style="width:140px"></div>
      <div class="field"><label for="dpost-klant">Klantnummer</label><input type="text" id="dpost-klant" name="clientId" value="2345" style="width:140px"></div>
      <input type="submit" value="Verstuur">
    </form>
  </div>
  <div class="browser__post"></div>
</div>
</div>

<div class="defbox defbox--sm">
  <span class="k">Onthoud</span>
  <p><strong>GET</strong> zet de gegevens als <em>query parameters</em> achter de URL. <strong>POST</strong> stuurt ze onzichtbaar mee; die lees je uit met een script op de server. Dat doe je later dit jaar zelf met PHP.</p>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">07</span></div>

Note: Live demo. Klik eerst links op Verstuur: de adresbalk wordt ?orderId=1234&clientId=2345. Dat hebben studenten vast weleens gezien. Klik dan rechts: de URL blijft hetzelfde, en onder het venster zie je wat er onzichtbaar is meegestuurd. Vraag: welke methode zou je gebruiken voor een wachtwoord? (POST, anders staat het in je browsergeschiedenis.) Dit is ook de kern van opdracht 5.B, waar studenten het verschil zelf met een echte server testen.

---

<p class="kicker">5.1 · De input-tag</p>

## Met de `<input>`-tag maak je bijna elk soort invoerveld

```html
<input type="email" name="email" value="jan@voorbeeld.nl">
```

<div class="cards">
  <div class="glr-card fragment"><span class="k">name</span><h3>Voor de server</h3><p>De naam waaronder de server de waarde ontvangt. Zonder <code>name</code> wordt het veld niet meegestuurd.</p></div>
  <div class="glr-card fragment"><span class="k">type</span><h3>Voor de browser</h3><p>Wat voor informatie het is. De browser toont er een passend element bij, zoals een kleurkiezer bij <code>type="color"</code>.</p></div>
  <div class="glr-card fragment"><span class="k">value</span><h3>De waarde</h3><p>Niet verplicht. Handig voor een standaardwaarde, of om de inhoud met JavaScript te lezen en aan te passen.</p></div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">08</span></div>

Note: De input-tag is een van de eerste tags waarmee je in HTML interactiviteit kon maken, en is in de loop der jaren flink uitgebreid. Drie attributen gebruik je bijna altijd. Name: herinner aan de demo met GET, orderId en clientId in de URL zijn precies de name-attributen. Type: komt terug in 5.3 met een hele rij voorbeelden. Value: we gebruiken value straks in JavaScript, in opdracht 5.C.

--

<p class="kicker">5.1 · De input-tag</p>

## Met `required`, `readonly` en `disabled` bepaal je wat de gebruiker mag

<div class="row" style="margin-top:6px">
<div class="col" style="flex:1 1 52%">
<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">aanmelden.html</span></div>
  <div class="browser__body">
    <form data-page="aanmelden.html">
      <div class="field"><label for="dreq-email">E-mailadres</label><input type="email" id="dreq-email" name="email" required style="width:240px"></div>
      <div class="field"><label for="dreq-klant">Klantnummer</label><input type="text" id="dreq-klant" name="klantnummer" value="2345" readonly style="width:240px"></div>
      <div class="field"><label for="dreq-code">Kortingscode</label><input type="text" id="dreq-code" name="kortingscode" value="GLR10" disabled style="width:240px"></div>
      <input type="submit" value="Verstuur">
    </form>
  </div>
</div>
</div>
<div class="col" style="flex:1 1 48%">
<div class="rows rows--tight" style="margin-top:20px">
  <div class="listrow"><span class="n">01</span><div><h3>required</h3><p>Verplicht veld. Is het leeg of niet goed ingevuld, dan geeft de browser een foutmelding en wordt het formulier niet verstuurd.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>readonly</h3><p>De gebruiker kan de inhoud niet meer wijzigen.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>disabled</h3><p>Net als readonly, maar het veld wordt ook zichtbaar grijs.</p></div></div>
</div>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">09</span></div>

Note: Live demo. Klik in het klantnummer en probeer te typen: dat lukt niet (readonly). Het kortingscodeveld is grijs en kun je niet eens aanklikken (disabled). Klik op Verstuur met een leeg e-mailadres: de browser geeft een foutmelding (required). Typ "hallo" zonder @: weer een foutmelding, omdat het type email is. Vul nu NIET een geldig e-mailadres in en verstuur nog niet; dat bewaren we voor de check-in hierna.

---

<p class="kicker">Check-in · Peer Instruction · Stem met je vingers</p>

## Een veld moet zichtbaar zijn en worden meegestuurd, maar de gebruiker mag het niet aanpassen. Welk attribuut?

<div class="grid2 grid2--pi" style="gap:12px">
  <div class="glr-card"><span class="k">A</span><p><code>required</code></p></div>
  <div class="glr-card"><span class="k">B</span><p><code>readonly</code></p></div>
  <div class="glr-card"><span class="k">C</span><p><code>disabled</code></p></div>
  <div class="glr-card"><span class="k">D</span><p><code>novalidate</code></p></div>
</div>

<div class="defbox defbox--sm fragment">
  <span class="k">Antwoord · B</span>
  <p><code>readonly</code> blokkeert het wijzigen, maar de waarde gaat gewoon mee. Een <code>disabled</code> veld wordt <strong>niet</strong> meegestuurd. Check het zelf op de vorige slide.</p>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">10</span></div>

Note: Peer Instruction (Gagné 6 en 7). Iedereen denkt eerst stil na en stemt tegelijk met de vingers (1 = A t/m 4 = D). Is de klas verdeeld? Laat buren met een ander antwoord elkaar een minuut overtuigen, en stem opnieuw. Onthul dan B. De twijfel zit meestal tussen B en C: ze zien er bijna hetzelfde uit, maar er is één belangrijk verschil. Ga terug naar de vorige slide (pijltje omhoog), vul een geldig e-mailadres in en klik op Verstuur: in de adresbalk staan email en klantnummer, maar de kortingscode ontbreekt. A en D gaan over de controle bij verzenden, niet over wijzigen. Tijd: ±4 minuten.

---

<p class="kicker">5.1 · De label-tag</p>

## Met een label wordt de tekst ook klikbaar: `for` verwijst naar het `id`

<div class="row" style="margin-top:6px">
<div class="col code-sm" style="flex:1 1 55%">

```html [1|2]
<label for="voornaam">Wat is je voornaam?</label>
<input type="text" id="voornaam">
```

<div class="defbox defbox--sm">
  <span class="k">Zo koppel je ze</span>
  <p>De waarde van <code>for</code> is gelijk aan het <code>id</code> van het veld. Dan kun je op het veld én op de tekst klikken.</p>
</div>
<p class="small" style="margin-top:14px">Zelf proberen? <a href="https://www.w3schools.com/tags/tag_label.asp">W3Schools: de label-tag</a></p>
</div>
<div class="col" style="flex:1 1 45%">
<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">voorwaarden.html</span></div>
  <div class="browser__body">
    <p style="font-weight:700">Zonder label</p>
    <p style="margin:6px 0 18px"><input type="checkbox" id="dlbl-zonder" aria-label="Akkoord zonder label"> <span>Ik ga akkoord met de algemene voorwaarden</span></p>
    <p style="font-weight:700">Met label</p>
    <p style="margin-top:6px"><input type="checkbox" id="dlbl-met"> <label for="dlbl-met">Ik ga akkoord met de algemene voorwaarden</label></p>
  </div>
</div>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">11</span></div>

Note: Herkenbaar voorbeeld: je moet de algemene voorwaarden accepteren en precies op dat vakje van 20 bij 20 pixels klikken. Laat een student naar voren komen en eerst op de tekst bij "Zonder label" klikken: er gebeurt niets. Dan op de tekst bij "Met label": het vakje wordt aangevinkt. Het label heeft eigenlijk maar één belangrijk attribuut: for. Bonus om te noemen: een schermlezer leest het label voor als het veld focus krijgt, dus labels maken je formulier ook toegankelijker.

---

<p class="kicker">5.2 · Formulier maken · <span class="pill pill--ai">AI niet toegestaan</span></p>

## Opdracht 5.A · Begin met deze code en kijk naar de adresbalk

<div class="row" style="margin-top:4px">
<div class="col code-sm" style="flex:1 1 60%">

```html [8,13|9-10|12]
<html>
  <head>
    <title>HTML formulier</title>
  </head>

  <body>
    <h1>Welkom op mijn pagina</h1>
    <form method="get">
      <label for="voornaam">Voornaam:</label>
      <input type="text" id="voornaam" name="voornaam"><br>
      <br>
      <input type="submit" value="Verstuur formulier">
    </form>
  </body>
</html>
```

</div>
<div class="col" style="flex:1 1 40%">
<ul class="check">
  <li>Kopieer de code naar een eigen HTML-bestand in je projectmap.</li>
  <li>Open het bestand in de browser.</li>
  <li>Klik op de <strong>tekst</strong> Voornaam: wat gebeurt er?</li>
  <li>Vul je naam in en klik op Verstuur formulier.</li>
  <li>Kijk naar de adresbalk. Zie je <code>?voornaam=jouw-naam</code>?</li>
</ul>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">12</span></div>

Note: Gagné 6: oefening. AI is bij deze opdracht niet toegestaan: het gaat erom dat je de tags zelf leert typen en herkennen. Loop kort met de pijltjes door de code: het formulier met method get, het label met het veld, de verstuurknop. Laat studenten eerst deze vijf stappen doen voordat ze aan de uitbreiding beginnen (volgende slide, pijltje omlaag).

--

<p class="kicker">5.2 · Opdracht 5.A · Test na elke stap · <span class="pill pill--ai">AI niet toegestaan</span></p>

## Breid je formulier uit in zes stappen

<div class="rows rows--tight">
  <div class="listrow"><span class="n">01</span><div><h3>Achternaam</h3><p>Maak een tweede invoerveld voor je achternaam.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>E-mailadres</h3><p>Een derde veld, met <code>type="email"</code>.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>Voornaam verplicht</h3><p>Voeg <code>required</code> toe en test: verstuur het formulier met een leeg voornaamveld.</p></div></div>
  <div class="listrow"><span class="n">04</span><div><h3>Leeftijd</h3><p>Een vierde veld met de naam leeftijd en <code>type="number"</code>.</p></div></div>
  <div class="listrow"><span class="n">05</span><div><h3>Lievelingskleur</h3><p>Een vijfde veld met de naam kleur en <code>type="color"</code>; het label wordt "Lievelingskleur".</p></div></div>
  <div class="listrow"><span class="n">06</span><div><h3>Favoriete voetbalclub</h3><p>Een zesde veld met de naam voetbalclub. Bonus: geef het <code>readonly</code> en <code>value="feyenoord"</code>.</p></div></div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">13</span></div>

Note: Test na elke stap twee dingen: werkt het klikken op het label nog (is het juiste veld geselecteerd?), en komt het nieuwe veld mee in de adresbalk na het versturen? Een veld dat niet in de URL verschijnt mist meestal een name-attribuut. Snelle studenten: vergelijk wat je ziet bij number en color in Chrome en op je telefoon. Loop rond en kijk vooral naar for en id.

---

<p class="kicker">5.3 · Input types</p>

## Het type bepaalt welk invoerelement de browser laat zien

<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">input-types.html</span></div>
  <div class="browser__body">
    <div class="typegrid">
      <div class="tcell"><code>type="text"</code><input type="text" aria-label="Voorbeeld type text" placeholder="Tekst"></div>
      <div class="tcell"><code>type="email"</code><input type="email" aria-label="Voorbeeld type email" placeholder="naam@mail.nl"></div>
      <div class="tcell"><code>type="password"</code><input type="password" aria-label="Voorbeeld type password" value="geheim"></div>
      <div class="tcell"><code>type="number"</code><input type="number" aria-label="Voorbeeld type number" value="16"></div>
      <div class="tcell"><code>type="color"</code><input type="color" aria-label="Voorbeeld type color" value="#a6e22e"></div>
      <div class="tcell"><code>type="date"</code><input type="date" aria-label="Voorbeeld type date"></div>
      <div class="tcell"><code>type="range"</code><input type="range" aria-label="Voorbeeld type range"></div>
      <div class="tcell"><code>type="checkbox"</code><span class="opt"><input type="checkbox" id="dtype-cb"><label for="dtype-cb">Nieuwsbrief</label></span></div>
      <div class="tcell"><code>type="radio"</code><span class="opt"><input type="radio" name="dtype-r" id="dtype-r1"><label for="dtype-r1">Ja</label> <input type="radio" name="dtype-r" id="dtype-r2"><label for="dtype-r2">Nee</label></span></div>
      <div class="tcell"><code>type="file"</code><input type="file" aria-label="Voorbeeld type file"></div>
    </div>
  </div>
</div>

<p class="small" style="margin-top:16px">Op je telefoon krijg je bij <code>email</code> of <code>number</code> zelfs een ander toetsenbord. Alle types: <a href="https://www.w3schools.com/html/html_form_input_types.asp">W3Schools: HTML input types</a></p>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">14</span></div>

Note: Live demo: alles hierboven is echt, klik ze aan. Number geeft pijltjes om te verhogen en verlagen, color een kleurkiezer, date een kalender, password verbergt wat je typt. Het type is informatie voor de browser: die maakt er een passend element van. Er zijn er te veel om allemaal te behandelen; de rest staat op W3Schools. Vraag: welk type zou je gebruiken voor een geboortedatum? En voor een volume-schuif?

---

<p class="kicker">5.4 · Speciale invoervelden</p>

## Een `<textarea>` gebruik je voor tekst over meerdere regels

<div class="row" style="margin-top:6px">
<div class="col code-sm" style="flex:1 1 55%">

```html
<textarea name="opmerking" rows="4" cols="50"></textarea>
```

<div class="cards" style="margin-top:20px">
  <div class="glr-card"><span class="k">rows</span><p>Hoeveel regels hoog het veld is.</p></div>
  <div class="glr-card"><span class="k">cols</span><p>Hoe breed het veld is, in tekens. In de praktijk gebruik je hier liever CSS <code>width</code> voor.</p></div>
</div>
</div>
<div class="col" style="flex:1 1 45%">
<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">contact.html</span></div>
  <div class="browser__body">
    <label for="dta-opm">Opmerking:</label><br>
    <textarea id="dta-opm" name="opmerking" rows="4" style="width:100%;box-sizing:border-box">Hier mag je
best een paar
regels typen.</textarea>
  </div>
</div>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">15</span></div>

Note: Tot nu toe ging het over de input-tag. Twee andere tags zijn ook belangrijk in formulieren; dit is de eerste. Let op: textarea heeft, anders dan input, wél een sluit-tag. Wat tussen de tags staat is de begintekst. Live: typ in het vak, met enter krijg je een nieuwe regel. Dat kan in een gewoon input-veld niet.

--

<p class="kicker">5.4 · Speciale invoervelden</p>

## Met `<select>` en `<option>` laat je kiezen uit vaste opties

<div class="row" style="margin-top:6px">
<div class="col code-sm" style="flex:1 1 55%">

```html [1,8|2-7]
<select name="vervoersmiddel">
  <option value="lopen">Benenwagen</option>
  <option value="fiets">Fiets</option>
  <option value="scooter">Scooter</option>
  <option value="ov">Openbaar vervoer</option>
  <option value="motor">Motor</option>
  <option value="auto">Auto</option>
</select>
```

</div>
<div class="col" style="flex:1 1 45%">
<div class="browser">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">reis.html</span></div>
  <div class="browser__body">
    <form data-page="reis.html">
      <label for="dsel-vervoer">Hoe kom je naar school?</label><br>
      <select id="dsel-vervoer" name="vervoersmiddel" style="margin:8px 0 6px">
        <option value="lopen">Benenwagen</option>
        <option value="fiets">Fiets</option>
        <option value="scooter">Scooter</option>
        <option value="ov">Openbaar vervoer</option>
        <option value="motor">Motor</option>
        <option value="auto">Auto</option>
      </select><br>
      <input type="submit" value="Verstuur">
    </form>
  </div>
</div>
<div class="defbox defbox--sm">
  <span class="k">Let op</span>
  <p>De gebruiker ziet de tekst tussen de tags, de server krijgt de <code>value</code>.</p>
</div>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">16</span></div>

Note: De tweede speciale tag. Loop door de code: select is de buitenkant met de name, elke option is één keuze. Live: kies "Openbaar vervoer" en klik op Verstuur. In de adresbalk staat vervoersmiddel=ov, niet "Openbaar vervoer". De tekst is voor de gebruiker, de value voor de server.

---

<p class="kicker">Check-in · Bug hunt · Met je buur · 2 minuten</p>

## In dit formulier zitten drie fouten. Welke?

<div class="code-sm">

```html [|2-5]
<form action="https://sd-lab.nl/INTERFACE1/index.php" method="get">
  <label for="mail">E-mailadres</label>
  <input type="email" id="email" name="email">
  <textarea name="bericht" rows="4">
  <select>
    <option value="fiets">Fiets</option>
    <option value="ov">Openbaar vervoer</option>
  </select>
  <input type="submit" value="Verstuur">
</form>
```

</div>

<div class="cards" style="margin-top:16px">
  <div class="glr-card fragment"><span class="k">Regel 2–3</span><p><code>for="mail"</code> en <code>id="email"</code> zijn niet gelijk: klikken op het label doet niets.</p></div>
  <div class="glr-card fragment"><span class="k">Regel 4</span><p><code>&lt;/textarea&gt;</code> ontbreekt: de rest van het formulier verschijnt als tekst ín het tekstvak.</p></div>
  <div class="glr-card fragment"><span class="k">Regel 5</span><p>De <code>select</code> heeft geen <code>name</code>: de keuze wordt niet meegestuurd.</p></div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">17</span></div>

Note: Retrieval practice (Gagné 6 en 7) en voorbereiding op opdracht 5.B. Tweetallen zoeken twee minuten, zonder iets op te zoeken. Eerste klik: de verdachte regels lichten op. Daarna de drie fouten één voor één. Fout 2 verrast vaak: zonder sluit-tag ziet de browser alles na textarea als begintekst, dus ook de select en de knop. Fout 3 is dezelfde les als bij name op de input-slide: zonder name stuurt de browser het veld niet mee.

---

<p class="kicker">5.4 · Opdracht 5.B</p>

## Opdracht 5.B · Verstuur je formulier naar een echte server

```html
<form action="https://sd-lab.nl/INTERFACE1/index.php" method="get">
```

<div class="grid2">
  <div class="opcard">
    <span class="k">Bouwen</span>
    <ul class="check" style="margin-top:4px">
      <li>Een nieuw HTML-bestand met een formulier.</li>
      <li>4 velden: 1 <code>textarea</code>, 1 <code>select</code>, 1 verstuurknop en 1 veld naar keuze.</li>
      <li>Het <code>action</code>-attribuut wijst naar de server hierboven.</li>
    </ul>
  </div>
  <div class="opcard">
    <span class="k">Onderzoeken · eerst voorspellen, dan testen</span>
    <ul class="check" style="margin-top:4px">
      <li class="fragment">Wat gebeurt er als je het formulier verstuurt?</li>
      <li class="fragment">Verandert de URL met <code>method="get"</code>?</li>
      <li class="fragment">En wat gebeurt er met de URL bij <code>method="post"</code>?</li>
    </ul>
  </div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">18</span></div>

Note: Gagné 6: oefening, en lesdoel 3: studenten tonen het verschil tussen GET en POST zelf aan. Laat ze vóór het testen per vraag een voorspelling opschrijven; daarna testen ze het. De server op sd-lab.nl ontvangt het formulier echt. Bespreek klassikaal na: bij GET zie je alle names en waarden in de URL, bij POST niet. Vraag terug: welke van je vier velden zie je níet in de URL? (De verstuurknop, want die heeft geen name; of een veld waarbij ze de name vergeten zijn.)

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar" style="margin-top:20px"></div>
<p class="kicker kicker--lime">5.5 · Input velden en JavaScript · Weet je het nog?</p>

## Met `querySelector` pak je een element via een CSS-selector

```javascript
document.querySelector("#id")
document.querySelector(".classnaam")
document.querySelector("#id").style.fontSize = "24px"
```

<p class="lede" style="margin-top:22px">Uit het vorige hoofdstuk: zo krijg je een <strong style="color:#fff">domElement</strong> terug. Nu koppelen we dat aan de invoer van de gebruiker.</p>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">19</span></div>

Note: Gagné 3: voorkennis activeren. Vraag eerst zonder de code te bespreken: wat doet het hekje, wat doet de punt? (Id en class, net als in CSS.) Regel 3: een domElement heeft een style-attribuut waarmee je de CSS aanpast. Vandaag voeg je daar twee dingen aan toe: innerText om tekst te veranderen, en addEventListener om code uit te voeren zodra de gebruiker iets doet.

---

<p class="kicker">5.5 · Opdracht 5.C · Het doel</p>

## Opdracht 5.C · We bouwen een kop die live meeverandert met wat je typt

<div class="row" style="margin-top:6px">
<div class="col" style="flex:1 1 46%">
<div class="rows rows--tight">
  <div class="listrow"><span class="n">01</span><div><h3>HTML</h3><p>Een lege kop en een invoerveld.</p></div></div>
  <div class="listrow"><span class="n">02</span><div><h3>innerText</h3><p>De tekst van de kop aanpassen.</p></div></div>
  <div class="listrow"><span class="n">03</span><div><h3>addEventListener</h3><p>Code uitvoeren bij elke toetsaanslag.</p></div></div>
  <div class="listrow"><span class="n">04</span><div><h3>event.target.value</h3><p>Lezen wat er in het veld staat.</p></div></div>
  <div class="listrow"><span class="n">05</span><div><h3>Alles samen</h3></div></div>
</div>
</div>
<div class="col" style="flex:1 1 54%">
<div class="browser" data-demo="live-h1">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">opdracht-5c.html</span></div>
  <div class="browser__body">
    <h1 id="dlive-kop"></h1>
    <input type="text" value="Hallo wereld" aria-label="Typ hier je kop">
  </div>
</div>
<p class="small" style="margin-top:14px">Typ in het veld en kijk naar de kop.</p>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">20</span></div>

Note: Laat eerst het eindresultaat zien: typ iets in het veld, de kop verandert bij elke letter mee. We bouwen dit samen in vijf stappen; studenten typen mee in hun eigen HTML-bestand in hun projectmap. Verwachting: ze weten dat een HTML-document html-, head- en body-tags heeft, en dat code tussen script-tags als JavaScript wordt gelezen. In de snippets laten we die tags weg, maar in hun bestand moeten ze er wel staan.

---

<p class="kicker">5.5 · Opdracht 5.C · Stap 1 en 2</p>

## Met `innerText` verander je de tekst in een element

```html
<h1 id="headerTekst"></h1>
<input type="text" value="Hallo wereld" />
```

```javascript
document.querySelector("#headerTekst").innerText = "Dit is een test"
```

<div class="cards" style="margin-top:20px">
  <div class="glr-card"><span class="k">Werkt het?</span><p>Dan staat er "Dit is een test" in je kop. Plak de regel in de console, of zet hem onderaan de pagina in een <code>&lt;script&gt;</code>.</p></div>
  <div class="glr-card"><span class="k">Zie je niets?</span><p>Open de console (F12). Daar staat een foutmelding die zegt wat er misgaat.</p></div>
  <div class="glr-card glr-card--accent"><span class="k">Tip · foutmelding snappen</span><p>Vraag een LLM om de fout in het Nederlands uit te leggen. Kopieer de oplossing niet klakkeloos: stel minstens één vervolgvraag.</p></div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">21</span></div>

Note: Stap 1 is de HTML: een lege h1 met een id, en een input met een startwaarde. Stap 2: innerText is, net als style, een attribuut van het domElement. Laat studenten de regel eerst in de console proberen. De meest voorkomende fout: het script staat boven de h1, dus het element bestaat nog niet. Over de LLM-tip: bij deze stap mag je een LLM gebruiken om een foutmelding te begrijpen, maar het doel is dat je dezelfde fout een volgende keer niet meer maakt.

---

<p class="kicker">5.5 · Opdracht 5.C · Stap 3</p>

## Met `addEventListener` voer je code uit zodra de gebruiker iets doet

```javascript [1|2|3]
// We beginnen weer met het laden van het input veld als domElement
document.querySelector("input").addEventListener("keyup", event => {
  console.log(event)
})
```

<div class="defbox defbox--sm">
  <span class="k">Event</span>
  <p>Een actie van de gebruiker, zoals een toets loslaten (<code>keyup</code>) of klikken. JavaScript "gooit" een event, en jij koppelt er een functie aan.</p>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">22</span></div>

Note: Er gebeurt hier veel tegelijk; we ontleden het stap voor stap (pijltje omlaag voor de uitsplitsing). Laat studenten dit eerst overnemen en in de console kijken: bij elke toets die ze loslaten in het invoerveld verschijnt er een event-object. Laat ze er één openklappen: wat zien ze allemaal?

--

<p class="kicker">5.5 · Opdracht 5.C · Stap 3 ontleed</p>

## De regel bestaat uit drie stukken

<div class="cards">
  <div class="glr-card fragment"><span class="k">01 · Het element</span><h3><code>querySelector("input")</code></h3><p>Een CSS-selector, nu zonder # of punt: je krijgt het eerste input-element van de pagina.</p></div>
  <div class="glr-card fragment"><span class="k">02 · Het luisteren</span><h3><code>addEventListener("keyup", …)</code></h3><p>Luister naar het event keyup. Het tweede deel is een functie: een stukje code dat op commando wordt uitgevoerd.</p></div>
  <div class="glr-card fragment"><span class="k">03 · De functie</span><h3><code>event => { … }</code></h3><p>Wordt uitgevoerd bij elk keyup-event. <code>event</code> is een object met informatie over wat er gebeurde.</p></div>
</div>

<p class="small" style="margin-top:22px">Benieuwd welke events er nog meer zijn? <a href="https://www.w3schools.com/jsref/dom_obj_event.asp">W3Schools: HTML DOM events</a>. Schrik niet, het zijn er veel.</p>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">23</span></div>

Note: Eén. querySelector kennen ze al; met "input" pak je gewoon het eerste input-element. Twee. addEventListener is, net als style en innerText, een attribuut van het domElement. Het tweede argument is een functie; later besteden we meer aandacht aan het zelf schrijven van functies. Drie. Het event-object is iets wat JavaScript je als developer geeft, net als het domElement met allerlei attributen. console.log(event) logt dat object, zodat je het in de developer tools kunt bekijken.

---

<p class="kicker">5.5 · Opdracht 5.C · Stap 4</p>

## `event.target` is het veld waar je in typt, `.value` is wat erin staat

```javascript [2]
document.querySelector("input").addEventListener("keyup", event => {
  console.log(event.target.value)
})
```

<div class="cards">
  <div class="glr-card"><span class="k">event.target</span><p>Het element dat het event "afvuurde". Ook een domElement, dus het heeft attributen.</p></div>
  <div class="glr-card"><span class="k">.value</span><p>De waarde van het input-veld: precies wat er nu in staat.</p></div>
  <div class="glr-card"><span class="k">Vergeten welke attributen er zijn?</span><p>Log het object in de console, of kijk bij W3Schools: <a href="https://www.w3schools.com/jsref/dom_obj_event.asp">het event-object</a>.</p></div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">24</span></div>

Note: Wie het event-object heeft opengeklapt, heeft misschien het attribuut target al gezien. Dat is handig: daarmee lees je de waarde van het veld uit. We herschrijven de console.log zodat we niet meer het hele event loggen, maar alleen wat er in het veld staat. Laat het nog niet live zien; eerst de voorspelling op de volgende slide.

---

<p class="kicker">Check-in · Voorspel · Stem met je vingers</p>

## Je typt `hoi` in het veld. Wat verschijnt er in de console?

<div class="row" style="margin-top:4px">
<div class="col" style="flex:1 1 50%">
<div class="grid2 grid2--pi" style="gap:12px;grid-template-columns:1fr">
  <div class="glr-card"><span class="k">A</span><p>Eén keer: <code>"hoi"</code></p></div>
  <div class="glr-card"><span class="k">B</span><p>Drie keer: <code>"h"</code>, <code>"o"</code>, <code>"i"</code></p></div>
  <div class="glr-card"><span class="k">C</span><p>Drie keer: <code>"h"</code>, <code>"ho"</code>, <code>"hoi"</code></p></div>
  <div class="glr-card"><span class="k">D</span><p>Niets, want je hebt nog niet op Enter gedrukt</p></div>
</div>
</div>
<div class="col fragment" style="flex:1 1 50%">
<div class="browser" data-demo="console">
  <div class="browser__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="browser__url">opdracht-5c.html</span></div>
  <div class="browser__body"><input type="text" aria-label="Typ hier om te testen" placeholder="Typ hier: hoi"></div>
  <div class="devconsole" aria-live="polite">
    <div class="devconsole__head"><span>Console</span><button type="button">wis</button></div>
    <ol></ol>
  </div>
</div>
<div class="defbox defbox--sm"><span class="k">Antwoord · C</span><p>Na elke toets wordt de functie uitgevoerd, en <code>value</code> is steeds de hele inhoud van het veld.</p></div>
</div>
</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">25</span></div>

Note: Voorspellen voordat je kijkt (Gagné 6 en 7). Iedereen stemt tegelijk met de vingers. B is de typische misvatting: dan denk je dat value de laatste toets is in plaats van de hele inhoud. D is de verwarring met submit: keyup reageert op élke toets. Onthul daarna de demo en typ langzaam h, o, i: de console toont "h", "ho", "hoi". Typ je met de Shift-toets, dan zie je een extra regel, want ook het loslaten van Shift is een keyup.

---

<p class="kicker">5.5 · Opdracht 5.C · Stap 5</p>

## Alles samen: bij elke toets zet je de waarde van het veld in de kop

<div class="code-sm">

```html [6|8-9|12]
<h1 id="headerTekst"></h1>
<input type="text" value="Hallo wereld" />

<script>
  // Eerst voegen we de eventListener toe
  document.querySelector("input").addEventListener("keyup", event => {
    // Laten we even twee variabelen aanmaken voor de leesbaarheid
    const headerTekst = document.querySelector("#headerTekst")
    const nieuweTekst = event.target.value

    // Update de headerTekst met de nieuwe tekst
    headerTekst.innerText = nieuweTekst
  })
</script>
```

</div>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">26</span></div>

Note: Stap voor stap met de pijltjes. Regel 6: de eventListener uit stap 3. Regel 8 en 9: twee variabelen, alleen voor de leesbaarheid: de kop (stap 2) en de nieuwe tekst (stap 4). Regel 12: de innerText van de kop wordt de nieuwe tekst. Laat studenten het in hun eigen bestand afmaken en testen; het resultaat moet werken zoals de demo bij het begin van opdracht 5.C.

--

<p class="kicker">5.5 · Opdracht 5.C · Korte versie</p>

## Zonder variabelen doet de code precies hetzelfde

```html [3]
<script>
  document.querySelector("input").addEventListener("keyup", event => {
    document.querySelector("#headerTekst").innerText = event.target.value
  })
</script>
```

<p class="lede">Vind je de versie met <code>headerTekst</code> en <code>nieuweTekst</code> verwarrend? Vergelijk ze regel voor regel: het is dezelfde code, in één regel geschreven.</p>

<div class="footer"><span>Interface1 · Input velden</span><span class="num">27</span></div>

Note: Voor wie de variabelen verwarrend vindt. Laat zien dat regel 3 hier precies regel 8, 9 en 12 van de vorige slide is, maar dan in één keer. Welke versie je kiest is een kwestie van leesbaarheid; voor beginners is de lange versie vaak duidelijker.

---

<!-- .slide: class="dark" data-background-color="#111111" -->

<div class="bar"></div>
<p class="kicker kicker--lime">Afronding · 5.6 Samenvatting</p>

## Je kunt nu een gebruiker om informatie vragen, met de juiste interface

- `<form>` verpakt je velden: `action` is waarheen, `method` is hoe (GET in de URL, POST onzichtbaar).
- `<input>` met een `type` geeft het juiste invoerelement; `name` bepaalt wat de server ontvangt.
- `<label for>` koppelt tekst aan het `id` van een veld.
- `<textarea>` voor lange tekst, `<select>` met `<option>` voor vaste keuzes.
- `addEventListener("keyup", …)` met `event.target.value`: live reageren op invoer.

**Vervolgstap:** maak opdracht 5.A, 5.B en 5.C af in je projectmap.

<div class="footer"><span>Interface1 · Input velden</span><span class="num">28</span></div>

Note: Gagné 8 en 9: samenvatten en vooruitblikken. Loop de vijf punten kort langs en vraag bij elk punt één student om er een voorbeeld uit de les bij te noemen. JavaScript kan dus veel meer dan alleen styling wijzigen. Transfer-vraag om mee te eindigen: welk formulier heeft jouw eigen project nodig, en welke input types horen daarbij?

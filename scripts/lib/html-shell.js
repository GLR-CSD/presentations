/** Gedeelde HTML-shell voor GLR-decks (build-index + MCP-server). */

/** Naam van de .html-shell die bij een .md-bestand hoort. */
export function shellNameFor(mdName) {
  return mdName === 'slides.md' ? 'index.html' : mdName.replace(/\.md$/i, '.html');
}

/** De standaard GLR reveal.js HTML-shell voor een deck. */
export function buildHtmlShell({ prefix, mdFile, title }) {
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — GLR CSD</title>
<meta name="author" content="GLR CSD">

<!-- Automatisch gegenereerd door scripts/build-index.js. Laadt de inhoud uit
     ${mdFile} met de reveal.js markdown-plugin en de gedeelde GLR-huisstijl. -->

<link rel="stylesheet" href="${prefix}shared/vendor/reveal/reveal.css">
<link rel="stylesheet" href="${prefix}shared/vendor/reveal/plugin/highlight/monokai.css">
<link rel="stylesheet" href="${prefix}shared/css/glr-theme.css">
<link rel="stylesheet" href="${prefix}shared/vendor/chalkboard/style.css">
<link rel="stylesheet" href="${prefix}shared/vendor/customcontrols/style.css">
</head>
<body>

<div class="reveal">
  <div class="slides">
    <section
      data-markdown="${mdFile}"
      data-separator="\\n---\\n\\n"
      data-separator-vertical="\\n--\\n\\n"
      data-separator-notes="^Note:"
      data-charset="utf-8"></section>
  </div>
</div>

<script src="${prefix}shared/vendor/reveal/reveal.js"></script>
<script src="${prefix}shared/vendor/reveal/plugin/markdown/markdown.js"></script>
<script src="${prefix}shared/vendor/reveal/plugin/highlight/highlight.js"></script>
<script src="${prefix}shared/vendor/reveal/plugin/notes/notes.js"></script>
<script src="${prefix}shared/vendor/reveal/plugin/search/search.js"></script>
<script src="${prefix}shared/vendor/reveal/plugin/zoom/zoom.js"></script>
<script src="${prefix}shared/vendor/reveal/plugin/math/math.js"></script>
<script src="${prefix}shared/vendor/chalkboard/plugin.js"></script>
<script src="${prefix}shared/vendor/customcontrols/plugin.js"></script>
<script src="${prefix}shared/js/glr-plugins.js"></script>

<script>
  Reveal.initialize({
    width: 1280,
    height: 720,
    margin: 0,
    display: 'flex',
    center: false,
    minScale: 0.2,
    maxScale: 1.6,
    hash: true,
    progress: true,
    controlsLayout: 'bottom-right',
    slideNumber: false,
    transition: 'slide',
    backgroundTransition: 'fade',
    katex: { local: '${prefix}shared/vendor/katex' },
    chalkboard: {},
    customcontrols: {
      collapseIcon: '▾',
      expandIcon: '▴',
      controls: [
        { icon: '🖊️', title: 'Notitie-canvas (C)', action: 'RevealChalkboard.toggleNotesCanvas()' },
        { icon: '🖍️', title: 'Chalkboard (B)', action: 'RevealChalkboard.toggleChalkboard()' }
      ]
    },
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealSearch, RevealZoom, RevealMath.KaTeX, RevealChalkboard, RevealCustomControls],
    markdown: { smartypants: true }
  }).then(function () {
    GLRPlugins.initAll();
  });
</script>

</body>
</html>
`;
}

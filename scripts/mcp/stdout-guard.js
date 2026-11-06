/**
 * Beschermt het MCP stdio-protocol: stdout is uitsluitend voor JSON-RPC.
 * Dit moet de EERSTE import van mcp-server.js zijn (ES-imports worden in
 * volgorde geëvalueerd), zodat ook libraries die per ongeluk console.log
 * gebruiken het protocol niet kunnen breken.
 */
const toStderr = (...args) => console.error(...args);
console.log = toStderr;
console.info = toStderr;
console.warn = toStderr;
console.debug = toStderr;

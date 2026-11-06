#!/usr/bin/env node
/**
 * GLR Slide Studio — MCP-server (stdio) voor Claude Desktop, Claude Code, Cursor en VS Code.
 *
 * Hergebruikt de verliesvrije deck-, blok- en didactische modules uit admin/src/.
 * Omgevingsvariabelen: GLR_REPO_ROOT, GITHUB_TOKEN (of GLR_GITHUB_TOKEN), GLR_GITHUB_REPO (owner/repo).
 *
 * LET OP: stdout is voor het protocol. Deze guard moet de eerste import blijven.
 */
import './mcp/stdout-guard.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Workspace } from './mcp/workspace.js';
import { registerTools } from './mcp/tools.js';
import { registerResources } from './mcp/resources.js';
import { registerPrompts } from './mcp/prompts.js';

export function createGlrServer({ root } = {}) {
  const ws = new Workspace(root);
  const server = new McpServer(
    { name: 'glr-slides', version: '1.0.0' },
    { instructions: 'Tools om GLR Reveal.js-presentaties te maken en te verbeteren. Lees eerst de resources glr://components/catalog en glr://pedagogy/guidelines. Slides zijn 1-gebaseerd, blockIndex is 0-gebaseerd. De input/ map bestaat alleen lokaal.' },
  );
  registerTools(server, ws);
  registerResources(server, ws);
  registerPrompts(server);
  return server;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('mcp-server.js')) {
  const server = createGlrServer();
  await server.connect(new StdioServerTransport());
  console.error('GLR MCP-server gestart (stdio).');
}

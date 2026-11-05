/**
 * Kleine helpers om beschermde blokken als ProseMirror-JSON te maken.
 */
export const htmlBlock = (html) => ({ type: 'htmlBlock', attrs: { html: String(html).trim() } });
export const commentBlock = (comment) => ({ type: 'commentBlock', attrs: { comment: String(comment).trim() } });
export const inlineHtml = (html) => ({ type: 'inlineHtml', attrs: { html: String(html) } });

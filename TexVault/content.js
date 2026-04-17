// content.js — TexVault content script
// Injected into Overleaf pages. Listens for TEXVAULT_PASTE messages from the
// popup and inserts the LaTeX text at the cursor position in the editor.

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'TEXVAULT_PASTE') return false;

  // Overleaf uses CodeMirror 6 — the editable surface is a div
  // with class .cm-content and contenteditable="true"
  const editor = document.querySelector('.cm-content[contenteditable="true"]');
  if (!editor) {
    sendResponse({ ok: false, reason: 'editor not found' });
    return true;
  }

  editor.focus();
  const ok = document.execCommand('insertText', false, msg.text);
  sendResponse({ ok: !!ok });
  return true; // keep message channel open for async sendResponse
});

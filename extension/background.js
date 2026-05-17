// background.js — TexVault service worker
//
// Registers the right-click context menu item. When the user selects text
// and chooses "Save as TexVault snippet", the selected text is stashed in
// chrome.storage.local so the popup can pick it up and pre-fill the modal.

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id:       'texvault-save-snippet',
    title:    'Save as TexVault snippet',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== 'texvault-save-snippet') return;
  const text = (info.selectionText || '').trim();
  if (!text) return;

  // Stash the selected text, then open the popup.
  // chrome.action.openPopup() requires a user gesture — context menu clicks qualify.
  chrome.storage.local.set({ pendingSnippet: text }, () => {
    chrome.action.openPopup().catch(() => {
      // openPopup() can fail if the popup is already open or on some platforms.
      // The text is already in storage so it will be picked up next time the
      // popup opens.
    });
  });
});

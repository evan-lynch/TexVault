// script.js — TexVault main application logic
//
// This file runs after templates.js and katex.min.js have both loaded,
// so window.TEMPLATES and window.katex are available here.
//
// DOMContentLoaded fires when the HTML has been fully parsed and all
// elements exist in the page. We wrap everything in this event so we
// don't try to find elements before they exist.

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════════════
  // STATE
  // These variables track the current condition of the app.
  // They all live here so any function can read or update them.
  // ══════════════════════════════════════════════════════════════

  let customSnippets        = [];        // user's saved snippets, loaded from storage
  let customFolders         = [];        // user-created folders: { id, name }
  let pinnedTemplates       = [];        // names of pinned library templates
  let activeTab             = 'custom';  // which tab is showing
  let viewMode              = 'normal';  // 'normal' (2-col) | 'compact' (3-col)
  let sidebarOpen           = false;     // whether the folder sidebar is visible
  let activeFolderCustom    = null;      // selected folder id in Custom tab (null = All)
  let activeFolderTemplates = null;      // selected folder id in Templates tab (null = All)
  let searchQuery           = '';        // current search string (not persisted)
  let editingSnippetId      = null;      // id of snippet being edited, null when adding
  let folderModalMode         = null;    // 'new' | 'edit' — which folder modal flow is open
  let modalFolderCreating     = false;  // true while the inline create-input is shown in the snippet modal
  let modalSessionFolderIds   = [];     // ids of folders created during the current modal open — purged on cancel
  let customSortOrder         = 'custom'; // 'custom' (user-defined/add order) | 'alpha' (A–Z)
  let dragSrcId               = null;     // snippet id being dragged

  // App settings — persisted in storage under key 'appSettings'
  let appSettings = {
    autoPaste:         false,    // auto-paste to Overleaf when it's the active tab
    theme:             'system', // 'system' | 'light' | 'dark'
    hasSeenTip:        false,    // true once the first-launch onboarding tooltip has been seen
    hasSeenFolderTip:  false,    // true once the folder sidebar tip has been seen
    hasSeenViewTip:    false,    // true once the compact view tip has been seen
    hasSeenSortTip:    false,    // true once the sort tip has been seen
  };

  // Predefined folder definitions for the Templates tab.
  // These match the `folder` field on each entry in templates.js.
  // They are read-only — the user cannot add or rename them.
  const TEMPLATE_FOLDERS = [
    { id: 'basic-math',     name: 'Basic Math' },
    { id: 'calculus',       name: 'Calculus' },
    { id: 'discrete',       name: 'Discrete Math' },
    { id: 'linear-algebra', name: 'Linear Algebra' },
    { id: 'probability',    name: 'Probability' },
    { id: 'symbols',        name: 'Symbols & Arrows' },
    { id: 'proofs',         name: 'Proofs' },
    { id: 'greek',          name: 'Greek Letters' },
    { id: 'environments',   name: 'Environments' },
    { id: 'document',       name: 'Document' },
  ];


  // ══════════════════════════════════════════════════════════════
  // DOM REFERENCES
  // Grab every element we'll need once, up front.
  // ══════════════════════════════════════════════════════════════

  const tabs          = document.querySelectorAll('.tab');
  const panels        = document.querySelectorAll('.panel');
  const templatesGrid = document.getElementById('templates-grid');
  const customGrid    = document.getElementById('custom-grid');
  const toast         = document.getElementById('toast');
  const srAnnounce    = document.getElementById('sr-announce');
  const modalOverlay  = document.getElementById('modal-overlay');
  const modalName     = document.getElementById('modal-name');
  const modalCode     = document.getElementById('modal-code');
  const modalPreview  = document.getElementById('modal-preview');
  const modalCancel   = document.getElementById('modal-cancel');
  const modalSave     = document.getElementById('modal-save');
  const sortToggle    = document.getElementById('sort-toggle');
  const viewToggle    = document.getElementById('view-toggle');
  const folderToggle  = document.getElementById('folder-toggle');
  const folderSidebar = document.getElementById('folder-sidebar');
  const folderList    = document.getElementById('folder-list');
  const folderNewBtn  = document.getElementById('folder-new-btn');
  const searchInput   = document.getElementById('search-input');
  const searchClear   = document.getElementById('search-clear');
  const fabNew        = document.getElementById('fab-new');
  const folderEditBtn      = document.getElementById('folder-edit-btn');
  const modalFolder        = document.getElementById('modal-folder');
  const modalFolderNew     = document.getElementById('modal-folder-new');
  const modalFolderCreate  = document.getElementById('modal-folder-create');
  const modalTitle         = document.getElementById('modal-title');
  const folderIndicator      = document.getElementById('folder-indicator');
  const folderIndicatorName  = folderIndicator.querySelector('.folder-indicator__name');
  const folderIndicatorClear = document.getElementById('folder-indicator-clear');
  // Folder management popup (New Folder / Edit Folder)
  const folderModalOverlay = document.getElementById('folder-modal-overlay');
  const folderModalTitle   = document.getElementById('folder-modal-title');
  const folderModalName    = document.getElementById('folder-modal-name');
  const folderModalDelete  = document.getElementById('folder-modal-delete');
  const folderModalCancel  = document.getElementById('folder-modal-cancel');
  const folderModalSave    = document.getElementById('folder-modal-save');
  // Settings panel
  const themePicker        = document.getElementById('theme-picker');
  const settingsBtn        = document.getElementById('settings-btn');
  const settingsOverlay    = document.getElementById('settings-overlay');
  const settingsClose      = document.getElementById('settings-close');
  const settingAutopaste   = document.getElementById('setting-autopaste');
  const settingsExport       = document.getElementById('settings-export');
  const settingsImportBtn    = document.getElementById('settings-import-btn');
  const exportConfirmOverlay = document.getElementById('export-confirm-overlay');
  const exportConfirmCancel  = document.getElementById('export-confirm-cancel');
  const exportConfirmOk      = document.getElementById('export-confirm-ok');
  const settingsImportFile = document.getElementById('settings-import-file');
  const settingsImportMsg  = document.getElementById('settings-import-msg');
  // Duplicate warning in snippet modal
  const modalDupWarn       = document.getElementById('modal-dup-warn');
  // Card name tooltip (custom — shown when name is truncated)
  const nameTooltip        = document.getElementById('name-tooltip');
  // First-launch onboarding tooltip
  const onboardTip         = document.getElementById('onboard-tip');
  const onboardTipClose    = document.getElementById('onboard-tip-close');
  // Tab bar onboarding tooltips
  const folderTip           = document.getElementById('folder-tip');
  const folderTipClose      = document.getElementById('folder-tip-close');
  const viewTip             = document.getElementById('view-tip');
  const viewTipClose        = document.getElementById('view-tip-close');
  const sortTip             = document.getElementById('sort-tip');
  const sortTipClose        = document.getElementById('sort-tip-close');


  // ══════════════════════════════════════════════════════════════
  // VIEW TOGGLE
  // Two SVG icons reflect the current view mode.
  // Clicking cycles between normal (2-col) and compact (3-col).
  //
  // The icon shows the current state — a 2×2 grid when normal,
  // a 3×3 grid when compact. Toggling adds/removes the CSS class
  // .card-grid--compact which overrides grid-template-columns.
  // ══════════════════════════════════════════════════════════════

  // ── Icon constants ──────────────────────────────────────────────

  // Pencil icon — used on the edit button on each custom card
  const ICON_PENCIL = `<svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zm-1.293 2.707L13.5 5.207 14.793 3.5 12.5 1.207 10.853 2.853zm1.586 3L10.5 3.707 4 10.207V10.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.293l6.5-6.5zm-9.75 5.172-.025.025-1.52 3.8 3.8-1.52.025-.025A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.461-.311z"/>
  </svg>`;

  // 2×2 squares — represents normal view
  const ICON_NORMAL = `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="0" y="0" width="6" height="6" rx="1"/>
    <rect x="8" y="0" width="6" height="6" rx="1"/>
    <rect x="0" y="8" width="6" height="6" rx="1"/>
    <rect x="8" y="8" width="6" height="6" rx="1"/>
  </svg>`;

  // 3×3 squares — represents compact view
  const ICON_COMPACT = `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="0"    y="0"    width="3.5" height="3.5" rx="0.5"/>
    <rect x="5.25" y="0"    width="3.5" height="3.5" rx="0.5"/>
    <rect x="10.5" y="0"    width="3.5" height="3.5" rx="0.5"/>
    <rect x="0"    y="5.25" width="3.5" height="3.5" rx="0.5"/>
    <rect x="5.25" y="5.25" width="3.5" height="3.5" rx="0.5"/>
    <rect x="10.5" y="5.25" width="3.5" height="3.5" rx="0.5"/>
    <rect x="0"    y="10.5" width="3.5" height="3.5" rx="0.5"/>
    <rect x="5.25" y="10.5" width="3.5" height="3.5" rx="0.5"/>
    <rect x="10.5" y="10.5" width="3.5" height="3.5" rx="0.5"/>
  </svg>`;

  // Pin icon (pushpin)
  const ICON_PIN = `<svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
  </svg>`;

  function setViewMode(mode) {
    viewMode = mode;
    const isCompact = mode === 'compact';

    // Toggle the compact CSS class on every card grid (templates + custom)
    document.querySelectorAll('.card-grid').forEach(g =>
      g.classList.toggle('card-grid--compact', isCompact)
    );

    // Swap icon and tooltip to match the current state
    viewToggle.innerHTML = isCompact ? ICON_COMPACT : ICON_NORMAL;
    viewToggle.title = isCompact ? 'Switch to normal view' : 'Switch to compact view';
    viewToggle.setAttribute('aria-label', viewToggle.title);

    // No persistent highlight — the icon change is enough feedback
  }

  // Save only on user-triggered toggles, not during init restore
  viewToggle.addEventListener('click', () => {
    setViewMode(viewMode === 'normal' ? 'compact' : 'normal');
    saveUIState();
    // Rescale previews since card dimensions change between modes
    requestAnimationFrame(() => {
      document.querySelectorAll('.card__preview').forEach(scaleKatexToFit);
    });
  });


  // ══════════════════════════════════════════════════════════════
  // SORT TOGGLE (Custom tab only)
  // Cycles between date-added order and A–Z alphabetical.
  // Button is hidden on the Templates tab.
  // ══════════════════════════════════════════════════════════════

  // Alpha sort: "AZ" text label
  const ICON_SORT_ALPHA  = `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <text x="0" y="11" font-size="10" font-weight="700" font-family="Arial,sans-serif" fill="currentColor">AZ</text>
  </svg>`;

  // Custom sort: descending bars (longest → shortest)
  const ICON_SORT_CUSTOM = `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <rect x="1" y="2"    width="12" height="2.5" rx="1.25"/>
    <rect x="1" y="5.75" width="8.5" height="2.5" rx="1.25"/>
    <rect x="1" y="9.5"  width="5"   height="2.5" rx="1.25"/>
  </svg>`;

  function setSortOrder(order) {
    customSortOrder = order;
    const icons = { alpha: ICON_SORT_ALPHA, custom: ICON_SORT_CUSTOM };
    const titles = {
      alpha:  activeTab === 'templates'
        ? 'Sort: A–Z (click for common-first)'
        : 'Sort: A–Z (click for custom order)',
      custom: activeTab === 'templates'
        ? 'Sort: Common-first (click for A–Z)'
        : 'Sort: Custom order (click for A–Z)',
    };
    sortToggle.innerHTML = icons[order] || ICON_SORT_CUSTOM;
    sortToggle.title     = titles[order] || titles.custom;
    sortToggle.setAttribute('aria-label', sortToggle.title);
    sortToggle.classList.remove('btn-icon--active');
  }

  function updateSortToggleVisibility() {
    sortToggle.style.display = ''; // visible on both Custom and Library tabs
  }

  // Curated "most common" order for the Library tab's custom sort.
  // Items not in this list fall through to the end in their original array order.
  const TEMPLATE_PRIORITY = [
    // Universal building blocks
    'Fraction', 'Square Root', 'Integral', 'Sum', 'Limit',
    // Calculus
    'Derivative', 'Partial Derivative', 'Chain Rule', 'FTC',
    'Double Integral', 'Taylor Series', 'nth Derivative', 'Mixed Partial',
    'Gradient', 'Laplacian', "L'Hôpital's Rule",
    // Core algebra
    'Absolute Value', 'Plus / Minus', 'Infinity', 'nth Root',
    // Linear algebra
    'Matrix', 'Dot Product', 'Cross Product', 'Transpose', 'Inverse',
    'Determinant', 'Eigenvalue Eq.', 'Column Vector', 'Inner Product',
    'Augmented Matrix', 'Projection', 'Char. Polynomial', 'Rank-Nullity', 'Span',
    // Sets & logic
    'For All / Exists', 'Implies / Iff', 'Union / Intersection', 'AND / OR',
    'NOT', 'Subset / Superset', 'Set Difference', 'Number Sets', '∈ ∉',
    // Greek letters
    'Alpha / Beta', 'Gamma / Delta', 'Lambda / Mu', 'Sigma / Tau',
    'Eta / Theta', 'Pi / Rho', 'Epsilon / Zeta', 'Capital: Γ Δ Θ',
    'Capital: Λ Σ Φ', 'Capital: Ψ Ω Π', 'Nu / Xi', 'Upsilon / Phi',
    'Chi / Psi', 'Omega', 'Iota / Kappa',
    // Probability
    'Expected Value', 'Conditional Prob', "Bayes' Theorem", 'Normal Dist.',
    'Variance', 'Std Deviation', 'Binomial Dist.', 'Normal PDF',
    'Covariance', 'Correlation',
    // Symbols
    '≤ ≥ ≠', '≈ ~ ≅', '→ ← ↔', '⇒ ⇐ ⇔', '· × ÷',
    '∴ ∵', 'QED  □ ■', '≪ ≫ ∝', '∥ ⊥', '∠ °',
    '⊂ ⊃ ⊄', '⊕ ⊗ ⊙', 'Maps To', 'Long Arrows', '↑ ↓ ↕',
    '⇑ ⇓', '↪ ↠ (inject/surject)', 'Diagonal Arrows',
    '… (horizontal dots)', '⋮ ⋱ (vert/diag dots)', '∃! (unique exists)',
    // Environments
    'Align', 'Cases', 'pmatrix', 'bmatrix', 'vmatrix', 'Array', 'Augmented Array', 'Gathered',
    // Discrete
    'Binomial Coeff', 'Binomial Theorem', 'Permutations', 'Modulo', 'GCD / LCM',
    'Big-O', 'Recurrence', 'Summation Formula', 'Big Union / Cap',
    'Empty Set', 'Power Set', 'Cartesian Product', 'Cardinality',
    'XOR', 'NAND / NOR', 'Divides / Not Divides',
    // Proofs
    'QED', 'Therefore / Because', 'Implies Chain', 'Iff Chain', 'Proof',
    // Document
    'Enumerate', 'Itemize', 'Table', 'Figure',
    // Linear algebra (remaining)
    'Floor / Ceiling', 'Norm', 'Product',
  ];

  sortToggle.addEventListener('click', () => {
    setSortOrder(customSortOrder === 'alpha' ? 'custom' : 'alpha');
    saveUIState();
    if (activeTab === 'custom') {
      renderCustomGrid();
    } else {
      renderTemplatesGrid();
    }
  });


  // ══════════════════════════════════════════════════════════════
  // SETTINGS PANEL
  // ══════════════════════════════════════════════════════════════

  function openSettings() {
    settingsOverlay.classList.add('settings-overlay--visible');
    settingsOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeSettings() {
    settingsOverlay.classList.remove('settings-overlay--visible');
    settingsOverlay.setAttribute('aria-hidden', 'true');
  }

  settingsBtn.addEventListener('click', openSettings);
  settingsClose.addEventListener('click', closeSettings);



  // Dismiss with Escape key
  settingsOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });

  function saveAppSettings() {
    safeSyncSet({ appSettings });
  }

  // ══════════════════════════════════════════════════════════════
  // THEME
  // System / Light / Dark. Applies data-theme="dark" on <html>.
  // ══════════════════════════════════════════════════════════════

  const systemDarkMQ = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme() {
    const t    = appSettings.theme;
    const dark = t === 'dark' || (t === 'system' && systemDarkMQ.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');

    // Sync the picker buttons to the stored value
    themePicker.querySelectorAll('.theme-picker__btn').forEach(btn => {
      btn.classList.toggle('theme-picker__btn--active', btn.dataset.themeVal === t);
    });
  }

  // Re-apply when the OS flips between light/dark while the popup is open
  systemDarkMQ.addEventListener('change', () => {
    if (appSettings.theme === 'system') applyTheme();
  });

  themePicker.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-picker__btn');
    if (!btn) return;
    appSettings.theme = btn.dataset.themeVal;
    saveAppSettings();
    applyTheme();
  });

  // Auto-paste toggle
  settingAutopaste.addEventListener('change', () => {
    appSettings.autoPaste = settingAutopaste.checked;
    saveAppSettings();
  });

  // ══════════════════════════════════════════════════════════════
  // EXPORT / IMPORT
  // ══════════════════════════════════════════════════════════════

  function doExport() {
    const data = JSON.stringify({ version: '1', customSnippets, customFolders }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `texvault-snippets-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  settingsExport.addEventListener('click', () => {
    exportConfirmOverlay.classList.add('export-confirm-overlay--visible');
    exportConfirmOverlay.setAttribute('aria-hidden', 'false');
  });

  exportConfirmCancel.addEventListener('click', () => {
    exportConfirmOverlay.classList.remove('export-confirm-overlay--visible');
    exportConfirmOverlay.setAttribute('aria-hidden', 'true');
  });

  exportConfirmOk.addEventListener('click', () => {
    exportConfirmOverlay.classList.remove('export-confirm-overlay--visible');
    exportConfirmOverlay.setAttribute('aria-hidden', 'true');
    doExport();
  });

  exportConfirmOverlay.addEventListener('click', (e) => {
    if (e.target === exportConfirmOverlay) {
      exportConfirmOverlay.classList.remove('export-confirm-overlay--visible');
      exportConfirmOverlay.setAttribute('aria-hidden', 'true');
    }
  });

  settingsImportBtn.addEventListener('click', () => settingsImportFile.click());

  settingsImportFile.addEventListener('change', () => {
    const file = settingsImportFile.files[0];
    if (!file) return;
    settingsImportFile.value = '';   // reset so same file can be re-imported

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data.customSnippets)) throw new Error('Invalid format');
        customSnippets = data.customSnippets;
        customFolders  = Array.isArray(data.customFolders) ? data.customFolders : [];
        saveCustomSnippets();
        saveCustomFolders();
        renderCustomGrid();
        if (sidebarOpen) renderFolderSidebar();
        showImportMsg(`Imported ${customSnippets.length} snippet${customSnippets.length !== 1 ? 's' : ''}`, true);
      } catch {
        showImportMsg('Import failed — invalid file', false);
      }
    };
    reader.readAsText(file);
  });

  function showImportMsg(text, ok) {
    settingsImportMsg.textContent = text;
    settingsImportMsg.className   = 'settings-import-msg ' + (ok ? 'settings-import-msg--ok' : 'settings-import-msg--err');
    clearTimeout(showImportMsg._t);
    showImportMsg._t = setTimeout(() => {
      settingsImportMsg.textContent = '';
      settingsImportMsg.className   = 'settings-import-msg';
    }, 4000);
  }


  // ══════════════════════════════════════════════════════════════
  // AUTO-PASTE (Overleaf)
  // Tries to insert text directly into the focused Overleaf tab.
  // Falls back to "Copied!" toast if Overleaf isn't found.
  // ══════════════════════════════════════════════════════════════

  function tryAutoPaste(text) {
    chrome.tabs.query({ active: true }, (tabs) => {
      const overleaf = tabs.find(t => t.url && t.url.includes('overleaf.com'));
      if (!overleaf) { showToast('Copied!'); return; }

      chrome.tabs.sendMessage(overleaf.id, { type: 'TEXVAULT_PASTE', text }, (resp) => {
        if (chrome.runtime.lastError || !resp || !resp.ok) {
          showToast('Copied!');   // paste failed, but clipboard still has it
        } else {
          showToast('Pasted!');
        }
      });
    });
  }


  // ══════════════════════════════════════════════════════════════
  // PIN SNIPPETS
  // ══════════════════════════════════════════════════════════════

  function togglePin(id) {
    const snippet = customSnippets.find(s => s.id === id);
    if (!snippet) return;
    snippet.pinned = !snippet.pinned;
    saveCustomSnippets();
    renderCustomGrid();
  }


  // ══════════════════════════════════════════════════════════════
  // DUPLICATE WARNING (snippet modal)
  // ══════════════════════════════════════════════════════════════

  function checkDuplicate() {
    const code = modalCode.value.trim();
    if (!code || editingSnippetId) { hideDupWarn(); return; }
    const dup = customSnippets.find(s => s.code.trim() === code);
    if (dup) {
      modalDupWarn.textContent = `⚠ Same code as "${dup.name}"`;
      modalDupWarn.classList.add('modal__dup-warn--visible');
    } else {
      hideDupWarn();
    }
  }

  function hideDupWarn() {
    modalDupWarn.textContent = '';
    modalDupWarn.classList.remove('modal__dup-warn--visible');
  }


  // ══════════════════════════════════════════════════════════════
  // TAB SWITCHING
  // Updates the active tab state, highlights the right button,
  // shows the right panel, and refreshes the sidebar if open.
  // ══════════════════════════════════════════════════════════════

  function switchTab(tabName) {
    activeTab = tabName;
    tabs.forEach(t => t.classList.toggle('tab--active', t.dataset.tab === tabName));
    panels.forEach(p => p.classList.toggle('panel--active', p.id === `panel-${tabName}`));
    // Re-render the sidebar so it shows the folders for the new tab
    if (sidebarOpen) renderFolderSidebar();
    updateFolderIndicator();
    updateSortToggleVisibility();
    updateSearchCreateVisibility();
    setSortOrder(customSortOrder); // refresh tooltip to match current tab
    saveUIState();
    // Rescale previews in the newly-visible panel. When view mode changes while
    // a panel is hidden (display:none), scaleKatexToFit measures 0 dimensions and
    // leaves stale transforms on the KaTeX elements. RAF fires after the panel
    // is visible so dimensions are readable.
    requestAnimationFrame(() => {
      const panel = document.getElementById(`panel-${tabName}`);
      if (panel) panel.querySelectorAll('.card__preview').forEach(scaleKatexToFit);
    });

    // Onboarding tips triggered by tab switches
    if (tabName === 'templates' && !appSettings.hasSeenViewTip) {
      setTimeout(showViewTip, 400);
    }
    if (tabName === 'custom' && appSettings.hasSeenViewTip && !appSettings.hasSeenSortTip && customSnippets.length > 0) {
      setTimeout(showSortTip, 400);
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));


  // ══════════════════════════════════════════════════════════════
  // FOCUS TRAP
  // When a modal is open, Tab/Shift+Tab must cycle only within the
  // modal — not reach the cards or sidebar behind it.
  // installFocusTrap() returns a cleanup function; call it on close.
  // Focusable elements are re-queried on every keypress so the list
  // stays correct when the folder-create input is shown/hidden.
  // ══════════════════════════════════════════════════════════════

  function installFocusTrap(containerEl) {
    function focusable() {
      return Array.from(containerEl.querySelectorAll(
        'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.offsetParent !== null);   // visible elements only
    }

    function handler(e) {
      if (e.key !== 'Tab') return;
      const els   = focusable();
      if (!els.length) return;
      const first = els[0];
      const last  = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }

    containerEl.addEventListener('keydown', handler);
    return () => containerEl.removeEventListener('keydown', handler);
  }

  let removeTrap = null;   // cleanup fn for the currently active focus trap


  // ══════════════════════════════════════════════════════════════
  // FOLDER INDICATOR
  // Shows the active folder name below the search bar.
  // Appears only when a specific folder is selected (not "All").
  // Clicking × clears the folder filter.
  // ══════════════════════════════════════════════════════════════

  function updateFolderIndicator() {
    let name = null;

    if (activeTab === 'custom' && activeFolderCustom !== null) {
      const f = customFolders.find(f => f.id === activeFolderCustom);
      name = f ? f.name : null;
    } else if (activeTab === 'templates' && activeFolderTemplates !== null) {
      const f = TEMPLATE_FOLDERS.find(f => f.id === activeFolderTemplates);
      name = f ? f.name : null;
    }

    if (name) {
      folderIndicatorName.textContent = name;
      folderIndicator.classList.add('folder-indicator--visible');
      folderIndicator.setAttribute('aria-hidden', 'false');
    } else {
      folderIndicator.classList.remove('folder-indicator--visible');
      folderIndicator.setAttribute('aria-hidden', 'true');
    }
  }

  folderIndicatorClear.addEventListener('click', () => {
    if (activeTab === 'custom') {
      activeFolderCustom = null;
      renderCustomGrid();
    } else {
      activeFolderTemplates = null;
      renderTemplatesGrid();
    }
    saveUIState();
    updateFolderIndicator();
    if (sidebarOpen) renderFolderSidebar();
  });


  // ══════════════════════════════════════════════════════════════
  // SEARCH
  // Filters snippets/templates by name or LaTeX code content.
  // Not persisted — resets each time the popup opens.
  // ══════════════════════════════════════════════════════════════

  function matchesSearch(snippet) {
    if (!searchQuery) return true;
    return snippet.name.toLowerCase().includes(searchQuery) ||
           snippet.code.toLowerCase().includes(searchQuery);
  }

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    searchClear.classList.toggle('search-clear--visible', searchQuery.length > 0);
    renderTemplatesGrid();
    renderCustomGrid();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.remove('search-clear--visible');
    searchInput.focus();
    renderTemplatesGrid();
    renderCustomGrid();
  });

  fabNew.addEventListener('click', () => {
    if (onboardTip.classList.contains('onboard-tip--visible')) dismissOnboardTip();
    openModal();
  });

  function updateSearchCreateVisibility() {
    fabNew.classList.toggle('fab--hidden', activeTab !== 'custom');
    fabNew.setAttribute('aria-hidden', activeTab !== 'custom' ? 'true' : 'false');
  }

  // ── Onboarding tooltip ──────────────────────────────────────────

  function showOnboardTip() {
    onboardTip.classList.add('onboard-tip--visible');
    onboardTip.setAttribute('aria-hidden', 'false');
    fabNew.classList.add('fab--pulse');
  }

  function dismissOnboardTip() {
    onboardTip.classList.remove('onboard-tip--visible');
    onboardTip.setAttribute('aria-hidden', 'true');
    fabNew.classList.remove('fab--pulse');
    appSettings.hasSeenTip = true;
    saveAppSettings();
  }

  onboardTipClose.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissOnboardTip();
  });

  // Dismiss on outside click
  document.addEventListener('click', (e) => {
    if (!onboardTip.classList.contains('onboard-tip--visible')) return;
    if (onboardTip.contains(e.target)) return;
    dismissOnboardTip();
  });

  // ── Tab bar tips (folder / view / sort) ────────────────────────

  function showTabTip(tipEl, pulseEl) {
    tipEl.classList.add('tab-tip--visible');
    tipEl.setAttribute('aria-hidden', 'false');
    if (pulseEl) pulseEl.classList.add('btn-icon--tip-pulse');
  }

  function dismissTabTip(tipEl, pulseEl, settingKey) {
    tipEl.classList.remove('tab-tip--visible');
    tipEl.setAttribute('aria-hidden', 'true');
    if (pulseEl) pulseEl.classList.remove('btn-icon--tip-pulse');
    appSettings[settingKey] = true;
    saveAppSettings();
  }

  function dismissAllTabTips() {
    if (folderTip.classList.contains('tab-tip--visible'))     dismissTabTip(folderTip,     folderToggle, 'hasSeenFolderTip');
    if (viewTip.classList.contains('tab-tip--visible'))       dismissTabTip(viewTip,       viewToggle,   'hasSeenViewTip');
    if (sortTip.classList.contains('tab-tip--visible'))       dismissTabTip(sortTip,       sortToggle,   'hasSeenSortTip');
  }

  function showFolderTip()     { dismissAllTabTips(); showTabTip(folderTip,     folderToggle); }
  function dismissFolderTip()  { dismissTabTip(folderTip,     folderToggle, 'hasSeenFolderTip'); }

  function showViewTip()       { dismissAllTabTips(); showTabTip(viewTip,       viewToggle); }
  function dismissViewTip()    { dismissTabTip(viewTip,       viewToggle,   'hasSeenViewTip'); }

  function showSortTip()       { dismissAllTabTips(); showTabTip(sortTip,       sortToggle); }
  function dismissSortTip()    { dismissTabTip(sortTip,       sortToggle,   'hasSeenSortTip'); }

  // Close buttons
  folderTipClose.addEventListener('click', (e) => { e.stopPropagation(); dismissFolderTip(); });
  viewTipClose.addEventListener('click',   (e) => { e.stopPropagation(); dismissViewTip(); });
  sortTipClose.addEventListener('click',   (e) => { e.stopPropagation(); dismissSortTip(); });

  // Dismiss any tab tip on outside click
  document.addEventListener('click', (e) => {
    if (folderTip.classList.contains('tab-tip--visible') && !folderTip.contains(e.target)) dismissFolderTip();
    if (viewTip.classList.contains('tab-tip--visible')   && !viewTip.contains(e.target))   dismissViewTip();
    if (sortTip.classList.contains('tab-tip--visible')   && !sortTip.contains(e.target))   dismissSortTip();
  });

  // Dismiss view/sort tips when the user actually clicks those buttons
  viewToggle.addEventListener('click', () => {
    if (viewTip.classList.contains('tab-tip--visible')) dismissViewTip();
  });
  sortToggle.addEventListener('click', () => {
    if (sortTip.classList.contains('tab-tip--visible')) dismissSortTip();
  });


  // ══════════════════════════════════════════════════════════════
  // TYPE DETECTION
  // Auto-classifies LaTeX as math (KaTeX renders it) or text
  // (shown as monospace code). Checked on both custom snippets
  // added via the modal and during live preview.
  // ══════════════════════════════════════════════════════════════

  function detectType(code) {
    const textEnvs = [
      'itemize', 'enumerate', 'figure', 'table', 'tabular',
      'theorem', 'proof', 'abstract', 'verbatim'
    ];
    const textCommands = [
      '\\includegraphics', '\\usepackage', '\\documentclass',
      '\\section', '\\subsection', '\\subsubsection', '\\chapter',
      '\\label', '\\ref', '\\cite', '\\bibliography', '\\bibliographystyle',
      '\\newcommand', '\\renewcommand', '\\setlength', '\\newenvironment',
      '\\input', '\\include', '\\caption', '\\footnote', '\\textbf',
      '\\textit', '\\emph', '\\href', '\\url'
    ];
    const isTextEnv     = textEnvs.some(env => code.includes(`\\begin{${env}}`));
    const isTextCommand = textCommands.some(cmd => code.includes(cmd));
    return (isTextEnv || isTextCommand) ? 'text' : 'math';
  }


  // ══════════════════════════════════════════════════════════════
  // RENDERING
  // Renders a LaTeX preview into a container element.
  // Math types use KaTeX; text types fall back to monospace.
  // throwOnError: true means KaTeX throws a real JS Error for
  // unknown commands so the catch block can handle them cleanly.
  // ══════════════════════════════════════════════════════════════

  // Returns the first few non-empty lines of code for use in card previews.
  // Avoids blank-looking cards when a snippet contains a large document.
  function previewLines(code) {
    return code.split('\n').filter(l => l.trim()).slice(0, 5).join('\n');
  }

  function renderPreview(template, containerEl) {
    const code = template.previewCode || template.code;

    if (template.type === 'text') {
      containerEl.classList.add('card__preview--code');
      containerEl.textContent = previewLines(code);
      return;
    }

    // Guard: if KaTeX bundle didn't load, fall back to monospace immediately
    if (typeof window.katex === 'undefined') {
      containerEl.classList.add('card__preview--code');
      containerEl.textContent = previewLines(code);
      return;
    }

    try {
      containerEl.innerHTML = katex.renderToString(code, {
        displayMode:  template.displayMode,
        throwOnError: true,   // throw so the catch block can show code fallback
        strict:       false
      });
      // Scale the rendered math to fill the card preview box.
      // Only applies to card previews (not the modal live preview).
      if (containerEl.classList.contains('card__preview')) {
        requestAnimationFrame(() => scaleKatexToFit(containerEl));
      }
    } catch (err) {
      containerEl.classList.add('card__preview--code');
      containerEl.textContent = previewLines(code);
    }
  }

  // Scales the .katex element inside a card preview to fit the available space.
  // Upscales only when there is significant empty room (capped at 1.5×),
  // and downscales when content overflows. Ignored for marginal differences.
  function scaleKatexToFit(containerEl, _retried) {
    const katexEl = containerEl.querySelector('.katex');
    if (!katexEl) return;

    // Reset any prior transform so we measure at natural rendered size
    katexEl.style.transform = 'none';

    const cw = containerEl.clientWidth;
    const ch = containerEl.clientHeight;
    if (!cw || !ch) {
      // Layout not ready yet — retry once after the next frame
      if (!_retried) requestAnimationFrame(() => scaleKatexToFit(containerEl, true));
      return;
    }

    // scrollWidth/Height give the unclipped content size even with overflow:hidden
    const kw = katexEl.scrollWidth;
    const kh = katexEl.scrollHeight;
    if (!kw || !kh) return;

    const pad = 10; // visual breathing room (px)
    const scale = Math.min(
      (cw - pad) / kw,
      (ch - pad) / kh,
      1.5   // subtle: never upscale more than 1.5×
    );

    // Only apply a transform when it makes a meaningful difference (>8% up, >5% down)
    if (scale > 1.08 || scale < 0.95) {
      katexEl.style.transformOrigin = 'center center';
      katexEl.style.transform = `scale(${Math.max(scale, 0.25)})`;
    }
  }


  // ══════════════════════════════════════════════════════════════
  // LIVE PREVIEW (Modal)
  // Debounced 300ms so KaTeX only runs after the user pauses typing.
  // ══════════════════════════════════════════════════════════════

  let previewDebounce = null;

  function updateModalPreview() {
    clearTimeout(previewDebounce);
    previewDebounce = setTimeout(() => {
      const code = modalCode.value.trim();
      modalPreview.innerHTML = '';
      modalPreview.className = 'modal__preview';
      if (!code) return;

      const type = detectType(code);
      if (type === 'text') {
        modalPreview.classList.add('card__preview--code');
        modalPreview.style.fontSize = '11px';
        modalPreview.textContent = code;
        return;
      }

      try {
        modalPreview.innerHTML = katex.renderToString(code, {
          displayMode:  true,
          throwOnError: true,
          strict:       false
        });
      } catch (err) {
        modalPreview.classList.add('card__preview--code');
        modalPreview.textContent = code;
      }
    }, 300);
  }

  modalCode.addEventListener('input', () => {
    updateModalPreview();
    checkDuplicate();
  });


  // ══════════════════════════════════════════════════════════════
  // DELETE CONFIRMATION
  // Shows an inline overlay on the card with Yes / No buttons.
  // Only calls onConfirm() if the user clicks Yes.
  // ══════════════════════════════════════════════════════════════

  function showDeleteConfirm(card, onConfirm) {
    if (card.querySelector('.delete-confirm')) return;

    const overlay = document.createElement('div');
    overlay.className = 'delete-confirm';
    overlay.innerHTML = `
      <span class="delete-confirm__text">Delete?</span>
      <div class="delete-confirm__btns">
        <button class="delete-confirm__yes">Yes</button>
        <button class="delete-confirm__no">No</button>
      </div>
    `;

    overlay.querySelector('.delete-confirm__yes').addEventListener('click', (e) => {
      e.stopPropagation();
      onConfirm();
    });
    overlay.querySelector('.delete-confirm__no').addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.remove();
    });

    // Dismiss when clicking anywhere outside this overlay
    function onOutsideClick(e) {
      if (!overlay.contains(e.target)) {
        overlay.remove();
        document.removeEventListener('click', onOutsideClick, true);
      }
    }
    // Use capture so it fires before stopPropagation on other handlers
    setTimeout(() => document.addEventListener('click', onOutsideClick, true), 0);

    card.appendChild(overlay);
  }


  // ══════════════════════════════════════════════════════════════
  // CARD FACTORY
  // Builds a single card DOM element for a snippet or template.
  // isCustom=true adds the delete (×) button.
  // ══════════════════════════════════════════════════════════════

  function createCard(snippet, isCustom = false) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Copy ${snippet.name}`);

    const preview = document.createElement('div');
    preview.className = 'card__preview';

    const name = document.createElement('div');
    name.className = 'card__name';
    name.textContent = snippet.name;

    let tooltipTimer = null;
    name.addEventListener('mouseenter', () => {
      if (name.scrollWidth <= name.clientWidth) return;
      tooltipTimer = setTimeout(() => {
        const rect = name.getBoundingClientRect();
        nameTooltip.textContent = snippet.name;
        nameTooltip.style.left = `${rect.left + rect.width / 2}px`;
        nameTooltip.style.top  = `${rect.top}px`;
        nameTooltip.classList.add('name-tooltip--visible');
      }, 600);
    });
    name.addEventListener('mouseleave', () => {
      clearTimeout(tooltipTimer);
      nameTooltip.classList.remove('name-tooltip--visible');
    });

    renderPreview(snippet, preview);
    card.appendChild(preview);
    card.appendChild(name);

    // Click copies the LaTeX to clipboard (unless clicking edit, delete, or delete confirm is open)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card__delete')) return;
      if (e.target.closest('.card__edit')) return;
      if (e.target.closest('.card__pin'))   return;
      if (card.querySelector('.delete-confirm')) return;
      copyToClipboard(snippet);
    });

    // Keyboard: Enter/Space copies; arrow keys navigate between cards
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!e.target.closest('.card__delete') && !e.target.closest('.card__edit') &&
            !e.target.closest('.card__pin')    &&
            !card.querySelector('.delete-confirm')) {
          copyToClipboard(snippet);
        }
      }
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const grid  = card.closest('.card-grid');
        const cards = grid ? Array.from(grid.querySelectorAll('.card')) : [];
        const idx   = cards.indexOf(card);
        const cols  = viewMode === 'compact' ? 3 : 2;
        const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
        const next  = cards[idx + delta];
        if (next) next.focus();
      }
    });

    // Drag-to-reorder — custom cards only
    if (isCustom) {
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-snippet-id', snippet.id);

      card.addEventListener('dragstart', (e) => {
        dragSrcId = snippet.id;
        e.dataTransfer.effectAllowed = 'move';

        // Draw a clean rounded-rect canvas as the drag ghost to avoid the
        // browser rendering border-radius corners as filled squares.
        // The canvas must be briefly in the DOM for setDragImage to work.
        const w = card.offsetWidth;
        const h = card.offsetHeight;
        const r = 14;
        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        canvas.style.cssText = 'position:fixed;top:-9999px;left:-9999px;pointer-events:none;';
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.arcTo(w, 0, w, h, r);
        ctx.arcTo(w, h, 0, h, r);
        ctx.arcTo(0, h, 0, 0, r);
        ctx.arcTo(0, 0, w, 0, r);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(5,150,105,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        document.body.appendChild(canvas);
        e.dataTransfer.setDragImage(canvas, e.offsetX, e.offsetY);

        requestAnimationFrame(() => {
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          card.classList.add('card--dragging');
        });
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('card--dragging');
        document.querySelectorAll('.card--drag-over')
          .forEach(c => c.classList.remove('card--drag-over'));
        dragSrcId = null;
      });

      card.addEventListener('dragover', (e) => {
        if (!dragSrcId || dragSrcId === snippet.id) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        card.classList.add('card--drag-over');
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('card--drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('card--drag-over');
        if (!dragSrcId || dragSrcId === snippet.id) return;

        const srcIdx = customSnippets.findIndex(s => s.id === dragSrcId);
        const tgtIdx = customSnippets.findIndex(s => s.id === snippet.id);
        if (srcIdx === -1 || tgtIdx === -1) return;

        const [moved] = customSnippets.splice(srcIdx, 1);
        customSnippets.splice(tgtIdx, 0, moved);

        setSortOrder('custom');
        saveUIState();
        saveCustomSnippets();
        renderCustomGrid();
      });
    }

    // Pin button — library cards (no edit/delete)
    if (!isCustom) {
      const isPinned = pinnedTemplates.includes(snippet.name);
      if (isPinned) card.classList.add('card--pinned');
      const pin = document.createElement('button');
      pin.className = 'card__pin' + (isPinned ? ' card__pin--active' : '');
      pin.innerHTML = ICON_PIN;
      pin.setAttribute('aria-label', isPinned ? `Unpin ${snippet.name}` : `Pin ${snippet.name}`);
      pin.addEventListener('click', (e) => { e.stopPropagation(); togglePinnedTemplate(snippet.name); });
      card.appendChild(pin);
    }

    // Edit + delete + pin buttons — custom cards only
    if (isCustom) {
      if (snippet.pinned) card.classList.add('card--pinned');

      // Edit button (top-left)
      const edit = document.createElement('button');
      edit.className = 'card__edit';
      edit.innerHTML = ICON_PENCIL;
      edit.setAttribute('aria-label', `Edit ${snippet.name}`);
      edit.addEventListener('click', (e) => { e.stopPropagation(); openModal(snippet); });
      card.appendChild(edit);

      // Delete button (top-right)
      const del = document.createElement('button');
      del.className = 'card__delete';
      del.innerHTML = '&times;';
      del.setAttribute('aria-label', `Delete ${snippet.name}`);
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        showDeleteConfirm(card, () => deleteSnippet(snippet.id));
      });
      card.appendChild(del);

      // Pin button (bottom-right) — floats snippet to top of grid
      const pin = document.createElement('button');
      pin.className = 'card__pin' + (snippet.pinned ? ' card__pin--active' : '');
      pin.innerHTML = ICON_PIN;
      pin.setAttribute('aria-label', snippet.pinned ? `Unpin ${snippet.name}` : `Pin ${snippet.name}`);
      pin.addEventListener('click', (e) => { e.stopPropagation(); togglePin(snippet.id); });
      card.appendChild(pin);
    }

    return card;
  }


  // ══════════════════════════════════════════════════════════════
  // GRID RENDERING
  // Clears the grid and rebuilds it from the current snippet/template
  // list, filtered by the active folder if one is selected.
  // ══════════════════════════════════════════════════════════════

  function renderTemplatesGrid() {
    templatesGrid.innerHTML = '';
    let list = activeFolderTemplates
      ? window.TEMPLATES.filter(t => t.folder === activeFolderTemplates)
      : window.TEMPLATES;
    if (searchQuery) list = list.filter(matchesSearch);
    if (customSortOrder === 'alpha') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Custom order: sort by position in the curated TEMPLATE_PRIORITY list;
      // anything not listed falls through at the end in its original array order.
      list = [...list].sort((a, b) => {
        const ia = TEMPLATE_PRIORITY.indexOf(a.name);
        const ib = TEMPLATE_PRIORITY.indexOf(b.name);
        const pa = ia === -1 ? 99999 : ia;
        const pb = ib === -1 ? 99999 : ib;
        return pa - pb;
      });
    }
    // Pinned templates always float to the top within their sort order
    const pinnedList   = list.filter(t =>  pinnedTemplates.includes(t.name));
    const unpinnedList = list.filter(t => !pinnedTemplates.includes(t.name));
    list = [...pinnedList, ...unpinnedList];

    list.forEach(t => {
      try { templatesGrid.appendChild(createCard(t, false)); }
      catch (e) { console.warn('TexVault: failed to render template card', t.name, e); }
    });
  }

  function renderCustomGrid() {
    customGrid.innerHTML = '';
    let list = activeFolderCustom
      ? customSnippets.filter(s => s.folderId === activeFolderCustom)
      : customSnippets;
    if (searchQuery) list = list.filter(matchesSearch);
    if (customSortOrder === 'alpha') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    // Pinned snippets always float to the top within their sort order
    const pinned   = list.filter(s =>  s.pinned);
    const unpinned = list.filter(s => !s.pinned);
    list = [...pinned, ...unpinned];
    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = searchQuery
        ? '<p class="empty-state__title">No results</p><p class="empty-state__sub">Try a different search term.</p>'
        : '<p class="empty-state__title">No snippets yet</p><p class="empty-state__sub">Hit the + button to add your first snippet.</p>';
      customGrid.appendChild(empty);
      return;
    }

    list.forEach(s => {
      try { customGrid.appendChild(createCard(s, true)); }
      catch (e) { console.warn('TexVault: failed to render custom card', s.name, e); }
    });
  }


  // ══════════════════════════════════════════════════════════════
  // FOLDER SIDEBAR
  // Slides in from the right as an absolute overlay over the panels.
  //
  // Two modes:
  //   Templates tab — read-only predefined folders (TEMPLATE_FOLDERS)
  //   Custom tab    — user-created folders + "New Folder" button
  //
  // Selecting a folder filters the card grid to only show matching cards.
  // "All" is always the first item and shows everything.
  // ══════════════════════════════════════════════════════════════

  function openSidebar() {
    sidebarOpen = true;
    folderSidebar.classList.add('folder-sidebar--open');
    folderSidebar.setAttribute('aria-hidden', 'false');
    folderToggle.classList.add('btn-icon--active');
    fabNew.classList.add('fab--hidden');
    renderFolderSidebar();
    // User found the sidebar — dismiss the tip if it's showing
    if (folderTip.classList.contains('tab-tip--visible')) dismissFolderTip();
  }

  function closeSidebar() {
    sidebarOpen = false;
    folderSidebar.classList.remove('folder-sidebar--open');
    folderSidebar.setAttribute('aria-hidden', 'true');
    folderToggle.classList.remove('btn-icon--active');
    // Restore FAB if we're on the custom tab
    if (activeTab === 'custom') fabNew.classList.remove('fab--hidden');
  }

  folderToggle.addEventListener('click', () =>
    sidebarOpen ? closeSidebar() : openSidebar()
  );

  // Clicking anywhere outside the sidebar (except the header) closes it.
  // The folder-toggle is already handled above; we skip it here so the
  // toggle doesn't trigger closeSidebar AND then immediately re-open.
  // We also skip when the folder management modal is open — it overlays
  // everything, and closing the sidebar behind it would be surprising.
  document.addEventListener('click', (e) => {
    if (!sidebarOpen) return;
    if (folderSidebar.contains(e.target)) return;    // inside sidebar
    if (e.target.closest('.header')) return;          // header bar — excluded
    if (e.target.closest('#folder-toggle')) return;   // toggle handles itself
    if (folderModalOverlay.classList.contains('folder-modal-overlay--visible')) return;
    closeSidebar();
  });

  function renderFolderSidebar() {
    folderList.innerHTML = '';

    if (activeTab === 'templates') {
      // Templates: read-only predefined folders, no edit/new buttons
      folderNewBtn.style.display  = 'none';
      folderEditBtn.style.display = 'none';

      appendFolderItem('All', activeFolderTemplates === null, window.TEMPLATES.length, () => {
        activeFolderTemplates = null;
        saveUIState();
        renderFolderSidebar();
        renderTemplatesGrid();
        updateFolderIndicator();
      });

      TEMPLATE_FOLDERS.forEach(f => {
        const count = window.TEMPLATES.filter(t => t.folder === f.id).length;
        appendFolderItem(f.name, activeFolderTemplates === f.id, count, () => {
          activeFolderTemplates = f.id;
          saveUIState();
          renderFolderSidebar();
          renderTemplatesGrid();
          updateFolderIndicator();
        });
      });

    } else {
      // Custom: user folders + edit + new buttons
      folderNewBtn.style.display  = '';
      folderEditBtn.style.display = '';

      // Edit button is only active when a real folder is selected (not "All")
      folderEditBtn.disabled = activeFolderCustom === null;

      appendFolderItem('All', activeFolderCustom === null, customSnippets.length, () => {
        activeFolderCustom = null;
        saveUIState();
        renderFolderSidebar();
        renderCustomGrid();
        updateFolderIndicator();
      });

      customFolders.forEach(f => {
        const count = customSnippets.filter(s => s.folderId === f.id).length;
        appendFolderItem(f.name, activeFolderCustom === f.id, count, () => {
          activeFolderCustom = f.id;
          saveUIState();
          renderFolderSidebar();
          renderCustomGrid();
          updateFolderIndicator();
        });
      });
    }
  }

  // Creates and appends a single folder row to the folder list.
  // stopPropagation prevents the document outside-click handler from
  // firing after renderFolderSidebar() removes this element from the DOM
  // (once detached, folderSidebar.contains(e.target) returns false).
  function appendFolderItem(name, isActive, count, onClick) {
    const item = document.createElement('div');
    item.className = 'folder-item' + (isActive ? ' folder-item--active' : '');

    const label = document.createElement('span');
    label.className = 'folder-item__name';
    label.textContent = name;

    const badge = document.createElement('span');
    badge.className = 'folder-item__count';
    badge.textContent = count;

    item.appendChild(label);
    item.appendChild(badge);
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    folderList.appendChild(item);
  }

  // "New Folder" — opens the folder management popup in "new" mode.
  folderNewBtn.addEventListener('click', () => openFolderModal('new'));

  // "Edit Folder" — opens the folder management popup in "edit" mode,
  // pre-filled with the selected folder's current name.
  folderEditBtn.addEventListener('click', () => {
    if (!activeFolderCustom) return;
    openFolderModal('edit');
  });


  // ══════════════════════════════════════════════════════════════
  // FOLDER MANAGEMENT MODAL
  // Shared popup for the "New Folder" and "Edit Folder" sidebar flows.
  // mode: 'new'  → title "New Folder", no delete button, save says "Create"
  // mode: 'edit' → title "Edit Folder", delete button visible, save says "Save"
  // ══════════════════════════════════════════════════════════════

  function openFolderModal(mode) {
    folderModalMode = mode;

    if (mode === 'edit') {
      const folder = customFolders.find(f => f.id === activeFolderCustom);
      if (!folder) return;
      folderModalTitle.textContent   = 'Edit Folder';
      folderModalName.value          = folder.name;
      folderModalSave.textContent    = 'Save';
      folderModalDelete.style.display = '';
    } else {
      folderModalTitle.textContent   = 'New Folder';
      folderModalName.value          = '';
      folderModalSave.textContent    = 'Create';
      folderModalDelete.style.display = 'none';
    }

    folderModalOverlay.classList.add('folder-modal-overlay--visible');
    folderModalOverlay.setAttribute('aria-hidden', 'false');
    removeTrap = installFocusTrap(folderModalOverlay.querySelector('.folder-modal'));
    folderModalName.focus();
    folderModalName.select();
  }

  function closeFolderModal() {
    if (removeTrap) { removeTrap(); removeTrap = null; }
    folderModalOverlay.classList.remove('folder-modal-overlay--visible');
    folderModalOverlay.setAttribute('aria-hidden', 'true');
  }

  folderModalCancel.addEventListener('click', closeFolderModal);

  folderModalSave.addEventListener('click', () => {
    const name = folderModalName.value.trim();
    if (!name) {
      folderModalName.style.borderColor = 'var(--danger)';
      setTimeout(() => { folderModalName.style.borderColor = ''; }, 1200);
      return;
    }

    if (folderModalMode === 'new') {
      const folder = { id: Date.now().toString(), name };
      customFolders.push(folder);
      // Don't auto-navigate — new folder is empty, stay where the user is
    } else {
      const folder = customFolders.find(f => f.id === activeFolderCustom);
      if (folder) folder.name = name;
    }

    saveCustomFolders();
    saveUIState();
    renderCustomGrid();
    updateFolderIndicator();
    if (sidebarOpen) renderFolderSidebar();
    closeFolderModal();

  });

  folderModalDelete.addEventListener('click', () => {
    const id = activeFolderCustom;
    if (!id) { closeFolderModal(); return; }

    // Unassign all snippets in this folder
    customSnippets.forEach(s => { if (s.folderId === id) s.folderId = null; });
    customFolders = customFolders.filter(f => f.id !== id);
    activeFolderCustom = null;

    saveCustomFolders();
    saveCustomSnippets();
    saveUIState();
    renderCustomGrid();
    updateFolderIndicator();
    if (sidebarOpen) renderFolderSidebar();
    closeFolderModal();
  });

  // Enter key in the folder name input triggers save
  folderModalName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); folderModalSave.click(); }
    if (e.key === 'Escape') { closeFolderModal(); }
  });

  // Clicks inside the folder modal (including backdrop) must never bubble to
  // the document handler — otherwise closeFolderModal() removes the visible
  // class first, the guard check fails, and the sidebar closes behind the modal.
  folderModalOverlay.addEventListener('click', (e) => {
    e.stopPropagation();   // stop here — never reach document click handler
    if (e.target === folderModalOverlay) closeFolderModal();   // backdrop = cancel
  });

  // Escape key closes whichever modal is topmost
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (folderModalOverlay.classList.contains('folder-modal-overlay--visible')) {
        closeFolderModal();
      } else if (modalOverlay.classList.contains('modal-overlay--visible')) {
        closeModal();
      }
    }
  });


  // ══════════════════════════════════════════════════════════════
  // CHROME STORAGE
  // chrome.storage.sync persists data across devices on the same Google account.
  // All reads are async — we render inside the callback, not after it.
  // ══════════════════════════════════════════════════════════════

  function loadCustomSnippets() {
    chrome.storage.sync.get(['customSnippets', 'customFolders', 'pinnedTemplates', 'uiState', 'appSettings'], (result) => {
      customSnippets  = result.customSnippets  || [];
      customFolders   = result.customFolders   || [];
      pinnedTemplates = result.pinnedTemplates || [];
      if (result.appSettings) {
        appSettings = { ...appSettings, ...result.appSettings };
      }
      // Apply restored settings to the settings panel controls
      settingAutopaste.checked = appSettings.autoPaste;
      applyTheme();

      // Restore persisted UI state if available
      const ui = result.uiState || {};
      if (ui.activeFolderCustom    !== undefined) activeFolderCustom    = ui.activeFolderCustom;
      if (ui.activeFolderTemplates !== undefined) activeFolderTemplates = ui.activeFolderTemplates;

      // Restore last active tab. On first launch ui.activeTab is undefined,
      // so activeTab stays 'custom' (the default set at the top of state).
      if (ui.activeTab) {
        activeTab = ui.activeTab;
        tabs.forEach(t => t.classList.toggle('tab--active', t.dataset.tab === activeTab));
        panels.forEach(p => p.classList.toggle('panel--active', p.id === `panel-${activeTab}`));
        updateSortToggleVisibility();
        updateSearchCreateVisibility();
      }


      // Render grids with restored folder filters applied
      renderCustomGrid();
      renderTemplatesGrid();

      // Apply view mode AFTER grids exist so the CSS class lands on real elements
      if (ui.viewMode) setViewMode(ui.viewMode);
      if (ui.customSortOrder) setSortOrder(ui.customSortOrder);

      if (sidebarOpen) renderFolderSidebar();
      updateFolderIndicator();   // show indicator if a folder was restored

      // Check if the popup was opened via the right-click context menu.
      // If so, pre-fill the snippet modal with the selected text and open it.
      chrome.storage.local.get('pendingSnippet', (local) => {
        if (local.pendingSnippet) {
          chrome.storage.local.remove('pendingSnippet');
          switchTab('custom');
          openModal(null, local.pendingSnippet);
          return;
        }

        // Show first-launch tip if user has no snippets yet and hasn't seen it.
        if (customSnippets.length === 0 && !appSettings.hasSeenTip) {
          setTimeout(showOnboardTip, 400);
        }
      });

      // The popup's initial layout isn't complete when the storage callback fires,
      // so the per-card requestAnimationFrame in renderPreview reads 0 dimensions.
      // A short setTimeout gives the browser time to finish layout before we measure.
      setTimeout(() => {
        document.querySelectorAll('.card__preview').forEach(scaleKatexToFit);
      }, 60);
    });
  }

  // Wrapper around chrome.storage.sync.set that catches quota errors and shows
  // an actionable toast instead of silently dropping the write.
  function safeSyncSet(data) {
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        const msg = chrome.runtime.lastError.message || '';
        if (msg.toLowerCase().includes('quota')) {
          showToast('Storage full — export & delete old snippets', 4000);
        } else {
          showToast('Save failed — please try again', 3000);
        }
      }
    });
  }

  function saveCustomSnippets() {
    safeSyncSet({ customSnippets });
  }

  function saveCustomFolders() {
    safeSyncSet({ customFolders });
  }

  function savePinnedTemplates() {
    safeSyncSet({ pinnedTemplates });
  }

  function togglePinnedTemplate(name) {
    const idx = pinnedTemplates.indexOf(name);
    if (idx === -1) pinnedTemplates.push(name);
    else pinnedTemplates.splice(idx, 1);
    savePinnedTemplates();
    renderTemplatesGrid();
  }

  // Persists tab, view mode, and active folder for each tab across popup sessions
  function saveUIState() {
    safeSyncSet({
      uiState: { viewMode, activeTab, activeFolderCustom, activeFolderTemplates, customSortOrder }
    });
  }

  function deleteSnippet(id) {
    customSnippets = customSnippets.filter(s => s.id !== id);
    saveCustomSnippets();
    renderCustomGrid();
  }

  // folderId comes from the modal's folder select (null = unassigned)
  function addSnippet(name, code, folderId) {
    const snippet = {
      id:          Date.now().toString(),
      name:        name.trim(),
      code:        code.trim(),
      type:        detectType(code),
      displayMode: true,
      folderId:    folderId
    };
    customSnippets.unshift(snippet);
    saveCustomSnippets();
    renderCustomGrid();
  }

  // Updates an existing snippet in place (used by edit modal)
  function updateSnippet(id, name, code, folderId) {
    const snippet = customSnippets.find(s => s.id === id);
    if (!snippet) return;
    snippet.name        = name;
    snippet.code        = code;
    snippet.type        = detectType(code);
    snippet.displayMode = true;
    snippet.folderId    = folderId;
    saveCustomSnippets();
    renderCustomGrid();
  }


  // ══════════════════════════════════════════════════════════════
  // CLIPBOARD + TOAST
  // navigator.clipboard.writeText is the modern API.
  // The execCommand path is a deprecated fallback for edge cases.
  // ══════════════════════════════════════════════════════════════

  // copyToClipboard accepts either a full snippet object or a plain string.
  // Always writes to clipboard; also tracks recents and handles auto-paste.
  function copyToClipboard(snippetOrCode) {
    const isObj  = typeof snippetOrCode === 'object' && snippetOrCode !== null;
    const text   = isObj ? snippetOrCode.code : snippetOrCode;

    // Always write to clipboard
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy'); // intentional deprecated fallback
      document.body.removeChild(ta);
    });

    // Auto-paste or plain toast
    if (appSettings.autoPaste) {
      tryAutoPaste(text);
    } else {
      showToast('Copied!');
    }
  }

  let toastTimer = null;

  function showToast(message = 'Copied!', duration = 1800) {
    toast.textContent = message;
    // Cancel any in-progress exit before re-entering visible state
    toast.classList.remove('toast--out');
    // Force a reflow so removing --out and adding --visible are two separate frames
    void toast.offsetWidth;
    toast.classList.add('toast--visible');
    toast.setAttribute('aria-hidden', 'false');
    srAnnounce.textContent = '';
    requestAnimationFrame(() => { srAnnounce.textContent = message; });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, duration);
  }

  function hideToast() {
    toast.setAttribute('aria-hidden', 'true');
    toast.classList.add('toast--out');
    toast.addEventListener('transitionend', () => {
      toast.classList.remove('toast--visible', 'toast--out');
    }, { once: true });
  }


  // ══════════════════════════════════════════════════════════════
  // MODAL (Add Snippet form)
  // ══════════════════════════════════════════════════════════════

  // Populates the folder <select> from customFolders.
  // selectedId: the folder id to pre-select (null = "None").
  function populateModalFolderSelect(selectedId) {
    modalFolder.innerHTML = '<option value="">— None —</option>';
    customFolders.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = f.name;
      if (f.id === selectedId) opt.selected = true;
      modalFolder.appendChild(opt);
    });
  }

  // Opens the modal. Pass a snippet object to edit it, or no arg to add.
  // prefillCode: optional LaTeX string to pre-populate the code field (used by context menu).
  function openModal(snippetToEdit = null, prefillCode = null) {
    exitModalFolderCreate();   // reset any in-progress folder create state
    editingSnippetId        = snippetToEdit ? snippetToEdit.id : null;
    modalSessionFolderIds   = [];   // start fresh — track any folders created this session

    modalTitle.textContent = snippetToEdit ? 'Edit Snippet' : 'Add Snippet';
    modalName.value        = snippetToEdit ? snippetToEdit.name : '';
    modalCode.value        = snippetToEdit ? snippetToEdit.code : (prefillCode || '');
    modalPreview.innerHTML = '';
    modalPreview.className = 'modal__preview';

    // Default folder: for edit use snippet's folder; for add use active folder
    const defaultFolder = snippetToEdit ? snippetToEdit.folderId : activeFolderCustom;
    populateModalFolderSelect(defaultFolder);

    // Show preview immediately if there's code to render
    if (snippetToEdit?.code || prefillCode) updateModalPreview();

    modalOverlay.classList.add('modal-overlay--visible');
    modalOverlay.setAttribute('aria-hidden', 'false');
    removeTrap = installFocusTrap(modalOverlay.querySelector('.modal'));
    modalName.focus();
  }

  // Removes any folders that were created inline during this modal session.
  // Called on cancel so the user doesn't end up with orphaned folders.
  function purgeSessionFolders() {
    if (modalSessionFolderIds.length === 0) return;
    customFolders = customFolders.filter(f => !modalSessionFolderIds.includes(f.id));
    modalSessionFolderIds = [];
    saveCustomFolders();
    if (sidebarOpen) renderFolderSidebar();
  }

  function closeModal() {
    exitModalFolderCreate();   // reset folder create mode if open
    purgeSessionFolders();     // discard folders created-but-not-saved this session
    if (removeTrap) { removeTrap(); removeTrap = null; }
    modalOverlay.classList.remove('modal-overlay--visible');
    modalOverlay.setAttribute('aria-hidden', 'true');
    clearTimeout(previewDebounce);
    hideDupWarn();
  }

  modalCancel.addEventListener('click', closeModal);

  modalSave.addEventListener('click', () => {
    const name     = modalName.value.trim();
    const code     = modalCode.value.trim();
    const folderId = modalFolder.value || null;   // "" → null (unassigned)

    if (!name || !code) {
      if (!name) flashError(modalName);
      if (!code) flashError(modalCode);
      return;
    }

    modalSessionFolderIds = [];   // commit — keep all folders created this session

    const isNew = !editingSnippetId;

    // Navigate to the snippet's folder after saving so it's always visible.
    // null (None) navigates to All; a folder id navigates to that folder.
    activeFolderCustom = folderId;

    if (editingSnippetId) {
      updateSnippet(editingSnippetId, name, code, folderId);
    } else {
      addSnippet(name, code, folderId);
    }
    closeModal();
    switchTab('custom');
    updateFolderIndicator();

    // Show the folder sidebar tip on the user's first snippet save so they
    // know folders exist and where to find them.
    if (isNew && !sidebarOpen && !appSettings.hasSeenFolderTip) {
      setTimeout(showFolderTip, 350);
    }
  });

  // Helper to commit the folder name from the create input.
  // Extracted so both the Create button click and the blur handler can call it.
  function commitModalFolderCreate() {
    const name = modalFolderCreate.value.trim();
    exitModalFolderCreate();
    if (name) {
      const folder = { id: Date.now().toString(), name };
      customFolders.push(folder);
      modalSessionFolderIds.push(folder.id);  // remember in case modal is cancelled
      saveCustomFolders();
      populateModalFolderSelect(folder.id);   // auto-select the new folder
      if (sidebarOpen) renderFolderSidebar();
    }
  }

  // Helper: shows the dropdown, hides the create input, resets button label + style.
  function exitModalFolderCreate() {
    if (!modalFolderCreating) return;
    modalFolderCreating             = false;
    modalFolder.style.display       = '';            // show select
    modalFolderCreate.style.display = 'none';        // hide input
    modalFolderNew.textContent      = '+ New';
    modalFolderNew.classList.remove('modal__folder-new--primary');
  }

  // "+ New" / "Create" button inside the modal.
  // First click: hides the select, shows the text input, changes to "Create".
  // Second click (as "Create"): commits the new folder and restores the select.
  modalFolderNew.addEventListener('click', () => {
    if (!modalFolderCreating) {
      // Enter create mode
      modalFolderCreating             = true;
      modalFolder.style.display       = 'none';
      modalFolderCreate.style.display = 'block';     // override CSS display:none
      modalFolderCreate.value         = '';
      modalFolderNew.textContent      = 'Create';
      modalFolderNew.classList.add('modal__folder-new--primary');
      modalFolderCreate.focus();
    } else {
      // Commit via button click
      commitModalFolderCreate();
    }
  });

  // Blur-to-commit: clicking away from the input (to anything other than the
  // Create button) also locks in the folder name, just like pressing Enter.
  modalFolderCreate.addEventListener('blur', (e) => {
    // If focus moved to the Create button, let the button's click handler commit
    if (e.relatedTarget === modalFolderNew) return;
    if (!modalFolderCreating) return;
    commitModalFolderCreate();
  });

  // Enter in the create input clicks "Create"; Escape cancels without saving.
  modalFolderCreate.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); modalFolderNew.click(); }
    if (e.key === 'Escape') { e.stopPropagation(); exitModalFolderCreate(); }
  });

  function flashError(el) {
    el.style.borderColor = 'var(--danger)';
    setTimeout(() => { el.style.borderColor = ''; }, 1200);
  }

  // Close when clicking the dark backdrop behind the modal box
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });


  // ══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // setViewMode('normal') runs first so the icon button is never
  // blank — it shows immediately before the async storage read.
  // loadCustomSnippets reads storage once and handles everything:
  // rendering both grids, restoring tab/folder/view state.
  // ══════════════════════════════════════════════════════════════

  applyTheme();                       // apply system/default theme immediately (avoids flash)
  setViewMode('normal');              // placeholder icon until storage responds
  setSortOrder('custom');             // default sort icon until storage responds
  updateSortToggleVisibility();       // hide sort button on Library tab
  updateSearchCreateVisibility();     // show create button only on Custom tab
  loadCustomSnippets();               // async: restores all state + renders grids

});

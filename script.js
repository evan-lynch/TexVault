// ── Snippet data ──────────────────────────────────────────────────────────────
const snippetData = {
  custom: [
    {
      name: 'Bar chart',
      tags: ['tikz', 'graph'],
      desc: 'TikZ bar chart with axes',
      preview: 'svg-bar',
      code: `\\begin{tikzpicture}
\\begin{axis}[
  ybar,
  width=6cm,
  bar width=8pt,
  xlabel={X},
  ylabel={Y},
]
\\addplot coordinates {(1,4)(2,7)(3,2)(4,5)};
\\end{axis}
\\end{tikzpicture}`,
    },
    {
      name: '2-col layout',
      tags: ['layout', 'columns'],
      desc: 'Two column section block',
      preview: 'svg-multicol',
      code: `\\begin{multicols}{2}
Left column text goes here.
\\columnbreak
Right column text goes here.
\\end{multicols}`,
    },
    {
      name: 'Theorem box',
      tags: ['math', 'theorem'],
      desc: 'Theorem + proof environment',
      preview: '$$\\forall\\, x \\in \\mathbb{R},\\quad x^2 \\geq 0$$',
      code: `\\begin{theorem}
For all $x \\in \\mathbb{R}$, $x^2 \\geq 0$.
\\end{theorem}
\\begin{proof}
Trivial. \\qed
\\end{proof}`,
    },
    {
      name: 'Figure float',
      tags: ['figure', 'image'],
      desc: 'Centered figure with caption',
      preview: 'svg-figure',
      code: `\\begin{figure}[h]
  \\centering
  \\includegraphics[width=0.8\\linewidth]{filename}
  \\caption{Your caption here.}
  \\label{fig:yourlabel}
\\end{figure}`,
    },
  ],

  templates: [
    {
      name: 'Quadratic formula',
      tags: ['math', 'formula'],
      desc: 'Roots of ax2+bx+c=0',
      preview: '$$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$',
      code: '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$',
    },
    {
      name: 'Matrix',
      tags: ['math', 'matrix'],
      desc: '3x3 matrix environment',
      preview: '$$\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}$$',
      code: `\\begin{equation}
  \\begin{pmatrix}
    a & b & c \\\\
    d & e & f \\\\
    g & h & i
  \\end{pmatrix}
\\end{equation}`,
    },
    {
      name: 'Integral',
      tags: ['math', 'calculus'],
      desc: 'Definite integral form',
      preview: '$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$',
      code: '$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$',
    },
    {
      name: 'Summation',
      tags: ['math', 'series'],
      desc: 'Sigma summation notation',
      preview: '$$\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2}$$',
      code: '$$\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$$',
    },
    {
      name: 'Align block',
      tags: ['math', 'equations'],
      desc: 'Multi-line aligned equations',
      preview: '$$\\begin{aligned} f(x) &= x^2 + 2x \\\\ f\'(x) &= 2x + 2 \\end{aligned}$$',
      code: `\\begin{align}
  f(x)  &= x^2 + 2x \\\\
  f'(x) &= 2x + 2
\\end{align}`,
    },
    {
      name: 'BibTeX entry',
      tags: ['bib', 'cite'],
      desc: 'Article citation template',
      preview: 'svg-bib',
      code: `@article{key2024,
  author  = {Last, First},
  title   = {Article Title},
  journal = {Journal Name},
  year    = {2024},
  volume  = {1},
  pages   = {1--10},
}`,
    },
  ],
};

// ── SVG previews ──────────────────────────────────────────────────────────────

function svgBar() {
  return `<svg width="104" height="62" viewBox="0 0 104 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="14" y1="54" x2="98" y2="54" stroke="#8fa3bf" stroke-width="1"/>
    <line x1="14" y1="8" x2="14" y2="54" stroke="#8fa3bf" stroke-width="1"/>
    <rect x="19" y="38" width="14" height="16" fill="#5a7aaa" rx="1.5"/>
    <rect x="38" y="20" width="14" height="34" fill="#5a7aaa" rx="1.5"/>
    <rect x="57" y="44" width="14" height="10" fill="#5a7aaa" rx="1.5"/>
    <rect x="76" y="28" width="14" height="26" fill="#5a7aaa" rx="1.5"/>
    <text x="26" y="59" font-size="6" fill="#8fa3bf" text-anchor="middle" font-family="sans-serif">1</text>
    <text x="45" y="59" font-size="6" fill="#8fa3bf" text-anchor="middle" font-family="sans-serif">2</text>
    <text x="64" y="59" font-size="6" fill="#8fa3bf" text-anchor="middle" font-family="sans-serif">3</text>
    <text x="83" y="59" font-size="6" fill="#8fa3bf" text-anchor="middle" font-family="sans-serif">4</text>
  </svg>`;
}

function svgMulticol() {
  const leftLines = [10, 17, 24, 31, 38, 45].map(y =>
    `<rect x="8" y="${y}" width="${20 + (y % 7) * 2}" height="2.5" rx="1" fill="#b8c8d8"/>`
  ).join('');
  const rightLines = [10, 17, 24, 31, 38, 45].map(y =>
    `<rect x="60" y="${y}" width="${18 + (y % 5) * 2}" height="2.5" rx="1" fill="#b8c8d8"/>`
  ).join('');
  return `<svg width="104" height="62" viewBox="0 0 104 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="44" height="54" rx="3" fill="#eef1f7" stroke="#d4dcea" stroke-width="0.8"/>
    <rect x="56" y="4" width="44" height="54" rx="3" fill="#eef1f7" stroke="#d4dcea" stroke-width="0.8"/>
    ${leftLines}${rightLines}
  </svg>`;
}

function svgFigure() {
  return `<svg width="96" height="66" viewBox="0 0 96 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2" width="84" height="50" rx="3" fill="#eef1f7" stroke="#d4dcea" stroke-width="0.8"/>
    <rect x="12" y="8" width="72" height="38" rx="2" fill="#dce3ee"/>
    <polygon points="20,40 36,22 48,30 60,18 76,40" fill="#8fa3bf"/>
    <circle cx="40" cy="22" r="5" fill="#b8c8d8"/>
    <rect x="28" y="56" width="40" height="3" rx="1.5" fill="#c8d0e0"/>
    <rect x="36" y="61" width="24" height="2.5" rx="1" fill="#d4dcea"/>
  </svg>`;
}

function svgBib() {
  const div = document.createElement('div');
  div.style.cssText = 'font-size:8.5px;color:#5a7aaa;font-family:monospace;line-height:1.65;text-align:left;padding:4px 6px;';
  div.innerHTML = '<span style="color:#3a5a8a;font-weight:700;">@article</span>'
    + '<span style="color:#2c3a52;">{key2024,</span><br>'
    + '&nbsp;&nbsp;<span style="color:#7a9aba;">author</span> = {Last, F.},<br>'
    + '&nbsp;&nbsp;<span style="color:#7a9aba;">year</span>&nbsp;&nbsp; = {2024},<br>'
    + '<span style="color:#2c3a52;">}</span>';
  return div;
}

// ── Card builder ──────────────────────────────────────────────────────────────

function buildCard(snippet) {
  const card = document.createElement('div');
  card.className = 'snippet-card';
  card.dataset.name = snippet.name.toLowerCase();
  card.dataset.tags = snippet.tags.join(' ').toLowerCase();

  card.addEventListener('click', function (e) {
    if (e.target.classList.contains('snippet-desc')) return;
    navigator.clipboard.writeText(snippet.code).then(() => {
      flashAndToast(card);
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = snippet.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      flashAndToast(card);
    });
  });

  // Preview
  const preview = document.createElement('div');
  preview.className = 'snippet-preview';

  if (snippet.preview === 'svg-bar') {
    preview.innerHTML = svgBar();
  } else if (snippet.preview === 'svg-multicol') {
    preview.innerHTML = svgMulticol();
  } else if (snippet.preview === 'svg-figure') {
    preview.innerHTML = svgFigure();
  } else if (snippet.preview === 'svg-bib') {
    preview.appendChild(svgBib());
  } else if (snippet.preview) {
    preview.textContent = snippet.preview;
    preview.dataset.mathjax = 'pending';
  } else {
    const ph = document.createElement('div');
    ph.className = 'preview-placeholder';
    ph.textContent = 'no preview';
    preview.appendChild(ph);
  }

  // Meta
  const meta = document.createElement('div');
  meta.className = 'snippet-meta';

  const nameEl = document.createElement('div');
  nameEl.className = 'snippet-name';
  nameEl.textContent = snippet.name;

  const descEl = document.createElement('textarea');
  descEl.className = 'snippet-desc';
  descEl.rows = 1;
  descEl.value = snippet.desc;
  descEl.placeholder = 'Add description...';
  descEl.addEventListener('mousedown', e => e.stopPropagation());

  meta.appendChild(nameEl);
  meta.appendChild(descEl);

  const tagRow = document.createElement('div');
  tagRow.className = 'tag-row';
  snippet.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    tagRow.appendChild(span);
  });

  card.appendChild(preview);
  card.appendChild(meta);
  card.appendChild(tagRow);
  return card;
}

function flashAndToast(card) {
  card.classList.add('flash');
  showToast();
  setTimeout(() => card.classList.remove('flash'), 700);
}

// ── MathJax rendering ─────────────────────────────────────────────────────────

function renderPendingPreviews() {
  const pending = document.querySelectorAll('.snippet-preview[data-mathjax="pending"]');
  if (!pending.length) return;

  if (!window.MathJax || !MathJax.typesetPromise) {
    setTimeout(renderPendingPreviews, 300);
    return;
  }

  pending.forEach(el => el.removeAttribute('data-mathjax'));

  MathJax.typesetPromise(Array.from(pending)).then(() => {
    pending.forEach(el => {
      const mjx = el.querySelector('mjx-container, .MathJax');
      if (mjx) {
        mjx.style.maxWidth = '100%';
        mjx.style.overflow = 'hidden';
      }
    });
  }).catch(err => console.warn('MathJax error:', err));
}

// ── Build grids ───────────────────────────────────────────────────────────────

function buildAll() {
  const customGrid    = document.getElementById('custom-grid');
  const templatesGrid = document.getElementById('templates-grid');

  snippetData.custom.forEach(s => customGrid.appendChild(buildCard(s)));
  snippetData.templates.forEach(s => templatesGrid.appendChild(buildCard(s)));

  const mjScript = document.getElementById('MathJax-script');
  if (window.MathJax && MathJax.typesetPromise) {
    renderPendingPreviews();
  } else if (mjScript) {
    mjScript.addEventListener('load', () => setTimeout(renderPendingPreviews, 200));
    setTimeout(renderPendingPreviews, 1500);
  }
}

// ── Tab switching ─────────────────────────────────────────────────────────────

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel-tab').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-btn-' + name).classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

// ── Search / filter ───────────────────────────────────────────────────────────

function filterSnippets(val) {
  const q = val.trim().toLowerCase();
  document.querySelectorAll('.snippet-card').forEach(card => {
    const match = !q
      || card.dataset.name.includes(q)
      || card.dataset.tags.includes(q);
    card.style.display = match ? '' : 'none';
  });
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function openAddModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal-name').focus();
}

function closeAddModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  ['modal-name', 'modal-tags', 'modal-desc', 'modal-code'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function saveSnippet() {
  const name = document.getElementById('modal-name').value.trim();
  const code = document.getElementById('modal-code').value.trim();

  if (!name || !code) {
    alert('Please enter a name and some LaTeX code.');
    return;
  }

  const tags = document.getElementById('modal-tags').value
    .split(',').map(t => t.trim()).filter(Boolean);
  const desc = document.getElementById('modal-desc').value.trim() || 'Custom snippet';

  const snippet = { name, tags: tags.length ? tags : ['custom'], desc, preview: null, code };
  document.getElementById('custom-grid').appendChild(buildCard(snippet));
  closeAddModal();
}

// ── Wire up all event listeners ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  buildAll();

  document.getElementById('tab-btn-custom')
    .addEventListener('click', () => switchTab('custom'));
  document.getElementById('tab-btn-templates')
    .addEventListener('click', () => switchTab('templates'));

  document.getElementById('search-input')
    .addEventListener('input', e => filterSnippets(e.target.value));

  document.getElementById('btn-add')
    .addEventListener('click', openAddModal);

  document.getElementById('btn-modal-cancel')
    .addEventListener('click', closeAddModal);

  document.getElementById('btn-modal-save')
    .addEventListener('click', saveSnippet);

  document.getElementById('modal-overlay')
    .addEventListener('click', function (e) {
      if (e.target === this) closeAddModal();
    });

  document.getElementById('btn-close')
    .addEventListener('click', () => window.close());
});
// templates.js
//
// Defines all built-in LaTeX snippets shown in the "Library" tab.
// Loaded before script.js so window.TEMPLATES is available on init.
//
// Fields:
//   name        — label shown on the card
//   code        — LaTeX copied to clipboard
//   previewCode — (optional) KaTeX-compatible override for the card preview
//   displayMode — true = block/centered math; false = inline
//   type        — "math" = KaTeX renders it; "text" = monospace fallback
//   folder      — which sidebar folder this belongs to

window.TEMPLATES = [

  // ─── Basic Math ───────────────────────────────────────────────────────────

  {
    name: "Fraction",
    code: "\\frac{a}{b}",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Square Root",
    code: "\\sqrt{x}",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "nth Root",
    code: "\\sqrt[n]{x}",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Sum",
    code: "\\sum_{n=1}^{\\infty} a_n",
    displayMode: true,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Product",
    code: "\\prod_{n=1}^{N} a_n",
    displayMode: true,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Integral",
    code: "\\int_{a}^{b} f(x)\\,dx",
    displayMode: true,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Limit",
    code: "\\lim_{x \\to \\infty} f(x)",
    displayMode: true,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Absolute Value",
    code: "\\left| x \\right|",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Norm",
    code: "\\left\\| \\mathbf{v} \\right\\|",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Floor",
    code: "\\lfloor x \\rfloor",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Ceiling",
    code: "\\lceil x \\rceil",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Plus / Minus",
    code: "a \\pm b",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Infinity",
    code: "\\infty",
    displayMode: false,
    type: "math",
    folder: "basic-math"
  },
  {
    name: "Matrix",
    code: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
    displayMode: true,
    type: "math",
    folder: "basic-math"
  },


  // ─── Calculus ─────────────────────────────────────────────────────────────

  {
    name: "Derivative",
    code: "\\frac{d}{dx} f(x)",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "nth Derivative",
    code: "\\frac{d^n f}{dx^n}",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Partial Derivative",
    code: "\\frac{\\partial f}{\\partial x}",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Mixed Partial",
    code: "\\frac{\\partial^2 f}{\\partial x\\,\\partial y}",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Double Integral",
    code: "\\iint_{D} f(x,y)\\,dA",
    displayMode: true,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Triple Integral",
    code: "\\iiint_{V} f(x,y,z)\\,dV",
    displayMode: true,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Contour Integral",
    code: "\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}",
    displayMode: true,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Gradient",
    code: "\\nabla f",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Divergence",
    code: "\\nabla \\cdot \\mathbf{F}",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Curl",
    code: "\\nabla \\times \\mathbf{F}",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Laplacian",
    code: "\\nabla^2 f",
    displayMode: false,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Chain Rule",
    code: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
    displayMode: true,
    type: "math",
    folder: "calculus"
  },
  {
    name: "FTC",
    code: "\\int_a^b f'(x)\\,dx = f(b) - f(a)",
    displayMode: true,
    type: "math",
    folder: "calculus"
  },
  {
    name: "Taylor Series",
    code: "\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
    displayMode: true,
    type: "math",
    folder: "calculus"
  },
  {
    name: "L'Hôpital's Rule",
    code: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
    displayMode: true,
    type: "math",
    folder: "calculus"
  },


  // ─── Discrete Math ────────────────────────────────────────────────────────

  {
    name: "Binomial Coeff",
    code: "\\binom{n}{k}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Binomial Theorem",
    code: "(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^k y^{n-k}",
    displayMode: true,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Permutations",
    code: "P(n,k) = \\frac{n!}{(n-k)!}",
    displayMode: true,
    type: "math",
    folder: "discrete"
  },
  {
    name: "AND",
    code: "p \\land q",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "OR",
    code: "p \\lor q",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "NOT",
    code: "\\lnot p",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Implies",
    code: "p \\Rightarrow q",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Iff",
    code: "p \\Leftrightarrow q",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "For All",
    code: "\\forall x \\in S",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Exists",
    code: "\\exists x \\in S",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Union",
    code: "A \\cup B",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Intersection",
    code: "A \\cap B",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Subset",
    code: "A \\subseteq B",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Superset",
    code: "A \\supseteq B",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Set Difference",
    code: "A \\setminus B",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Complement",
    code: "\\overline{A}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Naturals ℕ",
    code: "\\mathbb{N}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Integers ℤ",
    code: "\\mathbb{Z}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Rationals ℚ",
    code: "\\mathbb{Q}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Reals ℝ",
    code: "\\mathbb{R}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Complex ℂ",
    code: "\\mathbb{C}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Modulo",
    code: "a \\equiv b \\pmod{n}",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "GCD",
    code: "\\gcd(a,b)",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "LCM",
    code: "\\text{lcm}(a,b)",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Big-O",
    code: "O(n \\log n)",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Recurrence",
    code: "T(n) = 2T\\left(\\frac{n}{2}\\right) + O(n)",
    displayMode: true,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Summation Formula",
    code: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",
    displayMode: true,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Empty Set",
    code: "\\emptyset",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Power Set",
    code: "\\mathcal{P}(A)",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Cartesian Product",
    code: "A \\times B",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Cardinality",
    code: "|A| = n",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Big Union",
    code: "\\bigcup_{i=1}^{n} A_i",
    displayMode: true,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Big Intersection",
    code: "\\bigcap_{i=1}^{n} A_i",
    displayMode: true,
    type: "math",
    folder: "discrete"
  },
  {
    name: "XOR",
    code: "p \\oplus q",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "NAND",
    code: "p \\uparrow q",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "NOR",
    code: "p \\downarrow q",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Divides",
    code: "a \\mid b",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },
  {
    name: "Not Divides",
    code: "a \\nmid b",
    displayMode: false,
    type: "math",
    folder: "discrete"
  },


  // ─── Linear Algebra ───────────────────────────────────────────────────────

  {
    name: "Column Vector",
    code: "\\mathbf{v} = \\begin{pmatrix} v_1 \\\\ v_2 \\\\ v_3 \\end{pmatrix}",
    displayMode: true,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Dot Product",
    code: "\\mathbf{u} \\cdot \\mathbf{v}",
    displayMode: false,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Cross Product",
    code: "\\mathbf{u} \\times \\mathbf{v}",
    displayMode: false,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Transpose",
    code: "A^\\top",
    displayMode: false,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Inverse",
    code: "A^{-1}",
    displayMode: false,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Determinant",
    code: "\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc",
    displayMode: true,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Char. Polynomial",
    code: "\\det(A - \\lambda I) = 0",
    displayMode: true,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Eigenvalue Eq.",
    code: "A\\mathbf{v} = \\lambda \\mathbf{v}",
    displayMode: false,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Inner Product",
    code: "\\langle \\mathbf{u}, \\mathbf{v} \\rangle",
    displayMode: false,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Augmented Matrix",
    code: "\\left(\\begin{array}{cc|c} a & b & e \\\\ c & d & f \\end{array}\\right)",
    displayMode: true,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Rank-Nullity",
    code: "\\text{rank}(A) + \\text{nullity}(A) = n",
    displayMode: true,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Span",
    code: "\\text{span}\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n\\}",
    displayMode: false,
    type: "math",
    folder: "linear-algebra"
  },
  {
    name: "Projection",
    code: "\\text{proj}_{\\mathbf{u}} \\mathbf{v} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|^2} \\mathbf{u}",
    displayMode: true,
    type: "math",
    folder: "linear-algebra"
  },


  // ─── Probability ──────────────────────────────────────────────────────────

  {
    name: "Expected Value",
    code: "\\mathbb{E}[X]",
    displayMode: false,
    type: "math",
    folder: "probability"
  },
  {
    name: "Variance",
    code: "\\text{Var}(X) = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2",
    displayMode: true,
    type: "math",
    folder: "probability"
  },
  {
    name: "Std Deviation",
    code: "\\sigma = \\sqrt{\\text{Var}(X)}",
    displayMode: false,
    type: "math",
    folder: "probability"
  },
  {
    name: "Conditional Prob",
    code: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}",
    displayMode: true,
    type: "math",
    folder: "probability"
  },
  {
    name: "Bayes' Theorem",
    code: "P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)}",
    displayMode: true,
    type: "math",
    folder: "probability"
  },
  {
    name: "Normal Dist.",
    code: "X \\sim \\mathcal{N}(\\mu,\\, \\sigma^2)",
    displayMode: false,
    type: "math",
    folder: "probability"
  },
  {
    name: "Normal PDF",
    code: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\, e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}",
    displayMode: true,
    type: "math",
    folder: "probability"
  },
  {
    name: "Binomial Dist.",
    code: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}",
    displayMode: true,
    type: "math",
    folder: "probability"
  },
  {
    name: "Covariance",
    code: "\\text{Cov}(X,Y) = \\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y]",
    displayMode: true,
    type: "math",
    folder: "probability"
  },
  {
    name: "Correlation",
    code: "\\rho_{XY} = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}",
    displayMode: true,
    type: "math",
    folder: "probability"
  },


  // ─── Greek Letters ────────────────────────────────────────────────────────

  {
    name: "Alpha",
    code: "\\alpha",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Beta",
    code: "\\beta",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Gamma",
    code: "\\gamma",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Delta",
    code: "\\delta",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Epsilon",
    code: "\\epsilon",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Zeta",
    code: "\\zeta",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Eta",
    code: "\\eta",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Theta",
    code: "\\theta",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Iota",
    code: "\\iota",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Kappa",
    code: "\\kappa",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Lambda",
    code: "\\lambda",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Mu",
    code: "\\mu",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Nu",
    code: "\\nu",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Xi",
    code: "\\xi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Pi",
    code: "\\pi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Rho",
    code: "\\rho",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Sigma",
    code: "\\sigma",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Tau",
    code: "\\tau",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Upsilon",
    code: "\\upsilon",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Phi",
    code: "\\phi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Chi",
    code: "\\chi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Psi",
    code: "\\psi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Omega",
    code: "\\omega",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Gamma (Γ)",
    code: "\\Gamma",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Delta (Δ)",
    code: "\\Delta",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Theta (Θ)",
    code: "\\Theta",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Lambda (Λ)",
    code: "\\Lambda",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Sigma (Σ)",
    code: "\\Sigma",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Phi (Φ)",
    code: "\\Phi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Psi (Ψ)",
    code: "\\Psi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Omega (Ω)",
    code: "\\Omega",
    displayMode: false,
    type: "math",
    folder: "greek"
  },
  {
    name: "Pi (Π)",
    code: "\\Pi",
    displayMode: false,
    type: "math",
    folder: "greek"
  },


  // ─── Math Environments ────────────────────────────────────────────────────

  {
    name: "Align",
    code: "\\begin{align}\n  a &= b + c \\\\\n  d &= e + f\n\\end{align}",
    previewCode: "\\begin{aligned} a &= b + c \\\\ d &= e + f \\end{aligned}",
    displayMode: true,
    type: "math",
    folder: "environments"
  },
  {
    name: "Cases",
    code: "f(x) = \\begin{cases} x & x \\geq 0 \\\\ -x & x < 0 \\end{cases}",
    displayMode: true,
    type: "math",
    folder: "environments"
  },
  {
    name: "pmatrix",
    code: "\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}",
    displayMode: true,
    type: "math",
    folder: "environments"
  },
  {
    name: "bmatrix",
    code: "\\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix}",
    displayMode: true,
    type: "math",
    folder: "environments"
  },
  {
    name: "vmatrix",
    code: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}",
    displayMode: true,
    type: "math",
    folder: "environments"
  },
  {
    name: "Array",
    code: "\\begin{array}{ccc}\n  a & b & c \\\\\n  d & e & f\n\\end{array}",
    displayMode: true,
    type: "math",
    folder: "environments"
  },
  {
    name: "Augmented Array",
    code: "\\left(\\begin{array}{cc|c}\n  a & b & e \\\\\n  c & d & f\n\\end{array}\\right)",
    displayMode: true,
    type: "math",
    folder: "environments"
  },
  {
    name: "Gathered",
    code: "\\begin{gathered}\n  a = b + c \\\\\n  d = e + f\n\\end{gathered}",
    previewCode: "\\begin{gathered} a = b + c \\\\ d = e + f \\end{gathered}",
    displayMode: true,
    type: "math",
    folder: "environments"
  },


  // ─── Document Structures ──────────────────────────────────────────────────

  {
    name: "Enumerate",
    code: "\\begin{enumerate}\n  \\item First\n  \\item Second\n  \\item Third\n\\end{enumerate}",
    displayMode: false,
    type: "text",
    folder: "document"
  },
  {
    name: "Itemize",
    code: "\\begin{itemize}\n  \\item One\n  \\item Two\n  \\item Three\n\\end{itemize}",
    displayMode: false,
    type: "text",
    folder: "document"
  },
  {
    name: "Table",
    code: "\\begin{tabular}{|c|c|c|}\n  \\hline\n  A & B & C \\\\\n  \\hline\n  1 & 2 & 3 \\\\\n  \\hline\n\\end{tabular}",
    displayMode: false,
    type: "text",
    folder: "document"
  },
  {
    name: "Figure",
    code: "\\begin{figure}[h]\n  \\centering\n  \\includegraphics[width=0.5\\textwidth]{file}\n  \\caption{Caption here.}\n  \\label{fig:label}\n\\end{figure}",
    displayMode: false,
    type: "text",
    folder: "document"
  },


  // ─── Symbols & Arrows ─────────────────────────────────────────────────────

  {
    name: "Right Arrow →",
    code: "\\to",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Left Arrow ←",
    code: "\\leftarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Left-Right Arrow ↔",
    code: "\\leftrightarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Implies ⇒",
    code: "\\Rightarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Implied By ⇐",
    code: "\\Leftarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Iff ⇔",
    code: "\\Leftrightarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Long Right Arrow",
    code: "\\longrightarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Long Left Arrow",
    code: "\\longleftarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Long Left-Right Arrow",
    code: "\\longleftrightarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Maps To",
    code: "f : A \\mapsto B",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Injection Arrow ↪",
    code: "\\hookrightarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Surjection Arrow ↠",
    code: "\\twoheadrightarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Up Arrow ↑",
    code: "\\uparrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Down Arrow ↓",
    code: "\\downarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Up-Down Arrow ↕",
    code: "\\updownarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Double Up Arrow ⇑",
    code: "\\Uparrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Double Down Arrow ⇓",
    code: "\\Downarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "NE Arrow ↗",
    code: "\\nearrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "SE Arrow ↘",
    code: "\\searrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "SW Arrow ↙",
    code: "\\swarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "NW Arrow ↖",
    code: "\\nwarrow",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Less or Equal ≤",
    code: "\\leq",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Greater or Equal ≥",
    code: "\\geq",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Not Equal ≠",
    code: "\\neq",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Approx ≈",
    code: "\\approx",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Sim ~",
    code: "\\sim",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Congruent ≅",
    code: "\\cong",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Much Less ≪",
    code: "\\ll",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Much Greater ≫",
    code: "\\gg",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Proportional ∝",
    code: "\\propto",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Subset ⊂",
    code: "\\subset",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Superset ⊃",
    code: "\\supset",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Not Subset ⊄",
    code: "\\not\\subset",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Element Of ∈",
    code: "x \\in A",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Not Element Of ∉",
    code: "x \\notin A",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Direct Sum ⊕",
    code: "\\oplus",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Tensor Product ⊗",
    code: "\\otimes",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Dot Product ⊙",
    code: "\\odot",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Dot ·",
    code: "\\cdot",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Times ×",
    code: "\\times",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Divide ÷",
    code: "\\div",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Centered Dots ⋯",
    code: "\\cdots",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Baseline Dots …",
    code: "\\ldots",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Vertical Dots ⋮",
    code: "\\vdots",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Diagonal Dots ⋱",
    code: "\\ddots",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Therefore ∴",
    code: "\\therefore",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Because ∵",
    code: "\\because",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "QED □",
    code: "\\square",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "QED ■",
    code: "\\blacksquare",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Angle ∠",
    code: "\\angle ABC",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Degree °",
    code: "90^\\circ",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Parallel ∥",
    code: "\\parallel",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Perpendicular ⊥",
    code: "\\perp",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },
  {
    name: "Unique Exists ∃!",
    code: "\\exists!\\, x \\in S",
    displayMode: false,
    type: "math",
    folder: "symbols"
  },


  // ─── Proofs ───────────────────────────────────────────────────────────────

  {
    name: "Therefore ∴",
    code: "\\therefore",
    displayMode: false,
    type: "math",
    folder: "proofs"
  },
  {
    name: "Because ∵",
    code: "\\because",
    displayMode: false,
    type: "math",
    folder: "proofs"
  },
  {
    name: "QED ■",
    code: "\\blacksquare",
    displayMode: false,
    type: "math",
    folder: "proofs"
  },
  {
    name: "Implies Chain",
    code: "\\begin{aligned}\n  &P \\\\\n  \\Rightarrow\\;& Q \\\\\n  \\Rightarrow\\;& R\n\\end{aligned}",
    previewCode: "\\begin{aligned} &P \\\\ \\Rightarrow\\;& Q \\\\ \\Rightarrow\\;& R \\end{aligned}",
    displayMode: true,
    type: "math",
    folder: "proofs"
  },
  {
    name: "Iff Chain",
    code: "\\begin{aligned}\n  P &\\Leftrightarrow Q \\\\\n    &\\Leftrightarrow R\n\\end{aligned}",
    previewCode: "\\begin{aligned} P &\\Leftrightarrow Q \\\\ &\\Leftrightarrow R \\end{aligned}",
    displayMode: true,
    type: "math",
    folder: "proofs"
  },
  {
    name: "Proof",
    code: "\\begin{proof}\n  Assume $P$.\n  Then \\ldots\n  Therefore $Q$.\n\\end{proof}",
    displayMode: false,
    type: "text",
    folder: "proofs"
  }

];

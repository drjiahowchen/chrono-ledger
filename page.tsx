@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html {
  background: #070706;
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 50% -10%, rgba(201, 167, 101, 0.16), transparent 38%),
    linear-gradient(180deg, #070706 0%, #11100d 58%, #070706 100%);
  color: #f6f0df;
  font-family:
    "Noto Sans TC",
    "PingFang TC",
    "Microsoft JhengHei",
    system-ui,
    sans-serif;
  letter-spacing: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible {
  outline: 2px solid #e6d4a6;
  outline-offset: 3px;
}

.luxury-panel {
  border: 1px solid rgba(230, 212, 166, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    rgba(17, 16, 13, 0.84);
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(16px);
}

.gold-rule {
  background: linear-gradient(90deg, transparent, rgba(201, 167, 101, 0.72), transparent);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

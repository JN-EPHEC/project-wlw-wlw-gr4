<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Votre marque — Page d’accueil</title>
  <meta name="description" content="Une landing page moderne, responsive, prête à personnaliser." />
  <style>
    :root {
      --bg: #0b1020;
      --card: #11172b;
      --text: #e7ecff;
      --muted: #a8b2d1;
      --brand: #5b8cff;
      --brand-2: #7cf7e6;
      --ring: rgba(123, 191, 255, .4);
    }
    /* Reset & base */
    *, *::before, *::after { box-sizing: border-box; }
    html, body { height: 100%; }
    body { margin: 0; font: 16px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, sans-serif; color: var(--text); background: radial-gradient(1200px 800px at 80% -10%, #1b2140 0%, var(--bg) 55%);
    }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; height: auto; display: block; }

    /* Layout helpers */
    .container { width: min(1100px, 92%); margin: 0 auto; }
    .grid { display: grid; gap: 1.2rem; }
    .btn { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid transparent; padding: .85rem 1.1rem; border-radius: .9rem; font-weight: 600; cursor: pointer; transition: transform .06s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
    .btn:active { transform: translateY(1px); }
    .btn-pr
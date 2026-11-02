const renderPage = (title, message, formHtml = '') => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f3f4f6;font-family:Arial,sans-serif}
  .card{width:100%;max-width:400px;margin:16px;padding:32px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08);text-align:center}
  h2{margin:0 0 8px;color:#1f2937} p{color:#6b7280;margin:0 0 24px}
  input{width:100%;box-sizing:border-box;padding:12px;margin-bottom:18px;border:1px solid #d1d5db;border-radius:8px;font-size:16px}
  button{width:100%;padding:12px;background:#4f46e5;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer}
</style></head>
<body><div class="card"><h2>${title}</h2><p>${message}</p>${formHtml}</div></body></html>`;

export default {renderPage};


export function fillRows(scope, html, emptyHtml) {
  if (!scope) return;
  const rows = [...scope.querySelectorAll(".row")];
  scope.querySelectorAll(".ph-empty").forEach(e => e.remove());
  if (!rows.length) {
    scope.insertAdjacentHTML("beforeend", html || emptyHtml || "");
    return;
  }
  const parent = rows[0].parentElement;
  rows[0].insertAdjacentHTML("beforebegin", html || emptyHtml || "");
  rows.filter(r => r.parentElement === parent).forEach(r => r.remove());
}
export const esc = t => String(t).replace(/[&<>]/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
})[c]);
export const imp = (el, p, v) => el.style.setProperty(p, v, "important");

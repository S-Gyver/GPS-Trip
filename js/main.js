// js/components-loader.js (ตั้งชื่อไฟล์ตามใจเลย)
// ใช้โหลดแต่ละส่วนของหน้า index

function loadComponent(targetId, fileName) {
  fetch(`components/${fileName}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} while loading ${fileName}`);
      }
      return res.text();
    })
    .then(html => {
      const el = document.getElementById(targetId);
      if (!el) {
        console.error(`Element with id="${targetId}" not found in DOM`);
        return;
      }
      el.innerHTML = html;
    })
    .catch(err => console.error(`Error loading ${fileName}:`, err));
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('navbar', 'navbar.html');
  loadComponent('widget', 'widget.html');
  loadComponent('organization', 'organization.html');
  loadComponent('proposition', 'proposition.html');
  loadComponent('footer01', 'footer01.html');
  loadComponent('footer', 'footer.html');
});

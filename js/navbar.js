function loadNavbar() {
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;
    })
    .catch(err => console.error('Error loading navbar:', err));
}

document.addEventListener('DOMContentLoaded', loadNavbar);

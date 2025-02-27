const search = document.getElementById('search'); const nav = document.getElementById('nav'); const links = nav.getElementsByTagName('a');

search.addEventListener('keyup', function() { const query = search.value.toLowerCase();

for (let i = 0; i < links.length; i++) { const text = links[i].textContent.toLowerCase();
    if (text.includes(query)) {
        links[i].style.display = 'block';
      } else {
        links[i].style.display = 'none';
      }
    } });

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector('.form-control');

    searchInput.style.width = "150px";
    searchInput.style.height = "25px";
    searchInput.style.fontSize = "12px";
    searchInput.style.padding = "3px 6px";
    searchInput.style.borderRadius = "3px";
});

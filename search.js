const search = document.getElementById('search'); const nav = document.getElementById('nav'); const links = nav.getElementsByTagName('a');

search.addEventListener('keyup', function() { const query = search.value.toLowerCase();

for (let i = 0; i < links.length; i++) { const text = links[i].textContent.toLowerCase();
    if (text.includes(query)) {
        links[i].style.display = 'block';
      } else {
        links[i].style.display = 'none';
      }
    } });

search.addEventListener('input', function() {
    let minWidth = 100; 
    let newWidth = Math.max(this.value.length * 8 + 50, minWidth);
    this.style.width = newWidth + 'px';
});

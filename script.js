let allMemes = [];

async function fetchMemes() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const gridEl = document.getElementById('memeGrid');

  loadingEl.style.display = 'block';
  errorEl.style.display = 'none';
  gridEl.innerHTML = '';

  try {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data = await response.json();

    if (data.success) {
      allMemes = data.data.memes;
      displayMemes(allMemes);
    }
  } catch (err) {
    errorEl.textContent = 'Failed to load memes.';
    errorEl.style.display = 'block';
  } finally {
    loadingEl.style.display = 'none';
  }
}

function displayMemes(memes) {
  const gridEl = document.getElementById('memeGrid');
  gridEl.innerHTML = '';

  memes.forEach(meme => {
    const card = document.createElement('div');
    card.className = 'meme-card';

    card.innerHTML = `
      <span class="favorite">☆</span>
      <img src="${meme.url}" alt="${meme.name}">
      <div class="overlay">
        <p>${meme.name}</p>
      </div>
    `;

    card.onclick = () => showMemeDetails(meme);

    const fav = card.querySelector('.favorite');
    fav.onclick = (e) => {
      e.stopPropagation();
      fav.textContent = fav.textContent === "☆" ? "★" : "☆";
    };

    gridEl.appendChild(card);
  });
}

function showMemeDetails(meme) {
  alert(`Name: ${meme.name}\nURL: ${meme.url}`);
}

function getRandomMeme() {
  if (allMemes.length === 0) return;
  const random = allMemes[Math.floor(Math.random() * allMemes.length)];
  showMemeDetails(random);
}

// HOF FEATURES
document.getElementById("searchInput").addEventListener("input", applyAll);
document.getElementById("sortSelect").addEventListener("change", applyAll);
document.getElementById("filterSelect").addEventListener("change", applyAll);

function applyAll() {
  let result = [...allMemes];

  const search = document.getElementById("searchInput").value.toLowerCase();
  if (search) {
    result = result.filter(m => m.name.toLowerCase().includes(search));
  }

  const filter = document.getElementById("filterSelect").value;
  if (filter === "small") {
    result = result.filter(m => m.width < 500);
  } else if (filter === "large") {
    result = result.filter(m => m.width >= 500);
  }

  const sort = document.getElementById("sortSelect").value;
  if (sort === "az") {
    result = result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "za") {
    result = result.sort((a, b) => b.name.localeCompare(a.name));
  }

  displayMemes(result);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

window.onload = fetchMemes;
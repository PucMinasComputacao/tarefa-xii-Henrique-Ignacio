const API_KEY = "9afe49b6dc14c47d6b8a1711a9ae6c29";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w300";

async function fetchMovies(query = "") {
  let url;

  if (query.trim() !== "") {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;
  } else {
    const filter = document.getElementById("filter").value;
    url = `${BASE_URL}/movie/${filter}?api_key=${API_KEY}&language=pt-BR`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const posterPath = movie.poster_path
    ? `${IMG_BASE}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Sem+Imagem";

  const year = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "N/A";

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "—";

  const overview = movie.overview
    ? movie.overview.substring(0, 150) + (movie.overview.length > 150 ? "..." : "")
    : "Sinopse não disponível.";

  card.innerHTML = `
    <img src="${posterPath}" alt="Poster de ${movie.title}" />
    <div class="card-info">
      <h2>${movie.title}</h2>
      <p class="meta">
        <span class="year">📅 ${year}</span>
        <span class="rating">⭐ ${rating}</span>
      </p>
      <p class="overview">${overview}</p>
    </div>
  `;

  return card;
}

function renderMovies(movies) {
  const container = document.getElementById("movie-list");
  container.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}


function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text;
}

async function init() {
  showMessage("Carregando filmes...");
  try {
    const movies = await fetchMovies();
    renderMovies(movies);
  } catch (error) {
    showMessage("Erro ao carregar filmes. Verifique sua chave de API.");
    console.error(error);
  }
}

document.getElementById("btnSearch").addEventListener("click", async () => {
  const query = document.getElementById("search").value;
  showMessage("Buscando...");
  try {
    const movies = await fetchMovies(query);
    renderMovies(movies);
  } catch (error) {
    showMessage("Erro ao buscar filmes.");
    console.error(error);
  }
});

document.getElementById("search").addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    document.getElementById("btnSearch").click();
  }
});

document.getElementById("filter").addEventListener("change", async () => {
  document.getElementById("search").value = "";
  showMessage("Carregando...");
  try {
    const movies = await fetchMovies();
    renderMovies(movies);
  } catch (error) {
    showMessage("Erro ao filtrar filmes.");
    console.error(error);
  }
});

init();

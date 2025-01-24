const API_KEY = "f227f8570d7e9f8fe4165d6e947bd24a";
const moviesListDisplay = document.getElementById("moviesListDisplay");
let genreMap = {};
let favorites = loadFavoritesFromLocalStorage();

async function fetchGenres() {
  const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  genreMap = data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});
}

async function fetchMovieDetails(title, page = 1) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}&page=${page}`
  );
  if (response.ok) {
    const data = await response.json();
    return data.results.slice(0, 3);
  } else {
    console.error("Failed to fetch movie details:", response.statusText);
    return [];
  }
}

function displayMovies(movies) {
  moviesListDisplay.innerHTML = "";

  if (movies.length === 0) {
    moviesListDisplay.innerHTML = `<p class="text-gray-300 text-center">No movies found.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const genres = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");
    const isFavorited = favorites.some((fav) => fav.id === movie.id);

    const movieCard = `
            <div class="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden p-4 relative">
                <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'placeholder.jpg'}" 
                     alt="${movie.title}" 
                     class="w-full h-80 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-bold mb-2">${movie.title}</h2>
                    <p class="text-gray-300"><strong>Genre:</strong> ${genres}</p>
                    <p class="text-gray-300"><strong>Year:</strong> ${movie.release_date?.split('-')[0] || "Unknown"}</p>
                </div>
                <button 
                    onclick='toggleFavorite(${movie.id}, ${JSON.stringify(movie.title)}, ${JSON.stringify(movie.poster_path)}, ${JSON.stringify(genres)}, ${JSON.stringify(movie.release_date?.split("-")[0])})'
                    class="absolute bottom-4 right-4 text-xl bg-gray-200 rounded-full p-2 shadow-xl ${isFavorited ? "text-red-500" : "text-gray-500"
      }">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
    moviesListDisplay.innerHTML += movieCard;
  });
}

function displayFavorites() {
  const favoritesListDisplay = document.getElementById("favoritesListDisplay");
  favoritesListDisplay.innerHTML = "";

  if (favorites.length === 0) {
    favoritesListDisplay.innerHTML = `<p class="text-gray-300 text-center">No favorite movies added yet.</p>`;
    return;
  }

  const reversedFavorites = [...favorites].reverse();

  reversedFavorites.forEach((movie) => {
    const favoriteCard = `
            <div class="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden p-4 relative">
                <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'placeholder.jpg'}" 
                     alt="${movie.title}" 
                     class="w-full h-80 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-bold mb-2">${movie.title}</h2>
                    <p class="text-gray-300"><strong>Genre:</strong> ${movie.genres}</p>
                    <p class="text-gray-300"><strong>Year:</strong> ${movie.year || "Unknown"}</p>
                    <p class="text-gray-300"><strong>Watched Date:</strong> ${movie.watchedDate ? movie.watchedDate : "Not set"
      }</p>
                    <label for="watchedDate-${movie.id}" class="block text-gray-300 mt-2">Set Date:</label>
                    <input 
                        type="date" 
                        id="watchedDate-${movie.id}" 
                        class="rounded px-2 py-1 mt-1 bg-gray-200 text-gray-700"
                        onchange="setWatchedDate(${movie.id}, this.value)">
                    
                    <div class="mt-4">
                        <p class="text-gray-300"><strong>Tags:</strong> ${movie.tags.length > 0
        ? movie.tags.map((tag) => `<span class="inline-block bg-gray-200 text-gray-700 rounded px-2 py-1 mr-2">${tag}</span>`).join("")
        : "No tags yet"
      }</p>
                        <div class=" flex flex-col gap-2">
                        <input 
                            type="text" 
                            id="tagInput-${movie.id}" 
                            placeholder="Add a tag" 
                            class="rounded px-2 py-1 mt-2 text-gray-700 w-2/3"
                            onkeydown="if(event.key === 'Enter') addTag(${movie.id}, this.value)">
                        <button 
                            class="bg-transparent border-2 border-[#f99339] hover:bg-[#f99339] p-2 w-2/3" 
                            onclick="addTag(${movie.id}, document.getElementById('tagInput-${movie.id}').value)">
                            Add Tag
                        </button>
                    </div>
                    </div>
                </div>
                <button 
                    onclick='toggleFavorite(${movie.id}, ${JSON.stringify(movie.title)}, ${JSON.stringify(movie.poster_path)}, ${JSON.stringify(movie.genres)}, ${JSON.stringify(movie.year)})'
                    class="absolute bottom-4 right-4 text-xl bg-gray-200 rounded-full p-2 shadow-xl text-red-500">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
    favoritesListDisplay.innerHTML += favoriteCard;
  });
}

function setWatchedDate(movieId, date) {
  const movie = favorites.find((fav) => fav.id === movieId);
  if (movie) {
    movie.watchedDate = date || null;
    saveFavoritesToLocalStorage();
    displayFavorites();
  }
}

function addTag(movieId, tag) {
  if (!tag.trim()) return;
  const movie = favorites.find((fav) => fav.id === movieId);
  if (movie && !movie.tags.includes(tag)) {
    movie.tags.push(tag);
    saveFavoritesToLocalStorage();
    displayFavorites();
  }
  document.getElementById(`tagInput-${movieId}`).value = "";
}

function toggleFavorite(id, title, poster_path, genres, year) {
  const isFavorited = favorites.some((movie) => movie.id === id);

  if (isFavorited) {
    favorites = favorites.filter((movie) => movie.id !== id);
  } else {
    favorites.push({ id, title, poster_path, genres, year, tags: [], watchedDate: null });
  }

  saveFavoritesToLocalStorage();
  displayFavorites();

  const searchBar = document.getElementById("searchBar");
  const titleQuery = searchBar.value.trim();
  fetchMovieDetails(titleQuery, currentPage).then(displayMovies);
}

function saveFavoritesToLocalStorage() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function loadFavoritesFromLocalStorage() {
  const storedFavorites = localStorage.getItem("favorites");
  return storedFavorites ? JSON.parse(storedFavorites) : [];
}

document.getElementById("searchButton").addEventListener("click", async () => {
  const searchBar = document.getElementById("searchBar");
  const title = searchBar.value.trim();

  if (title) {
    currentPage = 1;
    const movieDetails = await fetchMovieDetails(title, currentPage);

    if (movieDetails.length > 0) {
      displayMovies(movieDetails);
    } else {
      displayMovies([]);
    }
  } else {
    alert("Please enter a movie title to search.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await fetchGenres();
  displayFavorites();
});
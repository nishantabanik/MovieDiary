const API_KEY = "f227f8570d7e9f8fe4165d6e947bd24a"; // TMDb API key
const moviesListDisplay = document.getElementById("moviesListDisplay");
const favoritesListDisplay = document.getElementById("favoritesListDisplay");
let favorites = []; // array to store favorite movies
let genreMap = {}; // to store genre ID -> name mapping

// fetch genres from TMDb API
async function fetchGenres() {
  const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  genreMap = data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});
}

// fetch movie details from TMDb API
async function fetchMovieDetails(title) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`);
    const data = await response.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
}

// display movies as cards
function displayMovies(movies) {
    moviesListDisplay.innerHTML = "";

    if (movies.length === 0) {
        moviesListDisplay.innerHTML = `<p class="text-gray-600 text-center">No movies found.</p>`;
        return;
    }

    movies.forEach(movie => {
        // map genre IDs to genre names
        const genres = movie.genre_ids.map(id => genreMap[id] || "Unknown").join(', ');

        const movieCard = `
            <div class="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden p-4 relative">
                <!-- Movie Poster -->
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" 
                     alt="${movie.title}" 
                     class="w-full h-80 object-cover">
                <!-- Movie Details -->
                <div class="p-4">
                    <h2 class="text-xl font-bold mb-2">${movie.title}</h2>
                    <p class="text-gray-600"><strong>Genre:</strong> ${genres}</p>
                    <p class="text-gray-600"><strong>Year:</strong> ${movie.release_date.split('-')[0]}</p>
                </div>
                <!-- Heart Icon to Add to Favorites -->
                <button onclick="addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}', '${genres}', '${movie.release_date.split('-')[0]}')" 
                        class="relative bottom-0 left-0 text-red-500 hover:text-red-700 text-xl bg-gray-200 rounded-full px-2 shadow-xl">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
        moviesListDisplay.innerHTML += movieCard;
    });
}

// add movie to favorites
function addToFavorites(id, title, poster, genres, year) {
    // prevent adding duplicates
    if (!favorites.some(movie => movie.id === id)) {
        favorites.push({ id, title, poster, genres, year });
        alert("Added to favorites!");
        displayFavorites();
    } else {
        alert("This movie is already in your favorites.");
    }
}

// remove movie from favorites
function removeFromFavorites(id) {
    favorites = favorites.filter(movie => movie.id !== id);
    displayFavorites();
}

// display favorites list
function displayFavorites() {
    favoritesListDisplay.innerHTML = "";

    favorites.forEach(movie => {
        const favoriteCard = `
            <div class="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden p-4 relative">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster}" 
                     alt="${movie.title}" 
                     class="w-full h-80 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-bold mb-2">${movie.title}</h2>
                    <p class="text-gray-600"><strong>Genre:</strong> ${movie.genres}</p>
                    <p class="text-gray-600"><strong>Year:</strong> ${movie.year}</p>
                </div>
                <button onclick="removeFromFavorites(${movie.id})" 
                        class="relative bottom-0 left-2 text-red-500 hover:text-red-700 text-xl bg-gray-200 rounded-full px-2 shadow-xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        favoritesListDisplay.innerHTML += favoriteCard;
    });
}

// search button click
document.getElementById("searchButton").addEventListener("click", async () => {
    const searchBar = document.getElementById("searchBar");
    const title = searchBar.value.trim();

    if (title) {
        const movieDetails = await fetchMovieDetails(title);

        if (movieDetails) {
            displayMovies([movieDetails]); // display the movie as a card
        } else {
            displayMovies([]); // show "No movies found"
        }
    } else {
        alert("Please enter a movie title.");
    }
});

fetchGenres();
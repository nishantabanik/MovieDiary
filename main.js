const API_KEY = "f227f8570d7e9f8fe4165d6e947bd24a";
const BASE_URL = "https://api.themoviedb.org/3";
const moviesContainer = document.querySelector("#movies-container");
const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");

// Fetch popular movies from TMDB API
const fetchPopularMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

// Search movies by query
const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1`
    );
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

// Render movies as cards
const renderMovies = (movies) => {
  moviesContainer.innerHTML = ""; // Clear previous content
  if (movies.length === 0) {
    moviesContainer.innerHTML =
      '<p class="text-center text-gray-400">No movies found.</p>';
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "bg-gray-900 p-4 rounded-md shadow-md hover:shadow-lg";

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = movie.title;
    img.className = "w-full h-72 object-cover rounded-md mb-4";

    const title = document.createElement("h2");
    title.textContent = movie.title;
    title.className = "text-xl font-bold mb-2";

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    releaseDate.className = "text-gray-400 text-sm";

    const addToFavoritesBtn = document.createElement("button");
    addToFavoritesBtn.textContent = "Add to Favorites";
    addToFavoritesBtn.className =
      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4";
    addToFavoritesBtn.addEventListener("click", () => {
      addToFavorites(movie);
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(releaseDate);
    card.appendChild(addToFavoritesBtn);
    moviesContainer.appendChild(card);
  });
};

// Add to Favorites Function
const addToFavorites = (movie) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const movieExists = favorites.find((fav) => fav.id === movie.id);

  if (!movieExists) {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.title} has been added to your favorites!`);
  } else {
    alert(`${movie.title} is already in your favorites!`);
  }
};

// Handle search functionality
const handleSearch = async () => {
  const query = searchBar.value.trim();
  if (!query) {
    alert("Please enter a search query.");
    return;
  }

  const searchResults = await searchMovies(query);
  if (searchResults.length === 0) {
    alert("No movies found.");
  }
  renderMovies(searchResults);
};

// Initialize homepage with popular movies
const initializeHomePage = async () => {
  const popularMovies = await fetchPopularMovies();
  renderMovies(popularMovies);
};

// Event listener for search button
searchBtn.addEventListener("click", handleSearch);

// Initialize the page on load
initializeHomePage();

const API_KEY = "f227f8570d7e9f8fe4165d6e947bd24a";
const BASE_URL = "https://api.themoviedb.org/3";
const moviesContainer = document.querySelector("#movies-container");
const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
let genres = {};

// Fetch movie genres from TMDB API
const fetchGenres = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    genres = data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching genres:", error);
    showToast("Failed to fetch genres. Please try again.", "error");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Simulate a page load time
  setTimeout(() => {
    const loader = document.getElementById("page-loader");
    if (loader) loader.style.display = "none";
  }, 2000); // Adjust the timeout as needed
});

// Fetch popular movies from TMDB API
const fetchMovies = async (query = "") => {
  try {
    const url = query
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    showToast("Failed to fetch movies. Please try again.", "error");
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

  const journal = JSON.parse(localStorage.getItem("journal")) || [];
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "bg-gray-900 p-4 rounded-md shadow-md hover:shadow-lg";

    const img = document.createElement("img");
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";
    img.alt = movie.title;
    img.className = "w-full h-72 object-cover rounded-md mb-4";

    const title = document.createElement("h2");
    title.textContent = movie.title;
    title.className = "text-xl font-bold mb-2";

    const genreList = movie.genre_ids
      .map((id) => genres[id])
      .filter(Boolean)
      .join(", ");
    const genresText = document.createElement("p");
    genresText.textContent = `Genres: ${genreList || "N/A"}`;
    genresText.className = "text-gray-400 text-sm";

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    releaseDate.className = "text-gray-400 text-sm";

    const addToJournalBtn = document.createElement("button");
    const isFavorite = journal.some((entry) => entry.id === movie.id);
    addToJournalBtn.innerHTML = isFavorite
      ? '<i class="fas fa-heart"></i>'
      : '<i class="far fa-heart"></i>'; // Check if movie is in journal
    addToJournalBtn.className =
      "bg-transparent text-[#f99339] hover:text-white text-2xl mt-4 float-right";
    addToJournalBtn.addEventListener("click", () => {
      toggleFavorite(movie, addToJournalBtn); // Add toggle functionality
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(genresText);
    card.appendChild(releaseDate);
    card.appendChild(addToJournalBtn);
    moviesContainer.appendChild(card);
  });
};

// Toggle favorite function (add/remove)
const toggleFavorite = (movie, button) => {
  const journal = JSON.parse(localStorage.getItem("journal")) || [];
  const movieExists = journal.find((entry) => entry.id === movie.id);

  if (!movieExists) {
    movie.tags = [];
    movie.watchedDate = null;
    journal.push(movie);
    localStorage.setItem("journal", JSON.stringify(journal));
    button.innerHTML = '<i class="fas fa-heart"></i>';
    showToast(`${movie.title} has been added to your favorites!`, "success");
  } else {
    const updatedJournal = journal.filter((entry) => entry.id !== movie.id);
    localStorage.setItem("journal", JSON.stringify(updatedJournal));
    button.innerHTML = '<i class="far fa-heart"></i>';
    showToast(`${movie.title} has been removed from your favorites.`, "info");
  }
};

// Initialize homepage with popular movies
const initializeHomePage = async () => {
  await fetchGenres(); // Fetch genres first
  const popularMovies = await fetchMovies();
  renderMovies(popularMovies);
};

// Search functionality
const handleSearch = async () => {
  const query = searchBar.value.trim();
  if (query) {
    const searchedMovies = await fetchMovies(query);
    renderMovies(searchedMovies);
  }
};

// Utility function to display toast messages
const showToast = (message, type) => {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background:
        type === "success"
          ? "#28a745"
          : type === "error"
          ? "#dc3545"
          : type === "info"
          ? "#17a2b8"
          : "#ffc107",
      color: "white",
      borderRadius: "8px",
      padding: "8px 16px",
    },
  }).showToast();
};

// Event listener for search button
searchBtn.addEventListener("click", handleSearch);

// Initialize the page on load
initializeHomePage();

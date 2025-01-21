// // A new line

// // Get elements
// // const API_KEY ="bc3d9519fa66d9d4905cd4faa7815a7b";
// const searchBtn = document.getElementById("searchBtn");
// const searchBox = document.getElementById("searchBox");
// const searchInput = document.getElementById("searchInput");
// const movieContainer = document.querySelector("#movie-container")

// // Toggle Search Box when clicking the search button
// searchBtn.addEventListener("click", () => {
//     searchBtn.classList.add("hidden"); // Hide search button
//     searchBox.classList.remove("hidden"); // Show search bar
//     searchInput.focus(); // Auto-focus on input
// });

// // Hide Search Box when clicking outside
// document.addEventListener("click", (event) => {
//     if (!searchBox.contains(event.target) && event.target !== searchBtn) {
//         searchBox.classList.add("hidden");
//         searchBtn.classList.remove("hidden");
//     }
// });

// // Hide Search Box when pressing "Esc"
// document.addEventListener("keydown", (event) => {
//     if (event.key === "Escape") {
//         searchBox.classList.add("hidden");
//         searchBtn.classList.remove("hidden");
//     }
// });

// const API_KEY = "bc3d9519fa66d9d4905cd4faa7815a7b";

// //async function to fetch popular movie list
// // const fetchMovie = async (id) => {
// //     const res = await fetch(`https://developer.themoviedb.org/reference/movie-popular-list?api_key=${API_KEY}`)
// //     const data = await res.json();
// //     return data;
// // }

// const movieId = 550; // Replace with the desired movie ID
// const apiKey = 'bc3d9519fa66d9d4905cd4faa7815a7b';

// // Asynchronous function to fetch movie details by ID
// const fetchMovie = async (movieId) => {
//     try {
//         // Construct the API URL with the movie ID and API key
//         const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;

//         // Make the fetch request to the TMDB API
//         const response = await fetch(url);

//         // Check if the response is successful
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         // Parse the JSON response
//         const data = await response.json();

//         // Return the movie data
//         return data;
//     } catch (error) {
//         // Log any errors that occur during the fetch
//         console.error('Error fetching movie data:', error);
//     }
// };



const API_KEY = 'f227f8570d7e9f8fe4165d6e947bd24a';
const BASE_URL = 'https://api.themoviedb.org/3';
const moviesContainer = document.querySelector('#movies-container');
const searchBar = document.querySelector('#search-bar');
const searchBtn = document.querySelector('#search-btn');

// Fetch popular movies from TMDB API
const fetchPopularMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};

// Search movies by query
const searchMovies = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

// Render movies as cards
const renderMovies = (movies) => {
    moviesContainer.innerHTML = ''; // Clear previous content
    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p class="text-center text-gray-400">No movies found.</p>';
        return;
    }

    movies.forEach((movie) => {
        const card = document.createElement('div');
        card.className = 'bg-gray-900 p-4 rounded-md shadow-md hover:shadow-lg';

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        img.className = 'w-full h-72 object-cover rounded-md mb-4';

        const title = document.createElement('h2');
        title.textContent = movie.title;
        title.className = 'text-xl font-bold mb-2';

        const releaseDate = document.createElement('p');
        releaseDate.textContent = `Release Date: ${movie.release_date}`;
        releaseDate.className = 'text-gray-400 text-sm';

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(releaseDate);
        moviesContainer.appendChild(card);
    });
};

// Handle search functionality
const handleSearch = async () => {
    const query = searchBar.value.trim();
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    const searchResults = await searchMovies(query);
    if (searchResults.length === 0) {
        alert('No movies found.');
    }
    renderMovies(searchResults);
};

// Initialize homepage with popular movies
const initializeHomePage = async () => {
    const popularMovies = await fetchPopularMovies();
    renderMovies(popularMovies);
};

// Event listener for search button
searchBtn.addEventListener('click', handleSearch);

// Initialize the page on load
initializeHomePage();



































































































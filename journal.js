const favoritesContainer = document.querySelector("#favoritesListDisplay");

// Display favorites from localStorage
const displayFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesContainer.innerHTML = favorites
    .map(
      (movie, index) => `
    <div class="bg-gray-900 p-4 rounded-md shadow-md hover:shadow-lg">
      <img class="w-full h-72 object-cover rounded-md mb-4" 
           src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
           alt="${movie.title}">
      <h2 class="text-xl font-bold mb-2">${movie.title}</h2>
      <p class="text-gray-400 text-sm">Release Date: ${movie.release_date}</p>
      <textarea class="w-full p-2 text-gray-900 rounded-md mt-4" 
                placeholder="Add your notes here" 
                onchange="saveNote(${index}, this.value)">${
        movie.note || ""
      }</textarea>
      <button class="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded" 
              onclick="removeFavorite(${movie.id})">
        Remove from Favorites
      </button>
    </div>`
    )
    .join("");
};

// Save notes to localStorage
const saveNote = (index, note) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites[index].note = note;
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

// Remove favorite movie
const removeFavorite = (id) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter((movie) => movie.id !== id);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  displayFavorites();
};

// Initialize journal page
document.addEventListener("DOMContentLoaded", displayFavorites);

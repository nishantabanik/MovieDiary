const journalMoviesContainer = document.querySelector(
  "#journal-movies-container"
);
const tagSearchBar = document.querySelector("#tag-search-bar");
const tagSearchBtn = document.querySelector("#tag-search-btn");

// Fetch favorite movies from local storage
const fetchJournalMovies = () => {
  return JSON.parse(localStorage.getItem("journal")) || [];
};

// Save updated journal to local storage
const saveJournalMovies = (movies) => {
  localStorage.setItem("journal", JSON.stringify(movies));
};

// Render movies in the journal
const renderJournalMovies = (movies) => {
  journalMoviesContainer.innerHTML = ""; // Clear previous content
  if (movies.length === 0) {
    journalMoviesContainer.innerHTML =
      '<p class="text-center text-gray-400">No movies in your journal.</p>';
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

    const tags = document.createElement("p");
    tags.textContent = `Tags: ${movie.tags.join(", ") || "None"}`;
    tags.className = "text-gray-400 text-sm";

    const watchedDate = document.createElement("p");
    watchedDate.textContent = `Watched: ${
      movie.watchedDate || "Not set"
    }`;
    watchedDate.className = "text-gray-400 text-sm";

    const tagInput = document.createElement("input");
    tagInput.type = "text";
    tagInput.placeholder = "Add tags (comma separated)";
    tagInput.className =
      "w-full p-2 rounded-md bg-gray-800 text-white mb-2";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className =
      "w-full p-2 rounded-md bg-gray-800 text-white mb-2";

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.className =
      "hover:bg-[#f99339] bg-transparent border-2 border-[#f99339] text-white px-4 py-2 rounded-md mb-2";

    updateBtn.addEventListener("click", () => {
      const updatedTags = tagInput.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      const updatedDate = dateInput.value;

      const journal = fetchJournalMovies();
      const updatedJournal = journal.map((m) =>
        m.id === movie.id
          ? {
              ...m,
              tags: updatedTags.length ? updatedTags : m.tags,
              watchedDate: updatedDate || m.watchedDate,
            }
          : m
      );

      saveJournalMovies(updatedJournal);
      renderJournalMovies(updatedJournal);
    });

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML =
      '<i class="fas fa-trash"></i>';
    removeBtn.className =
      "bg-transparent text-[#f99339] hover:text-white text-2xl mt-2 float-right rounded-md";

    removeBtn.addEventListener("click", () => {
      const journal = fetchJournalMovies();
      const updatedJournal = journal.filter((m) => m.id !== movie.id);

      saveJournalMovies(updatedJournal);
      renderJournalMovies(updatedJournal);
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(tags);
    card.appendChild(watchedDate);
    card.appendChild(tagInput);
    card.appendChild(dateInput);
    card.appendChild(updateBtn);
    card.appendChild(removeBtn);

    journalMoviesContainer.appendChild(card);
  });
};

// Handle tag search functionality
const handleTagSearch = () => {
  const query = tagSearchBar.value.trim().toLowerCase();
  if (!query) {
    renderJournalMovies(fetchJournalMovies());
    return;
  }

  const filteredMovies = fetchJournalMovies().filter((movie) =>
    movie.tags.some((tag) => tag.toLowerCase().includes(query))
  );

  renderJournalMovies(filteredMovies);
};

// Initialize journal page
const initializeJournalPage = () => {
  renderJournalMovies(fetchJournalMovies());
};

// Event listener for tag search button
tagSearchBtn.addEventListener("click", handleTagSearch);

// Initialize the page on load
initializeJournalPage();
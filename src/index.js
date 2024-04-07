document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display details of the first movie initially
    fetchMovieDetails(1);

    // Fetch all movies and display them in the menu
    fetchMovies()
        .then(movies => {
            // Display movies in the menu
            displayMovieMenu(movies);
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
        });

    // Event listener for selecting a movie from the menu
    document.querySelector("#films").addEventListener("click", event => {
        if (event.target.classList.contains("film-item")) {
            const filmId = event.target.dataset.id;
            fetchMovieDetails(filmId);
        }
    });

    // Event listener for buying tickets
    document.querySelector("#buy-ticket").addEventListener("click", () => {
        // Implement functionality to buy tickets
        buyTicket();
    });
});

// Function to fetch and display movie details
function fetchMovieDetails(movieId) {
    fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            // Display movie details including poster
            displayMovieDetails(movie);
        })
        .catch(error => {
            console.error("Error fetching movie details:", error);
        });
}

// Function to fetch all movies
function fetchMovies() {
    return fetch("http://localhost:3000/films")
        .then(response => response.json());
}

// Function to display movies in the menu
function displayMovieMenu(movies) {
    const filmsList = document.querySelector("#films");
    filmsList.innerHTML = "";
    movies.forEach(movie => {
        const listItem = document.createElement("li");
        listItem.textContent = movie.title;
        listItem.classList.add("film-item");
        listItem.dataset.id = movie.id; // Set the movie id as dataset
        filmsList.appendChild(listItem);
        // Check if movie is sold out
        if (movie.tickets_sold >= movie.capacity) {
            listItem.classList.add("sold-out");
        }
    });
}

// Function to display movie details
function displayMovieDetails(movie) {
    const movieDetailsContainer = document.querySelector("#showing");
    const ticketNumElement = document.querySelector("#ticket-num");
    const posterElement = document.querySelector("#poster");

    // Display movie details including poster
    movieDetailsContainer.innerHTML = `
        <div class="card">
            <div id="title" class="title">${movie.title}</div>
            <div id="runtime" class="meta">${movie.runtime} minutes</div>
            <div class="content">
                <div class="description">
                    <div id="film-info">${movie.description}</div>
                    <span id="showtime" class="ui label">${movie.showtime}</span>
                    <span id="ticket-num">${movie.capacity - movie.tickets_sold}</span> remaining tickets
                </div>
            </div>
            <div class="extra content">
                <button id="buy-ticket" class="ui orange button">
                    Buy Ticket
                </button>
            </div>
        </div>
    `;

    // Update poster image
    posterElement.src = movie.poster;

    // Check if tickets are sold out
    if (movie.tickets_sold >= movie.capacity) {
        ticketNumElement.textContent = "Sold Out";
        ticketNumElement.classList.add("sold-out");
        document.querySelector("#buy-ticket").disabled = true;
    }
}

// Function to buy tickets
function buyTicket() {
    const movieId = document.querySelector("#films li.selected").dataset.id;
    fetch(`http://localhost:3000/films/${movieId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tickets_sold: 1 })
    })
        .then(response => response.json())
        .then(updatedMovie => {
            // Update UI to reflect ticket purchase
            const ticketNumElement = document.querySelector("#ticket-num");
            ticketNumElement.textContent = updatedMovie.capacity - updatedMovie.tickets_sold;
            if (updatedMovie.tickets_sold >= updatedMovie.capacity) {
                ticketNumElement.textContent = "Sold Out";
                ticketNumElement.classList.add("sold-out");
                document.querySelector("#buy-ticket").disabled = true;
            }
        })
        .catch(error => {
            console.error("Error buying ticket:", error);
        });
}

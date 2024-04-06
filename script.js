const apikey = "75438b311a4f38b3ce3c52b5592f4708";

// DOM Elements
const searchButton = document.getElementById("search-button");
const searchTextElement = document.getElementById("search-text");
const cardsContainer = document.getElementById("cards-container");
const newsCardTemplate = document.getElementById("template-news-card");

// Function to handle navigation item click
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    const currentActiveNavItem = document.querySelector('.nav-item.active');

    if (currentActiveNavItem) {
        currentActiveNavItem.classList.remove('active');
    }

    navItem.classList.add('active');
}

// Event listener for search button click
searchButton.addEventListener('click', () => {
    const searchText = searchTextElement.value.trim();
    if (searchText) {
        fetchNews(searchText);
        clearActiveNavItem();
    }
});

// Initial fetch and load
window.addEventListener('load', () => {
    fetchNews("today"); // Initial load with default query
});

// Function to clear active navigation item
function clearActiveNavItem() {
    const currentActiveNavItem = document.querySelector('.nav-item.active');
    if (currentActiveNavItem) {
        currentActiveNavItem.classList.remove('active');
    }
}

// Function to fetch news based on a query
async function fetchNews(query) {
    try {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://gnews.io/api/v4/search?q=${encodedQuery}&lang=en&country=india&apikey=${apikey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.articles) {
            bindData(data.articles);
        } else {
            console.error("No articles found for the query:", query);
        }
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Function to bind fetched news data to HTML template
function bindData(articles) {
    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if (!article.image) return; // Skip articles without images

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill data in a news card template
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector(".news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.image;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });


    newsSource.innerHTML = `${article.source.name} · ${date}`; // Assuming `article.source` is an object with `name`

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

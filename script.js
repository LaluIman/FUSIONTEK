// Hamburger menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
  });

  const menuItems = document.querySelectorAll(".menu a");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      hamburger.classList.remove("active");
      menu.classList.remove("active");
    });
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
      hamburger.classList.remove("active");
      menu.classList.remove("active");
    }
  });
});

//Animation

ScrollReveal({
  reset: true,
  distance: "80px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(
  ".heading, .show-off img, .show-off-2-text, .future h1, .heading-container, .immersive-section h1, .container-news h4, .benefit-section-outer-container",
  { origin: "bottom" }
);
ScrollReveal().reveal(
  ".subheading, .first-text, .show-off-2-button, .future span, .home-detail-image, .ellipse, .container-news p, .container-comp img, .benefit-section-content",
  { origin: "bottom", delay: 800 }
);
ScrollReveal().reveal(
  ".wave, .second-text, .show-off-2-image, .subheading-container, .line, .container-button, .separator, .container-img, .benefit-section-content p, .benefit-section-content h1, .future-button",
  { origin: "bottom", delay: 1000 }
);

// API Caller

function searchWikipedia() {
    const query = document.getElementById("search-input").value;
    if (!query.trim()) {
      document.getElementById("results").innerHTML =
        "<p>Please enter a search term.</p>";
      return;
    }
  
    const formattedQuery = encodeURIComponent(`"${query}" technology`);
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${formattedQuery}&format=json&origin=*&srlimit=20`;
  
    document.getElementById("results").innerHTML =
      "<p>Searching for technology articles...</p>";
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const results = document.getElementById("results");
        results.innerHTML = "";
  
        if (!data.query || data.query.search.length === 0) {
          results.innerHTML =
            "<p>No technology results found related to your search.</p>";
          return;
        }
  
        const scoredResults = data.query.search.map((item) => {
          const title = item.title.toLowerCase();
          const snippet = item.snippet.toLowerCase();
          const searchTerms = query.toLowerCase().split(" ");
  
          let score = 0;
          if (title === query.toLowerCase()) {
            score += 100;
          }
  
          if (title.includes(query.toLowerCase())) {
            score += 50;
          }
  
          searchTerms.forEach((term) => {
            if (term.length > 2 && title.includes(term)) {
              score += 10;
            }
          });
  
          if (snippet.includes(query.toLowerCase())) {
            score += 20;
          }
  
          searchTerms.forEach((term) => {
            if (term.length > 2 && snippet.includes(term)) {
              score += 5;
            }
          });
  
          const techKeywords = {
            technology: 5,
            digital: 3,
            "virtual reality": 5,
            vr: 5,
            "augmented reality": 5,
            ar: 5,
            computer: 3,
            software: 3,
            hardware: 3,
            electronic: 2,
            innovation: 3,
            gadget: 2,
            device: 2,
            application: 2,
            internet: 2,
            ai: 4,
            "artificial intelligence": 4,
            "machine learning": 4,
            robotics: 3,
            programming: 3,
            algorithm: 3,
            network: 2,
            cybersecurity: 3,
            telecommunications: 2,
            data: 2,
            computing: 3,
            simulation: 3,
          };
  
          Object.keys(techKeywords).forEach((keyword) => {
            if (title.includes(keyword)) {
              score += techKeywords[keyword] * 2;
            }
            if (snippet.includes(keyword)) {
              score += techKeywords[keyword];
            }
          });
  
          return { ...item, score };
        });
  
        scoredResults.sort((a, b) => b.score - a.score);
  
        const relevantResults = scoredResults.filter((item) => item.score > 10);
  
        if (relevantResults.length === 0) {
          results.innerHTML = `<p>No highly relevant technology results found for "${query}". Try a more specific search term.</p>`;
          return;
        }
  
        // Create a container for all result cards
        const cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
        results.appendChild(cardContainer);
  
        // Get top results but limit to 6 to show a nice layout
        const topResults = relevantResults.slice(0, 6);
  
        let processedCount = 0;
        const totalToProcess = topResults.length;
  
        topResults.forEach((item) => {
          const pageDetailsUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            item.title
          )}&prop=categories|pageimages|extracts&pithumbsize=200&exintro=1&explaintext=1&clshow=!hidden&cllimit=5&format=json&origin=*`;
  
          fetch(pageDetailsUrl)
            .then((response) => response.json())
            .then((detailsData) => {
              const pages = detailsData.query.pages;
              const pageId = Object.keys(pages)[0];
              const page = pages[pageId];
  
              let summary = page.extract || "";
              if (summary.length > 300) {
                summary = summary.substring(0, 300) + "...";
              }
  
              let isTechRelated = true;
              let categories = [];
  
              if (page.categories) {
                categories = page.categories.map((cat) =>
                  cat.title.replace("Category:", "")
                );
                const techCategoryTerms = [
                  "Technology",
                  "Computing",
                  "Software",
                  "Hardware",
                  "Internet",
                  "Digital",
                  "Computer",
                  "Virtual reality",
                  "Augmented reality",
                  "Programming",
                  "Electronics",
                  "Artificial intelligence",
                  "Telecommunications",
                ];
  
                const hasTechCategory = techCategoryTerms.some((term) =>
                  categories.some((cat) =>
                    cat.toLowerCase().includes(term.toLowerCase())
                  )
                );
  
                if (page.categories.length > 0 && !hasTechCategory) {
                  isTechRelated = false;
                }
              }
  
              if (isTechRelated || item.score > 30) {
                let imgHtml = "";
                if (page.thumbnail && page.thumbnail.source) {
                  imgHtml = `<img src="${page.thumbnail.source}" alt="${item.title}" />`;
                }
  
                const relevanceClass =
                  item.score > 50
                    ? "high-relevance"
                    : item.score > 30
                    ? "medium-relevance"
                    : "low-relevance";
  
                const relevanceIndicator = `<span class="relevance-indicator ${relevanceClass}">
                    ${item.score > 50 ? "Highly Relevant" : item.score > 30 ? "Relevant" : "Somewhat Relevant"}
                  </span>`;
  
                const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
                  item.title.replace(/\s+/g, "_")
                )}`;
  
                // Create a card element
                const cardElement = document.createElement("div");
                cardElement.className = "card";
                cardElement.innerHTML = `
                  ${imgHtml}
                  <h2>${item.title}</h2>
                  ${relevanceIndicator}
                  <p>${summary || item.snippet}</p>
                  <a href="${wikipediaUrl}" target="_blank">Read full article</a>
                `;
  
                // Add the card to the container
                cardContainer.appendChild(cardElement);
              }
  
              processedCount++;
              if (
                processedCount === totalToProcess &&
                cardContainer.children.length === 0
              ) {
                results.innerHTML = `<p>No technology-related results found for "${query}". Try a different search term.</p>`;
              }
            })
            .catch((error) => {
              console.error("Error fetching page details:", error);
              processedCount++;
  
              const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
                item.title.replace(/\s+/g, "_")
              )}`;
  
              const cardElement = document.createElement("div");
              cardElement.className = "card";
              cardElement.innerHTML = `
                <h2>${item.title}</h2>
                <p>${item.snippet}</p>
                <a href="${wikipediaUrl}" target="_blank">Read on Wikipedia</a>
              `;
  
              cardContainer.appendChild(cardElement);
  
              if (
                processedCount === totalToProcess &&
                cardContainer.children.length === 0
              ) {
                results.innerHTML = `<p>No technology-related results found for "${query}". Try a different search term.</p>`;
              }
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        document.getElementById("results").innerHTML =
          "<p>Error retrieving search results. Please try again.</p>";
      });
  }

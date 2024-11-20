const API_URLS = {
    hp: "https://hp-api.herokuapp.com/api/characters",
    dogs: "https://dog.ceo/api/breeds/image/random/6",
    cats: "https://api.thecatapi.com/v1/images/0XYvRd7oD",
    // flags: "https://flagsapi.com/BE/flat/64.png",
};

let gameBoard = document.getElementById("gameBoard");
let selectedImages = [];
let flippedCards = [];
let matchedPairs = 0;
let themeBackground = '';

document.getElementById("startGame").addEventListener("click", startGame);

async function startGame() {
    let theme = document.getElementById("imageSet").value;
    selectedImages = [];
    gameBoard.innerHTML = "";
    matchedPairs = 0;

    if (theme === "random") {
        const themes = ["hp", "dogs", "cats"];
        theme = themes[Math.floor(Math.random() * themes.length)];
    }
    
    await loadImages(theme);
    setupBoard();
}

async function loadImages(theme) {
    try {
        let images = [];
        if (theme === "hp") {
            const res = await fetch(API_URLS.hp);
            const data = await res.json();
            images = data.slice(0, 6).map(character => character.image);
        } else if (theme === "dogs") {
            const res = await fetch(API_URLS.dogs);
            const data = await res.json();
            images = data.message;
        } else if (theme === "cats") {
            const res = await fetch(API_URLS.cats);
            const data = await res.json();
            images = data.message;
            // const flagCodes = ["US", "GB", "CA", "FR", "DE", "JP"];
            // images = flagCodes.map(code => `${API_URLS.flags}${code}.svg`);
        }

        selectedImages = [...images, ...images];
        selectedImages.sort(() => 0.5 - Math.random());
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}

function setupBoard() {
    selectedImages.forEach((src, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");

        const img = document.createElement("img");
        img.src = src;
        img.alt = "Card image";

        img.onload = () => {
            console.log('Image loaded successfully');
        };

        img.onerror = () => {
            console.error('Image failed to load:', src);
            img.src = "path_to_fallback_image";
        };

        cardBack.appendChild(img);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener("click", () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.querySelector("img").src === card2.querySelector("img").src;

    if (isMatch) {
        matchedPairs += 1;
        flippedCards = [];
        
        if (matchedPairs === selectedImages.length / 2) {
            setTimeout(() => alert("Congratulations, you won!"), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

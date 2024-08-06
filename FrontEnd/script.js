/* Variables */
const gallery = document.querySelector(".gallery");
const containerFiltres = document.querySelector(".container-filtres");

// get works
async function getworks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// display works
function displayWorks(works) {
  gallery.innerHTML = ""; // Nettoyer la galerie avant d'afficher
  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.categoryId = work.categoryId; // Ajouter l'ID de la catégorie comme attribut de données
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// get Categories
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// display butons by categories
async function displayCategoriesButtons() {
  const categories = await getCategories();

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    btn.classList.add("buttons-filtres");
    containerFiltres.appendChild(btn);
  });

  updateButtons();
  filterCategory();
}
displayCategoriesButtons();

let currentIndex = "0";

function updateButtons() {
  const listButtons = document.querySelectorAll(".buttons-filtres");
  listButtons.forEach((button) => {
    if (button.id === currentIndex) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// filter by categories
async function filterCategory() {
  const works = await getworks();
  const buttons = document.querySelectorAll(".buttons-filtres");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      currentIndex = button.id;
      if (currentIndex === "0") {
        displayWorks(works);
      } else {
        const filteredWorks = works.filter(
          (work) => work.categoryId == currentIndex
        );
        displayWorks(filteredWorks);
        console.log(filteredWorks);
      }
      updateButtons();
    });
  });
}

// Display allworks
getworks().then(displayWorks);

const tokenStorage = localStorage.getItem("token");
console.log(tokenStorage);
if (tokenStorage) {
  console.log("je suis connecté");
} else {
  console.log("je ne suis pas connecté");
}

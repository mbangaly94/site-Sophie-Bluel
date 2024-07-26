/* Variables */
const gallery = document.querySelector(".gallery");
const containerFiltres = document.querySelector(".container-filtres");

// Fonction pour obtenir les travaux
async function getworks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// Fonction pour afficher les travaux
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

// Fonction pour obtenir les catégories
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Fonction pour afficher les boutons de catégories
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

// Fonction pour filtrer les travaux par catégorie
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

// Afficher tous les travaux initiaux
getworks().then(displayWorks);

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
const adminMode = document.querySelector("#adminMode");
const btnModifier = document.querySelector(".btnModifier");
const modalViwer = document.querySelector(".dialogue");
console.log(tokenStorage);
if (tokenStorage) {
  adminMode.style.display = "flex";
  btnModifier.style.display = "flex";
  console.log("je suis connecté");
} else {
  adminMode.style.display = "none";
  btnModifier.style.display = "none";
  console.log("je ne suis pas connecté");
}

btnModifier.addEventListener("click", function () {
  modalViwer.style.display = "flex";
});

const closeIcon = document.querySelector(
  "#photoGalleryEdit .dialogueHeader i.fa-xmark"
);
closeIcon.addEventListener("click", function () {
  modalViwer.style.display = "none"; // Cache le dialogue
});
const buttonAddImage = document.querySelector("#buttonAddImage");
const imageAdd = document.querySelector("#imageAdd");
const photoGalleryEdit = document.querySelector("#photoGalleryEdit");
buttonAddImage.addEventListener("click", function () {
  photoGalleryEdit.style.display = "none";
  imageAdd.style.display = "flex";
});
const cancelBtn = document.querySelector(
  "#imageAdd .dialogueHeader i.fa-xmark"
);
const returnBtn = document.querySelector(".dialogueHeader i.fa-arrow-left");

cancelBtn.addEventListener("click", function () {
  photoGalleryEdit.style.display = "flex";
  imageAdd.style.display = "none";
});

returnBtn.addEventListener("click", function () {
  photoGalleryEdit.style.display = "flex";
  imageAdd.style.display = "none";
});

// Display modalWorks
getworks().then(displayModalWorks);
const dialogueBody = document.querySelector(".dialogueBody");

function displayModalWorks(works) {
  dialogueBody.innerHTML = "";
  works.forEach((work) => {
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    const trash = document.createElement("i");
    imgContainer.classList.add("imgContainer");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;
    img.src = work.imageUrl;
    img.alt = work.title;
    imgContainer.appendChild(img);
    imgContainer.appendChild(trash);
    dialogueBody.appendChild(imgContainer);
    // To delete work
    trash.addEventListener("click", function () {
      console.log(work.id);
      deleteWork(work.id);
    });
  });
}
// Fonction pour supprimer une œuvre via l'API
async function deleteWork(workId) {
  const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette œuvre ?");
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Si la suppression est réussie, mettre à jour l'affichage des œuvres
      getworks().then(displayModalWorks);
      alert("L'œuvre a été supprimée avec succès.");
    } else {
      alert("Erreur lors de la suppression de l'œuvre.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre :", error);
  }
}

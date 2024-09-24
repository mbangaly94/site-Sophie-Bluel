/* ---------------------------------- Variables ---------------------------------- */
const gallery = document.querySelector(".gallery");
const containerFiltres = document.querySelector(".container-filtres");
let worksFetched = [];
let currentIndex = "0";
const tokenStorage = localStorage.getItem("token");
const adminMode = document.querySelector("#adminMode");
const btnModifier = document.querySelector(".btnModifier");
const modalViwer = document.querySelector(".dialogue");
const closeIcon = document.querySelector(
  "#photoGalleryEdit .dialogueHeader i.fa-xmark"
);
const buttonAddImage = document.querySelector("#buttonAddImage");
const imageAdd = document.querySelector("#imageAdd");
const photoGalleryEdit = document.querySelector("#photoGalleryEdit");
const cancelBtn = document.querySelector(
  "#imageAdd .dialogueHeader i.fa-xmark"
);
const returnBtn = document.querySelector(".dialogueHeader i.fa-arrow-left");
const dialogueBody = document.querySelector(".dialogueBody");
const formUploadImage = document.getElementById("formUploadImage");
const imageUpload = document.getElementById("imageUpload");
const imageTitle = document.getElementById("imageTitle");
const selectCategory = document.getElementById("selectCategory");
const buttonSubmit = document.getElementById("buttonSubmit");
const previewImage = document.getElementById("previewImage");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const token = localStorage.getItem("token");

/* ---------------------------------- Functions ---------------------------------- */

// get works
const getworks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    worksFetched = data;
    return data;
  } catch (error) {
    console.error("eurreur au niveau du fetch des works", error);
  }
};

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

// display buttons by categories
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

async function filterCategory() {
  const buttons = document.querySelectorAll(".buttons-filtres");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      currentIndex = button.id;
      if (currentIndex === "0") {
        displayWorks(worksFetched);
      } else {
        const filteredWorks = worksFetched.filter(
          (work) => work.categoryId == currentIndex
        );
        displayWorks(filteredWorks);
      }
      updateButtons();
    });
  });
}

// Display all works
getworks().then(displayWorks);

// Admin mode management
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
  photoGalleryEdit.style.display = "flex";
});

// Close modal event
closeIcon.addEventListener("click", function () {
  modalViwer.style.display = "none"; // Cache le dialogue
});

// Add image button functionality
buttonAddImage.addEventListener("click", function () {
  photoGalleryEdit.style.display = "none";
  imageAdd.style.display = "flex";
  validSubmitButton();
});

cancelBtn.addEventListener("click", function () {
  modalViwer.style.display = "none";
  photoGalleryEdit.style.display = "none";
  imageAdd.style.display = "none";
});

returnBtn.addEventListener("click", function () {
  photoGalleryEdit.style.display = "flex";
  imageAdd.style.display = "none";
});

// Display modal works
getworks().then(displayModalWorks);

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

// delete work
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
      getworks().then((works) => {
        displayModalWorks(works);
        displayWorks(works);
      });

      alert("L'œuvre a été supprimée avec succès.");
    } else {
      alert("Erreur lors de la suppression de l'œuvre.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre :", error);
  }
}

// Load categories in form select dropdown
async function loadCategories() {
  const categories = await getCategories();

  selectCategory.innerHTML = "";
  const optionDefault = document.createElement("option");
  selectCategory.appendChild(optionDefault);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectCategory.appendChild(option);
  });
}

loadCategories();

// Image upload preview functionality
imageUpload.addEventListener("change", function (event) {
  previewImage.style.display = "flex";
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      hideChildren();
    };
    reader.readAsDataURL(file);
  }
});

// Hide children elements in image preview
function hideChildren() {
  const children = imageLabel.querySelectorAll(
    ":scope > *:not(#previewImage):not(input)"
  );
  children.forEach((child) => {
    child.style.display = "none";
  });
}
const validSubmitButton = () => {
  const isImageSelected = imageUpload.files.length > 0;
  const isTitleSelected = imageTitle.value.trim() !== "";
  const isCategorieSelected = selectCategory.value !== "";
  console.log("image", isImageSelected);
  if (isImageSelected && isTitleSelected && isCategorieSelected) {
    buttonSubmit.disabled = false;
  } else {
    buttonSubmit.disabled = true;
  }
  console.log("checking", buttonSubmit.disabled);
};
imageUpload.addEventListener("change", validSubmitButton);
imageTitle.addEventListener("input", validSubmitButton);
selectCategory.addEventListener("change", validSubmitButton);

// Form submission for image upload
buttonSubmit.addEventListener("click", async function (event) {
  event.preventDefault();

  if (!imageUpload.files[0] || !imageTitle.value || !selectCategory.value) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageUpload.files[0]);
  formData.append("title", imageTitle.value);
  formData.append("category", selectCategory.value);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("L'image a été ajoutée avec succès.");
      formUploadImage.reset();
      previewImage.src = "./assets/icons/picture.png";

      getworks().then((works) => {
        displayModalWorks(works);
        displayWorks(works);
      });

      photoGalleryEdit.style.display = "flex";
      imageAdd.style.display = "none";
    } else {
      alert("Erreur lors de l'ajout de l'image.");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image :", error);
    alert("Erreur lors de l'ajout de l'image.");
  }
});

// Login/logout buttons management
if (token) {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
} else {
  logoutBtn.style.display = "none";
  loginBtn.style.display = "block";
}

// Logout functionality
logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.replace("login.html");
});

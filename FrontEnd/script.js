/* Variables */
const gallery = document.querySelector(".gallery");
const body = document.querySelector("body");
const containerFiltres = document.querySelector(".container-filtres");

//fonction return le tableau des works
async function getworks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
getworks();

//display of works
async function displayWorks() {
  const arrayWorks = await getworks();
  console.log(arrayWorks);
  arrayWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    //figure.classList.add("galleryStyle");
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
  //console.log(arrayWorks);
}
displayWorks();

/***get catecories */
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
  //const responseJson = await response.json();
  //console.log(responseJson);
}
//getCategories();

/***display buttons by category** */
async function displayCategoriesButtons() {
  const categories = await getCategories();
  console.log(categories);

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    btn.classList.add("buttons-filtres");
    containerFiltres.appendChild(btn);
  });
}
displayCategoriesButtons();

async function updatebuttons() {
  const listButtons = document.querySelectorAll(".container-filtres");
  for (let index = 0; index < listButtons.length; index++) {
    const containerFiltres = listButtons[index];
    if (index === currentIndex) {
      containerFiltres.classList.add(".active");
    } else {
      containerFiltres.classList.remove(".active");
    }
  }
}

//filter button by category
async function filterCategory() {
  const project = await getworks;
  //console.log(project);
  const buttons = document.querySelectorAll(".container-filtres button");
  console.log(buttons);
}

filterCategory();

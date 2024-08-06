document.addEventListener("DOMContentLoaded", () => {
  const email = document.querySelector("form #email");
  const password = document.querySelector("form #password");
  const form = document.querySelector("form");
  const errorMsg = document.querySelector("#erreur-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMsg.textContent = ""; // Réinitialiser le message d'erreur

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token); //STORE TOKEN
        window.location.replace("index.html");
        // Traitez les données de réponse ici
        console.log(data);
      })
      .catch((error) => {
        // Afficher un message d'erreur seulement si la réponse n'est pas correcte
        errorMsg.textContent = error.message;
      });
  });
});

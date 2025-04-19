
const sections = document.querySelectorAll(".section");
function afficherSection(sectionId) {
  sections.forEach((section) => {
    section.classList.remove("section--active");
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("section--active");
  }
}

document.querySelectorAll(".barre-laterale__item").forEach((item) => {
  item.addEventListener("click", () => {
    const section = item.getAttribute("data-section");
    if (section) {
      afficherSection(section);
      if (section === "jeu-de-typing") {
        startTest();
      }
    }
  });
});

document
  .getElementById("inscription-btn")
  .addEventListener("click", () => afficherSection("formulaire-inscription"));
document
  .getElementById("submit-inscription")
  .addEventListener("click", () => afficherSection("accueil"));

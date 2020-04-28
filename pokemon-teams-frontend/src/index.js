const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;
const trainersContainer = document.querySelector("main");

// fetchTrainers();
addAllTrainersToPage();
listenToAddPokemonBtn();
listenToReleaseBtn();

function fetchTrainers() {
  return fetch(TRAINERS_URL).then((resp) => resp.json());
}

function addAllTrainersToPage() {
  fetchTrainers().then((trainers) => {
    trainers.forEach((trainer) => {
      renderSingleTrainerInfo(trainer);
    });
  });
}

function renderSingleTrainerInfo(trainer) {
  const addPokemonBtn = document.createElement("button");
  const trainerCard = document.createElement("div");
  const pokemonsUl = document.createElement("ul");
  trainerCard.className = "card";
  trainerCard.dataset.id = trainer.id;
  trainerCard.innerHTML = `<p>${trainer.name}</p>`;
  addPokemonBtn.innerText = "Add Pokemon";
  addPokemonBtn.dataset.trainerId = trainer.id;

  trainersContainer.append(trainerCard);
  trainerCard.append(addPokemonBtn);
  trainerCard.append(pokemonsUl);

  trainer.pokemons.forEach((pokemon) => {
    renderSinglePokemon(pokemon, pokemonsUl);
  });
}

function renderSinglePokemon(pokemon, ul) {
  const pokemonLi = document.createElement("li");
  const releaseBtn = document.createElement("button");

  pokemonLi.innerText = `${pokemon.nickname} (${pokemon.species})`;
  releaseBtn.innerText = "Release";
  releaseBtn.className = "release";
  releaseBtn.dataset.pokemonId = pokemon.id;

  ul.appendChild(pokemonLi);
  pokemonLi.append(releaseBtn);
}

function listenToAddPokemonBtn() {
  trainersContainer.addEventListener("click", function (event) {
    const pokemonsUl = event.target.parentElement.querySelector("ul");
    const trainerId = parseInt(event.target.dataset.trainerId);
    if (
      event.target.innerText === "Add Pokemon" &&
      pokemonsUl.childElementCount < 6
    ) {
      const postObj = {
        method: "POST",
        body: JSON.stringify({
          trainer_id: trainerId,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      fetch(POKEMONS_URL, postObj)
        .then((resp) => resp.json())
        .then((pokemon) => renderSinglePokemon(pokemon, pokemonsUl));
    }
  });
}

function listenToReleaseBtn() {
  trainersContainer.addEventListener("click", function (event) {
    const pokemonsUl = event.target.parentElement.parentElement;
    const pokemonLi = event.target.parentElement;
    const pokemonId = parseInt(event.target.dataset.pokemonId);
    if (event.target.innerText === "Release") {
      fetch(`${POKEMONS_URL}/${pokemonId}`, { method: "DELETE" });
      pokemonsUl.removeChild(pokemonLi);
    }
  });
}

/* Delete request example response:
  {
    "id":147,
    "nickname":"Gunnar",
    "species":"Weepinbell",
    "trainer_id":1
  }
 */

// If we didn't create new Pokemon and instead just picked a random one from the existing pokemon to add
// function listenToAddPokemonBtn() {
//   trainersContainer.addEventListener("click", function (event) {
//     const pokemonsUl = event.target.parentElement.querySelector("ul");
//     if (
//       event.target.innerText === "Add Pokemon" &&
//       pokemonsUl.childElementCount < 6
//     ) {
//       fetch(POKEMONS_URL)
//         .then((resp) => resp.json())
//         .then((pokemons) => {
//           const oneRandomPokemon =
//             pokemons[Math.floor(Math.random() * pokemons.length)];
//           renderSinglePokemon(oneRandomPokemon, pokemonsUl);
//         });
//     }
//   });
// }

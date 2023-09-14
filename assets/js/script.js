"use strict";

let library = [];
let idCount = 0;

window.onload = function () {
  loadFromLocalStorage();
};

const statusButton = document.querySelectorAll("[data-status]");

function handleCheck(event) {
  const index = event.target.getAttribute("data-index");
  if (index !== null && index >= 0 && index < library.length) {
    const statusItem = event.target;
    library[index].isWatch = !library[index].isWatch; // Alterne o status
    statusItem.classList.toggle("ativo");

    // Atualize o objeto da biblioteca antes de salvar no localStorage
    saveToLocalStorage();
  }
}

statusButton.forEach((item) => {
  ["touchstart", "click"].forEach((userEvent) => {
    item.addEventListener(userEvent, (event) => {
      handleCheck(event);
    });
  });
});

function handleDelete(event) {
  const row = event.target.closest("tr"); // Encontre a linha pai do botão
  const dataIndex = row.getAttribute("data-id");

  if (dataIndex !== null) {
    const index = parseInt(dataIndex, 10); // Converte o valor para um número inteiro

    if (index >= 0 && index < library.length) {
      // Remove o item do Local Storage
      library.splice(index, 1);
      saveToLocalStorage();

      // Remove a linha da tabela
      row.parentNode.removeChild(row);

      // Atualiza os índices dos elementos da tabela após a exclusão
      const tableRows = document.querySelectorAll("[data-id]");
      tableRows.forEach((tableRow, newIndex) => {
        tableRow.setAttribute("data-id", newIndex);
      });
    } else {
      console.log("Índice inválido: " + index);
    }
  }
}

function Series(serie, plataform, year, status) {
  this.serie = serie;
  this.plataform = plataform;
  this.year = year;
  this.isWatch = status;
}

function addSerie() {
  const nameInput = document.querySelector("[data-name]").value;
  const plataformInput = document.querySelector("[data-plataform]").value;
  const yearInput = document.querySelector("[data-year]").value;
  const statusSelect = document.querySelector("[data-status]").value;

  if (nameInput.length !== 0 && plataformInput.length !== 0) {
    const newSerie = new Series(
      nameInput,
      plataformInput,
      yearInput,
      statusSelect === "true" ? true : false
    );

    library.push(newSerie);

    console.log(library);

    createNewSerie(newSerie, library.length - 1);

    // Atualize o Local Storage
    saveToLocalStorage();

    // Limpa o form para adição de novo item
    clearForm();
  } else {
    alert("Adicione valores válidos!");
  }
}

function createNewSerie(serie, index) {
  const isActive = serie.isWatch;

  console.log(isActive);
  const table = document.querySelector("[data-table]");

  // Atribua o índice como um atributo personalizado
  const id = index;

  // CREATE A ELEMENT TR
  const item = document.createElement("tr");
  item.setAttribute("data-tr", "");
  item.setAttribute("data-id", id);
  table.appendChild(item);

  // CREATE A SERIE NAME
  const name = document.createElement("td");
  name.textContent = serie.serie;
  item.appendChild(name);

  // CREATE A PLATAFORM NAME
  const plataformName = document.createElement("td");
  plataformName.textContent = serie.plataform;
  item.appendChild(plataformName);

  // CREATE A YEAR
  const yearName = document.createElement("td");
  if (serie.year) {
    yearName.textContent = serie.year;
  } else {
    yearName.textContent = "Sem Data";
  }
  item.appendChild(yearName);

  // CREATE A STATUS CHECKBOX
  const statusName = document.createElement("td");
  const statusButton = document.createElement("button");
  statusButton.classList.add("status-button");
  if (isActive) {
    statusButton.classList.add("ativo");
  }
  statusButton.setAttribute("data-index", library.indexOf(serie));
  statusName.appendChild(statusButton);
  item.appendChild(statusName);
  statusButton.addEventListener("click", handleCheck);

  // CREATE A DELETE BUTTON
  const deleteTd = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  const i = document.createElement("i");
  i.classList.add("bi", "bi-trash");
  item.appendChild(deleteTd);
  deleteTd.appendChild(deleteButton);
  deleteButton.appendChild(i);

  // Atribua o índice como um atributo personalizado
  deleteButton.setAttribute("data-index", index);

  deleteButton.addEventListener("click", handleDelete);
}

const form = document.querySelector("[data-form]");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addSerie();
  // clearForm();
});

function clearForm() {
  form.reset();
}

function saveToLocalStorage() {
  // Convertemos os valores booleanos em strings ao salvar
  const serializedLibrary = library.map((serie) => ({
    ...serie,
    isWatch: serie.isWatch ? "true" : "false",
  }));
  localStorage.setItem("library", JSON.stringify(serializedLibrary));
}

function loadFromLocalStorage() {
  const keyToUpdate = "library";
  const libraryJSON = localStorage.getItem(keyToUpdate);

  if (libraryJSON) {
    const deserializedLibrary = JSON.parse(libraryJSON);
    library = deserializedLibrary.map((serie, index) => ({
      ...serie,
      isWatch: serie.isWatch === "true",
    }));

    if (library.length > 0) {
      library.forEach((serie, index) => {
        createNewSerie(serie, index);
        // Atualize a classe "ativo" com base no valor de isWatch
        const statusButton = document.querySelector(`[data-index="${index}"]`);
        if (serie.isWatch) {
          statusButton.classList.add("ativo");
        }
      });
    }
  }
}

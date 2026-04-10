const contacts = [
  { name: "León XIV", selected: false },
  {name: "Francisco", selected: false},
  {name: "Benedicto XVI", selected: false},
  {name: "Juan Pablo II", selected: false},
  {name: "Juan Pablo I", selected: false},
  {name: "Pablo VI", selected: false},
  {name: "Juan XXIII", selected: false},
  {name: "Pío XII", selected: false},
  {name: "Pío XI", selected: false},
  {name: "Benedicto XV", selected: false},
  {name: "Pío X", selected: false},
  {name: "León XIII", selected: false},
  {name: "Pío IX", selected: false},
];

const filterInput = document.querySelector(".filter input");
const select = document.querySelector("select");

function populateOptions(array) {
  select.innerHTML = "";

  array.forEach((obj) => {
    const option = document.createElement("option");
    option.textContent = obj.name;
    option.selected = obj.selected;
    select.appendChild(option);
  });
}

function filterOptions(filter, array) {
  if (filter.trim() === "") {
    populateOptions(array);
  } else {
    const filteredArray = array.filter((obj) =>
      obj.name.toLowerCase().startsWith(filter.toLowerCase()),
    );
    populateOptions(filteredArray);
  }
}

filterInput.addEventListener("input", () => {
  filterOptions(filterInput.value, contacts);
});

select.addEventListener("change", () => {
  const allCurrentValues = Array.from(select.options).map(
    (option) => option.value,
  );
  const currentSelectedValues = Array.from(select.selectedOptions).map(
    (option) => option.value,
  );

  contacts.forEach((contact) => {
    if (allCurrentValues.includes(contact.name)) {
      contact.selected = currentSelectedValues.includes(contact.name);
    }
  });
});

populateOptions(contacts);
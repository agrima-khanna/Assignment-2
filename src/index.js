var form = document.forms[0];
var list = document.querySelector(".list");
// var btns = document.querySelectorAll("button");
var add_edit = document.querySelector(".status");
var cancel = document.querySelector("#cancel");
var count = document.querySelector("#count");
var status = document.querySelector(".heading");
var inputName = form.elements["name"];
var inputQuantity = document.getElementById("quantity");
var submit = document.querySelector(".submitBtn");
var itemBeingEdited = {
  name: null,
  status: false,
};
var itemList = {};
count.textContent = 0;
var correspondingDom = {};
//click event listeners for edit and delete
var handleClickEvent = (item) => {
  var editBtn = item.querySelector("#edit");
  var delBtn = item.querySelector("#delete");

  editBtn.addEventListener("click", () => {
    //access name and quantity inside eventlistener otherwise values won't update
    var name = item.querySelector(".itemName").textContent;
    var quantity = item.querySelector(".itemQuantity").textContent;

    add_edit.classList.add("edit");
    cancel.classList.add("editActive");

    status.textContent = "Edit Grocery Item";
    submit.value = "Update";
    inputName.value = name;
    inputQuantity.textContent = quantity;

    itemBeingEdited.name = name;
    itemBeingEdited.status = true;
  });
  delBtn.addEventListener("click", () => {
    var name = item.querySelector(".itemName").textContent;

    count.textContent--;
    list.removeChild(item);
    delete correspondingDom[name];
    delete itemList[name];
    localStorage.itemList = JSON.stringify(itemList);
    reset();
  });
};

if (localStorage.itemList != undefined)
  itemList = JSON.parse(localStorage.itemList);

for (var key in itemList) {
  if (itemList[key].dom && itemList[key]["dom"] != "") {
    list.innerHTML += itemList[key]["dom"];
    count.textContent++;
  } else delete itemList[key];
  // console.log(list.lastElementChild);
}
list.childNodes.forEach((item) => {
  var name = item.querySelector(".itemName").textContent;
  correspondingDom[name] = item;
  handleClickEvent(correspondingDom[name]);
});
localStorage.itemList = JSON.stringify(itemList);

function createItem(name, quantity) {
  var item = document.createElement("li");
  item.classList.add("item");
  item.innerHTML = `<div  class="details">
    <span class="itemName">${name}</span>
    
    <span class="itemQuantity">${quantity}</span>
    </div>
    <div class="editOptions">
   
    <button  id="edit"><i class="fas fa-pen fa-lg "></i></button>
    <button id="delete"><i class="fas fa-trash fa-lg"></i></button>
    </div>
`;

  return item;
}
function reset() {
  inputName.value = "";
  inputQuantity.textContent = "1";
  itemBeingEdited.name = null;
  itemBeingEdited.status = false;
  add_edit.classList.remove("edit");
  cancel.classList.remove("editActive");

  status.textContent = "Add Grocery Item";
  submit.value = "Add item";
}
form.addEventListener("submit", (event) => {
  var updated = 0;
  if (itemBeingEdited.status != false) {
    if (inputName.value == itemBeingEdited.name) {
      correspondingDom[inputName.value].querySelector(
        ".itemQuantity"
      ).innerHTML = inputQuantity.textContent;

      itemList[inputName.value]["dom"] =
        correspondingDom[inputName.value].outerHTML;

      itemList[inputName.value]["quantity"] = inputQuantity.textContent;
      console.log(correspondingDom[inputName.value]);
      localStorage.itemList = JSON.stringify(itemList);

      updated = 1;
    } else {
      list.removeChild(correspondingDom[itemBeingEdited.name]);
      count.textContent--;
      delete correspondingDom[itemBeingEdited.name];
      delete itemList[itemBeingEdited.name];
      localStorage.itemList = JSON.stringify(itemList);
    }
  }
  if (!updated) {
    if (itemList.hasOwnProperty(inputName.value)) {
      var oldQuantity =
        correspondingDom[inputName.value].querySelector(
          ".itemQuantity"
        ).textContent;
      correspondingDom[inputName.value].querySelector(
        ".itemQuantity"
      ).textContent = inputQuantity.textContent - 0 + (oldQuantity - 0);
      itemList[inputName.value]["quantity"] =
        inputQuantity.textContent - 0 + (oldQuantity - 0);
      itemList[inputName.value]["dom"] =
        correspondingDom[inputName.value].outerHTML;

      localStorage.itemList = JSON.stringify(itemList);

      updated = 1;
      //console.log(inputQuantity.value);
    }

    if (!updated) {
      var item = createItem(inputName.value, inputQuantity.textContent);
      list.appendChild(item);
      handleClickEvent(item);

      correspondingDom[inputName.value] = item;
      itemList[inputName.value] = {};
      itemList[inputName.value]["dom"] = item.outerHTML;
      itemList[inputName.value]["quantity"] = inputQuantity.textContent;

      count.textContent++;

      localStorage.itemList = JSON.stringify(itemList);
    }
  }
  reset();
  //console.log(item);
  event.preventDefault();
});

document.addEventListener(
  "click",
  function (event) {
    var btn = event.target.closest("button");
    //console.log(event.target);
    if (btn != null) {
      if (btn.id == "deleteAll") {
        list.innerHTML = "";
        console.log(list);
        itemList = {};
        correspondingDom = {};
        localStorage.itemList = JSON.stringify(itemList);
        count.textContent = "0";

        reset();
      } else if (btn.id == "cancel") {
        reset();
      } else if (
        event.target.id == "increment" &&
        inputQuantity.textContent < 100
      ) {
        inputQuantity.textContent++;
      } else if (
        event.target.id == "decrement" &&
        inputQuantity.textContent > 1
      )
        inputQuantity.textContent = inputQuantity.textContent - 1;
    }
  },
  false
);

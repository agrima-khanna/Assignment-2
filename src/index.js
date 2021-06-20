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
var current = {
  name: null,
  quantity: null,
  item: null
};
var itemList = {};
count.textContent = 0;

console.log(localStorage.list);
if (localStorage.list != undefined) itemList = JSON.parse(localStorage.list);

//console.log(localStorage.list);

for (var key in itemList) {
  list.innerHTML += itemList[key];
  count.textContent++;
}
function addItem(name, quantity) {
  var item = `<li class="item">
    <div  class="details">
    <span class="itemName">${name}</span>
    
    <span class="itemQuantity">${quantity}</span>
    </div>
    <div class="editOptions">
   
    <button  id="edit"><i class="fas fa-pen fa-lg "></i></button>
    <button id="delete"><i class="fas fa-trash fa-lg"></i></button>
    </div>
  </li>`;
  return item;
}
function reset() {
  inputName.value = "";
  inputQuantity.textContent = "1";
  Object.keys(current).forEach((k) => (current[k] = null));
  add_edit.classList.remove("edit");
  cancel.classList.remove("editActive");

  status.textContent = "Add Grocery Item";
  submit.value = "Add item";
}
form.addEventListener("submit", (event) => {
  var flag = 0;
  if (current.item != null) {
    if (inputName.value == current.name) {
      current.item.childNodes[1].childNodes[3].innerHTML =
        inputQuantity.textContent;
      itemList[inputName.value] = addItem(
        current.name,
        inputQuantity.textContent
      );
      console.log(itemList);

      localStorage.list = JSON.stringify(itemList);

      // localStorage.setItem(inputName.value, inputQuantity.textContent);
      flag = 1;
    } else {
      list.removeChild(current.item);
      count.textContent--;
      delete itemList[current.name];
      localStorage.list = JSON.stringify(itemList);
    }
  }
  if (!flag) {
    document.querySelectorAll(".itemName").forEach((itemName) => {
      if (itemName.innerHTML == inputName.value) {
        itemName.nextElementSibling.textContent =
          inputQuantity.textContent -
          0 +
          (itemName.nextElementSibling.textContent - 0);
        console.log(itemName.closest(".item"));
        itemList[inputName.value] = addItem(
          inputName.value,
          itemName.nextElementSibling.textContent
        );

        localStorage.list = JSON.stringify(itemList);

        flag = 1;
        //console.log(inputQuantity.value);
      }
    });

    if (!flag) {
      var item = addItem(inputName.value, inputQuantity.textContent);
      itemList[inputName.value] = item;
      count.textContent++;

      console.log(itemList);
      localStorage.list = JSON.stringify(itemList);

      list.innerHTML += item;
      // localStorage.setItem(inputName.value, inputQuantity.textContent);
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
      if (btn.id == "delete") {
        const itemToRemove = event.target.closest(".item");
        count.textContent--;

        console.log(itemToRemove);
        list.removeChild(itemToRemove);
        delete itemList[itemToRemove.childNodes[1].childNodes[1].innerHTML];
        localStorage.list = JSON.stringify(itemList);
        reset();
      } else if (btn.id == "deleteAll") {
        list.innerHTML = "";
        console.log(list);
        itemList = {};
        localStorage.list = JSON.stringify(itemList);
        count.textContent = "0";

        reset();
      } else if (btn.id == "edit") {
        add_edit.classList.add("edit");
        cancel.classList.add("editActive");

        status.textContent = "Edit Grocery Item";
        submit.value = "Update";

        current.item = event.target.closest(".item");
        current.name = event.target.closest(
          ".item"
        ).childNodes[1].childNodes[1].innerHTML;
        current.quantity = event.target.closest(
          ".item"
        ).childNodes[1].childNodes[3].innerHTML;

        //console.log(event.target.closest(".item").childNodes[1].childNodes[1]);
        inputName.value = current.name;
        inputQuantity.textContent = current.quantity;
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

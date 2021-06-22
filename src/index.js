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
var tempList = document.querySelector(".tempList");
var tempArray = {};
var itemBeingEdited = {
  name: null,
  status: false
};
var itemList = {};
count.textContent = 0;
var correspondingDom = {};
var addEventListenerToTempItem = (tempItem, name) => {
  var deleteTempItem = tempItem.querySelector("#deleteTempItem");
  deleteTempItem.addEventListener("click", () => {
    tempList.removeChild(tempItem);
    delete tempArray[name];
  });
};
var handleClickEvent = (item) => {
  //click event added for  buttons of each item at the time of creating that item
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
    localStorage.itemsList = JSON.stringify(itemList);
    reset();
  });
};

if (localStorage.itemsList != undefined)
  itemList = JSON.parse(localStorage.itemsList);

for (var key in itemList) {
  if (itemList[key].dom && itemList[key]["dom"] != "") {
    var item = document.createElement("li");
    item.classList.add("item");
    item.innerHTML = itemList[key]["dom"];
    list.appendChild(item);
    correspondingDom[key] = item;
    count.textContent++;
    handleClickEvent(item);
    //list.innerHTML+=    : this not only adds new content
    //but also re - adds the existing innerHTML so click events are lost
    // therefore append child
  } else delete itemList[key];
}

localStorage.itemsList = JSON.stringify(itemList);

function createItem(name, quantity) {
  //return node so that querySelector can be used
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
  submit.value = "Add to Cart";
}
function updateItemThatExists(name, quantity) {
  if (itemList.hasOwnProperty(name)) {
    //name already exists
    var oldQuantity = correspondingDom[name].querySelector(".itemQuantity")
      .textContent;
    correspondingDom[name].querySelector(".itemQuantity").textContent =
      quantity - 0 + (oldQuantity - 0);
    itemList[name]["quantity"] = quantity - 0 + (oldQuantity - 0);
    itemList[name]["dom"] = correspondingDom[name].innerHTML;

    localStorage.itemsList = JSON.stringify(itemList);

    return 1;
  }

  return 0;
}
function addNewItem(name, quantity) {
  //new item added
  var item = createItem(name, quantity);
  list.appendChild(item);
  handleClickEvent(item);

  correspondingDom[name] = item;
  itemList[name] = {};
  itemList[name]["dom"] = item.innerHTML; //li tag not included
  itemList[name]["quantity"] = quantity;

  count.textContent++;

  localStorage.itemsList = JSON.stringify(itemList);
}

form.addEventListener("submit", (event) => {
  var updated = 0;
  if (itemBeingEdited.status != false) {
    //edit active

    if (inputName.value == itemBeingEdited.name) {
      // only quantity update
      correspondingDom[inputName.value].querySelector(
        ".itemQuantity"
      ).innerHTML = inputQuantity.textContent;

      itemList[inputName.value]["dom"] =
        correspondingDom[inputName.value].innerHTML;

      itemList[inputName.value]["quantity"] = inputQuantity.textContent;
      console.log(correspondingDom[inputName.value]);
      localStorage.itemsList = JSON.stringify(itemList);

      updated = 1;
    } else {
      //item name changed
      list.removeChild(correspondingDom[itemBeingEdited.name]);
      count.textContent--;
      delete correspondingDom[itemBeingEdited.name];
      delete itemList[itemBeingEdited.name];
      localStorage.itemsList = JSON.stringify(itemList);
    }
    if (!updateItemThatExists(inputName.value, inputQuantity.textContent))
      addNewItem(inputName.value, inputQuantity.textContent);
  } else {
    console.log(tempArray);
    for (var key in tempArray) {
      if (!updateItemThatExists(key, tempArray[key]))
        addNewItem(key, tempArray[key]);
    }
    tempArray = [];
    tempList.innerHTML = "";
  }
  reset();

  event.preventDefault();
});

document.addEventListener(
  "click",
  function (event) {
    var btn = event.target.closest("button");

    if (btn != null) {
      if (btn.id == "deleteAll") {
        list.innerHTML = "";
        console.log(list);
        itemList = {};
        correspondingDom = {};
        localStorage.itemsList = JSON.stringify(itemList);
        count.textContent = "0";

        reset();
        // }
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
      else if (event.target.closest("button").id == "addTemp") {
        if (inputName.value != "") {
          var tempItem = document.createElement("div");
          tempItem.classList.add("tempItem");
          tempItem.innerHTML = `<div class="tempName">${inputName.value}</div><div class="tempQuantity">x ${inputQuantity.textContent}</div> <button id="deleteTempItem" style="background:none; border:none;"><i class="fas fa-minus"></i></button> `;
          tempList.appendChild(tempItem);
          addEventListenerToTempItem(tempItem, inputName.value);
          if (tempArray.hasOwnProperty(inputName.value))
            tempArray[inputName.value] =
              inputQuantity.textContent - 0 + (tempArray[inputName.value] - 0);
          else tempArray[inputName.value] = inputQuantity.textContent;
          reset();
        }
      }
    }
  },
  false
);

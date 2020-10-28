// Storage controller
const StorageCtrl = (() => {

  return {
    storeItem: (item) => {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(item));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem(JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }
  }
})();

// Item controller
const ItemCtrl = (() => {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / state
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    // currentItem is to store item which is being updated after pressing 'update' button.
    totalCalories: 0
  }

  return {
    getItems:() => {
      return data.items;
    },
    addItem:(name, calories) => {
      let iD;
      // create ID by incrementing
      if(data.items.length > 0) {
        iD = data.items[data.items.length - 1].id +1;
      } else {
        iD = 0;
      }

      // calories string to numbers
      calories = parseInt(calories);

      // create new item
      newItem = new Item(iD, name, calories);

      // add new item to data structure
      data.items.push(newItem);

      return newItem;
    },
    getItemById: (id) => {
      let found = null;
      data.items.forEach((item) => {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: (name, calories) => {
      // calories to number
      calories = parseInt(calories);
      let found = null;

      data.items.forEach((item) => {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: (id) => {
      // get id, using map method: will return IDs of items in data structure for each item as a new array, then we get index of that one item and plug it in splice() to remove it
      const ids = data.items.map((item) => {
        return item.id;
      });
      
      // get index
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });

      // set total calories in data structure (prop in object)
      data.totalCalories = total;
      
      return data.totalCalories;
    },
    logData:() => {
      return data;
    }
  }
})();

// Ui controller
const UiCtrl = (() => {
  const UiSelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: items => {
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });
      // insert list items
      document.querySelector(UiSelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UiSelectors.itemNameInput).value,
        calories: document.querySelector(UiSelectors.itemCaloriesInput).value
      }
    },
    addListItem:(item) => {
      // show the list
      document.querySelector(UiSelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      // add HTML
      li.innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: (item) => {
      let listItems = document.querySelectorAll(UiSelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');

        if(itemID === `item${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML =`<strong>${item.name}</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>` ;
        }
      });
    },
    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: () => {
      document.querySelector(UiSelectors.itemNameInput).value = '';
      document.querySelector(UiSelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: () => {
      document.querySelector(UiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UiCtrl.showEditState();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UiSelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove();
      });
    },
    hideList: () => {
      document.querySelector(UiSelectors.itemList).style.display = 'none';
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UiSelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: () => {
      UiCtrl.clearInput();
      document.querySelector(UiSelectors.updateBtn).style.display = 'none';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(UiSelectors.backBtn).style.display = 'none';
      document.querySelector(UiSelectors.addBtn).style.display = 'inline';
    },
    showEditState: () => {
      document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UiSelectors.backBtn).style.display = 'inline';
      document.querySelector(UiSelectors.addBtn).style.display = 'none';
    },
    // method to access UI selectors
    getSelectors: () => {
      return UiSelectors;
    }    
  }
})();

// App controller
const AppCtrl = ((ItemCtrl, StorageCtrl, UiCtrl) => {
  // Load event listeners, get selectors from UiCtrl
  const loadEventListeners = () => {
    // Get ui selectors
    const UiSelectors = UiCtrl.getSelectors();

    // Add item event
    document.querySelector(UiSelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click event
    document.querySelector(UiSelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // back button event
    document.querySelector(UiSelectors.backBtn).addEventListener('click', UiCtrl.clearEditState);

    // delete button event
    document.querySelector(UiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // clear items event
    document.querySelector(UiSelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Item Add Submit
  const itemAddSubmit = (e) => {
    // get form input from UI controller
    const input = UiCtrl.getItemInput();

    // check if name and calorie input is not blank
    if(input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UiCtrl.addListItem(newItem);

      // get total calories, before clearing
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories in UI
      UiCtrl.showTotalCalories(totalCalories);

      // store in local storage
      StorageCtrl.storeItem(newItem);

      // clear fields
      UiCtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit
  const itemEditClick = (e) => {
    if(e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id;

      // Split listId into item and id, and then get only id
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      // get item, returns data.item as an object
      const itemToEdit = ItemCtrl.getItemById(id);

      // put itemToEdit into currentItem in ItemCtrl to be edited and displayed
      ItemCtrl.setCurrentItem(itemToEdit);

      // add clicked item to form
      UiCtrl.addItemToForm();
    }
  }

  // Update item submit
  const itemUpdateSubmit = (e) => {
    const input = UiCtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UiCtrl.updateListItem(updatedItem);

    // get total calories, before clearing
   const totalCalories = ItemCtrl.getTotalCalories();

    // Show total calories in UI
    UiCtrl.showTotalCalories(totalCalories);

    UiCtrl.clearEditState();

    e.preventDefault();
  }

  // delete button event
  const itemDeleteSubmit = (e) => {
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    UiCtrl.deleteListItem(currentItem.id);

        // get total calories, before clearing
   const totalCalories = ItemCtrl.getTotalCalories();

   // Show total calories in UI
   UiCtrl.showTotalCalories(totalCalories);

   UiCtrl.clearEditState();

    e.preventDefault();
  }

  // clear items event
  const clearAllItemsClick = () => {
    // clear all items from data structure
    ItemCtrl.clearAllItems();
    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);
    UiCtrl.removeItems();

    // hide ul
    UiCtrl.hideList();
  }

  return {
    init:() => {
      // set initial state
      UiCtrl.clearEditState();
      // fetch data from data structure or API
      const items = ItemCtrl.getItems();

      // check if any items remain
      if(items.length === 0) {
        UiCtrl.hideList();
      } else {
      // method to display list of items from data structure or API
      UiCtrl.populateItemList(items);
      }

      // get total calories, before clearing
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories in UI
       UiCtrl.showTotalCalories(totalCalories);

      // call load event listiner
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UiCtrl);

// Initialize app
AppCtrl.init();
$(window).on('load',showTen);

$("#todo-body, #todo-title").on('keyup', enableSave);
$("#save-button").on('click', saveFunc);

$(".todo-stream").on('click', ".delete-button", removeCard);
$(".todo-stream").on('click', ".upvote-button, .downvote-button", checkButton);
$('.todo-stream').on('keyup', '.card-title, p', editCard);
$('.todo-stream').on('click', '.completed', todoComplete);

$('#search-bar').on('keyup', filterTodo);
$('.todo-buttons').on('click', '#show-all-button', showAll);
$('.todo-buttons').on('click', '#show-completed-button', showCompleted);
$('.todo-buttons').on('click', '.critical', showCritical);
$('.todo-buttons').on('click', '.high', showHigh);
$('.todo-buttons').on('click', '.normal', showNormal);
$('.todo-buttons').on('click', '.low', showLow);
$('.todo-buttons').on('click', '.none', showNone);

$(document).on('mouseenter', '.delete-button', deleteHover);
$(document).on('mouseleave', '.delete-button', originalDelete);
$(document).on('mouseenter', '.upvote-button', upvHover);
$(document).on('mouseleave', '.upvote-button', originalUpv);
$(document).on('mouseenter', '.downvote-button', downvHover);
$(document).on('mouseleave', '.downvote-button', originalDownv);

function showTen() {
  var todoArray = getArrayFromStorage();
  if (todoArray !== null) {
    todoArray.reverse().forEach(function(card, index) {
      if (index <= 9){
        prependCard(card);
      };
    });
  };
};

function getArrayFromStorage(){
  var todoArray = localStorage.getItem("todoArray");
  if ((todoArray !== "undefined") && (todoArray !== null)) {
    todoArray = JSON.parse(todoArray);
  } else {
    todoArray = [];
  };
  return todoArray;
};

function prependCard(todo) {
  $('.todo-stream').prepend(
    `<div class="todo-card ${todo.completed}" id="${todo.id}">
    <div class="card-title-flex">
    <span class="card-title" contenteditable="true" role="textbox" tabindex="0">${todo.title}</span>
    <img src="icons/delete.svg" class="card-buttons delete-button" alt="an orange x icon" tabindex="0" role="button" />
    </div>
    <p contenteditable="true" role="textbox" tabindex="0">${todo.body}</p>
    <div class="card-quality-flex quality-spacing">
    <img src="icons/upvote.svg" class="card-buttons upvote-button" data-button="upvote-button" alt="a green arrow pointing up" role="button" tabindex="0" />
    <img src="icons/downvote.svg"  class="card-buttons downvote-button" data-button="downvote-button" alt="a red arrow pointing down" role="button" tabindex="0" />
    <h3>importance: <span class="todo-importance">${todo.status}</span></h3>
    <button class="completed" tabindex="0">completed</button>
    </div>
    </div>`
  );
};

function enableSave() {
  if (($("#todo-title").val() !== "") && ($("#todo-body").val() !== "")) {
    $("#save-button").removeAttr("disabled");
  } else {
    $("#save-button").attr("disabled", "disabled");
  };
};

function saveFunc(event) {
  event.preventDefault();
  addCard();
  resetInputs();
  enableSave();
};

function addCard() {
  var newTodo = makeObj();
  prependCard(newTodo);
  var todoArray = getArrayFromStorage();
  todoArray.push(newTodo);
  sendArrayToStorage(todoArray);
};

function makeObj() {
  var todoTitle = $("#todo-title").val();
  var todoBody = $("#todo-body").val();
  var newTodo = new FreshTodo(todoTitle, todoBody);
  return newTodo;
};

function FreshTodo(title, body) {
  this.title = title;
  this.body = body;
  this.status = "normal";
  this.id = Date.now();
  this.completed = 'incomplete';
};


function sendArrayToStorage(todoArray) {
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
};

function resetInputs() {
  $('#todo-title').val('');
  $('#todo-body').val('');
};

function removeCard() {
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var todoArray = getArrayFromStorage();
  todoArray = spliceArray(id, todoArray);
  sendArrayToStorage(todoArray);
  $(this).closest('.todo-card').remove();
};

function spliceArray(id, todoArray) {
  todoArray.forEach(function(card, index) {
    if (card.id === id) {
      todoArray.splice(index, 1);
    };
  });
  return todoArray;
};

function checkButton(e) {
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var whichButton = e.target.dataset.button;
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      adjustImportance(card, whichButton);
    };
  });
  sendArrayToStorage(todoArray);
  repopulate();
};

function adjustImportance(card, whichButton) {
  var importances = ['none', 'low', 'normal', 'high', 'critical'];
  var imIndex = importances.indexOf(card.status);
  if ((whichButton === 'upvote-button') && (imIndex < importances.length-1)) {
      imIndex += 1;
  } else if ((whichButton === 'downvote-button') && (imIndex > 0)) {
      imIndex -= 1;
  };
  card.status = importances[imIndex];
};

function repopulate() {
  $('.todo-stream').empty();
  showTen();
};

function editCard(event) {
  checkEnter(event);
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var todoArray2 = editArray(id, event);
  sendArrayToStorage(todoArray2);
};

function checkEnter(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  };
};

function editArray(id, event) {
  var todoArray = getArrayFromStorage();
  todoArray.map(function(card, index) {
    if (card.id === id) {
      card.title = $(event.target).closest('.todo-card').find('.card-title').text();
      card.body = $(event.target).closest('.todo-card').find('p').text();
    };
  });
  return todoArray;
};

function todoComplete() {
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  todoArray = completedClass(todoArray, id);
  sendArrayToStorage(todoArray);
  repopulate();
};

function completedClass(todoArray, id) {
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      card.completed = 'todo-completed';
    };
  });
  return todoArray;
};

function filterTodo() {
  var todoArray = getArrayFromStorage();
  var filterInput = $('#search-bar').val();
  if (filterInput !== ""){
    matchFilterInput(todoArray, filterInput);
  } else if (filterInput === "") {
    repopulate();
  };
};

function matchFilterInput(todoArray, filterInput) {
  todoArray = cardLowerCase(todoArray);
  filterInput = filterInput.toLowerCase();
  var filterCards = todoArray.filter(function(card) {
    return (card.title.includes(filterInput) || card.body.includes(filterInput));
  });
  showConditional(filterCards);
}

function showConditional(array) {
  $('.todo-stream').empty();
  if (array !== null) {
    array.forEach(function(card) {
    prependCard(card);
    });
  };
};

function cardLowerCase(todoArray) {
  todoArray.map(function(card, index){
    card.title = card.title.toLowerCase();
    card.body = card.body.toLowerCase();
  });
  return todoArray;
};

function showAll(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  showConditional(todoArray);
};

function showCompleted(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var filterComplete = todoArray.filter(function(card) {
      return (card.completed === 'todo-completed')
  });
  showConditional(filterComplete);
};

function showCritical(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var criticalArray = todoArray.filter(function(card) {
      return (card.status === 'critical')
  });
  showConditional(criticalArray);
};

function showHigh(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var highArray = todoArray.filter(function(card) {
      return (card.status === 'high')
  });
  showConditional(highArray);
};

function showNormal(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var normalArray = todoArray.filter(function(card) {
      return (card.status === 'normal')
  });
  showConditional(normalArray);
};

function showLow(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var lowArray = todoArray.filter(function(card) {
      return (card.status === 'low')
  });
  showConditional(lowArray);
};

function showNone(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var noneArray = todoArray.filter(function(card) {
      return (card.status === 'none')
  });
  showConditional(noneArray);
};

function deleteHover() {
  $(this).attr('src', 'icons/delete-hover.svg');
};

function originalDelete() {
  $(this).attr('src', 'icons/delete.svg');
};

function upvHover() {
  $(this).attr('src', 'icons/upvote-hover.svg');
};

function originalUpv() {
  $(this).attr('src', 'icons/upvote.svg');
};

function downvHover() {
  $(this).attr('src', 'icons/downvote-hover.svg');
};

function originalDownv() {
  $(this).attr('src', 'icons/downvote.svg');
};

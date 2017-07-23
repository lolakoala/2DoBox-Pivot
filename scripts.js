//on page load
var todoArray = [];
$(document).ready(getTodoFromStorage);

//event Listeners
$("#todo-body, #todo-title").on('keyup', enableSave);
$("#save-button").on('click', saveFunc);

$(".todo-stream").on('click', ".delete-button", removeCard);
$(".todo-stream").on('click', "#upvote-button", upVote);
$(".todo-stream").on('click', "#downvote-button", downVote);

$('.todo-stream').on('keyup', 'h2', editTitle);
$('.todo-stream').on('keyup', 'p', editBody);

//button hover display listeners
$(document).on('mouseenter', '.delete-button', deleteHover);
$(document).on('mouseleave', '.delete-button', originalDelete);

$(document).on('mouseenter', '#upvote-button', upvHover);
$(document).on('mouseleave', '#upvote-button', originalUpv);

$(document).on('mouseenter', '#downvote-button', downvHover);
$(document).on('mouseleave', '#downvote-button', originalDownv);

//listener functions
function enableSave() {
  if (($("#todo-title").val() !== "") && ($("#todo-body").val() !== "")) {
    $("#save-button").removeAttr("disabled");
  } else {
    $("#save-button").attr("disabled", "disabled");
  };
};

function saveFunc(event) {
  event.preventDefault();
  evalInputs();
  enableSave();
};

function removeCard() {
  $(this).closest('.todo-card').remove();
};

function upVote() {
  var checkQualityStatus = $(this).closest('.card-quality-flex').find('.todo-quality').text();
  if (checkQualityStatus === 'swill') {
    $(this).closest('.card-quality-flex').find('.todo-quality').text('plausible');
  } else {$(this).closest('.card-quality-flex').find('.todo-quality').text('genius');
  }
};

function downVote() {
  var checkQualityStatus = $(this).closest('.card-quality-flex').find('.todo-quality').text();
  if (checkQualityStatus === 'genius') {
    $(this).closest('.card-quality-flex').find('.todo-quality').text('plausible');
  } else {$(this).closest('.card-quality-flex').find('.todo-quality').text('swill');
  }
};

function editTitle(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  }
  var id = $(this).closest('.todo-card')[0].id;
  var title = $(this).text();
  todoArray.forEach(function(card) {
    if (card.id == id) {
      card.title = title;
    }
  });
  sendTodoToStorage();
};

function editBody(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  }
  var id = $(this).closest('.todo-card')[0].id;
  var body = $(this).text();
  todoArray.forEach(function(card) {
    if (card.id == id) {
      card.body = body;
    }
  });
  sendTodoToStorage();
};

//internal functions
function FreshTodo(title, body, status) {
  this.title = title;
  this.body = body;
  this.status = "swill";
  this.id = Date.now();
}

function addCard() {
  var todoTitle = $("#todo-title").val();
  var todoBody = $("#todo-body").val();
  var todoStatus = "swill"
  var newTodo = new FreshTodo(todoTitle, todoBody, todoStatus);
  prependCard(newTodo);
  todoArray.push(newTodo);
  sendTodoToStorage();
};

function sendTodoToStorage() {
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
}

function getTodoFromStorage() {
  if (localStorage.getItem('todoArray')) {
    todoArray = JSON.parse(localStorage.getItem("todoArray"));
    todoArray.forEach(function(element) {
      prependCard(element);
    });
  };
}

function prependCard(todo) {
  $('.todo-stream').prepend(
    `<div class="todo-card" id="${todo.id}">
      <div class="card-title-flex">
        <h2 contenteditable=true>${todo.title}</h2>
        <img src="icons/delete.svg" class="card-buttons delete-button" />
      </div>
      <p contenteditable=true>${todo.body}</p>
      <div class="card-quality-flex quality-spacing">
        <img src="icons/upvote.svg" class="card-buttons" id="upvote-button"/>
        <img src="icons/downvote.svg"  class="card-buttons" id="downvote-button" />
        <h3>quality: <span class="todo-quality">${todo.status}</span></h3>
      </div>
    </div>`
  );
};

function resetInputs() {
  $('#todo-title').val('');
  $('#todo-body').val('');
};

function evalInputs() {
  var todoTitle = $("#todo-title").val();
  var todoBody = $("#todo-body").val();
  if (!todoTitle) {
    $("#todo-title").val("Please enter a title.");
  } else if (!todoBody) {
    $("#todo-body").val("Please enter a body.");
  } else {
    addCard();
    resetInputs();
  }
};

//hover state functions
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

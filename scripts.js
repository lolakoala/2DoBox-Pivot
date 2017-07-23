var todoArray = [];

$(document).ready(getTodoFromStorage);

$("#todo-body, #todo-title").on('keyup', enableSave);

  function enableSave() {
  if (($("#todo-title").val() !== "") && ($("#todo-body").val() !== "")) {
    $("#save-button").removeAttr("disabled");
  } else {
    $("#save-button").attr("disabled", "disabled");
  };
};

$("#save-button").on('click', saveFunc);

function saveFunc(event) {
  event.preventDefault();
  evalInputs();
  enableSave();
};

$(".todo-stream").on('click', ".delete-button", removeCard);

function removeCard() {
  $(this).closest('.todo-card').remove();
};

$(document).on('mouseenter', '.delete-button', deleteHover);

function deleteHover() {
  $(this).attr('src', 'icons/delete-hover.svg');
};

$(document).on('mouseleave', '.delete-button', originalDelete);

function originalDelete() {
  $(this).attr('src', 'icons/delete.svg');
};

$(document).on('mouseenter', '#upvote-button', upvHover);

function upvHover() {
  $(this).attr('src', 'icons/upvote-hover.svg');
};

$(document).on('mouseleave', '#upvote-button', originalUpv);

function originalUpv() {
  $(this).attr('src', 'icons/upvote.svg');
};

$(document).on('mouseenter', '#downvote-button', downvHover);

function downvHover() {
  $(this).attr('src', 'icons/downvote-hover.svg');
};

$(document).on('mouseleave', '#downvote-button', originalDownv);

function originalDownv() {
  $(this).attr('src', 'icons/downvote.svg');
};

$(".todo-stream").on('click', "#upvote-button", upVote);

function upVote() {
  var checkQualityStatus = $(this).closest('.card-quality-flex').find('.todo-quality').text();
  if (checkQualityStatus === 'swill') {
    $(this).closest('.card-quality-flex').find('.todo-quality').text('plausible');
  } else {$(this).closest('.card-quality-flex').find('.todo-quality').text('genius');
};

};

$(".todo-stream").on('click', "#downvote-button", downVote);

function downVote() {
  var checkQualityStatus = $(this).closest('.card-quality-flex').find('.todo-quality').text();
  if (checkQualityStatus === 'genius') {
    $(this).closest('.card-quality-flex').find('.todo-quality').text('plausible');
  } else {$(this).closest('.card-quality-flex').find('.todo-quality').text('swill');
  }
};

function FreshTodo(title, body) {
  this.title = title;
  this.body = body;
  this.status = "swill";
  this.id = Date.now();
}

function addCard() {
  var todoTitle = $("#todo-title").val();
  var todoBody = $("#todo-body").val();
  var newTodo = new FreshTodo(todoTitle, todoBody);
  prependCard(newTodo);
  todoArray.push(newTodo);
  sendTodoToStorage();
};

function sendTodoToStorage() {
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
}

function getTodoFromStorage() {
    todoArray = JSON.parse(localStorage.getItem("todoArray")) || [];
    todoArray.forEach(function(element) {
      prependCard(element);
    });
};



$('.todo-stream').on('keyup', 'h2, p', editTodo);

function editTodo(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  };
  editChanges();
  sendTodoToStorage();
};

function editChanges() {
  var cardId = parseInt($(this).closest('.todo-card').attr('id'));
  todoArray.forEach(function(card, index) {
    if (card.id === cardId) {
      card.title = $('.title-todo').val();
      card.body = $('.body-todo').val();
    }
  });
}


function prependCard(todo) {
  $('.todo-stream').prepend(
    `<div class="todo-card" id="${todo.id}">
      <div class="card-title-flex">
        <h2 class="title-todo" contenteditable=true>${todo.title}</h2>
        <img src="icons/delete.svg" class="card-buttons delete-button" />
      </div>
      <p class="body-todo" contenteditable=true>${todo.body}</p>
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

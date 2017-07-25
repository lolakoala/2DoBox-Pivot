// sendArrayToStorage//on page load
// var todoArray = [];
$(window).on('load',updateHtml);

//event Listeners
$("#todo-body, #todo-title").on('keyup', enableSave);
$("#save-button").on('click', saveFunc);

$(".todo-stream").on('click', ".delete-button", removeCard);
$(".todo-stream").on('click', "#upvote-button", upVote);
$(".todo-stream").on('click', "#downvote-button", downVote);


$('.todo-stream').on('keyup', 'h2', editCard);
$('.todo-stream').on('keyup', 'p', editCard);

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
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var todoArray = getArrayFromStorage();
  todoArray.forEach(function(card, index) {
    if (card.id === id) {
      todoArray.splice(index, 1);
    };
  });
  sendArrayToStorage(todoArray);
  $(this).closest('.todo-card').remove();
};

function upVote() {
  console.log('upvote');
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var cardQ = $(this).closest('.todo-card').find('.todo-quality');
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      if (card.status === 'swill') {
        cardQ.text('plausible');
        card.status = 'plausible';
      } else {
        cardQ.text('genius');
        card.status = 'genius';
    }
    }
  ;})
sendArrayToStorage(todoArray);
};

function downVote() {
  console.log('upvote');
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var cardQ = $(this).closest('.todo-card').find('.todo-quality');
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      if (card.status === 'genius') {
        cardQ.text('plausible');
        card.status = 'plausible';
      } else {
        cardQ.text('swill');
        card.status = 'swill';
    }
    }
  ;})
sendArrayToStorage(todoArray);
};



function editCard(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  }
  var id = $(this).closest('.todo-card')[0].id;

  var todoArray = getArrayFromStorage();
  todoArray.forEach(function(card, index) {
    if (card.id === id) {
      card.title = $('h2').text();
      card.body = $('p').text();
    }
  });
  sendArrayToStorage(todoArray);
};

// function editBody(event) {
//   if (event.keyCode === 13) {
//     event.preventDefault();
//     this.blur();
//   }
//   var id = $(this).closest('.todo-card')[0].id;
//   var body = $(this).text();
//   var todoArray = getArrayFromStorage();
//   todoArray.forEach(function(card) {
//     if (card.id == id) {
//       card.body = body;
//     }
//   });
//   sendArrayToStorage(todoArray);
// };

//internal functions
function FreshTodo(title, body) {
  this.title = title;
  this.body = body;
  this.status = "swill";
  this.id = Date.now();
}

function getArrayFromStorage(){
  var todoArray = localStorage.getItem("todoArray");
  if ((todoArray !== "undefined") && (todoArray !== null)) {
    todoArray = JSON.parse(todoArray);
    return todoArray;
  } else {
    todoArray = [];
    return todoArray;
  };
}

function updateHtml() {
  var todoArray = localStorage.getItem("todoArray");
  if ((todoArray !== "undefined") && (todoArray !== null)) {
    todoArray = JSON.parse(todoArray);
    // return todoArray;
    console.log(todoArray);
    todoArray.forEach(function(card) {
      prependCard(card);
    });
  } else {
    todoArray = [];
    return todoArray;
  };
}



function addCard() {
  var todoTitle = $("#todo-title").val();
  var todoBody = $("#todo-body").val();
  // var todoStatus = "swill"
  var newTodo = new FreshTodo(todoTitle, todoBody);
  prependCard(newTodo);
  var todoArray = getArrayFromStorage();
  todoArray.push(newTodo);
  sendArrayToStorage(todoArray);
};

function sendArrayToStorage(todoArray) {
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
}

// function getTodoFromStorage() {
//   if (localStorage.getItem('todoArray')) {
//     var todoArray = JSON.parse(localStorage.getItem("todoArray"));
//     todoArray.forEach(function(element) {
//       prependCard(element);
//     });
//   };
// }

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

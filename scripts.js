$(window).on('load',showTen);

//event Listeners
$("#todo-body, #todo-title").on('keyup', enableSave);
$("#save-button").on('click', saveFunc);

$(".todo-stream").on('click', ".delete-button", removeCard);
$(".todo-stream").on('click', "#upvote-button", upVote);
$(".todo-stream").on('click', "#downvote-button", downVote);


$('.todo-stream').on('keyup', 'h2', editCard);
$('.todo-stream').on('keyup', 'p', editCard);
$('#search-bar').on('keyup', filterTodo);
$('.todo-stream').on('click', '.completed', todoComplete);

$('.todo-buttons').on('click', '#show-all-button', updateHtml);
$('.todo-buttons').on('click', '#show-completed-button', filterCompleted);


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
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var cardI = $(this).closest('.todo-card').find('.todo-importance');
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      if (card.status === 'none') {
        cardI.text('low');
        card.status = 'low';
      } else if (card.status === 'low') {
        cardI.text('normal');
        card.status = 'normal';
      }else if (card.status === 'normal') {
        cardI.text('high');
        card.status = 'high';
      }else {
        cardI.text('critical');
        card.status = 'critical';
    }
    }
  ;})
sendArrayToStorage(todoArray);
};

function downVote() {
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var cardI = $(this).closest('.todo-card').find('.todo-importance');
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      if (card.status === 'critical') {
        cardI.text('high');
        card.status = 'high';
      } else if (card.status === 'high') {
        cardI.text('normal');
        card.status = 'normal';
      }else if (card.status === 'normal') {
        cardI.text('low');
        card.status = 'low';
      }else {
        cardI.text('none');
        card.status = 'none';
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

function FreshTodo(title, body) {
  this.title = title;
  this.body = body;
  this.status = "normal";
  this.id = Date.now();
  this.completed = false;
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

function updateHtml(event) {
  event.preventDefault();
  var todoArray = localStorage.getItem("todoArray");
  if ((todoArray !== "undefined") && (todoArray !== null)) {
    todoArray = JSON.parse(todoArray);
    todoArray.forEach(function(card) {
      prependCard(card);
    });
  } else {
    todoArray = [];
    return todoArray;
  };
}

function showTen() {
  var todoArray = localStorage.getItem("todoArray");
  if ((todoArray !== "undefined") && (todoArray !== null)) {
    todoArray = JSON.parse(todoArray);
    todoArray.forEach(function(card, index) {
      if (index <= 9){
        prependCard(card);
      }

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
        <h3>importance: <span class="todo-importance">${todo.status}</span></h3>
        <button class="completed">completed</button>
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

function filterTodo() {
  var todoArray = getArrayFromStorage();
  var filterInput = $('#search-bar').val();
  if (filterInput !== ""){
    var filterCards = todoArray.filter(function(card) {
      return (card.title.toLowerCase().includes(filterInput.toLowerCase()) ||
      card.body.toLowerCase().includes(filterInput.toLowerCase()));
    });
    $('.todo-stream').empty();
    filterCards.forEach(function(card) {
      prependCard(card);
    });
  } else if (filterInput === "") {
    $('.todo-stream').empty();
    updateHtml();
  }
}

// not working
function todoComplete() {
  console.log('in complete button');
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var todoCard = $(this).closest('.todo-card');
  console.log(todoCard);
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      // todoCard.classList.add("todo-completed");
    // todoCard.className += " todo-completed";
    $(todoCard).addClass('todo-completed');
      card.completed = true;
  }});
  sendArrayToStorage(todoArray);
}


function filterCompleted(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var filterComplete = todoArray.filter(function(card) {
      return (card.completed === true)
    });
    $('.todo-stream').empty();
    filterComplete.forEach(function(card) {
      prependCard(card);
    });

}


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

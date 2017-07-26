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
$('.todo-buttons').on('click', '.critical', showCritical);
$('.todo-buttons').on('click', '.high', showHigh);
$('.todo-buttons').on('click', '.normal', showNormal);
$('.todo-buttons').on('click', '.low', showLow);
$('.todo-buttons').on('click', '.none', showNone);


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
  addCard();
  resetInputs();
  enableSave();
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
}

function upVote(e) {
  console.log(e.target);
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var cardI = $(this).closest('.todo-card').find('.todo-importance');
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      importanceUp(card);
    }
  ;})
sendArrayToStorage(todoArray);
};

// if you click up, go up; if you click down, go down
function importanceUp(card, event) {
// var importances = ['none', 'low', 'normal', 'high', 'critical'];
// if (event.target === up arrow && current index < array.length) {
//var puppies = current index of card.status
// card.status = current index + 1 / puppies +=;
// }
  console.log(event.target);
  switch (card.status) {
    case 'none':
      card.status = 'low';
      break;
    case 'low':
      card.status = 'normal';
      break;
    case 'normal':
      card.status = 'high';
      break;
    case 'high':
      card.status = 'critical';
      break;
      default:
      break;
  }
}

function downVote() {
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  var cardI = $(this).closest('.todo-card').find('.todo-importance');
  todoArray.forEach(function(card, index) {
    if (card.id === id ) {
      importanceDown(card, cardI);
    }
  ;})
sendArrayToStorage(todoArray);
};

function importanceDown(card, cardI) {
  switch (card.status) {
    case 'critical':
      cardI.text('high');
      card.status = 'high';
      break;
    case 'high':
      cardI.text('normal');
      card.status = 'normal';
      break;
    case 'normal':
      cardI.text('low');
      card.status = 'low';
      break;
    case 'low':
      cardI.text('none');
      card.status = 'none';
      break;
      default:
      break;
  }
}

function editArray(id, event) {
  var todoArray = getArrayFromStorage();
  todoArray.map(function(card, index) {
    if (card.id === id) {
      console.log($(event.target));
      card.title = $(event.target).closest('.todo-card').find('h2').text();
      card.body = $(event.target).closest('.todo-card').find('p').text();
    }
  });
  return todoArray;
}

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
}
}


function FreshTodo(title, body) {
  this.title = title;
  this.body = body;
  this.status = "normal";
  this.id = Date.now();
  this.completed = 'incomplete';
}

function getArrayFromStorage(){
  var todoArray = localStorage.getItem("todoArray");
  if ((todoArray !== "undefined") && (todoArray !== null)) {
    todoArray = JSON.parse(todoArray);
    return todoArray;
  } else {
    emptyArray(todoArray);
  };
}

function updateHtml(event) {
  event.preventDefault();
  var todoArray = localStorage.getItem("todoArray");
  if ((todoArray !== "undefined") && (todoArray !== null)) {
    todoArray = JSON.parse(todoArray);
    updateStream(todoArray);
  } else {
    emptyArray(todoArray);
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
    emptyArray(todoArray);
  };
}

function emptyArray(todoArray) {
  todoArray = [];
  return todoArray;
}

function addCard() {
  var todoTitle = $("#todo-title").val();
  var todoBody = $("#todo-body").val();
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
    `<div class="todo-card ${todo.completed}" id="${todo.id}">
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


function filterTodo() {
  var todoArray = getArrayFromStorage();
  var filterInput = $('#search-bar').val();
  if (filterInput !== ""){
    matchFilterInput(todoArray, filterInput);
  } else if (filterInput === "") {
    adjustStream();
  }
}

function matchFilterInput(todoArray, filterInput) {
  var filterCards = todoArray.filter(function(card) {
    return (card.title.toLowerCase().includes(filterInput.toLowerCase()) ||
    card.body.toLowerCase().includes(filterInput.toLowerCase()));
  });
  updateStream(filterCards);
}

function todoComplete() {
  var todoArray = getArrayFromStorage();
  var id = parseInt($(this).closest('.todo-card').attr('id'));
  todoArray = completedClass(todoArray, id);
  sendArrayToStorage(todoArray);
  adjustStream();
}

function adjustStream() {
  $('.todo-stream').empty();
  showTen();
}

function completedClass(todoArray, id) {
  todoArray.forEach(function(card, index) {
  if (card.id === id ) {
    card.completed = 'todo-completed';
}});
  return todoArray;
}

function filterCompleted(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var filterComplete = todoArray.filter(function(card) {
      return (card.completed === 'todo-completed')
    });
    updateStream(filterComplete);
}

function updateStream(array) {
  $('.todo-stream').empty();
  array.forEach(function(card) {
    prependCard(card);
  });
}

function showCritical(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var criticalArray = todoArray.filter(function(card) {
      return (card.status === 'critical')
    });
    updateStream(criticalArray);
}

function showHigh(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var highArray = todoArray.filter(function(card) {
      return (card.status === 'high')
    });
    updateStream(highArray);
}

function showNormal(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var normalArray = todoArray.filter(function(card) {
      return (card.status === 'normal')
    });
    updateStream(normalArray);
}

function showLow(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var lowArray = todoArray.filter(function(card) {
      return (card.status === 'low')
    });
    updateStream(lowArray);
}

function showNone(event) {
  event.preventDefault();
  var todoArray = getArrayFromStorage();
  var noneArray = todoArray.filter(function(card) {
      return (card.status === 'none')
    });
    updateStream(noneArray);
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

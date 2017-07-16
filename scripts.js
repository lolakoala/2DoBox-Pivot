function addCard() {
  var ideaTitle = document.getElementById("idea-title").value;
  var ideaBody = document.getElementById("idea-body").value;
  $('.idea-stream').prepend(
    `<div class="idea-card">
    <h2>${ideaTitle}</h2>
    <img src="/icons/delete.svg" />
    <p>${ideaBody}</p>
    <img src="/icons/upvote.svg" />
    <img src="/icons/downvote.svg" />
    <h3>quality: <span class="idea-quality">swill</span></h3>
    </div>`
  );
};

function evalInputs() {
  var ideaTitle = $('#idea-title').val();
  var ideaBody = $('#idea-body').val();
  if (!ideaTitle) {
    return alert("Please enter a title.");
  } else if (!ideaBody) {
    return alert ("Pease enter somthing in the body.");
  } else {
    addCard();
  }
};

$('#save-button').on('click', function(event) {
  event.preventDefault();
  evalInputs();
});

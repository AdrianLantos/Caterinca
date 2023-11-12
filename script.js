function activate(className) {
  var element = document.querySelector("." + className);
  element.classList.add("active");
}

function deactivate(className) {
  var element = document.querySelector("." + className);
  element.classList.remove("active");
}

function hide(element) {
  var element = document.querySelector(element);
  element.style.display = "none";
}

function openTut() {
  activate("tutorial");
  setTimeout(function () {
    deactivate("user-list-wrapper");
    deactivate("info");
  }, 900);
  setTimeout(function () {
    hide(".user-list-wrapper");
    hide(".info");
  }, 1800);
}

function startGame() {
  deactivate("tutorial");
  document.querySelector(".background").classList.add("player");
  activate("player-hand");
}

var cardsList = document.querySelectorAll(".card");
var cardSelected = false;
var selectedCard;

function deselectCard(card) {
  card.classList.remove("selected");
  cardSelected = false;
  deactivate("player-hand .main-btn");
}

function selectCard(card) {
  cardSelected = true;
  selectedCard = card;
  card.classList.add("selected");
  activate("player-hand .main-btn");
}

cardsList.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("selected")) {
      deselectCard(card);
    } else if (!cardSelected) {
      selectCard(card);
    } else if (cardSelected) {
      selectedCard.classList.remove("selected");
      selectCard(card);
    }
  });
});

var cards = document.querySelector(".player-hand .cards");
var hand = document.querySelector(".player-hand");

//Check if mouse was pressed. Used to stop drag when mouse outside window.
var mouseDown;
hand.dataset.hold = false;
hand.onmousedown = (e) => {
  mouseDown = true;
  cards.dataset.mouseDown = e.clientX;
  cards.dataset.hold = true;
};

hand.onmouseup = () => {
  mouseDown = false;
  cards.dataset.hold = false;
  cards.dataset.prev = cards.dataset.moved;
};

//Function used to stop drag when mouse leaves window.
function addEvent(obj, evt, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent("on" + evt, fn);
  }
}

// Set boolean mouseDown to false to prevent drag continuing if user let go of the mouse outside of the window.
// Save the slid % to prevent jumping
addEvent(document, "mouseout", function (e) {
  if (mouseDown) {
    e = e ? e : window.event;
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
      mouseDown = false;
      cards.dataset.prev = cards.dataset.moved;
    }
  }
});

hand.onmousemove = (e) => {
  if (!mouseDown) return;
  if (cards.dataset.hold == hand.dataset.hold) return;
  const mouseDelta = parseFloat(cards.dataset.mouseDown) - e.clientX;
  const maxDelta = window.innerWidth * 1.5;

  const precentage = (mouseDelta / maxDelta) * -100;
  var move = parseFloat(cards.dataset.prev) + precentage;
  cards.dataset.moved = move;

  if (move < 0) move = Math.max(move, -100);
  if (move > 0) move = Math.min(move, 0);

  cards.style.left = `${move}%`;
  e.stopPropagation();
};

const sendBtn = document.querySelector(".player-hand .main-btn");
sendBtn.addEventListener("click", () => {
  if (sendBtn.classList.contains("active")) {
    const btnBar = document.querySelector(".player-hand .btn-bar");
    btnBar.innerHTML = "Ceilalți jucători încă aleg";

    setTimeout(function () {
      document.querySelector(".background").classList.remove("player");
      deactivate("player-hand");
      activate("winner");
    }, 1000);

    setTimeout(function () {
      deactivate("winner");
      document.querySelector(".background").classList.add("reader");
      activate("reader-hand");
    }, 6000);
  }
});

//Reader hand functionallity

var readerCards = document.querySelector(".reader-hand .cards");
var readerHand = document.querySelector(".reader-hand");
readerHand.dataset.hold = false;
readerHand.onmousedown = (e) => {
  mouseDown = true;
  readerCards.dataset.mouseDown = e.clientX;
  readerCards.dataset.hold = true;
};

readerHand.onmouseup = () => {
  mouseDown = false;
  readerCards.dataset.hold = false;
  readerCards.dataset.prev = readerCards.dataset.moved;
};

function addEvent(obj, evt, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent("on" + evt, fn);
  }
}

addEvent(document, "mouseout", function (e) {
  if (mouseDown) {
    e = e ? e : window.event;
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
      mouseDown = false;
      readerCards.dataset.prev = readerCards.dataset.moved;
    }
  }
});

readerHand.onmousemove = (e) => {
  if (!mouseDown) return;
  if (readerCards.dataset.hold == readerHand.dataset.hold) return;
  const mouseDelta = parseFloat(readerCards.dataset.mouseDown) - e.clientX;
  const maxDelta = window.innerWidth * 1.5;

  const precentage = (mouseDelta / maxDelta) * -100;
  var move = parseFloat(readerCards.dataset.prev) + precentage;
  readerCards.dataset.moved = move;

  if (move < 0) move = Math.max(move, -100);
  if (move > 0) move = Math.min(move, 0);

  readerCards.style.left = `${move}%`;
  e.stopPropagation();
};

function init() {
  let div = document.createElement("div");
  div.className = "buttons";
  div.innerHTML = `<button id="highlight_text_please">Highlight</button>
    <button id="add_note">Add note</button>
    <button id="add_text">Add text</button>
    <button id="stop_add_text" class="hidden">Stop add text</button>`;
  const style = document.createElement(`style`);
  var styles = `
    .buttons {
        position: fixed!important;
        z-index:10000!important;
        bottom: 0!important;
        left: 50%!important;
        -webkit-transform: translateX(-50%);
                transform: translateX(-50%);
      }
      .hidden{
        display:none !important;
      }
      /*# sourceMappingURL=popup.css.map */
    `;
  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  document.body.appendChild(div);
}
function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
function getPathTo(element) {
  if (element.tagName == "HTML") return "/HTML[1]";
  if (element === document.body) return "/HTML[1]/BODY[1]";

  var ix = 0;
  var siblings = element.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element)
      return (
        getPathTo(element.parentNode) +
        "/" +
        element.tagName +
        "[" +
        (ix + 1) +
        "]"
      );
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

function saveToLocalStorage(element) {
  let xpath = getPathTo(element);
  let info = { xpath: xpath, html: element.innerHTML };
  let initialInfo = JSON.parse(localStorage.getItem("changesToBeDone"));
  if (initialInfo != undefined) {
    initialInfo.push(info);
  } else {
    initialInfo = [];
    initialInfo.push(info);
  }
  localStorage.setItem("changesToBeDone", JSON.stringify(initialInfo));
}

function highlightText() {
  function makeEditableAndHighlight(colour) {
    var range,
      sel = window.getSelection();
    if (sel.rangeCount && sel.getRangeAt) {
      range = sel.getRangeAt(0);
    }
    document.designMode = "on";
    if (range) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
    // Use HiliteColor since some browsers apply BackColor to the whole block
    if (!document.execCommand("HiliteColor", false, colour)) {
      document.execCommand("BackColor", false, colour);
    }
    document.designMode = "off";
  }

  function highlight(colour) {
    var range, sel;
    if (window.getSelection) {
      // IE9 and non-IE
      try {
        if (!document.execCommand("BackColor", false, colour)) {
          makeEditableAndHighlight(colour);
        }
      } catch (ex) {
        makeEditableAndHighlight(colour);
      }
    } else if (document.selection && document.selection.createRange) {
      // IE <= 8 case
      range = document.selection.createRange();
      range.execCommand("BackColor", false, colour);
    }
  }
  document
    .querySelector("#highlight_text_please")
    .addEventListener("click", (e) => {
      highlight("yellow");
    });
}

function addText() {
  document.querySelector("#add_text").addEventListener("click", (e) => {
    document.querySelector("body").setAttribute("contenteditable", true);
    document.querySelector("#stop_add_text").classList.remove("hidden");
  });
}

function stopAddText() {
  document.querySelector("#stop_add_text").addEventListener("click", (e) => {
    document.querySelector("body").setAttribute("contenteditable", false);
    document.querySelector("#stop_add_text").classList.add("hidden");
  });
}

function addNote() {}

init();
highlightText();
addText();
stopAddText();
addNote();

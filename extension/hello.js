function init() {
  let div = document.createElement("div");
  div.className = "ohho";
  div.innerHTML = `
    <div class="coverofext hidden"></div>
    <div class="buttons">
      <button id="highlight_text_please" class="btn">Highlight</button>
      <button id="add_note" class="btn">Add note</button>
      <button id="add_text" class="btn">Add text</button>
      <button id="stop_add_text" class="hidden btn">Stop add text</button>
    </div>
    `;
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
      .coverofext{
        position:fixed; 
        top:0;
        left:0;
        height:100vh;
        width:100vw;
        z-index:100;
        background:rgba(0, 0, 0, 0.363);
      }
    .btn{
      border-radius:10px;
      padding: 10px;
      margin: 10px;
      color: #000;
      border: none;
      background: #f2f5f6;
      background: -moz-linear-gradient(top, #f2f5f6 0%, #e3eaed 37%, #c8d7dc 100%);
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f2f5f6), color-stop(37%,#e3eaed), color-stop(100%,#c8d7dc));
      background: -webkit-linear-gradient(top, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%);
      background: -o-linear-gradient(top, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%);
      background: -ms-linear-gradient(top, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%);
      background: linear-gradient(top, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%);
    }
    .btn:hover{
      cursor:pointer;
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
  var script = document.createElement("script");
  script.src =
    "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
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

function saveChanges(e) {}

function addText() {
  document.querySelector("#add_text").addEventListener("click", (e) => {
    document.querySelector("body").setAttribute("contenteditable", true);
    document.querySelector("#stop_add_text").classList.remove("hidden");
    document.body.addEventListener("keydown", saveChanges);
  });
}

function stopAddText() {
  document.querySelector("#stop_add_text").addEventListener("click", (e) => {
    document.querySelector("body").setAttribute("contenteditable", false);
    document.querySelector("#stop_add_text").classList.add("hidden");
    document.body.removeEventListener("keydown", saveChanges);
  });
}

function addNote() {
  function note() {
    document.querySelector(".coverofext").classList.remove("hidden");
    window.setTimeout(() => {
      document.addEventListener("click", startAddNote);
      function startAddNote(event) {
        var myTop = event.pageY;
        var myRight = event.pageX;
        let a = document.createElement("div");
        console.log(myTop + " " + myRight)
        a.innerHTML = `
        <div 
          contenteditable=true 
          style='width: 80px;
          min-height: 80px;
          resize: both;
          overflow: auto;
          border:2px;
          position:absolute;
          top:${myTop}px;
          left:${myRight}px;
          background:yellow;' >
        </div>`;
        document.body.appendChild(a);
        document.querySelector(".coverofext").classList.add("hidden");
        window.setTimeout(() => {
          document.removeEventListener("click", startAddNote);
        }, 100);
      }
    }, 100);
  }

  document.querySelector("#add_note").addEventListener("click", (e) => {
    note();
  });
}

init();
highlightText();
addText();
stopAddText();
addNote();

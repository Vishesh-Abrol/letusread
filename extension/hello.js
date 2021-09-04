function init() {
    let div = document.createElement("div");
    div.className = "buttons";
    div.innerHTML = `<button id="highlight_text_please">Highlight</button>
    <button id="add_note">Add note</button>
    <button id="add_text">Add text</button>`; 
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
      /*# sourceMappingURL=popup.css.map */
    `
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    document.body.appendChild(div);
}
function highlightText()
{
    function makeEditableAndHighlight(colour) {
      var range, sel = window.getSelection();
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
              makeEditableAndHighlight(colour)
          }
      } else if (document.selection && document.selection.createRange) {
          // IE <= 8 case
          range = document.selection.createRange();
          range.execCommand("BackColor", false, colour);
      }
    }
    document.querySelector("#highlight_text_please").addEventListener("click",(e)=>{
      highlight("yellow")  
    })

}
function addText(){

}

function addNote(){

}

init();
highlightText()
addText()
addNote()
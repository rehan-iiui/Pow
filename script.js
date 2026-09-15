/* =========================================================
   PRESENTATION STUDIO ULTIMATE
   FULL WORKING ENGINE
   ========================================================= */

const slidesList = document.getElementById("slidesList");
const slideCanvas = document.getElementById("slideCanvas");
const slideCount = document.getElementById("slideCount");
const slideNumber = document.getElementById("slideNumber");

const addSlideBtn = document.getElementById("addSlideBtn");
const bottomAddSlide = document.getElementById("bottomAddSlide");
const duplicateSlideBtn = document.getElementById("duplicateSlideBtn");
const deleteSlideBtn = document.getElementById("deleteSlideBtn");

const addTextBtn = document.getElementById("addTextBtn");
const addImageBtn = document.getElementById("addImageBtn");
const addShapeBtn = document.getElementById("addShapeBtn");
const addTableBtn = document.getElementById("addTableBtn");

const backgroundBtn = document.getElementById("backgroundBtn");
const themeBtn = document.getElementById("themeBtn");

const backgroundMenu = document.getElementById("backgroundMenu");
const shapeMenu = document.getElementById("shapeMenu");

const imageInput = document.getElementById("imageInput");

const saveBtn = document.getElementById("saveBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const presentBtn = document.getElementById("presentBtn");

const presentationMode =
  document.getElementById("presentationMode");

const presentationSlide =
  document.getElementById("presentationSlide");

const previousPresentationBtn =
  document.getElementById("previousPresentationBtn");

const nextPresentationBtn =
  document.getElementById("nextPresentationBtn");

const exitPresentationBtn =
  document.getElementById("exitPresentationBtn");

const presentationCounter =
  document.getElementById("presentationCounter");

const fullscreenEditorBtn =
  document.getElementById("fullscreenEditorBtn");

const fitBtn =
  document.getElementById("fitBtn");

const zoomInBtn =
  document.getElementById("zoomInBtn");

const zoomOutBtn =
  document.getElementById("zoomOutBtn");

const zoomValue =
  document.getElementById("zoomValue");

const themeButton =
  document.getElementById("themeBtn");

const presentationName =
  document.getElementById("presentationName");

const statusText =
  document.getElementById("statusText");

const autosaveStatus =
  document.getElementById("autosaveStatus");

const wordCount =
  document.getElementById("wordCount");

const toast =
  document.getElementById("toast");

const fontFamily =
  document.getElementById("fontFamily");

const fontSize =
  document.getElementById("fontSize");

const boldBtn =
  document.getElementById("boldBtn");

const italicBtn =
  document.getElementById("italicBtn");

const underlineBtn =
  document.getElementById("underlineBtn");

const alignLeftBtn =
  document.getElementById("alignLeftBtn");

const alignCenterBtn =
  document.getElementById("alignCenterBtn");

const alignRightBtn =
  document.getElementById("alignRightBtn");

const textColor =
  document.getElementById("textColor");

const slideColor =
  document.getElementById("slideColor");

const speakerNotes =
  document.getElementById("speakerNotes");

const quickTitleBtn =
  document.getElementById("quickTitleBtn");

const quickSubtitleBtn =
  document.getElementById("quickSubtitleBtn");

const quickBulletBtn =
  document.getElementById("quickBulletBtn");

const quickQuoteBtn =
  document.getElementById("quickQuoteBtn");


/* =========================================================
   DATA
   ========================================================= */

let slides = [];

let currentSlideIndex = 0;

let selectedElement = null;

let zoom = 1;

let presentationIndex = 0;

let undoStack = [];

let redoStack = [];


/* =========================================================
   CREATE INITIAL SLIDE
   ========================================================= */

function createInitialSlide() {

  slides = [
    {
      background: "#ffffff",
      elements: [],
      notes: ""
    }
  ];

  currentSlideIndex = 0;

  renderAll();

}


/* =========================================================
   SAVE STATE FOR UNDO
   ========================================================= */

function saveState() {

  undoStack.push(
    JSON.stringify(slides)
  );

  if (undoStack.length > 50) {
    undoStack.shift();
  }

  redoStack = [];

}


/* =========================================================
   UNDO
   ========================================================= */

undoBtn.addEventListener("click", () => {

  if (undoStack.length === 0) {
    showToast("Nothing to undo.");
    return;
  }

  redoStack.push(
    JSON.stringify(slides)
  );

  slides =
    JSON.parse(
      undoStack.pop()
    );

  selectedElement = null;

  renderAll();

  showToast("Undo");

});


/* =========================================================
   REDO
   ========================================================= */

redoBtn.addEventListener("click", () => {

  if (redoStack.length === 0) {
    showToast("Nothing to redo.");
    return;
  }

  undoStack.push(
    JSON.stringify(slides)
  );

  slides =
    JSON.parse(
      redoStack.pop()
    );

  selectedElement = null;

  renderAll();

  showToast("Redo");

});


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderAll() {

  renderSlidesList();

  renderCanvas();

  updateCounts();

}


/* =========================================================
   RENDER SLIDE THUMBNAILS
   ========================================================= */

function renderSlidesList() {

  slidesList.innerHTML = "";

  slides.forEach((slide, index) => {

    const thumbnail =
      document.createElement("div");

    thumbnail.className =
      "slide-thumbnail";

    if (index === currentSlideIndex) {
      thumbnail.classList.add("active");
    }

    thumbnail.style.background =
      slide.background;

    const number =
      document.createElement("span");

    number.className =
      "slide-thumbnail-number";

    number.textContent =
      index + 1;

    thumbnail.appendChild(number);


    const content =
      document.createElement("div");

    content.className =
      "thumb-content";


    const textElements =
      slide.elements.filter(
        element =>
          element.type === "text"
      );


    if (textElements.length > 0) {

      textElements.slice(0, 3).forEach(element => {

        const p =
          document.createElement("div");

        p.textContent =
          element.text;

        p.style.fontSize =
          `${Math.max(4, element.fontSize / 7)}px`;

        p.style.fontWeight =
          element.bold ? "700" : "400";

        p.style.marginBottom =
          "3px";

        content.appendChild(p);

      });

    } else {

      content.innerHTML =
        `<div style="
          color:#777;
          font-size:6px;
        ">Blank slide</div>`;

    }


    thumbnail.appendChild(content);


    thumbnail.addEventListener(
      "click",
      () => {

        currentSlideIndex =
          index;

        selectedElement =
          null;

        renderAll();

      }
    );


    slidesList.appendChild(
      thumbnail
    );

  });

}


/* =========================================================
   RENDER CANVAS
   ========================================================= */

function renderCanvas() {

  const slide =
    slides[currentSlideIndex];

  slideCanvas.innerHTML = "";

  slideCanvas.style.background =
    slide.background;


  slide.elements.forEach(element => {

    const el =
      createElementDOM(element);

    slideCanvas.appendChild(el);

  });


  slideColor.value =
    colorForInput(slide.background);


  speakerNotes.value =
    slide.notes || "";


  applyZoom();

}


/* =========================================================
   CREATE ELEMENT DOM
   ========================================================= */

function createElementDOM(element) {

  let el;


  if (element.type === "text") {

    el =
      document.createElement("div");

    el.className =
      "slide-element text-element";

    el.contentEditable =
      "true";

    el.textContent =
      element.text;

    el.style.fontFamily =
      element.fontFamily;

    el.style.fontSize =
      `${element.fontSize}px`;

    el.style.fontWeight =
      element.bold ? "700" : "400";

    el.style.fontStyle =
      element.italic ? "italic" : "normal";

    el.style.textDecoration =
      element.underline
        ? "underline"
        : "none";

    el.style.textAlign =
      element.align;

    el.style.color =
      element.color;

    el.style.left =
      `${element.x}px`;

    el.style.top =
      `${element.y}px`;

    el.style.width =
      `${element.width}px`;

    el.style.minHeight =
      `${element.height}px`;


    el.addEventListener(
      "focus",
      () => {

        selectedElement =
          element;

        updatePropertyPanel();

      }
    );


    el.addEventListener(
      "input",
      () => {

        element.text =
          el.innerText;

        updateWordCount();

        autosave();

      }
    );


    el.addEventListener(
      "mousedown",
      event => {

        selectAndDrag(
          event,
          el,
          element
        );

      }
    );


    el.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        selectedElement =
          element;

        updatePropertyPanel();

      }
    );

  }


  else if (element.type === "shape") {

    el =
      document.createElement("div");

    el.className =
      "slide-element shape-element";

    el.style.left =
      `${element.x}px`;

    el.style.top =
      `${element.y}px`;

    el.style.width =
      `${element.width}px`;

    el.style.height =
      `${element.height}px`;


    if (element.shape === "rectangle") {
      el.classList.add("shape-rectangle");
    }

    if (element.shape === "circle") {
      el.classList.add("shape-circle");
    }

    if (element.shape === "triangle") {
      el.classList.add("shape-triangle");
    }

    if (element.shape === "star") {

      el.classList.add("shape-star");

      el.textContent = "★";

    }

    if (element.shape === "arrow") {

      el.classList.add("shape-arrow");

      el.textContent = "➜";

    }


    el.addEventListener(
      "mousedown",
      event => {

        selectAndDrag(
          event,
          el,
          element
        );

      }
    );


    el.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        selectedElement =
          element;

        updatePropertyPanel();

      }
    );

  }


  else if (element.type === "image") {

    el =
      document.createElement("img");

    el.className =
      "slide-element";

    el.src =
      element.src;

    el.style.left =
      `${element.x}px`;

    el.style.top =
      `${element.y}px`;

    el.style.width =
      `${element.width}px`;

    el.style.height =
      `${element.height}px`;

    el.style.objectFit =
      "contain";


    el.addEventListener(
      "mousedown",
      event => {

        selectAndDrag(
          event,
          el,
          element
        );

      }
    );


    el.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        selectedElement =
          element;

      }
    );

  }


  else if (element.type === "table") {

    el =
      document.createElement("table");

    el.className =
      "slide-element";

    el.style.left =
      `${element.x}px`;

    el.style.top =
      `${element.y}px`;

    el.style.width =
      `${element.width}px`;

    el.style.height =
      `${element.height}px`;

    el.style.borderCollapse =
      "collapse";


    for (let r = 0; r < 3; r++) {

      const tr =
        document.createElement("tr");

      for (let c = 0; c < 3; c++) {

        const td =
          document.createElement("td");

        td.textContent =
          element.cells[r][c];

        td.contentEditable =
          "true";

        td.style.border =
          "1px solid #555";

        td.style.padding =
          "8px";

        td.style.textAlign =
          "center";

        tr.appendChild(td);

      }

      el.appendChild(tr);

    }


    el.addEventListener(
      "mousedown",
      event => {

        selectAndDrag(
          event,
          el,
          element
        );

      }
    );

  }


  return el;

}


/* =========================================================
   DRAG ELEMENT
   ========================================================= */

function selectAndDrag(event, domElement, element) {

  if (
    event.target.isContentEditable &&
    event.target !== domElement
  ) {
    return;
  }


  event.preventDefault();

  selectedElement =
    element;


  const startX =
    event.clientX;

  const startY =
    event.clientY;

  const originalX =
    element.x;

  const originalY =
    element.y;


  saveState();


  function move(moveEvent) {

    const dx =
      (moveEvent.clientX - startX) / zoom;

    const dy =
      (moveEvent.clientY - startY) / zoom;


    element.x =
      Math.max(
        0,
        Math.min(
          900 - element.width,
          originalX + dx
        )
      );


    element.y =
      Math.max(
        0,
        Math.min(
          506 - element.height,
          originalY + dy
        )
      );


    domElement.style.left =
      `${element.x}px`;

    domElement.style.top =
      `${element.y}px`;

  }


  function stop() {

    document.removeEventListener(
      "mousemove",
      move
    );

    document.removeEventListener(
      "mouseup",
      stop
    );

    autosave();

  }


  document.addEventListener(
    "mousemove",
    move
  );

  document.addEventListener(
    "mouseup",
    stop
  );

}


/* =========================================================
   ADD SLIDE
   ========================================================= */

function addSlide() {

  saveState();


  slides.splice(
    currentSlideIndex + 1,
    0,
    {
      background: "#ffffff",
      elements: [],
      notes: ""
    }
  );


  currentSlideIndex++;

  selectedElement = null;

  renderAll();

  showToast("New slide created.");

}


addSlideBtn.addEventListener(
  "click",
  addSlide
);

bottomAddSlide.addEventListener(
  "click",
  addSlide
);


/* =========================================================
   DUPLICATE SLIDE
   ========================================================= */

duplicateSlideBtn.addEventListener(
  "click",
  () => {

    saveState();


    const copy =
      JSON.parse(
        JSON.stringify(
          slides[currentSlideIndex]
        )
      );


    slides.splice(
      currentSlideIndex + 1,
      0,
      copy
    );


    currentSlideIndex++;

    selectedElement = null;

    renderAll();

    showToast(
      "Slide duplicated."
    );

  }
);


/* =========================================================
   DELETE SLIDE
   ========================================================= */

deleteSlideBtn.addEventListener(
  "click",
  () => {

    if (slides.length === 1) {

      showToast(
        "You need at least one slide."
      );

      return;

    }


    saveState();


    slides.splice(
      currentSlideIndex,
      1
    );


    if (
      currentSlideIndex >= slides.length
    ) {

      currentSlideIndex =
        slides.length - 1;

    }


    selectedElement = null;

    renderAll();

    showToast(
      "Slide deleted."
    );

  }
);


/* =========================================================
   ADD TEXT
   ========================================================= */

function addText(
  text = "Double-click to edit"
) {

  saveState();


  const element = {

    id:
      Date.now(),

    type:
      "text",

    text,

    x:
      130,

    y:
      100,

    width:
      500,

    height:
      70,

    fontFamily:
      "Arial",

    fontSize:
      32,

    bold:
      false,

    italic:
      false,

    underline:
      false,

    align:
      "left",

    color:
      "#111111"

  };


  slides[currentSlideIndex]
    .elements
    .push(element);


  selectedElement =
    element;


  renderAll();

  updatePropertyPanel();

  showToast(
    "Text added."
  );

}


addTextBtn.addEventListener(
  "click",
  () => addText()
);


/* =========================================================
   QUICK INSERT
   ========================================================= */

quickTitleBtn.addEventListener(
  "click",
  () => {

    addText(
      "Presentation Title"
    );

    selectedElement.fontSize =
      48;

    selectedElement.bold =
      true;

    renderAll();

  }
);


quickSubtitleBtn.addEventListener(
  "click",
  () => {

    addText(
      "Add your subtitle here"
    );

    selectedElement.fontSize =
      24;

    renderAll();

  }
);


quickBulletBtn.addEventListener(
  "click",
  () => {

    addText(
      "• First point\n• Second point\n• Third point"
    );

    selectedElement.fontSize =
      26;

    renderAll();

  }
);


quickQuoteBtn.addEventListener(
  "click",
  () => {

    addText(
      "“Your big idea starts here.”"
    );

    selectedElement.fontSize =
      30;

    selectedElement.italic =
      true;

    renderAll();

  }
);


/* =========================================================
   IMAGE
   ========================================================= */

addImageBtn.addEventListener(
  "click",
  () => {

    imageInput.click();

  }
);


imageInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      () => {

        saveState();


        const element = {

          id:
            Date.now(),

          type:
            "image",

          src:
            reader.result,

          x:
            180,

          y:
            100,

          width:
            400,

          height:
            250

        };


        slides[currentSlideIndex]
          .elements
          .push(element);


        selectedElement =
          element;


        renderAll();

        showToast(
          "Image added."
        );

      };


    reader.readAsDataURL(file);

    imageInput.value = "";

  }
);


/* =========================================================
   SHAPE MENU
   ========================================================= */

addShapeBtn.addEventListener(
  "click",
  event => {

    shapeMenu.classList.toggle(
      "hidden"
    );

    backgroundMenu.classList.add(
      "hidden"
    );


    shapeMenu.style.left =
      `${event.clientX}px`;

    shapeMenu.style.top =
      `${event.clientY + 8}px`;

  }
);


shapeMenu
  .querySelectorAll("button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        addShape(
          button.dataset.shape
        );

        shapeMenu.classList.add(
          "hidden"
        );

      }
    );

  });


function addShape(shape) {

  saveState();


  const element = {

    id:
      Date.now(),

    type:
      "shape",

    shape,

    x:
      250,

    y:
      160,

    width:
      shape === "triangle"
        ? 140
        : 180,

    height:
      shape === "triangle"
        ? 120
        : 120

  };


  slides[currentSlideIndex]
    .elements
    .push(element);


  selectedElement =
    element;


  renderAll();

}


/* =========================================================
   TABLE
   ========================================================= */

addTableBtn.addEventListener(
  "click",
  () => {

    saveState();


    const cells = [
      ["Header 1", "Header 2", "Header 3"],
      ["Value", "Value", "Value"],
      ["Value", "Value", "Value"]
    ];


    const element = {

      id:
        Date.now(),

      type:
        "table",

      x:
        180,

      y:
        120,

      width:
        540,

      height:
        180,

      cells

    };


    slides[currentSlideIndex]
      .elements
      .push(element);


    selectedElement =
      element;


    renderAll();

    showToast(
      "Table added."
    );

  }
);


/* =========================================================
   BACKGROUND MENU
   ========================================================= */

backgroundBtn.addEventListener(
  "click",
  event => {

    backgroundMenu.classList.toggle(
      "hidden"
    );

    shapeMenu.classList.add(
      "hidden"
    );


    backgroundMenu.style.left =
      `${event.clientX}px`;

    backgroundMenu.style.top =
      `${event.clientY + 8}px`;

  }
);


backgroundMenu
  .querySelectorAll("[data-bg]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        saveState();

        slides[currentSlideIndex]
          .background =
          button.dataset.bg;

        renderAll();

        backgroundMenu.classList.add(
          "hidden"
        );

      }
    );

  });


document
  .getElementById("gradientBackgroundBtn")
  .addEventListener(
    "click",
    () => {

      saveState();


      slides[currentSlideIndex]
        .background =
        "linear-gradient(135deg,#6c63ff,#ff6ec7)";


      renderAll();

      backgroundMenu.classList.add(
        "hidden"
      );

    }
  );


/* =========================================================
   SLIDE COLOR
   ========================================================= */

slideColor.addEventListener(
  "input",
  () => {

    slides[currentSlideIndex]
      .background =
      slideColor.value;

    renderCanvas();

    autosave();

  }
);


/* =========================================================
   PROPERTIES
   ========================================================= */

function updatePropertyPanel() {

  if (!selectedElement) {
    return;
  }


  if (selectedElement.type !== "text") {
    return;
  }


  fontFamily.value =
    selectedElement.fontFamily;

  fontSize.value =
    selectedElement.fontSize;

  textColor.value =
    colorForInput(
      selectedElement.color
    );

}


fontFamily.addEventListener(
  "change",
  () => {

    if (!selectedElement) {
      return;
    }

    if (
      selectedElement.type !== "text"
    ) {
      return;
    }

    saveState();

    selectedElement.fontFamily =
      fontFamily.value;

    renderCanvas();

    autosave();

  }
);


fontSize.addEventListener(
  "input",
  () => {

    if (!selectedElement) {
      return;
    }

    if (
      selectedElement.type !== "text"
    ) {
      return;
    }

    selectedElement.fontSize =
      Number(fontSize.value);

    renderCanvas();

    autosave();

  }
);


boldBtn.addEventListener(
  "click",
  () => {

    changeTextProperty(
      "bold",
      !selectedElement?.bold
    );

  }
);


italicBtn.addEventListener(
  "click",
  () => {

    changeTextProperty(
      "italic",
      !selectedElement?.italic
    );

  }
);


underlineBtn.addEventListener(
  "click",
  () => {

    changeTextProperty(
      "underline",
      !selectedElement?.underline
    );

  }
);


alignLeftBtn.addEventListener(
  "click",
  () =>
    changeTextProperty(
      "align",
      "left"
    )
);


alignCenterBtn.addEventListener(
  "click",
  () =>
    changeTextProperty(
      "align",
      "center"
    )
);


alignRightBtn.addEventListener(
  "click",
  () =>
    changeTextProperty(
      "align",
      "right"
    )
);


function changeTextProperty(
  property,
  value
) {

  if (!selectedElement) {
    showToast(
      "Select a text box first."
    );

    return;
  }


  if (
    selectedElement.type !== "text"
  ) {
    showToast(
      "This option is for text."
    );

    return;
  }


  saveState();

  selectedElement[property] =
    value;

  renderCanvas();

  updatePropertyPanel();

  autosave();

}


textColor.addEventListener(
  "input",
  () => {

    if (!selectedElement) {
      return;
    }

    if (
      selectedElement.type !== "text"
    ) {
      return;
    }

    selectedElement.color =
      textColor.value;

    renderCanvas();

    autosave();

  }
);


/* =========================================================
   NOTES
   ========================================================= */

speakerNotes.addEventListener(
  "input",
  () => {

    slides[currentSlideIndex]
      .notes =
      speakerNotes.value;

    autosave();

  }
);


/* =========================================================
   DELETE SELECTED ELEMENT
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Delete" &&
      selectedElement
    ) {

      if (
        document.activeElement &&
        document.activeElement.isContentEditable
      ) {
        return;
      }


      saveState();


      slides[currentSlideIndex]
        .elements =
        slides[currentSlideIndex]
          .elements
          .filter(
            item =>
              item !== selectedElement
          );


      selectedElement =
        null;


      renderAll();

      showToast(
        "Element deleted."
      );

    }

  }
);


/* =========================================================
   ZOOM
   ========================================================= */

zoomInBtn.addEventListener(
  "click",
  () => {

    zoom =
      Math.min(
        2,
        zoom + .1
      );

    applyZoom();

  }
);


zoomOutBtn.addEventListener(
  "click",
  () => {

    zoom =
      Math.max(
        .4,
        zoom - .1
      );

    applyZoom();

  }
);


function applyZoom() {

  slideCanvas.style.transform =
    `scale(${zoom})`;

  zoomValue.textContent =
    `${Math.round(zoom * 100)}%`;

}


fitBtn.addEventListener(
  "click",
  () => {

    zoom = 1;

    applyZoom();

    showToast(
      "Zoom reset."
    );

  }
);


/* =========================================================
   FULLSCREEN EDITOR
   ========================================================= */

fullscreenEditorBtn.addEventListener(
  "click",
  async () => {

    try {

      if (!document.fullscreenElement) {

        await document.documentElement
          .requestFullscreen();

      } else {

        await document.exitFullscreen();

      }

    } catch {

      showToast(
        "Fullscreen unavailable."
      );

    }

  }
);


/* =========================================================
   PRESENTATION MODE
   ========================================================= */

presentBtn.addEventListener(
  "click",
  () => {

    presentationIndex =
      0;

    presentationMode.classList.remove(
      "hidden"
    );

    renderPresentation();

  }
);


function renderPresentation() {

  const slide =
    slides[presentationIndex];

  presentationSlide.innerHTML = "";

  presentationSlide.style.background =
    slide.background;


  slide.elements.forEach(
    element => {

      const el =
        createElementDOM(
          JSON.parse(
            JSON.stringify(element)
          )
        );


      presentationSlide.appendChild(
        el
      );

    }
  );


  presentationCounter.textContent =
    `${presentationIndex + 1} / ${slides.length}`;

}


nextPresentationBtn.addEventListener(
  "click",
  () => {

    if (
      presentationIndex <
      slides.length - 1
    ) {

      presentationIndex++;

      renderPresentation();

    }

  }
);


previousPresentationBtn.addEventListener(
  "click",
  () => {

    if (
      presentationIndex > 0
    ) {

      presentationIndex--;

      renderPresentation();

    }

  }
);


exitPresentationBtn.addEventListener(
  "click",
  () => {

    presentationMode.classList.add(
      "hidden"
    );

  }
);


/* =========================================================
   PRESENTATION KEYBOARD
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      presentationMode.classList.contains(
        "hidden"
      )
    ) {
      return;
    }


    if (
      event.key === "ArrowRight" ||
      event.key === " "
    ) {

      event.preventDefault();

      nextPresentationBtn.click();

    }


    if (
      event.key === "ArrowLeft"
    ) {

      previousPresentationBtn.click();

    }


    if (
      event.key === "Escape"
    ) {

      exitPresentationBtn.click();

    }

  }
);


/* =========================================================
   SAVE TO LOCAL STORAGE
   ========================================================= */

function savePresentation() {

  const data = {

    name:
      presentationName.value,

    slides

  };


  localStorage.setItem(
    "presentationStudioData",
    JSON.stringify(data)
  );


  statusText.textContent =
    "Saved";

  autosaveStatus.textContent =
    "Saved just now";


  showToast(
    "Presentation saved."
  );

}


saveBtn.addEventListener(
  "click",
  savePresentation
);


/* =========================================================
   AUTOSAVE
   ========================================================= */

let autosaveTimer;

function autosave() {

  clearTimeout(
    autosaveTimer
  );


  autosaveStatus.textContent =
    "Saving...";


  autosaveTimer =
    setTimeout(
      () => {

        const data = {

          name:
            presentationName.value,

          slides

        };


        localStorage.setItem(
          "presentationStudioData",
          JSON.stringify(data)
        );


        autosaveStatus.textContent =
          "Autosave on";

      },
      500
    );

}


/* =========================================================
   LOAD PRESENTATION
   ========================================================= */

function loadPresentation() {

  const saved =
    localStorage.getItem(
      "presentationStudioData"
    );


  if (!saved) {

    createInitialSlide();

    return;

  }


  try {

    const data =
      JSON.parse(saved);


    presentationName.value =
      data.name ||
      "My Presentation";


    slides =
      data.slides ||
      [];


    if (slides.length === 0) {
      createInitialSlide();
      return;
    }


    currentSlideIndex = 0;

    renderAll();

  } catch {

    createInitialSlide();

  }

}


/* =========================================================
   COUNTS
   ========================================================= */

function updateCounts() {

  slideCount.textContent =
    slides.length;

  slideNumber.textContent =
    `Slide ${currentSlideIndex + 1}`;

  updateWordCount();

}


function updateWordCount() {

  let count = 0;


  slides.forEach(
    slide => {

      slide.elements.forEach(
        element => {

          if (
            element.type === "text"
          ) {

            count +=
              element.text
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length;

          }

        }
      );

    }
  );


  wordCount.textContent =
    `${count} ${
      count === 1
        ? "word"
        : "words"
    }`;

}


/* =========================================================
   PRESENTATION NAME
   ========================================================= */

presentationName.addEventListener(
  "input",
  autosave
);


/* =========================================================
   THEME
   ========================================================= */

themeButton.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light-theme"
    );


    const light =
      document.body.classList.contains(
        "light-theme"
      );


    localStorage.setItem(
      "presentationTheme",
      light
        ? "light"
        : "dark"
    );

  }
);


if (
  localStorage.getItem(
    "presentationTheme"
  ) === "light"
) {

  document.body.classList.add(
    "light-theme"
  );

}


/* =========================================================
   CLICK OUTSIDE
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        "#addShapeBtn"
      ) &&
      !event.target.closest(
        "#shapeMenu"
      )
    ) {

      shapeMenu.classList.add(
        "hidden"
      );

    }


    if (
      !event.target.closest(
        "#backgroundBtn"
      ) &&
      !event.target.closest(
        "#backgroundMenu"
      )
    ) {

      backgroundMenu.classList.add(
        "hidden"
      );

    }

  }
);


/* =========================================================
   CANVAS CLICK
   ========================================================= */

slideCanvas.addEventListener(
  "click",
  () => {

    selectedElement =
      null;

  }
);


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(message) {

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      1800
    );

}


/* =========================================================
   COLOR HELPER
   ========================================================= */

function colorForInput(color) {

  if (
    typeof color === "string" &&
    color.startsWith("#")
  ) {

    return color;

  }


  return "#ffffff";

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {

      event.preventDefault();

      savePresentation();

    }


    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "z"
    ) {

      event.preventDefault();

      undoBtn.click();

    }


    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "y"
    ) {

      event.preventDefault();

      redoBtn.click();

    }

  }
);


/* =========================================================
   START
   ========================================================= */

loadPresentation();

console.log(
  "Presentation Studio Ultimate loaded."
);
```

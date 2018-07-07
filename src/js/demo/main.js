// Text global toggle
let showHexText = false;

// Hex global variables
let hexRadius = 7;
let hexGrid;
let hexGraph;
let hexBoard;

// Rect global variables
let rectLength = 13;
let rectWidth = 40;
let rectHeight = 40;
let rectGrid;
let rectGraph;
let rectBoard;

let fullGraph;

const __Hexgrid__ = document.createElement('script');
__Hexgrid__.src = 'js/demo/Hexgrid.js';
document.head.appendChild(__Hexgrid__);

const __Hexboard__ = document.createElement('script');
__Hexboard__.src = 'js/demo/Hexboard.js';
document.head.appendChild(__Hexboard__);

const __Rectgrid__ = document.createElement('script');
__Rectgrid__.src = 'js/demo/Rectgrid.js';
document.head.appendChild(__Rectgrid__);

const __Rectboard__ = document.createElement('script');
__Rectboard__.src = 'js/demo/Rectboard.js';
document.head.appendChild(__Rectboard__);

const __functions__ = document.createElement('script');
__functions__.src = 'js/demo/functions.js';
document.head.appendChild(__functions__);

const __events__ = document.createElement('script');
__events__.src = 'js/demo/events.js';
document.head.appendChild(__events__);

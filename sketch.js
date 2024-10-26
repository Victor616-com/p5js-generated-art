let rectPositions = [];      // Array to store rectangle positions
let rectDimensions = [];     // Array to store dimensions for each rectangle
let targetPositions = [];    // Array to store target positions for animation
let targetDimensions = [];    // Array to store target dimensions for animation
let originalPositions = [];  // Array to store original positions
let originalDimensions = []; // Array to store original dimensions for each rectangle
let numberOfRects = 71;      // Total number of rectangles
let colors = [];             // Array to store colors for each rectangle
let repelThreshold = 200;    // Distance at which rectangles start repelling
let canvas;                  // Canvas variable
let randomizeButton;         // Button to randomize positions and sizes

function setup() {
  canvas = createCanvas(1000, 700);
  centerCanvas();
  background('#3B1E54');

  // Create a button to randomize positions and sizes
  randomizeButton = createButton('New Art Pice');
  randomizeButton.position(10, 10); // Position the button on the screen
  randomizeButton.mousePressed(randomize); // Call randomize function on press

  // Define a set of colors
  let colorOptions = [
    color('#9B7EBD'),
    color('#D4BEE4'),     
    color('#EEEEEE'),     
  ];

  // Generate random positions, dimensions, and colors for each rectangle
  for (let i = 0; i < numberOfRects; i++) {
    let x = random(width - 20); // Ensure the rectangle fits within the canvas
    let y = random(height - 20);
    rectPositions.push({ x: x, y: y });        // Current positions
    targetPositions.push({ x: x, y: y });      // Target positions for animation
    originalPositions.push({ x: x, y: y });    // Original positions

    let w = random(10, 200);                   // Random width
    let h = random(10, 200);                   // Random height
    rectDimensions.push({ w: w, h: h });
    targetDimensions.push({ w: w, h: h });     // Target dimensions for animation
    originalDimensions.push({ w: w, h: h });   // Store the original dimensions for scaling reset

    // Select a random color for each rectangle
    let randomColor = random(colorOptions);
    colors.push(randomColor);
  }
}

// Function to randomize positions and sizes
function randomize() {
  for (let i = 0; i < numberOfRects; i++) {
    // Set new target positions and dimensions randomly
    targetPositions[i].x = random(width - 20); 
    targetPositions[i].y = random(height - 20);
    targetDimensions[i].w = random(10, 200);
    targetDimensions[i].h = random(10, 200);
  }
}

// Center the canvas on the screen
function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

// Adjust canvas position when the window is resized
function windowResized() {
  centerCanvas();
}

function draw() {
  background('#3B1E54');

  // Draw and update positions of rectangles
  for (let i = 0; i < numberOfRects; i++) {
    let pos = rectPositions[i]; // Current position
    let dim = rectDimensions[i]; // Current dimensions
    let targetPos = targetPositions[i]; // Target position for animation
    let targetDim = targetDimensions[i]; // Target dimension for animation

    // Smoothly interpolate towards the target positions and dimensions
    pos.x = lerp(pos.x, targetPos.x, 0.05); // Smooth transition for x position
    pos.y = lerp(pos.y, targetPos.y, 0.05); // Smooth transition for y position
    dim.w = lerp(dim.w, targetDim.w, 0.05); // Smooth transition for width
    dim.h = lerp(dim.h, targetDim.h, 0.05); // Smooth transition for height

    // Calculate the distance from the mouse to the center of each rectangle
    let d = dist(mouseX, mouseY, pos.x + dim.w / 2, pos.y + dim.h / 2);

    // Check if the mouse button is being held down
    if (mouseIsPressed) {
      // If the mouse is within repelThreshold, repel the rectangle
      if (d < repelThreshold) {
        let angle = atan2(pos.y + dim.h / 2 - mouseY, pos.x + dim.w / 2 - mouseX);
        
        // Move the rectangle away from the mouse position
        pos.x += cos(angle) * 5;
        pos.y += sin(angle) * 5;

        // Keep the rectangles within canvas boundaries
        pos.x = constrain(pos.x, 0, width - dim.w);
        pos.y = constrain(pos.y, 0, height - dim.h);
      }
    }

    // Draw the rectangle with its assigned color
    fill(colors[i]);
    rectMode(CENTER);
    rect(pos.x, pos.y, dim.w, dim.h);
  }
}

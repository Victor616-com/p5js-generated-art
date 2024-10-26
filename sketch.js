let rectPositions = [];      // Array to store rectangle positions
let rectDimensions = [];     // Array to store dimensions for each rectangle
let originalPositions = [];  // Array to store original positions
let originalDimensions = []; // Array to store original dimensions for each rectangle
let numberOfRects = 200;     // Total number of rectangles
let colors = [];             // Array to store colors for each rectangle
let repelThreshold = 200;    // Distance at which rectangles start repelling
let mic;                     // Audio input variable
let canvas;                  // Canvas variable
let intensitySlider;         // Slider to control intensity

function setup() {
  canvas = createCanvas(800, 600);
  centerCanvas();
  background('#3B1E54');

  // Initialize microphone
  mic = new p5.AudioIn();
  mic.start();

  // Define a set of colors
  let colorOptions = [
    color('#9B7EBD'),
    color('#D4BEE4'),     
    color('#EEEEEE'),     
  ];

  // Create an intensity slider
  intensitySlider = createSlider(10, 101, 10, 0.5); // min, max, initial, step
  intensitySlider.position(10, 10);                 // Position the slider on the screen
  intensitySlider.style('width', '200px');          // Set slider width

  // Generate random positions, dimensions, and colors for each rectangle
  for (let i = 0; i < numberOfRects; i++) {
    let x = random(width - 20); // Ensure the rectangle fits within the canvas
    let y = random(height - 20);
    rectPositions.push({ x: x, y: y });        // Current positions
    originalPositions.push({ x: x, y: y });    // Original positions

    let w = random(10, 200);                   // Random width
    let h = random(10, 200);                   // Random height
    rectDimensions.push({ w: w, h: h });
    originalDimensions.push({ w: w, h: h });   // Store the original dimensions for scaling reset

    // Select a random color for each rectangle
    let randomColor = random(colorOptions);
    colors.push(randomColor);
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

  // Get the audio level from the microphone
  let micLevel = mic.getLevel();
  
  // Read the slider value to adjust the scale multiplier range
  let intensity = intensitySlider.value();

  // Draw and update positions of rectangles
  for (let i = 0; i < numberOfRects; i++) {
    let pos = rectPositions[i]; // Current position
    let dim = rectDimensions[i]; // Current dimensions
    let originalDim = originalDimensions[i]; // Original dimensions

    // Scale dimensions smoothly based on microphone input
    let scaleAmount = map(micLevel, 0, 1, 0.5, intensity); // Map mic level to a scale multiplier based on slider
    let targetW = originalDim.w * scaleAmount;  // Target width based on scale amount
    let targetH = originalDim.h * scaleAmount;  // Target height based on scale amount
    dim.w = lerp(dim.w, targetW, 0.1);          // Smoothly adjust width based on mic level
    dim.h = lerp(dim.h, targetH, 0.1);          // Smoothly adjust height based on mic level

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
    } else {
      // Gradually move rectangle back to its original position when mouse is released
      pos.x = lerp(pos.x, originalPositions[i].x, 0.05);
      pos.y = lerp(pos.y, originalPositions[i].y, 0.05);
    }

    // Draw the rectangle with its assigned color
    fill(colors[i]);
    rectMode(CENTER);
    rect(pos.x, pos.y, dim.w, dim.h);
  }
}

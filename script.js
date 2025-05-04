const prizes = [
    "$5 Starbucks Gift Card",
    "$10 Starbucks Gift Card",
    "$15 Amazon Gift Card",
    "$20 Amazon Gift Card",
    "$25 Amazon Gift Card",
    "$35 DoorDash Gift Card",
    "$40 DoorDash Gift Card",
    "$50 DoorDash Gift Card",
    "$60 Amex Gift Card",
    "$70 Amex Gift Card",
    "$100 Amex Gift Card",
    "$200 Amex Gift Card"
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultModal = document.getElementById('result-modal');
const prizeText = document.getElementById('prize-text');
const restartBtn = document.getElementById('restart-btn');
const prizeList = document.getElementById('prize-list');

let currentRotation = 0;
let isSpinning = false;

// Colors for the wheel segments
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#E67E22', '#2ECC71', '#F1C40F', '#E74C3C'
];

function createLegend() {
    prizes.forEach((prize, index) => {
        const li = document.createElement('li');
        li.style.backgroundColor = colors[index];
        li.style.color = 'white';
        li.style.padding = '10px';
        li.style.borderRadius = '5px';
        li.style.margin = '5px 0';
        li.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        li.textContent = prize;
        prizeList.appendChild(li);
    });
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15; // Adjusted for border
    
    const segmentAngle = (2 * Math.PI) / prizes.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    
    // Draw segments
    prizes.forEach((prize, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw text vertically
        ctx.save();
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.translate(radius * 0.6, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        
        // Split text into words and draw vertically
        const words = prize.split(' ');
        const lineHeight = 15;
        const totalHeight = words.length * lineHeight;
        const startY = -totalHeight / 2;
        
        words.forEach((word, i) => {
            ctx.fillText(word, 0, startY + (i * lineHeight));
        });
        
        ctx.restore();
    });
    
    ctx.restore();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    
    const spinDuration = 5000; // 5 seconds
    const startTime = Date.now();
    const startRotation = currentRotation;
    // Calculate the target rotation to land on the desired segment
    const targetSegment = Math.floor(Math.random() * prizes.length);
    const targetRotation = targetSegment * ((2 * Math.PI) / prizes.length);
    const spinAngle = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = spinAngle * 2 * Math.PI + targetRotation;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        
        currentRotation = startRotation + (finalRotation * easeOut(progress));
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            showResult();
        }
    }
    
    animate();
}

function showResult() {
    // Calculate which segment is at the top position (where the ticker is)
    const segmentAngle = (2 * Math.PI) / prizes.length;
    // The top position is at 0 radians (or 2π), so we need to find which segment is there
    const normalizedRotation = currentRotation % (2 * Math.PI);
    // Since the wheel rotates clockwise, we need to invert the rotation to get the correct segment
    const winningIndex = Math.floor((2 * Math.PI - normalizedRotation) / segmentAngle) % prizes.length;
    
    prizeText.textContent = prizes[winningIndex];
    resultModal.style.display = 'flex';
}

function restart() {
    resultModal.style.display = 'none';
    currentRotation = 0;
    drawWheel();
}

// Event listeners
spinBtn.addEventListener('click', spinWheel);
restartBtn.addEventListener('click', restart);

// Add this function to handle responsive canvas
function resizeCanvas() {
    const container = document.querySelector('.wheel-container');
    const canvas = document.getElementById('wheel');
    const containerWidth = container.offsetWidth;
    
    // Set canvas size to match container width
    canvas.width = containerWidth;
    canvas.height = containerWidth;
    
    // Redraw the wheel
    drawWheel();
}

// Add event listeners for window resize
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

// Initialize
createLegend();
drawWheel(); 
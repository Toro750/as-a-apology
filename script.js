/* =========================================================================
   ROBUST SCENE MANAGEMENT & FAILSAFES
   ========================================================================= */
let currentScene = 1;

// Maximum time to wait before forcing the Continue button to appear.
// This guarantees the user NEVER gets trapped.
const FAILSAFE_DELAY = 4500; 
const TEXT_STAGGER = 700; // Smoother, faster line reveal (0.7s per line)

document.addEventListener("DOMContentLoaded", () => {
    // Start the experience smoothly
    playScene(1);
});

// Main function to transition to the next scene safely
function nextScene(sceneNumber) {
    // 1. Hide current
    const currentEl = document.getElementById(`scene-${currentScene}`);
    if (currentEl) currentEl.classList.remove('active');
    
    // 2. Update pointer
    currentScene = sceneNumber;
    
    // 3. Show next
    const nextEl = document.getElementById(`scene-${currentScene}`);
    if (nextEl) {
        nextEl.classList.add('active');
        // Small delay to let fade-in happen before text starts
        setTimeout(() => {
            playScene(currentScene);
        }, 400); 
    }
}

// Routes logic based on scene number
function playScene(num) {
    switch(num) {
        case 1: 
            playTextSequence('seq-1', 'btn-1'); 
            break;
        case 2: 
            playTextSequence('seq-2', 'btn-2'); 
            break;
        case 3: 
            // Envelope scene - trigger text/button even if they don't click envelope
            ensureButtonVisible('btn-3', FAILSAFE_DELAY + 2000);
            break;
        case 4: 
            setupFlowers();
            playTextSequence('seq-4', 'btn-4'); 
            break;
        case 5: 
            playTextSequence('seq-5', 'btn-5'); 
            break;
        case 6: 
            playTextSequence('seq-6', 'btn-6'); 
            break;
        case 7: 
            playTextSequence('seq-7', 'btn-7'); 
            break;
        case 8: 
            playTextSequence('seq-8', 'btn-8'); 
            break;
        case 9: 
            playTextSequence('seq-9', 'btn-9'); 
            break;
        case 10: 
            playFinalScene(); 
            break;
    }
}

/* =========================================================================
   TEXT ANIMATOR & BUTTON FAILSAFE
   ========================================================================= */

// Reveals text line by line using lightweight CSS opacity/transform
function playTextSequence(containerId, buttonId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const lines = container.querySelectorAll('.line');
    
    // Fallback: ALWAYS show button eventually, no matter what happens
    if (buttonId) {
        const maxWait = (lines.length * TEXT_STAGGER) + 1500;
        ensureButtonVisible(buttonId, Math.min(maxWait, 8000));
    }

    // Sequence lines
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
            
            // If it's the last line, show the button quickly
            if (index === lines.length - 1 && buttonId) {
                ensureButtonVisible(buttonId, 1000);
            }
        }, index * TEXT_STAGGER);
    });
}

// Rock-solid function to ensure a button appears
function ensureButtonVisible(btnId, delayMs) {
    setTimeout(() => {
        const btn = document.getElementById(btnId);
        if (btn && !btn.classList.contains('visible')) {
            btn.classList.add('visible');
        }
    }, delayMs);
}

/* =========================================================================
   INTERACTIVE ELEMENTS LOGIC
   ========================================================================= */

// SCENE 3: Envelope
let envelopeOpened = false;
function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    
    const envWrapper = document.getElementById('envelope-trigger');
    envWrapper.classList.add('open');
    
    // Hide the hint
    const hint = envWrapper.querySelector('.tap-hint');
    if (hint) hint.style.opacity = '0';
    
    // Wait for animation, then play text
    setTimeout(() => {
        playTextSequence('seq-3', 'btn-3');
    }, 1200);
}

// SCENE 4: Flowers
function setupFlowers() {
    const flowers = document.querySelectorAll('.flower-btn');
    const msgBox = document.getElementById('flower-message');
    
    flowers.forEach(flower => {
        flower.addEventListener('click', function() {
            if (this.classList.contains('clicked')) return;
            
            this.classList.add('clicked');
            msgBox.textContent = this.getAttribute('data-msg');
            msgBox.style.opacity = 1;
            
            // Fade out message after 2s
            setTimeout(() => { 
                if (msgBox.textContent === this.getAttribute('data-msg')) {
                    msgBox.style.opacity = 0; 
                }
            }, 2000);
        });
    });
}

// SCENE 5: Memory Room Modals
function openMemory(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeMemory(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Hide hotspot to show completion
    const hotspot = document.getElementById(`hs-${type}`);
    if (hotspot) hotspot.style.opacity = '0.3';
}

// SCENE 10: Final Photo
function playFinalScene() {
    // Show photo first
    setTimeout(() => {
        const photoFrame = document.getElementById('final-photo-container');
        if (photoFrame) photoFrame.classList.add('visible');
    }, 500);
    
    // Then start text
    setTimeout(() => {
        playTextSequence('seq-10', null);
    }, 2000);
}
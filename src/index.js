// src/index.js
import './styles.css';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

class TextScramble {
    constructor(targetElement) {
        this.targetElement = targetElement;
        this.chars = chars;
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.targetElement.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        
        this.queue = [];
        this.frame = 0;
        this.targetText = newText;
        
        // Clear existing content
        this.targetElement.innerHTML = '';
        
        // Create spans for each character
        for (let i = 0; i < length; i++) {
            const char = document.createElement('span');
            char.className = 'char';
            char.textContent = '*';
            this.targetElement.appendChild(char);
            
            this.queue.push({
                from: oldText[i] || '',
                to: newText[i] || '',
                start: Math.floor(Math.random() * 40),
                end: Math.floor(Math.random() * 40) + 20,
                char: char
            });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frameRequest = requestAnimationFrame(this.update);
        
        return promise;
    }

    update() {
        let complete = 0;
        let output = '';
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                char.textContent = to;
                char.classList.add('done');
            } else if (this.frame >= start) {
                char.classList.remove('done');
                char.textContent = this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

const outputElement = document.getElementById('output');
const scrambler = new TextScramble(outputElement);

function scrambleText() {
    const input = document.getElementById('inputText');
    const text = input.value.trim();
    
    if (text) {
        scrambler.setText(text);
    }
}

// Add enter key support
document.getElementById('inputText').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        scrambleText();
    }
});

// Initial text
scrambler.setText('Enter text above');
// syntax.js - Lua/Luau Syntax Checker using Lune
// Requires: Node.js environment (Electron with nodeIntegration: true)
// Requires: lune.exe in the same directory

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Check Lua/Luau syntax using lune.exe
 * @param {string} code - Code to validate
 * @param {function(boolean, string)} callback - (isValid, errorMessage)
 */
function checkSyntax(code, callback) {
    const tempFile = path.join(__dirname, 'temp_check.lua');
    const lunePath = path.join(__dirname, 'lune.exe');
    
    fs.writeFile(tempFile, code, 'utf8', (writeErr) => {
        if (writeErr) {
            callback(false, writeErr.message);
            return;
        }
        
        exec(`"${lunePath}" compile "${tempFile}"`, { timeout: 5000 }, (execErr, stdout, stderr) => {
            fs.unlink(tempFile, () => {
                if (execErr) {
                    callback(false, stderr || execErr.message || 'Unknown syntax error');
                } else {
                    callback(true, '');
                }
            });
        });
    });
}

// Save original obfuscation functions
const originalProcessObfuscation = typeof processObfuscation === 'function' ? processObfuscation : null;
const originalObfuscate = typeof obfuscate === 'function' ? obfuscate : null;

/**
 * Main obfuscation function with syntax validation
 * Replaces the original processObfuscation() from HTML
 */
function processObfuscation() {
    const input = document.getElementById('txtOriginal');
    const output = document.getElementById('txtObfuscated');
    const code = input.value;
    
    if (!code || !code.trim()) {
        output.value = "Please enter Lua/Luau code to obfuscate";
        return;
    }
    
    output.value = "Checking syntax...";
    
    checkSyntax(code, (isValid, errorMsg) => {
        if (isValid) {
            // Syntax is good - run obfuscation
            if (originalObfuscate) {
                try {
                    output.value = originalObfuscate(code);
                } catch (e) {
                    output.value = "Obfuscation error: " + e.message;
                }
            } else if (originalProcessObfuscation) {
                try {
                    originalProcessObfuscation();
                } catch (e) {
                    output.value = "Obfuscation error: " + e.message;
                }
            } else {
                output.value = "Error: No obfuscation function found in obfuscated.js";
            }
        } else {
            output.value = "Error syntax: " + errorMsg;
        }
    });
}

// Expose to global scope for HTML button onclick
if (typeof window !== 'undefined') {
    window.processObfuscation = processObfuscation;
  }

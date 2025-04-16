// Données simulées
let sensorData = {
    h1: 45.2,
    h2: 48.7,
    h3: 50.1,
    h4: 47.5,
    mean: 47.9,
    temp: 25.3,
    tap1: 'OFF',
    tap2: 'OFF',
    mode: 'auto'
};

// Mettre à jour l'affichage
function updateDisplay() {
    document.getElementById('h1').textContent = sensorData.h1 ?? 'N/A';
    document.getElementById('h2').textContent = sensorData.h2 ?? 'N/A';
    document.getElementById('h3').textContent = sensorData.h3 ?? 'N/A';
    document.getElementById('h4').textContent = sensorData.h4 ?? 'N/A';
    document.getElementById('mean').textContent = sensorData.mean ?? 'N/A';
    document.getElementById('temp').textContent = sensorData.temp ?? 'N/A';
    
    // Afficher l'état des robinets
    document.getElementById('tap1').textContent = sensorData.tap1 === 'ON' ? 'Arrosage activé' : 'Arrosage désactivé';
    document.getElementById('tap2').textContent = sensorData.tap2 === 'ON' ? 'Arrosage activé' : 'Arrosage désactivé';
    document.getElementById('tap1').className = sensorData.tap1 === 'ON' ? 'status-on' : 'status-off';
    document.getElementById('tap2').className = sensorData.tap2 === 'ON' ? 'status-on' : 'status-off';
    
    // Afficher/cacher les contrôles manuels
    const manualControls = document.getElementById('manual-controls');
    if (sensorData.mode === 'manual') {
        manualControls.classList.remove('d-none');
        manualControls.style.opacity = '1';
    } else {
        manualControls.classList.add('d-none');
        manualControls.style.opacity = '0';
    }

    // Mettre à jour les boutons de mode
    document.getElementById('mode-auto').classList.toggle('active', sensorData.mode === 'auto');
    document.getElementById('mode-manual').classList.toggle('active', sensorData.mode === 'manual');
}

// Simuler le mode automatique
function simulateAutoMode() {
    if (sensorData.mode === 'auto') {
        const threshold = 50;
        const newState = sensorData.mean < threshold ? 'ON' : 'OFF';
        sensorData.tap1 = newState;
        sensorData.tap2 = newState;
    }
}

// Changer de mode
function setMode(mode) {
    sensorData.mode = mode;
    console.log(`Mode changé à : ${mode}`);
    simulateAutoMode();
    updateDisplay();
}

// Contrôler un robinet
function controlTap(tapNumber, state) {
    if (sensorData.mode === 'manual') {
        const tapKey = `tap${tapNumber}`;
        sensorData[tapKey] = state.toUpperCase();
        console.log(`Robinet ${tapNumber} mis à ${state}`);
        updateDisplay();
    }
}

// Gérer le mode clair/sombre
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('.theme-icon');
    
    if (isDark) {
        toggleBtn.textContent = '☀️ Mode Clair';
        localStorage.setItem('theme', 'dark');
    } else {
        toggleBtn.innerHTML = '<span class="theme-icon">🌙</span> Mode Sombre';
        localStorage.setItem('theme', 'light');
    }
}

// Charger le thème sauvegardé
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️ Mode Clair';
    }
}

// Simuler des mises à jour
setInterval(() => {
    sensorData.h1 = Math.max(0, Math.min(100, (sensorData.h1 + (Math.random() - 0.5) * 2)).toFixed(1));
    sensorData.h2 = Math.max(0, Math.min(100, (sensorData.h2 + (Math.random() - 0.5) * 2)).toFixed(1));
    sensorData.h3 = Math.max(0, Math.min(100, (sensorData.h3 + (Math.random() - 0.5) * 2)).toFixed(1));
    sensorData.h4 = Math.max(0, Math.min(100, (sensorData.h4 + (Math.random() - 0.5) * 2)).toFixed(1));
    sensorData.mean = (
        (parseFloat(sensorData.h1) + 
         parseFloat(sensorData.h2) + 
         parseFloat(sensorData.h3) + 
         parseFloat(sensorData.h4)) / 4
    ).toFixed(1);
    sensorData.temp = Math.max(10, Math.min(40, (sensorData.temp + (Math.random() - 0.5) * 0.5)).toFixed(1));
    
    simulateAutoMode();
    updateDisplay();
}, 5000);

// Événements
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Initialisation
loadTheme();
updateDisplay();
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

// Historique des données des capteurs
let sensorHistory = JSON.parse(localStorage.getItem('sensorHistory')) || [];

// Mettre à jour l'affichage du tableau de bord
function updateDisplay() {
    if (document.getElementById('h1')) {
        document.getElementById('h1').textContent = sensorData.h1 ?? 'N/A';
        document.getElementById('h2').textContent = sensorData.h2 ?? 'N/A';
        document.getElementById('h3').textContent = sensorData.h3 ?? 'N/A';
        document.getElementById('h4').textContent = sensorData.h4 ?? 'N/A';
        document.getElementById('mean').textContent = sensorData.mean ?? 'N/A';
        document.getElementById('temp').textContent = sensorData.temp ?? 'N/A';
        
        document.getElementById('tap1').textContent = sensorData.tap1 === 'ON' ? 'Arrosage activé' : 'Arrosage désactivé';
        document.getElementById('tap2').textContent = sensorData.tap2 === 'ON' ? 'Arrosage activé' : 'Arrosage désactivé';
        document.getElementById('tap1').className = sensorData.tap1 === 'ON' ? 'status-on' : 'status-off';
        document.getElementById('tap2').className = sensorData.tap2 === 'ON' ? 'status-on' : 'status-off';
        
        const manualControls = document.getElementById('manual-controls');
        if (sensorData.mode === 'manual') {
            manualControls.classList.remove('d-none');
            manualControls.style.opacity = '1';
        } else {
            manualControls.classList.add('d-none');
            manualControls.style.opacity = '0';
        }

        document.getElementById('mode-auto').classList.toggle('active', sensorData.mode === 'auto');
        document.getElementById('mode-manual').classList.toggle('active', sensorData.mode === 'manual');
    }
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

// Mettre à jour l'historique des données
function updateSensorHistory() {
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR');
    const time = now.toLocaleTimeString('fr-FR', { hour12: false });
    
    const newData = [
        { date, time, sensor: 'Humidité 1', value: sensorData.h1 + '%' },
        { date, time, sensor: 'Humidité 2', value: sensorData.h2 + '%' },
        { date, time, sensor: 'Humidité 3', value: sensorData.h3 + '%' },
        { date, time, sensor: 'Humidité 4', value: sensorData.h4 + '%' },
        { date, time, sensor: 'Température', value: sensorData.temp + '°C' }
    ];
    
    sensorHistory.push(...newData);
    localStorage.setItem('sensorHistory', JSON.stringify(sensorHistory));
}

// Remplir le tableau des données
function populateSensorTable() {
    const tbody = document.getElementById('sensor-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    sensorHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.time}</td>
            <td>${entry.sensor}</td>
            <td>${entry.value}</td>
        `;
        tbody.appendChild(row);
    });
}

// Exporter en Excel (XML simple)
function exportToExcel() {
    try {
        // Nettoyer les données
        const cleanData = sensorHistory.map(entry => ({
            Date: entry.date,
            Heure: entry.time,
            Capteur: entry.sensor,
            Valeur: entry.value.replace(/[%°C]/g, '') // Supprimer % et °C
        }));

        // Générer un fichier Excel XML simple
        let xml = '<?xml version="1.0"?>\n';
        xml += '<?mso-application progid="Excel.Sheet"?>\n';
        xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
        xml += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
        xml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
        xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
        xml += '<Worksheet ss:Name="DonnéesCapteurs">\n';
        xml += '<Table>\n';
        
        // En-têtes
        xml += '<Row>\n';
        xml += '<Cell><Data ss:Type="String">Date</Data></Cell>\n';
        xml += '<Cell><Data ss:Type="String">Heure</Data></Cell>\n';
        xml += '<Cell><Data ss:Type="String">Capteur</Data></Cell>\n';
        xml += '<Cell><Data ss:Type="String">Valeur</Data></Cell>\n';
        xml += '</Row>\n';

        // Données
        cleanData.forEach(row => {
            xml += '<Row>\n';
            xml += `<Cell><Data ss:Type="String">${row.Date}</Data></Cell>\n`;
            xml += `<Cell><Data ss:Type="String">${row.Heure}</Data></Cell>\n`;
            xml += `<Cell><Data ss:Type="String">${row.Capteur}</Data></Cell>\n`;
            xml += `<Cell><Data ss:Type="String">${row.Valeur}</Data></Cell>\n`;
            xml += '</Row>\n';
        });

        xml += '</Table>\n';
        xml += '</Worksheet>\n';
        xml += '</Workbook>\n';

        // Créer un Blob et télécharger
        const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'donnees_capteurs.xlsx';
        link.click();
    } catch (error) {
        console.error('Erreur lors de l\'exportation Excel:', error);
        alert('Erreur lors de l\'exportation en Excel. Consultez la console pour plus d\'informations.');
    }
}

// Exporter en CSV
function exportToCSV() {
    const headers = ['Date', 'Heure', 'Capteur', 'Valeur'];
    const csv = [
        headers.join(','),
        ...sensorHistory.map(row => `${row.date},${row.time},${row.sensor},${row.value}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'donnees_capteurs.csv';
    link.click();
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
    
    updateSensorHistory();
    simulateAutoMode();
    updateDisplay();
    populateSensorTable();
}, 5000);

// Événements
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateDisplay();
    populateSensorTable();
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
});

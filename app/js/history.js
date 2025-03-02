/**
 * Zarządzanie historią teleporad i leków
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const teleporadaHistoryPanel = document.getElementById('teleporada-history-panel');
    const medicineHistoryPanel = document.getElementById('medicine-history-panel');
    const teleporadaHistoryList = teleporadaHistoryPanel.querySelector('.history-list');
    const medicineHistoryList = medicineHistoryPanel.querySelector('.history-list');
    const teleporadaHistoryEmpty = teleporadaHistoryPanel.querySelector('.history-empty');
    const medicineHistoryEmpty = medicineHistoryPanel.querySelector('.history-empty');
    
    // Obsługa przełączania zakładek
    const historyTabButtons = document.querySelectorAll('.history-section .tab-button');
    historyTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuń klasę active ze wszystkich przycisków
            historyTabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Dodaj klasę active do klikniętego przycisku
            this.classList.add('active');
            
            // Ukryj wszystkie panele
            const tabPanels = document.querySelectorAll('.history-section .tab-panel');
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Pokaż panel powiązany z klikniętym przyciskiem
            const targetPanelId = this.dataset.tab + '-panel';
            document.getElementById(targetPanelId).classList.add('active');
        });
    });
    
    // Ładowanie historii przy uruchomieniu strony
    loadTeleporadaHistory();
    loadMedicineHistory();
    
    /**
     * Ładuje historię teleporad z pamięci
     */
    function loadTeleporadaHistory() {
        const appointments = TelmedoStorage.getAppointments();
        
        if (appointments.length === 0) {
            if (teleporadaHistoryEmpty) {
                teleporadaHistoryEmpty.style.display = 'block';
            }
            return;
        }
        
        if (teleporadaHistoryEmpty) {
            teleporadaHistoryEmpty.style.display = 'none';
        }
        
        if (!teleporadaHistoryList) return;
        
        teleporadaHistoryList.innerHTML = '';
        
        appointments.forEach(appointment => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            
            // Formatuj datę w czytelny sposób
            const date = new Date(appointment.createdAt);
            const formattedDate = date.toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            historyItem.innerHTML = `
                <div class="history-info">
                    <h3>Teleporada: ${appointment.doctor}</h3>
                    <div class="history-date">
                        Data: ${appointment.date}<br>
                        Umówiona: ${formattedDate}
                    </div>
                </div>
                <div class="history-status ${appointment.status}">
                    ${formatStatus(appointment.status)}
                </div>
            `;
            
            teleporadaHistoryList.appendChild(historyItem);
            
            // Obsługa kliknięcia na element historii
            historyItem.addEventListener('click', function() {
                // Tutaj można dodać szczegóły teleporady w modalu
                alert('Szczegóły teleporady:\n' + 
                      'Lekarz: ' + appointment.doctor + '\n' +
                      'Specjalizacja: ' + appointment.specialization + '\n' +
                      'Termin: ' + appointment.date + '\n' +
                      'Status: ' + formatStatus(appointment.status));
            });
        });
    }
    
    /**
     * Ładuje historię leków z pamięci
     */
    function loadMedicineHistory() {
        const medicines = TelmedoStorage.getMedicines();
        
        if (medicines.length === 0) {
            if (medicineHistoryEmpty) {
                medicineHistoryEmpty.style.display = 'block';
            }
            return;
        }
        
        if (medicineHistoryEmpty) {
            medicineHistoryEmpty.style.display = 'none';
        }
        
        if (!medicineHistoryList) return;
        
        medicineHistoryList.innerHTML = '';
        
        medicines.forEach(medicine => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            
            // Formatuj datę w czytelny sposób
            const date = new Date(medicine.date);
            const formattedDate = date.toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            historyItem.innerHTML = `
                <div class="history-info">
                    <h3>${medicine.name}</h3>
                    <div class="history-date">
                        Cena: ${medicine.price.toFixed(2)} zł<br>
                        Zamówione: ${formattedDate}
                    </div>
                </div>
                <div class="history-status ${medicine.status}">
                    ${formatStatus(medicine.status)}
                </div>
            `;
            
            medicineHistoryList.appendChild(historyItem);
            
            // Obsługa kliknięcia na element historii
            historyItem.addEventListener('click', function() {
                // Tutaj można dodać szczegóły zamówienia leku w modalu
                alert('Szczegóły zamówienia:\n' + 
                      'Lek: ' + medicine.name + '\n' +
                      'Cena: ' + medicine.price.toFixed(2) + ' zł\n' +
                      'Apteka: ' + (medicine.pharmacy || 'Nieznana') + '\n' +
                      'Status: ' + formatStatus(medicine.status));
            });
        });
    }
    
    /**
     * Formatuje status na czytelny tekst
     * @param {string} status - Status teleporady/zamówienia
     * @returns {string} Sformatowany status
     */
    function formatStatus(status) {
        switch (status) {
            case 'scheduled':
                return 'Zaplanowana';
            case 'completed':
                return 'Zakończona';
            case 'canceled':
                return 'Anulowana';
            case 'pending':
                return 'Oczekująca';
            case 'ordered':
                return 'Zamówione';
            case 'delivered':
                return 'Dostarczone';
            default:
                return 'Nieznany';
        }
    }
});
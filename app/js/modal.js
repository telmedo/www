/**
 * Obsługa modali na stronie
 */

document.addEventListener('DOMContentLoaded', function() {
    // Modalne okna
    const teleporadaModal = document.getElementById('teleporada-modal');
    const medicineModal = document.getElementById('medicine-modal');
    const successModal = document.getElementById('success-modal');
    
    // Przyciski zamykania modali
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Przycisk zamknięcia modala sukcesu
    const closeSuccessButton = document.getElementById('close-success');
    
    // Obsługa kliknięcia przycisków zamykania
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Zamknij wszystkie modale
            teleporadaModal.style.display = 'none';
            medicineModal.style.display = 'none';
            successModal.style.display = 'none';
            
            // Przywróć przewijanie strony
            document.body.style.overflow = 'auto';
        });
    });
    
    // Obsługa kliknięcia przycisku zamknięcia modala sukcesu
    if (closeSuccessButton) {
        closeSuccessButton.addEventListener('click', function() {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Zamykanie modali po kliknięciu poza nimi
    window.addEventListener('click', function(event) {
        if (event.target === teleporadaModal) {
            teleporadaModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === medicineModal) {
            medicineModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Opcjonalne wypełnianie pól formularza z zapisanymi danymi użytkownika
    const deliveryOption = document.getElementById('delivery-option');
    if (deliveryOption) {
        // Obsługa zmiany opcji dostawy
        deliveryOption.addEventListener('change', function() {
            const addressForm = document.getElementById('delivery-address-form');
            
            if (this.value === 'delivery') {
                addressForm.style.display = 'block';
            } else {
                addressForm.style.display = 'none';
            }
        });
        
        // Wypełnij formularz zapisanymi danymi użytkownika
        const userData = TelmedoStorage.getUserData();
        if (userData) {
            const customerName = document.getElementById('customer-name');
            const customerPhone = document.getElementById('customer-phone');
            const customerAddress = document.getElementById('customer-address');
            
            if (customerName) customerName.value = userData.name || '';
            if (customerPhone) customerPhone.value = userData.phone || '';
            if (customerAddress) customerAddress.value = userData.address || '';
        }
    }
    
    /**
     * Otwiera modal z sukcesem
     * @param {string} title - Tytuł modala
     * @param {string} message - Wiadomość
     */
    window.showSuccessModal = function(title, message) {
        if (successModal) {
            const titleElement = document.getElementById('success-title');
            const messageElement = document.getElementById('success-message');
            
            if (titleElement) titleElement.textContent = title;
            if (messageElement) messageElement.textContent = message;
            
            successModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };
});
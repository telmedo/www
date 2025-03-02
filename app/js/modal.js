// Funkcjonalność modalnego okna z potwierdzeniem zamówienia
document.addEventListener('DOMContentLoaded', function() {
    const successModal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');
    const closeSuccess = document.getElementById('close-success');
    const placeOrderButton = document.getElementById('place-order');
    
    // Otwieranie modala po kliknięciu w przycisk "Zamów"
    placeOrderButton.addEventListener('click', function() {
        // Sprawdzenie, czy wybrano aptekę
        const selectedPharmacy = document.querySelector('.pharmacy-item.selected');
        
        if (!selectedPharmacy) {
            alert('Wybierz aptekę z listy');
            return;
        }
        
        // Sprawdzenie, czy wprowadzono adres dostawy (jeśli wybrano dostawę)
        const deliveryMethod = document.getElementById('delivery-method').value;
        const address = document.getElementById('address').value;
        
        if (deliveryMethod === 'delivery' && !address) {
            alert('Wprowadź adres dostawy');
            return;
        }
        
        // Pokazanie modala z potwierdzeniem
        successModal.style.display = 'block';
        
        // Zablokowanie przewijania strony
        document.body.style.overflow = 'hidden';
    });
    
    // Zamykanie modala po kliknięciu w przycisk "x"
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Zamykanie modala po kliknięciu w przycisk "Zamknij"
    closeSuccess.addEventListener('click', function() {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Zamykanie modala po kliknięciu poza modelem
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
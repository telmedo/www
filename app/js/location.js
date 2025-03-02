/**
 * Zarządzanie lokalizacją użytkownika
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const locationRequestCard = document.getElementById('location-request');
    const shareLocationButton = document.getElementById('share-location');
    const medicineOptionsContainer = document.getElementById('medicine-options');
    const nearbyPharmaciesContainer = document.getElementById('nearby-pharmacies');
    
    // Dane przykładowych aptek
    const pharmacies = [
        {
            id: 1,
            name: 'Apteka Pod Złotym Lwem',
            address: 'ul. Marszałkowska 14, Warszawa',
            distance: '0.5 km',
            isOpen: true,
            hours: 'do 21:00'
        },
        {
            id: 2,
            name: 'Apteka Dbam o Zdrowie',
            address: 'al. Jerozolimskie 54, Warszawa',
            distance: '0.8 km',
            isOpen: true,
            hours: 'do 22:00'
        },
        {
            id: 3,
            name: 'Apteka Centrum',
            address: 'ul. Nowy Świat 22, Warszawa',
            distance: '1.2 km',
            isOpen: true,
            hours: 'do 20:00'
        },
        {
            id: 4,
            name: 'Euro Apteka',
            address: 'ul. Puławska 98, Warszawa',
            distance: '1.5 km',
            isOpen: true,
            hours: 'do 23:00'
        },
        {
            id: 5,
            name: 'Apteka Dr. Max',
            address: 'ul. Targowa 15, Warszawa',
            distance: '2.1 km',
            isOpen: true,
            hours: 'całą dobę'
        }
    ];
    
    // Sprawdź, czy użytkownik już wcześniej udostępnił lokalizację
    if (TelmedoStorage.hasLocationConsent()) {
        const savedLocation = TelmedoStorage.getLocation();
        if (savedLocation) {
            // Ukryj prośbę o lokalizację i pokaż opcje leków
            locationRequestCard.style.display = 'none';
            medicineOptionsContainer.style.display = 'block';
            
            // Wyświetl najbliższe apteki
            displayNearbyPharmacies();
        } else {
            // Lokalizacja została zatwierdzona, ale nie zapisana - pobierz ją
            getCurrentLocation();
        }
    }
    
    // Obsługa kliknięcia przycisku udostępniania lokalizacji
    shareLocationButton.addEventListener('click', function() {
        getCurrentLocation();
    });
    
    // Obsługa przełączania zakładek (leki na receptę / bez recepty)
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuń klasę active ze wszystkich przycisków
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Dodaj klasę active do klikniętego przycisku
            this.classList.add('active');
            
            // Ukryj wszystkie panele
            const tabPanels = document.querySelectorAll('.tab-panel');
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Pokaż panel powiązany z klikniętym przyciskiem
            const targetPanelId = this.dataset.tab + '-panel';
            document.getElementById(targetPanelId).classList.add('active');
        });
    });
    
    /**
     * Pobiera aktualną lokalizację użytkownika
     */
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Sukces
                function(position) {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    
                    // Zapisz lokalizację i zgodę
                    TelmedoStorage.saveLocation(location);
                    TelmedoStorage.setLocationConsent();
                    
                    // Ukryj prośbę o lokalizację i pokaż opcje leków
                    locationRequestCard.style.display = 'none';
                    medicineOptionsContainer.style.display = 'block';
                    
                    // Wyświetl najbliższe apteki
                    displayNearbyPharmacies();
                },
                // Błąd
                function(error) {
                    console.error('Błąd pobierania lokalizacji:', error);
                    alert('Nie udało się pobrać lokalizacji. Spróbuj ponownie lub wprowadź ręcznie swój adres.');
                }
            );
        } else {
            alert('Twoja przeglądarka nie obsługuje geolokalizacji.');
        }
    }
    
    /**
     * Wyświetla najbliższe apteki na podstawie lokalizacji
     */
    function displayNearbyPharmacies() {
        // Wyczyść listę aptek
        nearbyPharmaciesContainer.style.display = 'block';
        const pharmacyCardsContainer = nearbyPharmaciesContainer.querySelector('.pharmacy-cards');
        
        if (!pharmacyCardsContainer) {
            console.error('Nie znaleziono kontenera na karty aptek');
            return;
        }
        
        pharmacyCardsContainer.innerHTML = '';
        
        // Dodaj apteki do listy
        pharmacies.forEach(pharmacy => {
            const pharmacyCard = document.createElement('div');
            pharmacyCard.classList.add('pharmacy-card');
            pharmacyCard.dataset.id = pharmacy.id;
            
            pharmacyCard.innerHTML = `
                <div class="pharmacy-info">
                    <div class="pharmacy-name">${pharmacy.name}</div>
                    <div class="pharmacy-address">${pharmacy.address}</div>
                    <div class="pharmacy-details">
                        <span class="pharmacy-distance">${pharmacy.distance}</span>
                        <span class="pharmacy-open">Otwarte ${pharmacy.hours}</span>
                    </div>
                </div>
            `;
            
            pharmacyCardsContainer.appendChild(pharmacyCard);
            
            // Obsługa kliknięcia na aptekę
            pharmacyCard.addEventListener('click', function() {
                // Usuń zaznaczenie ze wszystkich aptek
                document.querySelectorAll('.pharmacy-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Zaznacz wybraną aptekę
                this.classList.add('selected');
                
                // Przygotuj dane do modalu
                const selectedPharmacy = pharmacies.find(p => p.id === parseInt(this.dataset.id));
                
                // Otwórz modal zamówienia
                openMedicineModal(selectedPharmacy);
            });
        });
    }
    
    /**
     * Otwiera modal zamówienia leku
     * @param {Object} pharmacy - Dane wybranej apteki
     */
    function openMedicineModal(pharmacy) {
        const modal = document.getElementById('medicine-modal');
        document.getElementById('pharmacy-name-confirm').textContent = pharmacy.name;
        document.getElementById('pharmacy-address-confirm').textContent = pharmacy.address;
        
        // Pobierz koszyk z pamięci lub utwórz pusty
        const cart = TelmedoStorage.getCart() || [];
        
        // Wyświetl zawartość koszyka
        displayCartItems(cart);
        
        // Pokaż modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Wyświetla produkty w koszyku
     * @param {Array} cart - Zawartość koszyka
     */
    function displayCartItems(cart) {
        const medicineListElement = document.getElementById('medicine-list-confirm');
        medicineListElement.innerHTML = '';
        
        if (cart.length === 0) {
            medicineListElement.innerHTML = '<p>Koszyk jest pusty</p>';
            return;
        }
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('medicine-list-item');
            
            itemElement.innerHTML = `
                <span class="medicine-list-name">${item.name}</span>
                <span class="medicine-list-price">${item.price.toFixed(2)} zł</span>
            `;
            
            medicineListElement.appendChild(itemElement);
            totalPrice += item.price;
        });
        
        // Aktualizuj cenę całkowitą
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    }
});
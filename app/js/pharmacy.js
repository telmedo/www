// Funkcjonalność wyszukiwania i wyboru aptek
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-pharmacies');
    const pharmacyList = document.getElementById('pharmacy-list');
    const pharmacySelection = document.getElementById('pharmacy-selection');
    const deliveryOption = document.getElementById('delivery-option');
    const deliveryAddress = document.getElementById('delivery-address');
    const orderButton = document.getElementById('order-button');
    const deliveryMethod = document.getElementById('delivery-method');
    const placeOrderButton = document.getElementById('place-order');
    
    // Dane przykładowych aptek
    const pharmacies = [
        {
            id: 1,
            name: 'Apteka Pod Złotym Lwem',
            address: 'ul. Marszałkowska 14, Warszawa',
            distance: '0.5 km od Ciebie',
            hours: 'Otwarte do 21:00'
        },
        {
            id: 2,
            name: 'Apteka Dbam o Zdrowie',
            address: 'al. Jerozolimskie 54, Warszawa',
            distance: '0.8 km od Ciebie',
            hours: 'Otwarte do 22:00'
        },
        {
            id: 3,
            name: 'Apteka Centrum',
            address: 'ul. Nowy Świat 22, Warszawa',
            distance: '1.2 km od Ciebie',
            hours: 'Otwarte do 20:00'
        },
        {
            id: 4,
            name: 'Euro Apteka',
            address: 'ul. Puławska 98, Warszawa',
            distance: '1.5 km od Ciebie',
            hours: 'Otwarte do 23:00'
        },
        {
            id: 5,
            name: 'Apteka Dr. Max',
            address: 'ul. Targowa 15, Warszawa',
            distance: '2.1 km od Ciebie',
            hours: 'Otwarte całą dobę'
        }
    ];
    
    // Funkcja wyszukiwania aptek po kodzie pocztowym
    searchButton.addEventListener('click', function() {
        const postcode = document.getElementById('postcode').value;
        
        if (!postcode) {
            alert('Wprowadź kod pocztowy');
            return;
        }
        
        // Wyczyszczenie listy aptek
        pharmacyList.innerHTML = '';
        
        // Dodanie aptek do listy
        pharmacies.forEach(pharmacy => {
            const pharmacyItem = document.createElement('div');
            pharmacyItem.classList.add('pharmacy-item');
            pharmacyItem.dataset.id = pharmacy.id;
            
            pharmacyItem.innerHTML = `
                <div class="pharmacy-name">${pharmacy.name}</div>
                <div class="pharmacy-address">${pharmacy.address}</div>
                <div class="pharmacy-distance">${pharmacy.distance} • ${pharmacy.hours}</div>
            `;
            
            pharmacyList.appendChild(pharmacyItem);
            
            // Dodanie możliwości wyboru apteki
            pharmacyItem.addEventListener('click', function() {
                // Usunięcie klasy 'selected' z wszystkich aptek
                document.querySelectorAll('.pharmacy-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Dodanie klasy 'selected' do wybranej apteki
                this.classList.add('selected');
            });
        });
        
        // Pokazanie listy aptek i formularza zamówienia
        pharmacyList.style.display = 'block';
        pharmacySelection.style.display = 'block';
        deliveryOption.style.display = 'block';
        orderButton.style.display = 'block';
        
        // Nasłuchiwanie zmiany sposobu dostawy
        deliveryMethod.addEventListener('change', function() {
            if (this.value === 'delivery') {
                deliveryAddress.style.display = 'block';
            } else {
                deliveryAddress.style.display = 'none';
            }
        });
        
        // Wywołanie zdarzenia change, aby odpowiednio ustawić widoczność pola adresu
        deliveryMethod.dispatchEvent(new Event('change'));
    });
});
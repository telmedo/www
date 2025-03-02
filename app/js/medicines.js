/**
 * Zarządzanie sekcją leków i koszykiem
 */

document.addEventListener('DOMContentLoaded', function() {
    // Przykładowe leki bez recepty
    const popularMedicines = [
        {
            id: 1,
            name: 'Paracetamol',
            producer: 'Polpharma',
            price: 12.99,
            imageUrl: 'img/medicine-1.jpg',
            category: 'pain'
        },
        {
            id: 2,
            name: 'Ibuprofen',
            producer: 'USP Zdrowie',
            price: 15.49,
            imageUrl: 'img/medicine-2.jpg',
            category: 'pain'
        },
        {
            id: 3,
            name: 'Rutinoscorbin',
            producer: 'GSK',
            price: 18.99,
            imageUrl: 'img/medicine-3.jpg',
            category: 'vitamins'
        },
        {
            id: 4,
            name: 'Aspirin',
            producer: 'Bayer',
            price: 10.50,
            imageUrl: 'img/medicine-4.jpg',
            category: 'pain'
        },
        {
            id: 5,
            name: 'Cetirizine',
            producer: 'Sandoz',
            price: 19.99,
            imageUrl: 'img/medicine-5.jpg',
            category: 'allergy'
        },
        {
            id: 6,
            name: 'Neosine',
            producer: 'Aflofarm',
            price: 22.49,
            imageUrl: 'img/medicine-6.jpg',
            category: 'cold'
        },
        {
            id: 7,
            name: 'Diosmil',
            producer: 'Hasco-Lek',
            price: 25.99,
            imageUrl: 'img/medicine-7.jpg',
            category: 'other'
        },
        {
            id: 8,
            name: 'Magnesium',
            producer: 'Biofarm',
            price: 14.99,
            imageUrl: 'img/medicine-8.jpg',
            category: 'vitamins'
        }
    ];
    
    // Przykładowe recepty w historii
    const prescriptions = [
        {
            id: 1,
            code: '1234-5678-9012',
            date: '10.02.2025',
            doctor: 'dr Anna Kowalska',
            items: [
                { name: 'Betaloc ZOK', details: '50mg, 30 tabletek' },
                { name: 'Lorista', details: '100mg, 28 tabletek' }
            ]
        },
        {
            id: 2,
            code: '2345-6789-0123',
            date: '25.01.2025',
            doctor: 'dr Jan Kowalczyk',
            items: [
                { name: 'Levofloxacin', details: '500mg, 10 tabletek' },
                { name: 'Amoxicillin', details: '1000mg, 20 tabletek' }
            ]
        }
    ];
    
    // Elementy DOM
    const medicineCardsContainer = document.querySelector('.medicine-cards');
    const prescriptionCardsContainer = document.querySelector('.prescription-cards');
    const medicineSearchInput = document.getElementById('medicine-search');
    const medicineCategories = document.querySelectorAll('.category');
    const medicineModal = document.getElementById('medicine-modal');
    const successModal = document.getElementById('success-modal');
    
    // Inicjalizacja koszyka
    let cart = TelmedoStorage.getCart() || [];
    
    // Wyświetl popularne leki
    displayPopularMedicines();
    
    // Wyświetl recepty (jeśli są)
    displayPrescriptions();
    
    // Obsługa wyszukiwania leków
    medicineSearchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        
        // Filtruj leki według wyszukiwanego tekstu
        const filteredMedicines = popularMedicines.filter(medicine => 
            medicine.name.toLowerCase().includes(searchText) || 
            medicine.producer.toLowerCase().includes(searchText)
        );
        
        // Wyświetl przefiltrowane leki
        displayFilteredMedicines(filteredMedicines);
    });
    
    // Obsługa filtrowania po kategoriach
    medicineCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.querySelector('span').textContent.toLowerCase();
            
            // Filtruj leki według kategorii
            const filteredMedicines = popularMedicines.filter(medicine => 
                medicine.category.toLowerCase() === categoryName
            );
            
            // Wyświetl przefiltrowane leki
            displayFilteredMedicines(filteredMedicines);
        });
    });
    
    // Obsługa przycisku potwierdzenia zamówienia
    document.getElementById('confirm-order').addEventListener('click', function() {
        // Walidacja formularza
        const deliveryOption = document.getElementById('delivery-option').value;
        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        
        if (!customerName || !customerPhone) {
            alert('Wypełnij wszystkie wymagane pola');
            return;
        }
        
        if (deliveryOption === 'delivery' && !document.getElementById('customer-address').value) {
            alert('Wprowadź adres dostawy');
            return;
        }
        
        // Pobierz dane apteki i metody płatności
        const pharmacyName = document.getElementById('pharmacy-name-confirm').textContent;
        const pharmacyAddress = document.getElementById('pharmacy-address-confirm').textContent;
        const paymentMethod = document.getElementById('payment-method').value;
        
        // Przygotuj dane zamówienia
        const order = {
            id: Date.now(),
            pharmacy: {
                name: pharmacyName,
                address: pharmacyAddress
            },
            items: cart,
            total: parseFloat(document.getElementById('total-price').textContent),
            delivery: {
                method: deliveryOption,
                address: deliveryOption === 'delivery' ? document.getElementById('customer-address').value : null
            },
            payment: paymentMethod,
            customer: {
                name: customerName,
                phone: customerPhone
            },
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Zapisz dane użytkownika
        TelmedoStorage.saveUserData({
            name: customerName,
            phone: customerPhone,
            address: document.getElementById('customer-address').value || ''
        });
        
        // Zapisz zamówienie w historii
        cart.forEach(item => {
            TelmedoStorage.addMedicine({
                id: item.id,
                name: item.name,
                price: item.price,
                pharmacy: pharmacyName,
                date: new Date().toISOString(),
                status: 'ordered'
            });
        });
        
        // Wyczyść koszyk
        cart = [];
        TelmedoStorage.saveCart(cart);
        
        // Zamknij modal zamówienia
        medicineModal.style.display = 'none';
        
        // Pokaż modal sukcesu
        successModal.style.display = 'block';
        document.getElementById('success-title').textContent = 'Zamówienie zostało złożone!';
        document.getElementById('success-message').textContent = 
            deliveryOption === 'delivery' 
                ? `Twoje leki zostaną dostarczone w ciągu 60 minut pod wskazany adres.` 
                : `Możesz odebrać swoje leki w aptece ${pharmacyName}.`;
    });
    
    // Obsługa wyboru opcji dostawy
    document.getElementById('delivery-option').addEventListener('change', function() {
        const addressForm = document.getElementById('delivery-address-form');
        
        if (this.value === 'delivery') {
            addressForm.style.display = 'block';
        } else {
            addressForm.style.display = 'none';
        }
    });
    
    /**
     * Wyświetla popularne leki
     */
    function displayPopularMedicines() {
        if (!medicineCardsContainer) return;
        
        medicineCardsContainer.innerHTML = '';
        
        popularMedicines.forEach(medicine => {
            const medicineCard = document.createElement('div');
            medicineCard.classList.add('medicine-card');
            medicineCard.dataset.id = medicine.id;
            
            // Tymczasowy placeholder zamiast właściwego zdjęcia
            const placeholderUrl = '/api/placeholder/100/100';
            
            medicineCard.innerHTML = `
                <div class="medicine-image">
                    <img src="${placeholderUrl}" alt="${medicine.name}">
                </div>
                <div class="medicine-info">
                    <div class="medicine-name">${medicine.name}</div>
                    <div class="medicine-producer">${medicine.producer}</div>
                    <div class="medicine-price">${medicine.price.toFixed(2)} zł</div>
                </div>
            `;
            
            medicineCardsContainer.appendChild(medicineCard);
            
            // Obsługa kliknięcia na lek
            medicineCard.addEventListener('click', function() {
                // Dodaj lek do koszyka
                addToCart(medicine);
                
                // Dodaj lek do ostatnio przeglądanych
                TelmedoStorage.addRecentMedicine(medicine);
                
                // Pokaż powiadomienie
                alert(`${medicine.name} został dodany do koszyka`);
            });
        });
    }
    
    /**
     * Wyświetla przefiltrowane leki
     * @param {Array} medicines - Lista leków do wyświetlenia
     */
    function displayFilteredMedicines(medicines) {
        if (!medicineCardsContainer) return;
        
        medicineCardsContainer.innerHTML = '';
        
        if (medicines.length === 0) {
            medicineCardsContainer.innerHTML = '<p>Nie znaleziono pasujących leków</p>';
            return;
        }
        
        medicines.forEach(medicine => {
            const medicineCard = document.createElement('div');
            medicineCard.classList.add('medicine-card');
            medicineCard.dataset.id = medicine.id;
            
            // Tymczasowy placeholder zamiast właściwego zdjęcia
            const placeholderUrl = '/api/placeholder/100/100';
            
            medicineCard.innerHTML = `
                <div class="medicine-image">
                    <img src="${placeholderUrl}" alt="${medicine.name}">
                </div>
                <div class="medicine-info">
                    <div class="medicine-name">${medicine.name}</div>
                    <div class="medicine-producer">${medicine.producer}</div>
                    <div class="medicine-price">${medicine.price.toFixed(2)} zł</div>
                </div>
            `;
            
            medicineCardsContainer.appendChild(medicineCard);
            
            // Obsługa kliknięcia na lek
            medicineCard.addEventListener('click', function() {
                // Dodaj lek do koszyka
                addToCart(medicine);
                
                // Dodaj lek do ostatnio przeglądanych
                TelmedoStorage.addRecentMedicine(medicine);
                
                // Pokaż powiadomienie
                alert(`${medicine.name} został dodany do koszyka`);
            });
        });
    }
    
    /**
     * Wyświetla recepty użytkownika
     */
    function displayPrescriptions() {
        if (!prescriptionCardsContainer) return;
        
        prescriptionCardsContainer.innerHTML = '';
        
        prescriptions.forEach(prescription => {
            const prescriptionCard = document.createElement('div');
            prescriptionCard.classList.add('prescription-card');
            prescriptionCard.dataset.id = prescription.id;
            
            // Przygotuj listę leków na recepcie
            let itemsHtml = '';
            prescription.items.forEach(item => {
                itemsHtml += `
                    <div class="prescription-item">
                        <span class="prescription-item-name">${item.name}</span>
                        <span class="prescription-item-details">${item.details}</span>
                    </div>
                `;
            });
            
            prescriptionCard.innerHTML = `
                <div class="prescription-code">Recepta nr ${prescription.code}</div>
                <div class="prescription-date">Wystawiona: ${prescription.date}</div>
                <div class="prescription-doctor">Lekarz: ${prescription.doctor}</div>
                <div class="prescription-items">
                    ${itemsHtml}
                </div>
            `;
            
            prescriptionCardsContainer.appendChild(prescriptionCard);
            
            // Obsługa kliknięcia na receptę
            prescriptionCard.addEventListener('click', function() {
                // Usuń zaznaczenie ze wszystkich recept
                document.querySelectorAll('.prescription-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Zaznacz wybraną receptę
                this.classList.add('selected');
                
                // Dodaj wszystkie leki z recepty do koszyka
                prescription.items.forEach(item => {
                    // Przykładowa cena dla leków na receptę
                    const price = Math.random() * 30 + 10;
                    
                    addToCart({
                        id: Date.now() + Math.random(),
                        name: item.name,
                        details: item.details,
                        price: parseFloat(price.toFixed(2)),
                        prescription: prescription.code
                    });
                });
                
                // Pokaż powiadomienie
                alert('Leki z recepty zostały dodane do koszyka');
            });
        });
    }
    
    /**
     * Dodaje lek do koszyka
     * @param {Object} medicine - Dane leku
     */
    function addToCart(medicine) {
        cart.push(medicine);
        TelmedoStorage.saveCart(cart);
    }
});
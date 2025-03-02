/**
 * Zarządzanie sekcją lekarzy i umawianiem teleporad
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const doctorCardsContainer = document.querySelector('.doctor-cards');
    const timeSlotsContainer = document.querySelector('.time-slots-container');
    const timeSlots = document.querySelector('.time-slots');
    const bookAppointmentButton = document.querySelector('.book-appointment');
    const teleporadaModal = document.getElementById('teleporada-modal');
    const successModal = document.getElementById('success-modal');
    
    // Przykładowi lekarze
    const doctors = [
        {
            id: 1,
            name: 'dr Anna Kowalska',
            specialization: 'Internista',
            rating: 4.9,
            reviews: 256,
            imageUrl: 'img/doctor-1.jpg',
            available: true,
            availableSoon: true
        },
        {
            id: 2,
            name: 'dr Piotr Nowak',
            specialization: 'Pediatra',
            rating: 4.8,
            reviews: 189,
            imageUrl: 'img/doctor-2.jpg',
            available: true,
            availableSoon: true
        },
        {
            id: 3,
            name: 'dr Maria Wiśniewska',
            specialization: 'Dermatolog',
            rating: 4.7,
            reviews: 145,
            imageUrl: 'img/doctor-3.jpg',
            available: true,
            availableSoon: false
        },
        {
            id: 4,
            name: 'dr Jan Kowalczyk',
            specialization: 'Kardiolog',
            rating: 4.9,
            reviews: 312,
            imageUrl: 'img/doctor-4.jpg',
            available: true,
            availableSoon: false
        },
        {
            id: 5,
            name: 'dr Aleksandra Lewandowska',
            specialization: 'Alergolog',
            rating: 4.6,
            reviews: 98,
            imageUrl: 'img/doctor-5.jpg',
            available: false,
            availableSoon: false
        },
        {
            id: 6,
            name: 'dr Tomasz Brzęczyszczykiewicz',
            specialization: 'Neurolog',
            rating: 4.8,
            reviews: 173,
            imageUrl: 'img/doctor-6.jpg',
            available: true,
            availableSoon: false
        }
    ];
    
    // Wyświetl karty lekarzy
    displayDoctorCards();
    
    // Obsługa wyboru daty
    const dateButtons = document.querySelectorAll('.date-button');
    dateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuń klasę active ze wszystkich przycisków
            dateButtons.forEach(btn => btn.classList.remove('active'));
            
            // Dodaj klasę active do klikniętego przycisku
            this.classList.add('active');
            
            // Generuj sloty czasowe dla wybranej daty
            generateTimeSlots(this.dataset.date);
        });
    });
    
    // Obsługa przycisku potwierdzenia teleporady
    document.getElementById('confirm-teleporada').addEventListener('click', function() {
        // Walidacja formularza
        const patientName = document.getElementById('patient-name').value;
        const patientPhone = document.getElementById('patient-phone').value;
        const patientEmail = document.getElementById('patient-email').value;
        const patientSymptoms = document.getElementById('patient-symptoms').value;
        
        if (!patientName || !patientPhone || !patientEmail || !patientSymptoms) {
            alert('Wypełnij wszystkie wymagane pola');
            return;
        }
        
        // Pobierz dane lekarza i terminu
        const doctorName = document.getElementById('doctor-name-confirm').textContent;
        const doctorSpecialization = document.getElementById('doctor-specialization-confirm').textContent;
        const appointmentTime = document.getElementById('appointment-time-confirm').textContent;
        
        // Przygotuj dane teleporady
        const appointment = {
            id: Date.now(),
            doctor: doctorName,
            specialization: doctorSpecialization,
            date: appointmentTime,
            status: 'scheduled',
            symptoms: patientSymptoms,
            patient: {
                name: patientName,
                phone: patientPhone,
                email: patientEmail
            },
            createdAt: new Date().toISOString()
        };
        
        // Zapisz dane użytkownika
        TelmedoStorage.saveUserData({
            name: patientName,
            phone: patientPhone,
            email: patientEmail
        });
        
        // Zapisz teleporadę w historii
        TelmedoStorage.addAppointment(appointment);
        
        // Zamknij modal teleporady
        teleporadaModal.style.display = 'none';
        
        // Pokaż modal sukcesu
        successModal.style.display = 'block';
        document.getElementById('success-title').textContent = 'Teleporada została umówiona!';
        document.getElementById('success-message').textContent = `Twoja teleporada z ${doctorName} została zaplanowana na ${appointmentTime}. Szczegóły zostały wysłane na Twój adres email.`;
    });
    
    // Obsługa przycisku umówienia teleporady
    bookAppointmentButton.addEventListener('click', function() {
        const selectedDoctor = document.querySelector('.doctor-card.selected');
        const selectedTimeSlot = document.querySelector('.time-slot.selected');
        
        if (!selectedDoctor || !selectedTimeSlot) {
            alert('Wybierz lekarza i termin konsultacji');
            return;
        }
        
        // Pobierz dane lekarza
        const doctorId = parseInt(selectedDoctor.dataset.id);
        const doctor = doctors.find(d => d.id === doctorId);
        
        // Pobierz dane terminu
        const selectedDate = document.querySelector('.date-button.active').dataset.date;
        const formattedDate = formatDate(selectedDate);
        const time = selectedTimeSlot.textContent;
        
        // Wypełnij formularz w modalu
        document.getElementById('doctor-name-confirm').textContent = doctor.name;
        document.getElementById('doctor-specialization-confirm').textContent = doctor.specialization;
        document.getElementById('appointment-time-confirm').textContent = `${formattedDate} o godzinie ${time}`;
        
        // Wypełnij formularz danymi użytkownika (jeśli istnieją)
        const userData = TelmedoStorage.getUserData();
        if (userData) {
            document.getElementById('patient-name').value = userData.name || '';
            document.getElementById('patient-phone').value = userData.phone || '';
            document.getElementById('patient-email').value = userData.email || '';
        }
        
        // Otwórz modal
        teleporadaModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Obsługa zamknięcia modala
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            teleporadaModal.style.display = 'none';
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
    
    // Zamknięcie modala sukcesu
    document.getElementById('close-success').addEventListener('click', function() {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Zamknięcie modala po kliknięciu poza nim
    window.addEventListener('click', function(event) {
        if (event.target === teleporadaModal) {
            teleporadaModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    /**
     * Wyświetla karty lekarzy
     */
    function displayDoctorCards() {
        doctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.classList.add('doctor-card');
            doctorCard.dataset.id = doctor.id;
            
            // Tymczasowy placeholder zamiast właściwego zdjęcia
            const placeholderUrl = '/api/placeholder/240/160';
            
            doctorCard.innerHTML = `
                <div class="doctor-image" style="background-image: url('${placeholderUrl}')"></div>
                <div class="doctor-info">
                    <div class="doctor-name">${doctor.name}</div>
                    <div class="doctor-specialization">${doctor.specialization}</div>
                    <div class="doctor-rating">
                        <div class="rating-stars">★★★★★</div>
                        <div>${doctor.rating} (${doctor.reviews})</div>
                    </div>
                    <div class="doctor-availability ${doctor.available ? '' : 'doctor-unavailable'}">
                        ${doctor.availableSoon ? 'Dostępny/a w ciągu 15 min' : (doctor.available ? 'Dostępny/a dzisiaj' : 'Brak dostępnych terminów')}
                    </div>
                </div>
            `;
            
            doctorCardsContainer.appendChild(doctorCard);
            
            // Obsługa kliknięcia lekarza
            doctorCard.addEventListener('click', function() {
                if (!doctor.available) {
                    alert('Ten lekarz nie ma dostępnych terminów');
                    return;
                }
                
                // Usuń zaznaczenie ze wszystkich lekarzy
                document.querySelectorAll('.doctor-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Zaznacz wybranego lekarza
                this.classList.add('selected');
                
                // Pokaż panel wyboru terminu
                timeSlotsContainer.style.display = 'block';
                
                // Domyślnie wybierz pierwszą datę (dzisiaj) i wygeneruj sloty
                document.querySelector('.date-button[data-date="today"]').click();
                
                // Przewiń do sekcji wyboru terminu
                timeSlotsContainer.scrollIntoView({ behavior: 'smooth' });
                
                // Dodaj lekarza do ostatnio przeglądanych
                TelmedoStorage.addRecentDoctor(doctor);
            });
        });
    }
    
    /**
     * Generuje sloty czasowe dla wybranej daty
     * @param {string} date - Wybrana data (today/tomorrow/day-after)
     */
    function generateTimeSlots(date) {
        // Wyczyść sloty czasowe
        timeSlots.innerHTML = '';
        
        // Różne sloty czasowe dla różnych dni
        let slots = [];
        
        if (date === 'today') {
            // Dla dzisiaj mamy mniej dostępnych slotów (przykładowe dane)
            slots = [
                { time: '14:00', available: true },
                { time: '14:30', available: true },
                { time: '15:00', available: false },
                { time: '15:30', available: true },
                { time: '16:00', available: false },
                { time: '16:30', available: true },
                { time: '17:00', available: true },
                { time: '17:30', available: false },
                { time: '18:00', available: true },
                { time: '18:30', available: true }
            ];
        } else if (date === 'tomorrow') {
            // Dla jutra więcej dostępnych slotów
            slots = [
                { time: '9:00', available: true },
                { time: '9:30', available: true },
                { time: '10:00', available: true },
                { time: '10:30', available: false },
                { time: '11:00', available: true },
                { time: '11:30', available: true },
                { time: '12:00', available: true },
                { time: '12:30', available: false },
                { time: '13:00', available: true },
                { time: '13:30', available: true },
                { time: '14:00', available: true },
                { time: '14:30', available: true },
                { time: '15:00', available: false },
                { time: '15:30', available: true },
                { time: '16:00', available: true },
                { time: '16:30', available: true },
                { time: '17:00', available: true },
                { time: '17:30', available: false },
                { time: '18:00', available: true },
                { time: '18:30', available: true }
            ];
        } else {
            // Dla pojutrze prawie wszystkie sloty dostępne
            slots = [
                { time: '9:00', available: true },
                { time: '9:30', available: true },
                { time: '10:00', available: true },
                { time: '10:30', available: true },
                { time: '11:00', available: true },
                { time: '11:30', available: true },
                { time: '12:00', available: true },
                { time: '12:30', available: true },
                { time: '13:00', available: true },
                { time: '13:30', available: true },
                { time: '14:00', available: true },
                { time: '14:30', available: true },
                { time: '15:00', available: true },
                { time: '15:30', available: true },
                { time: '16:00', available: true },
                { time: '16:30', available: true },
                { time: '17:00', available: true },
                { time: '17:30', available: true },
                { time: '18:00', available: true },
                { time: '18:30', available: true }
            ];
        }
        
        // Dodaj sloty do kontenera
        slots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.classList.add('time-slot');
            
            if (!slot.available) {
                slotElement.classList.add('unavailable');
            }
            
            slotElement.textContent = slot.time;
            timeSlots.appendChild(slotElement);
            
            // Obsługa kliknięcia slotu
            if (slot.available) {
                slotElement.addEventListener('click', function() {
                    // Usuń zaznaczenie ze wszystkich slotów
                    document.querySelectorAll('.time-slot').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    // Zaznacz wybrany slot
                    this.classList.add('selected');
                    
                    // Aktywuj przycisk umówienia teleporady
                    bookAppointmentButton.disabled = false;
                });
            }
        });
    }
    
    /**
     * Formatuje datę w czytelny sposób
     * @param {string} dateStr - Identyfikator daty (today/tomorrow/day-after)
     * @returns {string} Sformatowana data
     */
    function formatDate(dateStr) {
        const today = new Date();
        let date;
        
        switch (dateStr) {
            case 'today':
                date = today;
                return 'dzisiaj (' + formatDateShort(date) + ')';
            case 'tomorrow':
                date = new Date();
                date.setDate(today.getDate() + 1);
                return 'jutro (' + formatDateShort(date) + ')';
            case 'day-after':
                date = new Date();
                date.setDate(today.getDate() + 2);
                return 'pojutrze (' + formatDateShort(date) + ')';
            default:
                return 'nieznana data';
        }
    }
    
    /**
     * Formatuje datę w krótkim formacie
     * @param {Date} date - Data do sformatowania
     * @returns {string} Sformatowana data (np. "21.03")
     */
    function formatDateShort(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return day + '.' + month;
    }
});
/**
 * Zarządzanie przechowywaniem danych użytkownika w cookies i localStorage
 */

const TelmedoStorage = {
    // Klucze do przechowywania danych
    KEYS: {
        USER_DATA: 'telmedo_user_data',
        LOCATION: 'telmedo_location',
        APPOINTMENT_HISTORY: 'telmedo_appointments',
        MEDICINE_HISTORY: 'telmedo_medicines',
        RECENT_DOCTORS: 'telmedo_recent_doctors',
        RECENT_MEDICINES: 'telmedo_recent_medicines',
        CART: 'telmedo_cart'
    },
    
    /**
     * Zapisuje dane w localStorage
     * @param {string} key - Klucz pod którym dane zostaną zapisane
     * @param {any} data - Dane do zapisania
     */
    setItem: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Pobiera dane z localStorage
     * @param {string} key - Klucz pod którym dane są zapisane
     * @param {any} defaultValue - Wartość domyślna gdy brak danych
     * @returns {any} Pobrane dane lub wartość domyślna
     */
    getItem: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error retrieving from localStorage:', error);
            return defaultValue;
        }
    },
    
    /**
     * Usuwa dane z localStorage
     * @param {string} key - Klucz pod którym dane są zapisane
     */
    removeItem: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    /**
     * Zapisuje ciasteczko
     * @param {string} name - Nazwa ciasteczka
     * @param {string} value - Wartość ciasteczka
     * @param {number} days - Czas ważności w dniach
     */
    setCookie: function(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
    },
    
    /**
     * Pobiera wartość ciasteczka
     * @param {string} name - Nazwa ciasteczka
     * @returns {string|null} Wartość ciasteczka lub null
     */
    getCookie: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },
    
    /**
     * Usuwa ciasteczko
     * @param {string} name - Nazwa ciasteczka
     */
    deleteCookie: function(name) {
        this.setCookie(name, '', -1);
    },
    
    /**
     * Zapisuje dane użytkownika
     * @param {Object} userData - Dane użytkownika
     */
    saveUserData: function(userData) {
        this.setItem(this.KEYS.USER_DATA, userData);
    },
    
    /**
     * Pobiera dane użytkownika
     * @returns {Object|null} Dane użytkownika lub null
     */
    getUserData: function() {
        return this.getItem(this.KEYS.USER_DATA);
    },
    
    /**
     * Zapisuje lokalizację użytkownika
     * @param {Object} location - Obiekt z szerokością i długością geograficzną
     */
    saveLocation: function(location) {
        this.setItem(this.KEYS.LOCATION, location);
    },
    
    /**
     * Pobiera lokalizację użytkownika
     * @returns {Object|null} Lokalizacja lub null
     */
    getLocation: function() {
        return this.getItem(this.KEYS.LOCATION);
    },
    
    /**
     * Dodaje teleporadę do historii
     * @param {Object} appointment - Dane teleporady
     */
    addAppointment: function(appointment) {
        const appointments = this.getItem(this.KEYS.APPOINTMENT_HISTORY, []);
        appointments.unshift(appointment); // Dodaj na początek listy
        this.setItem(this.KEYS.APPOINTMENT_HISTORY, appointments);
    },
    
    /**
     * Pobiera historię teleporad
     * @returns {Array} Historia teleporad
     */
    getAppointments: function() {
        return this.getItem(this.KEYS.APPOINTMENT_HISTORY, []);
    },
    
    /**
     * Dodaje lek do historii
     * @param {Object} medicine - Dane zamówionego leku
     */
    addMedicine: function(medicine) {
        const medicines = this.getItem(this.KEYS.MEDICINE_HISTORY, []);
        medicines.unshift(medicine); // Dodaj na początek listy
        this.setItem(this.KEYS.MEDICINE_HISTORY, medicines);
    },
    
    /**
     * Pobiera historię leków
     * @returns {Array} Historia leków
     */
    getMedicines: function() {
        return this.getItem(this.KEYS.MEDICINE_HISTORY, []);
    },
    
    /**
     * Zapisuje dane koszyka
     * @param {Array} cart - Zawartość koszyka
     */
    saveCart: function(cart) {
        this.setItem(this.KEYS.CART, cart);
    },
    
    /**
     * Pobiera zawartość koszyka
     * @returns {Array} Zawartość koszyka
     */
    getCart: function() {
        return this.getItem(this.KEYS.CART, []);
    },
    
    /**
     * Dodaje lekarza do ostatnio przeglądanych
     * @param {Object} doctor - Dane lekarza
     */
    addRecentDoctor: function(doctor) {
        const doctors = this.getItem(this.KEYS.RECENT_DOCTORS, []);
        // Usuń dublujące się id
        const filtered = doctors.filter(d => d.id !== doctor.id);
        filtered.unshift(doctor); // Dodaj na początek
        
        // Ogranicz listę do 10 elementów
        if (filtered.length > 10) {
            filtered.pop();
        }
        
        this.setItem(this.KEYS.RECENT_DOCTORS, filtered);
    },
    
    /**
     * Pobiera ostatnio przeglądanych lekarzy
     * @returns {Array} Lista lekarzy
     */
    getRecentDoctors: function() {
        return this.getItem(this.KEYS.RECENT_DOCTORS, []);
    },
    
    /**
     * Dodaje lek do ostatnio przeglądanych
     * @param {Object} medicine - Dane leku
     */
    addRecentMedicine: function(medicine) {
        const medicines = this.getItem(this.KEYS.RECENT_MEDICINES, []);
        // Usuń dublujące się id
        const filtered = medicines.filter(m => m.id !== medicine.id);
        filtered.unshift(medicine); // Dodaj na początek
        
        // Ogranicz listę do 10 elementów
        if (filtered.length > 10) {
            filtered.pop();
        }
        
        this.setItem(this.KEYS.RECENT_MEDICINES, filtered);
    },
    
    /**
     * Pobiera ostatnio przeglądane leki
     * @returns {Array} Lista leków
     */
    getRecentMedicines: function() {
        return this.getItem(this.KEYS.RECENT_MEDICINES, []);
    },
    
    /**
     * Sprawdza czy użytkownik zgodził się na udostępnienie lokalizacji
     * @returns {boolean} True jeśli użytkownik udostępnił lokalizację
     */
    hasLocationConsent: function() {
        return this.getCookie('location_consent') === 'true';
    },
    
    /**
     * Zapisuje zgodę na udostępnienie lokalizacji
     */
    setLocationConsent: function() {
        this.setCookie('location_consent', 'true', 365); // Ciasteczko ważne rok
    }
};
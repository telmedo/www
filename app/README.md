
# Telmedo App

## v1

### Struktura projektu:

1. **index.html** - Główny plik HTML zawierający strukturę strony
2. **CSS:**
   - **styles.css** - Główny plik CSS z podstawowymi stylami
   - **forms.css** - Style dla formularzy i wieloetapowego procesu
   - **pharmacy.css** - Style dla sekcji z aptekami
3. **JavaScript:**
   - **form.js** - Obsługa formularza umawiania teleporady
   - **pharmacy.js** - Funkcjonalność wyszukiwania i wyboru aptek
   - **modal.js** - Obsługa okien modalnych

### Główne funkcjonalności:

1. **Umawianie teleporady**
   - Formularz podzielony na 3 etapy: dane osobowe, opis dolegliwości, wybór terminu
   - Walidacja pól formularza
   - Potwierdzenie umówionej konsultacji

2. **Wyszukiwanie aptek**
   - Wprowadzanie kodu pocztowego do wyszukania najbliższych aptek
   - Wybór apteki z listy
   - Opcje dostawy lub odbioru osobistego

3. **Zamawianie leków**
   - Możliwość określenia czy zamówienie dotyczy leków na receptę czy bez recepty
   - Opcja dostawy pod wskazany adres
   - Potwierdzenie złożenia zamówienia


## v2

### Zastosowane rozwiązania

1. **Lokalizacja zamiast wyszukiwania kodów pocztowych**:
   - Strona prosi o udostępnienie lokalizacji użytkownika
   - Wykorzystuje te dane do znalezienia najbliższych aptek
   - Zapisuje preferencje lokalizacyjne w cookies

2. **Zapamiętywanie danych użytkownika**:
   - Wszystkie dane i interakcje zapisywane w localStorage i cookies
   - Historia teleporad i zamówień leków
   - Preferencje i dane użytkownika do wypełniania formularzy

3. **Łatwa nawigacja i dostęp**:
   - Bezpośredni dostęp do teleporad lub zamawiania leków z poziomu strony głównej
   - Przewijalne listy lekarzy i leków
   - Możliwość selektywnego wyboru specjalisty lub kategorii leków

4. **Wsparcie dla różnych ścieżek użytkownika**:
   - Ścieżka teleporady → zamówienie leków
   - Ścieżka bezpośredniego zamówienia leków bez recepty
   - Ścieżka realizacji istniejącej recepty

### Struktura plików

1. **HTML**:
   - `index.html` - Główny plik HTML z całą strukturą strony

2. **CSS**:
   - `styles.css` - Podstawowe style strony
   - `forms.css` - Style formularzy i elementów interaktywnych
   - `cards.css` - Style kart lekarzy, leków i aptek

3. **JavaScript**:
   - `cookies.js` - Zarządzanie danymi w localStorage i cookies
   - `location.js` - Obsługa lokalizacji i wyszukiwania aptek
   - `doctors.js` - Zarządzanie sekcją lekarzy i teleporad
   - `medicines.js` - Zarządzanie sekcją leków i koszykiem
   - `history.js` - Wyświetlanie historii teleporad i zamówień
   - `modal.js` - Obsługa okien modalnych

### Główne funkcjonalności

1. **Umawianie teleporady**:
   - Wybór lekarza z przewijalnej listy
   - Wybór terminu z dostępnych slotów czasowych
   - Potwierdzenie teleporady w modalu

2. **Zamawianie leków**:
   - Wyszukiwanie po kategoriach lub przez pole wyszukiwania
   - Wybór z listy dostępnych leków lub realizacja recepty
   - Wybór apteki na podstawie lokalizacji
   - Wybór opcji dostawy lub odbioru osobistego

3. **Historia i dane użytkownika**:
   - Przeglądanie historii teleporad i zamówień
   - Automatyczne wypełnianie formularzy wcześniej wprowadzonymi danymi
   - Zapisywanie preferencji użytkownika

// Funkcjonalność formularza krokowego
document.addEventListener('DOMContentLoaded', function() {
    // Ustawiamy minimalną datę dla pola wyboru daty na dzisiejszą
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointment-date').setAttribute('min', today);
    
    // Step navigation
    document.getElementById('to-step-2').addEventListener('click', function() {
        // Walidacja pierwszego kroku
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        if (!firstName || !lastName || !email || !phone) {
            alert('Wypełnij wszystkie wymagane pola.');
            return;
        }
        
        // Przejście do drugiego kroku
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-2').classList.add('active');
        document.getElementById('step-indicator-1').classList.add('completed');
        document.getElementById('step-indicator-2').classList.add('active');
    });
    
    document.getElementById('back-to-step-1').addEventListener('click', function() {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-1').classList.add('active');
        document.getElementById('step-indicator-2').classList.remove('active');
    });
    
    document.getElementById('to-step-3').addEventListener('click', function() {
        // Walidacja drugiego kroku
        const symptoms = document.getElementById('symptoms').value;
        const duration = document.getElementById('duration').value;
        
        if (!symptoms || !duration) {
            alert('Wypełnij wszystkie wymagane pola.');
            return;
        }
        
        // Przejście do trzeciego kroku
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-3').classList.add('active');
        document.getElementById('step-indicator-2').classList.add('completed');
        document.getElementById('step-indicator-3').classList.add('active');
    });
    
    document.getElementById('back-to-step-2').addEventListener('click', function() {
        document.getElementById('step-3').classList.remove('active');
        document.getElementById('step-2').classList.add('active');
        document.getElementById('step-indicator-3').classList.remove('active');
    });
    
    // Form submission
    document.getElementById('consultation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Walidacja trzeciego kroku
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const specialization = document.getElementById('doctor-specialization').value;
        
        if (!date || !time || !specialization) {
            alert('Wypełnij wszystkie wymagane pola.');
            return;
        }
        
        // Get form values
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        
        // Formatowanie daty w polskim formacie
        const formattedDate = new Date(date).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Display confirmation
        document.getElementById('confirmation-time').textContent = `${formattedDate} o godzinie ${time}`;
        document.getElementById('consultation-form').style.display = 'none';
        document.getElementById('consultation-confirmation').style.display = 'block';
        
        // Scroll do sekcji potwierdzenia
        document.getElementById('consultation-confirmation').scrollIntoView({
            behavior: 'smooth'
        });
    });
});
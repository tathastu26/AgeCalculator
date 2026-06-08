/**
 * Compute age and related values from a birth Date.
 * Returns an object with years, months, days, totals, and estimations.
 */
function computeAgeFromDate(birthDate, today = new Date()) {
    if (!(birthDate instanceof Date)) birthDate = new Date(birthDate);
    if (isNaN(birthDate.getTime())) throw new Error('Invalid birthDate');

    if (birthDate > today) throw new Error('Birthdate is in the future');

    // Full difference in milliseconds
    const diffMs = today - birthDate;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Years and months calculation
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        // borrow days from previous month
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }

    if (months < 0) {
        months += 12;
        years--;
    }

    const totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth()) - (today.getDate() < birthDate.getDate() ? 1 : 0);

    // Next birthday
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysUntilNextBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    return {
        years,
        months,
        days,
        totalMonths,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        bornDay: weekdays[birthDate.getDay()],
        daysUntilNextBirthday,
        heartBeats: Math.floor(totalMinutes * 70),
        breaths: Math.floor(totalMinutes * 16)
    };
}

function calculateAge() {
    const birthInput = document.getElementById("birthdate");
    const resEl = document.getElementById("result");

    if (!birthInput || !birthInput.value) {
        if (resEl) resEl.innerText = "Please select your birth date.";
        return;
    }

    let birthDate = new Date(birthInput.value);
    try {
        const info = computeAgeFromDate(birthDate, new Date());
        if (resEl) {
            resEl.innerHTML = `
                <div class="age-card">

        <h2>🎂 Your Age</h2>
        <h3>${info.years} Years • ${info.months} Months • ${info.days} Days</h3>

        <div class="section">
            <h4>📅 Birth Information</h4>
            <p><strong>Born On:</strong> ${info.bornDay}</p>
            <p><strong>Next Birthday:</strong> ${info.daysUntilNextBirthday} days away 🎉</p>
        </div>

        <div class="section">
            <h4>⏳ Time Lived</h4>
            <p>📆 ${info.totalDays.toLocaleString()} Days</p>
            <p>🕒 ${info.totalHours.toLocaleString()} Hours</p>
            <p>⏱️ ${info.totalMinutes.toLocaleString()} Minutes</p>
            <p>⌚ ${info.totalSeconds.toLocaleString()} Seconds</p>
        </div>

        <div class="section">
            <h4>🧬 Life Statistics</h4>
            <p>❤️ ${info.heartBeats.toLocaleString()} Heartbeats</p>
            <p>🫁 ${info.breaths.toLocaleString()} Breaths</p>
        </div>

        <div class="quote">
            <p>✨ Every second you've lived is part of your story.</p>
        </div>

    </div>
            `;
        }
    } catch (e) {
        console.error('calculateAge error', e);
        if (resEl) resEl.innerText = 'Error: ' + e.message;
    }
}

// Export for Node tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { computeAgeFromDate };
}
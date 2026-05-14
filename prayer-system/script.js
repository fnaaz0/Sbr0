let sbrTimings = {};
let isAudioEnabled = true;
let azanTriggered = { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };
let lastResetDate = null;

document.addEventListener("DOMContentLoaded", () => {
    getSbrPrayerData("Delhi", "India");
    setInterval(checkSbrAzanTime, 30000); 
});

function getSbrPrayerData(city, country) {
    const locElement = document.getElementById('sbr-location');
    const today = new Date();
    
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    // ✅ 100% Correct Verified API URL
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${city}&country=${country}&method=4`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(resData => {
            if(resData && resData.code === 200 && resData.data) {
                sbrTimings = resData.data.timings;
                if (locElement) locElement.innerText = `📍 लाइव लोकेशन: ${city}, ${country}`;
                renderSbrTimings();
            }
        })
        .catch(err => {
            console.error("API Sync Error:", err);
            if (locElement) locElement.innerText = "❌ डेटा सिंक एरर (SBR Core)";
        });
}

function renderSbrTimings() {
    if (!sbrTimings.Fajr) return;
    
    document.getElementById('fajr-time').innerText = formatSbrTime(sbrTimings.Fajr);
    document.getElementById('dhuhr-time').innerText = formatSbrTime(sbrTimings.Dhuhr);
    document.getElementById('asr-time').innerText = formatSbrTime(sbrTimings.Asr);
    document.getElementById('maghrib-time').innerText = formatSbrTime(sbrTimings.Maghrib);
    document.getElementById('isha-time').innerText = formatSbrTime(sbrTimings.Isha);
    
    const loader = document.getElementById('sbr-loader');
    const grid = document.getElementById('prayer-grid');
    if (loader) loader.classList.add('hidden');
    if (grid) grid.classList.remove('hidden');
    
    checkSbrAzanTime(); 
}

function checkSbrAzanTime() {
    if (!sbrTimings.Fajr) return;

    const now = new Date();
    const todayDateString = now.toDateString();
    const currentHrs = String(now.getHours()).padStart(2, '0');
    const currentMins = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHrs}:${currentMins}`;

    // ✅ Optimized Daily Reset Logic - Runs only ONCE per day
    if (lastResetDate !== todayDateString) {
        azanTriggered = { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };
        lastResetDate = todayDateString;
        getSbrPrayerData("Delhi", "India"); 
        return; 
    }

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let nextPrayerName = "Fajr";
    let nextPrayerTime = sbrTimings.Fajr;
    let foundNext = false;

    prayers.forEach(p => {
        const card = document.getElementById(`card-${p}`);
        if(card) {
            card.classList.remove('border-[#BF953F]', 'bg-stone-900');
            card.classList.add('border-[#BF953F]/10', 'bg-stone-950/50');
        }
    });

    for (let i = 0; i < prayers.length; i++) {
        const pName = prayers[i];
        const pTime = sbrTimings[pName]; 

        if (currentTimeStr === pTime && !azanTriggered[pName]) {
            playSbrAzan();
            azanTriggered[pName] = true; 
        }

        if (currentTimeStr < pTime && !foundNext) {
            nextPrayerName = pName;
            nextPrayerTime = pTime;
            foundNext = true;
            
            const activeCard = document.getElementById(`card-${pName}`);
            if(activeCard) {
                activeCard.classList.remove('border-[#BF953F]/10', 'bg-stone-950/50');
                activeCard.classList.add('border-[#BF953F]', 'bg-stone-900');
            }
        }
    }

    if (!foundNext) {
        nextPrayerName = "Fajr";
        nextPrayerTime = sbrTimings.Fajr;
        const fajrCard = document.getElementById(`card-Fajr`);
        if(fajrCard) {
            fajrCard.classList.add('border-[#BF953F]', 'bg-stone-900');
        }
    }

    const nextPrayerText = document.getElementById('sbr-next-prayer');
    if (nextPrayerText) {
        nextPrayerText.innerText = `अगली नमाज़: ${nextPrayerName} (${formatSbrTime(nextPrayerTime)})`;
    }
}

function playSbrAzan() {
    const player = document.getElementById('sbr-azan-player');
    if (isAudioEnabled && player) {
        player.play().catch(e => console.log("Audio play gesture restriction. Waiting for user interaction."));
    }
}

function toggleSbrAudio() {
    isAudioEnabled = !isAudioEnabled;
    const btn = document.getElementById('sbr-audio-toggle');
    if(!btn) return;
    
    if(isAudioEnabled) {
        btn.innerText = "🔊 अनम्यूटेड";
        btn.classList.remove('bg-red-950/40');
    } else {
        btn.innerText = "🔇 म्यूटेड";
        btn.classList.add('bg-red-950/40');
        const player = document.getElementById('sbr-azan-player');
        if(player) player.pause();
    }
}

function formatSbrTime(timeStr) {
    if(!timeStr) return "--:--";
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
}

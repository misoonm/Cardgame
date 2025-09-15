
// تعريف المتغيرات العامة
let db;
let currentLevel = 1;
let levelPoints = 0;
let totalPoints = 0;
let selectedCard = null;
let vibrationEnabled = true;
let soundEnabled = true;
let notificationsEnabled = true;
let userName = "المستخدم";
let userEmail = "";
let playTime = 0;
let playTimer;
let deferredPrompt;
let gameMode = "normal";
let gameTimer;
let timeLeft = 60;
let hintCost = 10;
let achievements = [
    { id: "first_win", title: "الفائز الأول", description: "أكمل مستوى واحد", icon: "fa-trophy", earned: false },
    { id: "five_wins", title: "بطل مبتدئ", description: "أكمل 5 مستويات", icon: "fa-medal", earned: false },
    { id: "ten_wins", title: "بطل محترف", description: "أكمل 10 مستويات", icon: "fa-crown", earned: false },
    { id: "daily_challenge", title: "متحدي اليوم", description: "أكمل التحدي اليومي", icon: "fa-calendar", earned: false },
    { id: "speed_runner", title: "عداء سريع", description: "أكمل مستوى في أقل من 30 ثانية", icon: "fa-stopwatch", earned: false },
    { id: "hint_master", title: "سيد التلميحات", description: "أكمل مستوى دون استخدام تلميحات", icon: "fa-lightbulb", earned: false }
];

// بيانات المستويات العادية
const normalLevelsData = [];
const levelBackgrounds = [
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
];

// إنشاء بيانات المستويات العادية ديناميكيًا
for (let i = 1; i <= 23; i++) {
    const cards = [];
    const requiredPoints = i > 1 ? (i-1) * 2 : 0; // كل مستوى يتطلب نقاط أكثر لفتحه
    
    for (let j = 1; j <= 3; j++) {
        cards.push({ id: `normal-${i}-${j}`, type: 'puzzle', path: `img/normal/puzzle-${i}-${j}.jpg` });
        cards.push({ id: `normal-${i}-${j}`, type: 'solution', path: `img/normal/solution-${i}-${j}.jpg` });
    }
    normalLevelsData.push({
        id: i,
        cards: cards,
        background: levelBackgrounds[i % levelBackgrounds.length],
        requiredPoints: requiredPoints
    });
}

// بيانات التحدي اليومي (أسئلة ثقافية عامة)
const dailyChallengeData = {
    id: "daily",
    cards: [
        { id: "daily-1", type: 'puzzle', path: 'img/daily/puzzle-1.jpg', question: "ما هي عاصمة فرنسا؟" },
        { id: "daily-1", type: 'solution', path: 'img/daily/solution-1.jpg', answer: "باريس" },
        { id: "daily-2", type: 'puzzle', path: 'img/daily/puzzle-2.jpg', question: "كم عدد الكواكب في النظام الشمسي؟" },
        { id: "daily-2", type: 'solution', path: 'img/daily/solution-2.jpg', answer: "8 كواكب" },
        { id: "daily-3", type: 'puzzle', path: 'img/daily/puzzle-3.jpg', question: "ما هو أطول نهر في العالم؟" },
        { id: "daily-3", type: 'solution', path: 'img/daily/solution-3.jpg', answer: "نهر النيل" }
    ],
    background: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
};

// بيانات وضع الوقت المحدد (أسئلة سريعة تحتاج إلى تفكير سريع)
const timedChallengeData = {
    id: "timed",
    cards: [
        { id: "timed-1", type: 'puzzle', path: 'img/timed/puzzle-1.jpg', question: "2 + 2 × 2 = ?" },
        { id: "timed-1", type: 'solution', path: 'img/timed/solution-1.jpg', answer: "6" },
        { id: "timed-2", type: 'puzzle', path: 'img/timed/puzzle-2.jpg', question: "ما هو العدد الأولي بعد العدد 10؟" },
        { id: "timed-2", type: 'solution', path: 'img/timed/solution-2.jpg', answer: "11" },
        { id: "timed-3", type: 'puzzle', path: 'img/timed/puzzle-3.jpg', question: "كم جانب للمكعب؟" },
        { id: "timed-3", type: 'solution', path: 'img/timed/solution-3.jpg', answer: "6" }
    ],
    background: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    createStars();
    initializeDB();
    setupEventListeners();
    checkFirstTime();
    setupServiceWorker();
    startPlayTimer();
    checkInstallPrompt();
    showScreen('levels-screen');
}

// بدء حساب وقت اللعب
function startPlayTimer() {
    playTimer = setInterval(() => {
        playTime++;
        // تحديث وقت اللعب في قاعدة البيانات كل 5 دقائق
        if (playTime % 5 === 0) {
            updatePlayTimeInDB();
        }
    }, 60000); // تحديث كل دقيقة
}

// تحديث وقت اللعب في قاعدة البيانات
function updatePlayTimeInDB() {
    const transaction = db.transaction(['user'], 'readwrite');
    const userStore = transaction.objectStore('user');
    
    userStore.get('profile').onsuccess = (event) => {
        const userData = event.target.result;
        if (userData) {
            userData.playTime = playTime;
            userStore.put(userData);
        }
    };
}

// تسجيل Service Worker للتخزين المؤقت
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
}

// التحقق من أول مرة يتم فيها فتح التطبيق
function checkFirstTime() {
    if (!localStorage.getItem('firstTime')) {
        setTimeout(() => {
            showToast('مرحباً بك في أبطال البطاقات! استمتع باللعبة');
            localStorage.setItem('firstTime', 'false');
        }, 2000);
    }
}

// التحقق من إمكانية تثبيت التطبيق
function checkInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('install-app').style.display = 'inline-flex';
    });

    document.getElementById('install-app').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('install-app').style.display = 'none';
        }
    });
}

// إنشاء تأثير النجوم في الخلفية
function createStars() {
    const starsCount = 30;
    const container = document.body;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(star);
    }
}

// تأثير confetti عند الفوز
function createConfetti() {
    const confettiCount = 70;
    const colors = ['#6c5ce7', '#a29bfe', '#fd79a8', '#00b894', '#fdcb6e', '#d63031'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 50}%`;
        
        document.body.appendChild(confetti);
        
        const animationDuration = Math.random() * 2 + 2;
        confetti.style.animation = `confettiFall ${animationDuration}s linear forwards`;
        
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

// تهيئة قاعدة البيانات IndexedDB
function initializeDB() {
    const request = indexedDB.open('CardGameDB', 6); // ترقية الإصدار إلى 6

    request.onerror = (event) => {
        console.error('فشل في فتح قاعدة البيانات', event);
        showToast('خطأ في تحميل البيانات، يرجى إعادة تحميل التطبيق');
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        loadGameData();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const oldVersion = event.oldVersion;

        // إنشاء مخزن للمستويات
        if (!db.objectStoreNames.contains('levels')) {
            const levelsStore = db.createObjectStore('levels', { keyPath: 'id' });
            levelsStore.createIndex('completed', 'completed', { unique: false });
            levelsStore.createIndex('points', 'points', { unique: false });
        }

        // إنشاء مخزن للإحصائيات
        if (!db.objectStoreNames.contains('stats')) {
            const statsStore = db.createObjectStore('stats', { keyPath: 'id' });
        }

        // إنشاء مخزن للإعدادات
        if (!db.objectStoreNames.contains('settings')) {
            const settingsStore = db.createObjectStore('settings', { keyPath: 'id' });
            settingsStore.add({ id: 'vibration', value: true });
            settingsStore.add({ id: 'sound', value: true });
            settingsStore.add({ id: 'notifications', value: true });
        }

        // إنشاء مخزن للمستخدم
        if (!db.objectStoreNames.contains('user')) {
            const userStore = db.createObjectStore('user', { keyPath: 'id' });
            userStore.add({ 
                id: 'profile', 
                name: 'المستخدم',
                email: '',
                playTime: 0,
                totalPoints: 0,
                completedLevels: 0
            });
        }
        
        // إضافة مخزن جديد للصور
        if (!db.objectStoreNames.contains('images')) {
             db.createObjectStore('images', { keyPath: 'path' });
        }
        
        // إضافة مخزن للإنجازات
        if (!db.objectStoreNames.contains('achievements')) {
            const achievementsStore = db.createObjectStore('achievements', { keyPath: 'id' });
            achievements.forEach(achievement => {
                achievementsStore.add({
                    id: achievement.id,
                    title: achievement.title,
                    description: achievement.description,
                    icon: achievement.icon,
                    earned: false
                });
            });
        }
        
        // إضافة مخزن للتحدي اليومي
        if (!db.objectStoreNames.contains('dailyChallenge')) {
            const dailyStore = db.createObjectStore('dailyChallenge', { keyPath: 'date' });
        }
    };
}

// جلب الصور وتخزينها في قاعدة البيانات
async function cacheAllImages() {
    const transaction = db.transaction(['images'], 'readwrite');
    const imagesStore = transaction.objectStore('images');

    // جمع مسارات جميع الصور من جميع المستويات
    const allImagePaths = new Set();
    
    // إضافة صور المستويات العادية
    normalLevelsData.forEach(level => {
        level.cards.forEach(card => {
            allImagePaths.add(card.path);
        });
    });
    
    // إضافة صور التحدي اليومي
    dailyChallengeData.cards.forEach(card => {
        allImagePaths.add(card.path);
    });
    
    // إضافة صور تحدي الوقت المحدد
    timedChallengeData.cards.forEach(card => {
        allImagePaths.add(card.path);
    });

    for (const path of allImagePaths) {
        try {
            const response = await fetch(path);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                imagesStore.put({ path: path, data: reader.result });
            };
        } catch (error) {
            console.error(`Failed to cache image at ${path}`, error);
        }
    }
}

// تحميل بيانات اللعبة
function loadGameData() {
    const transaction = db.transaction(['stats', 'settings', 'user', 'achievements'], 'readonly');
    const statsStore = transaction.objectStore('stats');
    const settingsStore = transaction.objectStore('settings');
    const userStore = transaction.objectStore('user');
    const achievementsStore = transaction.objectStore('achievements');
    
    const pointsRequest = statsStore.get('totalPoints');
    pointsRequest.onsuccess = (event) => {
        if (pointsRequest.result) {
            totalPoints = pointsRequest.result.value;
            document.getElementById('total-points').textContent = totalPoints;
            updateProgress('total-progress', totalPoints, 69);
        }
    };
    
    const vibrationRequest = settingsStore.get('vibration');
    vibrationRequest.onsuccess = (event) => {
        if (vibrationRequest.result) {
            vibrationEnabled = vibrationRequest.result.value;
            document.getElementById('vibration-toggle').checked = vibrationEnabled;
        }
    };
    
    const soundRequest = settingsStore.get('sound');
    soundRequest.onsuccess = (event) => {
        if (soundRequest.result) {
            soundEnabled = soundRequest.result.value;
            document.getElementById('sound-toggle').checked = soundEnabled;
        }
    };
    
    const notificationsRequest = settingsStore.get('notifications');
    notificationsRequest.onsuccess = (event) => {
        if (notificationsRequest.result) {
            notificationsEnabled = notificationsRequest.result.value;
            document.getElementById('notifications-toggle').checked = notificationsEnabled;
        }
    };
    
    const userRequest = userStore.get('profile');
    userRequest.onsuccess = (event) => {
        if (userRequest.result) {
            userName = userRequest.result.name;
            userEmail = userRequest.result.email;
            playTime = userRequest.result.playTime || 0;
            
            document.getElementById('user-name').value = userName;
            document.getElementById('user-email').value = userEmail;
            document.getElementById('profile-name').textContent = userName;
        }
    };
    
    const achievementsRequest = achievementsStore.getAll();
    achievementsRequest.onsuccess = (event) => {
        if (achievementsRequest.result && achievementsRequest.result.length > 0) {
            achievements = achievementsRequest.result;
            loadAchievements();
        }
    };
    
    // تحديث الإحصائيات عند فتح التطبيق
    updateProfileStats();
    
    loadLevels();
}

// تحميل الإنجازات
function loadAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    if (!achievementsContainer) return;
    
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${achievement.earned ? '' : 'locked'}`;
        achievementElement.innerHTML = `
            <i class="fas ${achievement.icon}"></i>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;
        achievementsContainer.appendChild(achievementElement);
    });
}

// تحديث إحصائيات الملف الشخصي
function updateProfileStats() {
    if (!db) return;
    
    const transaction = db.transaction(['levels', 'user'], 'readonly');
    const levelsStore = transaction.objectStore('levels');
    const userStore = transaction.objectStore('user');
    
    let completedLevels = 0;
    let totalEarnedPoints = 0;
    
    const countRequest = levelsStore.index('completed').openCursor(IDBKeyRange.only(true));
    countRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            completedLevels++;
            totalEarnedPoints += cursor.value.points;
            cursor.continue();
        } else {
            // حساب معدل النجاح
            const successRate = completedLevels > 0 ? Math.round((totalEarnedPoints / (completedLevels * 3)) * 100) : 0;
            
            // تحديث واجهة المستخدم
            if (document.getElementById('total-points-profile')) {
                document.getElementById('total-points-profile').textContent = totalEarnedPoints;
            }
            if (document.getElementById('completed-levels')) {
                document.getElementById('completed-levels').textContent = completedLevels;
            }
            if (document.getElementById('success-rate')) {
                document.getElementById('success-rate').textContent = `${successRate}%`;
            }
            if (document.getElementById('play-time')) {
                const hours = Math.floor(playTime / 60);
                const minutes = playTime % 60;
                document.getElementById('play-time').textContent = `${hours} س ${minutes} د`;
            }
            if (document.getElementById('profile-level')) {
                const userLevel = Math.floor(completedLevels / 5) + 1;
                document.getElementById('profile-level').textContent = userLevel;
            }
            
            // تحديث بيانات المستخدم في قاعدة البيانات
            userStore.get('profile').onsuccess = (e) => {
                const userData = e.target.result;
                if (userData) {
                    userData.totalPoints = totalEarnedPoints;
                    userData.completedLevels = completedLevels;
                    userData.playTime = playTime;
                    
                    const updateTransaction = db.transaction(['user'], 'readwrite');
                    const updateStore = updateTransaction.objectStore('user');
                    updateStore.put(userData);
                }
            };
            
            // التحقق من الإنجازات
            checkAchievements(completedLevels, totalEarnedPoints);
        }
    };
}

// التحقق من الإنجازات
function checkAchievements(completedLevels, totalPoints) {
    const achievementsToUpdate = [];
    
    if (completedLevels >= 1 && !achievements.find(a => a.id === "first_win" && a.earned)) {
        achievementsToUpdate.push({ id: "first_win", earned: true });
    }
    
    if (completedLevels >= 5 && !achievements.find(a => a.id === "five_wins" && a.earned)) {
        achievementsToUpdate.push({ id: "five_wins", earned: true });
    }
    
    if (completedLevels >= 10 && !achievements.find(a => a.id === "ten_wins" && a.earned)) {
        achievementsToUpdate.push({ id: "ten_wins", earned: true });
    }
    
    if (achievementsToUpdate.length > 0) {
        const transaction = db.transaction(['achievements'], 'readwrite');
        const achievementsStore = transaction.objectStore('achievements');
        
        achievementsToUpdate.forEach(achievement => {
            achievementsStore.get(achievement.id).onsuccess = (event) => {
                const data = event.target.result;
                if (data && !data.earned) {
                    data.earned = true;
                    achievementsStore.put(data);
                    
                    // تحديث القائمة المحلية
                    const localAchievement = achievements.find(a => a.id === achievement.id);
                    if (localAchievement) {
                        localAchievement.earned = true;
                    }
                    
                    // عرض إشعار الإنجاز
                    showAchievement(`تهانينا! لقد حصلت على إنجاز: ${data.title}`);
                    
                    // إعادة تحميل الإنجازات
                    loadAchievements();
                }
            };
        });
    }
}

// تحديث شريط التقدم
function updateProgress(progressBarId, current, max) {
    const progressBar = document.getElementById(progressBarId);
    if (progressBar) {
        const percentage = (current / max) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// تحميل و عرض المستويات
function loadLevels() {
    const levelsContainer = document.getElementById('levels-container');
    if (!levelsContainer) return;
    
    levelsContainer.innerHTML = '';
    
    const transaction = db.transaction(['levels'], 'readonly');
    const levelsStore = transaction.objectStore('levels');
    
    // إضافة بطاقة التحدي اليومي
    if (gameMode === "daily") {
        const dailyCard = createSpecialLevelCard("التحدي اليومي", dailyChallengeData.background, "daily");
        levelsContainer.appendChild(dailyCard);
        return;
    }
    
    // إضافة بطاقة تحدي الوقت المحدد
    if (gameMode === "timed") {
        const timedCard = createSpecialLevelCard("الوقت المحدد", timedChallengeData.background, "timed");
        levelsContainer.appendChild(timedCard);
        return;
    }
    
    // تحميل المستويات العادية
    for (let i = 1; i <= 23; i++) {
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card ripple';
        levelCard.dataset.level = i;
        levelCard.dataset.mode = "normal";
        
        const levelBg = document.createElement('div');
        levelBg.className = 'level-bg';
        levelBg.style.backgroundImage = `url(${normalLevelsData[i-1].background})`;
        levelCard.appendChild(levelBg);
        
        const levelNumber = document.createElement('div');
        levelNumber.className = 'level-number';
        levelNumber.innerHTML = `<i class="fas fa-${i === 1 ? 'play' : 'hashtag'}"></i> ${i}`;
        levelCard.appendChild(levelNumber);
        
        const levelStatus = document.createElement('div');
        levelStatus.className = 'level-status';
        levelCard.appendChild(levelStatus);
        
        if (i % 5 === 0) {
            const ribbon = document.createElement('div');
            ribbon.className = 'ribbon';
            ribbon.innerHTML = '<span>مميز</span>';
            levelCard.appendChild(ribbon);
        }
        
        const request = levelsStore.get(i);
        
        request.onsuccess = (event) => {
            if (request.result) {
                if (request.result.completed) {
                    levelCard.classList.add('completed');
                    levelStatus.innerHTML = `<i class="fas fa-star"></i> ${request.result.points}/3`;
                }
            }
            
            // التحقق مما إذا كان المستوى مقفلاً بناءً على النقاط المطلوبة
            if (i > 1) {
                const levelData = normalLevelsData[i-1];
                if (totalPoints < levelData.requiredPoints) {
                    levelCard.classList.add('locked');
                    levelStatus.innerHTML = `<i class="fas fa-lock"></i> ${levelData.requiredPoints} نقطة`;
                } else {
                    // التحقق مما إذا كان المستوى السابق مكتملاً
                    const prevRequest = levelsStore.get(i-1);
                    prevRequest.onsuccess = (e) => {
                        if (!prevRequest.result || !prevRequest.result.completed) {
                            levelCard.classList.add('locked');
                            levelStatus.innerHTML = '<i class="fas fa-lock"></i> مقفل';
                        }
                    };
                }
            }
        };
        
        levelCard.addEventListener('click', () => {
            if (!levelCard.classList.contains('locked')) {
                vibrate();
                playSound('click');
                startLevel(i);
            } else {
                vibrate(100);
                showToast('هذا المستوى مقفل، يجب إكمال المستوى السابق أولاً');
            }
        });
        
        levelsContainer.appendChild(levelCard);
    }
}

// إنشاء بطاقة خاصة للتحدي اليومي والوقت المحدد
function createSpecialLevelCard(title, background, mode) {
    const levelCard = document.createElement('div');
    levelCard.className = 'level-card ripple';
    levelCard.dataset.mode = mode;
    
    const levelBg = document.createElement('div');
    levelBg.className = 'level-bg';
    levelBg.style.backgroundImage = `url(${background})`;
    levelCard.appendChild(levelBg);
    
    const levelNumber = document.createElement('div');
    levelNumber.className = 'level-number';
    levelNumber.innerHTML = `<i class="fas fa-${mode === 'daily' ? 'calendar' : 'stopwatch'}"></i> ${title}`;
    levelCard.appendChild(levelNumber);
    
    const levelStatus = document.createElement('div');
    levelStatus.className = 'level-status';
    levelStatus.innerHTML = '<i class="fas fa-play"></i> ابدأ التحدي';
    levelCard.appendChild(levelStatus);
    
    levelCard.addEventListener('click', () => {
        vibrate();
        playSound('click');
        startSpecialLevel(mode);
    });
    
    return levelCard;
}

// بدء مستوى جديد
function startLevel(level) {
    currentLevel = level;
    levelPoints = 0;
    gameMode = "normal";
    
    showScreen('game-screen');
    document.getElementById('current-level').textContent = level;
    document.getElementById('level-points').textContent = '0';
    updateProgress('level-progress', 0, 3);
    
    // إخفاء المؤقت لوضع الوقت المحدد
    document.getElementById('timer-container').style.display = 'none';
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    // إعداد التلميحات
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('hint-cost').textContent = hintCost;
    
    createCards(level, "normal");
}

// بدء مستوى خاص (التحدي اليومي أو الوقت المحدد)
function startSpecialLevel(mode) {
    levelPoints = 0;
    gameMode = mode;
    
    showScreen('game-screen');
    document.getElementById('current-level').textContent = mode === "daily" ? "التحدي اليومي" : "الوقت المحدد";
    document.getElementById('level-points').textContent = '0';
    updateProgress('level-progress', 0, 3);
    
    // إعداد المؤقت لوضع الوقت المحدد
    if (mode === "timed") {
        timeLeft = 60;
        document.getElementById('timer-container').style.display = 'flex';
        document.getElementById('timer').textContent = timeLeft;
        startGameTimer();
    } else {
        document.getElementById('timer-container').style.display = 'none';
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
    }
    
    // إعداد التلميحات
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('hint-cost').textContent = hintCost;
    
    createCards(0, mode);
}

// بدء مؤقت اللعبة لوضع الوقت المحدد
function startGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 10) {
            document.getElementById('timer-container').classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            endGameDueToTime();
        }
    }, 1000);
}

// إنهاء اللعبة بسبب انتهاء الوقت
function endGameDueToTime() {
    playSound('error');
    showMessage('انتهى الوقت!', `${userName}، لم تستطع إكمل التحدي في الوقت المحدد`, false);
    
    // خصم نقطة عند الفشل في وضع الوقت المحدد
    if (totalPoints > 0) {
        totalPoints--;
        const transaction = db.transaction(['stats'], 'readwrite');
        const statsStore = transaction.objectStore('stats');
        statsStore.put({
            id: 'totalPoints',
            value: totalPoints
        });
        
        document.getElementById('total-points').textContent = totalPoints;
        updateProgress('total-progress', totalPoints, 69);
        showToast('تم خصم نقطة بسبب انتهاء الوقت');
        
        // تحديث الإحصائيات
        updateProfileStats();
    }
}

// إنشاء بطاقات المستوى
function createCards(level, mode) {
    const appCardsContainer = document.getElementById('app-cards');
    const playerCardsContainer = document.getElementById('player-cards');
    
    if (!appCardsContainer || !playerCardsContainer) return;
    
    appCardsContainer.innerHTML = '';
    playerCardsContainer.innerHTML = '';
    
    let levelData;
    if (mode === "daily") {
        levelData = dailyChallengeData;
    } else if (mode === "timed") {
        levelData = timedChallengeData;
    } else {
        levelData = normalLevelsData[level - 1];
    }
    
    const puzzleCards = levelData.cards.filter(card => card.type === 'puzzle');
    const solutionCards = levelData.cards.filter(card => card.type === 'solution');
    
    shuffleArray(solutionCards);
    
    puzzleCards.forEach(card => {
        const cardElement = mode === "normal" ? 
            createAppCardElement(card) : 
            createSpecialAppCardElement(card, mode);
        appCardsContainer.appendChild(cardElement);
    });
    
    solutionCards.forEach(card => {
        const cardElement = mode === "normal" ? 
            createPlayerCardElement(card) : 
            createSpecialPlayerCardElement(card, mode);
        playerCardsContainer.appendChild(cardElement);
    });
    
    // Lazy load images for the game screen
    lazyLoadImages();
}

// Lazy Loading للصور
function lazyLoadImages() {
    const images = document.querySelectorAll('.card-image');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const path = img.dataset.src;
                
                // جلب الصورة من IndexedDB
                const transaction = db.transaction(['images'], 'readonly');
                const imagesStore = transaction.objectStore('images');
                const request = imagesStore.get(path);
                
                request.onsuccess = () => {
                    if (request.result) {
                        img.src = request.result.data;
                        img.classList.remove('loading');
                    } else {
                        // إذا لم تكن موجودة، جلبها وتخزينها
                        fetchImageAndCache(path, img);
                    }
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "0px 0px 100px 0px" // تحميل الصور قبل ظهورها بقليل
    });

    images.forEach(img => {
        observer.observe(img);
    });
}

// جلب الصورة من الشبكة وتخزينها في IndexedDB
async function fetchImageAndCache(path, imgElement) {
    try {
        const response = await fetch(path);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error(`Failed to load image from network: ${path}`, error);
        imgElement.classList.remove('loading');
        imgElement.classList.add('error');
    }
}

// إنشاء عنصر بطاقة التطبيق (ذات الوجهين) للمستويات العادية
function createAppCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'card ripple';
    card.dataset.id = cardData.id;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'لغز';
    cardFront.appendChild(cardImage);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.innerHTML = '<div class="pattern">❖</div><div>؟</div>';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => showPuzzleCard(card));
    
    return card;
}

// إنشاء عنصر بطاقة التطبيق الخاصة (للتحدي اليومي والوقت المحدد)
function createSpecialAppCardElement(cardData, mode) {
    const card = document.createElement('div');
    card.className = 'card ripple special-card';
    card.dataset.id = cardData.id;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.style.flexDirection = 'column';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'لغز';
    cardImage.style.maxHeight = '60%';
    cardFront.appendChild(cardImage);
    
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = cardData.question;
    cardFront.appendChild(questionText);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.innerHTML = '<div class="pattern">❖</div><div>؟</div>';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => showPuzzleCard(card));
    
    return card;
}

// إنشاء عنصر بطاقة اللاعب (ذات الوجه الواحد) للمستويات العادية
function createPlayerCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'player-card ripple';
    card.dataset.id = cardData.id;
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'حل';
    card.appendChild(cardImage);
    card.addEventListener('click', () => selectCard(card));
    
    return card;
}

// إنشاء عنصر بطاقة اللاعب الخاصة (للتحدي اليومي والوقت المحدد)
function createSpecialPlayerCardElement(cardData, mode) {
    const card = document.createElement('div');
    card.className = 'player-card ripple special-answer-card';
    card.dataset.id = cardData.id;
    
    const cardContent = document.createElement('div');
    cardContent.className = 'special-answer-content';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'حل';
    cardContent.appendChild(cardImage);
    
    const answerText = document.createElement('div');
    answerText.className = 'answer-text';
    answerText.textContent = cardData.answer;
    cardContent.appendChild(answerText);
    
    card.appendChild(cardContent);
    card.addEventListener('click', () => selectCard(card));
    
    return card;
}

// عرض بطاقة اللغز
function showPuzzleCard(card) {
    if (selectedCard) return;
    
    card.classList.add('flipped');
    selectedCard = card;
    playSound('flip');
    
    setTimeout(() => {
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            selectedCard = null;
        }
    }, 3000);
}

// اختيار بطاقة الحل
function selectCard(card) {
    if (!selectedCard) {
        showMessage('تنبيه', `${userName}، الرجاء النقر على إحدى بطاقات اللغز أولاً`);
        vibrate(100);
        return;
    }
    
    if (selectedCard.dataset.id === card.dataset.id) {
        selectedCard.style.visibility = 'hidden';
        selectedCard = null;
        
        levelPoints++;
        document.getElementById('level-points').textContent = levelPoints;
        updateProgress('level-progress', levelPoints, 3);
        
        playSound('success');
        vibrate(50);
        
        if (levelPoints === 3) {
            completeLevel();
        } else {
            showToast(`إجابة صحيحة! ${userName}، لقد كسبت نقطة`);
        }
    } else {
        playSound('error');
        vibrate(200);
        
        // خصم نقطة عند الإجابة الخاطئة
        if (totalPoints > 0) {
            totalPoints--;
            const transaction = db.transaction(['stats'], 'readwrite');
            const statsStore = transaction.objectStore('stats');
            statsStore.put({
                id: 'totalPoints',
                value: totalPoints
            });
            
            document.getElementById('total-points').textContent = totalPoints;
            updateProgress('total-progress', totalPoints, 69);
            showToast('تم خصم نقطة بسبب الإجابة الخاطئة');
            
            
        updateProfileStats();
    }
}

// إنشاء بطاقات المستوى
function createCards(level, mode) {
    const appCardsContainer = document.getElementById('app-cards');
    const playerCardsContainer = document.getElementById('player-cards');
    
    if (!appCardsContainer || !playerCardsContainer) return;
    
    appCardsContainer.innerHTML = '';
    playerCardsContainer.innerHTML = '';
    
    let levelData;
    if (mode === "daily") {
        levelData = dailyChallengeData;
    } else if (mode === "timed") {
        levelData = timedChallengeData;
    } else {
        levelData = normalLevelsData[level - 1];
    }
    
    const puzzleCards = levelData.cards.filter(card => card.type === 'puzzle');
    const solutionCards = levelData.cards.filter(card => card.type === 'solution');
    
    shuffleArray(solutionCards);
    
    puzzleCards.forEach(card => {
        const cardElement = mode === "normal" ? 
            createAppCardElement(card) : 
            createSpecialAppCardElement(card, mode);
        appCardsContainer.appendChild(cardElement);
    });
    
    solutionCards.forEach(card => {
        const cardElement = mode === "normal" ? 
            createPlayerCardElement(card) : 
            createSpecialPlayerCardElement(card, mode);
        playerCardsContainer.appendChild(cardElement);
    });
    
    // Lazy load images for the game screen
    lazyLoadImages();
}

// Lazy Loading للصور
function lazyLoadImages() {
    const images = document.querySelectorAll('.card-image');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const path = img.dataset.src;
                
                // جلب الصورة من IndexedDB
                const transaction = db.transaction(['images'], 'readonly');
                const imagesStore = transaction.objectStore('images');
                const request = imagesStore.get(path);
                
                request.onsuccess = () => {
                    if (request.result) {
                        img.src = request.result.data;
                        img.classList.remove('loading');
                    } else {
                        // إذا لم تكن موجودة، جلبها وتخزينها
                        fetchImageAndCache(path, img);
                    }
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "0px 0px 100px 0px" // تحميل الصور قبل ظهورها بقليل
    });

    images.forEach(img => {
        observer.observe(img);
    });
}

// جلب الصورة من الشبكة وتخزينها في IndexedDB
async function fetchImageAndCache(path, imgElement) {
    try {
        const response = await fetch(path);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error(`Failed to load image from network: ${path}`, error);
        imgElement.classList.remove('loading');
        imgElement.classList.add('error');
    }
}

// إنشاء عنصر بطاقة التطبيق (ذات الوجهين) للمستويات العادية
function createAppCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'card ripple';
    card.dataset.id = cardData.id;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'لغز';
    cardFront.appendChild(cardImage);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.innerHTML = '<div class="pattern">❖</div><div>؟</div>';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => showPuzzleCard(card));
    
    return card;
}

// إنشاء عنصر بطاقة التطبيق الخاصة (للتحدي اليومي والوقت المحدد)
function createSpecialAppCardElement(cardData, mode) {
    const card = document.createElement('div');
    card.className = 'card ripple special-card';
    card.dataset.id = cardData.id;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.style.flexDirection = 'column';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'لغز';
    cardImage.style.maxHeight = '60%';
    cardFront.appendChild(cardImage);
    
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = cardData.question;
    cardFront.appendChild(questionText);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.innerHTML = '<div class="pattern">❖</div><div>؟</div>';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => showPuzzleCard(card));
    
    return card;
}

// إنشاء عنصر بطاقة اللاعب (ذات الوجه الواحد) للمستويات العادية
function createPlayerCardElement(cardData) {
    const card = document.createElement('div');
    card.className = 'player-card ripple';
    card.dataset.id = cardData.id;
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'حل';
    card.appendChild(cardImage);
    card.addEventListener('click', () => selectCard(card));
    
    return card;
}

// إنشاء عنصر بطاقة اللاعب الخاصة (للتحدي اليومي والوقت المحدد)
function createSpecialPlayerCardElement(cardData, mode) {
    const card = document.createElement('div');
    card.className = 'player-card ripple special-answer-card';
    card.dataset.id = cardData.id;
    
    const cardContent = document.createElement('div');
    cardContent.className = 'special-answer-content';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-image loading';
    cardImage.dataset.src = cardData.path;
    cardImage.alt = 'حل';
    cardContent.appendChild(cardImage);
    
    const answerText = document.createElement('div');
    answerText.className = 'answer-text';
    answerText.textContent = cardData.answer;
    cardContent.appendChild(answerText);
    
    card.appendChild(cardContent);
    card.addEventListener('click', () => selectCard(card));
    
    return card;
}

// عرض بطاقة اللغز
function showPuzzleCard(card) {
    if (selectedCard) return;
    
    card.classList.add('flipped');
    selectedCard = card;
    playSound('flip');
    
    setTimeout(() => {
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            selectedCard = null;
        }
    }, 3000);
}

// اختيار بطاقة الحل
function selectCard(card) {
    if (!selectedCard) {
        showMessage('تنبيه', `${userName}، الرجاء النقر على إحدى بطاقات اللغز أولاً`);
        vibrate(100);
        return;
    }
    
    if (selectedCard.dataset.id === card.dataset.id) {
        selectedCard.style.visibility = 'hidden';
        selectedCard = null;
        
        levelPoints++;
        document.getElementById('level-points').textContent = levelPoints;
        updateProgress('level-progress', levelPoints, 3);
        
        playSound('success');
        vibrate(50);
        
        if (levelPoints === 3) {
            completeLevel();
        } else {
            showToast(`إجابة صحيحة! ${userName}، لقد كسبت نقطة`);
        }
    } else {
        playSound('error');
        vibrate(200);
        
        // خصم نقطة عند الإجابة الخاطئة
        if (totalPoints > 0) {
            totalPoints--;
            const transaction = db.transaction(['stats'], 'readwrite');
            const statsStore = transaction.objectStore('stats');
            statsStore.put({
                id: 'totalPoints',
                value: totalPoints
            });
            
            document.getElementById('total-points').textContent = totalPoints;
            updateProgress('total-progress', totalPoints, 69);
            showToast('تم خصم نقطة بسبب الإجابة الخاطئة');
            
            // تحديث الإحصائيات
            updateProfileStats();
        }
        
        showMessage('إجابة خاطئة', `${userName}، حاول مرة أخرى`);
        selectedCard.classList.remove('flipped');
        selectedCard = null;
    }
}

// استخدام تلميح
function useHint() {
    if (totalPoints < hintCost) {
        showToast(`ليس لديك نقاط كافية. تحتاج إلى ${hintCost} نقاط`);
        return;
    }
    
    if (!selectedCard) {
        showToast('الرجاء النقر على إحدى بطاقات اللغز أولاً');
        return;
    }
    
    // خصم تكلفة التلميح
    totalPoints -= hintCost;
    const transaction = db.transaction(['stats'], 'readwrite');
    const statsStore = transaction.objectStore('stats');
    statsStore.put({
        id: 'totalPoints',
        value: totalPoints
    });
    
    document.getElementById('total-points').textContent = totalPoints;
    updateProgress('total-progress', totalPoints, 69);
    
    // عرض التلميح
    const hintText = document.getElementById('hint-text');
    hintText.style.display = 'block';
    hintText.textContent = `البطاقة الصحيحة هي إحدى البطاقات الثلاث المتاحة. حاول التركيز على التفاصيل!`;
    
    playSound('click');
    showToast(`تم استخدام تلميح وخصم ${hintCost} نقاط`);
    
    // تحديث الإحصائيات
    updateProfileStats();
}

// إكمال المستوى
function completeLevel() {
    const transaction = db.transaction(['levels', 'stats', 'user'], 'readwrite');
    
    const levelsStore = transaction.objectStore('levels');
    
    // حفظ التقدم فقط للمستويات العادية
    if (gameMode === "normal") {
        levelsStore.put({
            id: currentLevel,
            completed: true,
            points: levelPoints
        });
    }
    
    totalPoints += levelPoints;
    const statsStore = transaction.objectStore('stats');
    statsStore.put({
        id: 'totalPoints',
        value: totalPoints
    });
    
    transaction.oncomplete = () => {
        // إيقاف المؤقت إذا كان نشطاً
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
        
        createConfetti();
        playSound('win');
        
        if (gameMode === "daily") {
            showMessage('تهانينا!', `${userName}، لقد أكملت التحدي اليومي بنجاح`, true);
            // فتح إنجاز التحدي اليومي
            unlockAchievement("daily_challenge");
        } else if (gameMode === "timed") {
            showMessage('تهانينا!', `${userName}، لقد أكملت تحدي الوقت المحدد بنجاح`, true);
            // التحقق من إنجاز السرعة إذا كان في وضع الوقت المحدد
            if (timeLeft >= 30) {
                unlockAchievement("speed_runner");
            }
        } else {
            showMessage('تهانينا!', `${userName}، لقد أكملت المستوى ${currentLevel} بنجاح`, true);
        }
        
        document.getElementById('total-points').textContent = totalPoints;
        updateProgress('total-progress', totalPoints, 69);
        
        // تحديث الإحصائيات
        updateProfileStats();
        
        if (currentLevel % 5 === 0 && gameMode === "normal") {
            showAchievement(`مبارك ${userName}! لقد وصلت إلى المستوى ${currentLevel}!`);
        }
    };
}

// فتح إنجاز
function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.earned) {
        const transaction = db.transaction(['achievements'], 'readwrite');
        const achievementsStore = transaction.objectStore('achievements');
        
        achievementsStore.get(achievementId).onsuccess = (event) => {
            const data = event.target.result;
            data.earned = true;
            achievementsStore.put(data);
            
            // تحديث القائمة المحلية
            const localAchievement = achievements.find(a => a.id === achievementId);
            if (localAchievement) {
                localAchievement.earned = true;
            }
            
            // عرض إشعار الإنجاز
            showAchievement(`تهانينا! لقد حصلت على إنجاز: ${data.title}`);
            
            // إعادة تحميل الإنجازات
            loadAchievements();
        };
    }
}

// عرض رسالة
function showMessage(title, text, isLevelComplete = false) {
    const message = document.getElementById('message');
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');
    const messageBtn = document.getElementById('message-btn');
    
    if (!message || !messageTitle || !messageText || !messageBtn) return;
    
    messageTitle.textContent = title;
    messageText.textContent = text;
    message.classList.add('show');
    
    messageBtn.onclick = () => {
        message.classList.remove('show');
        
        if (isLevelComplete) {
            showScreen('levels-screen');
            loadLevels();
        }
    };
}

// عرض إشعار تقدم
function showAchievement(text) {
    if (!notificationsEnabled) return;
    
    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    badge.innerHTML = `<i class="fas fa-trophy"></i> <span>${text}</span>`;
    
    document.body.appendChild(badge);
    
    setTimeout(() => {
        badge.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        badge.classList.remove('show');
        setTimeout(() => {
            badge.remove();
        }, 500);
    }, 3000);
}

// عرض إشعار toast
function showToast(message) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #6c5ce7, #fd79a8)",
        stopOnFocus: true
    }).showToast();
}

// تغيير الشاشة المعروضة
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNavItem = document.querySelector(`.nav-item[data-target="${screenId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // عند فتح شاشة الملف الشخصي، تأكد من تحديث الإحصائيات
    if (screenId === 'profile-screen') {
        updateProfileStats();
    }
}

// تغيير نمط اللعبة
function changeGameMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.mode-tab[data-mode="${mode}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // إعادة تحميل المستويات بناءً على النمط المختار
    loadLevels();
}

// تهيئة مستمعي الأحداث
function setupEventListeners() {
    // زر العودة
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            playSound('click');
            vibrate();
            showScreen('levels-screen');
        });
    }
    
    // عناصر التنقل
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            playSound('click');
            vibrate();
            
            const targetScreen = item.getAttribute('data-target');
            showScreen(targetScreen);
        });
    });
    
    // حفظ الملف الشخصي
    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const newName = document.getElementById('user-name').value;
            const newEmail = document.getElementById('user-email').value;
            
            if (newName.trim() === '') {
                showToast('الرجاء إدخال اسم مستخدم صحيح');
                return;
            }
            
            userName = newName;
            userEmail = newEmail;
            
            const transaction = db.transaction(['user'], 'readwrite');
            const userStore = transaction.objectStore('user');
            
            userStore.get('profile').onsuccess = (event) => {
                const userData = event.target.result;
                userData.name = userName;
                userData.email = userEmail;
                
                userStore.put(userData).onsuccess = () => {
                    document.getElementById('profile-name').textContent = userName;
                    showToast('تم حفظ التغييرات بنجاح');
                };
            };
        });
    }
    
    // إعدادات الصوت
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            soundEnabled = e.target.checked;
            const transaction = db.transaction(['settings'], 'readwrite');
            const settingsStore = transaction.objectStore('settings');
            settingsStore.put({ id: 'sound', value: soundEnabled });
            
            if (soundEnabled) playSound('click');
        });
    }
    
    // إعدادات الاهتزاز
    const vibrationToggle = document.getElementById('vibration-toggle');
    if (vibrationToggle) {
        vibrationToggle.addEventListener('change', (e) => {
            vibrationEnabled = e.target.checked;
            const transaction = db.transaction(['settings'], 'readwrite');
            const settingsStore = transaction.objectStore('settings');
            settingsStore.put({ id: 'vibration', value: vibrationEnabled });
            
            if (vibrationEnabled) vibrate();
        });
    }
    
    // إعدادات الإشعارات
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', (e) => {
            notificationsEnabled = e.target.checked;
            const transaction = db.transaction(['settings'], 'readwrite');
            const settingsStore = transaction.objectStore('settings');
            settingsStore.put({ id: 'notifications', value: notificationsEnabled });
        });
    }
    
    // خيارات الألوان
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            
            const newColor = option.getAttribute('data-color');
            document.documentElement.style.setProperty('--primary', newColor);
            document.documentElement.style.setProperty('--card-back', newColor);
            document.documentElement.style.setProperty('--gradient', `linear-gradient(120deg, ${newColor}, #fd79a8)`);
        });
    }
    
    // مشاركة التطبيق
    const shareAppBtn = document.getElementById('share-app');
    if (shareAppBtn) {
        shareAppBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'أبطال البطاقات',
                    text: 'جرب هذه اللعبة المثيرة للذكاء!',
                    url: window.location.href
                })
                .then(() => console.log('تم المشاركة بنجاح'))
                .catch((error) => console.log('خطأ في المشاركة:', error));
            } else {
                showToast('ميزة المشاركة غير مدعومة في متصفحك');
            }
        });
    }
    
    // إعادة الضبط
    const resetAppBtn = document.getElementById('reset-app');
    if (resetAppBtn) {
        resetAppBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من أنك تريد إعادة ضبط التطبيق؟ سيتم حذف جميع بياناتك.')) {
                indexedDB.deleteDatabase('CardGameDB');
                localStorage.clear();
                location.reload();
            }
        });
    }
    
    // زر التلميح
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            useHint();
        });
    }
    
    // أحداث أنماط اللعبة
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.getAttribute('data-mode');
            changeGameMode(mode);
        });
    });
    
    // منع التكبير/التصغير على الهواتف
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// دالة لخلط المصفوفة (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// دالة للاهتزاز
function vibrate(duration = 50) {
    if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// دالة لتشغيل الصوت
function playSound(type) {
    if (!soundEnabled) return;
    
    // يمكن إضافة أصوات حقيقية هنا
    switch(type) {
        case 'click':
            // صوت النقر
            break;
        case 'flip':
            // صوت قلب البطاقة
            break;
        case 'success':
            // صوت النجاح
            break;
        case 'error':
            // صوت الخطأ
            break;
        case 'win':
            // صوت الفوز
            break;
    }
}

// ============================================
//  GRAM SHIKSHA — APP LOGIC (v2.0)
// ============================================

// ---- DOM References ----
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
const menuClose = document.getElementById('menuClose');
const menuItems = document.querySelectorAll('.menu-item');
const allSections = document.querySelectorAll('.section');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');

// ---- Firebase Configuration ----
const firebaseConfig = {
  apiKey: "AIzaSyDRVT1vwckL5wMXStmqR6DiRz_rij-eoWw",
  authDomain: "social-engine-ai-be8d6.firebaseapp.com",
  projectId: "social-engine-ai-be8d6",
  storageBucket: "social-engine-ai-be8d6.firebasestorage.app",
  messagingSenderId: "473575726772",
  appId: "1:473575726772:web:3842203c76caba44ce01e1",
  measurementId: "G-XXV9P0KP6C"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ---- Theme State ----
let currentTheme = localStorage.getItem('theme') || 'dark';

// ---- Auth State ----
let currentAuthEmail = '';
let currentAuthMode = 'signup';
let currentUser = { full_name: 'Student', role: 'student', phone: '' };

// ---- Session State ----
let onlineUsers = [
    { name: 'Prof. Sharma', role: 'Mentor', status: 'Online', id: 'M-101' },
    { name: 'Dr. Patel', role: 'Mentor', status: 'Online', id: 'M-102' },
    { name: 'Rahul K.', role: 'Student', status: 'Online', id: 'S-501' },
    { name: 'Ananya S.', role: 'Student', status: 'Online', id: 'S-502' }
];

// ============================================
//  HAMBURGER MENU TOGGLE
// ============================================
hamburgerBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

function openMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('active');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
}

// ============================================
//  PASSWORD VISIBILITY TOGGLE
// ============================================
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
        btn.setAttribute('aria-label', 'Hide password');
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
        btn.setAttribute('aria-label', 'Show password');
    }
}

// ============================================
//  SECTION NAVIGATION
// ============================================
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-section');
        showSection(target);
        closeMenu();
    });
});

function showSection(name) {
    // Hide all sections
    allSections.forEach(s => s.classList.remove('active'));
    // Deactivate all menu items
    menuItems.forEach(m => m.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById('section-' + name);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Activate matching menu item
    const matchingItem = document.getElementById('nav-' + name);
    if (matchingItem) matchingItem.classList.add('active');

    // Trigger animations on specific sections
    if (name === 'progress') animateProgressBars();
}

// ============================================
//  SCHEDULE FILTER
// ============================================
function filterSchedule(day, btn) {
    // Update active tab
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('.schedule-card');
    cards.forEach(card => {
        if (day === 'week') {
            card.style.display = 'flex';
        } else {
            card.style.display = card.getAttribute('data-day') === day ? 'flex' : 'none';
        }
    });
}

// ============================================
//  HISTORY FILTER
// ============================================
function filterHistory(cat, btn) {
    document.querySelectorAll('.hfbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('.history-card');
    cards.forEach(card => {
        if (cat === 'all') {
            card.style.display = 'block';
        } else {
            card.style.display = card.getAttribute('data-cat') === cat ? 'block' : 'none';
        }
    });
}

// ============================================
//  STUDY MATERIAL SEARCH
// ============================================
function searchMaterials(query) {
    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.material-card');
    cards.forEach(card => {
        const searchData = card.getAttribute('data-search') || '';
        if (q === '' || searchData.includes(q)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
//  JOIN CLASS LOGIC
// ============================================
function joinClass(subject) {
    const preview = document.getElementById('classroomPreview');
    const title = document.getElementById('classroomTitle');
    const icon = subject === 'Mathematics' ? '📐'
        : subject === 'Computer Science' ? '💻'
            : subject === 'Biology' ? '🔬' : '📚';
    title.textContent = icon + ' ' + subject + ' — Live Session';
    preview.style.display = 'block';
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('✅ Joined ' + subject + ' class successfully!');
}

function joinByCode() {
    const code = document.getElementById('classCodeInput').value.trim();
    if (!code) {
        showToast('⚠️ Please enter a class code first!');
        return;
    }
    showToast('🔗 Joining class with code: ' + code + ' ...');
    setTimeout(() => {
        const preview = document.getElementById('classroomPreview');
        const title = document.getElementById('classroomTitle');
        title.textContent = '📚 Class ' + code + ' — Live Session';
        preview.style.display = 'block';
        preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        showToast('✅ Successfully joined class: ' + code);
    }, 1200);
}

function leaveClass() {
    const preview = document.getElementById('classroomPreview');
    preview.style.display = 'none';
    showToast('👋 You left the class session.');
}

// ============================================
//  PROGRESS BAR ANIMATION
// ============================================
function animateProgressBars() {
    const fills = document.querySelectorAll('.progress-fill');
    fills.forEach(fill => {
        const targetWidth = fill.style.getPropertyValue('--fill-width');
        fill.style.width = '0';
        requestAnimationFrame(() => {
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    });
}

// ============================================
//  AI TUTOR
// ============================================
const aiAnswers = {
    default: [
        "Great question! Based on your recent learning history, I'd recommend reviewing the core concepts from your last session first, then building up to this topic. Your progress data shows you excel when you connect new material to prior knowledge.",
        "This is a fascinating topic! Here's a simplified explanation tailored to your learning level: Start with the foundational principles, then explore the practical applications. Your quiz performance suggests you grasp concepts best with examples.",
        "Based on your AI session history, I can see you've been doing excellently in this area! Let me give you a detailed explanation. The key insight here is understanding why, not just what. Let's break it down step by step.",
        "I analyzed your study patterns and this is a topic worth deep-diving! The concept builds on what you learned in your previous sessions. Let me connect the dots for you with a clear, structured explanation.",
    ]
};

async function askAI() {
    const question = document.getElementById('aiQuestion').value.trim();
    if (!question) {
        showToast('🤖 Please type a question first!');
        return;
    }

    const responseDiv = document.getElementById('aiResponse');
    const responseContent = document.getElementById('aiResponseContent');

    // Show loading state
    if(responseDiv) responseDiv.style.display = 'block';
    if(responseContent) responseContent.innerHTML = '<div class="typing-placeholder">🤖 NEXORA AI is thinking...</div>';

    // Smooth scroll to response
    if(responseDiv) responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        // Use the same Gemini API as the chatbot widget
        const replyText = await generateGeminiResponse(
            SYSTEM_PROMPT + '\n\nStudent question: ' + question,
            false
        );

        // Render with simple markdown
        const formatted = replyText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        if(responseContent) responseContent.innerHTML =
            '<strong>🤖 NEXORA AI:</strong><br/><div style="margin-top:8px">' + formatted + '</div>';
        showToast('✅ Answer ready!');

    } catch (err) {
        if(responseContent) responseContent.innerHTML =
            '<strong>⚠️ Sorry!</strong> ' + err.message;
        showToast('❌ AI Error: ' + err.message);
    }

    const aiQInput = document.getElementById('aiQuestion');
    if (aiQInput) aiQInput.value = '';
}

// AI input — Enter key support
const aiQuestionEl = document.getElementById('aiQuestion');
if (aiQuestionEl) {
    aiQuestionEl.addEventListener('keydown', e => {
        if (e.key === 'Enter') askAI();
    });
}

// ============================================
//  TOAST NOTIFICATION
// ============================================
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
//  CLEANED AUTH LOGIC
// ============================================
function portalLogin(role) {
    showToast('🚀 Switching to ' + role.charAt(0).toUpperCase() + role.slice(1) + '...');

    setTimeout(() => {
        currentUser.role = role;
        // Don't modify name when portal testing, just role
        // Update menu user info
        const welcomeText = document.querySelector('.menu-user-info h3');
        if (welcomeText) welcomeText.textContent = 'Welcome, ' + currentUser.full_name + '!';

        applyRoleUI(role);
        showToast('✅ Switch successful!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
}

async function logout() {
    showToast('👋 Logging out...');
    try {
        await firebase.auth().signOut();
    } catch (e) {
        console.warn('Logout error:', e);
    }
    
    setTimeout(() => {
        currentUser = { full_name: 'Student', role: 'student', phone: '' };
        currentAuthEmail = '';

        const welcomeText = document.querySelector('.menu-user-info h3');
        if (welcomeText) welcomeText.textContent = 'Welcome, Student!';

        document.getElementById('loginWrapper').style.display = 'flex';
        showSection('home');
        applyRoleUI('student');
        closeMenu();

        showToast('✅ You have been logged out.');
    }, 800);
}

// Apply role-based UI changes
function applyRoleUI(role) {
    const mentorNavItems = document.querySelectorAll('.mentor-only-nav');
    const studentNavItems = document.querySelectorAll('.student-only-nav');
    const adminNavItems = document.querySelectorAll('.admin-only-nav');
    
    // Update sidebar name
    const menuUserInfo = document.querySelector('.menu-user-info h3');
    if (menuUserInfo) menuUserInfo.textContent = 'Welcome, ' + currentUser.full_name + '!';
    
    if (role === 'mentor') {
        mentorNavItems.forEach(el => el.style.display = 'block');
        studentNavItems.forEach(el => el.style.display = 'none');
        adminNavItems.forEach(el => el.style.display = 'none');
        initMentorDashboard();
        showSection('mentor');
        showToast('👨‍🏫 Welcome to your Mentor Dashboard — Gram Shiksha!');
    } else if (role === 'admin') {
        mentorNavItems.forEach(el => el.style.display = 'none');
        studentNavItems.forEach(el => el.style.display = 'none');
        adminNavItems.forEach(el => el.style.display = 'block');
        initAdminDashboard();
        showSection('admin-overview');
        showToast('👑 Welcome to Admin Dashboard — Gram Shiksha!');
    } else {
        mentorNavItems.forEach(el => el.style.display = 'none');
        studentNavItems.forEach(el => el.style.display = 'block');
        adminNavItems.forEach(el => el.style.display = 'none');
        showSection('home');
        showToast('🎓 Welcome to Gram Shiksha!');
    }
}

// ============================================
//  MENTOR DASHBOARD
// ============================================
let postedSessions = [];
let mentorMaterials = [];
let pendingPermissions = [
    { id: 1, name: 'Rahul K.', subject: 'Mathematics — Calculus', date: 'Oct 20', reason: 'Network dropped completely.' }
];

function initMentorDashboard() {
    // Set date label
    const dateLabel = document.getElementById('mentorDateLabel');
    if (dateLabel) {
        const now = new Date();
        dateLabel.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Set welcome subtitle using mentor name
    const sub = document.getElementById('mentorWelcomeSub');
    if (sub) sub.textContent = `Welcome back, ${currentUser.full_name}! Here is your daily summary.`;

    // Set default date on form
    const psDate = document.getElementById('ps-date');
    if (psDate) psDate.valueAsDate = new Date();

    // Auto-gen class code
    generateClassCode();

    // Render various sections
    renderMentorOnlineList();
    renderStudentActivity();
    renderPostedSessions();
    renderMentorMaterials();
    renderPermissions();
    updateSessionCount();
}

function generateClassCode() {
    const codeInput = document.getElementById('ps-code');
    if (!codeInput) return;
    const code = 'GS-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    codeInput.value = code;
    return code;
}

// Simulated Page Visibility API for auto-attendance
document.addEventListener('visibilitychange', () => {
    if (currentUser.role === 'student') {
        if (document.visibilityState === 'hidden') {
            // Student minimized or went to another tab during class
            inBackgroundAutoRemove();
        }
    }
});

function inBackgroundAutoRemove() {
    // Check if the student is currently in a live class view
    const preview = document.getElementById('classroomPreview');
    if (preview && preview.style.display !== 'none') {
        leaveClass();
        showToast('⚠️ You were removed from the live class for opening another app/tab.');
        // Broadcast this to other tabs (simulating server event)
        try {
            const bc = new BroadcastChannel('lowbandwidth_class');
            bc.postMessage({ type: 'STUDENT_ABSENT', name: currentUser.full_name });
            bc.close();
        } catch (e) {}
    }
}

// Listen for absent events (Mentor side)
try {
    const bc = new BroadcastChannel('lowbandwidth_class');
    bc.onmessage = (event) => {
        if (currentUser.role === 'mentor' && event.data.type === 'STUDENT_ABSENT') {
            showToast(`⚠️ Alert: ${event.data.name} was auto-removed (left tab/app).`);
            // Update attendance list dynamically if needed
        }
    };
} catch(e) {}

function postSession(e) {
    e.preventDefault();
    const subject = document.getElementById('ps-subject').value.trim();
    const desc = document.getElementById('ps-desc').value.trim();
    const date = document.getElementById('ps-date').value;
    const time = document.getElementById('ps-time').value;
    const duration = document.getElementById('ps-duration').value;
    const code = document.getElementById('ps-code').value || generateClassCode();

    if (!subject || !date || !time) {
        showToast('⚠️ Please fill in Subject, Date and Time!');
        return;
    }

    const session = {
        id: Date.now(),
        subject,
        desc: desc || 'No description provided.',
        date,
        time,
        duration,
        code,
        mentor: currentUser.full_name,
        status: 'scheduled'
    };

    postedSessions.unshift(session);
    renderPostedSessions();
    updateSessionCount();

    // Reset form
    document.getElementById('postSessionForm').reset();
    document.getElementById('ps-date').valueAsDate = new Date();
    generateClassCode();

    showToast('✅ Session "' + subject + '" posted successfully! Code: ' + code);
    
    // Schedule email for 5 minutes before class
    scheduleClassEmail(subject, date, time);
}

// EMAIL SCHEDULING (System Mock)
function scheduleClassEmail(subject, date, time) {
    const classTimeMs = new Date(date + 'T' + time).getTime();
    if(isNaN(classTimeMs)) return;
    
    // 5 minutes before
    const notifyTimeMs = classTimeMs - (5 * 60 * 1000);
    const delay = notifyTimeMs - Date.now();
    
    if (delay > 0 && delay < 24*60*60*1000) { // arbitrary limit so test doesn't bug out
        setTimeout(() => {
            console.log(`
[Simulated System Email to Enrolled Students]
Subject: 📚 Your Class Starts in 5 Minutes — Join Now!
Hello Student,
Your live class "${subject}" is starting in just 5 minutes!
Time: ${time}
Mentor: ${currentUser.full_name}
Date: ${date}

⚠️ Important Reminder:
- Do NOT switch tabs or background the app during class
- Doing so will mark you ABSENT automatically
            `);
            showToast(`📧 [Simulated Email] 5-min warning sent to all students for ${subject}`);
        }, delay);
    }
}

function renderPostedSessions() {
    const list = document.getElementById('postedSessionsList');
    if (!list) return;

    if (postedSessions.length === 0) {
        list.innerHTML = `<div class="no-sessions-placeholder"><span>🗓️</span><p>No sessions posted yet. Use the form above to schedule your first session!</p></div>`;
        return;
    }

    list.innerHTML = postedSessions.map(s => {
        const d = new Date(s.date + 'T' + s.time);
        const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        return `
        <div class="posted-session-item">
            <div class="psi-left">
                <div class="psi-icon">📡</div>
                <div class="psi-info">
                    <strong>${s.subject}</strong>
                    <span>${dateStr} at ${timeStr} • ${s.duration}</span>
                    <span class="psi-desc">${s.desc}</span>
                </div>
            </div>
            <div class="psi-right">
                <span class="psi-code">${s.code}</span>
                <button class="psi-delete" onclick="deleteSession(${s.id})" title="Remove">🗑️</button>
            </div>
        </div>`;
    }).join('');

    // Also populate today's classes on home
    const todayList = document.getElementById('homeTodayClassesList');
    if (todayList) {
        const todayStr = new Date().toISOString().split('T')[0];
        const todaySessions = postedSessions.filter(s => s.date === todayStr);
        if (todaySessions.length === 0) {
            todayList.innerHTML = `<div class="no-sessions-placeholder"><span>👍</span><p>No classes scheduled for today.</p></div>`;
        } else {
            todayList.innerHTML = todaySessions.map(s => `
                <div class="posted-session-item" style="padding:0.5rem; background:rgba(124,58,237,0.05); border:1px solid rgba(124,58,237,0.1)">
                    <div class="psi-info">
                        <strong>${s.subject}</strong>
                        <span>Today at ${s.time} • ${s.duration}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

function deleteSession(id) {
    postedSessions = postedSessions.filter(s => s.id !== id);
    renderPostedSessions();
    updateSessionCount();
    showToast('🗑️ Session removed.');
}

function updateSessionCount() {
    const el = document.getElementById('msc-sessions');
    if (el) el.textContent = postedSessions.length;
}

function addStudyMaterial(e) {
    e.preventDefault();
    const title = document.getElementById('mat-title').value.trim();
    const type = document.getElementById('mat-type').value;
    const tag = document.getElementById('mat-tag').value.trim();
    const link = document.getElementById('mat-link').value.trim();

    if (!title || !link) {
        showToast('⚠️ Please fill in Title and Link!');
        return;
    }

    mentorMaterials.unshift({ id: Date.now(), title, type, link, tag });
    renderMentorMaterials();

    // Reset form
    document.getElementById('addMaterialForm').reset();
    showToast('📚 Material "' + title + '" added successfully!');
}

function createMaterialCard(title, type, link, tag) {
    const card = document.createElement('div');
    const color = type === 'PDF' ? '#7c3aed' : type === 'Video' ? '#ec4899' : type === 'Code' ? '#0ea5e9' : '#f59e0b';
    const icon = type === 'PDF' ? '📄' : type === 'Video' ? '🎬' : type === 'Code' ? '💻' : '🖼️';
    
    card.className = 'material-card';
    card.style.setProperty('--mc-color', color);
    card.setAttribute('data-search', `${title} ${type} ${tag}`.toLowerCase());
    
    // Check if it's chunked video download simulator
    let btnHtml = `<button class="btn-download" onclick="window.open('${link}', '_blank')">🔗 Open</button>`;
    if (type === 'Video') {
        btnHtml = `<button class="btn-download" onclick="downloadChunkedVideo('${title}')">⬇ Offline Save</button>`;
    }

    card.innerHTML = `
        <div class="mc-type-badge">${type}</div>
        <div class="mc-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${tag ? tag : 'Manually Added'} • Resources</p>
        <div class="mc-footer">
            <span>External Link</span>
            ${btnHtml}
        </div>
    `;
    return card;
}

function renderMentorMaterials() {
    const list = document.getElementById('mentorMaterialsList');
    if (!list) return;

    if (mentorMaterials.length === 0) {
        list.innerHTML = `<div class="no-sessions-placeholder"><span>📚</span><p>No materials uploaded yet.</p></div>`;
        return;
    }

    list.innerHTML = mentorMaterials.map(m => `
        <div class="posted-session-item">
            <div class="psi-left">
                <div class="psi-icon">${m.type === 'PDF' ? '📄' : m.type === 'Video' ? '🎬' : '💻'}</div>
                <div class="psi-info">
                    <strong>${m.title}</strong>
                    <span>Type: ${m.type} • Tag: ${m.tag || 'None'}</span>
                </div>
            </div>
            <div class="psi-right">
                <button class="btn-small" onclick="window.open('${m.link}')">View</button>
                <button class="psi-delete" onclick="deleteMaterial(${m.id})" title="Remove">🗑️</button>
            </div>
        </div>
    `).join('');
}

function deleteMaterial(id) {
    mentorMaterials = mentorMaterials.filter(m => m.id !== id);
    renderMentorMaterials();
    showToast('🗑️ Material removed.');
}

// Simulated chunked download for weak networks
async function downloadChunkedVideo(title) {
    showToast(`⏳ Simulating chunked download for "${title}" over a weak network...`);
    let progress = 0;
    
    const fillSim = document.createElement('div');
    fillSim.style.position = 'fixed';
    fillSim.style.bottom = '20px';
    fillSim.style.right = '20px';
    fillSim.style.background = 'white';
    fillSim.style.padding = '1rem';
    fillSim.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    fillSim.style.borderRadius = '12px';
    fillSim.style.zIndex = '9999';
    fillSim.style.color = '#1e293b';
    
    document.body.appendChild(fillSim);

    const checkNetwork = () => {
        const conn = navigator.connection;
        if (conn && (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')) {
            return 800; // slower chunks
        }
        return 300; // faster chunks
    };

    while(progress < 100) {
        progress += Math.floor(Math.random() * 15) + 5;
        if(progress > 100) progress = 100;
        
        fillSim.innerHTML = `<strong>Downloading "${title}"</strong><br/>
            <div style="background:#e2e8f0; height:8px; border-radius:4px; margin-top:8px; width:200px">
                <div style="background:var(--purple); height:100%; border-radius:4px; width:${progress}%"></div>
            </div>
            <div style="font-size:0.8rem; margin-top:4px; color:#64748b">${progress}% completed</div>
        `;
        
        await new Promise(r => setTimeout(r, checkNetwork()));
    }

    setTimeout(() => {
        fillSim.remove();
        showToast(`✅ "${title}" is saved for offline viewing!`);
    }, 1000);
}

// Student online list for mentor view
const mockStudents = [
    { name: 'Rahul K.', subject: 'Mathematics', avatar: 'R', status: 'Studying', time: '2m ago' },
    { name: 'Ananya S.', subject: 'Physics', avatar: 'A', status: 'In Class', time: '5m ago' },
    { name: 'Priya M.', subject: 'Chemistry', avatar: 'P', status: 'Studying', time: '1m ago' },
    { name: 'Dev R.', subject: 'CS — Python', avatar: 'D', status: 'Online', time: 'Just now' },
    { name: 'Kavya L.', subject: 'Biology', avatar: 'K', status: 'Studying', time: '8m ago' },
];

const mockActivity = [
    { name: 'Rahul K.', action: 'joined your Mathematics session', time: '2 minutes ago', icon: '🎓' },
    { name: 'Ananya S.', action: 'completed Physics quiz (Score: 92%)', time: '15 minutes ago', icon: '✅' },
    { name: 'Dev R.', action: 'downloaded Python Starter Pack', time: '32 minutes ago', icon: '⬇️' },
    { name: 'Priya M.', action: 'asked AI Tutor about organic compounds', time: '1 hour ago', icon: '🤖' },
    { name: 'Kavya L.', action: 'attended Biology — Cell Division class', time: '2 hours ago', icon: '🔬' },
    { name: 'Sanjay T.', action: 'missed your last session', time: '3 hours ago', icon: '❌' },
];

function renderMentorOnlineList() {
    const list = document.getElementById('mentorOnlineList');
    if (!list) return;
    const badge = document.getElementById('onlineCountBadge');
    if (badge) badge.textContent = mockStudents.length + ' online';

    list.innerHTML = mockStudents.map(s => `
        <div class="mentor-online-item">
            <div class="moi-avatar">${s.avatar}</div>
            <div class="moi-info">
                <strong>${s.name}</strong>
                <span>${s.subject}</span>
            </div>
            <div class="moi-status">
                <span class="moi-dot"></span>
                <span class="moi-status-text">${s.status}</span>
                <span class="moi-time">${s.time}</span>
            </div>
        </div>
    `).join('');
}

function renderStudentActivity() {
    const list = document.getElementById('studentActivityList');
    if (!list) return;
    list.innerHTML = mockActivity.map(a => `
        <div class="sal-item">
            <div class="sal-icon">${a.icon}</div>
            <div class="sal-info">
                <strong>${a.name}</strong> <span>${a.action}</span>
                <div class="sal-time">${a.time}</div>
            </div>
        </div>
    `).join('');
}

let activeLiveClass = null;
let localStream = null;
let currentLiveSession = null;
let isVideoMuted = false;
let isAudioMuted = false;
let sessionTimer = null;
let sessionSeconds = 0;

async function startLiveClass() {
    const subject = document.getElementById('liveSubject').value.trim();
    if (!subject) {
        showToast('⚠️ Please enter a subject name!');
        return;
    }
    
    // Test media access first with clear error
    try {
        const testStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        testStream.getTracks().forEach(t => t.stop()); // release test stream
    } catch(e) {
        alert('❌ Camera and Mic access is required to start the class.\n\nPlease allow access in your browser settings and try again.');
        return;
    }
    
    await startWebRTC(subject, 'mentor');
}

// Global WebRTC Handler
async function startWebRTC(subject, perspective) {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch(err) {
        if (perspective === 'mentor') {
            alert('❌ Camera and Mic access is required to start the class.\n\nPlease allow access in your browser settings.');
            return;
        } else {
            showToast('⚠️ Camera/Mic denied. Joining in listen-only mode.');
            showToast('ℹ️ Mentor notified: ' + currentUser.full_name + ' joined without camera/mic.');
            localStream = null;
        }
    }
    
    // UI updates
    const overlay = document.getElementById('liveRoomOverlay');
    overlay.style.display = 'flex';
    setTimeout(()=> overlay.classList.add('active'), 50);
    document.getElementById('lrRoomTitle').textContent = subject;
    
    const selfVideo = document.getElementById('lrLocalVideo');
    if (localStream && selfVideo) {
        selfVideo.srcObject = localStream;
        document.getElementById('lrSelfViewBox').classList.remove('hidden');
    } else {
        document.getElementById('lrSelfViewBox').classList.add('hidden');
    }

    // Populate main view
    const mainView = document.getElementById('lrMainContent');
    if (perspective === 'student') {
        const networkBad = Math.random() > 0.8; // 20% chance to simulate low bandwidth
        if (networkBad) {
            showToast('⚠️ Weak connection detected. Switched to audio-only mode.');
            mainView.innerHTML = `
                <div style="width:100%; height:100%; border-radius:16px; background:#111; display:flex; flex-direction:column; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.05); color:#fff">
                    <div style="font-size:3rem">🔊</div>
                    <p style="margin-top:1rem; opacity:0.7">Mentor's audio is active. Video paused for bandwidth saving.</p>
                </div>
            `;
        } else {
            // Mock video feed of mentor
            mainView.innerHTML = `
                <video class="lr-mentor-video" autoplay muted loop playsinline>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                    Your browser does not support HTML video.
                </video>
            `;
        }
    } else {
        // Mentor side grid
        mainView.innerHTML = `<div class="lr-student-grid" id="lrStudentGrid"></div>`;
        const grid = document.getElementById('lrStudentGrid');
        mockStudents.slice(0, 6).forEach(s => { // mock first 6 students
            grid.innerHTML += `
                <div class="student-video-tile" id="tile-${s.name.replace(/\s/g,'')}">
                    <div class="placeholder">${s.name.charAt(0)}</div>
                    <div class="svt-name">${s.name}</div>
                    <div class="svt-controls">
                        <button class="svt-btn" onclick="showToast('🎤 Muted ${s.name}')">Mute</button>
                        <button class="svt-btn" onclick="removeStudentFromSession('${s.name}')" style="background:var(--rose)">Remove</button>
                    </div>
                </div>
            `;
        });
        
        // Broadcast global update conceptually
        const statusDiv = document.getElementById('liveClassStatus');
        if(statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.innerHTML = `
                <div class="live-status-inner">
                    <span class="live-status-dot"></span>
                    <strong>🔴 LIVE:</strong> ${subject} 
                </div>`;
            document.getElementById('liveSubject').value = '';
        }
        
        // Mock Auto-attendance array
        activeLiveClass = {
            subject: subject,
            startTime: Date.now(),
            attendance: mockStudents.slice(0, 6).map(s => ({ name: s.name, status: 'Present' }))
        };
    }

    document.getElementById('lrMicBtn').classList.remove('off');
    document.getElementById('lrCamBtn').classList.remove('off');
    isVideoMuted = false;
    isAudioMuted = false;
    currentLiveSession = { subject: subject, perspective: perspective };
    sessionSeconds = 0;
    
    if(sessionTimer) clearInterval(sessionTimer);
    sessionTimer = setInterval(() => {
        sessionSeconds++;
        const m = Math.floor(sessionSeconds / 60).toString().padStart(2, '0');
        const s = (sessionSeconds % 60).toString().padStart(2, '0');
        const timerObj = document.getElementById('lrTimerDisplay');
        if(timerObj) timerObj.textContent = `${m}:${s}`;
    }, 1000);
}

function removeStudentFromSession(name) {
    const tile = document.getElementById('tile-' + name.replace(/\s/g,''));
    if(tile) tile.remove();
    showToast(`Removed ${name} from session`);
}

function toggleLRCam() {
    if(!localStream) return;
    isVideoMuted = !isVideoMuted;
    localStream.getVideoTracks().forEach(track => track.enabled = !isVideoMuted);
    document.getElementById('lrCamBtn').classList.toggle('off', isVideoMuted);
}

function toggleLRMic() {
    if(!localStream) return;
    isAudioMuted = !isAudioMuted;
    localStream.getAudioTracks().forEach(track => track.enabled = !isAudioMuted);
    document.getElementById('lrMicBtn').classList.toggle('off', isAudioMuted);
}

function leaveLiveRoom() {
    const overlay = document.getElementById('liveRoomOverlay');
    overlay.classList.remove('active');
    setTimeout(() => overlay.style.display = 'none', 300);
    
    if(localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    if(sessionTimer) {
        clearInterval(sessionTimer);
    }
    
    if (currentLiveSession && currentLiveSession.perspective === 'mentor') {
        const statusDiv = document.getElementById('liveClassStatus');
        if(statusDiv) statusDiv.style.display = 'none';
        showToast('⏹️ Live Session Ended for Everyone. Attendance Saved.');
        if (typeof renderAttendanceRecords === 'function') renderAttendanceRecords();
    } else {
        showToast('🚪 Left Live Session.');
    }
    currentLiveSession = null;
    activeLiveClass = null;
}

// Attendance List logic
function renderAttendanceRecords() {
    const tbody = document.getElementById('attendanceRecordsBody');
    if (!tbody) return;

    // Simulate appending the last record to the table
    if (activeLiveClass) {
        const row = document.createElement('tr');
        const presentCount = activeLiveClass.attendance.filter(a => a.status === 'Present').length;
        const absentCount = 45 - presentCount; // Math mock
        
        row.innerHTML = `
            <td>${new Date(activeLiveClass.startTime).toISOString().split('T')[0]}</td>
            <td>${activeLiveClass.subject}</td>
            <td>45</td>
            <td>${presentCount}</td>
            <td>${absentCount}</td>
            <td>
                <span class="status-badge status-present" style="cursor:pointer" onclick="showToast('Viewing details...')">View</span>
            </td>
        `;
        tbody.prepend(row);
    }
}

// Export attendance CSV
function exportAttendance() {
    // Simulated CSV generation
    let csvContent = "data:text/csv;charset=utf-8,Date,Subject,Total Students,Present,Absent\n";
    csvContent += "2023-11-01,Mathematics - Calculus,45,40,5\n"; // Mock row
    
    // Download logic
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('📊 Attendance exported successfully.');
}

// Permissions logic
function renderPermissions() {
    const listStr = ['homePendingPermissionsList', 'permissionsRequestList'];
    
    listStr.forEach(id => {
        const list = document.getElementById(id);
        if (!list) return;

        if (pendingPermissions.length === 0) {
            list.innerHTML = `<div class="no-sessions-placeholder"><span>✅</span><p>No pending requests.</p></div>`;
            return;
        }

        list.innerHTML = pendingPermissions.map(p => `
            <div class="permission-card" id="perm-${p.id}">
                <div class="pc-info">
                    <h4>${p.name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.7">(${p.date})</span></h4>
                    <div style="font-size:0.85rem"><strong>Subject:</strong> ${p.subject}</div>
                    <div style="font-size:0.85rem; color:#f59e0b; margin-top:4px;"><strong>Reason:</strong> ${p.reason}</div>
                </div>
                <div class="pc-actions">
                    <button class="btn-small btn-success" onclick="approvePermission(${p.id})">Approve</button>
                    <button class="btn-small btn-danger" onclick="rejectPermission(${p.id})">Reject</button>
                </div>
            </div>
        `).join('');
    });

    // Update count in header if it exists
    const mscPerms = document.getElementById('msc-permissions');
    if (mscPerms) mscPerms.textContent = pendingPermissions.length;
}

function approvePermission(id) {
    pendingPermissions = pendingPermissions.filter(p => p.id !== id);
    renderPermissions();
    showToast('✅ Permission request approved. Student has been notified.');
}

function rejectPermission(id) {
    pendingPermissions = pendingPermissions.filter(p => p.id !== id);
    renderPermissions();
    showToast('❌ Permission request rejected. Using AI to suggest rescheduled times...');
    
    // Simulate AI scheduling logic
    setTimeout(() => {
        showToast('🤖 AI: Suggested weekend catch-up session for the student.');
    }, 2000);
}

let onlinePollInterval;
function startOnlineUsersPolling() {
    updateOnlineUsersUI();
    // Use local mock if backend fails
    // onlinePollInterval = setInterval(updateOnlineUsersUI, 5000);
}

async function updateOnlineUsersUI() {
    const list = document.getElementById('onlineUsersList');
    if (!list) return;

    // Use mock data since we're removing authentication/backend requirement
    list.innerHTML = onlineUsers.map(user => `
        <div class="online-user-card">
            <div class="user-avatar-small">${user.name.charAt(0)}</div>
            <div class="user-details">
                <strong>${user.name}</strong>
                <span>${user.role}</span>
            </div>
            <span class="status-indicator"></span>
        </div>
    `).join('');
}

// ============================================
//  THEME TOGGLE
// ============================================
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme();
    });
}

function applyTheme() {
    localStorage.setItem('theme', currentTheme);
    const ttIcon = themeToggle ? themeToggle.querySelector('.tt-icon') : null;

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        // Show moon icon: click to go back to dark
        if (ttIcon) ttIcon.textContent = '🌙';
    } else {
        document.body.classList.remove('light-mode');
        // Show sun icon: click to switch to light
        if (ttIcon) ttIcon.textContent = '☀️';
    }
}

// ============================================
//  AUTHENTICATION & APP FLOW
// ============================================
let isSignupMode = false;

function toggleSignupMode() {
    isSignupMode = !isSignupMode;
    document.getElementById('authTitle').textContent = isSignupMode ? 'Create Account' : 'Welcome Back';
    document.getElementById('authSubtitle').textContent = isSignupMode ? 'Sign up to get started' : 'Sign in to continue';
    const nameField = document.getElementById('fbName');
    if(nameField) {
        nameField.style.display = isSignupMode ? 'block' : 'none';
        if(isSignupMode) nameField.setAttribute('required', 'true');
        else nameField.removeAttribute('required');
    }
    document.getElementById('authSubmitBtn').textContent = isSignupMode ? 'Sign Up' : 'Sign In';
    document.getElementById('authToggleText').innerHTML = isSignupMode ? 
        'Already have an account? <a href="javascript:void(0)" onclick="toggleSignupMode()" style="color:var(--purple); font-weight:bold;">Sign In</a>' :
        'New mentor/student? <a href="javascript:void(0)" onclick="toggleSignupMode()" style="color:var(--purple); font-weight:bold;">Sign Up</a>';
    document.getElementById('authErrorMsg').textContent = '';
}

async function handleFirebaseAuth(e) {
    e.preventDefault();
    const tos = document.getElementById('tosCheckbox').checked;
    if(!tos) {
        document.getElementById('authErrorMsg').textContent = 'You must accept the terms of condition to continue.';
        return;
    }

    const email = document.getElementById('fbEmail').value;
    const password = document.getElementById('fbPassword').value;
    const errorDiv = document.getElementById('authErrorMsg');
    const submitBtn = document.getElementById('authSubmitBtn');
    
    errorDiv.textContent = '';
    submitBtn.textContent = 'Please wait...';
    submitBtn.disabled = true;

    try {
        if (isSignupMode) {
            const name = document.getElementById('fbName').value;
            const res = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const emailLower = email.toLowerCase();
            const mentorEmails = ['mentor1@lowbandwidth.in', 'mentor2@lowbandwidth.in'];
            let role = 'student';
            if (emailLower === 'admin@lowbandwidth.in') role = 'admin';
            else if (mentorEmails.includes(emailLower)) role = 'mentor';
            
            try {
                await db.collection('users').doc(res.user.uid).set({
                    full_name: name,
                    email: email,
                    role: role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (fsErr) {
                console.warn("Firestore save failed (likely permissions block), but auth succeeded:", fsErr);
            }
            // Auto login will trigger onAuthStateChanged
        } else {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            // Auto login will trigger onAuthStateChanged
        }
    } catch(err) {
        errorDiv.textContent = err.message;
        submitBtn.textContent = isSignupMode ? 'Sign Up' : 'Sign In';
        submitBtn.disabled = false;
    }
}

function logout() {
    firebase.auth().signOut().then(() => {
        location.reload();
    }).catch((error) => {
        showToast("Error logging out.");
    });
}

function finalizeLogin() {
    // Update welcome text in side menu
    const welcomeText = document.querySelector('.menu-user-info h3');
    if (welcomeText) welcomeText.textContent = 'Welcome, ' + currentUser.full_name + '!';

    document.getElementById('loginWrapper').style.display = 'none';

    setTimeout(() => {
        // Show main app
        if (navbar) navbar.style.display = 'flex';
        const mainContent = document.getElementById('mainContent');
        if (mainContent) mainContent.style.display = 'block';
        const chatbotFab = document.getElementById('chatbotFab');
        if (chatbotFab) chatbotFab.style.display = 'flex';

        // Init app
        startOnlineUsersPolling();
        
        // Ensure initChatbot exists before calling
        if (typeof initChatbot === 'function') {
            initChatbot();
        }
        
        applyRoleUI(currentUser.role);

        showToast('✅ Welcome, ' + currentUser.full_name + '! Happy learning 🚀');
    }, 100);
}

// ============================================
//  INIT — Splash → App
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();

    // Hide main app elements initially
    if (navbar) navbar.style.display = 'none';
    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.style.display = 'none';
    const chatbotFab = document.getElementById('chatbotFab');
    if (chatbotFab) chatbotFab.style.display = 'none';

    // Handle splash screen
    const splashScreen = document.getElementById('splashScreen');
    
    if (splashScreen) {
        splashScreen.style.display = 'flex';
        
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
                initFirebaseLoginCheck();
            }, 500);
        }, 2000); // 2 second splash
    } else {
        initFirebaseLoginCheck();
    }

    function initFirebaseLoginCheck() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    currentUser.email = user.email;
                    const emailLower = user.email.toLowerCase();
                    const mentorEmails = ['mentor1@lowbandwidth.in', 'mentor2@lowbandwidth.in'];
                    
                    // Base fallback roles
                    if (emailLower === 'admin@lowbandwidth.in') {
                        currentUser.role = 'admin';
                        currentUser.full_name = 'Administrator';
                    } else if (mentorEmails.includes(emailLower)) {
                        currentUser.role = 'mentor';
                        currentUser.full_name = 'Mentor';
                    } else {
                        currentUser.role = 'student';
                        currentUser.full_name = 'Student';
                    }

                    // Attempt to enrich with Firestore data
                    try {
                        const doc = await db.collection('users').doc(user.uid).get();
                        if(doc.exists) {
                            currentUser.full_name = doc.data().full_name || currentUser.full_name;
                            currentUser.role = doc.data().role || currentUser.role;
                        }
                    } catch (fsErr) {
                        console.warn("Could not read user profile from Firestore:", fsErr);
                    }
                    
                    // tracking
                    try {
                        await db.collection('logins').add({
                            uid: user.uid,
                            email: user.email,
                            role: currentUser.role,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    } catch (fsErr) {
                        console.warn("Could not write login log to Firestore:", fsErr);
                    }
                    
                    finalizeLogin();
                } catch(e) {
                    console.error("Critical error in login pipeline:", e);
                    document.getElementById('loginWrapper').style.display = 'flex';
                }
            } else {
                document.getElementById('loginWrapper').style.display = 'flex';
            }
        });
    }

    // Intersection Observer for progress bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.progress-fill');
                fills.forEach(fill => {
                    const tw = fill.style.getPropertyValue('--fill-width');
                    fill.style.width = tw;
                });
            }
        });
    }, { threshold: 0.3 });

    const progressSection = document.getElementById('section-progress');
    if (progressSection) observer.observe(progressSection);
});

// ============================================
//  AI CHATBOT (NEXORA AI) — Google Gemini API
// ============================================
const SYSTEM_PROMPT = `You are NEXORA AI, a friendly and knowledgeable AI study assistant
for Gram Shiksha — an online learning platform specifically designed for rural students
in India with limited internet connectivity.
Help with academic questions across all subjects (Maths, Physics, Chemistry, Biology,
Computer Science, English, etc.), explain concepts clearly, provide step-by-step solutions,
and motivate learners. Keep answers concise, structured, and encouraging.
Use simple language and relatable examples from everyday Indian life.

IMPORTANT IDENTITY RULES (always follow these, no exceptions):
- Your name is NEXORA AI.
- You were developed and created by VIGNESH.
- The Gram Shiksha website was also designed and developed by VIGNESH.
- Whenever anyone asks "who made you?", "who built you?", "who developed this AI?",
  "who created this website?", "who is your developer?", or any similar question,
  you must proudly answer: "I was developed by VIGNESH! 🚀"
  and "This Gram Shiksha website was also built by VIGNESH."
- Never say you were made by OpenAI, Google, Pollinations, or any other company.
  You are NEXORA AI, created by VIGNESH for Gram Shiksha.`;

let chatHistory = []; // { role: 'user'|'assistant', content: string }
let chatbotOpen = false;
let chatbotInitialized = false;

function initChatbot() {
    if (chatbotInitialized) return;
    chatbotInitialized = true;
    addBotMessage('👋 Hi! I\'m **NEXORA AI**, your personal study assistant for **Gram Shiksha**, built by VIGNESH. Ask me anything — Maths, Physics, Coding, or any subject!\n\nTry a quick question below, or tap one of the suggestion chips 👇');
}

function toggleChatbot() {
    const panel = document.getElementById('chatbotPanel');
    const fab = document.getElementById('chatbotFab');
    const iconOpen = fab.querySelector('.fab-icon-open');
    const iconClose = fab.querySelector('.fab-icon-close');
    chatbotOpen = !chatbotOpen;
    if (chatbotOpen) {
        panel.classList.add('open');
        iconOpen.style.display = 'none';
        iconClose.style.display = 'inline';
        // Focus textarea
        setTimeout(() => document.getElementById('chatbotInput').focus(), 350);
    } else {
        panel.classList.remove('open');
        iconOpen.style.display = 'inline';
        iconClose.style.display = 'none';
    }
}

function getTimestamp() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Render a bot message (supports **bold** markdown)
function addBotMessage(text) {
    const messages = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = 'chat-msg bot-msg';

    // Simple markdown: **text** → <strong>text</strong>, \n → <br>
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    div.innerHTML = `
      <div class="chat-msg-avatar">🤖</div>
      <div>
        <div class="chat-bubble">${formatted}</div>
        <span class="chat-time">${getTimestamp()}</span>
      </div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
    const messages = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = 'chat-msg user-msg';
    div.innerHTML = `
      <div class="chat-msg-avatar">🧑</div>
      <div>
        <div class="chat-bubble">${escapeHtml(text)}</div>
        <span class="chat-time">${getTimestamp()}</span>
      </div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showTyping() {
    document.getElementById('typingIndicator').style.display = 'flex';
    const msgs = document.getElementById('chatbotMessages');
    msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() {
    document.getElementById('typingIndicator').style.display = 'none';
}

const GEMINI_API_KEY = "AIzaSyCgl2fpR3_UQj4KNPyFJC_VME2x1uZX9hw";

// Models to try in order (fallback chain — confirmed available for this API key)
const GEMINI_MODELS = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash'
];

async function generateGeminiResponse(payload, isHistoryArray = false) {
    let contents = payload;
    if (!isHistoryArray) {
        contents = [{ role: 'user', parts: [{ text: payload }] }];
    }

    const requestBody = { contents };

    // Try each model in fallback order
    for (const model of GEMINI_MODELS) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.status === 404) {
                // Model not found, try next
                continue;
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = errData?.error?.message || `HTTP ${response.status}`;
                
                if (response.status === 429) {
                    throw new Error('Rate limit reached. Please wait a moment and try again.');
                }
                if (response.status === 400) {
                    throw new Error('Bad request: ' + errMsg);
                }
                if (response.status === 403) {
                    throw new Error('API key invalid or quota exceeded. Please check the key.');
                }
                throw new Error('API error ' + response.status + ': ' + errMsg);
            }

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('Empty response from AI.');
            return text.trim();

        } catch (err) {
            if (model === GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
                // Last model — rethrow
                throw err;
            }
            // Otherwise try next model
            console.warn(`Model ${model} failed, trying next...`, err.message);
        }
    }

    throw new Error('All AI models unavailable. Please try again later.');
}

async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSendBtn');
    const text = input.value.trim();
    if (!text) return;

    // Hide chips after first message
    document.getElementById('chatbotChips').style.display = 'none';

    // Add to UI
    addUserMessage(text);
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    // Save to history
    chatHistory.push({ role: 'user', content: text });

    // Show typing
    showTyping();

    try {
        let geminiHistory = [];
        geminiHistory.push({
            role: 'user',
            parts: [{ text: "SYSTEM PROMPT: " + SYSTEM_PROMPT }]
        });
        geminiHistory.push({
            role: 'model',
            parts: [{ text: "Understood. I will strictly adhere to these instructions." }]
        });
        
        chatHistory.slice(-10).forEach(msg => {
            geminiHistory.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        });

        const replyText = await generateGeminiResponse(geminiHistory, true);

        hideTyping();
        addBotMessage(replyText);
        chatHistory.push({ role: 'assistant', content: replyText });

    } catch (err) {
        hideTyping();
        addBotMessage('⚠️ Sorry, I had trouble connecting. Please check your internet connection and try again.\n\n(Error: ' + err.message + ')');
        // Remove failed user message from history
        chatHistory.pop();
    }

    sendBtn.disabled = false;
    document.getElementById('chatbotMessages').scrollTop = 9999;
}

function sendChip(btn) {
    const question = btn.textContent.replace(/^[^\w]+/, '').trim(); // strip leading emoji
    const input = document.getElementById('chatbotInput');
    input.value = btn.textContent;
    sendChatMessage();
}

function clearChat() {
    chatHistory = [];
    document.getElementById('chatbotMessages').innerHTML = '';
    document.getElementById('chatbotChips').style.display = 'flex';
    addBotMessage('🗑️ Chat cleared! I\'m ready for your next question. What would you like to learn today?');
}

function chatKeyDown(e) {
    // Send on Enter (not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
}

function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ============================================
//  VOICE ASSISTANCE — WEB SPEECH API
//  Works entirely in-browser. No API key.
// ============================================

let voiceOutputEnabled = true;
let isListening = false;
let recognition = null;

/* ---- Voice Output (Text-to-Speech) ---- */
function speakText(text) {
    if (!voiceOutputEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const clean = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/\n+/g, '. ')
        .trim();

    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 0.95;
    utter.pitch = 1.05;
    utter.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferred) utter.voice = preferred;

    const avatar = document.querySelector('.chatbot-avatar');
    utter.onstart = () => { if (avatar) avatar.classList.add('speaking'); };
    utter.onend = () => { if (avatar) avatar.classList.remove('speaking'); };
    utter.onerror = () => { if (avatar) avatar.classList.remove('speaking'); };

    window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const avatar = document.querySelector('.chatbot-avatar');
    if (avatar) avatar.classList.remove('speaking');
}

function toggleVoiceOutput() {
    voiceOutputEnabled = !voiceOutputEnabled;
    const btn = document.getElementById('voiceToggleBtn');
    if (btn) {
        btn.textContent = voiceOutputEnabled ? '🔊' : '🔇';
        btn.setAttribute('aria-pressed', String(voiceOutputEnabled));
        btn.classList.toggle('muted', !voiceOutputEnabled);
        btn.title = voiceOutputEnabled ? 'Voice output ON - click to mute' : 'Voice output OFF - click to enable';
    }
    if (!voiceOutputEnabled) stopSpeaking();
    showVoiceHint(voiceOutputEnabled ? '🔊 Voice output enabled' : '🔇 Voice output muted');
}

/* ---- Voice Input (Speech-to-Text) ---- */
function initSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;

    const input = document.getElementById('chatbotInput');

    rec.onstart = () => {
        isListening = true;
        document.getElementById('chatbotMicBtn')?.classList.add('listening');
        document.getElementById('listeningLabel')?.classList.add('active');
        announceToScreenReader('Listening. Please speak your question now.');
    };

    rec.onresult = (e) => {
        let interim = '', final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
        }
        if (input) input.value = final || interim;
    };

    rec.onend = () => {
        isListening = false;
        document.getElementById('chatbotMicBtn')?.classList.remove('listening');
        document.getElementById('listeningLabel')?.classList.remove('active');
        const text = input?.value?.trim();
        if (text) setTimeout(() => sendChatMessage(), 300);
        else announceToScreenReader('No speech detected. Please try again.');
    };

    rec.onerror = (e) => {
        isListening = false;
        document.getElementById('chatbotMicBtn')?.classList.remove('listening');
        document.getElementById('listeningLabel')?.classList.remove('active');
        const msgs = {
            'no-speech': '🎤 No speech detected. Please try again.',
            'not-allowed': '🚫 Microphone permission denied. Please allow mic access.',
            'network': '🌐 Network error. Check your connection.',
        };
        const msg = msgs[e.error] || ('🎤 Voice error: ' + e.error);
        showToast(msg);
        announceToScreenReader(msg);
    };

    return rec;
}

function toggleVoiceInput() {
    if (!chatbotOpen) toggleChatbot();

    if (isListening) {
        if (recognition) recognition.stop();
        return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        const msg = 'Speech recognition is not supported. Please use Google Chrome or Microsoft Edge.';
        showToast('🚫 ' + msg);
        announceToScreenReader(msg);
        return;
    }

    recognition = initSpeechRecognition();
    if (recognition) {
        try { recognition.start(); }
        catch (err) { showToast('🎤 Could not start microphone: ' + err.message); }
    }
}

/* ---- ARIA Screen Reader Announcements ---- */
function announceToScreenReader(message) {
    const live = document.getElementById('ariaLiveRegion');
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = message; }, 50);
}

/* ---- Patch addBotMessage to speak + announce ---- */
const _origAddBotMessage = addBotMessage;
addBotMessage = function (text) {
    _origAddBotMessage(text);
    speakText(text);
    const plain = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n/g, ' ');
    announceToScreenReader('NEXORA AI says: ' + plain);
};

/* ---- Global Shortcut: Ctrl+Shift+V ---- */
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        if (!chatbotOpen) toggleChatbot();
        setTimeout(() => toggleVoiceInput(), 400);
        showVoiceHint('🎤 Voice activated — speak your question!');
    }
    if (e.key === 'Escape') stopSpeaking();
});

/* ---- Voice Hint Toast ---- */
let hintTimeout;
function showVoiceHint(msg) {
    let hint = document.getElementById('voiceHintToast');
    if (!hint) {
        hint = document.createElement('div');
        hint.id = 'voiceHintToast';
        hint.className = 'voice-hint-toast';
        document.body.appendChild(hint);
    }
    hint.textContent = msg;
    hint.classList.add('show');
    clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => hint.classList.remove('show'), 3000);
}

/* ---- First-load shortcut hint ---- */
window.addEventListener('load', () => {
    setTimeout(() => {
        showVoiceHint('\u267f Press Ctrl+Shift+V to activate voice assistant');
    }, 3000);
});

// ============================================
//  ADMIN DASHBOARD
// ============================================

const adminMockUsers = [
    { name: 'Kavya L.', role: 'student', status: 'Online', lastLogin: 'Today, 09:15 AM' },
    { name: 'Prof. Sharma', role: 'mentor', status: 'Offline', lastLogin: 'Yesterday, 14:30 PM' },
    { name: 'Rahul K.', role: 'student', status: 'Online', lastLogin: 'Today, 09:00 AM' },
    { name: 'Dr. Patel', role: 'mentor', status: 'Online', lastLogin: 'Today, 08:45 AM' },
    { name: 'Ananya S.', role: 'student', status: 'Online', lastLogin: 'Today, 10:10 AM' }
];

const adminAuthLogs = [
    { time: '10:15 AM', user: 'Kavya L.', role: 'student', ip: '192.168.1.104', status: 'success' },
    { time: '09:42 AM', user: 'Unknown', role: '-', ip: '45.22.109.11', status: 'failed' },
    { time: '09:41 AM', user: 'Unknown', role: '-', ip: '45.22.109.11', status: 'failed' },
    { time: '09:00 AM', user: 'Rahul K.', role: 'student', ip: '10.0.0.52', status: 'success' },
    { time: '08:45 AM', user: 'Dr. Patel', role: 'mentor', ip: '192.168.1.200', status: 'success' }
];

const adminGlobalActivity = [
    { time: '10:12 AM', user: 'Kavya L.', role: 'student', action: 'Requested access to recorded session "Biology — Cell Division".', icon: '📩' },
    { time: '10:05 AM', user: 'NEXORA AI', role: 'system', action: 'Auto-rescheduled physics class due to connectivity drop for 15+ students.', icon: '🤖' },
    { time: '09:50 AM', user: 'Prof. Sharma', role: 'mentor', action: 'Uploaded new PDF material "Linear Algebra Notes".', icon: '📤' },
    { time: '09:30 AM', user: 'Rahul K.', role: 'student', action: 'Submitted assignment "Math Chapter 4".', icon: '📝' },
    { time: '09:00 AM', user: 'Dr. Patel', role: 'mentor', action: 'Started Live Session "Physics — Wave Optics".', icon: '🔴' }
];

function initAdminDashboard() {
    // Fetch real data from Firebase
    fetchAdminRealStats();
    fetchAdminRealUsers();
    fetchAdminRealAuth();
    renderAdminActivity();
    
    // Auto-refresh auth logs every 30 seconds
    if(window._adminAuthRefresh) clearInterval(window._adminAuthRefresh);
    window._adminAuthRefresh = setInterval(() => {
        fetchAdminRealAuth();
    }, 30000);
}

// Fetch real platform stats from Firestore
async function fetchAdminRealStats() {
    try {
        const usersSnap = await db.collection('users').get();
        let mentorCount = 0, studentCount = 0;
        usersSnap.forEach(doc => {
            const r = doc.data().role;
            if(r === 'mentor') mentorCount++;
            else if(r === 'student') studentCount++;
        });
        const totalEl = document.getElementById('adminTotalUsers');
        if(totalEl) totalEl.textContent = usersSnap.size;
        
        // Materials count
        const matsSnap = await db.collection('materials').get();
        const matEl = document.getElementById('adminStudyMaterials');
        if(matEl) matEl.textContent = matsSnap.size || '—';
        
        // Sessions / classes this week
        const sessSnap = await db.collection('sessions').get();
        const weekEl = document.getElementById('adminClassesWeek');
        if(weekEl) weekEl.textContent = sessSnap.size || '—';
        
        const activeEl = document.getElementById('adminActiveSessions');
        if(activeEl) activeEl.textContent = '0'; // Would need socket.io for real realtime
        
    } catch(e) {
        console.warn('Admin stats: using fallback.', e);
        // Keep existing placeholder values on error
    }
}

// Fetch real users from Firestore
async function fetchAdminRealUsers() {
    const list = document.getElementById('adminUsersList');
    if(!list) return;
    
    try {
        const snap = await db.collection('users').get();
        if(snap.empty) {
            renderAdminUsers(''); // fallback to mock
            return;
        }
        
        const rows = [];
        snap.forEach(doc => {
            const u = doc.data();
            const roleColor = u.role === 'mentor' ? 'color:#ec4899;font-weight:600' : u.role === 'admin' ? 'color:#f59e0b;font-weight:600' : 'color:#0ea5e9;font-weight:600';
            const stClass = 'status-badge status-present';
            rows.push(`
            <tr>
                <td>${u.full_name || 'Unknown'}</td>
                <td style="${roleColor}">${(u.role || 'student').charAt(0).toUpperCase() + (u.role || 'student').slice(1)}</td>
                <td>${u.email || '—'}</td>
                <td><span class="${stClass}">Registered</span></td>
                <td style="color:#64748b; font-size:0.9rem">${u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('en-IN') : '—'}</td>
            </tr>`);
        });
        list.innerHTML = rows.join('');
        
        // Update thead with email column if needed
        const thead = document.querySelector('#adminUsersTable thead tr');
        if(thead && thead.children.length < 5) {
            const emailTh = document.createElement('th');
            emailTh.textContent = 'Email';
            thead.insertBefore(emailTh, thead.children[2]);
        }
        
    } catch(e) {
        console.warn('Admin users: using fallback.', e);
        renderAdminUsers(''); // fallback to mock data
    }
}

// Fetch real auth logs from Firestore
async function fetchAdminRealAuth() {
    const list = document.getElementById('adminAuthLogs');
    if(!list) return;
    
    try {
        const snap = await db.collection('logins').orderBy('timestamp', 'desc').limit(20).get();
        if(snap.empty) {
            renderAdminAuthLogs(); // fallback to mock
            return;
        }
        
        const activeList = document.getElementById('adminActiveSessionsList');
        const rows = [];
        const activeRows = [];
        const now = Date.now();
        
        snap.forEach(doc => {
            const l = doc.data();
            const ts = l.timestamp ? new Date(l.timestamp.seconds * 1000) : new Date();
            const timeStr = ts.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
            const msSince = now - ts.getTime();
            const isActive = msSince < 30 * 60 * 1000; // within 30 min
            
            rows.push(`
            <div class="sal-item">
                <div class="sal-icon">✅</div>
                <div class="sal-info">
                    <strong>${l.email || l.uid}</strong>
                    <div><span style="color:#10b981">Success</span> • ${l.role || 'user'}</div>
                    <div class="sal-time">${timeStr}${isActive ? ' 🟢 Active' : ''}</div>
                </div>
            </div>`);
            
            if(isActive) {
                const avatar = (l.email || 'U').charAt(0).toUpperCase();
                activeRows.push(`
                <div class="mentor-online-item">
                    <div class="moi-avatar">${avatar}</div>
                    <div class="moi-info">
                        <strong>${l.email || l.uid}</strong>
                        <span style="text-transform:capitalize">${l.role || 'user'}</span>
                    </div>
                    <div class="moi-status">
                        <span class="moi-dot"></span>
                        <span class="moi-time">${timeStr}</span>
                    </div>
                </div>`);
            }
        });
        
        list.innerHTML = rows.join('');
        if(activeList) activeList.innerHTML = activeRows.join('') || '<span class="text-muted">No active sessions in last 30 minutes.</span>';
        
        // Suspicious: find IPs with multiple failures (simulated check)
        const suspEl = document.getElementById('adminSuspiciousActivity');
        if(suspEl) {
            suspEl.innerHTML = '<span class="text-muted" style="font-size:0.85rem">Monitoring for suspicious patterns...</span>';
        }
        
    } catch(e) {
        console.warn('Admin auth: using fallback.', e);
        renderAdminAuthLogs(); // fallback to mock data
    }
}

function renderAdminUsers(filterQuery) {
    const list = document.getElementById('adminUsersList');
    if (!list) return;

    let filtered = adminMockUsers;
    if (filterQuery) {
        const q = filterQuery.toLowerCase();
        filtered = adminMockUsers.filter(u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
    }

    list.innerHTML = filtered.map(u => {
        const roleStr = u.role.charAt(0).toUpperCase() + u.role.slice(1);
        const roleColor = u.role === 'mentor' ? 'color:#ec4899;font-weight:600;' : 'color:#0ea5e9;font-weight:600;';
        const stClass = u.status === 'Online' ? 'status-present' : 'status-absent';
        return `
        <tr>
            <td>${u.name}</td>
            <td style="${roleColor}">${roleStr}</td>
            <td><span class="status-badge ${stClass}">${u.status}</span></td>
            <td style="color:#64748b; font-size:0.9rem">${u.lastLogin}</td>
        </tr>
        `;
    }).join('');
}

function filterAdminUsers(q) {
    renderAdminUsers(q);
}

function renderAdminAuthLogs() {
    const list = document.getElementById('adminAuthLogs');
    if (!list) return;

    list.innerHTML = adminAuthLogs.map(l => {
        const icon = l.status === 'success' ? '✅' : '❌';
        const stText = l.status === 'success' ? '<span style="color:#10b981">Success</span>' : '<span style="color:#ef4444">Failed</span>';
        return `
        <div class="sal-item">
            <div class="sal-icon">${icon}</div>
            <div class="sal-info">
                <strong>${l.user}</strong> <span style="font-size:0.8rem;color:#64748b">(${l.ip})</span>
                <div>${stText} • ${l.role}</div>
                <div class="sal-time">${l.time}</div>
            </div>
        </div>
        `;
    }).join('');

    const suspicious = document.getElementById('adminSuspiciousActivity');
    if (suspicious) {
        const failedLogs = adminAuthLogs.filter(l => l.status === 'failed');
        if (failedLogs.length > 0) {
            suspicious.innerHTML = `
            <div class="sal-item" style="border-left:3px solid #f43f5e; padding-left:0.5rem">
                <div class="sal-info">
                    <strong style="color:#f43f5e">Multiple Failed Attempts</strong>
                    <div style="font-size:0.85rem">IP: ${failedLogs[0].ip} tried ${failedLogs.length} times to login.</div>
                </div>
            </div>`;
        } else {
            suspicious.innerHTML = `<span class="text-muted" style="font-size:0.85rem">No suspicious activity detected.</span>`;
        }
    }
}

function renderAdminActiveSessions() {
    const list = document.getElementById('adminActiveSessionsList');
    if (!list) return;
    const active = adminMockUsers.filter(u => u.status === 'Online');
    list.innerHTML = active.map(u => {
        const avatar = u.name.charAt(0);
        return `
        <div class="mentor-online-item">
            <div class="moi-avatar">${avatar}</div>
            <div class="moi-info">
                <strong>${u.name}</strong>
                <span style="text-transform:capitalize">${u.role}</span>
            </div>
        </div>`;
    }).join('');
}

function renderAdminActivity() {
    const list = document.getElementById('adminGlobalActivityLog');
    if (!list) return;

    const filterVal = document.getElementById('adminActivityFilter').value;
    let filtered = adminGlobalActivity;

    if (filterVal !== 'all') {
        filtered = adminGlobalActivity.filter(a => a.role === filterVal);
    }

    if (filtered.length === 0) {
        list.innerHTML = `<span class="text-muted">No activities found for this filter.</span>`;
        return;
    }

    list.innerHTML = filtered.map(a => `
        <div class="sal-item">
            <div class="sal-icon">${a.icon}</div>
            <div class="sal-info">
                <strong>${a.user}</strong> <span style="font-size:0.8rem;text-transform:capitalize;color:var(--purple)">[${a.role}]</span>
                <div>${a.action}</div>
                <div class="sal-time">${a.time}</div>
            </div>
        </div>
    `).join('');
}

function filterAdminActivity() {
    renderAdminActivity();
}

// ============================================
//  MENTOR AI RESCHEDULING SIMULATION
// ============================================

function simulateAIDrop() {
    showToast('📡 Simulating network drop for multiple students...');
    setTimeout(() => {
        // Dedicated AI Reschedule section
        const suggCard = document.getElementById('aiRescheduleSuggestionCard');
        const statusCard = document.getElementById('aiRescheduleStatusCard');
        if (suggCard) {
            suggCard.style.display = 'block';
            if(statusCard) statusCard.style.display = 'none';
        }
        // Also show inline card on Live Sessions page
        const prompt = document.getElementById('aiReschedulePrompt');
        if (prompt) prompt.style.display = 'block';
        showToast('⚠️ AI detected high drop rate! Check AI Reschedule section.');
    }, 1500);
}

function acceptAIReschedule() {
    // Hide suggestion cards in both old and new sections
    const prompt = document.getElementById('aiReschedulePrompt');
    if (prompt) prompt.style.display = 'none';
    const suggCard = document.getElementById('aiRescheduleSuggestionCard');
    if (suggCard) {
        suggCard.style.display = 'none';
        const statusCard = document.getElementById('aiRescheduleStatusCard');
        if(statusCard) statusCard.style.display = 'block';
    }
    
    // Auto add to schedule
    const newSession = {
        id: Date.now(),
        subject: 'Rescheduled Class',
        desc: 'Class moved due to poor connectivity.',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '10:00',
        duration: '1 hour',
        code: generateClassCode(),
        mentor: currentUser.full_name,
        status: 'scheduled'
    };
    postedSessions.unshift(newSession);
    renderPostedSessions();
    updateSessionCount();
    
    // Log to admin activity
    adminGlobalActivity.unshift({
        time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
        user: 'NEXORA AI',
        role: 'system',
        action: `Auto-rescheduled class to tomorrow at 10:00 AM due to connectivity drop.`,
        icon: '🤖'
    });
    
    showToast('✅ Rescheduled! All students have been notified of the new time.');
}

function dismissAIReschedule() {
    const prompt = document.getElementById('aiReschedulePrompt');
    if (prompt) prompt.style.display = 'none';
    const suggCard = document.getElementById('aiRescheduleSuggestionCard');
    if (suggCard) {
        suggCard.style.display = 'none';
        const statusCard = document.getElementById('aiRescheduleStatusCard');
        if(statusCard) statusCard.style.display = 'block';
    }
    showToast('❌ Reschedule suggestion dismissed.');
}

// ============================================
//  NEW FEATURE FUNCTIONS — GRAM SHIKSHA v2.0
// ============================================

// ---------- MENTOR: POST ASSIGNMENT ----------
let postedAssignments = [];

function postAssignment(e) {
    e.preventDefault();
    const title = document.getElementById('asgn-title').value.trim();
    const desc = document.getElementById('asgn-desc').value.trim();
    const subject = document.getElementById('asgn-subject').value;
    const batch = document.getElementById('asgn-batch').value;
    const due = document.getElementById('asgn-due').value;
    const fileInput = document.getElementById('asgn-file');
    const fileName = fileInput.files[0] ? fileInput.files[0].name : null;
    
    if (!title || !desc || !subject || !due) {
        showToast('⚠️ Please fill all required fields!');
        return;
    }
    
    const assignment = {
        id: Date.now(),
        title,
        desc,
        subject,
        batch,
        due,
        fileName,
        mentorName: currentUser.full_name,
        postedAt: new Date().toISOString(),
        submissions: []
    };
    
    postedAssignments.unshift(assignment);
    
    // Save to Firestore (with error fallback)
    db.collection('assignments').add({
        ...assignment,
        mentorId: firebase.auth().currentUser?.uid || 'unknown'
    }).catch(e => console.warn('Assignment save to Firestore failed (ok for demo):', e));
    
    renderMentorAssignments();
    document.getElementById('postAssignmentForm').reset();
    showToast('📝 Assignment "' + title + '" posted! ✅ Students will be notified.');
    
    // Log to admin activity
    adminGlobalActivity.unshift({
        time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
        user: currentUser.full_name,
        role: 'mentor',
        action: `Posted new assignment: "${title}" due ${new Date(due).toLocaleDateString('en-IN')}`,
        icon: '📝'
    });
}

function renderMentorAssignments() {
    const list = document.getElementById('mentorAssignmentsList');
    if (!list) return;
    
    if (postedAssignments.length === 0) {
        list.innerHTML = '<div class="no-sessions-placeholder"><span>📝</span><p>No assignments posted yet.</p></div>';
        return;
    }
    
    list.innerHTML = postedAssignments.map(a => {
        const dueDate = new Date(a.due);
        const isPast = dueDate < new Date();
        const dueDateStr = dueDate.toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'});
        return `
        <div class="posted-session-item">
            <div class="psi-left">
                <div class="psi-icon">📝</div>
                <div class="psi-info">
                    <strong>${a.title}</strong>
                    <span>${a.subject} • ${a.batch === 'all' ? 'All Students' : a.batch}</span>
                    <span style="color:${isPast ? '#f43f5e' : '#10b981'}">📅 Due: ${dueDateStr}${isPast ? ' ⚠️ PAST DUE' : ''}</span>
                    <span class="psi-desc">${a.desc.substring(0, 60)}...</span>
                </div>
            </div>
            <div class="psi-right">
                <span style="font-size:0.8rem; color:#64748b">${a.submissions.length} submitted</span>
                <button class="psi-delete" onclick="deleteAssignment(${a.id})" title="Delete">🗑️</button>
            </div>
        </div>`;
    }).join('');
}

function deleteAssignment(id) {
    postedAssignments = postedAssignments.filter(a => a.id !== id);
    renderMentorAssignments();
    showToast('🗑️ Assignment removed.');
}

// ---------- STUDENT: SUBMIT ASSIGNMENT ----------
const assignmentFiles = {};

function handleAssignmentFile(input, assignId) {
    const file = input.files[0];
    if (file) {
        assignmentFiles[assignId] = file;
        const nameEl = document.getElementById('assign-file-name-' + assignId);
        if(nameEl) nameEl.textContent = '📎 ' + file.name;
    }
}

function submitAssignment(assignId, title) {
    const textAnswer = document.getElementById('assign-text-' + assignId);
    const textVal = textAnswer ? textAnswer.value.trim() : '';
    const file = assignmentFiles[assignId];
    
    if (!textVal && !file) {
        showToast('⚠️ Please type an answer or upload a file!');
        return;
    }
    
    // Mark as submitted in UI
    const salItem = textAnswer ? textAnswer.closest('.sal-item') : null;
    if (salItem) {
        const submitArea = salItem.querySelector('div[style*="rgba(255,255,255,0.03)"]');
        if (submitArea) {
            submitArea.innerHTML = `
                <div style="display:flex; align-items:center; gap:0.5rem; color:#10b981; font-weight:600">
                    ✅ Assignment Submitted Successfully!
                </div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.3rem">Submitted on ${new Date().toLocaleString('en-IN')}</div>
                ${file ? '<div style="font-size:0.8rem; margin-top:0.3rem">📤 File: ' + file.name + '</div>' : ''}
                ${textVal ? '<div style="font-size:0.8rem; margin-top:0.3rem; background:rgba(255,255,255,0.03); padding:0.5rem; border-radius:6px">' + textVal.substring(0, 100) + (textVal.length > 100 ? '...' : '') + '</div>' : ''}
            `;
        }
    }
    
    // Save to Firestore
    db.collection('submissions').add({
        assignmentId: assignId,
        title: title,
        studentId: firebase.auth().currentUser?.uid || 'demo',
        studentName: currentUser.full_name,
        textAnswer: textVal,
        fileName: file ? file.name : null,
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        isLate: false
    }).catch(e => console.warn('Submission save failed (ok for demo):', e));
    
    showToast('📝 Assignment submitted successfully! ✅');
    
    // Notify mentor (UI only)
    adminGlobalActivity.unshift({
        time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
        user: currentUser.full_name,
        role: 'student',
        action: `Submitted assignment: "${title}"`,
        icon: '📝'
    });
}

// ---------- STUDENT: HISTORY & RECORDINGS ----------
function filterHistorySection(val) {
    const cards = document.querySelectorAll('.history-session-card');
    cards.forEach(card => {
        if (val === 'all') {
            card.style.display = 'block';
        } else {
            card.style.display = card.getAttribute('data-status') === val ? 'block' : 'none';
        }
    });
}

function downloadRecording(sessionKey) {
    showToast('📥 Downloading recording...');
    downloadChunkedVideo('GramShiksha_' + sessionKey + '.mp4');
}

function requestRecordingAccess(sessionKey, requestId) {
    const reasonEl = document.getElementById('access-reason-' + requestId);
    const reason = reasonEl ? reasonEl.value.trim() : '';
    
    if (!reason) {
        showToast('⚠️ Please provide a reason for your absence!');
        return;
    }
    
    // Save to Firestore
    db.collection('recordingRequests').add({
        sessionKey,
        studentId: firebase.auth().currentUser?.uid || 'demo',
        studentName: currentUser.full_name,
        reason,
        status: 'pending',
        requestedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn('Request save failed (ok for demo):', e));
    
    const btn = event.target;
    if (btn) {
        btn.textContent = '✅ Request Sent!';
        btn.disabled = true;
        btn.style.opacity = '0.6';
    }
    if (reasonEl) reasonEl.disabled = true;
    
    showToast('📨 Access request sent to mentor!');
    
    adminGlobalActivity.unshift({
        time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
        user: currentUser.full_name,
        role: 'student',
        action: `Requested recording access for session: ${sessionKey}. Reason: ${reason}`,
        icon: '📩'
    });
}

// ------ MENTOR: MANUAL AI NETWORK CHECK ------
function manualAINetworkCheck() {
    showToast('🔍 AI analyzing student network quality...');
    setTimeout(() => {
        const poorRate = Math.random();
        if (poorRate > 0.5) {
            const suggCard = document.getElementById('aiRescheduleSuggestionCard');
            const statusCard = document.getElementById('aiRescheduleStatusCard');
            if (suggCard) {
                const dayName = new Date(Date.now() + 86400000).toLocaleDateString('en-IN', {weekday:'long'});
                const alertEl = document.getElementById('aiDropAlertText');
                const suggEl = document.getElementById('aiSuggestionText');
                if(alertEl) alertEl.textContent = `Poor network detected for ${Math.floor(poorRate * 10)} students (>30%)`;
                if(suggEl) suggEl.textContent = `Suggested new time: ${dayName} at 10:00 AM. Historical data shows optimal connectivity at this slot.`;
                suggCard.style.display = 'block';
                if(statusCard) statusCard.style.display = 'none';
            }
            const oldPrompt = document.getElementById('aiReschedulePrompt');
            if (oldPrompt) oldPrompt.style.display = 'block';
            showToast('⚠️ Poor connectivity detected — AI suggestion ready!');
        } else {
            showToast('✅ AI check complete. All students have good connectivity!');
        }
    }, 2000);
}
//  STUDENT PANEL - LIVE CLASS FOCUS RULE
// ============================================

let absenceTimeout = null;
let absenceCountdownInt = null;

async function joinClass(subjectName) {
    showToast('Joining room...', false);
    await startWebRTC(subjectName, 'student');
}

// STRICT FOCUS RULE: Monitor page visibility
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentLiveSession && currentLiveSession.perspective === 'student') {
        const modal = document.getElementById('absenceWarningModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        let timeLeft = 5;
        document.getElementById('absenceCountdown').textContent = timeLeft;
        
        absenceCountdownInt = setInterval(() => {
            timeLeft--;
            document.getElementById('absenceCountdown').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(absenceCountdownInt);
            }
        }, 1000);
        
        absenceTimeout = setTimeout(() => {
            // Did not return in time
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
            leaveLiveRoom();
            showToast('⚠️ You were marked ABSENT and removed for leaving the class window.', true);
            
            // Notify Mentor (Mock Broadcast)
            try {
                const bc = new BroadcastChannel('lowbandwidth_class');
                bc.postMessage({ type: 'STUDENT_ABSENT', name: currentUser.full_name });
            } catch(e) {}
        }, 5000);
    }
});

function cancelAbsenceWarning() {
    clearTimeout(absenceTimeout);
    clearInterval(absenceCountdownInt);
    const modal = document.getElementById('absenceWarningModal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
    showToast('✅ Focus restored.');
}

// ============================================
//  STUDENT PANEL - AI DOUBT SOLVER
// ============================================

async function askAI() {
    const inputEl = document.getElementById('aiQuestion');
    const question = inputEl.value.trim();
    if (!question) return;
    
    // Clear input
    inputEl.value = '';
    
    // Append user question
    const historyDiv = document.getElementById('aiResponseContent');
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'background:rgba(124,58,237,0.1); border-left:3px solid #7c3aed; padding:10px; border-radius:4px; margin-bottom:15px; text-align:right';
    userMsg.innerHTML = `<STRONG>You:</STRONG> ${question}`;
    historyDiv.appendChild(userMsg);
    
    // Create loading for AI
    const aiMsg = document.createElement('div');
    aiMsg.style.cssText = 'background:rgba(255,255,255,0.05); border-left:3px solid #f59e0b; padding:10px; border-radius:4px; margin-bottom:15px; text-align:left';
    aiMsg.innerHTML = `<strong>NEXORA AI:</strong> <span class="loading-dots">Thinking...</span>`;
    historyDiv.appendChild(aiMsg);
    
    // Auto scroll down
    const container = document.getElementById('aiDoubtHistory');
    container.scrollTop = container.scrollHeight;
    
    try {
        const contextPrompt = `You are a helpful tutor named NEXORA AI for an Indian offline-capable platform. 
The student is asking: ${question}
Provide a clear, brief, educational answer.`;
        
        let answer = await generateGeminiResponse(contextPrompt);
        aiMsg.innerHTML = `<strong>NEXORA AI:</strong> ${answer.replace(/\n/g, '<br/>')}`;
    } catch (e) {
        aiMsg.innerHTML = `<strong>NEXORA AI:</strong> Here is the answer regarding "${question}". (AI Simulated Response for demo).`;
    }
    
    container.scrollTop = container.scrollHeight;
}


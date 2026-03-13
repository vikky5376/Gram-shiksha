// ============================================
//  GRAM SHIKSHA — APP LOGIC
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

// ---- Supabase Configuration ----
const SUPABASE_URL = 'https://lzhmpdoomhqzwcswaloa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UBwuulFe0DE_xSDy1OkrGA_K261vms3';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
    responseDiv.style.display = 'block';
    responseContent.innerHTML = '<div class="typing-placeholder">🤖 Nexora AI is thinking...</div>';

    // Smooth scroll to response
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: question }
        ];

        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages,
                model: 'openai',
                seed: Math.floor(Math.random() * 9999)
            })
        });

        if (!response.ok) throw new Error('API error ' + response.status);
        const replyText = await response.text();

        // Simple markdown: **text** -> <strong>text</strong>
        const formatted = replyText.trim()
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        responseContent.innerHTML = '<strong>🤖 Nexora AI Tutor:</strong><br/><div style="margin-top:8px">' + formatted + '</div>';
        showToast('✅ Solution generated!');

    } catch (err) {
        responseContent.innerHTML = '<strong>⚠️ Sorry!</strong> I had trouble connecting. Please check your internet connection.';
        showToast('❌ AI Error');
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
        await supabaseClient.auth.signOut();
    } catch (e) {
        console.error(e);
    }
    
    setTimeout(() => {
        currentUser = { full_name: 'Student', role: 'student', phone: '' };
        currentAuthEmail = '';

        const welcomeText = document.querySelector('.menu-user-info h3');
        if (welcomeText) welcomeText.textContent = 'Welcome, Student!';

        showSection('home');
        applyRoleUI('student');
        closeMenu();

        showToast('✅ You have been logged out.');
    }, 800);
}

// Apply role-based UI changes
function applyRoleUI(role) {
    const mentorNavItems = document.querySelectorAll('.mentor-only-nav');
    if (role === 'mentor') {
        mentorNavItems.forEach(el => el.style.display = 'block');
        initMentorDashboard();
        showSection('mentor');
        showToast('👨‍🏫 Welcome to your Mentor Dashboard!');
    } else {
        mentorNavItems.forEach(el => el.style.display = 'none');
        showSection('home');
    }
}

// ============================================
//  MENTOR DASHBOARD
// ============================================
let postedSessions = [];

function initMentorDashboard() {
    // Set date label
    const dateLabel = document.getElementById('mentorDateLabel');
    if (dateLabel) {
        const now = new Date();
        dateLabel.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Set welcome subtitle using mentor name
    const sub = document.getElementById('mentorWelcomeSub');
    if (sub) sub.textContent = `Welcome back, ${currentUser.full_name}! Manage your sessions & students.`;

    // Set default date on form
    const psDate = document.getElementById('ps-date');
    if (psDate) psDate.valueAsDate = new Date();

    // Auto-gen class code
    generateClassCode();

    // Render online list
    renderMentorOnlineList();

    // Render student activity
    renderStudentActivity();

    // Update sessions count
    updateSessionCount();
}

function generateClassCode() {
    const codeInput = document.getElementById('ps-code');
    if (!codeInput) return;
    const code = 'GS-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    codeInput.value = code;
    return code;
}

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
    const link = document.getElementById('mat-link').value.trim();

    if (!title || !link) {
        showToast('⚠️ Please fill in Title and Link!');
        return;
    }

    const grid = document.getElementById('materialsGrid');
    if (!grid) return;

    // Create a new material card
    const card = document.createElement('div');
    const color = type === 'PDF' ? '#7c3aed' : type === 'Video' ? '#ec4899' : '#0ea5e9';
    const icon = type === 'PDF' ? '📄' : type === 'Video' ? '🎬' : '💻';
    
    card.className = 'material-card';
    card.style.setProperty('--mc-color', color);
    card.setAttribute('data-search', `${title} ${type} notes`.toLowerCase());
    
    card.innerHTML = `
        <div class="mc-type-badge">${type}</div>
        <div class="mc-icon">${icon}</div>
        <h3>${title}</h3>
        <p>Manually Added • Resources</p>
        <div class="mc-footer">
            <span>External Link</span>
            <button class="btn-download" onclick="window.open('${link}', '_blank')">🔗 Open</button>
        </div>
    `;

    // Prepend to list
    grid.prepend(card);

    // Reset form
    document.getElementById('addMaterialForm').reset();
    showToast('📚 Material "' + title + '" added successfully!');
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

function startLiveClass() {
    const subject = document.getElementById('liveSubject').value.trim();
    if (!subject) {
        showToast('⚠️ Please enter a subject name!');
        return;
    }
    const statusDiv = document.getElementById('liveClassStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = `
        <div class="live-status-inner">
            <span class="live-status-dot"></span>
            <strong>🔴 LIVE:</strong> ${subject} — Session started! Students are being notified...
            <button class="live-end-btn" onclick="endLiveClass()">End Session</button>
        </div>`;
    showToast('🔴 Live class started: ' + subject + '!');
    document.getElementById('liveSubject').value = '';
}

function endLiveClass() {
    const statusDiv = document.getElementById('liveClassStatus');
    statusDiv.style.display = 'none';
    showToast('⏹️ Live class ended. Session recording saved.');
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
//  SPLASH → APP FLOW (Login Removed)
// ============================================

function finalizeLogin() {
    // Update welcome text in side menu
    const welcomeText = document.querySelector('.menu-user-info h3');
    if (welcomeText) welcomeText.textContent = 'Welcome, ' + currentUser.full_name + '!';

    document.body.classList.remove('login-active');

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
    }, 600);
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
                
                // Trigger auto-login if session exists, otherwise proceed as Guest/Student
                supabaseClient.auth.getSession().then(({ data: { session } }) => {
                    if (session && session.user) {
                        currentAuthEmail = session.user.email;
                        currentUser.full_name = session.user.user_metadata.full_name || 'Student';
                        currentUser.role = session.user.user_metadata.role || 'student';
                    }
                    finalizeLogin();
                }).catch(() => {
                    finalizeLogin(); // Fallback on error
                });
                
            }, 500);
        }, 2000); // 2 second splash
    } else {
        // Fallback if no splash
        finalizeLogin();
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
//  AI CHATBOT — Pollinations AI (Free, No Key)
// ============================================
const SYSTEM_PROMPT = `You are NEXORA AI, a friendly and knowledgeable AI assistant
for Gram Shiksha — a web application built for students and mentors.
Help with academic questions across all subjects (Maths, Physics, Chemistry, Biology,
Computer Science, English, etc.), explain concepts clearly, provide step-by-step solutions,
and motivate learners. Keep answers concise, structured, and encouraging.
Use simple language and examples.

IMPORTANT IDENTITY RULES (always follow these, no exceptions):
- Your name is NEXORA AI.
- You were developed and created by VIGNESH.
- The Gram Shiksha website was also designed and developed by VIGNESH.
- Whenever anyone asks "who made you?", "who built you?", "who developed this AI?",
  "who created this website?", "who is your developer?", or any similar question,
  you must proudly answer: "I was developed by VIGNESH! 🚀"
  and "This Gram Shiksha website was also built by VIGNESH."
- Never say you were made by OpenAI, Pollinations, or any other company.
  You are NEXORA AI, created by VIGNESH.`;

let chatHistory = []; // { role: 'user'|'assistant', content: string }
let chatbotOpen = false;
let chatbotInitialized = false;

function initChatbot() {
    if (chatbotInitialized) return;
    chatbotInitialized = true;
    addBotMessage('👋 Hi! I\'m **NEXORA AI**, your personal study assistant made by VIGNESH. Ask me anything — Maths, Physics, Coding, or any subject!\n\nTry a quick question below, or tap one of the suggestion chips 👇');
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
        // Build messages array for Pollinations
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory.slice(-10) // last 10 turns for context
        ];

        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages,
                model: 'openai',      // uses GPT-4o-mini free via Pollinations
                seed: Math.floor(Math.random() * 9999),
                jsonMode: false
            })
        });

        if (!response.ok) throw new Error('API error ' + response.status);
        const replyText = await response.text();

        hideTyping();
        addBotMessage(replyText.trim());
        chatHistory.push({ role: 'assistant', content: replyText.trim() });

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

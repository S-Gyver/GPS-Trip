// js/popup-login.js (ไฟล์ใหม่ หรือรวมใน navbar-auth.js ก็ได้)

import { getAuth, signInWithEmailAndPassword, signOut } 
    from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
    getFirestore, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getApp, getApps, initializeApp }
    from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyCiyuFX39075-97sD67KFjqPAjh29bx5wU",
  authDomain: "trip-sync-fd25b.firebaseapp.com",
  projectId: "trip-sync-fd25b",
  storageBucket: "trip-sync-fd25b.firebasestorage.app",
  messagingSenderId: "144965045120",
  appId: "1:144965045120:web:ec74d97d399b4279920f65"
};

// init
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =====================================================
// ⭐ 1) ฟัง event เมื่อ dropdown popup ถูกเปิด
// =====================================================
document.addEventListener("shown.bs.dropdown", (event) => {
    const dropdown = event.target;

    // ถ้าปุ่มที่เปิด popup เป็น login
    if (dropdown.matches("#login-btn-group")) {
        console.log("🔰 Popup login is opened");

        const loginForm = dropdown.querySelector("#login-form");

        if (loginForm) {
            loginForm.addEventListener("submit", handlePopupLogin);
        }
    }
});


// =====================================================
// ⭐ 2) ฟังก์ชัน login
// =====================================================
async function handlePopupLogin(e) {
    e.preventDefault();

    const email = document.querySelector("#login-email")?.value.trim();
    const password = document.querySelector("#login-password")?.value.trim();

    if (!email || !password) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    try {
        // Login
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        alert("เข้าสู่ระบบสำเร็จ");

        // ดึงชื่อจาก Firestore
        let displayName = user.email;
        try {
            const docRef = doc(db, "users", user.uid);
            const snap = await getDoc(docRef);
            if (snap.exists() && snap.data().firstname) {
                displayName = snap.data().firstname;
            }
        } catch {}

        updateNavbar(displayName);

        // ปิด popup
        const toggleBtn = document.querySelector("#login-btn-group > a");
        if (toggleBtn) {
            const dropdown = bootstrap.Dropdown.getInstance(toggleBtn)
                || new bootstrap.Dropdown(toggleBtn);
            dropdown.hide();
        }

    } catch (err) {
        
        console.error(err);
    }
}


// =====================================================
// ⭐ 3) เปลี่ยน navbar เป็นชื่อผู้ใช้
// =====================================================
function updateNavbar(name) {
    const btnGroup = document.querySelector("#login-btn-group");
    if (!btnGroup) return;

    btnGroup.innerHTML = `
        <a class="btn btn-white-pill px-4 fw-bold dropdown-toggle no-caret"
           href="#" role="button" data-bs-toggle="dropdown">
            👤 ${name}
        </a>

        <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">โปรไฟล์</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" id="logout-btn" href="#">ออกจากระบบ</a></li>
        </ul>
    `;

    // bind logout
    document.querySelector("#logout-btn").addEventListener("click", async () => {
        await signOut(auth);
        alert("ออกจากระบบแล้ว");
        location.href = "index.html";
    });
}

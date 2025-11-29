// js/navbar-auth.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ===== Firebase config ของเอย =====
const firebaseConfig = {
  apiKey: "AIzaSyCiyuFX39075-97sD67KFjqPAjh29bx5wU",
  authDomain: "trip-sync-fd25b.firebaseapp.com",
  projectId: "trip-sync-fd25b",
  storageBucket: "trip-sync-fd25b.firebasestorage.app",
  messagingSenderId: "144965045120",
  appId: "1:144965045120:web:ec74d97d399b4279920f65"
};

// ป้องกัน init ซ้ำ ถ้ามีไฟล์อื่น init ไปแล้ว
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- helper สำหรับเปลี่ยน navbar ตอน user ล็อกอิน ----------

function renderLoggedInNavbar(displayName) {
  const container = document.getElementById("login-btn-group");
  if (!container) return;

  container.innerHTML = `
    <a class="btn btn-white-pill px-4 fw-bold dropdown-toggle no-caret"
       href="#"
       role="button"
       data-bs-toggle="dropdown"
       aria-expanded="false">
       <i class="bi bi-person-circle me-1"></i> ${displayName}
    </a>

    <ul class="dropdown-menu dropdown-menu-end shadow-lg">
      <li><a class="dropdown-item" href="#">โปรไฟล์ของฉัน</a></li>
      <li><a class="dropdown-item" href="#">การตั้งค่า</a></li>
      <li><hr class="dropdown-divider"></li>
      <li>
        <a class="dropdown-item text-danger" href="#" data-logout="true">
          <i class="bi bi-box-arrow-right me-1"></i> ออกจากระบบ
        </a>
      </li>
    </ul>
  `;
}

// รอให้ navbar ถูกโหลดเข้า DOM (เพราะใช้ fetch component)
function waitAndRenderNavbar(displayName) {
  const tryRender = () => {
    const el = document.getElementById("login-btn-group");
    if (!el) {
      setTimeout(tryRender, 100);
      return;
    }
    renderLoggedInNavbar(displayName);
  };
  tryRender();
}

// ฟังสถานะ login ถ้า login อยู่ให้เปลี่ยน navbar
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // ----- ดึงชื่อจาก Firestore -----
    let displayName = user.email || "บัญชีของฉัน";

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.firstname && data.lastname) {
          displayName = `${data.firstname}`;
        } else if (data.firstname) {
          displayName = data.firstname;
        }
      }
    } catch (e) {
      console.warn("อ่านข้อมูลผู้ใช้จาก Firestore ไม่สำเร็จ", e);
      // ถ้า error ก็ปล่อยให้ใช้ email ต่อไป
    }

    waitAndRenderNavbar(displayName);
  } else {
    // ยังไม่ได้ล็อกอิน / logout แล้ว -> ใช้ popup เดิม
    const container = document.getElementById("login-btn-group");
    if (container) {
      container.innerHTML = `
        <a class="btn btn-white-pill px-4 fw-bold dropdown-toggle no-caret"
           href="#"
           role="button"
           data-bs-toggle="dropdown"
           aria-expanded="false"
           data-bs-auto-close="outside">
          <i class="bi bi-person-circle me-1"></i> เข้าสู่ระบบ
        </a>
      `;
    }
  }
});

// ---------- จัดการ submit ฟอร์ม login ใน popup ----------

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (form.id !== "login-form") return; // ไม่ใช่ฟอร์ม popup login ก็ข้าม

  // กันไม่ให้ไปชนกับหน้า login.html ที่มีฟอร์มชื่อเดียวกัน
  const isNavbarPopup = !!form.closest(".login-dropdown");
  if (!isNavbarPopup) return;

  event.preventDefault();

  const email = form.querySelector("#login-email")?.value.trim();
  const password = form.querySelector("#login-password")?.value;

  if (!email || !password) {
    alert("กรุณากรอกอีเมลและรหัสผ่าน");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("login success:", cred.user.uid);
    alert("เข้าสู่ระบบสำเร็จ");

    // onAuthStateChanged จะไปเปลี่ยน navbar ให้เอง
    // ถ้าอยากปิด dropdown ทันที:
    const toggleBtn = form.closest(".dropdown-menu")?.previousElementSibling;
    if (toggleBtn && window.bootstrap) {
      const dropdown = bootstrap.Dropdown.getInstance(toggleBtn) ||
                       new bootstrap.Dropdown(toggleBtn);
      dropdown.hide();
    }
  } catch (err) {
    console.error(err);
    
  }
});

// ---------- จัดการปุ่มออกจากระบบ ----------

document.addEventListener("click", async (event) => {
  const logoutLink = event.target.closest("[data-logout='true']");
  if (!logoutLink) return;

  event.preventDefault();

  try {
    await signOut(auth);
    alert("ออกจากระบบแล้ว");
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถออกจากระบบได้\n" + (err.code || err.message));
  }
});

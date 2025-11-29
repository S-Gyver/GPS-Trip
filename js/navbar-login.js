// js/navbar-login.js
// ใช้แบบ ES module

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// ใช้ config เดิมของเอย
const firebaseConfig = {
  apiKey: "AIzaSyCiyuFX39075-97sD67KFjqPAjh29bx5wU",
  authDomain: "trip-sync-fd25b.firebaseapp.com",
  projectId: "trip-sync-fd25b",
  storageBucket: "trip-sync-fd25b.firebasestorage.app",
  messagingSenderId: "144965045120",
  appId: "1:144965045120:web:ec74d97d399b4279920f65"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 💡 ใช้ event delegation เพราะ navbar ถูกโหลดทีหลัง
document.addEventListener("submit", async (event) => {
  const form = event.target;

  // ให้ทำงานเฉพาะฟอร์มที่เป็น popup login เท่านั้น
  if (form.id !== "login-form") return;

  event.preventDefault();

  const emailInput = form.querySelector("#login-email");
  const passInput = form.querySelector("#login-password");

  const email = emailInput?.value.trim();
  const password = passInput?.value || "";

  if (!email || !password) {
    alert("กรุณากรอกอีเมลและรหัสผ่าน");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // ล็อกอินสำเร็จ
    
    // ปิด dropdown (ถ้าหน้าเดียวกัน) แล้วรีเฟรช / เด้งไปหน้า index
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("เข้าสู่ระบบไม่สำเร็จ\n" + (err.code || err.message));
  }
});

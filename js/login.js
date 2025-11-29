// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Config ของโปรเจกต์ Trip Sync
const firebaseConfig = {
  apiKey: "AIzaSyCiyuFX39075-97sD67KFjqPAjh29bx5wU",
  authDomain: "trip-sync-fd25b.firebaseapp.com",
  projectId: "trip-sync-fd25b",
  storageBucket: "trip-sync-fd25b.firebasestorage.app",
  messagingSenderId: "144965045120",
  appId: "1:144965045120:web:ec74d97d399b4279920f65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  if (!form) {
    
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Login success:", user.uid);

      alert("เข้าสู่ระบบสำเร็จ 🎉");
      // ล็อกอินสำเร็จแล้ว จะให้ไปหน้าไหนก็เปลี่ยนตรงนี้ได้
      window.location.href = "index.html";

    } catch (err) {
      console.error("Login error:", err);

      let msg = "ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบอีเมลและรหัสผ่าน";

      if (err.code === "auth/user-not-found") {
        msg = "ไม่พบบัญชีผู้ใช้นี้ในระบบ";
      } else if (err.code === "auth/wrong-password") {
        msg = "รหัสผ่านไม่ถูกต้อง";
      } else if (err.code === "auth/invalid-email") {
        msg = "รูปแบบอีเมลไม่ถูกต้อง";
      } else if (err.code === "auth/too-many-requests") {
        msg = "พยายามเข้าสู่ระบบผิดหลายครั้ง กรุณารอสักครู่แล้วลองใหม่";
      }

      alert(msg);
    }
  });
});

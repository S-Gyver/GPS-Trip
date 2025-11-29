import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Config จากเอย
const firebaseConfig = {
  apiKey: "AIzaSyCiyuFX39075-97sD67KFjqPAjh29bx5wU",
  authDomain: "trip-sync-fd25b.firebaseapp.com",
  projectId: "trip-sync-fd25b",
  storageBucket: "trip-sync-fd25b.firebasestorage.app",
  messagingSenderId: "144965045120",
  appId: "1:144965045120:web:ec74d97d399b4279920f65"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ดึงข้อมูลจาก form
    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birthdate").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm_password").value;

    // ตรวจสอบข้อมูล
    if (!firstname || !lastname || !email || !birthdate || !phone) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (password !== confirm) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      // สมัครสมาชิก Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // เก็บข้อมูลเพิ่มเติมใน Firestore
      await setDoc(doc(db, "users", uid), {
        firstname,
        lastname,
        email,
        birthdate,
        phone,
        createdAt: new Date().toISOString()
      });

      alert("สมัครสมาชิกสำเร็จ 🎉");
      window.location.href = "index.html";

    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    }

  });

});

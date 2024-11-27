document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const forms = document.querySelectorAll(".form");
    const steps = document.querySelectorAll(".change-step");
    let currentStep = 0;
  
    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
  
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(form => form.classList.remove("active"));
  
        tab.classList.add("active");
        document.getElementById(target).classList.add("active");
      });
    });
  
    // Multi-step change form
    document.querySelectorAll(".next-step").forEach((button, index) => {
      button.addEventListener("click", () => {
        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");
      });
    });
  
    // Register form submission
    document.getElementById("register").addEventListener("submit", async event => {
        event.preventDefault();
        const email = document.getElementById("regEmail").value;
        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;
    
        try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password })
        });
    
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const result = await response.json();
    
        alert("Registered successfully! Proceed to verify OTP.");
        toggleForm("verifyOtp");
        } catch (err) {
        console.error("Error during registration:", err);
        alert("Registration failed. Please try again.");
        }
    });
  
  
    // Verify OTP submission
    document.getElementById("verifyOtp").addEventListener("submit", async event => {
        event.preventDefault();
        const otpCode = document.getElementById("otpCode").value.trim(); // Gunakan trim() untuk menghapus spasi
        
        console.log("OTP Code: ", otpCode);  // Log untuk melihat apa yang dikirimkan
      
        try {
          const response = await fetch("http://localhost:3000/verify-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ otp: otpCode })  // Pastikan body sesuai dengan yang diharapkan
          });
      
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const result = await response.json();
      
          alert("OTP Verified! Proceed to login.");
          toggleForm("login");
        } catch (err) {
          console.error("Error during OTP verification:", err);
          alert("OTP verification failed. Please try again.");
        }
      });      
  
    // Login form submission
    document.getElementById("login").addEventListener("submit", async event => {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
      
        try {
          const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
      
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const result = await response.json();
      
          alert("Logged in successfully!");
        } catch (err) {
          console.error("Error during login:", err);
          alert("Login failed. Please check your credentials.");
        }
      });
      
  
    // Change form submission
    document.getElementById("change").addEventListener("submit", async event => {
        event.preventDefault();
        const email = document.getElementById("changeEmail").value;
        const password = document.getElementById("changePassword").value;
        const newUsername = document.getElementById("newUsername").value;
        const newPassword = document.getElementById("newPassword").value;
      
        try {
          const response = await fetch("http://localhost:3000/change-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, newUsername, newPassword })
          });
      
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const result = await response.json();
      
          alert("Changes applied successfully! Verify update OTP.");
          toggleForm("verifyUpdateOtp");
        } catch (err) {
          console.error("Error during change:", err);
          alert("Change failed. Please try again.");
        }
      });
      
  
    // Verify Update OTP submission
    document.getElementById("verifyUpdateOtp").addEventListener("submit", async event => {
        event.preventDefault();
        const updateOtpCode = document.getElementById("updateOtpCode").value;
      
        try {
          const response = await fetch("http://localhost:3000/verify-update-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp: updateOtpCode })
          });
      
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const result = await response.json();
      
          alert("Update Verified!");
        } catch (err) {
          console.error("Error during update OTP verification:", err);
          alert("Verification failed. Please try again.");
        }
      });
      
  
    // Toggle form display
    function toggleForm(formId) {
      forms.forEach(form => form.classList.remove("active"));
      document.getElementById(formId).classList.add("active");
    }
  });
  
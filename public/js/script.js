(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

window.addEventListener("DOMContentLoaded", () => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
      document.body.classList.add("dark-mode");
      const toggleBtn = document.getElementById("darkToggle");
      if (toggleBtn) toggleBtn.textContent = "☀️ Light Mode";
    }
});

  // Toggle and persist dark mode
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "darkToggle") {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
      e.target.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
});
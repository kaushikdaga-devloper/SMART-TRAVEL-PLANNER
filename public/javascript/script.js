window.addEventListener('DOMContentLoaded', () => {
  // Check if the alert has already been shown in this session
  if (!sessionStorage.getItem("alertShown")) {
    alert("Welcome! This website is under development as a project. New features will be added soon!");

    // Set a flag so it doesn't show again in this session
    sessionStorage.setItem("alertShown", "true");
  }
});
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
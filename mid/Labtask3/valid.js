  <script>
    

    document.getElementById('donorForm').addEventListener('submit', function(event) {
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;

      if (password !== confirm) {
        alert("Passwords do not match.");
        event.preventDefault();
      }
    });
  </script>

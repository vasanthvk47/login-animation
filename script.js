document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    localStorage.setItem("username", username);  // Store username in localStorage
    window.location.href = "nextPage.html"; // Redirect to next page
  });
  
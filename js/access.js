document.addEventListener("DOMContentLoaded", () => {
  const screen = document.getElementById("access-screen");
  const panel = document.getElementById("main-panel");
  const input = document.getElementById("access-key");
  const error = document.getElementById("access-error");

  function unlock() {
    if (input.value.trim() !== ACCESS_KEY) {
      error.textContent = "❌ Akses key salah!";
      error.style.display = "block";
      input.value = "";
      input.focus();
      return;
    }
    sessionStorage.setItem("marz_access", "granted");
    screen.style.display = "none";
    panel.style.display = "block";
  }

  document.getElementById("access-submit").addEventListener("click", unlock);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") unlock();
  });

  if (sessionStorage.getItem("marz_access") === "granted") {
    screen.style.display = "none";
    panel.style.display = "block";
  }
  document.getElementById("lock-btn").addEventListener("click", () => {
    sessionStorage.removeItem("marz_access");
    location.reload();
  });
});

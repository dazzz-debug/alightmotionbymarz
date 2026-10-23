(() => {
  let userEmail = "";
  const $ = id => document.getElementById(id);

  $("guide-toggle").addEventListener("click", () => {
    $("guide-text").hidden = !$("guide-text").hidden;
  });
  $("btn-send").addEventListener("click", processStep1);
  $("btn-verify").addEventListener("click", processStep2);
  $("cancel-btn").addEventListener("click", resetPanel);

  async function callApi(action, data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
        signal: controller.signal
      });
      if (!res.ok) return { success: false, message: `Server mengembalikan HTTP ${res.status}.` };
      try {
        return await res.json();
      } catch {
        return { success: false, message: "Respons API bukan JSON yang valid." };
      }
    } catch (e) {
      if (e.name === "AbortError") return { success: false, message: "Server API timeout (terlalu lama merespons)." };
      return { success: false, message: "Koneksi ke server gagal / API error." };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function showNotif(msg, type) {
    const el = $("notif");
    el.textContent = msg;
    el.className = "notif " + (type === "error" ? "error-notif" : "success-notif");
    el.style.display = "block";
  }
  function hideNotif() { $("notif").style.display = "none"; }

  function setBusy(step, busy) {
    const button = step === 1 ? $("btn-send") : $("btn-verify");
    const spinner = step === 1 ? $("spin-1") : $("spin-2");
    button.disabled = busy;
    spinner.style.display = busy ? "block" : "none";
  }

  function resetPanel() {
    $("step-1").classList.add("active");
    $("step-2").classList.remove("active");
    $("ind-1").classList.add("active");
    $("ind-2").classList.remove("active");
    $("cancel-btn").hidden = true;
    $("email-input").disabled = false;
    $("email-input").value = "";
    $("link-input").value = "";
    userEmail = "";
    hideNotif();
  }

  async function processStep1() {
    const email = $("email-input").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotif("Format email tidak valid!", "error");
      return;
    }
    hideNotif();
    setBusy(1, true);
    const res = await callApi("send-magiclink", { email });
    setBusy(1, false);
    if (res && res.success) {
      userEmail = email;
      showNotif("Permintaan berhasil. Periksa email jika layanan mengirimkan link.", "success");
      $("step-1").classList.remove("active");
      $("step-2").classList.add("active");
      $("ind-1").classList.remove("active");
      $("ind-2").classList.add("active");
      $("email-input").disabled = true;
      $("cancel-btn").hidden = false;
    } else {
      showNotif((res && res.message) || "Gagal mengirim link.", "error");
    }
  }

  async function processStep2() {
    const link = $("link-input").value.trim();
    if (!link) {
      showNotif("Masukkan link verifikasi!", "error");
      return;
    }
    if (!userEmail) {
      showNotif("Kirim link terlebih dahulu.", "error");
      return;
    }
    hideNotif();
    setBusy(2, true);
    try {
      const resVerify = await callApi("verify-account", { email: userEmail, rawLink: link });
      if (!resVerify || !resVerify.success) {
        showNotif((resVerify && resVerify.message) || "Verifikasi gagal.", "error");
        return;
      }
      const idToken = resVerify.idToken || (resVerify.profile && resVerify.profile.idToken);
      if (!idToken) {
        showNotif("Token tidak ditemukan dari respons API.", "error");
        return;
      }
      const resPrem = await callApi("apply-premium", { email: userEmail, idToken });
      if (resPrem && resPrem.success) {
        showNotif("Proses berhasil menurut respons API.", "success");
        $("link-input").value = "";
      } else {
        showNotif((resPrem && resPrem.message) || "Permintaan aktivasi gagal.", "error");
      }
    } finally {
      setBusy(2, false);
    }
  }
})();

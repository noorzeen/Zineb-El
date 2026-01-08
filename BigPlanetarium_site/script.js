// BigPlanetarium interactions (small, accessible JS)
(function () {
  // High contrast toggle (remembered)
  const root = document.documentElement;
  const contrastBtn = document.querySelector("[data-contrast]");

  function applyContrast(mode) {
    if (mode === "high") {
      root.setAttribute("data-contrast", "high");
      contrastBtn?.setAttribute("aria-pressed", "true");
      if (contrastBtn) contrastBtn.textContent = "Normal contrast";
    } else {
      root.removeAttribute("data-contrast");
      contrastBtn?.setAttribute("aria-pressed", "false");
      if (contrastBtn) contrastBtn.textContent = "High contrast";
    }
  }

  const saved = localStorage.getItem("bp-contrast");
  applyContrast(saved === "high" ? "high" : "normal");

  if (contrastBtn) {
    contrastBtn.addEventListener("click", () => {
      const isHigh = root.getAttribute("data-contrast") === "high";
      const next = isHigh ? "normal" : "high";
      localStorage.setItem("bp-contrast", next);
      applyContrast(next);
    });
  }

  // Fact toggle (Mars page)
  const toggleBtn = document.querySelector("[data-toggle]");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const fact = document.getElementById("fact");
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!expanded));
      if (fact) fact.hidden = expanded;
      toggleBtn.textContent = expanded ? "Show a quick fact" : "Hide the fact";
    });
  }

  // Quiz (Mars page)
  const quiz = document.getElementById("quiz");
  if (quiz) {
    quiz.addEventListener("submit", (e) => {
      e.preventDefault();
      const chosen = quiz.querySelector('input[name="q"]:checked');
      const out = document.getElementById("quizResult");
      if (!out) return;

      if (!chosen) {
        out.textContent = "Please pick an answer.";
        return;
      }

      out.textContent =
        chosen.value === "rocky"
          ? "Correct! Mars is a rocky planet."
          : "Not quite. The correct answer is: Rocky planet.";
    });
  }
})();

const API_URL = "http://127.0.0.1:8000/predict";
    const form = document.getElementById("student-form");
    const button = document.getElementById("submit-button");
    const errorBox = document.getElementById("error-message");
    const resultCard = document.getElementById("result-card");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorBox.classList.remove("show");
      resultCard.classList.remove("show");

      const formData = new FormData(form);
      const payload = {
        age: Number(formData.get("age")),
        gender: formData.get("gender"),
        country: formData.get("country").trim(),
        academic_level: formData.get("academic_level"),
        most_used_platform: formData.get("most_used_platform"),
        purpose_of_use: formData.get("purpose_of_use"),
        avg_daily_usage_hours: Number(formData.get("avg_daily_usage_hours")),
        daily_unlocks: Number(formData.get("daily_unlocks")),
        study_hours: Number(formData.get("study_hours")),
        physical_activity_hours: Number(formData.get("physical_activity_hours")),
        sleep_hours_per_night: Number(formData.get("sleep_hours_per_night")),
        stress_level: formData.get("stress_level")
      };

      button.disabled = true;
      button.classList.add("loading");
      button.querySelector(".button-text").textContent = "Calculating your result…";

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          const detail = Array.isArray(body.detail)
            ? body.detail.map(item => `${item.loc?.slice(1).join(" → ") || "Field"}: ${item.msg}`).join("; ")
            : body.detail || `Request failed (${response.status})`;
          throw new Error(detail);
        }
        const score = body.predicted_mental_health_score;
        if (typeof score !== "number") throw new Error("The API response did not include predicted_mental_health_score.");
        document.getElementById("score-value").textContent = score.toFixed(2);
        resultCard.classList.add("show");
        resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch (error) {
        errorBox.textContent = error.message.includes("Failed to fetch")
          ? "Could not reach the API. Make sure your FastAPI server is running at http://127.0.0.1:8000 and CORS is enabled."
          : error.message;
        errorBox.classList.add("show");
      } finally {
        button.disabled = false;
        button.classList.remove("loading");
        button.querySelector(".button-text").innerHTML = 'Get my prediction <span aria-hidden="true">→</span>';
      }
    });

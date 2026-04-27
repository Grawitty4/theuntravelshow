const form = document.querySelector(".apply-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name");

    alert(
      `Thanks${name ? `, ${name}` : ""}! Your draft application has been captured. We can now wire this to Netlify Forms or your preferred backend.`
    );

    form.reset();
  });
}

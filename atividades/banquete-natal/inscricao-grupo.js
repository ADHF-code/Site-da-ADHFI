(() => {
  const form = document.getElementById('banquete-grupo-form');
  if (!form) return;
  const slots = [...form.querySelectorAll('[data-participant]')];
  const counter = document.getElementById('group-count');
  function validate() {
    let count = 0;
    for (const [index, slot] of slots.entries()) {
      const name = slot.querySelector('input');
      const type = slot.querySelector('select');
      const filled = Boolean(name.value.trim());
      if (filled) count++;
      name.required = index < 4 || Boolean(type.value);
      type.required = index < 4 || filled;
      name.setCustomValidity(name.value && !filled ? 'Indica o nome da pessoa.' : '');
    }
    counter.textContent = count + ' de 7 pessoas preenchidas · mínimo 4';
  }
  form.addEventListener('input', validate);
  form.addEventListener('change', validate);
  form.addEventListener('submit', event => {
    validate();
    if (!form.reportValidity()) event.preventDefault();
  });
  validate();
})();

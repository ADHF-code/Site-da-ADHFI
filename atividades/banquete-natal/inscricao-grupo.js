(() => {
  const form = document.getElementById('banquete-grupo-form');
  if (!form) return;
  const slots = [...form.querySelectorAll('[data-participant]')];
  const counter = document.getElementById('group-count');
  const add = document.getElementById('add-person');
  let visible = Math.max(4, ...slots.map((slot, index) =>
    [...slot.querySelectorAll('input, select')].some(field => field.value) ? index + 1 : 0));
  function showSlots() {
    slots.forEach((slot, index) => {
      slot.hidden = index >= visible;
      slot.disabled = index >= visible;
    });
    add.hidden = visible >= slots.length;
  }
  add.addEventListener('click', () => {
    if (visible >= slots.length) return;
    visible++;
    showSlots();
    validate();
    slots[visible - 1].querySelector('input').focus();
  });
  function validate() {
    let count = 0;
    for (const [index, slot] of slots.entries()) {
      const name = slot.querySelector('input');
      const type = slot.querySelector('[name$="_tipo"]');
      const meal = slot.querySelector('[name$="_ementa"]');
      const filled = Boolean(name.value.trim());
      const active = !slot.disabled;
      const started = filled || Boolean(type.value) || Boolean(meal.value);
      if (active && filled) count++;
      name.required = active && (index < 4 || started);
      type.required = active && (index < 4 || started);
      meal.required = active && (index < 4 || started);
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
  showSlots();
  validate();
})();

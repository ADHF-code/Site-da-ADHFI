(() => {
  const form = document.querySelector('form[data-registration]');
  if (!form) return;
  const nif = form.elements.nif_aluno, name = form.elements.participante, code = form.elements.adhfi_j;
  const button = document.getElementById('identify-young'), status = document.getElementById('identify-status');
  const next = document.getElementById('continue-nif'), choice = document.getElementById('registration-choice');
  const details = document.getElementById('registration-details'), summary = document.getElementById('identified-summary');
  const core = ['participante', 'responsavel', 'email', 'telefone'];
  const membership = form.dataset.membership === 'true';
  const associateCode = form.elements.numero_associado;
  const category = form.elements.condicao;
  const price = form.elements.valor;
  const verification = form.elements.validacao;
  const participantKind = form.elements.tipo_participante;
  const priceNote = document.getElementById('registration-price');
  const birth = form.elements.data_nascimento;
  const ageInfo = document.getElementById('age-information');
  const join = document.getElementById('join-association');
  let eligible = false;
  function ageAtEvent() {
    if (!birth || !/^\d{4}-\d{2}-\d{2}$/.test(birth.value)) return null;
    const [year, month, day] = birth.value.split('-').map(Number);
    return 2026 - year - (month > 10 || (month === 10 && day > 31) ? 1 : 0);
  }
  function updateAge() {
    if (!birth) return true;
    const age = ageAtEvent();
    birth.setCustomValidity(age === null || age < 10 || age > 60 ? 'Indica uma data válida. O Halloween é dos 10 aos 60 anos.' : '');
    if (age === null) { ageInfo.textContent = ''; return false; }
    participantKind.value = age < 18 ? 'Menor' : 'Adulto';
    ageInfo.textContent = age + ' anos à data do evento.';
    const guardian = form.elements.responsavel;
    guardian.required = age < 18;
    guardian.disabled = age >= 18;
    guardian.closest('label').hidden = age >= 18 || (mode === 'existing' && !!guardian.value);
    if (mode === 'new') {
      form.elements.email.closest('label').firstChild.textContent = age < 18 ? 'Email do encarregado de educação' : 'Email do participante';
      form.elements.telefone.closest('label').firstChild.textContent = age < 18 ? 'Telemóvel do encarregado de educação' : 'Telemóvel do participante';
    }
    return age >= 10 && age <= 60;
  }
  if (birth) birth.addEventListener('input', updateAge);
  function updatePrice() {
    if (!membership) return;
    const discounted = category.value === 'associado' || category.value === 'filho_associado';
    price.value = discounted ? '15' : '18';
    verification.value = 'Condição declarada · por confirmar pela associação';
    priceNote.textContent = !category.value ? 'Seleciona a condição do participante para indicar o preço.' : price.value + ' € · entrada + jantar' + (discounted && !eligible ? ' · condição de associado por confirmar' : '');
  }
  if (category) category.addEventListener('change', updatePrice);
  let popup, nonce, mode = '', currentNif = '';
  function validNif(value) {
    if (!/^[0-9]{9}$/.test(value)) return false;
    const sum = [...value.slice(0, 8)].reduce((total, digit, i) => total + Number(digit) * (9 - i), 0);
    const check = 11 - sum % 11;
    return Number(value[8]) === (check >= 10 ? 0 : check);
  }
  function checkNif() {
    nif.setCustomValidity(validNif(nif.value) ? '' : 'Confirma o NIF do participante: deve ter 9 algarismos e ser válido.');
    return nif.reportValidity();
  }
  function resetDetails() {
    mode = ''; nonce = null; popup = null; code.value = '';
    if (birth) { birth.value = ''; birth.setCustomValidity(''); birth.closest('label').hidden = false; ageInfo.textContent = ''; }
    eligible = false;
    if (membership) { associateCode.value = ''; category.value = ''; category.closest('label').hidden = false; participantKind.value = ''; updatePrice(); }
    if (form.elements.grupo) form.elements.grupo.value = '';
    details.hidden = true; details.disabled = true; summary.hidden = true; summary.replaceChildren();
    for (const field of core) {
      const input = form.elements[field]; input.value = ''; input.readOnly = false; input.closest('label').hidden = false;
    }
    details.querySelectorAll('input[type="checkbox"]').forEach(input => { input.checked = false; });
    status.textContent = '';
  }
  function proceed() {
    if (!checkNif()) return false;
    currentNif = nif.value; choice.hidden = true; next.hidden = true;
    document.getElementById('new-young').click();
    return true;
  }
  nif.addEventListener('input', () => {
    nif.setCustomValidity('');
    if (currentNif && nif.value !== currentNif) {
      resetDetails(); choice.hidden = true; next.hidden = false; currentNif = '';
    }
  });
  next.addEventListener('click', proceed);
  document.getElementById('new-young').addEventListener('click', () => {
    if (!checkNif()) return;
    resetDetails(); mode = 'new'; currentNif = nif.value;
    choice.hidden = true; details.hidden = false; details.disabled = false;
    status.textContent = 'Preenche os dados para esta inscrição.';
    if (join) join.hidden = false;
    updateAge(); updatePrice(); name.focus();
  });
  form.addEventListener('submit', event => {
    if (!mode) { event.preventDefault(); proceed(); return; }
    if (!checkNif() || (birth && !updateAge())) event.preventDefault();
    updatePrice();
  });
})();

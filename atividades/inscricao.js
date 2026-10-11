(() => {
  const form = document.querySelector('form[data-registration]');
  if (!form) return;
  const nif = form.elements.nif_aluno, name = form.elements.participante, code = form.elements.adhfi_j;
  const button = document.getElementById('identify-young'), status = document.getElementById('identify-status');
  const next = document.getElementById('continue-nif'), choice = document.getElementById('registration-choice');
  const details = document.getElementById('registration-details'), summary = document.getElementById('identified-summary');
  const core = ['participante', 'responsavel', 'email', 'telefone'];
  let popup, nonce, mode = '', currentNif = '';
  function validNif(value) {
    if (!/^[0-9]{9}$/.test(value)) return false;
    const sum = [...value.slice(0, 8)].reduce((total, digit, i) => total + Number(digit) * (9 - i), 0);
    const check = 11 - sum % 11;
    return Number(value[8]) === (check >= 10 ? 0 : check);
  }
  function checkNif() {
    nif.setCustomValidity(validNif(nif.value) ? '' : 'Confirma o NIF do aluno: deve ter 9 algarismos e ser válido.');
    return nif.reportValidity();
  }
  function resetDetails() {
    mode = ''; nonce = null; popup = null; code.value = '';
    details.hidden = true; details.disabled = true; summary.hidden = true; summary.replaceChildren();
    for (const field of core) {
      const input = form.elements[field]; input.value = ''; input.readOnly = false; input.closest('label').hidden = false;
    }
    details.querySelectorAll('input[type="checkbox"]').forEach(input => { input.checked = false; });
    status.textContent = '';
  }
  function proceed() {
    if (!checkNif()) return false;
    currentNif = nif.value; choice.hidden = false; next.hidden = true;
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
    name.focus();
  });
  button.addEventListener('click', () => {
    if (!checkNif()) return;
    currentNif = nif.value; nonce = crypto.randomUUID();
    const url = new URL('https://cfi-lab.netlify.app/identificar-aluno.html');
    url.searchParams.set('origem', location.origin); url.searchParams.set('pedido', nonce);
    popup = window.open(url.href, 'adhfi-identificar-aluno', 'popup,width=560,height=740');
    status.textContent = popup ? 'Confirma o aluno na janela da tua conta ADHFI / CFI.' : 'Permite a abertura da janela da conta para identificar o aluno.';
  });
  window.addEventListener('message', event => {
    if (!nonce || event.origin !== 'https://cfi-lab.netlify.app' || event.source !== popup || event.data?.nonce !== nonce) return;
    if (event.data.type === 'adhfi-activity-ready') {
      popup.postMessage({ type: 'adhfi-activity-request', nonce, nif: currentNif }, 'https://cfi-lab.netlify.app');
      return;
    }
    if (event.data.type !== 'adhfi-activity-student') return;
    const young = event.data.young, guardian = event.data.guardian || {};
    if (!young || typeof young.name !== 'string' || !young.name.trim() || !validNif(young.nif) || (young.adhfiId && !/^ADHFI-J-\d{4,}$/.test(young.adhfiId))) {
      status.textContent = 'A ficha do aluno precisa de confirmação. Contacta a associação ou utiliza a opção de preencher dados.';
      return;
    }
    mode = 'existing'; nif.value = young.nif; nif.setCustomValidity(''); currentNif = young.nif;
    name.value = young.name; code.value = young.adhfiId || '';
    for (const [field, value] of [['responsavel', guardian.name], ['email', guardian.email], ['telefone', guardian.phone]]) {
      form.elements[field].value = typeof value === 'string' ? value : '';
    }
    choice.hidden = true; details.disabled = false; details.hidden = false; summary.hidden = false;
    summary.replaceChildren();
    const title = document.createElement('strong'); title.textContent = young.name + (young.adhfiId ? ' · ' + young.adhfiId : ''); summary.append(title);
    const contact = document.createElement('p'); contact.className = 'small';
    contact.textContent = [guardian.name, guardian.email, guardian.phone].filter(v => typeof v === 'string' && v.trim()).join(' · '); summary.append(contact);
    for (const field of core) {
      const input = form.elements[field], filled = Boolean(input.value.trim());
      input.readOnly = filled; input.closest('label').hidden = filled;
    }
    status.textContent = 'Aluno identificado. Confirma a autorização e envia a inscrição.';
    nonce = null; popup = null;
  });
  form.addEventListener('submit', event => {
    if (!mode) { event.preventDefault(); proceed(); return; }
    if (!checkNif()) event.preventDefault();
  });
})();

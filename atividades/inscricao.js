(() => {
  const form = document.querySelector('form[data-registration]');
  const nif = form.elements.nif_aluno, name = form.elements.participante, code = form.elements.adhfi_j;
  const button = document.getElementById('identify-young'), status = document.getElementById('identify-status');
  let popup, nonce, verifiedNif = '';
  function validNif(value) {
    if (!/^[0-9]{9}$/.test(value)) return false;
    const sum = [...value.slice(0, 8)].reduce((total, digit, i) => total + Number(digit) * (9 - i), 0);
    const check = 11 - sum % 11;
    return Number(value[8]) === (check >= 10 ? 0 : check);
  }
  nif.addEventListener('input', () => {
    nif.setCustomValidity('');
    if (verifiedNif && nif.value !== verifiedNif) {
      verifiedNif = ''; code.value = ''; name.value = ''; name.readOnly = false;
      status.textContent = 'O NIF foi alterado. Identifica novamente o aluno ou preenche o nome manualmente.';
    }
  });
  nif.addEventListener('blur', () => {
    nif.setCustomValidity(nif.value && !validNif(nif.value) ? 'Confirma o NIF do aluno: deve ter 9 algarismos e ser válido.' : '');
  });
  button.addEventListener('click', () => {
    nonce = crypto.randomUUID();
    const url = new URL('https://cfi-lab.netlify.app/identificar-aluno.html');
    url.searchParams.set('origem', location.origin); url.searchParams.set('pedido', nonce);
    popup = window.open(url.href, 'adhfi-identificar-aluno', 'popup,width=560,height=740');
    status.textContent = popup ? 'Confirma o aluno na janela da tua conta ADHFI / CFI.' : 'Permite a abertura da janela da conta ou preenche os dados manualmente.';
  });
  window.addEventListener('message', event => {
    if (event.origin !== 'https://cfi-lab.netlify.app' || event.source !== popup || event.data?.nonce !== nonce) return;
    if (event.data.type === 'adhfi-activity-ready') {
      popup.postMessage({ type: 'adhfi-activity-request', nonce, nif: nif.value }, 'https://cfi-lab.netlify.app');
      return;
    }
    if (event.data.type !== 'adhfi-activity-student') return;
    const young = event.data.young, guardian = event.data.guardian || {};
    if (!young || typeof young.name !== 'string' || !validNif(young.nif) || (young.adhfiId && !/^ADHFI-J-\d{4,}$/.test(young.adhfiId))) {
      status.textContent = 'A ficha do aluno precisa de confirmação. Preenche os dados manualmente e contacta a associação.';
      return;
    }
    nif.value = young.nif; nif.setCustomValidity(''); verifiedNif = young.nif;
    name.value = young.name; name.readOnly = true; code.value = young.adhfiId || '';
    for (const [field, value] of [['responsavel', guardian.name], ['email', guardian.email], ['telefone', guardian.phone]]) {
      if (!form.elements[field].value && typeof value === 'string') form.elements[field].value = value;
    }
    status.textContent = 'Aluno identificado através da tua conta.';
    nonce = null; popup = null;
  });
  form.addEventListener('submit', event => {
    if (!validNif(nif.value)) {
      event.preventDefault(); nif.setCustomValidity('Confirma o NIF do aluno: deve ter 9 algarismos e ser válido.'); nif.reportValidity();
    }
  });
})();

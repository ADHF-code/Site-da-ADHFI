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
    birth.setCustomValidity(age === null || age < 10 || age > 126 ? 'Indica uma data válida. O Halloween é a partir dos 10 anos.' : '');
    if (age === null) { ageInfo.textContent = ''; return false; }
    participantKind.value = age < 18 ? 'Menor' : 'Adulto';
    ageInfo.textContent = age < 18 ? 'Menor de 18 anos: são necessários os contactos do encarregado de educação. Identificação de jovem: ADHFI-J.' : (age <= 23 ? 'Dos 18 aos 23 anos: contactos do próprio participante. Como associado, terá número ADHFI-J e número de associado.' : 'A partir dos 24 anos: contactos do próprio participante. Como associado, terá apenas número de associado.');
    const guardian = form.elements.responsavel;
    guardian.required = age < 18;
    guardian.disabled = age >= 18;
    guardian.closest('label').hidden = age >= 18 || (mode === 'existing' && !!guardian.value);
    if (mode === 'new') {
      form.elements.email.closest('label').firstChild.textContent = age < 18 ? 'Email do encarregado de educação' : 'Email do participante';
      form.elements.telefone.closest('label').firstChild.textContent = age < 18 ? 'Telemóvel do encarregado de educação' : 'Telemóvel do participante';
    }
    return age >= 10 && age <= 126;
  }
  if (birth) birth.addEventListener('input', updateAge);
  function updatePrice() {
    if (!membership) return;
    const discounted = category.value === 'associado' || category.value === 'filho_associado';
    price.value = discounted ? '15' : '18';
    verification.value = discounted && !eligible ? 'Por confirmar pela associação' : (mode === 'existing' ? 'Consultado na conta ADHFI' : 'Declarado no formulário');
    priceNote.textContent = price.value + ' € · entrada + jantar' + (discounted && !eligible ? ' · condição de associado por confirmar' : '');
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
    if (membership) { associateCode.value = ''; category.value = 'nao_associado'; category.closest('label').hidden = false; participantKind.value = ''; updatePrice(); }
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
    if (join) join.hidden = false;
    updateAge(); updatePrice(); name.focus();
  });
  button.addEventListener('click', () => {
    if (!checkNif()) return;
    currentNif = nif.value; nonce = crypto.randomUUID();
    const url = new URL('https://cfi-lab.netlify.app/identificar-aluno.html');
    if (membership) url.searchParams.set('participantes', 'todos');
    url.searchParams.set('origem', location.origin); url.searchParams.set('pedido', nonce);
    popup = window.open(url.href, 'adhfi-identificar-aluno', 'popup,width=560,height=740');
    status.textContent = popup ? 'Confirma o participante na janela da tua conta ADHFI / CFI.' : 'Permite a abertura da janela da conta para identificar o participante.';
  });
  window.addEventListener('message', event => {
    if (!nonce || event.origin !== 'https://cfi-lab.netlify.app' || event.source !== popup || event.data?.nonce !== nonce) return;
    if (event.data.type === 'adhfi-activity-ready') {
      popup.postMessage({ type: 'adhfi-activity-request', nonce, nif: currentNif }, 'https://cfi-lab.netlify.app');
      return;
    }
    if (event.data.type === 'adhfi-activity-not-found') {
      document.getElementById('new-young').click();
      status.textContent = 'Não foi encontrado um participante com este NIF ligado à tua conta. Continua a inscrição e, se quiseres, pede informação para te tornares associado.';
      nonce = null; popup = null; return;
    }
    if (event.data.type !== 'adhfi-activity-student') return;
    const young = event.data.young, guardian = event.data.guardian || {};
    if ((!membership && young?.kind === 'adult') || !young || typeof young.name !== 'string' || !young.name.trim() || !validNif(young.nif) || (young.adhfiId && !/^ADHFI-J-\d{4,}$/.test(young.adhfiId))) {
      status.textContent = 'A ficha do participante precisa de confirmação. Contacta a associação ou utiliza a opção de preencher dados.';
      return;
    }
    mode = 'existing'; nif.value = young.nif; nif.setCustomValidity(''); currentNif = young.nif;
    name.value = young.name; code.value = young.adhfiId || '';
    if (membership) {
      associateCode.value = typeof young.associateId === 'string' ? young.associateId.slice(0,80) : '';
      participantKind.value = young.kind === 'adult' ? 'Adulto' : 'Jovem';
      eligible = young.memberEligible === true;
      category.value = eligible ? (young.kind === 'adult' ? 'associado' : 'filho_associado') : 'nao_associado';
      category.closest('label').hidden = true;
      updatePrice();
    }
    for (const [field, value] of [['responsavel', guardian.name], ['email', guardian.email], ['telefone', guardian.phone]]) {
      form.elements[field].value = typeof value === 'string' ? value : '';
    }
    choice.hidden = true; details.disabled = false; details.hidden = false; summary.hidden = false;
    if (birth) {
      birth.value = typeof young.birth === 'string' ? young.birth.slice(0,10) : '';
      birth.closest('label').hidden = false;
      if (birth.value && updateAge() && birth.checkValidity()) birth.closest('label').hidden = true;
    }
    if (join) join.hidden = eligible;
    updateAge();
    summary.replaceChildren();
    const title = document.createElement('strong'); title.textContent = [young.name, young.adhfiId, young.associateId].filter(Boolean).join(' · '); summary.append(title);
    const contact = document.createElement('p'); contact.className = 'small';
    contact.textContent = [guardian.name, guardian.email, guardian.phone].filter(v => typeof v === 'string' && v.trim()).join(' · '); summary.append(contact);
    for (const field of core) {
      const input = form.elements[field], filled = Boolean(input.value.trim());
      input.readOnly = filled; input.closest('label').hidden = filled;
    }
    status.textContent = 'Participante identificado. Confirma a autorização e envia a inscrição.';
    nonce = null; popup = null;
  });
  form.addEventListener('submit', event => {
    if (!mode) { event.preventDefault(); proceed(); return; }
    if (!checkNif() || (birth && !updateAge())) event.preventDefault();
    updatePrice();
  });
})();

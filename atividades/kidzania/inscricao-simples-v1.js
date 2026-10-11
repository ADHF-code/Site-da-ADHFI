(() => {
  const form = document.querySelector('form[data-registration]');
  if (!form) return;
  const nif = form.elements.nif_aluno, name = form.elements.participante, code = form.elements.adhfi_j;
  const button = document.getElementById('identify-young'), status = document.getElementById('identify-status');
  const next = document.getElementById('continue-nif'), choice = document.getElementById('registration-choice');
  const details = document.getElementById('registration-details'), summary = document.getElementById('identified-summary');
  const core = ['participante', 'responsavel', 'email', 'telefone'];
  const membership = false;
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
    const value = birth.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [y,m,d] = value.split('-').map(Number);
    const date = new Date(Date.UTC(y,m-1,d));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m-1 || date.getUTCDate() !== d || value > '2026-11-19') return null;
    return 2026-y-(m>11 || (m===11 && d>19) ? 1 : 0);
  }
  function updateAge() {
    const age=ageAtEvent();
    birth.setCustomValidity(age===null || age>126 ? 'Indica uma data de nascimento válida.' : '');
    form.elements.idade.value=age===null ? '' : String(age);
    const adult=age!==null && age>=18;
    const guardian=form.elements.responsavel;
    guardian.required=!adult; guardian.disabled=adult;
    guardian.closest('label').hidden=adult || (mode==='existing' && !!guardian.value);
    if(mode==='new'){
      form.elements.email.closest('label').firstChild.textContent=adult?'Email do participante':'Email do encarregado de educação';
      form.elements.telefone.closest('label').firstChild.textContent=adult?'Telemóvel do participante':'Telemóvel do encarregado de educação';
    }
    return age!==null && age<=126;
  }
  birth.addEventListener('input',updateAge);
  function updatePrice() {
    if (!membership) return;
    const discounted = category.value === 'associado' || category.value === 'filho_associado';
    price.value = discounted ? '15' : '18';
    verification.value = 'Condição declarada · por confirmar pela associação';
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
    mode = ''; nonce = null; popup = null; code.value = ''; associateCode.value = ''; birth.value = ''; form.elements.idade.value = ''; resetParticipation();
    eligible = false;
    if (membership) { associateCode.value = ''; category.value = ''; category.closest('label').hidden = false; participantKind.value = ''; updatePrice(); }
    if (form.elements.grupo) form.elements.grupo.value = '';
    details.hidden = true; details.disabled = true; summary.hidden = true; summary.replaceChildren();
    for (const field of core) {
      const input = form.elements[field]; input.value = ''; input.readOnly = false; input.closest('label').hidden = false;
    }
    details.querySelectorAll('input[type="checkbox"]').forEach(input => { input.checked = false; });
    status.textContent = ''; birth.closest('label').hidden = false;
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
  const options=document.getElementById('participation-options');
  const info=document.getElementById('information-form');
  const review=document.getElementById('registration-review');
  const yes=document.getElementById('participation-yes');
  let authorized=false, reviewed='';
  function resetParticipation(){
    authorized=false; reviewed='';
    options.hidden=true; options.disabled=true; review.hidden=true;
    yes.setAttribute('aria-pressed','false'); info.hidden=true; form.hidden=false;
    options.querySelectorAll('select').forEach(el=>{el.value='';});
  }
  function signature(){return JSON.stringify([...new FormData(form)]);}
  yes.addEventListener('click',()=>{
    authorized=true; options.hidden=false; options.disabled=false;
    yes.setAttribute('aria-pressed','true');
    form.elements.menu.focus();
  });
  document.getElementById('participation-info').addEventListener('click',()=>{
    info.elements.nome.value=form.elements.responsavel.value || name.value;
    info.elements.email.value=form.elements.email.value;
    info.elements.telefone.value=form.elements.telefone.value;
    form.hidden=true; info.hidden=false; info.elements.nome.focus();
  });
  document.getElementById('back-to-registration').addEventListener('click',()=>{
    info.hidden=true; form.hidden=false; document.getElementById('participation-info').focus();
  });
  function showReview(){
    if(!authorized || !checkNif() || !updateAge() || !form.reportValidity()) return false;
    const target=document.getElementById('review-content'); target.replaceChildren();
    const values=[
      ['Participante',name.value],
      ['Idade',form.elements.idade.value+' anos'],
      ['Identificação',[code.value,associateCode.value].filter(Boolean).join(' · ') || 'Novo participante'],
      ['Menu',form.elements.menu.selectedOptions[0].textContent],
      ['Restrições alimentares',form.elements.restricoes_alimentares.selectedOptions[0].textContent],
      ['Imagem',form.elements.autorizacao_imagem.selectedOptions[0].textContent],
      ['Contacto',form.elements.email.value+' · '+form.elements.telefone.value],
      ['Atividade','19 novembro · 9h00 · regresso depois das 15h00'],
      ['Autorização','Visita e autocarro de ida e volta'],
      ['Valor','30 € · almoço e transporte incluídos']
    ];
    for(const [label,value] of values){const p=document.createElement('p');p.className='small';p.textContent=label+': '+value;target.append(p);}
    review.hidden=false; reviewed=signature(); review.focus(); return true;
  }
  document.getElementById('review-registration').addEventListener('click',showReview);
  form.addEventListener('input',()=>{ reviewed=''; review.hidden=true; });
  form.addEventListener('change',()=>{ reviewed=''; review.hidden=true; });
  form.addEventListener('submit',event=>{
    if(!mode){event.preventDefault();proceed();return;}
    if(!authorized || !checkNif() || !updateAge()){event.preventDefault();return;}
    if(!reviewed || reviewed!==signature()){event.preventDefault();showReview();}
  });
})();

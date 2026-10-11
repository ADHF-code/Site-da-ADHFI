(() => {
const form=document.querySelector('form[data-registration]');
if(!form)return;
const nif=form.elements.nif_aluno,name=form.elements.participante,birth=form.elements.data_nascimento;
const code=form.elements.adhfi_j,associateCode=form.elements.numero_associado;
const eventDate='2026-11-19';
let mode='new';
function ageAtEvent(){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(birth.value))return null;
 const [y,m,d]=birth.value.split('-').map(Number), date=new Date(Date.UTC(y,m-1,d));
 if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d||birth.value>eventDate)return null;
 const [ey,em,ed]=eventDate.split('-').map(Number);
 return ey-y-(m>em||(m===em&&d>ed)?1:0);
}
function updateAge(){
 const age=ageAtEvent(), valid=age!==null && age<=126;
 birth.setCustomValidity(!birth.value?'':valid?'':'Indica uma data de nascimento válida.');
 const adult=valid && age>=18;
 const guardian=form.elements.responsavel;
 guardian.required=valid&&!adult;guardian.disabled=!valid||adult;guardian.closest('label').hidden=!valid||adult;
 for(const field of ['email','telefone']){
  const el=form.elements[field];el.disabled=!valid;el.closest('label').hidden=!valid;
  el.closest('label').firstChild.textContent=(field==='email'?'Email':'Telemóvel')+(adult?' do participante':' do encarregado de educação');
 }
 form.elements.idade.value=valid?String(age):'';
 return valid;
}
function checkNif(){
 const v=nif.value.trim(),sum=[...v.slice(0,8)].reduce((t,d,i)=>t+Number(d)*(9-i),0),check=11-sum%11;
 const valid=/^[0-9]{9}$/.test(v)&&Number(v[8])===(check>=10?0:check);
 nif.setCustomValidity(valid?'':'Confirma o NIF: deve ter 9 algarismos e ser válido.');
 return nif.reportValidity();
}
nif.addEventListener('input',()=>nif.setCustomValidity(''));
birth.addEventListener('input',updateAge);
birth.addEventListener('change',updateAge);
function proceed(){return checkNif() && updateAge();}
updateAge();
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

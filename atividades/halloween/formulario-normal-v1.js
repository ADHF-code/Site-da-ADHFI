(() => {
const form=document.querySelector('form[data-registration]');
if(!form)return;
const nif=form.elements.nif_aluno,name=form.elements.participante,birth=form.elements.data_nascimento;
const code=form.elements.adhfi_j,associateCode=form.elements.numero_associado;
const eventDate='2026-10-31';
let mode='new';
function ageAtEvent(){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(birth.value))return null;
 const [y,m,d]=birth.value.split('-').map(Number), date=new Date(Date.UTC(y,m-1,d));
 if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d||birth.value>eventDate)return null;
 const [ey,em,ed]=eventDate.split('-').map(Number);
 return ey-y-(m>em||(m===em&&d>ed)?1:0);
}
function updateAge(){
 const age=ageAtEvent(), valid=age!==null && age>=10 && age<=60;
 birth.setCustomValidity(!birth.value?'':valid?'':'O Halloween é dos 10 aos 60 anos à data do evento.');
 const adult=valid && age>=18;
 const guardian=form.elements.responsavel;
 guardian.required=valid&&!adult;guardian.disabled=!valid||adult;guardian.closest('label').hidden=!valid||adult;
 for(const field of ['email','telefone']){
  const el=form.elements[field];el.disabled=!valid;el.closest('label').hidden=!valid;
  el.closest('label').firstChild.textContent=(field==='email'?'Email':'Telemóvel')+(adult?' do participante':' do encarregado de educação');
 }
 form.elements.tipo_participante.value=valid?(adult?'Adulto':'Menor'):'';
 return valid;
}
function checkNif(){
 const v=nif.value.trim(),sum=[...v.slice(0,8)].reduce((t,d,i)=>t+Number(d)*(9-i),0),check=11-sum%11;
 const valid=/^[0-9]{9}$/.test(v)&&Number(v[8])===(check>=10?0:check);
 nif.setCustomValidity(valid?'':'Confirma o NIF: deve ter 9 algarismos e ser válido.');
 return nif.reportValidity();
}
// Use explicit selectors instead of the platform-specific date calendar.
// Keep the existing ISO field so Netlify submissions and age rules stay compatible.
function simpleBirthDate(){
 const label=birth.closest('label'),group=document.createElement('fieldset');
 group.className='birth-date';
 group.innerHTML='<legend>Data de nascimento do participante</legend><div class="birth-date-fields"><label>Dia<select id="birth-day" required autocomplete="bday-day"><option value="">Dia</option></select></label><label>Mês<select id="birth-month" required autocomplete="bday-month"><option value="">Mês</option></select></label><label>Ano<select id="birth-year" required autocomplete="bday-year"><option value="">Ano</option></select></label></div><p id="birth-error" class="birth-date-error" role="status" hidden></p><span class="field-note">Escolhe o dia, o mês e o ano. Idade considerada em 31 de outubro de 2026: dos 10 aos 60 anos.</span>';
 const day=group.querySelector('#birth-day'),month=group.querySelector('#birth-month'),year=group.querySelector('#birth-year'),error=group.querySelector('#birth-error');
 for(let d=1;d<=31;d++)day.add(new Option(String(d),String(d).padStart(2,'0')));
 ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].forEach((m,i)=>month.add(new Option(m,String(i+1).padStart(2,'0'))));
 const min=birth.min,max=birth.max,initial=birth.value;
 for(let y=Number(max.slice(0,4));y>=Number(min.slice(0,4));y--)year.add(new Option(String(y),String(y)));
 if(initial){const [y,m,d]=initial.split('-');year.value=y;month.value=m;day.value=d;}
 birth.type='hidden';birth.required=false;
 group.append(birth);label.replaceWith(group);
 function sync(){
  const complete=day.value&&month.value&&year.value,value=complete?year.value+'-'+month.value+'-'+day.value:'',date=complete?new Date(Date.UTC(Number(year.value),Number(month.value)-1,Number(day.value))):null;
  let message='';
  if(complete&&date.getUTCDate()!==Number(day.value))message='Esta data não existe. Confirma o dia, o mês e o ano.';
  else if(complete&&(value<min||value>max))message='O participante deve ter entre 10 e 60 anos em 31 de outubro de 2026.';
  day.setCustomValidity(message);day.setAttribute('aria-invalid',String(!!message));
  error.textContent=message;error.hidden=!message;
  birth.value=complete&&!message?value:'';
  birth.dispatchEvent(new Event('input',{bubbles:true}));
 }
 for(const field of [day,month,year]){field.setAttribute('aria-describedby','birth-error');field.addEventListener('change',sync);field.addEventListener('input',sync);}
 form.addEventListener('reset',()=>setTimeout(sync,0));
 // Restore values after browser autofill/back navigation, including hidden-field updates.
 window.addEventListener('pageshow',sync);
 sync();
}
nif.addEventListener('input',()=>nif.setCustomValidity(''));
birth.addEventListener('input',updateAge);
birth.addEventListener('change',updateAge);
simpleBirthDate();
function proceed(){return checkNif() && updateAge();}
updateAge();
form.addEventListener('submit',event=>{if(!checkNif()||!updateAge()){event.preventDefault();birth.reportValidity();}});
})();

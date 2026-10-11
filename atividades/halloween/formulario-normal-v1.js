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
nif.addEventListener('input',()=>nif.setCustomValidity(''));
birth.addEventListener('input',updateAge);
birth.addEventListener('change',updateAge);
function proceed(){return checkNif() && updateAge();}
updateAge();
form.addEventListener('submit',event=>{if(!checkNif()||!updateAge()){event.preventDefault();birth.reportValidity();}});
})();

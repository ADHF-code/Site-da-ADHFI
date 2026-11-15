const labels={adhfi:'ADHFI',cfi:'CFI',ifc:'IFC',mbi:'MBi'};
const params=new URLSearchParams(location.search);
const origin=params.get('origem');
let valencia=labels[params.get('valencia')]?params.get('valencia'):'all';
let period=['upcoming','past'].includes(params.get('periodo'))?params.get('periodo'):'all';
let events=[],selected;
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const past=e=>(e.endDate||e.startDate)<today();
const date=(e,options)=>new Intl.DateTimeFormat('pt-PT',options).format(new Date(e.startDate+'T12:00:00'));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=e=>e.url+(origin&&labels[origin]?'?origem='+encodeURIComponent(origin):'');
const tags=e=>e.labels.map(l=>`<span class="agenda-tag ${l}">${labels[l]}</span>`).join('');
const status=e=>past(e)?'Realizado':e.registrationStatus==='soon'?'Brevemente':e.registrationStatus==='open'?'Inscrições abertas':'Inscrições encerradas';
function card(e){return `<article class="event-card ${past(e)?'is-past':''}" id="event-${e.id}"><div class="event-image"><img src="${escape(e.image)}" alt="${escape(e.title)}" width="960" height="560" loading="lazy"><span class="event-status">${status(e)}</span></div><div class="event-body"><div class="event-topline">${tags(e)}<span>${escape(e.category)}</span></div><h2>${escape(e.title)}</h2><dl><div><dt>Data</dt><dd>${date(e,{day:'numeric',month:'long',year:'numeric'})}</dd></div><div><dt>Hora</dt><dd>${escape(e.time||'A anunciar')}</dd></div><div><dt>Local</dt><dd>${escape(e.location||'A anunciar')}</dd></div><div><dt>Valor</dt><dd>${escape(e.price||'A anunciar')}</dd></div></dl><p>${escape(e.description)}</p>${e.includes.length?`<p class="included"><strong>Inclui</strong> ${e.includes.map(escape).join(' · ')}${e.excludes.length?`<br><strong>Não inclui</strong> ${e.excludes.map(escape).join(' · ')}`:''}</p>`:''}<a class="agenda-action" href="${url(e)}">${past(e)?'Ver atividade realizada':e.registrationStatus==='soon'?'Saber mais':e.registrationStatus==='open'?'Ver atividade e inscrever':'Ver atividade'} <span aria-hidden="true">↗</span></a></div></article>`}
function render(){
 const visible=events.filter(e=>(valencia==='all'||e.labels.includes(valencia))&&(period==='all'||(period==='past'?past(e):!past(e))));
 if(!visible.some(e=>e.id===selected))selected=(visible.find(e=>!past(e))||visible[0])?.id;
 document.querySelectorAll('[data-valencia]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.valencia===valencia)));
 document.querySelectorAll('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.period===period)));
 document.querySelector('#event-count').textContent=`${visible.length} ${visible.length===1?'experiência':'experiências'}`;
 document.querySelector('#empty').hidden=!!visible.length;
 document.querySelector('#desktop-agenda').hidden=!visible.length;
 const months=[...new Set(visible.map(e=>e.startDate.slice(0,7)))];
 document.querySelector('#month-select').innerHTML=months.map(m=>`<option value="${m}" ${visible.find(e=>e.id===selected)?.startDate.startsWith(m)?'selected':''}>${date({startDate:m+'-01'},{month:'long',year:'numeric'})}</option>`).join('');
 document.querySelector('#timeline').innerHTML=visible.map((e,i)=>`<button type="button" class="timeline-stop ${past(e)?'is-past':''}" data-event="${e.id}" aria-pressed="${e.id===selected}"><span class="stop-month">${i===0||visible[i-1].startDate.slice(0,7)!==e.startDate.slice(0,7)?date(e,{month:'short',year:'numeric'}):' '}</span><span class="stop-day">${date(e,{day:'2-digit'})}</span><span class="stop-dot"></span><span class="stop-title">${escape(e.title)}</span></button>`).join('');
 document.querySelector('#event-panel').innerHTML=selected?card(visible.find(e=>e.id===selected)):'';
 document.querySelector('#mobile-agenda').innerHTML=months.map(m=>`<section class="mobile-month"><h2>${date({startDate:m+'-01'},{month:'long',year:'numeric'})}</h2>${visible.filter(e=>e.startDate.startsWith(m)).map(e=>`<div class="mobile-event"><div class="mobile-date">${date(e,{day:'2-digit',month:'short'})} <span>${past(e)?'· Realizado':''}</span></div>${card(e)}</div>`).join('')}</section>`).join('');
 const history=events.filter(past).filter(e=>valencia==='all'||e.labels.includes(valencia));
 document.querySelector('#history').hidden=!history.length||period==='upcoming';
 document.querySelector('#history-list').innerHTML=history.map(e=>`<a href="${url(e)}"><span>${date(e,{day:'numeric',month:'short',year:'numeric'})}</span><strong>${escape(e.title)}</strong><span>Realizado ↗</span></a>`).join('');
 const q=new URLSearchParams(location.search);valencia==='all'?q.delete('valencia'):q.set('valencia',valencia);period==='all'?q.delete('periodo'):q.set('periodo',period);historyReplace(q);
}
function historyReplace(q){window.history.replaceState(null,'',location.pathname+(q.size?'?'+q:''));}
document.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;if(b.dataset.valencia){valencia=b.dataset.valencia;render()}if(b.dataset.period){period=b.dataset.period;render()}if(b.dataset.event){selected=b.dataset.event;render();document.querySelector(`[data-event="${selected}"]`)?.focus({preventScroll:true})}if(b.dataset.direction){const buttons=[...document.querySelectorAll('[data-event]')];const index=buttons.findIndex(b=>b.dataset.event===selected);const next=buttons[Math.max(0,Math.min(buttons.length-1,index+Number(b.dataset.direction)))];if(next){selected=next.dataset.event;render();document.querySelector(`[data-event="${selected}"]`).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest',inline:'center'})}}});
document.querySelector('#month-select').addEventListener('change',ev=>{selected=events.find(e=>e.startDate.startsWith(ev.target.value)&&(valencia==='all'||e.labels.includes(valencia))&&(period==='all'||(period==='past'?past(e):!past(e))))?.id;render();document.querySelector(`[data-event="${selected}"]`)?.scrollIntoView({block:'nearest',inline:'center'})});
fetch('/agenda/events.json').then(r=>{if(!r.ok)throw Error('agenda');return r.json()}).then(data=>{events=data.events.sort((a,b)=>a.startDate.localeCompare(b.startDate));document.querySelector('#loading').hidden=true;render()}).catch(()=>{document.querySelector('#loading').innerHTML='Não foi possível carregar a agenda. <a href="/atividades/kidzania/">Ver KidZania</a> · <a href="/atividades/banquete-natal/">Ver Banquete de Natal</a>';});

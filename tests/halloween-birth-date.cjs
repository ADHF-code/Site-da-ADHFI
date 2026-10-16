const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('atividades/halloween/index.html','utf8');
const script=fs.readFileSync('atividades/halloween/formulario-normal-v1.js','utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://adhfi.netlify.app/atividades/halloween/?origem=cfi'});
const w=dom.window;w.eval(script);
const doc=w.document,form=doc.querySelector('form'),birth=form.elements.data_nascimento;
const day=doc.querySelector('#birth-day'),month=doc.querySelector('#birth-month'),year=doc.querySelector('#birth-year');
function choose(d,m,y){for(const [field,value]of [[day,d],[month,m],[year,y]]){field.value=value;field.dispatchEvent(new w.Event('change',{bubbles:true}));}}
assert.equal(birth.type,'hidden');assert.equal(month.options[1].text,'Janeiro');assert.equal(month.options[12].text,'Dezembro');assert.equal(day.options.length,32);
assert.equal(day.required,true);assert.equal(month.required,true);assert.equal(year.required,true);assert.equal(day.checkValidity(),false);
choose('29','02','2012');assert.equal(birth.value,'2012-02-29');assert.equal(day.checkValidity(),true);assert.equal(form.elements.responsavel.disabled,false);assert.equal(form.elements.tipo_participante.value,'Menor');assert.equal(new w.FormData(form).get('data_nascimento'),'2012-02-29');
choose('29','02','2011');assert.equal(birth.value,'');assert.equal(day.checkValidity(),false);assert.equal(doc.querySelector('#birth-error').hidden,false);
choose('31','04','2010');assert.equal(day.checkValidity(),false);
choose('31','10','2016');assert.equal(birth.value,'2016-10-31');assert.equal(day.checkValidity(),true);
choose('01','11','2016');assert.equal(birth.value,'');assert.equal(day.checkValidity(),false);
choose('01','11','1965');assert.equal(birth.value,'1965-11-01');assert.equal(form.elements.tipo_participante.value,'Adulto');assert.equal(form.elements.responsavel.disabled,true);
choose('31','10','1965');assert.equal(birth.value,'');assert.equal(day.checkValidity(),false);
choose('16','10','2000');assert.equal(form.elements.email.disabled,false);assert.equal(form.elements.responsavel.required,false);assert.equal(form.elements.tipo_participante.value,'Adulto');
choose('16','10','2012');assert.equal(form.elements.responsavel.required,true);assert.equal(form.elements.responsavel.disabled,false);
choose('','10','2012');assert.equal(birth.value,'');assert.equal(day.checkValidity(),false);assert.equal(month.options.length,13);
assert.equal(form.name,'halloween-2026');assert.equal(form.method,'post');assert.equal(form.elements['form-name'].value,'halloween-2026');assert.equal(doc.querySelectorAll('[name="data_nascimento"]').length,1);
// Without JavaScript the original native date field remains available.
const fallback=new JSDOM(html).window.document.querySelector('[name="data_nascimento"]');assert.equal(fallback.type,'date');assert.equal(fallback.required,true);
console.log('Halloween birth date passed: explicit day/month/year, ISO payload, required fields, leap years, age boundaries, adult/minor contacts and no-JS fallback. No submissions sent.');

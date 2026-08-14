const CONFIG = {
  // Replace these placeholder details before launch.
  email: 'hello@veltrodigital.co.uk',
  phoneDisplay: 'Phone number — add before launch',
  phoneHref: '',
  businessHours: 'Monday–Friday, 9:00–17:30',
  formEndpoint: '/api/contact'
};

document.querySelectorAll('[data-email]').forEach(el=>{el.textContent=CONFIG.email;if(el.tagName==='A')el.href='mailto:'+CONFIG.email});
document.querySelectorAll('[data-phone]').forEach(el=>{el.textContent=CONFIG.phoneDisplay;if(el.tagName==='A' && CONFIG.phoneHref)el.href='tel:'+CONFIG.phoneHref});
document.querySelectorAll('[data-hours]').forEach(el=>el.textContent=CONFIG.businessHours);
const menu=document.querySelector('.menu-btn'), nav=document.querySelector('.nav-links');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});}

document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// Preselect a service when visitors arrive from a package CTA.
const serviceSelect=document.querySelector('#service');
if(serviceSelect){
  const serviceMap={
    'new-website':'A brand new website',
    'refresh':'Website refresh',
    'google':'Google Business Profile setup',
    'bundle':'The Small Business Bundle',
    'hosting':'Domain & Hosting (managed)',
    'care':'Monthly Care Plan'
  };
  const requested=new URLSearchParams(window.location.search).get('service');
  if(requested && serviceMap[requested]) serviceSelect.value=serviceMap[requested];
}

const form=document.querySelector('#contact-form');
if(form){
  const status=document.querySelector('#form-status');
  form.addEventListener('submit',async e=>{
    e.preventDefault(); status.className='form-status'; status.textContent='Sending…'; status.style.display='block';
    const payload=Object.fromEntries(new FormData(form).entries());
    try{
      const res=await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const body=await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(body.error||'Unable to send your message.');
      status.className='form-status ok';status.textContent='Thanks — your message has been received. We’ll respond within 24 hours.';form.reset();
    }catch(err){
      // Local/static preview fallback keeps the lead in the browser so no data is lost while backend is not configured.
      const saved=JSON.parse(localStorage.getItem('veltroDraftInquiries')||'[]'); saved.push({...payload,savedAt:new Date().toISOString()}); localStorage.setItem('veltroDraftInquiries',JSON.stringify(saved));
      status.className='form-status err';status.innerHTML='We could not send this online yet. Your details were saved in this browser. Please email <a href="mailto:'+CONFIG.email+'">'+CONFIG.email+'</a> instead.';
    }
  });
}

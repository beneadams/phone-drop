const O='beneadams',R='3D-Prints',B='main',K='pd:tk',F='pd:fo',A='https://api.github.com/repos/'+O+'/'+R;
const $=i=>document.getElementById(i),tok=()=>localStorage.getItem(K)||'';
const H=t=>({Authorization:'Bearer '+t,Accept:'application/vnd.github+json'});
const en=p=>p.split('/').map(encodeURIComponent).join('/');
const mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e};
let P=[];
function ui(){const h=!!tok();$('setup').open=!h;$('st').textContent=h?'GitHub key saved on this phone':'One-time setup: GitHub key';$('go').disabled=!(h&&P.some(p=>!p.d))}
$('fo').value=localStorage.getItem(F)||'Good Work';
$('sv').onclick=async()=>{const t=$('tk').value.trim(),s=$('ts');if(!t){s.textContent='Paste the key first.';return}s.textContent='Checking...';try{const r=await fetch(A,{headers:H(t)});if(!r.ok){s.textContent='GitHub refused that key ('+r.status+'). Check it can see 3D-Prints.';return}localStorage.setItem(K,t);$('tk').value='';s.textContent='Saved. This phone can upload now.';ui()}catch(e){s.textContent='Could not reach GitHub.'}};
$('fg').onclick=()=>{localStorage.removeItem(K);$('ts').textContent='Key removed.';ui()};
$('fi').onchange=e=>{P=[...e.target.files].map(f=>{const li=mk('li');li.append(mk('div','n',f.name),mk('div','m',(f.size/1048576).toFixed(2)+' MB, ready'),mk('div'));return{f,li,d:0}});$('q').replaceChildren(...P.map(p=>p.li));ui()};
const b64=f=>new Promise((y,n)=>{const r=new FileReader();r.onload=()=>y(r.result.split(',')[1]);r.onerror=()=>n(Error('Could not read the file.'));r.readAsDataURL(f)});
function put(path,c,t,m){return new Promise((y,n)=>{const x=new XMLHttpRequest();x.open('PUT',A+'/contents/'+en(path));const h=H(t);for(const k in h)x.setRequestHeader(k,h[k]);x.upload.onprogress=e=>{if(e.lengthComputable)m.textContent='Uploading '+Math.round(e.loaded/e.total*100)+'%'};x.onload=()=>{let j={};try{j=JSON.parse(x.responseText)}catch(e){}if(x.status<300)y(j);else n(Error('GitHub answered '+x.status+(j.message?': '+j.message:'')))};x.onerror=()=>n(Error('Upload stopped. Tap Upload again.'));x.send(JSON.stringify({message:'Upload '+path.split('/').pop()+' from phone',content:c,branch:B}))})}
$('go').onclick=async()=>{const t=tok(),fo=$('fo').value.trim().replace(/^\/+|\/+$/g,'');localStorage.setItem(F,fo);$('go').disabled=true;
for(const p of P){if(p.d)continue;const m=p.li.children[1],a=p.li.children[2],nm=p.f.name;m.className='m';
try{m.textContent='Reading...';const c=await b64(p.f);let path=(fo?fo+'/':'')+nm;
const ex=await fetch(A+'/contents/'+en(path)+'?ref='+B,{headers:H(t),cache:'no-store'});
if(ex.ok){const s=new Date().toISOString().slice(0,19).replace(/[T:]/g,'-'),i=nm.lastIndexOf('.');path=(fo?fo+'/':'')+(i>0?nm.slice(0,i)+' '+s+nm.slice(i):nm+' '+s)}
const j=await put(path,c,t,m);p.d=1;const u=j.content.html_url;m.textContent='Saved: '+path;
const cp=mk('button','g','Copy link'),op=mk('a','b g','Open on GitHub');op.href=u;op.target='_blank';cp.onclick=()=>navigator.clipboard.writeText(u).then(()=>{cp.textContent='Copied'});a.replaceChildren(cp,op);
if(navigator.share){const s=mk('button','g','Share');s.onclick=()=>navigator.share({url:u}).catch(()=>{});a.append(s)}}catch(e){m.className='m e';m.textContent=e.message}}ui()};
ui();

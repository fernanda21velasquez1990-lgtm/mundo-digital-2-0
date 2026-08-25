(()=>{"use strict";const A=window.MD20AdminAPI,$=s=>document.querySelector(s);let regs=[];
function nav(){const m=$("#menuLateral"),c=$("#capaOscura");$("#botonAbrirMenu")?.addEventListener("click",()=>{m?.classList.add("abierto");c?.classList.add("visible")});$("#botonCerrarMenu")?.addEventListener("click",()=>{m?.classList.remove("abierto");c?.classList.remove("visible")});c?.addEventListener("click",()=>$("#botonCerrarMenu")?.click())}
function grupo(k){k=k.toUpperCase();if(/NOMBRE_NEGOCIO|WHATSAPP|CORREO_NEGOCIO|URL_VERCEL/.test(k))return"Negocio y contacto";if(/MONEDA|PAGO|ENTREGA|AVISO|COMPROBANTE|TASA|PRECIO_BS/.test(k))return"Ventas y pagos";if(/COLOR|TAMANO_LETRA_PANEL|TIPO_LETRA_PANEL|EMOJI/.test(k))return"Apariencia y lectura";return"Sistema"}
function selectOpciones(clave,valor){
  const k=String(clave||'').toUpperCase(),v=String(valor||'').toUpperCase();
  if(k==='TAMANO_LETRA_PANEL'){
    const opts=[['COMPACTO','Compacto'],['NORMAL','Normal'],['GRANDE','Grande (recomendado)'],['MUY_GRANDE','Muy grande']];
    return `<select class="admin-select config-control visual-control" data-clave="${A.esc(clave)}">${opts.map(([x,t])=>`<option value="${x}" ${v===x?'selected':''}>${t}</option>`).join('')}</select>`;
  }
  if(k==='TIPO_LETRA_PANEL'){
    const opts=[['SISTEMA','Sistema / Segoe UI'],['ARIAL','Arial'],['VERDANA','Verdana'],['TREBUCHET','Trebuchet MS'],['GEORGIA','Georgia']];
    return `<select class="admin-select config-control visual-control" data-clave="${A.esc(clave)}">${opts.map(([x,t])=>`<option value="${x}" ${v===x?'selected':''}>${t}</option>`).join('')}</select>`;
  }
  return '';
}
function input(r){
  const especial=selectOpciones(r.clave,r.valor);if(especial)return especial;
  if(!r.editable)return `<div class="config-readonly">${A.esc(r.valor||'—')}</div>`;
  if(["BOOLEANO","SI_NO"].includes(r.tipo))return `<select class="admin-select config-control ${String(r.clave).toUpperCase()==='MOSTRAR_EMOJIS_PANEL'?'visual-control':''}" data-clave="${A.esc(r.clave)}"><option value="SI" ${String(r.valor).toUpperCase()==='SI'?'selected':''}>SI</option><option value="NO" ${String(r.valor).toUpperCase()==='NO'?'selected':''}>NO</option></select>`;
  if(r.tipo==="COLOR")return `<div style="display:grid;grid-template-columns:52px 1fr;gap:8px"><input type="color" class="admin-input config-color" data-clave="${A.esc(r.clave)}" value="${/^#[0-9a-f]{6}$/i.test(r.valor)?A.esc(r.valor):'#ff6d00'}" style="padding:5px"><input class="admin-input config-control" data-clave="${A.esc(r.clave)}" value="${A.esc(r.valor)}"></div>`;
  if(String(r.clave).toUpperCase()==='EMOJI_PANEL')return `<input class="admin-input config-control visual-control" maxlength="8" data-clave="${A.esc(r.clave)}" value="${A.esc(r.valor)}" placeholder="Ejemplo: ✨">`;
  const type=r.tipo==="CORREO"?"email":r.tipo==="NUMERO"?"text":"text";return `<input type="${type}" class="admin-input config-control" data-clave="${A.esc(r.clave)}" value="${A.esc(r.valor)}">`
}
function prefsVisualesActuales(){
  const val=clave=>document.querySelector(`.config-control[data-clave="${clave}"]`)?.value;
  return {tamano:val('TAMANO_LETRA_PANEL')||'GRANDE',fuente:val('TIPO_LETRA_PANEL')||'SISTEMA',emojis:val('MOSTRAR_EMOJIS_PANEL')||'SI',emoji:val('EMOJI_PANEL')??'✨'};
}
function aplicarPreview(){if(window.MD20UI)window.MD20UI.aplicar(prefsVisualesActuales(),false)}
function render(){const groups={};regs.forEach(r=>(groups[grupo(r.clave)]??=[]).push(r));const desc={"Negocio y contacto":"Identidad y canales principales.","Ventas y pagos":"Comportamiento comercial y cobros.","Apariencia y lectura":"Colores, tamaño y tipo de letra, y emojis del panel.","Sistema":"Preferencias generales no sensibles."};$("#configGrid").innerHTML=Object.entries(groups).map(([g,items])=>`<article class="config-group"><div class="config-group-head"><h4>${A.esc(g)}</h4><p>${A.esc(desc[g]||'Ajustes del sistema.')}</p></div><div class="config-list">${items.map(r=>`<div class="config-item"><div class="config-copy"><strong>${A.esc(r.clave.replaceAll('_',' '))}</strong><small>${A.esc(r.descripcion||'Sin descripción')} · ${r.editable?'Editable':'Solo lectura'}</small></div><div>${input(r)}</div></div>`).join('')}</div></article>`).join('');
document.querySelectorAll('.config-color').forEach(c=>c.addEventListener('input',()=>{const txt=c.parentElement.querySelector('.config-control');if(txt)txt.value=c.value}));
document.querySelectorAll('.visual-control').forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',aplicarPreview));
$("#kConfigTotal").textContent=regs.length;$("#kConfigEdit").textContent=regs.filter(r=>r.editable).length;aplicarPreview()}
async function cargar(){try{const d=await A.get("listarConfiguracionAdminMD20");regs=d.registros||[];render();if(window.MD20UI)window.MD20UI.aplicar(window.MD20UI.preferenciasDesdeRegistros(regs),true);A.toast("Configuración sincronizada.")}catch(e){A.toast(e.message,"error")}}
async function guardar(){const cambios=[];document.querySelectorAll('.config-control').forEach(el=>cambios.push({clave:el.dataset.clave,valor:el.value}));try{const d=await A.post("guardarConfiguracionAdminMD20",{registros:cambios});regs=d.registros||regs;render();if(window.MD20UI)window.MD20UI.aplicar(window.MD20UI.preferenciasDesdeRegistros(regs),true);A.toast(`Configuración guardada: ${d.guardadas??cambios.length} ajuste(s).`)}catch(e){A.toast(e.message,"error")}}
nav();$("#botonActualizar")?.addEventListener("click",cargar);$("#btnGuardarConfig")?.addEventListener("click",guardar);cargar();})();
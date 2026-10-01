const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const menuBtn = $("#menuBtn"), nav = $("#nav");
menuBtn?.addEventListener("click", () => nav.classList.toggle("open"));
$$("nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const modal = $("#bookingModal"), form = $("#bookingForm"), success = $("#success");
function openBooking(prefill=""){
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
  if(prefill){ $("#service").value = prefill.toLowerCase().includes("guide") ? "Eco-guide" : prefill.toLowerCase().includes("stay") ? "Accommodation" : prefill.toLowerCase().includes("product") ? "Local products" : "Eco experience"; $("#message").value = `I am interested in: ${prefill}`; }
  setTimeout(()=>$("#name")?.focus(),100);
}
function closeBooking(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
$$("[data-open-booking]").forEach(b=>b.addEventListener("click",()=>openBooking()));
$("#closeModal")?.addEventListener("click",closeBooking);
modal?.addEventListener("click",e=>{if(e.target===modal)closeBooking()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBooking()});

$$("[data-experience]").forEach(b=>b.addEventListener("click",()=>openBooking(b.dataset.experience)));
$$("[data-stay]").forEach(b=>b.addEventListener("click",()=>openBooking(b.dataset.stay)));
$$("[data-product]").forEach(b=>b.addEventListener("click",()=>openBooking(b.dataset.product)));

form?.addEventListener("submit",e=>{
  e.preventDefault();
  const data={name:$("#name").value,contact:$("#contact").value,area:$("#area").value,service:$("#service").value,date:$("#date").value,message:$("#message").value,created:new Date().toISOString()};
  const old=JSON.parse(localStorage.getItem("ecolinkRequests")||"[]"); old.push(data);
  localStorage.setItem("ecolinkRequests",JSON.stringify(old));
  form.hidden=true; success.hidden=false;
});

const topBtn=$("#topBtn");
window.addEventListener("scroll",()=>topBtn.style.display=scrollY>500?"block":"none");
topBtn.onclick=()=>scrollTo({top:0,behavior:"smooth"});

let deferredPrompt;
const installBtn=$("#installBtn");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});
installBtn?.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true});

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));

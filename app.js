const params = new URLSearchParams(location.search);
const amount = params.get("amntInput") || params.get("amount") || "";
const name = params.get("nameInput") || params.get("name") || "";
const vpa = params.get("vpaInput") || params.get("vpa") || "";

const $ = id => document.getElementById(id);
$("amount").textContent = amount ? formatAmount(amount) : "Not provided";
$("payeeName").textContent = name || "Not provided";
$("vpa").textContent = vpa || "Not provided";

function formatAmount(v){
  const n = Number(String(v).replace(/,/g,""));
  return Number.isFinite(n) ? n.toLocaleString(undefined,{maximumFractionDigits:2}) : v;
}

document.querySelectorAll("[data-copy]").forEach(btn=>{
  btn.addEventListener("click", async ()=>{
    const value = $(btn.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(value); btn.textContent="Copied"; setTimeout(()=>btn.textContent="Copy",1200); }
    catch { alert("Copy is unavailable. Please select and copy manually."); }
  });
});

$("closeNotice").onclick=()=> $("notice").remove();

let seconds=360;
const timer=setInterval(()=>{
  seconds=Math.max(0,seconds-1);
  $("timer").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  if(seconds===0) clearInterval(timer);
},1000);

$("upiButton").onclick=()=>{
  if(!vpa || !amount){ alert("Payment details are not available in this link."); return; }
  const uri=`upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amount)}&cu=INR`;
  location.href=uri;
};

$("submitBtn").onclick=()=>{
  const utr=$("utr").value.trim();
  $("utrError").hidden=true;
  if(!/^[A-Za-z0-9]{6,30}$/.test(utr)){
    $("utrError").textContent="Please enter the reference/UTR exactly as shown on your bank/UPI receipt.";
    $("utrError").hidden=false; return;
  }
  $("submittedUtr").textContent=utr;
  document.querySelector(".steps").hidden=true;
  $("result").hidden=false;

  // Legitimate demo behavior: stores locally only.
  // Replace this with your own authenticated HTTPS backend/API before production.
  localStorage.setItem("lastPaymentReference", JSON.stringify({
    amount, name, vpa, utr, submittedAt:new Date().toISOString()
  }));
};

$("newBtn").onclick=()=>{
  $("utr").value="";
  $("result").hidden=true;
  document.querySelector(".steps").hidden=false;
};

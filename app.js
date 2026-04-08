// ---------------------------
// HELPER FUNCTIONS
// ---------------------------
function get(id){ return parseInt(document.getElementById(id).innerText) || 0; }
function set(id,val){ document.getElementById(id).innerText = Math.max(val,0); }

// Animated change function for counters
function change(id, amt) {
  const staticWipe = document.getElementById('staticWipe').checked;
  if (staticWipe && ['ready','sick','tapped'].includes(id)) return;

  let el = document.getElementById(id);
  let start = get(id);
  let end = Math.max(start + amt, 0);

  if (start === end) return;

  const step = amt > 0 ? 1 : -1;
  const interval = 100; // ms per increment, slower

  el.classList.add(amt > 0 ? 'increase' : 'decrease');

  const timer = setInterval(() => {
    start += step;
    el.innerText = start;
    if (['ready','sick','tapped'].includes(id)) updateTotalBugs();
    if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
      clearInterval(timer);
      el.classList.remove('increase', 'decrease');
    }
  }, interval);
}

// ---------------------------
// GRIST FUNCTIONS
// ---------------------------
function gristPlus(){
  let n = parseInt(prompt("How many times resolve +1?"));
  if(isNaN(n)||n<1) return;

  const enterTapped = document.getElementById('enterTapped').checked;
  const haste = document.getElementById('hasteToggle').checked;
  const staticWipe = document.getElementById('staticWipe').checked;
  const staticExile = document.getElementById('staticExile').checked;

  if(!staticWipe){
    if(enterTapped){
      change('tapped', n);
    } else if(haste){
      change('ready', n);
    } else {
      change('sick', n);
    }
  }

  change('loyalty', n);

  if(!staticExile){
    change('grave', n-1);
  }
}

function customGristSub(){
  let n = parseInt(prompt("Reduce loyalty by how much?"));
  if(isNaN(n)||n<1) return;
  change('loyalty', -n);
}

function gristUlt(){
  if(get('loyalty') < 5){ alert("Not enough loyalty!"); return; }
  change('loyalty', -5);

  const g = get('grave');
  const o = document.getElementById('ultOverlay');
  o.innerHTML = `<div>GRIST ULTIMATE!<br>${g} creatures consumed!</div>`;
  o.style.display = "block";
  setTimeout(()=> o.style.display="none", 3000);
}

function resetGrist(){ change('loyalty', 3 - get('loyalty')); }
function newGame(){
  ['loyalty','grave','ready','sick','tapped'].forEach((id,i)=>{ set(id, i===0?3:0); });
}

// ---------------------------
// GRAVEYARD FUNCTIONS
// ---------------------------
function addGrave(){
  if(document.getElementById('staticExile').checked) return;
  change('grave',1);
}
function addGravePrompt(){
  if(document.getElementById('staticExile').checked) return;
  let n = parseInt(prompt("Add how many creatures to graveyard?"));
  if(isNaN(n)||n<1) return;
  change('grave', n);
}
function removeGrave(){ change('grave', -1); }
function removeGravePrompt(){
  let n = parseInt(prompt("Remove how many creatures?"));
  if(isNaN(n)||n<1) return;
  change('grave', -n);
}
function exileGrave(){ set('grave',0); }

// ---------------------------
// INSECTS FUNCTIONS
// ---------------------------
function tapReady(){
  if(get('ready')>0){
    change('ready', -1);
    change('tapped', 1);
  }
}
function untapOne(){
  if(get('tapped')>0){
    change('tapped', -1);
    change('ready', 1);
  }
}
function nextTurn(){
  const total = get('ready') + get('sick') + get('tapped');
  set('ready', total);
  set('sick',0);
  set('tapped',0);
  updateTotalBugs();
}
function boardWipe(){
  set('ready',0);
  set('sick',0);
  set('tapped',0);
  updateTotalBugs();
}

// ---------------------------
// TOTAL BUGS COUNTER
// ---------------------------
function updateTotalBugs(){
  const total = get('ready') + get('sick') + get('tapped');
  set('totalBugs', total);
}

// ---------------------------
// STATIC WIPE TOGGLE: ZERO BUGS ON ENABLE
// ---------------------------
document.getElementById('staticWipe').addEventListener('change', function () {
  if(this.checked){
    set('ready',0);
    set('sick',0);
    set('tapped',0);
    updateTotalBugs();
  }
});

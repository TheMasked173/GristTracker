// Generic counter functions
function change(id, amt) {
  let el = document.getElementById(id);
  let val = parseInt(el.innerText) + amt;
  if (val < 0) val = 0;
  el.innerText = val;
}
function get(id){return parseInt(document.getElementById(id).innerText);}
function set(id,val){document.getElementById(id).innerText=Math.max(val,0);}

// GRIST FUNCTIONS
function gristPlus(){
  let n = parseInt(prompt("How many times resolve +1?"));
  if(isNaN(n) || n<1) return;

  let enterTapped = document.getElementById('enterTapped').checked;
  if(enterTapped){set('tapped',get('tapped')+n);}
  else{set('sick',get('sick')+n);}

  change('loyalty', n);
  change('grave', n-1);
}

function gristUlt(){
  if(get('loyalty') < 5){alert("Not enough loyalty!"); return;}
  change('loyalty', -5);

  let grave = get('grave');
  let overlay = document.getElementById('ultOverlay');
  overlay.innerHTML = `<div>GRIST ULTIMATE!<br>${grave} creatures in graveyard consumed!</div>`;
  overlay.style.display = "block";
  setTimeout(()=>{ overlay.style.display="none"; }, 3000);
}

function resetGrist(){ set('loyalty', 3); }
function newGame(){
  set('loyalty',3);
  set('grave',0);
  set('ready',0);
  set('sick',0);
  set('tapped',0);
}

// GRAVEYARD FUNCTIONS
function addGrave() { change('grave', 1); }
function addGravePrompt() {
  let n = parseInt(prompt("How many creatures to add to graveyard?"));
  if(isNaN(n) || n<1) return;
  change('grave', n);
}
function removeGrave() { change('grave', -1); }
function removeGravePrompt() {
  let n = parseInt(prompt("How many creatures to remove from graveyard?"));
  if(isNaN(n) || n<1) return;
  change('grave', -n);
}
function exileGrave(){ set('grave',0); }

// INSECT FUNCTIONS
function tapReady(){
  if(get('ready')>0){set('ready',get('ready')-1); set('tapped',get('tapped')+1);}
}
function untapOne(){
  if(get('tapped')>0){set('tapped',get('tapped')-1); set('ready',get('ready')+1);}
}
function nextTurn(){
  let totalReady = get('ready') + get('tapped') + get('sick');
  set('ready', totalReady);
  set('tapped',0);
  set('sick',0);
}
function boardWipe(){
  set('ready',0);
  set('sick',0);
  set('tapped',0);
}
// -------------------
// UTILITY FUNCTIONS
// -------------------
function get(id){ return parseInt(document.getElementById(id).innerText) || 0; }
function set(id,val){ document.getElementById(id).innerText = Math.max(val,0); }

// -------------------
// TOTAL BUGS UPDATE
// -------------------
function updateTotalBugs() {
  const ready = get('ready');
  const sick = get('sick');
  const tapped = get('tapped');
  set('totalBugs', ready + sick + tapped);
}

// -------------------
// GLOBAL CHANGE FUNCTION (blocks changes if static board wipe is ON)
// -------------------
function change(id, amt) {
  const staticWipe = document.getElementById('staticWipe').checked;
  if (staticWipe && ['ready','sick','tapped'].includes(id)) return;

  let el = document.getElementById(id);
  let val = get(id) + amt;
  set(id, val);

  if (['ready','sick','tapped'].includes(id)) updateTotalBugs();
}

// -------------------
// GRIST FUNCTIONS
// -------------------
function gristPlus(){
  let n = parseInt(prompt("How many times resolve +1?"));
  if(isNaN(n)||n<1) return;

  const enterTapped = document.getElementById('enterTapped').checked;
  const haste = document.getElementById('hasteToggle').checked;
  const staticWipe = document.getElementById('staticWipe').checked;
  const staticExile = document.getElementById('staticExile').checked;

  if(!staticWipe){
    if(enterTapped){
      set('tapped', get('tapped') + n);
    } else if(haste){
      set('ready', get('ready') + n);
    } else {
      set('sick', get('sick') + n);
    }
    updateTotalBugs();
  }

  change('loyalty', n);

  if(!staticExile){
    change('grave', n-1);
  }
}

function customGristSub(){
  let n = parseInt(prompt("Reduce Grist Loyalty by how much?"));
  if(isNaN(n)||n<1) return;
  change('loyalty', -n);
}

function gristUlt(){
  if(get('loyalty')<5){alert("Not enough loyalty!"); return;}
  change('loyalty', -5);

  let g = get('grave');
  let overlay = document.getElementById('ultOverlay');
  overlay.innerHTML = `<div>GRIST ULTIMATE!<br>${g} creatures consumed!</div>`;
  overlay.style.display = "block";
  setTimeout(()=>overlay.style.display="none",3000);
}

function resetGrist(){ set('loyalty', 3); }

function newGame(){
  set('loyalty',3);
  set('grave',0);
  set('ready',0);
  set('sick',0);
  set('tapped',0);
  updateTotalBugs();
}

// -------------------
// GRAVEYARD FUNCTIONS
// -------------------
function addGrave(){
  if(document.getElementById('staticExile').checked) return;
  change('grave',1);
}
function addGravePrompt(){
  if(document.getElementById('staticExile').checked) return;
  let n = parseInt(prompt("Add how many?"));
  if(isNaN(n)||n<1) return;
  change('grave', n);
}
function removeGrave(){ change('grave', -1); }
function removeGravePrompt(){
  let n = parseInt(prompt("Remove how many?"));
  if(isNaN(n)||n<1) return;
  change('grave', -n);
}
function exileGrave(){ set('grave',0); }

// -------------------
// INSECT FUNCTIONS
// -------------------
function tapReady(){
  if(get('ready')>0){
    set('ready', get('ready')-1);
    set('tapped', get('tapped')+1);
    updateTotalBugs();
  }
}
function untapOne(){
  if(get('tapped')>0){
    set('tapped', get('tapped')-1);
    set('ready', get('ready')+1);
    updateTotalBugs();
  }
}
function nextTurn(){
  let total = get('ready') + get('sick') + get('tapped');
  set('ready', total);
  set('tapped',0);
  set('sick',0);
  updateTotalBugs();
}
function boardWipe(){
  set('ready',0);
  set('sick',0);
  set('tapped',0);
  updateTotalBugs();
}

// -------------------
// TOGGLE EVENT LISTENERS
// -------------------
document.addEventListener('DOMContentLoaded', function() {
  // Static Board Wipe: zero all bugs immediately when toggled ON
  document.getElementById('staticWipe').addEventListener('change', function(){
    if(this.checked){
      set('ready',0);
      set('sick',0);
      set('tapped',0);
      updateTotalBugs();
    }
  });

  // Optionally: you could add more listeners here for other toggles if needed
});

// -------------------- GLOBAL --------------------
let gristUsedThisTurn = false;

function get(id){return parseInt(document.getElementById(id).innerText);}
function set(id,val){document.getElementById(id).innerText=Math.max(val,0);}
function animateCount(id){
  const el = document.getElementById(id);
  el.classList.remove('pop');
  void el.offsetWidth; // force reflow
  el.classList.add('pop');
}

// -------------------- GLOBAL CHANGE --------------------
function change(id, amt) {
  const staticWipe = document.getElementById('staticWipe').checked;
  if (staticWipe && ['ready','sick','tapped'].includes(id)) return;

  let el = document.getElementById(id);
  let val = parseInt(el.innerText) + amt;
  if (val < 0) val = 0;
  el.innerText = val;

  if(['ready','sick','tapped','loyalty','grave'].includes(id)) animateCount(id);
  if(['ready','sick','tapped'].includes(id)) updateTotalBugs();
}

// -------------------- GRIST --------------------
function gristPlus() {
  if(gristUsedThisTurn){
    showGristPopup();
    return;
  }

  let n = parseInt(prompt("INFESTATION COUNT?"));
  if (isNaN(n) || n < 1) return;

  const enterTapped = document.getElementById('enterTapped').checked;
  const haste = document.getElementById('hasteToggle').checked;
  const staticWipe = document.getElementById('staticWipe').checked;
  const staticExile = document.getElementById('staticExile').checked;

  let count = 0;
  const interval = setInterval(() => {
    if (count >= n) {
      clearInterval(interval);
      gristUsedThisTurn = true; // lock after finishing
      return;
    }
    count++;

    // Animate insects
    if (!staticWipe){
      if (enterTapped) set('tapped', get('tapped') + 1);
      else if (haste) set('ready', get('ready') + 1);
      else set('sick', get('sick') + 1);
    }

    change('loyalty', 1);

    // Increment grave only for first n-1 steps
    if(!staticExile && count <= n - 1) change('grave', 1);

  }, 200);
}

// -------------------- -2 Grist Ability --------------------
function gristMinus2() {
  if(gristUsedThisTurn){
    showGristPopup();
    return;
  }
  change('loyalty', -2);
  gristUsedThisTurn = true; // lock Grist abilities this turn
}

// -------------------- Custom - (does NOT lock) --------------------
function customGristSub(){
  let n = parseInt(prompt("Reduce by how much?"));
  if(isNaN(n) || n < 1) return;
  change('loyalty', -n);
}

// -------------------- Ultimate (-5) --------------------
function gristUlt(){
  if(gristUsedThisTurn){
    showGristPopup();
    return;
  }

  if(get('loyalty') < 5){
    alert("Not enough loyalty!");
    return;
  }
  change('loyalty', -5);

  let g = get('grave');
  let o = document.getElementById('ultOverlay');
  o.innerHTML = `<div>Ultimate unleashed <br>${g} damage rains down!</div>`;
  o.style.display = "block";
  setTimeout(()=>o.style.display="none",3000);

  gristUsedThisTurn = true; // lock after ultimate
}

// -------------------- RESET / NEW GAME --------------------
function resetGrist(){ set('loyalty',3); }
function newGame(){
  ['loyalty','grave','ready','sick','tapped'].forEach((id,i)=>set(id,i===0?3:0));
  gristUsedThisTurn = false;
}

// -------------------- GRAVEYARD --------------------
function addGrave(){ if(!document.getElementById('staticExile').checked) change('grave',1); }
function addGravePrompt(){ 
  if(document.getElementById('staticExile').checked) return;
  let n=parseInt(prompt("Add how many?")); 
  if(isNaN(n)||n<1) return;
  change('grave', n);
}
function removeGrave(){change('grave', -1);}
function removeGravePrompt(){
  let n=parseInt(prompt("Remove how many?"));
  if(isNaN(n)||n<1) return;
  change('grave', -n);
}
function exileGrave(){set('grave',0);}

// -------------------- INSECTS --------------------
function tapReady(){ if(get('ready')>0){ set('ready', get('ready')-1); set('tapped', get('tapped')+1); }}
function untapOne(){ if(get('tapped')>0){ set('tapped', get('tapped')-1); set('ready', get('ready')+1); }}
function nextTurn(){
  let total = get('ready')+get('sick')+get('tapped');
  set('ready', total);
  set('sick',0); set('tapped',0);
  gristUsedThisTurn = false;
}
function boardWipe(){ set('ready',0); set('sick',0); set('tapped',0); }

// -------------------- TOTAL BUGS --------------------
function updateTotalBugs(){
  const ready = get('ready')||0;
  const sick = get('sick')||0;
  const tapped = get('tapped')||0;
  set('totalBugs', ready+sick+tapped);
  animateCount('totalBugs');
}

// -------------------- STATIC WIPE --------------------
document.getElementById('staticWipe').addEventListener('change', function(){
  if(this.checked){
    set('ready',0); set('sick',0); set('tapped',0);
    updateTotalBugs();
  }
});

// -------------------- GRIST POPUP --------------------
function showGristPopup(){
  const overlay = document.getElementById('ultOverlay');
  overlay.innerHTML = `
    <div>
      You’ve already used a Grist ability this turn!
      <br><br>
      <button onclick="confirmNewTurn()">New Turn</button>
      <button onclick="closeOverlay()">Cancel</button>
    </div>
  `;
  overlay.style.display = 'block';
}

function closeOverlay(){
  document.getElementById('ultOverlay').style.display = 'none';
}

function confirmNewTurn(){
  closeOverlay();
  nextTurn();
}

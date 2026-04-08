function get(id){return parseInt(document.getElementById(id).innerText);}
function set(id,val){document.getElementById(id).innerText=Math.max(val,0);}

// GLOBAL CHANGE (handles static wipe)
function change(id, amt){
  const staticWipe = document.getElementById('staticWipe').checked;

  if(staticWipe && (id==='ready'||id==='sick'||id==='tapped')) return;

  let val = get(id)+amt;
  if(val<0) val=0;
  set(id,val);
}

// GRIST
function gristPlus(){
  let n = parseInt(prompt("How many times resolve +1?"));
  if(isNaN(n)||n<1) return;

  const enterTapped = document.getElementById('enterTapped').checked;
  const haste = document.getElementById('hasteToggle').checked;
  const staticWipe = document.getElementById('staticWipe').checked;
  const staticExile = document.getElementById('staticExile').checked;

  if(!staticWipe){
    if(enterTapped){
      set('tapped', get('tapped')+n);
    } else if(haste){
      set('ready', get('ready')+n);
    } else {
      set('sick', get('sick')+n);
    }
  }

  change('loyalty', n);

  if(!staticExile){
    change('grave', n-1);
  }
}

function customGristSub(){
  let n=parseInt(prompt("Reduce by how much?"));
  if(isNaN(n)||n<1) return;
  change('loyalty',-n);
}

function gristUlt(){
  if(get('loyalty')<5){alert("Not enough loyalty!");return;}
  change('loyalty',-5);

  let g=get('grave');
  let o=document.getElementById('ultOverlay');
  o.innerHTML=`<div>GRIST ULTIMATE!<br>${g} creatures consumed!</div>`;
  o.style.display="block";
  setTimeout(()=>o.style.display="none",3000);
}

function resetGrist(){set('loyalty',3);}
function newGame(){
  ['loyalty','grave','ready','sick','tapped'].forEach((id,i)=>{
    set(id,i===0?3:0);
  });
}

// GRAVE
function addGrave(){
  if(document.getElementById('staticExile').checked) return;
  change('grave',1);
}
function addGravePrompt(){
  if(document.getElementById('staticExile').checked) return;
  let n=parseInt(prompt("Add how many?"));
  if(isNaN(n)||n<1) return;
  change('grave',n);
}
function removeGrave(){change('grave',-1);}
function removeGravePrompt(){
  let n=parseInt(prompt("Remove how many?"));
  if(isNaN(n)||n<1) return;
  change('grave',-n);
}
function exileGrave(){set('grave',0);}

// INSECTS
function tapReady(){
  if(get('ready')>0){
    set('ready',get('ready')-1);
    set('tapped',get('tapped')+1);
  }
}
function untapOne(){
  if(get('tapped')>0){
    set('tapped',get('tapped')-1);
    set('ready',get('ready')+1);
  }
}
function nextTurn(){
  let total=get('ready')+get('tapped')+get('sick');
  set('ready',total);
  set('tapped',0);
  set('sick',0);
}
function boardWipe(){
  set('ready',0);
  set('sick',0);
  set('tapped',0);
}
document.getElementById('staticWipe').addEventListener('change', function () {
  if (this.checked) {
    // Immediately wipe all insects
    set('ready', 0);
    set('sick', 0);
    set('tapped', 0);
  }
});

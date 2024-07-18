
//DOM elements
const nameInput = document.querySelector('.input-name'),
      farmName = document.querySelector('#farm-name'),
      grainCountDisplay = document.getElementById('grain-count'),
      //perClickDisplay = document.getElementById('per-click'),
      incomeDisplay = document.querySelector('.income-display'),
      riceplantDisplay = document.querySelector('.rice-plant-count'),
      farmerDisplay = document.querySelector('.farmer-count'),
      popoDisplay = document.querySelector('.popo-count'),
      hutDisplay = document.querySelector('.hut-count'),
      houseDisplay = document.querySelector('.house-count'),
      factoryDisplay = document.querySelector('.factory-count'),
      templeDisplay = document.querySelector('.temple-count'),
      itemsDisplay = document.querySelector('#items-display'),
      riceButton = document.querySelector('#rice-btn'),
      upgradeButtons = document.querySelectorAll('.upgrades'),
      riceCookerBtn = document.querySelector('#rice-cooker-btn'),
      ricePlantBtn = document.querySelector('#rice-plant-btn'),
      farmerBtn = document.querySelector('#farmer-btn'),
      popoBtn = document.querySelector('#popo-btn'),
      hutBtn = document.querySelector('#hut-btn'),
      houseBtn = document.querySelector('#house-btn'),
      factoryBtn = document.querySelector('#factory-btn'),
      templeBtn = document.querySelector('#temple-btn'),
      playBtn = document.querySelector('.btn'),
      goToFarmBtn = document.querySelector('.btn.btn2'),
      goldRiceCookerBtn = document.getElementById('gold-rc-btn'),
      goldChopstxBtn = document.getElementById('gold-chopsticks-btn'),
      bankDisplay = document.getElementById('bank'),
      screens = document.querySelectorAll('.screen'),
      menuButton = document.querySelector('.menu-btn'),
      closeButton = document.querySelector('.sideNav .closebtn'),
      reset = document.querySelector('.reset-btn'),
      saveButton = document.getElementById('save-btn'),
      riceBowl = document.querySelector("#rice-btn-img");



//grain, perclick, income
let gameData = {
    farmName: nameInput.value,
    grainCount: 0,
    perclickCount: 1,
    incomeCount: 0
}


//values for each upgrade
const UPGRADE_VALUES = {
  goldChopstx: {count: 0, cost: 100000, income: 100, purchased: false},
  goldRiceCooker: {count: 0, cost: 1000000, income: 0, purchased: false},
  riceCooker: {count: 0, cost: 25000, income: 0, purchased: false},
  ricePlant: {count: 0, cost: 25, income: 5},
  farmer: {count: 0, cost: 100, income: 10},
  popo: {count: 0, cost: 250, income: 20},
  hut: {count: 0, cost: 10000, income: 100},
  house: {count: 0, cost: 50000, income: 500},
  factory: {count: 0, cost: 2500000, income: 1000},
  temple: {count: 0, cost: 10000000, income: 5000},
}


//objects get saved into localStorage 
const savedData = JSON.parse(localStorage.getItem('gameData'));
const savedUpgrades = JSON.parse(localStorage.getItem('UPGRADE_VALUES'));
if (savedData) {
  gameData = savedData;
}
if (savedUpgrades) {
  Object.assign(UPGRADE_VALUES, savedUpgrades);
}


//changing screens

//main game screen
const gameScreen = document.getElementById('screen1');

//opening/input name screen
const inputScreen = document.getElementById('screen2');

goToFarmBtn.addEventListener('click', ()=> {
  inputScreen.classList.add("up");
  farmName.innerHTML = nameInput.value;
})


//rice bowl button
riceButton.addEventListener('click', (e)=> {
  //for testing and debugging
  console.log(UPGRADE_VALUES);
  console.log(gameData);

  gameData.grainCount += gameData.perclickCount;
  updateDisplay();
  saveGame();

  //takes cordinate of cursor
  let x = e.pageX;
  let y = e.pageY;

  //adds perclick display effect to each click on the bowl
  let text = document.createElement("div");
  text.classList.add("click_effect");
  text.innerHTML = `+${gameData.perclickCount}`;
  text.style.top = y + "px";
  text.style.left = x + "px";
  document.body.appendChild(text);

  //removes effect after each second
  setTimeout(() => {
    text.remove();
  }, 1000);
});




//upgrade income buttons

//rice cooker upgrade
//increases grains perclick
riceCookerBtn.addEventListener('click', ()=> purchaseUpgrade('riceCooker'));

//rice plant upgrade
ricePlantBtn.addEventListener('click', ()=> purchaseUpgrade('ricePlant'));

//farmer button upgrade
farmerBtn.addEventListener('click', ()=> purchaseUpgrade('farmer'));

//popo button upgrade
popoBtn.addEventListener('click', ()=> purchaseUpgrade('popo'));

//hut button upgrade
hutBtn.addEventListener('click', ()=> purchaseUpgrade('hut'));

//house button upgrade
houseBtn.addEventListener('click', ()=> purchaseUpgrade('house'));

//factory button upgrade
factoryBtn.addEventListener('click', ()=> purchaseUpgrade('factory'));

//temple button upgrade
templeBtn.addEventListener('click', ()=> purchaseUpgrade('temple'));

//gold chopstick upgrade
goldChopstxBtn.addEventListener('click', ()=> purchaseUpgrade('goldChopstx'));

//gold rice cooker item
goldRiceCookerBtn.addEventListener('click', ()=> purchaseUpgrade('goldRiceCooker'));

//open menu button
menuButton.addEventListener('click', ()=>{
  openNav();
})

//close menu button
closeButton.addEventListener('click', ()=> {
  closeNav(); 
})

//open menu
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("game-container").style.marginLeft = "300px";
}

//close menu
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("game-container").style.marginLeft= "0";
}

//restart game button
reset.addEventListener('click', ()=>{
  restartGame();
  alert("game reset");
});


//adds income to bank every second
setInterval(()=> {
  gameData.grainCount += gameData.incomeCount;
  updateDisplay();
  saveGame();
}, 1000);


/*
  function purchaseUpgrade
  takes in a type, aka the type of upgrade
  checks if grains is greater than or equal to cost
  adds to the income with each upgrade
*/
function purchaseUpgrade(type) {
  let upgrade = UPGRADE_VALUES[type];

  if(gameData.grainCount >= upgrade.cost) {
    gameData.grainCount -= upgrade.cost; //subtract cost to grainCount
    upgrade.count++; //add to upgrade type count
    upgrade.cost += Math.floor(upgrade.cost / 2); //increase cost after each purchase

    if (type === 'goldChopstx') {
      upgrade.purchased = true;
      gameData.perclickCount += upgrade.income;
      goldChopstxBtn.style.display = 'none';
      updateDisplay();

    } else if (type === 'goldRiceCooker') {
      //add gold shine to rice image
      riceBowl.style.filter = 'drop-shadow(0 -5mm 6mm rgb(255, 215, 0))';
      //disappear after it's been purchased
      goldRiceCookerBtn.style.display = 'none';
      //if it has been purchased
      upgrade.purchased = true;

      //double the income on all upgrades
      Object.values(UPGRADE_VALUES).forEach(i => {
        i.income *= 2;
      });

      updateDisplay();
    } else if (type ==='riceCooker') {
      riceCookerBtn.style.display = 'none';
      upgrade.purchased = true;
      Object.values(UPGRADE_VALUES).forEach(i => {
        i.income *= 1.2;
      });
      updateDisplay();
    } else if(type === 'ricePlant') {
      gameData.perclickCount += upgrade.income;
      updateDisplay();
    } else {
      //any upgrade not riceCooker 
      //increase the income based on upgrade type
      gameData.incomeCount += upgrade.income;
      updateDisplay();
     
    }

    saveGame();
    updateDisplay();
  } 
}

//update incomeCount
function updateIncome() {
  let upgrade = UPGRADE_VALUES;
  gameData.incomeCount = (
    (upgrade.farmer.count * upgrade.farmer.income) +
    (upgrade.popo.count * upgrade.popo.income) +
    (upgrade.hut.count * upgrade.hut.income) + 
    (upgrade.house.count * upgrade.house.income) +
    (upgrade.factory.count * upgrade.factory.income) + 
    (upgrade.temple.count * upgrade.temple.income)
  );
                          
}

//update perclick count
function updatePerClick() {
  let upgrade = UPGRADE_VALUES;
  gameData.perclickCount = (upgrade.ricePlant.count * upgrade.ricePlant.income) + 1;     
  if (upgrade.goldChopstx.purchased) {
    gameData.perclickCount += 100;
  }        
}

/*
  function updateDisplay
  changes the values on screen based on purchases or clicks
*/
function updateDisplay() {

  grainCountDisplay.innerHTML = `${gameData.grainCount.toLocaleString()} grains`;
  //perClickDisplay.innerHTML = `${gameData.perclickCount.toLocaleString()} grains per click`;
  incomeDisplay.innerHTML = `Income: ${gameData.incomeCount.toLocaleString()} g/s`;

  if (!UPGRADE_VALUES['goldRiceCooker'].purchased && gameData.grainCount >= 1000000) {
    goldRiceCookerBtn.style.visibility = 'visible';
    goldRiceCookerBtn.style.display = 'flex';
  }
  
  if (!UPGRADE_VALUES['goldChopstx'].purchased && gameData.grainCount >= 50000) {
    goldChopstxBtn.style.visibility = 'visible';
    goldChopstxBtn.style.display = 'flex';
  }

  if (!UPGRADE_VALUES['riceCooker'].purchased && gameData.grainCount >= 10000) {
    riceCookerBtn.style.visibility = 'visible';
    riceCookerBtn.style.display = 'flex';
  }

  updateButtonStyles();
  updateImages();
  updateIncome();
  updatePerClick();

}

//update images based on values
function updateImages() {
  //clear all rows
  riceplantDisplay.innerHTML = '';
  farmerDisplay.innerHTML = '';
  popoDisplay.innerHTML = '';
  hutDisplay.innerHTML = '';
  houseDisplay.innerHTML = '';
  factoryDisplay.innerHTML = '';
  templeDisplay.innerHTML = '';
  itemsDisplay.innerHTML = '';

  //image properties 
  const imageConfigs = [
    { type: 'ricePlant', display: riceplantDisplay, src: 'images/field-rice.png' },
    { type: 'farmer', display: farmerDisplay, src: 'images/field-farmer.png' },
    { type: 'popo', display: popoDisplay, src: 'images/popo.png' },
    { type: 'hut', display: hutDisplay, src: 'images/field-hut.png' },
    { type: 'house', display: houseDisplay, src: 'images/field-house.png' },
    { type: 'factory', display: factoryDisplay, src: 'images/field-factory.png' },
    { type: 'temple', display: templeDisplay, src: 'images/field-temple.png' },
    { type: 'riceCooker', display: itemsDisplay, src: 'images/rice-cooker-color.png' },
    { type: 'goldRiceCooker', display: itemsDisplay, src: 'images/rice-cooker-gold.png' },
    { type: 'goldChopstx', display: itemsDisplay, src: 'images/gold-chopsticks.png' }
  ];

  //give each image their style
  imageConfigs.forEach(config => {
    for (let i = 0; i < UPGRADE_VALUES[config.type].count; i++) {
      let image = document.createElement("img");
      image.style.width = config.display.contains(itemsDisplay) ? '5vh' : '6.5vh';
      image.style.height = config.display.contains(itemsDisplay) ? '5vh' : '6.5vh';
      image.style.margin = '3px';
      image.style.filter = 'drop-shadow(0 5px 4px black)';
      image.src = config.src;
      config.display.appendChild(image);
    }
  })

  //make chopsticks gold if purchased
  if (UPGRADE_VALUES.goldChopstx.purchased) {
    bankDisplay.style.cursor = "url('images/gold-cursor.png'), auto";
    riceBowl.style.cursor = "url('images/gold-cursor.png'), auto";
  }
  
}



/*
  function updateButtonStyles 
  updates the style of each upgrade button 
  if player has enough to purchase
*/
function updateButtonStyles() {
  //reference for each upgrade btn
  const buttons = [
    { id: 'gold-chopsticks-btn', cost: UPGRADE_VALUES.goldChopstx.cost, income: UPGRADE_VALUES.goldChopstx.income},
    { id: 'gold-rc-btn', cost: UPGRADE_VALUES.goldRiceCooker.cost, income: UPGRADE_VALUES.goldRiceCooker.income},
    { id: 'rice-cooker-btn', cost: UPGRADE_VALUES.riceCooker.cost, income: UPGRADE_VALUES.riceCooker.income},
    { id: 'rice-plant-btn', cost: UPGRADE_VALUES.ricePlant.cost, income: UPGRADE_VALUES.ricePlant.income},
    { id: 'farmer-btn', cost: UPGRADE_VALUES.farmer.cost, income: UPGRADE_VALUES.farmer.income},
    { id: 'popo-btn', cost: UPGRADE_VALUES.popo.cost, income: UPGRADE_VALUES.popo.income},
    { id: 'hut-btn', cost: UPGRADE_VALUES.hut.cost, income: UPGRADE_VALUES.hut.income},
    { id: 'house-btn', cost: UPGRADE_VALUES.house.cost, income: UPGRADE_VALUES.house.income},
    { id: 'factory-btn', cost: UPGRADE_VALUES.factory.cost, income: UPGRADE_VALUES.factory.income},
    { id: 'temple-btn', cost: UPGRADE_VALUES.temple.cost, income: UPGRADE_VALUES.temple.income},
  ];


  //each button inside buttons[]
  buttons.forEach(button => {
    //get the id for each upgrade
    const btnElement = document.getElementById(button.id);
    //reference the span class within each btnElement
    const infoSpan = btnElement.querySelector('.upgrade-info');
    const costDisplay = btnElement.querySelector('.upgrade-cost');
    const statsDisplay = btnElement.querySelector('.stats');

    costDisplay.innerHTML = `cost: ${Math.floor(button.cost).toLocaleString()}`;
    
    //for perclick upgrades
    if (button.id === 'rice-plant-btn' || button.id === 'gold-chopsticks-btn') {
      statsDisplay.innerHTML = `+${button.income} per click`;
    } else if (button.id === 'gold-rc-btn') {
      statsDisplay.innerHTML = 'x2 upgrades';
    } else if (button.id === 'rice-cooker-btn') {
      statsDisplay.innerHTML = 'x1.2 upgrades';
    } else {
      statsDisplay.innerHTML = `+${button.income} g/s`;
    }
    
    //if enough grains to purchase upgrade
    //border changes to white
    //upgrade-info text changes
    if (gameData.grainCount >= button.cost) {
      btnElement.style.border = '0.2vh solid white'; 
      btnElement.style.boxShadow = '0px 0px 20px white';
      infoSpan.textContent = 'Purchase';
    } else {
      btnElement.style.border = '0.2vh solid rgb(0, 89, 58)';
      btnElement.style.boxShadow = '0px 0px 20px black';
      infoSpan.textContent = 'not enough';
    }
  });


}


//save game progress
function saveGame() {
  localStorage.setItem('gameData', JSON.stringify(gameData));
  localStorage.setItem('UPGRADE_VALUES', JSON.stringify(UPGRADE_VALUES));
}


//restart game
//reset gameData values
//reset UPGRADE_VALUES
function restartGame() {
  gameData = {
    grainCount: 0,
    perclickCount: 1,
    incomeCount: 0,
  };

  Object.keys(UPGRADE_VALUES).forEach(key => {
    UPGRADE_VALUES[key].count = 0;
    UPGRADE_VALUES[key].purchased = false;
    switch(key) {
      case 'goldChopstx':
        UPGRADE_VALUES[key].cost = 100000;
        UPGRADE_VALUES[key].income = 100;
        break;
      case 'goldRiceCooker':
        UPGRADE_VALUES[key].cost = 1000000;
        UPGRADE_VALUES[key].income = 0;
        break;
      case 'riceCooker':
        UPGRADE_VALUES[key].cost = 25000;
        UPGRADE_VALUES[key].income = 0;
        break;
      case 'ricePlant':
        UPGRADE_VALUES[key].cost = 25;
        UPGRADE_VALUES[key].income = 5;
        break;
      case 'farmer':
        UPGRADE_VALUES[key].cost = 100;
        UPGRADE_VALUES[key].income = 10;
        break;
      case 'popo':
        UPGRADE_VALUES[key].cost = 250;
        UPGRADE_VALUES[key].income = 20;
        break;
      case 'hut':
        UPGRADE_VALUES[key].cost = 10000;
        UPGRADE_VALUES[key].income = 100;
        break;
      case 'house':
        UPGRADE_VALUES[key].cost = 50000;
        UPGRADE_VALUES[key].income = 250;
        break;
      case 'factory':
        UPGRADE_VALUES[key].cost = 2500000;
        UPGRADE_VALUES[key].income = 1000;
        break;
      case 'temple':
        UPGRADE_VALUES[key].cost = 10000000;
        UPGRADE_VALUES[key].income = 5000;
        break;
      default:
        console.error('Invalid upgrade type');
        break;
    }
  
  });

  // Reset the input field value
  nameInput.value = '';

  // Reset all UI elements to their initial states
  bankDisplay.style.cursor = 'auto';

  goldChopstxBtn.style.display = 'none';
  goldRiceCookerBtn.style.display = 'none';
  riceCookerBtn.style.display = 'none';
  riceBowl.style.filter = 'drop-shadow(0px 0px 10px rgb(96, 90, 90))';

  // Save the reset game data to localStorage
  localStorage.clear();

  // Update the display to reflect the reset state
  updateDisplay();
}

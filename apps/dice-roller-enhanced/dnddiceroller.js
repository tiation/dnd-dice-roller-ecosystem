//v 1.1.1

/*
 * DnD Dice Roller JavaScript
 * Version: 1.1.1
 * 
 * This script provides functionality for a dynamic dice rolling application
 * specifically designed for Dungeons & Dragons and similar tabletop games.
 * 
 * Function Directory:
 * ------------------
 * 
 * UI Generation and Management
 * ---------------------------
 * lineHTML()                   - Generates the HTML structure for a single dice rolling line
 * copyrightText()              - Creates and displays the copyright text with current year
 * updateExpandLineSymbol()     - Updates the expand/collapse triangle symbol based on options state
 * updateAllExpandLineSymbols() - Updates all expand-line button symbols based on option checkbox states.
 * expandLine()                 - Handles expanding/collapsing individual dice roll lines
 * expandAll()                  - Expands or collapses all dice roll lines simultaneously
 * 
 * Event Handlers and Controls
 * --------------------------
 * optionCheckboxChanged()  - Handles changes to option checkboxes and updates UI accordingly
 * changeDropCount()        - Manages changes to the number of dice to drop/reroll
 * changeDiceCount()        - Handles changes to the quantity of dice being rolled
 * changeDiceLimit()        - Controls changes to min/max limits per die
 * changeDiceType()        - Manages dice type changes (d4, d6, d8, etc.)
 * changeModifier()        - Handles modifications to dice roll modifiers
 * diceControl()           - Enforces input limits for dice quantities
 * changeSound()           - Toggles sound effects on/off
 * 
 * Storage and State Management
 * ---------------------------
 * saveCheckedState()      - Saves checkbox states to localStorage
 * loadCheckedState()      - Loads saved checkbox states from localStorage
 * saveChange()            - Saves individual line changes to localStorage
 * saveLabel()            - Saves custom labels to localStorage
 * saveLine()             - Saves complete line configuration to localStorage
 * saveAll()              - Saves all dice roller configurations to localStorage
 * loadAll()              - Loads all saved configurations from localStorage
 * 
 * Line Management
 * --------------
 * addLine()              - Adds a new dice rolling line to the interface
 * removeLine()           - Removes a dice rolling line from the interface
 * restoreLine()          - Restores a previously saved dice rolling line
 * restoreDice()          - Restores all saved dice configurations
 * duplicateLine()        - Creates a copy of an existing dice rolling line
 * 
 * Rolling and Calculation
 * ----------------------
 * clickRoll()            - Handles single line roll button clicks
 * clickRollAll()         - Handles rolling all dice lines at once
 * rollDiceLine()         - Performs the actual dice rolling calculations with modifiers
 * 
 * Utility Functions
 * ----------------
 * convertToNumber()     - Converts dice notation (e.g., 'd6') to numeric value
 * getEvent()            - Standardises event handling across browsers
 * getElementIndex()     - Gets the index of an element within its parent
 * getClassIndex()       - Gets the index of an element within a collection
 * getAncestorIndex()    - Gets the index of an ancestor element
 * deleteElement()       - Removes an element from the DOM
 * populateDSelect()     - Populates dice type dropdown options
 * labelPlaceholder()    - Generates placeholder text for dice roll labels
 * ulCount()             - Counts the number of dice rolling lines
 * lineCount()           - Counts child elements in a list
 * 
 * Logging and Output
 * -----------------
 * timeStamp()           - Generates timestamp for roll history
 * writeLogLine()        - Writes roll results to the history log
 * clearLog();           - Clears the contents of the dice log window
 * 
 * Note: This application uses localStorage for persistence and includes
 * features for dice rolling with modifiers, drop/reroll options, and
 * min/max value constraints per die.
 */

// =============================================
// UI Generation and Management
// =============================================

function lineHTML() {
  const dForm = ['<div class="button-group">',
               '<button class="expand-line" onclick="expandLine(event)" title="expand options" style="font-size:1.0em;">&#9651;</button>',//styling is a fix for symbol translation
               '<button class="remove-line" onclick="removeLine(event)" title="remove line">-</button>',
               '<button class="duplicate-line" onclick="duplicateLine(event)" title="duplicate line">++</button></div>',
             
               '<div class="d-line">',
               '<caption><input type="text" maxlength="22" class="label" onchange="saveLabel(event)"></input></caption>',

               '<span class="main-controls"><input class="d-count" type="number" value="1" min="1" max="99" oninput="changeDiceCount(event)" onchange="diceControl(event)" onclick="diceControl()"></input>',
               '<select class="d-type" onchange="changeDiceType(event)"></select>',
               '<select class="pos-neg" onchange="saveChange(event)"><option value="0">+</option><option value="1">-</option></select>',
               '<input class="d-mod" type="number" value="0" max="99" oninput="changeModifier(event)" onchange="diceControl(event)"></input>',
               '<select class="mod-target" onchange="saveChange(event)"><option value="0">to each</option><option value="1" selected>to total</option></select></span>',
              
               '<span class="option-1-controls"><input type="checkbox" class="option-1 advanced-option" name="option-1" onchange="optionCheckboxChanged(event)"/><label for="option-1">',
               '<select class="ignore-reroll"><option value="0" selected>Drop</option><option value="1">Reroll</option></select>',
               '&nbsp;<select class="low-high"><option value="0" selected>lowest</option><option value="1" >highest</option></select>',
               '<input class="drop-count" type="number" value="0" min="0" max="5" oninput="inputDropCount(event)" onchange="changeDropCount(event)"></input><p>dice</p></label></span>',
               
               '<span class="option-2-controls"><input type="checkbox" class="option-2 advanced-option" name="option-2" onchange="optionCheckboxChanged(event)"/><label for="option-2">',
               '<select class="min-max"><option value="0" selected>Minimum</option><option value="1" >Maximum</option></select><p>of</p>',
               '<input class="limiter" type="number" value="1" min="1" max="6" oninput="changeDiceLimit(event)" onchange="diceControl(event)"></input><p>per die</p></label></span></div>',
               '<div class="line-result"></div>',
               '<button class="roll" onclick="clickRoll(event)">Roll</button>'];

  return dForm.join('');
}

function copyrightText() {
  let currentTime = new Date();
  let currentYear = currentTime.getFullYear();
  let siteName = 'DnD Dice Roller';
  let copyRight = 'Copyright \u00A9 ' + currentYear + ' '  +  siteName + '. All rights reserved.';
  document.getElementById('copy-text').appendChild(document.createTextNode(copyRight));
}

function updateExpandLineSymbol(li) {
  const option1 = li.querySelector('.option-1');
  const option2 = li.querySelector('.option-2');
  const button = li.querySelector('.expand-line');
  if (!button) return;
  if ((option1 && option1.checked) || (option2 && option2.checked)) {
    button.innerHTML = '&#x25EC;'; // triangle with dot
  } else {
    button.innerHTML = '\u25B3'; // empty triangle
  }
}

function updateAllExpandLineSymbols() {
  document.querySelectorAll('#dice-list li').forEach(updateExpandLineSymbol);
}

function expandLine(e) {
  var e = window.event || e;
  let target = e.target || e.srcElement;
  
  // Get the parent li element
  let li = target.closest('li');
  if (!li) return;
  
  // Get the elements we need to toggle
  let dLine = li.querySelector('.d-line');
  let buttonGroup = li.querySelector('.button-group');
  let removeButton = buttonGroup.querySelector('.remove-line');
  let duplicateButton = buttonGroup.querySelector('.duplicate-line');
  let option1Controls = dLine.querySelector('.option-1-controls');
  let option2Controls = dLine.querySelector('.option-2-controls');

  // Toggle the expanded state
  if (!dLine.classList.contains("expanded")) {
    dLine.classList.add("expanded");
    target.classList.add("expanded");
    
    // Show other elements
    removeButton.style.opacity = "1";
    duplicateButton.style.opacity = "1";
    option1Controls.style.opacity = "1";
    option2Controls.style.opacity = "1";
    
    // Enable pointer events
    removeButton.style.pointerEvents = "auto";
    duplicateButton.style.pointerEvents = "auto";
    option1Controls.style.pointerEvents = "auto";
    option2Controls.style.pointerEvents = "auto";
  } else {
    dLine.classList.remove("expanded");
    target.classList.remove("expanded");
    
    // Hide other elements
    removeButton.style.opacity = "0";
    duplicateButton.style.opacity = "0";
    option1Controls.style.opacity = "0";
    option2Controls.style.opacity = "0";
    
    // Disable pointer events
    removeButton.style.pointerEvents = "none";
    duplicateButton.style.pointerEvents = "none";
    option1Controls.style.pointerEvents = "none";
    option2Controls.style.pointerEvents = "none";
  }
}

function expandAll(e) {
  var e = window.event || e;
  let target = e.target || e.srcElement;
  
  // Get all dice lines
  let dLines = document.getElementsByClassName('d-line');
  let buttonGroups = document.getElementsByClassName('button-group');
  let expandButtons = document.getElementsByClassName('expand-line');
  
  // Check if we're expanding or collapsing based on the first line's state
  let isExpanding = !dLines[0].classList.contains("expanded");
  
  // Toggle the expand-all button
  if (isExpanding) {
    target.classList.add("expanded");
  } else {
    target.classList.remove("expanded");
  }
  
  // Loop through all lines and toggle them
  for (let i = 0; i < dLines.length; i++) {
    let dLine = dLines[i];
    let buttonGroup = buttonGroups[i];
    let expandButton = expandButtons[i];
    let removeButton = buttonGroup.querySelector('.remove-line');
    let duplicateButton = buttonGroup.querySelector('.duplicate-line');
    let option1Controls = dLine.querySelector('.option-1-controls');
    let option2Controls = dLine.querySelector('.option-2-controls');
    
    if (isExpanding) {
      // Expand
      dLine.classList.add("expanded");
      expandButton.classList.add("expanded");
      
      // Show other elements
      removeButton.style.opacity = "1";
      duplicateButton.style.opacity = "1";
      option1Controls.style.opacity = "1";
      option2Controls.style.opacity = "1";
      
      // Enable pointer events
      removeButton.style.pointerEvents = "auto";
      duplicateButton.style.pointerEvents = "auto";
      option1Controls.style.pointerEvents = "auto";
      option2Controls.style.pointerEvents = "auto";
    } else {
      // Collapse
      dLine.classList.remove("expanded");
      expandButton.classList.remove("expanded");
      
      // Hide other elements
      removeButton.style.opacity = "0";
      duplicateButton.style.opacity = "0";
      option1Controls.style.opacity = "0";
      option2Controls.style.opacity = "0";
      
      // Disable pointer events
      removeButton.style.pointerEvents = "none";
      duplicateButton.style.pointerEvents = "none";
      option1Controls.style.pointerEvents = "none";
      option2Controls.style.pointerEvents = "none";
    }
  }
}

// =============================================
// Event Handlers and Controls
// =============================================

function optionCheckboxChanged(e) {
  saveAll(); // keep your existing behaviour
  const li = e.target.closest('li');
  if (li) updateExpandLineSymbol(li);
}

function inputDropCount(e) {
  var e = window.event || e;   
  const target = e.target || e.srcElement; 


  let li = target.closest('li');
  if (!li) return;
  
  // Get the elements we need to toggle
  let dCount = li.querySelector('.d-count');

  target.max = dCount.value;
  target.max--;

  if(target.value >= diceCount.value)
    target.value = diceCount.value-1;
  
  saveChange(e);
  saveLine(li.index);

}

function changeDropCount(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement; 

  let li = target.closest('li');
  if (!li) return;
  
  // Get the elements we need to toggle
  let dCount = li.querySelector('.d-count');

  target.max = dCount.value;
  target.max--;

  if(target.value >= dCount.value)
     target.value = dCount.value-1;
  else if(target.value < 1)
     target.value = target.min || 0;
  saveChange(e);
}

function changeDiceCount(e) {
  var e = window.event || e;
  const target = e.target || e.srcElement; 
  const i = getAncestorIndex('LI',target);    
  let dropCount = document.getElementsByClassName('drop-count')[i];
  dropCount.max = target.value-1;
  if(dropCount.value >= target.value-1)
    dropCount.value = target.value-1;

  if(dropCount.value < 1)
    dropCount.value = 0;

  saveChange(e);
  saveLine(i);
}

function changeDiceLimit(e) {
  var e = window.event || e;
  const target = e.target || e.srcElement; 
  const i = getAncestorIndex('LI',target);    
  let dSelect = document.getElementsByClassName('d-type')[i];
  let dType = dSelect.options[dSelect.selectedIndex].text;
  let dValue = convertToNumber(dType);
  if(target.value > dValue)
     target.value = dValue;
  
  saveChange(e);
  saveLine(i);
}

function changeDiceType(e) {
  var e = window.event || e;
  const target = e.target || e.srcElement; 
  const i = getAncestorIndex('LI',target);    
  let dType = target.options[target.selectedIndex].text;
  let dValue = convertToNumber(dType);
  let limitCount = document.getElementsByClassName('limiter')[i];
  if(limitCount.value > dValue)
     limitCount.value = dValue;
  saveChange(e);
  saveLine(i);
}

function changeModifier(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement; 
  var i = getAncestorIndex('LI',target);    
  var select = document.getElementsByClassName('pos-neg')[i];
  var dLabel = document.getElementsByClassName('label')[i];
  var modValue = JSON.parse(localStorage.getItem('d-mod' + i.toString()));
  
  if(select.value==1) { //negative (-) is selected
    if(target.value < modValue) {
      target.value++;
      target.value++;
      modValue=target.value;                    
    } else if(target.value > modValue) {
      target.value--;
      target.value--;
      modValue=target.value;
    }
    if(target.value>9) //sets a lower limit at -9
      target.value=9;                 
  }

  if (target.value < 0) { //if value goes less than 0, prevent (-) sign inside number input, switch select(+/-) option instead
    if (select.value == 0) {
      select.value=1;
      target.value = 1;
    } else if (select.value == 1) {
      select.value=0;
      target.value = 0;
    }
  }

  if(target.value == 0) { //if the value is equal to 0 switch select back to +
    select.value=0;
  }

  if (target.value > 99) { //if number value is above 99, set to 99
    target.value = 99;
  }

  saveChange(i);
  saveLine(i);
}

function diceControl(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement; 
  if(target.value > 99)
     target.value = target.max;
  else if(target.value < 1)
     target.value = target.min || 0;
  saveChange(e);
}

function changeSound(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement; 
  if(document.getElementById('save-checkbox').checked) {
    localStorage.setItem('sound-checkbox', document.getElementById('sound-checkbox').checked);
  }
}

// =============================================
// Storage and State Management
// =============================================

function saveCheckedState(e) {
  var e = window.event || e;
  var checkbox = e.target || e.srcElement; 
  localStorage.setItem('save-checkbox', checkbox.checked);
  if(checkbox.checked) {
    saveAll();
  } else {
    localStorage.clear();
  }
}

function loadCheckedState() {    
  let checked = JSON.parse(localStorage.getItem('save-checkbox'));
  let saveCheckBox = document.getElementById("save-checkbox");
  saveCheckBox.checked = checked;
  
  let soundCheckBox = document.getElementById("sound-checkbox");
  soundCheckBox.checked = JSON.parse(localStorage.getItem('sound-checkbox')); 
}

function saveChange(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement; 
  var targetIndex = getAncestorIndex('LI',target);
  if(document.getElementById('save-checkbox').checked) {
    var targetClass = target.className;
    var targetStorageLabel = targetClass + targetIndex.toString();
    localStorage.setItem(targetStorageLabel, target.value);
  }
  var targetLabel = document.getElementsByClassName('label')[targetIndex];
  targetLabel.placeholder = labelPlaceholder(targetIndex);
}

function saveLabel(e) {
  var e = window.event || e;
  if(document.getElementById('save-checkbox').checked) {
    var target = e.target || e.srcElement; 
    var targetClass = target.className;
    var targetIndex = getAncestorIndex('LI',target);
    var targetStorageLabel = targetClass + targetIndex.toString();
    localStorage.setItem(targetStorageLabel, target.value);
  }
}

function saveLine(i) {
  // Original settings
  localStorage.setItem('d-count' + i.toString(), document.getElementsByClassName('d-count')[i].value);
  localStorage.setItem('d-type' + i.toString(), document.getElementsByClassName('d-type')[i].value);
  localStorage.setItem('pos-neg' + i.toString(), document.getElementsByClassName('pos-neg')[i].value);
  localStorage.setItem('d-mod' + i.toString(), document.getElementsByClassName('d-mod')[i].value);
  localStorage.setItem('mod-target' + i.toString(), document.getElementsByClassName('mod-target')[i].value);
  localStorage.setItem('label' + i.toString(), document.getElementsByClassName('label')[i].value);
  
  // New settings - Option 1 (Ignore/Reroll)
  localStorage.setItem('option-1' + i.toString(), document.getElementsByClassName('option-1')[i].checked);
  localStorage.setItem('ignore-reroll' + i.toString(), document.getElementsByClassName('ignore-reroll')[i].value);
  localStorage.setItem('low-high' + i.toString(), document.getElementsByClassName('low-high')[i].value);
  localStorage.setItem('drop-count' + i.toString(), document.getElementsByClassName('drop-count')[i].value);

  // New settings - Option 2 (Min/Max)
  localStorage.setItem('option-2' + i.toString(), document.getElementsByClassName('option-2')[i].checked);
  localStorage.setItem('min-max' + i.toString(), document.getElementsByClassName('min-max')[i].value);
  localStorage.setItem('limiter' + i.toString(), document.getElementsByClassName('limiter')[i].value);
}

function saveAll() {
  let count = ulCount();
  for (let i = 0; i < count; i++) {
    saveLine(i);
  }
  localStorage.setItem('line-count', count);
  localStorage.setItem('sound-checkbox', document.getElementById('sound-checkbox').checked);
}

function loadAll() {
  let count = JSON.parse(localStorage.getItem('line-count'));
  for (let i = 0; i < count; i++) {
    restoreLine();
    
    // Original settings
    document.getElementsByClassName('d-count')[i].value = JSON.parse(localStorage.getItem('d-count' + i.toString()));
    document.getElementsByClassName('d-type')[i].value = JSON.parse(localStorage.getItem('d-type' + i.toString()));
    document.getElementsByClassName('pos-neg')[i].value = JSON.parse(localStorage.getItem('pos-neg' + i.toString()));
    document.getElementsByClassName('d-mod')[i].value = JSON.parse(localStorage.getItem('d-mod' + i.toString()));
    document.getElementsByClassName('mod-target')[i].value = JSON.parse(localStorage.getItem('mod-target' + i.toString()));
    
    // Handle label separately since it's not a JSON value
    let dLabel = document.getElementsByClassName('label')[i];
    dLabel.value = localStorage.getItem('label' + i.toString());
    dLabel.placeholder = labelPlaceholder(i);

    // New settings - Option 1 (Ignore/Reroll)
    try {
      document.getElementsByClassName('option-1')[i].checked = JSON.parse(localStorage.getItem('option-1' + i.toString()));
      document.getElementsByClassName('ignore-reroll')[i].value = JSON.parse(localStorage.getItem('ignore-reroll' + i.toString()));
      document.getElementsByClassName('low-high')[i].value = JSON.parse(localStorage.getItem('low-high' + i.toString()));
      document.getElementsByClassName('drop-count')[i].value = JSON.parse(localStorage.getItem('drop-count' + i.toString()));
    } catch(e) {
      // If loading old data, set defaults
      document.getElementsByClassName('option-1')[i].checked = false;
      document.getElementsByClassName('ignore-reroll')[i].value = "0";
      document.getElementsByClassName('low-high')[i].value = "0";
      document.getElementsByClassName('drop-count')[i].value = "0";
    }

    // New settings - Option 2 (Min/Max)
    try {
      document.getElementsByClassName('option-2')[i].checked = JSON.parse(localStorage.getItem('option-2' + i.toString()));
      document.getElementsByClassName('min-max')[i].value = JSON.parse(localStorage.getItem('min-max' + i.toString()));
      document.getElementsByClassName('limiter')[i].value = JSON.parse(localStorage.getItem('limiter' + i.toString()));
    } catch(e) {
      // If loading old data, set defaults
      document.getElementsByClassName('option-2')[i].checked = false;
      document.getElementsByClassName('min-max')[i].value = "0";
      document.getElementsByClassName('limiter')[i].value = "1";
    }
  }
}

// =============================================
// Line Management
// =============================================

function addLine() {
  //limits the number of dice roll combinations to 10
  var count = ulCount();
  if(count >9) {
    return false;
  }   
  
  if(count>=1) {
    document.getElementById('roll-all').disabled = false;
  }
 
  if(count>=9) {
    document.getElementById('add-line').disabled = true;
  }    
  
  //governs creation of new lines
  var newLine = document.createElement("li");       // Create <li> node
  //newLine.draggable="true"
  newLine.innerHTML = lineHTML(); //insert line html into line element
  var list = document.getElementById("dice-list");    // Get the <ul> element to insert the line
  list.insertBefore(newLine, list.childNodes[count]);  // Insert <li> before the last child of list

  var dSelect = document.getElementsByClassName('d-type')[count];
  populateDSelect(dSelect);

  document.getElementsByClassName('label')[count].placeholder = labelPlaceholder(count);

  if(document.getElementById('save-checkbox').checked) {    
    saveLine(ulCount()-1);
    localStorage.setItem('line-count', ulCount());
  }
}

function removeLine(e) {  
  var e = window.event || e;
  var target = e.target || e.srcElement; 
  var parent = target.parentElement;//parent of "target"  
  var grandParent = parent.parentElement; //grandparent of "target"
  var count = ulCount();

  if(count<=1) {
    document.getElementById('add-line').click();
  }

  if(count<=2) {
    document.getElementById('roll-all').disabled = true;
  }
  
  if(count<=10) {
    document.getElementById('add-line').disabled = false;
  }
  
  deleteElement(grandParent);
  
  if(document.getElementById('save-checkbox').checked) {    
    saveAll();
  }
}

function restoreLine() {
  //used when loading stored dice sets.  skips save loop to avoid overwriting data
  var count = ulCount();

  //limit the number of dice roll combinations to 10
  if(count >9) {
    return false;
  }   
  
  if(count>=1) {
    document.getElementById('roll-all').disabled = false; 
  }
 
  if(count>=9) {
    document.getElementById('add-line').disabled = true; 
  }    
  
  //governs creation of new lines
  var newLine = document.createElement("li");       // Create <li> node
  //newLine.draggable="true";
  newLine.innerHTML = lineHTML(); //insert line html into line element
  var list = document.getElementById("dice-list");    // Get the <ul> element to insert the line
  list.insertBefore(newLine, list.childNodes[count]);  // Insert <li> before the last child of list
  
  var dSelect = document.getElementsByClassName('d-type')[count];
  populateDSelect(dSelect);
}

function restoreDice() {
  if(document.getElementById('save-checkbox').checked) {
    loadAll();
    updateAllExpandLineSymbols();
  } else {
    document.getElementById('add-line').click();
  }
  
  if(ulCount() == 1) {
    document.getElementById('roll-all').disabled = true;
  }
}

function duplicateLine(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement;

  let sourceIndex = getAncestorIndex('LI', target);
  let count = ulCount();

  // Check if we're at the maximum allowed lines
  if(count >= 10) {
    return false;
  }

  // Create new line
  let newLine = document.createElement("li");
  newLine.innerHTML = lineHTML();
  //newLine.draggable="true";
  // Get the source line and the list
  let sourceList = document.getElementById("dice-list");
  let sourceLine = sourceList.getElementsByTagName('li')[sourceIndex];

  // Insert new line after the source line
  sourceList.insertBefore(newLine, sourceLine.nextSibling);

  // Get index for the new line (sourceIndex + 1)
  let newIndex = sourceIndex + 1;

  // Populate d-type select options
  let dSelect = document.getElementsByClassName('d-type')[newIndex];
  populateDSelect(dSelect);

  // Copy settings from source line to new line
  // Original settings
  document.getElementsByClassName('d-count')[newIndex].value = 
    document.getElementsByClassName('d-count')[sourceIndex].value;
  document.getElementsByClassName('d-type')[newIndex].value = 
    document.getElementsByClassName('d-type')[sourceIndex].value;
  document.getElementsByClassName('pos-neg')[newIndex].value = 
    document.getElementsByClassName('pos-neg')[sourceIndex].value;
  document.getElementsByClassName('d-mod')[newIndex].value = 
    document.getElementsByClassName('d-mod')[sourceIndex].value;
  document.getElementsByClassName('mod-target')[newIndex].value = 
    document.getElementsByClassName('mod-target')[sourceIndex].value;
  document.getElementsByClassName('label')[newIndex].value = 
    document.getElementsByClassName('label')[sourceIndex].value;

  // Option 1 settings
  document.getElementsByClassName('option-1')[newIndex].checked = 
    document.getElementsByClassName('option-1')[sourceIndex].checked;
  document.getElementsByClassName('ignore-reroll')[newIndex].value = 
    document.getElementsByClassName('ignore-reroll')[sourceIndex].value;
  document.getElementsByClassName('low-high')[newIndex].value = 
    document.getElementsByClassName('low-high')[sourceIndex].value;
  document.getElementsByClassName('drop-count')[newIndex].value = 
    document.getElementsByClassName('drop-count')[sourceIndex].value;

  // Option 2 settings
  document.getElementsByClassName('option-2')[newIndex].checked = 
    document.getElementsByClassName('option-2')[sourceIndex].checked;
  document.getElementsByClassName('min-max')[newIndex].value = 
    document.getElementsByClassName('min-max')[sourceIndex].value;
  document.getElementsByClassName('limiter')[newIndex].value = 
    document.getElementsByClassName('limiter')[sourceIndex].value;

  // Update placeholder
  document.getElementsByClassName('label')[newIndex].placeholder = 
    labelPlaceholder(newIndex);

  // Update UI state
  if(count>=1) {
    document.getElementById('roll-all').disabled = false;
  }

  if(count >= 9) {
    document.getElementById('add-line').disabled = true;
  }

  //update symbols
  updateExpandLineSymbol(newLine);

  // Save all settings
  if(document.getElementById('save-checkbox').checked) {
    saveAll();
  }
}

// =============================================
// Rolling and Calculation
// =============================================

function clickRoll(e) {
  var e = window.event || e;
  var target = e.target || e.srcElement;
  let x = getAncestorIndex('LI',target);
  writeLogLine('<br><div class="division-line"></div>');
  rollDiceLine(x);
  writeLogLine(timeStamp());
}

function clickRollAll() {
  let count = ulCount();
  writeLogLine('<br><div class="division-line"></div>');
  for(let x=count-1; x >= 0;x--) {
    rollDiceLine(x);
  }
  writeLogLine(timeStamp());
}

function rollDiceLine(x) {
  // Get basic dice settings
  let dCount = parseInt(document.getElementsByClassName('d-count')[x].value);
  let dSelect = document.getElementsByClassName('d-type')[x];
  let dType = dSelect.options[dSelect.selectedIndex].text;
  let posNeg = document.getElementsByClassName('pos-neg')[x];
  let posNegVal = posNeg.value;
  let posNegText = posNeg.options[posNeg.selectedIndex].text;
  let dMod = parseInt(document.getElementsByClassName('d-mod')[x].value);
  let modTarget = document.getElementsByClassName('mod-target')[x];
  let modTargetVal = modTarget.value;
  let modTargetText = modTarget.options[modTarget.selectedIndex].text;
  let dLabel = document.getElementsByClassName('label')[x];
  let dPlaceholder = dLabel.placeholder;
  let dLabelVal = dLabel.value;

  // Get new option settings
  let option1Checked = document.getElementsByClassName('option-1')[x].checked;
  let ignoreReroll = document.getElementsByClassName('ignore-reroll')[x];
  let ignoreRerollVal = ignoreReroll.value; // 0 = ignore, 1 = reroll
  let lowHigh = document.getElementsByClassName('low-high')[x];
  let lowHighVal = lowHigh.value; // 0 = lowest, 1 = highest
  let dropCount = parseInt(document.getElementsByClassName('drop-count')[x].value);

  let option2Checked = document.getElementsByClassName('option-2')[x].checked;
  let minMax = document.getElementsByClassName('min-max')[x];
  let minMaxVal = minMax.value; // 0 = minimum, 1 = maximum
  let limitValue = parseInt(document.getElementsByClassName('limiter')[x].value);

  // Build the description string for options
  let optionsDesc = [];
  // Only add modTarget text if there's a modifier
  if (dMod > 0) {
    optionsDesc.push(`${modTargetText}`);
  }
  if(option1Checked) {
    let desc = ignoreRerollVal == 1 ? "reroll" : "drop";
    desc += ` ${dropCount} ${lowHighVal == 0 ? "lowest" : "highest"} dice`;
    optionsDesc.push(desc);
  }
  if(option2Checked) {
    let desc = `${minMaxVal == 0 ? "minimum" : "maximum"} of ${limitValue} per die`;
    optionsDesc.push(desc);
  }

  // Start log output with combined description
  let logHTML = '<p class="log-text">Rolling ' + (dLabelVal ? dLabelVal + ' : ' : '') + 
               '<b>' + dCount + dType + 
               (dMod > 0 ? posNegText + dMod : '') +
               (optionsDesc.length > 0 ? '(' + optionsDesc.join(", ") + ')' : '') + '</b> : ';

  // Play sound if enabled
  if(document.getElementById('sound-checkbox').checked) {   
    let audio = new Audio('dice.mp3');
    audio.play();
  }

  let dSide = parseInt(dType.substr(1));
  let mod = 0, dTotal = 0;
  let rollString = "";
  let rolls = [];

  // Calculate modifier
  if(modTargetVal == 0) {
    mod = dMod;
    if(posNegText == "-") {
      mod = 0 - dMod;
    }
  }

// Roll dice and store results - without applying minimum/maximum yet
for(let d = 0; d < dCount; d++) {
  let originalRoll = Math.floor(Math.random() * dSide) + 1;
  let finalRoll = originalRoll;
  // If "to each" is selected, add modifier to each roll
  if (modTargetVal == 0 && dMod > 0) {
      finalRoll = posNegText == "-" ? originalRoll - dMod : originalRoll + dMod;
  }
  rolls.push({
      original: originalRoll,
      final: finalRoll,
      modified: false
  });
}

  // Handle ignore/reroll if option1 is checked
  if(option1Checked && dropCount > 0) {
    // Sort rolls to find highest/lowest
    rolls.sort((a, b) => lowHighVal == 0 ? a.final - b.final : b.final - a.final);
    
    // Mark dropped dice
    for(let i = 0; i < Math.min(dropCount, rolls.length); i++) {
      rolls[i].dropped = true;
    }

    // If rerolling, replace dropped dice
    if(ignoreRerollVal == 1) {
      for(let i = 0; i < rolls.length; i++) {
          if(rolls[i].dropped) {
              let newRoll = Math.floor(Math.random() * dSide) + 1;
              let finalRoll = newRoll;
              // Apply 'to each' modifier to rerolled dice
              if (modTargetVal == 0 && dMod > 0) {
                  finalRoll = posNegText == "-" ? newRoll - dMod : newRoll + dMod;
              }
              rolls[i] = {
                  original: rolls[i].final, // this is the dropped value, unmodified
                  rerollRaw: newRoll,       // the new roll, unmodified
                  final: finalRoll,         // the new roll, with modifier if needed
                  rerolled: true
              };
          }
      }
    }
    
  }

  // Now apply minimum/maximum after rerolls
  if(option2Checked) {
    for(let i = 0; i < rolls.length; i++) {
      let currentRoll = rolls[i];
      if(!currentRoll.dropped) { // Don't modify dropped dice
        if(minMaxVal == 0 && currentRoll.final < limitValue) { // Minimum
          rolls[i] = {
            original: currentRoll.final,
            final: limitValue,
            modified: true,
            isMinMax: true,
            rerolled: currentRoll.rerolled
          };
        } else if(minMaxVal == 1 && currentRoll.final > limitValue) { // Maximum
          rolls[i] = {
            original: currentRoll.final,
            final: limitValue,
            modified: true,
            isMinMax: true,
            rerolled: currentRoll.rerolled
          };
        }
      }
    }
  }

// Rebuild roll string with formatting
rollString = "";
for(let roll of rolls) {
    if(roll.dropped) {
        rollString += `<span style="color: #cc0000; text-decoration: line-through;">${roll.final}</span>, `;
    } else if(roll.rerolled) {
        if (modTargetVal == 0 && dMod > 0) {
            // Show: newRaw+mod (oldRaw)
            rollString += `${roll.rerollRaw}${posNegText}${dMod}(<span style="color: #cc0000; text-decoration: line-through;">${roll.original}</span>), `;
        } else {
            rollString += `${roll.final}(<span style="color: #cc0000; text-decoration: line-through;">${roll.original}</span>), `;
        }
    } else if(roll.isMinMax) {
        // Keep your existing logic for min/max
        if (modTargetVal == 0 && dMod > 0) {
            rollString += `${roll.final}(<span style="color: #cc0000; text-decoration: line-through;">${roll.original}</span>${posNegText}${dMod}), `;
        } else {
            rollString += `${roll.final}(<span style="color: #cc0000; text-decoration: line-through;">${roll.original}</span>), `;
        }
    } else {
        if (modTargetVal == 0 && dMod > 0) {
            rollString += `${roll.original}${posNegText}${dMod}, `;
        } else {
            rollString += roll.final + ", ";
        }
    }
}

  // Calculate total (excluding dropped dice)
  dTotal = rolls.reduce((sum, roll) => sum + (roll.dropped ? 0 : roll.final), 0);

  // Add modifier to total if needed
  if(modTargetVal == 1 && dMod > 0) {
    mod = dMod;
    if(posNegText == "-") {
      mod = 0 - dMod;
    }
    dTotal += mod;
    rollString += posNegText + " " + dMod.toString() + ", ";
  }

  // Ensure total isn't negative
  if(dTotal < 0) {
    dTotal = 0;
  }
  
  rollString += `<span class='log-line-total'>TOTAL: <b class='red'>${dTotal}</b></span></p>`;

  // Update result display
  let resultdiv = document.getElementsByClassName("line-result")[x];
  resultdiv.innerHTML = "";
  resultdiv.appendChild(document.createTextNode(dTotal));

  // Write to log
  writeLogLine(logHTML + rollString);
}

// =============================================
// Utility Functions
// =============================================

function convertToNumber(dType) {
  let dText = dType.slice(1);
  return Number(dText);
}

function getEvent(event) {
  if(!event) event = event || window.event;
  return event;
}

function getElementIndex(node) {
  var index = 0;
  while ( (node = node.previousElementSibling) ) {
    index++;
  }
  return index;
}

function getClassIndex(collection, node) {
  for (let i = 0; i < collection.length; i++) {
    if (collection[i] === node)
      return i;
  }
  return -1;
}

function getAncestorIndex(element, target) {
  var parent = target.parentElement;
  while(parent.tagName != element) {
    parent = parent.parentElement;
    if(parent.tagName == 'BODY')
      return -1;
  }
  return getElementIndex(parent);
}

function deleteElement(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

function populateDSelect(dSelect) {
  const DTYPE = ['d2','d3','d4','d6','d8','d10','d12','d20','d100'];
  for (let d=0; d<9; d++) {
    dSelect.options[d]=new Option(DTYPE[d], d);
  }
  dSelect.selectedIndex = "3"; //sets default selection to d6
}

function labelPlaceholder(x) {
  var dCount = parseInt(document.getElementsByClassName('d-count')[x].value);
  var dSelect = document.getElementsByClassName('d-type')[x];
  var dType = dSelect.options[dSelect.selectedIndex].text;
  var posNeg = document.getElementsByClassName('pos-neg')[x];
  var posNegVal = posNeg.value;
  var posNegText = posNeg.options[posNeg.selectedIndex].text;
  var dMod = parseInt(document.getElementsByClassName('d-mod')[x].value);
  var modTarget = document.getElementsByClassName('mod-target')[x];
  var modTargetVal = modTarget.value;
  var modTargetText = modTarget.options[modTarget.selectedIndex].text;
  
  let labelPrefix = dCount.toString() + dType;
  let labelSuffix = " " + posNegText + " " + dMod.toString() + "(" + modTargetText + ")";
  
  if(dMod == 0)
    labelSuffix = "";
  
  let label = labelPrefix + labelSuffix;
  return label;
}

function ulCount() {
  var ulCount = document.getElementsByClassName('d-line').length;	
  return ulCount;
}

function lineCount(listNode) {
  return listNode.childNodes.length;
}

// =============================================
// Logging and Output
// =============================================

function timeStamp() {
  var timeStamp = new Date();
  return '<i class="timestamp">' + timeStamp + '</i><br>';
}

function writeLogLine(lineString) {
  var newLine = document.createElement("li");       // Create <li> node
  newLine.innerHTML = lineString; //insert line string into line element html
  var log = document.getElementById("log-list");    // Get the <ol> element to insert the line
  
  var items = log.querySelectorAll("li");
  var lastchild = items[items.length];
  var lastLine = log.lastChild;
  
  log.insertBefore(newLine, log.childNodes[0]);  // Insert <li> at top  <ol>
}

function clearLog(){
  document.getElementById("log-list").innerHTML = "";
}

// =============================================
// Drag and Drop
// =============================================

document.addEventListener('DOMContentLoaded', function() {
  const diceList = document.getElementById('dice-list');
  let draggedItem = null;

  // Add drag events to all list items
  function addDragEvents() {
    const items = diceList.getElementsByTagName('li');
    Array.from(items).forEach(item => {
      //item.setAttribute('draggable', 'true');
      
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('drop', handleDrop);
    });

    // Add drag events to the list container for end-of-list dropping
    diceList.addEventListener('dragover', handleListDragOver);
    diceList.addEventListener('dragenter', handleListDragEnter);
    diceList.addEventListener('dragleave', handleListDragLeave);
    diceList.addEventListener('drop', handleListDrop);
  }

  function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    this.style.position = 'relative';
    this.style.zIndex = '1000';
    e.dataTransfer.setDragImage(this, 0, 0);
    e.dataTransfer.setData('text/plain', Array.from(diceList.children).indexOf(this));
  }

  function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.position = '';
    this.style.zIndex = '';
    const items = diceList.getElementsByTagName('li');
    Array.from(items).forEach(item => {
      item.classList.remove('drag-over');
    });
    diceList.classList.remove('drag-over-end');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleListDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDragEnter(e) {
    e.preventDefault();
    if (this !== draggedItem) {
      // Remove drag-over from all items first
      const items = diceList.getElementsByTagName('li');
      Array.from(items).forEach(item => {
        item.classList.remove('drag-over');
      });
      diceList.classList.remove('drag-over-end');
      this.classList.add('drag-over');
    }
  }

  function handleListDragEnter(e) {
    e.preventDefault();
    if (e.target === diceList) {
      const items = diceList.getElementsByTagName('li');
      Array.from(items).forEach(item => {
        item.classList.remove('drag-over');
      });
      diceList.classList.add('drag-over-end');
    }
  }

  function handleDragLeave(e) {
    if (!this.contains(e.relatedTarget)) {
      this.classList.remove('drag-over');
    }
  }

  function handleListDragLeave(e) {
    if (!diceList.contains(e.relatedTarget)) {
      diceList.classList.remove('drag-over-end');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this !== draggedItem) {
      const allItems = [...diceList.getElementsByTagName('li')];
      const draggedIndex = allItems.indexOf(draggedItem);
      const droppedIndex = allItems.indexOf(this);

      if (draggedIndex < droppedIndex) {
        this.parentNode.insertBefore(draggedItem, this.nextSibling);
      } else {
        this.parentNode.insertBefore(draggedItem, this);
      }

      // Update the order in localStorage if save is enabled
      if (document.getElementById('save-checkbox').checked) {
        saveAll();
      }
    }

    // Remove all drag-over classes
    const items = diceList.getElementsByTagName('li');
    Array.from(items).forEach(item => {
      item.classList.remove('drag-over');
    });
    diceList.classList.remove('drag-over-end');
    
    return false;
  }

  function handleListDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.target === diceList) {
      diceList.appendChild(draggedItem);
      
      // Update the order in localStorage if save is enabled
      if (document.getElementById('save-checkbox').checked) {
        saveAll();
      }
    }

    // Remove all drag-over classes
    const items = diceList.getElementsByTagName('li');
    Array.from(items).forEach(item => {
      item.classList.remove('drag-over');
    });
    diceList.classList.remove('drag-over-end');
    
    return false;
  }

  // Initialize drag events for existing items
  addDragEvents();

  // Add drag events to new items when they're added
  const originalAddLine = addLine;
  addLine = function() {
    originalAddLine();
    addDragEvents();
  };
});
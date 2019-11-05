let language = localStorage.getItem('language') || 'eng';
// variable language contain key by name 'language' in localstorage
// if key doesnt exist variable language = 'eng' by default

document.body.insertAdjacentHTML('afterbegin',
  '<div class="wrapper">'
    + '<textarea id="result" class="input" rows="6" cols="60" name = "post" maxLength = "4000"></textarea>'
    + '<div class="keyboard">'
    + '<div class="row"></div>'
    + '<div class="row"></div>'
    + '<div class="row"></div>'
    + '<div class="row"></div>'
    + '<div class="row"></div>'
    + '</div>');

const keyboard = document.querySelector('.keyboard');
const [row1, row2, row3, row4, row5] = document.querySelectorAll('.row');
const input = document.querySelector('.input');

function setKey(data) {
  const temp = [];

  let ru = '';// variable which add hidden by lang
  let en = '';

  if (language === 'ru') {
    en = 'hidden';
  } else {
    ru = 'hidden';
  }

  data.forEach((element) => {
    temp.push(`<div class="key ${element[1]}">
                      <span class="${element[0]} ${element[2]} ${ru}">
                          <span class="case down">${element[3]}</span>
                          <span class="case up">${element[4]}</span>
                      </span>
                      <span class="${element[0]} ${element[6]} ${en}">
                          <span class="case down">${element[7]}</span>
                          <span class="case up">${element[8]}</span>
                      </span>
                  </div>`);
  });

  return temp.join('');
}

// eslint-disable-next-line no-undef
row1.insertAdjacentHTML('beforeend', setKey(keysRow1));
// eslint-disable-next-line no-undef
row2.insertAdjacentHTML('beforeend', setKey(keysRow2));
// eslint-disable-next-line no-undef
row3.insertAdjacentHTML('beforeend', setKey(keysRow3));
// eslint-disable-next-line no-undef
row4.insertAdjacentHTML('beforeend', setKey(keysRow4));
// eslint-disable-next-line no-undef
row5.insertAdjacentHTML('beforeend', setKey(keysRow5));

const spans = keyboard.getElementsByTagName('span');
const Caps = keyboard.querySelector('.capslock');
let isCapsPressed = false;

function toggleDownUp() {
  for (let i = 0; i < spans.length; i += 1) {
    if (spans[i].classList.contains('down')) {
      spans[i].classList.replace('down', 'up');
    } else if (spans[i].classList.contains('up')) {
      spans[i].classList.replace('up', 'down');
    }
  }
}

const pressedKeys = new Set();

function keyPressTyping(funcL, funcC, funcA, capslock, altL, altR, tab, shiftL, shiftR) {
  document.addEventListener('keydown', (event) => {
      // long pressing on mousedown
    if (pressedKeys.has(event.code)) {
      // Set haven`t pressed key in first press-do changes, next count key in Set-didnt do changes
      // on mouseup do changes again to come back default
      return;
    }

    for (let i = 0; i < spans.length; i += 1) {
      if (spans[i].classList.contains(event.code)) {
        const keyActive = spans[i].closest('.key');
        if (event.code !== 'CapsLock') {
          keyActive.classList.add('pressed'); // add color for pressed button
          funcA(keyActive); // add animation for pressed button
        }
      }
    }

    pressedKeys.add(event.code);

    if (pressedKeys.has(tab)) {
      event.preventDefault();
      input.value += '\t';
    }

    if (pressedKeys.has(capslock)) {
      funcC();
    }

    if (pressedKeys.has(altL) || pressedKeys.has(altR)) {
      event.preventDefault();
    }

    if ((pressedKeys.has(shiftL) || pressedKeys.has(shiftR))
        && !pressedKeys.has(altL) && !pressedKeys.has(altR)) {
      toggleDownUp();
    }

    if ((pressedKeys.has(altL) && pressedKeys.has(shiftL))
        || (pressedKeys.has(altR) && pressedKeys.has(shiftR))) {
      pressedKeys.clear();
      funcL();
    }
  });

  document.addEventListener('keyup', (event) => {

    if (pressedKeys.has(shiftL) || pressedKeys.has(shiftR)) {
      toggleDownUp();
    }

    pressedKeys.delete(event.code);

    if (event.code === 'CapsLock') return;
    // remove color for pressed button
    const target = keyboard.querySelector(`.${event.code}`);
    const parent = target.closest('.key');
    parent.classList.remove('pressed');
  });
}

function toggleLang() {
  if (language === 'eng') { // if lang is english
    language = 'ru';
    localStorage.setItem('language', 'ru'); // set key 'language' = ru in localstorage
  } else {
    language = 'eng';
    localStorage.setItem('language', 'eng');
  } // when window reset lang will be same

  for (let i = 0; i < spans.length; i += 1) {
    if (spans[i].classList.contains('eng')) {
      spans[i].classList.toggle('hidden');
    } else if (spans[i].classList.contains('ru')) {
      spans[i].classList.toggle('hidden');
    }
  }
}

function upperCase(click, symbols) {
  toggleDownUp();
  Caps.classList.toggle('pressed');

  if (click) {
    isCapsPressed = !isCapsPressed;
    click.classList.add('pressed');
    if (!isCapsPressed) {
      click.classList.remove('pressed');
    }
    for (let j = 1; j < symbols.length + 1; j += 1) {
      if (symbols[j - 1].classList.contains('down')) {
        symbols[j - 1].classList.replace('down', 'up');
      } else if (symbols[j - 1].classList.contains('up')) {
        symbols[j - 1].classList.replace('up', 'down');
      }
    }
  }
}

function addAnim(key) {
  // add animation for pressing button
  setTimeout(() => key.classList.add('anim'), 100);
  key.addEventListener('animationend', () => {
    key.classList.remove('anim');
  });
}

keyPressTyping(toggleLang, upperCase, addAnim, 'CapsLock', 'AltLeft', 'AltRight',
    'Tab', 'ShiftLeft', 'ShiftRight', 'ControlLeft');

function keyClickTyping(e) {
  const noTypeCodes = ['Alt', 'Shift', 'Ctrl', 'Win',
    'Meta', 'Backspace', 'DEL', 'ENTER', 'CapsLock'];

  let typing = true;
  const keyClick = e.target.closest('.key');

  if (!keyClick) return;

  const keyClickLangs = keyClick.children;

  const { target } = e; // const target = event.target

  if (target.classList.contains('shift') || target.classList.contains('shift-right')) {
    toggleDownUp(); // shift long press start click
  }

  if (keyClick) {
    addAnim(keyClick);
  }

  for (let i = 0; i < keyClickLangs.length; i += 1) {
    if (!keyClickLangs[i].classList.contains('hidden')) {
      const symbols = keyClickLangs[i].children;

      for (let j = 0; j < symbols.length; j += 1) {
        if (symbols[j].classList.contains('down')) {
          const typeSymbol = symbols[i].innerHTML;

          if (typeSymbol === 'DEL') {
            input.value = '';
          }

          if (typeSymbol === 'ENTER') {
            input.value += '\n';
          }

          if (typeSymbol === 'CapsLock') {
            upperCase(keyClick, symbols);
          }

          if (typeSymbol === 'Backspace') {
            input.value = input.value.slice(0, -1);
          }

          typing = !(noTypeCodes.includes(typeSymbol));

          if (typing) {
            if (typeSymbol === 'Tab') {
              input.value += '\t';
            } else {
              input.value += typeSymbol;
            }
          }
        }
      }
    }
  }
}

keyboard.addEventListener('mousedown', keyClickTyping);
keyboard.addEventListener('mouseup', (event) => {

  const { target } = event; // destructuring - {key in obj event} = obj event

  if (target.classList.contains('shift') || target.classList.contains('shift-right')) {
    toggleDownUp(); // shift long press stop click
  }
});


// reset selection and caps lock on window blur
window.addEventListener('blur', () => {
  const activeKeys = document.querySelectorAll('.pressed');

  activeKeys.forEach((viewKey) => {
    if (viewKey.classList.contains('capslock')) return;
    viewKey.classList.remove('pressed');
  });
  pressedKeys.clear();
});

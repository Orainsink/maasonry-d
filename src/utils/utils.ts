window.readyState = 'interactive';
export const modulo = (num: number, div: number) => {
  return ((num % div) + div) % div;
};

// turn element or nodeList into an array
export const makeArray = (obj: HTMLElement[]) => Array.from(obj);

export const removeFrom = (ary: HTMLElement[], obj: HTMLElement) => {
  const index = ary.indexOf(obj);
  if (index != -1) {
    ary.splice(index, 1);
  }
};

export const getParent = (elem: HTMLElement, selector: string) => {
  let _elem = elem;
  while (_elem.parentNode && _elem != document.body) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _elem = elem.parentNode;
    if (_elem.matches(selector)) {
      return _elem;
    }
  }
};

// use element as selector string
export const getQueryElement = function (elem: HTMLElement) {
  if (typeof elem == 'string') {
    return document.querySelector(elem);
  }
  return elem;
};

export const filterFindElements = (elems: HTMLElement[], selector: string) => {
  // make array of elems
  const _elems = makeArray(elems);
  const ffElems: HTMLElement[] = [];

  _elems.forEach((elem) => {
    // check that elem is an actual element
    if (!(elem instanceof HTMLElement)) {
      return;
    }
    // add elem if no selector
    if (!selector) {
      ffElems.push(elem);
      return;
    }
    // filter & find items if we have a selector
    // filter
    if (elem.matches(selector)) {
      ffElems.push(elem);
    }
    // find children
    const childElems = elem.querySelectorAll(selector);
    // concat childElems to filterFound array
    for (const c of childElems) {
      ffElems.push(c as HTMLElement);
    }
  });

  return ffElems;
};

// ----- docReady ----- //

export const docReady = (callback: EventListenerOrEventListenerObject) => {
  if (readyState == 'complete' || readyState == 'interactive') {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout(callback);
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

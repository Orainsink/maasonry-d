let isSetup = false;
let isBoxSizeOuter = false;
type CSSStyleKey = keyof CSSStyleDeclaration;
type SizeStyleKey =
  | 'width'
  | 'height'
  | 'innerWidth'
  | 'innerHeight'
  | 'outerWidth'
  | 'outerHeight';

const MEASUREMENT: CSSStyleKey[] = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth',
];

// get a number from a string, not a percentage
const getStyleSize = (value: string) => {
  const num = parseFloat(value);
  // not a percent like '100%', and a number
  const isValid = value.indexOf('%') == -1 && !isNaN(num);
  return isValid ? num : false;
};

const getZeroSize = () => {
  const size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0,
  } as Record<CSSStyleKey | SizeStyleKey, number>;
  for (const measurement of MEASUREMENT) {
    size[measurement] = 0;
  }
  return size;
};
/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
const getStyle = (elem: HTMLElement) => getComputedStyle(elem);

/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */
const getSize = (elem: HTMLElement | string | null) => {
  setup();
  // use querySeletor if elem is string
  if (typeof elem === 'string') {
    elem = document.querySelector(elem) as HTMLElement;
  }

  // do not proceed on non-objects
  if (!elem || typeof elem !== 'object' || !elem.nodeType) {
    return;
  }

  const style = getStyle(elem);

  // if hidden, everything is 0
  if (style.display == 'none') {
    return getZeroSize();
  }
  const isBorderBox = style.boxSizing == 'border-box';
  const size = {
    width: elem.offsetWidth,
    height: elem.offsetHeight,
  } as Record<CSSStyleKey | SizeStyleKey, number>;

  // get all measurements
  for (const measurement of MEASUREMENT) {
    const value = style[measurement] + '';
    const num = parseFloat(value);
    // any 'auto', 'medium' value will be 0
    size[measurement] = !isNaN(num) ? num : 0;
  }

  const paddingWidth = size.paddingLeft + size.paddingRight;
  const paddingHeight = size.paddingTop + size.paddingBottom;
  const marginWidth = size.marginLeft + size.marginRight;
  const marginHeight = size.marginTop + size.marginBottom;
  const borderWidth = size.borderLeftWidth + size.borderRightWidth;
  const borderHeight = size.borderTopWidth + size.borderBottomWidth;

  const isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  const styleWidth = getStyleSize(style.width);
  if (styleWidth || styleWidth === 0) {
    size.width =
      styleWidth +
      // add padding and border unless it's already including it
      (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
  }

  const styleHeight = getStyleSize(style.height);
  if (styleHeight !== false) {
    size.height =
      styleHeight +
      // add padding and border unless it's already including it
      (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
  }

  size.innerWidth = size.width - (paddingWidth + borderWidth);
  size.innerHeight = size.height - (paddingHeight + borderHeight);

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
};

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
const setup = () => {
  // setup once
  if (isSetup) {
    return;
  }
  isSetup = true;

  /**
   * Chrome & Safari measure the outer-width on style.width on border-box elems
   * IE11 & Firefox<29 measures the inner-width
   */
  const div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  const body = document.body || document.documentElement;
  body.appendChild(div);
  const style = getStyle(div);
  // round value for browser zoom. desandro/masonry#928
  isBoxSizeOuter = Math.round(getStyleSize(style.width) || 0) == 200;

  body.removeChild(div);
};

export { getSize };

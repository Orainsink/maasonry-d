import React, { HTMLAttributes, useCallback, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { getSize } from './utils';
type HTMLOrSVGElement = HTMLElement | SVGElement;
type OriginPosition = 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
type MathMethod = 'round' | 'floor';
interface MasonryProps {
  columnWidth: number;
  gutter?: number;
  horizontalOrder?: boolean;
  percentPosition?: boolean;
  fitWidth?: boolean;
  originPosition?: OriginPosition;
  transitionDuration?: number;
  stagger?: number;
  resize?: boolean;
  initLayout?: boolean;
}
const getInitColWidth = (
  ele: HTMLOrSVGElement | null,
  columnWidth: number,
  containerWidth: number
) => {
  let _columnWidth = columnWidth;
  const firstItem = ele?.firstElementChild;
  if (firstItem && !columnWidth) {
    _columnWidth = getSize(firstItem).width || containerWidth || 0;
  }
  return _columnWidth;
};

const getCols = (colWidth: number, containerWidth: number, gutter: number) => {
  let cols = 0;
  let excess = 0;
  let mathMethod: MathMethod = 'floor';

  // calculate columns
  const _colWidth = colWidth + gutter;
  const _containerWidth = containerWidth + gutter;
  cols = _containerWidth / _colWidth;
  // fix rounding errors, typically with gutters
  excess = _colWidth - (_containerWidth % _colWidth);
  // if overshoot is less than a pixel, round up, otherwise floor it
  mathMethod = excess && excess < 1 ? 'round' : 'floor';
  cols = Math.max(Math[mathMethod](cols), 1);

  return cols;
};
const Masonry = ({
  columnWidth = 0,
  gutter = 20,
  ...rest
}: MasonryProps & HTMLAttributes<HTMLDivElement>) => {
  const [ref, bounds] = useMeasure({ scroll: true });
  const containerRef = useRef<HTMLOrSVGElement | null>(null);
  const [colWidth, setColWidth] = useState<number>(() =>
    getInitColWidth(containerRef.current, columnWidth, bounds.width)
  );
  const [cols, setCols] = useState<number>(() =>
    getCols(colWidth, bounds.width, gutter)
  );

  const containerRefCb = useCallback((node: HTMLOrSVGElement | null) => {
    ref(node);
    containerRef.current = node;
  }, []);

  return (
    <div ref={containerRefCb} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {}
    </div>
  );
};

const Item = () => {};
const Stamp = () => {};

Masonry.Item = Item;
Masonry.Stamp = Stamp;

export default Masonry;

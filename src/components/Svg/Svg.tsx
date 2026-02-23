import React from 'react';
import useClasses from '../context/classesContext/useClasses';

interface ISvgProps {
  path?: string;
  viewBox: string;
  fillRule?: 'evenodd' | 'nonzero' | 'inherit';
  cx?: { [key: string]: string | string[] };
}

const Svg = (props: ISvgProps) => {
  const { viewBox, path, fillRule, cx } = props;
  const classes = useClasses();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      strokeMiterlimit="10"
      version="1.1"
      viewBox={viewBox}
      width="100%"
      className={classes([""], {}, cx)}
    >
      <g
        className={classes([""], {}, cx)}
      >
        <path
          d={path}
          fillRule={fillRule}
        />
      </g>
    </svg>
  );
};

export default Svg;

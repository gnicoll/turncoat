import React from 'react';
import ClassesContext from './ClassesContext';

interface ClassesProviderProps {
  cx?: { [key: string]: string; };
  children: React.ReactNode;
}

function getConditionalClassesObject(obj: any): any {
  if (obj
    && typeof obj === 'object'
    && Object.keys(obj).length > 0
    && Object.keys(obj).filter((key) => typeof obj[key] === 'boolean').length > 0
  ) {
    return obj;
  }
  return undefined;
}

function getAdditionalCxObject(obj: any): any {
  if (obj
    && typeof obj === 'object'
    && Object.keys(obj).length > 0
    && Object.keys(obj).filter((key) => (typeof obj[key] === 'string' || Array.isArray(obj[key]))).length > 0
  ) {
    return obj;
  }
  return undefined;
}

export function combineCx(cx1Arg, cx2Arg): any {
  const cx1 = cx1Arg || {};
  const cx2 = cx2Arg || {};
  const combinedCx = {};
  Object.keys(cx1).forEach((key) => {
    const cs1Value = (Array.isArray(cx1[key])) ? cx1[key] : [cx1[key]];
    if (cx2[key]) {
      let cs2Value = [cx2[key]];
      if (Array.isArray(cx2[key])) {
        cs2Value = cx2[key];
      } else if (typeof cx2[key] === 'object') {
        cs2Value = Object.keys(cx2[key]).filter((k) => cx2[key][k]);
      }
      combinedCx[key] = cs1Value.concat(cs2Value);
    } else {
      combinedCx[key] = cs1Value;
    }
  });
  Object.keys(cx2).forEach((key) => {
    if (!(combinedCx[key])) {
      combinedCx[key] = (Array.isArray(cx2[key])) ? cx2[key] : [cx2[key]];
    }
  });
  return combinedCx;
}

export function ClassesProvider(props: ClassesProviderProps): React.ReactElement {
  const cx = props.cx ? props.cx : {};

  const classes: (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    className: string[], arg3?: any, arg4?: any) => string = (className: string[], arg3?: any, arg4?: any) => {
      const conditionalClasses = (getConditionalClassesObject(arg3)) || getConditionalClassesObject(arg4);
      const additionalCx = (getAdditionalCxObject(arg3)) || getAdditionalCxObject(arg4);

      const addCx = additionalCx || {};
      const combinedCx = combineCx(cx, addCx);

      const conditionalClassesList = (conditionalClasses) ? [conditionalClasses] : [];

      const classNamesList: string[] = (Array.isArray(className)) ? className : [className];

      const tempClasses = classNamesList.flatMap(
        (c) => (c),
      ).concat(
        classNamesList.flatMap(
          (c) => {
            const combinedCxClasses = combinedCx[c] ? combinedCx[c] : c;
            const combinedCxClassesList = (Array.isArray(combinedCxClasses)) ? combinedCxClasses : [combinedCxClasses];
            return combinedCxClassesList.map((cxClass) => (cxClass));
          },
        ),
      ).concat(
        conditionalClassesList.flatMap(
          (conditional) => Object.keys(conditional).filter((k) => conditional[k]),
        ).flatMap(
          (c) => (c),
        ),
      );

      // ensuring we return all classes, both from the styles object and from the cx object
      // this is needed for the vaTheme to work
      return classNamesList.flatMap(
        (c) => c,
      ).concat(tempClasses).filter((item, pos, array) => array.indexOf(item) === pos).join(' ');
    };

  return (
    <ClassesContext.Provider value={classes}>
      {props.children}
    </ClassesContext.Provider>
  );
}

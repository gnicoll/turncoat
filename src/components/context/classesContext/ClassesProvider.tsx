import React from 'react';
import ClassesContext from './ClassesContext';

// Import the type for IClassesContext and ClassNamesArg
import type { IClassesContext, ClassNamesArg } from './ClassesContext';

interface ClassesProviderProps {
  cx?: { [key: string]: string; };
  children: React.ReactNode;
}


function getConditionalClassesObject(obj: Record<string, unknown> | undefined | null): Record<string, boolean> | undefined {
  if (
    obj &&
    typeof obj === 'object' &&
    Object.keys(obj).length > 0 &&
    Object.keys(obj).filter((key) => typeof (obj as Record<string, unknown>)[key] === 'boolean').length > 0
  ) {
    // Only return if all values are boolean
    const allBoolean = Object.keys(obj).every((key) => typeof (obj as Record<string, unknown>)[key] === 'boolean');
    if (allBoolean) {
      return obj as Record<string, boolean>;
    }
  }
  return undefined;
}

function getAdditionalCxObject(obj: Record<string, unknown> | undefined | null): Record<string, string | string[]> | undefined {
  if (
    obj &&
    typeof obj === 'object' &&
    Object.keys(obj).length > 0 &&
    Object.keys(obj).filter((key) => (typeof obj[key] === 'string' || Array.isArray(obj[key]))).length > 0
  ) {
    // Only keep keys whose values are string or string[]
    const filteredObj: Record<string, string | string[]> = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string' || Array.isArray(obj[key])) {
        filteredObj[key] = obj[key] as string | string[];
      }
    });
    return filteredObj;
  }
  return undefined;
}

interface CxObject {
  [key: string]: string | string[] | Record<string, boolean>;
}

interface CombinedCxObject {
  [key: string]: string[];
}

export function combineCx(
  cx1Arg: CxObject | undefined | null,
  cx2Arg: CxObject | undefined | null
): CombinedCxObject {
  const cx1: CxObject = cx1Arg || {};
  const cx2: CxObject = cx2Arg || {};
  const combinedCx: CombinedCxObject = {};
  Object.keys(cx1).forEach((key) => {
    const cs1Value: string[] = (Array.isArray(cx1[key])) ? cx1[key] as string[] : [cx1[key] as string];
    if (cx2[key]) {
      let cs2Value: string[] = [cx2[key] as string];
      if (Array.isArray(cx2[key])) {
        cs2Value = cx2[key] as string[];
      } else if (typeof cx2[key] === 'object') {
        cs2Value = Object.keys(cx2[key] as Record<string, boolean>).filter((k) => (cx2[key] as Record<string, boolean>)[k]);
      }
      combinedCx[key] = cs1Value.concat(cs2Value);
    } else {
      combinedCx[key] = cs1Value;
    }
  });
  Object.keys(cx2).forEach((key) => {
    if (!(combinedCx[key])) {
      combinedCx[key] = (Array.isArray(cx2[key])) ? cx2[key] as string[] : [cx2[key] as string];
    }
  });
  return combinedCx;
}

export function ClassesProvider(props: ClassesProviderProps): React.ReactElement {
  const cx = props.cx ? props.cx : {};

  // Accept string | string[] | ClassNamesArg for className(s)
  const classes: IClassesContext = (
    classNames: string | string[] | ClassNamesArg,
    arg3?: unknown,
    arg4?: unknown
  ): string => {
    // Normalize classNames to string[]
    let classNamesList: string[] = [];
    if (typeof classNames === 'string') {
      classNamesList = [classNames];
    } else if (Array.isArray(classNames)) {
      classNamesList = classNames;
    } else if (classNames && typeof classNames === 'object') {
      // If ClassNamesArg is an object, extract its keys with truthy values
      classNamesList = Object.keys(classNames).filter((key) => (classNames as Record<string, boolean>)[key]);
    }

    const conditionalClasses = (getConditionalClassesObject(arg3 as Record<string, unknown> | null | undefined)) || getConditionalClassesObject(arg4 as Record<string, unknown> | null | undefined);
    const additionalCx = (getAdditionalCxObject(arg3 as Record<string, unknown> | null | undefined)) || getAdditionalCxObject(arg4 as Record<string, unknown> | null | undefined);

    const addCx = additionalCx || {};
    const combinedCx = combineCx(cx, addCx);

    const conditionalClassesList = (conditionalClasses) ? [conditionalClasses] : [];

    const tempClasses = classNamesList.flatMap(
      (c) => c,
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
        (c) => c,
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

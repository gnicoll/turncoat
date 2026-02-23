import React from 'react';


export interface ClassNamesArg {
    [key: string]: boolean | undefined;
}

export interface StylesArg {
    [key: string]: string | boolean | string[] | Record<string, boolean> | undefined;
}

type OptionalArg = unknown;

export interface IClassesContext {
    (
        classNames: string | string[] | ClassNamesArg,
        styles: StylesArg,
        arg2?: OptionalArg,
        arg3?: OptionalArg
    ): string;
}

const CXContext = React.createContext<IClassesContext>(() => (''));

export default CXContext;

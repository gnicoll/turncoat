import React from 'react';

interface IClassesContext {
    (classNames, styles, arg2?, arg3?): string;
}

const CXContext = React.createContext<IClassesContext>(() => (''));

export default CXContext;

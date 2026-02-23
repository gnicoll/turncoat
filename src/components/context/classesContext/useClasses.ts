import React, { useContext } from 'react';
import ClassesContext from './ClassesContext';

// Custom Hook
function useClasses() {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error(
      'useClasses must be used within a ClassesProvider. Ensure you boot your widget with the <widget> component which includes <ClassesProvider> to fix this error.',
    );
  }
  return context;
}

export default useClasses;

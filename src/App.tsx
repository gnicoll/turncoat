import { useEffect } from 'react'
import Card from './components/card/'
import './App.css'

function App() {
  useEffect(() => {
    // listen for mouse up events and fire a custom event with the mouse position
    const handleMouseUp = (event: MouseEvent) => {
      const customEvent = new CustomEvent('cardDragEnd', {
        detail: {
          x: event.clientX,
          y: event.clientY,
        },
      });
      window.dispatchEvent(customEvent);
    };

    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
        <Card north={1} south={2} east={3} west={4} />
    </>
  )
}

export default App

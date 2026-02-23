import React, { useEffect, useRef, useState } from 'react';
import { animate, svg } from 'animejs';
import './Test.css';

const SeekAnimation = () => {
  const animationRef = useRef(null);
  const visiblePathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
  const [force, setForce] = useState(0);

  useEffect(() => {
    // 1. Create animation, set autoplay: false
    animationRef.current = animate(visiblePathRef.current,{
      d: svg.morphTo('#pointedPath'), 
      easing: 'linear',
      duration: 1000,
      autoplay: false, // Required for manual seek
      onComplete: (x) => {
        console.log('Animation complete', x);
        setForce((prev) => prev + 1);
      }
    });
  }, [setForce]);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.seek(
        (animationRef.current.duration * progress) / 100
      );
      animationRef.current.onComplete();
    }
  }, [progress]);

  const handleSeek = (e) => {
    const value = e.target.value;
    setProgress(value);
  };

  return (
    <div>
        <div 
            className='tcCard_center'   
            
        >
            <svg className='svg1' width="100%" height="100%" viewBox="0 0 100 100" version="1.1">
                <g>
                    <path ref={visiblePathRef}id="visiblePath" d="M50,20c16.464,0.059 30,13.794 30,30c0,16.557 -13.443,30.031 -30,30c-16.147,-0.03 -29.971,-13.681 -30,-30c-0.03,-16.557 13.794,-30.058 30,-30Z"/>
                    <path id="circlePath" d="M50,20c16.464,0.059 30,13.794 30,30c0,16.557 -13.443,30.031 -30,30c-16.147,-0.03 -29.971,-13.681 -30,-30c-0.03,-16.557 13.794,-30.058 30,-30Z"/>
                    <path id="pointedPath" d="M50,24c13.333,-0 50,17.333 50,26c0,8.667 -36.667,26 -50,26c-13.233,0 -29.971,-9.681 -30,-26c-0.03,-16.557 16.767,-26 30,-26Z"/>
                </g>
            </svg>
        </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={progress} 
        onChange={handleSeek} 
      />
    </div>
  );
};

export default SeekAnimation;

import React, { useState, useRef } from 'react';
import { motion } from "motion/react";
import './Card.css';
import useClasses from '../context/classesContext/useClasses';


type CardProps = {
	north: number;
	south: number;
	east: number;
	west: number;
};

const Card: React.FC<CardProps> = ({ north, south, east, west }) => {
    const classes = useClasses();
    const [isDragging, setIsDragging] = useState(false);
    const [angle, setAngle] = useState(0);
    const [distance, setDistance] = useState(0);
    const cardCenterRef = useRef<HTMLDivElement>(null);
    
    const circlePath = 'M50,20c16.464,0.059 30,13.794 30,30c0,16.557 -13.443,30.031 -30,30c-16.147,-0.03 -29.971,-13.681 -30,-30c-0.03,-16.557 13.794,-30.058 30,-30Z';
    const pointerPath = 'M50,24c13.333,-0 50,17.333 50,26c0,8.667 -36.667,26 -50,26c-13.233,0 -29.971,-9.681 -30,-26c-0.03,-16.557 16.767,-26 30,-26Z';
    

    // listen to mouse down event and store the initial position of the mouse
    const handleMouseDown = () => {
        // get the screen coordinates of the cardCenterRef.current element
        const rect = cardCenterRef.current?.getBoundingClientRect();
        const cardCenterX = rect ? rect.left + rect.width / 2 : 0;
        const cardCenterY = rect ? rect.top + rect.height / 2 : 0;

        // listen to mouse move event and calculate the angle between initial and current position
        const handleMouseMove = (event: PointerEvent) => {
            const currentX = event.clientX;
            const currentY = event.clientY;

            const deltaX = currentX - cardCenterX;
            const deltaY = currentY - cardCenterY;

            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // animate the card based on the angle
            setIsDragging(true);
            setDistance(Math.round(distance));
            if (angle < -45 && angle > -135) {
                setAngle(-90);
            } else if (angle > 45 && angle < 135) {
                    setAngle(90);
            } else if (angle > -45 && angle < 45) {
                setAngle(0);
            } else {
                setAngle(-180);
            }

            //setAngle(Math.round(angle));
        };

        // listen to mouse up event and remove the mouse move listener
        const handleMouseUp = () => {
            setIsDragging(false);
            // setAngle(0);
            setDistance(0);
            document.removeEventListener('pointermove', handleMouseMove);
            document.removeEventListener('pointerup', handleMouseUp);
        };

        document.addEventListener('pointermove', handleMouseMove);
        document.addEventListener('pointerup', handleMouseUp);
    };


	return (
		<div 
            className={
                classes(
                ['tcCard'],
                {
                },
                )
            } 
        >   
		<div 
            className={
                classes(
                ['tcCard_inlay'],
                {
                },
                )
            } 
        />   
            <motion.div 
                animate={{ rotate: angle }}
                className={
                    classes(
                        ['tcCard_center'],
                        {
                            'tcCard_center_dragging': isDragging,
                        },
                    )
                } 
                onPointerDown={handleMouseDown}
                ref = {cardCenterRef}
                transition={{
                    duration: 0,
                    delay: 0,
                }}
            >
                    <svg className='svg1' width="100%" height="100%" viewBox="0 0 100 100" version="1.1">
                        <motion.path
                            d={circlePath}  
                            animate={{ d: isDragging && distance > 50  ? pointerPath : circlePath }}
                            />
                    </svg>
            </motion.div>
			<div 
                className={
                    classes(
                        ['tcCard_north', 'tcCard_number'],
                        {
                            'tcCard_highlighted': isDragging && angle < -45 && angle > -135,
                        },
                    )
                } 
                >
                {north}
            </div>
			<div 
                className={
                    classes(
                    ['tcCard_south', 'tcCard_number'],
                    {
                        'tcCard_highlighted': isDragging && angle > 45 && angle < 135,
                    },
                    )
                }
            >
                {south}
            </div>
			<div 
                className={
                    classes(
                    ['tcCard_east', 'tcCard_number'],
                    {
                        'tcCard_highlighted': isDragging && ((angle > -45 && angle < 45)),
                    },
                    )
                }
            >
                {east}
            </div>
			<div 
                className={
                    classes(
                    ['tcCard_west', 'tcCard_number'],
                    {
                        'tcCard_highlighted': isDragging && (angle > 135 || angle < -135),
                    },
                    )
                }
            >
                {west}
            </div>
		</div>
	);
};

export default Card;

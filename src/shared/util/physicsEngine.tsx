import Matter from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';

/**
 * A component that applies gravity to elements with the 'falling' class.
 * @param enableGravity Whether the bar is visible.
 * @returns The JSX element representing the gravity effect.
 */
export default function GravityEffect({ enableGravity }: { enableGravity: boolean }): JSX.Element {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [engine] = useState(() => Matter.Engine.create());

    useEffect(() => {
        if (!enableGravity) return;

        const addFallingClassRecursively = (element: Element) => {
            // Add 'falling' class to the current element
            element.classList.add('falling');

            // Recursively apply to child nodes
            element.querySelectorAll('*').forEach(child => child.classList.add('falling'));
        };

        const renderScene = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const render = Matter.Render.create({
                element: sceneRef.current!,
                engine,
                options: {
                    width,
                    height,
                    wireframes: false,
                    background: 'transparent',
                },
            });

            // Create ground and sidewalls
            const ground = Matter.Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true });
            const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
            const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });

            Matter.World.add(engine.world, [ground, leftWall, rightWall]);

            // Find the parent element to apply gravity to
            const parentElement = document.querySelector('.parent-falling');
            if (parentElement) {
                addFallingClassRecursively(parentElement);

                // Apply physics to all elements with the falling class
                const elements = parentElement.querySelectorAll('.falling');
                elements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const body = Matter.Bodies.rectangle(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2,
                        rect.width,
                        rect.height,
                        {
                            restitution: 0.6, // Makes them bounce a bit
                        }
                    );
                    element.setAttribute('data-body-id', body.id.toString()); // Link DOM element with physics body
                    Matter.World.add(engine.world, body);
                });
            }

            Matter.Engine.run(engine);
            Matter.Render.run(render);

            return () => {
                Matter.World.clear(engine.world, false);
                Matter.Engine.clear(engine);
                Matter.Render.stop(render);
                render.canvas.remove();
            };
        };

        renderScene();
    }, [enableGravity, engine]);

    return <div ref={sceneRef} className='pointer-events-none absolute left-0 top-0 h-full w-full' />;
}

import React from 'react';
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Toggle(
    { onToggle, isToggled, onSVG, offSVG, color, ...props } : 
    { onToggle: () => void, isToggled: boolean, onSVG: IconDefinition, offSVG: IconDefinition, color: string, [x: string]: any}
) {
  return (
    <button onClick={onToggle}>
      {isToggled ? 
        <FontAwesomeIcon {...props} icon={onSVG}  color={color} fixedWidth /> : 
        <FontAwesomeIcon {...props} icon={offSVG} color={color} fixedWidth />
      }
    </button>
  );
}

export default Toggle;

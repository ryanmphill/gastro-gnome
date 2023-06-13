import React, { useEffect, useState } from 'react';
import './DropdownMenu.css' // Import CSS styles for the dropdown menu

export const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false) // State to track if the dropdown is open or closed
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen) // Toggle the state to open or close the dropdown
    }

    // Untoggle the dropdown when the user clicks anywhere else 
    /*
    useEffect(
        () => {
            if (isOpen) {
                const handleOutsideClick = (event) => {
                    if (event.target.classList.contains("dropdown-content") === false) {
                        setIsOpen(false)
                    }
                }
    
                document.addEventListener('click', handleOutsideClick)
            }
        },
        [isOpen]
    )
  */
    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleDropdown}>
          Menu
        </button>
        {isOpen && <>
            <div className="dropdown-content">
            <a href="#">Clickable Link</a>
            </div>
            <div className="dropdown-content"></div>
        </> 
        }
      </div>
    )
  }
  
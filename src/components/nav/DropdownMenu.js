import React, { useEffect, useState } from 'react';
import './DropdownMenu.css' // Import CSS styles for the dropdown menu
import { Link, useNavigate } from 'react-router-dom';

export const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false) // State to track if the dropdown is open or closed
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen) // Toggle the state to open or close the dropdown
    }

    // Function to untoggle the dropdown when the user clicks anywhere else 
    const handleOutsideClick = (event) => {
        const dropdownContainer = document.querySelector('.dropdown')
        if (!dropdownContainer.contains(event.target)) {
            setIsOpen(false)
        }
    }
    /* Observe when dropdown state changes between open and closed, then 
      add and remove event listener to run handleOutsideClick callback function*/
    useEffect(
        () => {
            if (isOpen) {
                /* When the dropdown is open, add an event listener that
                   closes the dropdown when the user clicks anywhere else */
                document.addEventListener('click', handleOutsideClick)
            } else {
                // When dropdown is closed, remove event listener
                document.removeEventListener('click', handleOutsideClick)
            } 
            return () => {
                /* Remove the event listener everytime the component is rendered
                   with a cleanup function */
                document.removeEventListener('click', handleOutsideClick)
            } 
        },
        [isOpen]
    )

    //Import useNavigate and assign it to a variable
    const navigate = useNavigate()

    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleDropdown}>
          Menu
        </button>
        {isOpen && <>
            <section className="dropdown-content">
              <Link className="dropdown--link" to="">Clickable link</Link>
              { // Logout button
                localStorage.getItem("gastro_user")
                  ? <div className="navbar__menuItem navbar__logout">
                    <Link className="dropdown--link" to="" onClick={() => {
                      localStorage.removeItem("gastro_user")
                      navigate("/", { replace: true })
                    }}>Logout</Link>
                  </div>
                  : ""
              }
            </section>
        </> 
        }
      </div>
    )
  }
  
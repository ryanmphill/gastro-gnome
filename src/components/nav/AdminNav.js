import { Link } from "react-router-dom"
import "./NavBar.css"
import { DropdownMenu } from "./DropdownMenu"

export const AdminNav = ( {currentUser} ) => {
    

    return (
        <ul className="navbar">
            <li className="navbar__item">
                <h3>Gastro Gnome</h3>
            </li>
            <li className="navbar__item navbar__Title">
                
            </li>
            <li className="navbar__item navbar__menu">
                <DropdownMenu currentUser={currentUser} />
            </li>
        </ul>
    )
}


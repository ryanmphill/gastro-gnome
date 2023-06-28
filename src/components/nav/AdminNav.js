import { Link } from "react-router-dom"
import "./NavBar.css"
import { DropdownMenu } from "./DropdownMenu"
import gastroLogo from "../../assets/Chef_black.svg"

export const AdminNav = ( {currentUser} ) => {
    

    return (
        <ul className="navbar">
            <li id="logoContainer">
                <img className="navbar__logo" src={gastroLogo} alt="Logo"></img>
                <h2 id="gastroTitle">Gastro Gnome</h2>
            </li>
            <li className="navbar__item navbar__Title">
                
            </li>
            <li className="navbar__item navbar__menu">
                <DropdownMenu currentUser={currentUser} />
            </li>
        </ul>
    )
}


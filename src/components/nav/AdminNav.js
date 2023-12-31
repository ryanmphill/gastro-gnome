import { useNavigate } from "react-router-dom"
import "./NavBar.css"
import { DropdownMenu } from "./DropdownMenu"
import gastroLogo from "../../assets/Chef_green.svg"

export const AdminNav = ( {currentUser} ) => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            <li id="logoContainer">
                <img className="navbar__logo" src={gastroLogo} alt="Logo" onClick={() => navigate("/")}></img>
                <h2 id="gastroTitle" onClick={() => navigate("/")}>Gastro Gnome</h2>
            </li>
            <li className="navbar__item navbar__Title">
                
            </li>
            <li className="navbar__item navbar__menu">
                <DropdownMenu currentUser={currentUser} />
            </li>
        </ul>
    )
}


import { Link } from "react-router-dom"
import "./NavBar.css"
import { DropdownMenu } from "./DropdownMenu"

export const AdminNav = () => {
    

    return (
        <ul className="navbar">
            <li className="navbar__item">
                <Link to="/">Logo will go here</Link>
            </li>
            <li className="navbar__item navbar__Title">
                
            </li>
            <li className="navbar__item navbar__menu">
                <DropdownMenu />
            </li>
        </ul>
    )
}


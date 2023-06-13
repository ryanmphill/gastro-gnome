import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"
import { DropdownMenu } from "./DropdownMenu"

export const AdminNav = () => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            <li className="navbar__item navbar__menu">
                <select>
                    <option>Menu</option>
                    <option>link 2</option>
                    <option>
                        {
                            localStorage.getItem("gastro_user")
                            ? <div className="navbar__menuItem navbar__logout">
                                <Link className="navbar__link" to="" onClick={() => {
                                    localStorage.removeItem("gastro_user")
                                    navigate("/", {replace: true})
                                }}>Logout</Link>
                            </div>
                            : ""
                        }
                    </option>
                </select>
            </li>
            <li className="navbar__item">
                <DropdownMenu />
            </li>
        </ul>
    )
}


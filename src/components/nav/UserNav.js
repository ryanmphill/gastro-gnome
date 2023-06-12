import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const UserNav = () => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            
            {
                localStorage.getItem("gastro_user")
                    ? <li className="navbar__item navbar__logout">
                        <Link className="navbar__link" to="" onClick={() => {
                            localStorage.removeItem("gastro_user")
                            navigate("/", {replace: true})
                        }}>Logout</Link>
                    </li>
                    : ""
            }
        </ul>
    )
}


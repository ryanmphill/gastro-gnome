import { AdminNav } from "./AdminNav"
import "./NavBar.css"
import { UserNav } from "./UserNav"


export const NavBar = () => {
    
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    if (gastroUserObject.staff) {
        // Return Employee Views
        return < AdminNav/>
    } else {
        // Return Customer Views
        return <UserNav />
    }
}
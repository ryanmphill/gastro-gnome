import { AdminViews } from "./AdminViews"
import { UserViews } from "./UserViews"


export const ApplicationViews = () => {

    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    if (gastroUserObject.staff) {
        // Return Employee Views
        return <AdminViews />
    } else {
        // Return Customer Views
        return <UserViews />
    }
}
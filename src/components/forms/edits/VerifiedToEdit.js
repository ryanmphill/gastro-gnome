import { Navigate, useLocation, useParams } from "react-router-dom"

export const VerifiedToEdit = ({ children }) => {
    // Get the recipeCard id
    const {authorId} = useParams()

    // Get the current user
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)
    const currentUserId = gastroUserObject.id

    /* useLocation() is used to retrieve the current location object, which is then used to construct 
    the redirect URL in case the user is not authorized. */
    const location = useLocation()
    
    if (parseInt(authorId) === currentUserId) {
        return children
    }
    else {
        return <Navigate
            to={`/${location.search}`}
            /* The replace prop indicates that the current URL should be replaced in the browser history
               preventing the user from navigating back to the unauthorized page */
            replace
            /* the current location object is passed as a state prop to the <Navigate> component, 
               allowing access to the location object in the redirected page. */
            state={{ location }} />
    }
}


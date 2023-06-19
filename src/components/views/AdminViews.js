import { Outlet, Route, Routes } from "react-router-dom"
import { Home } from "../feed/Home"
import { PostRecipe } from "../forms/posts/PostRecipe"
import { VerifiedToEdit } from "../forms/edits/VerifiedToEdit"
import { EditRecipe } from "../forms/edits/EditRecipe"


export const AdminViews = () => {
	return (
        <Routes>
            <Route path="/" element={
                <>
                    <h1>Gastro Gnome</h1>
                    <div>Your all-in-one recipe book</div>

                    <Outlet />
                </>
            }>

                <Route index element={ <Home /> } />
                <Route path="postrecipe" element={ <PostRecipe /> } />
                <Route path="recipe/:recipeId" element={ <></> } />
                <Route path="recipe/:recipeId/edit/:authorId" element={
                    <VerifiedToEdit>
                        <>
                            <>This is the edit recipe page</>
                            <EditRecipe />
                        </>
                    </VerifiedToEdit>
                } />
                <Route path="userprofile/:userId" element={ <></> } />
            </Route>
        </Routes>
    )
}
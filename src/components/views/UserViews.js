import { Outlet, Route, Routes } from "react-router-dom"
import { Home } from "../home/Home"
import { PostRecipe } from "../forms/posts/PostRecipe"
import { VerifiedToEdit } from "../forms/edits/VerifiedToEdit"
import { EditRecipe } from "../forms/edits/EditRecipe"
import { Profile } from "../profiles/Profile"
import { RecipeCard } from "../RecipeCard/RecipeCard"


export const UserViews = () => {
	return (
        <Routes>
            <Route path="/" element={
                <>
                    <header className="pageHeader">
                        <h1>Gastro Gnome</h1>
                        <div>Your all-in-one recipe book</div>
                    </header>

                    <Outlet />
                </>
            }>

                <Route index element={ <Home /> } />
                <Route path="postrecipe" element={ <PostRecipe /> } />
                <Route path="recipe/:recipeId" element={ <RecipeCard /> } />
                <Route path="recipe/:recipeId/edit/:authorId" element={
                    <VerifiedToEdit>
                        <>
                            <>This is the edit recipe page</>
                            <EditRecipe />
                        </>
                    </VerifiedToEdit>
                } />
                <Route path="userprofile/:selectedUserId" element={ <Profile /> } />
            </Route>
        </Routes>
    )
}
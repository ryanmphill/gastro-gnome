import { Outlet, Route, Routes } from "react-router-dom"
import { RecipeList } from "../feed/RecipeList"
import { PostRecipe } from "../posts/PostRecipe"
import { VerifiedToEdit } from "../edits/VerifiedToEdit"


export const UserViews = () => {
	return (
        <Routes>
            <Route path="/" element={
                <>
                    <h1>Gastro Gnome</h1>
                    <div>Your all-in-one recipe book</div>

                    <Outlet />
                </>
            }>

                <Route index element={ <RecipeList /> } />
                <Route path="postrecipe" element={ <PostRecipe /> } />
                <Route path="recipe/:recipeId" element={ <></> } />
                <Route path="recipe/:recipeId/edit/:authorId" element={
                    <VerifiedToEdit>
                        <>
                            <>This is the edit recipe page</>
                        </>
                    </VerifiedToEdit>
                } />

            </Route>
        </Routes>
    )
}
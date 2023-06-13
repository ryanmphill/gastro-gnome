import { Outlet, Route, Routes } from "react-router-dom"
import { RecipeList } from "../feed/RecipeList"


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

                <Route index element={ <RecipeList /> } />
                

            </Route>
        </Routes>
    )
}
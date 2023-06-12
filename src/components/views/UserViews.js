import { Outlet, Route, Routes } from "react-router-dom"


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

                <Route path="feed" element={ <></> } />
                

            </Route>
        </Routes>
    )
}
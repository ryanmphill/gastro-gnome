import { Route, Routes, useLocation } from "react-router-dom"
import { Authorized } from "./views/Authorized"
import { ApplicationViews } from "./views/ApplicationViews"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import "./GastroGnome.css"
import { NavBar } from "./nav/NavBar"
import { useEffect } from "react"


export const GastroGnome = () => {
	const { pathname } = useLocation()
	// Navigate user to top when navigating to a new page
	useEffect(
		() => {
			window.scrollTo(0, 0)
		},
		[pathname]
	)
	
	return <Routes>
		<Route path="/login" element={<Login />} />
		<Route path="/register" element={<Register />} />

		<Route path="*" element={
			<Authorized>
				<>
					<NavBar />
					<ApplicationViews />
					<footer className="pageFooter"></footer>
				</>
			</Authorized>
			

		} />
	</Routes>
}
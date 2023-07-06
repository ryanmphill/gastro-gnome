import React, { useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import "./Login.css"
import gastroLogo from "../../assets/Chef_green.svg"

export const Login = () => {
    const [email, set] = useState("fbaggins@shire.net")
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        return fetch(`http://localhost:8088/users?email=${email}`)
            .then(res => res.json())
            .then(foundUsers => {
                if (foundUsers.length === 1) {
                    const user = foundUsers[0]
                    localStorage.setItem("gastro_user", JSON.stringify({
                        id: user.id,
                        staff: user.isStaff
                    }))

                    navigate("/")
                }
                else {
                    window.alert("Invalid login")
                }
            })
    }

    return (
        <main className="container--login">
            <section className="form--login">
                <form onSubmit={handleLogin}>
                    <section className="login--headerContainer">
                        <div className="login--logoContainer">
                            <img className="login--logo" src={gastroLogo} alt="Logo"></img>
                        </div>
                        <div className="login--headerFlex">
                            <h1 className="login--header">Gastro Gnome</h1>
                            <h2 className="login--header" id="pleaseSignIn">Please sign in</h2>
                        </div>
                    </section>
                    <fieldset>
                        <label htmlFor="inputEmail"> Email address </label>
                        <input type="email"
                            value={email}
                            onChange={evt => set(evt.target.value)}
                            className="form-control"
                            id="inputEmail"
                            placeholder="Email address"
                            required autoFocus />
                    </fieldset>
                    <fieldset>
                        <div className="btn-primary-wrapper">
                            <button type="submit" className="btn-primary btn--login">
                                Sign in
                            </button>
                        </div>
                    </fieldset>
                </form>
                <section className="link--register">
                <Link to="/register">Not a member yet?</Link>
                </section>
            </section>
            
        </main>
    )
}


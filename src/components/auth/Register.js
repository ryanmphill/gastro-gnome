import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Login.css"

export const Register = (props) => {
    const [guest, setGuest] = useState({
        email: "",
        name: "",
        isStaff: false
    })
    let navigate = useNavigate()

    const registerNewUser = () => {
        return fetch("http://localhost:8088/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(guest)
        })
            .then(res => res.json())
            .then(createdUser => {
                if (createdUser.hasOwnProperty("id")) {
                    localStorage.setItem("gastro_user", JSON.stringify({
                        id: createdUser.id,
                        staff: createdUser.isStaff
                    }))

                    navigate("/")
                }
            })
    }

    const handleRegister = (e) => {
        e.preventDefault()
        return fetch(`http://localhost:8088/users?email=${guest.email}`)
            .then(res => res.json())
            .then(response => {
                if (response.length > 0) {
                    // Duplicate email. No good.
                    window.alert("Account with that email address already exists")
                }
                else {
                    // Good email, create user.
                    registerNewUser()
                }
            })
    }

    const updateGuest = (evt) => {
        const copy = {...guest}
        copy[evt.target.id] = evt.target.value
        setGuest(copy)
    }

    return (
        <main style={{ textAlign: "center" }} className="container--login">
            <section className="form--login">
                <form onSubmit={handleRegister}>
                    <h1 className="h3 mb-3 font-weight-normal login--header">Please Register for Gastro Gnome</h1>
                    <fieldset>
                        <label htmlFor="name"> Full Name </label>
                        <input onChange={updateGuest}
                            type="text" id="name" className="form-control"
                            placeholder="Enter your name" required autoFocus />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="email"> Email address </label>
                        <input onChange={updateGuest}
                            type="email" id="email" className="form-control"
                            placeholder="Email address" required />
                    </fieldset>
                    <fieldset>
                        <input onChange={(evt) => {
                            const copy = { ...guest }
                            copy.isStaff = evt.target.checked
                            setGuest(copy)
                        }}
                            type="checkbox" id="isStaff" />
                        <label htmlFor="email"> I am an employee </label>
                    </fieldset>
                    <fieldset>
                        <div className="btn-primary-wrapper">
                            <button type="submit" className="btn-primary btn--login"> Register </button>
                        </div>
                    </fieldset>
                </form>
                <section className="link--register">
                    <Link to="/login">Return to Login</Link>
                </section>
            </section>
        </main>
    )
}


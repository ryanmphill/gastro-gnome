import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RecipeFeed } from "../feed/RecipeFeed"


export const Profile = () => {
    const [recipes, setRecipes] = useState([]) // Observing initial state []
    const [filteredRecipes, setFilteredRecipes] = useState([])
    const [ownerOfProfile, setOwnerOfProfile] = useState({})

    //assign a useParams() variable to the visited user's id
    const {selectedUserId} = useParams()

    // Get the current user
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    // Fetch the list of recipes with user info expanded and ingredients and categories embedded
    useEffect(
        () => {
            fetch(`http://localhost:8088/recipeCards?_expand=user&_embed=ingredientsInRecipes&_embed=categoriesOfRecipes`)
                .then(response => response.json())
                .then((recipeArray) => {
                    setRecipes(recipeArray)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )

    // Filter the recipes so that only the posts by user whose profile is being viewed are being displayed
    useEffect(
        () => {
            const visitedUsersPosts = recipes.filter(recipe => recipe.userId === parseInt(selectedUserId))
            setFilteredRecipes(visitedUsersPosts)
        },
        [recipes] // 
    )

    // Get the data for the selected profile user
    useEffect(
        () => {
            fetch(`http://localhost:8088/users/${selectedUserId}`)
                .then(response => response.json())
                .then((userObject) => {
                    setOwnerOfProfile(userObject)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )
    
    // Assign a variable to useNavigate()
    const navigate = useNavigate()
    
    return <>
        <h1>{ownerOfProfile.name}</h1>
        <h2>Recipe List</h2>

        
        <button onClick={ () => navigate("/postrecipe") }>Post a Recipe</button>
        <RecipeFeed recipes={filteredRecipes} gastroUserObject={gastroUserObject} />
    </>

}
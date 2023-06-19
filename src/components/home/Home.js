import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RecipeFeed } from "./RecipeFeed"


export const Home = () => {
    const [recipes, setRecipes] = useState([]) // Observing initial state []
    // const [filteredRecipes, setFilteredRecipes] = useState([])

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
    
    // Assign a variable to useNavigate()
    const navigate = useNavigate()
    
    return <>
        <h2>Recipe List</h2>

        
        <button onClick={ () => navigate("/postrecipe") }>Post a Recipe</button>
        <RecipeFeed recipes={recipes} gastroUserObject={gastroUserObject} />
    </>
}
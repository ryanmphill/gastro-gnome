import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"


export const RecipeList = () => {
    const [recipes, setRecipes] = useState([]) // Observing initial state []
    const [filteredRecipes, setFilteredRecipes] = useState([])

    // Fetch the list of recipes
    useEffect(
        () => {
            fetch(`http://localhost:8088/recipeCards?_expand=user`)
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
        <article className="recipeFeed">
            {
                recipes.map(
                    (recipe) => {
                        return <section className="recipe" key={`recipe--${recipe.id}`}>
                            <h3>{recipe.title}</h3>
                            <div>{recipe.description}</div>
                            <footer>Posted by: <Link to={`/userprofile/${recipe?.user?.id}`}>{recipe?.user?.name}</Link></footer>
                        </section>
                    }
                )
            }
        </article>
    </>
}
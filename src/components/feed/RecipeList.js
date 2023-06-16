import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DeleteRecipe } from "./DeleteRecipe"


export const RecipeList = () => {
    const [recipes, setRecipes] = useState([]) // Observing initial state []
    const [filteredRecipes, setFilteredRecipes] = useState([])

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
        <article className="recipeFeed">
            {
                recipes.map(
                    (recipe) => {
                        return <section className="recipe" key={`recipe--${recipe.id}`}>
                            <h3>{recipe.title}</h3>
                            <div>{recipe.description}</div>
                            <div>Posted by: <Link to={`/userprofile/${recipe?.user?.id}`}>{recipe?.user?.name}</Link></div>
                            <footer>
                                {
                                    gastroUserObject.id === recipe.userId
                                    && <>
                                    <Link to={`/recipe/${recipe.id}/edit/${recipe.userId}`}>Edit</Link>
                                    <DeleteRecipe recipeId={recipe.id}
                                        recipeIngredients={recipe.ingredientsInRecipes}
                                        recipeCategories={recipe.categoriesOfRecipes} />
                                    </>
                                }
                            </footer>
                        </section>
                    }
                )
            }
        </article>
    </>
}
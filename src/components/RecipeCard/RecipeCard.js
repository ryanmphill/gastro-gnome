import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { FavoriteButton } from "../PostInteraction/Favorite"
import "./RecipeDetails.css"


export const RecipeCard = () => {
    // Get the recipe card id
    const { recipeId } = useParams()

    // Define state variable for recipeCard
    const [recipeCard, setRecipeCard] = useState({})

    // Define state variables for the ingredient and category relationships attached to the recipe
    const [attachedIngredients, setAttachedIngredients] = useState([])
    const [attachedCategories, setAttachedCategories] = useState([])

    //Define function to get the recipeCard
    const fetchSelectedRecipe = () => {
        fetch(`http://localhost:8088/recipeCards/${recipeId}?_expand=user&_expand=genre&_embed=ingredientsInRecipes&_embed=categoriesOfRecipes`)
            .then(response => response.json())
            .then((recipeObject) => {
                setRecipeCard(recipeObject)
                setAttachedIngredients(recipeObject.ingredientsInRecipes)
                setAttachedCategories(recipeObject.categoriesInRecipes)
            })
    }

    /* Define and set state variables for the fetched genre, ingredient and category choices*/
    const [allIngredients, setAllIngredients] = useState([])
    const [allCategories, setAllCategories] = useState([])

    // Define a function to fetch all ingredients, categories
    const fetchList = (endpoint, setterFunc) => {
        fetch(`http://localhost:8088/${endpoint}`)
            .then(response => response.json())
            .then((data) => {
                setterFunc(data)
            })
    }

    // On initial render, set the recipeCard along with its relationships
    useEffect(
        () => {
            fetchSelectedRecipe()
            fetchList("ingredients", setAllIngredients)
            fetchList("categories", setAllCategories)
        },
        []
    )
    

    return <article className="recipeDetails">
        <section className="recipeDetails--topContainer">
            <h1 className="recipeDetails--title">{recipeCard.title}</h1>
            <div className="recipeDetails_fav"><FavoriteButton recipe={recipeCard} /></div>
        </section>

        <section>
            <div>{recipeCard?.genre?.name}</div>
            <div>Posted by: <Link to={`/userprofile/${recipeCard?.user?.id}`}>{recipeCard?.user?.name}</Link></div>
        </section>

        <section>
            {
                recipeCard?.image?.length > 0 
                && <img src={recipeCard.image} alt="Image of recipe" />
            }
        </section>

        <section className="recipeDetails_times">
            <div>Prep Time:{recipeCard.prepTime} minutes</div>
            <div>Cooking Time: {recipeCard.cookTime} minutes</div>
            <div>Total Time: {recipeCard.prepTime + recipeCard.cookTime} minutes</div>
        </section>

        <section>
            <div>{recipeCard.description}</div>
            <div>
                <h4>Ingredients</h4>
                <ul>
                    {
                       attachedIngredients.length > 0
                       && attachedIngredients.map(attachedIngredient => {
                        const matchedIngredient = allIngredients.find(
                            ingredient => ingredient.id === attachedIngredient.ingredientId
                        )
                        return <li key={`ingredientdetails--${matchedIngredient?.id}`}>{matchedIngredient?.name}</li>
                           
                       })  
                    }
                </ul>
            </div>
        </section>


    </article>
}
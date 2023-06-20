import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FavoriteButton } from "../PostInteraction/Favorite"
import "./RecipeDetails.css"


export const RecipeCard = () => {
    const navigate = useNavigate()

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
                setAttachedCategories(recipeObject.categoriesOfRecipes)
            })
            .then(() => {
                setRecipeLoading(false)
            })
    }

    /* Define and set state variables for the fetched genre, ingredient and category choices*/
    const [allIngredients, setAllIngredients] = useState([])
    const [allCategories, setAllCategories] = useState([])

    // Set state variables for loading time
    const [recipeLoading, setRecipeLoading] = useState(true)
    const [ingredientsLoading, setIngredientsLoading] = useState(true)
    const [categoriesLoading, setCategoriesLoading] = useState(true)

    // Define a function to fetch all ingredients, categories
    const fetchList = (endpoint, setterFunc, setLoading) => {
        fetch(`http://localhost:8088/${endpoint}`)
            .then(response => response.json())
            .then((data) => {
                setterFunc(data)
            })
            .then(() => {
                setLoading(false)
            })
    }

    // On initial render, set the recipeCard along with its relationships
    useEffect(
        () => {
            fetchSelectedRecipe()
            fetchList("ingredients", setAllIngredients, setIngredientsLoading)
            fetchList("categories", setAllCategories, setCategoriesLoading)
        },
        []
    )

    // Get current user
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)
    

    return <article className="recipeDetails">
        <header>
            <h1 className="recipeDetails--title">{recipeCard.title}</h1>
        </header>

        <section className="recipeDetails--topContainer">
            {
                recipeCard.userId !== gastroUserObject.id
                ? <div className="recipeDetails_fav"><FavoriteButton recipe={recipeCard} /></div>
                    : <div className="recipeDetails_fav">
                        <button
                            onClick={(evt) => {
                                evt.preventDefault()
                                navigate(`/recipe/${recipeCard.id}/edit/${recipeCard.userId}`)
                            }}
                        >Edit</button>
                    </div>
            }
        </section>

        <section>
            <div>{recipeCard?.genre?.name}</div>
            <div>Posted by: <Link to={`/userprofile/${recipeCard?.user?.id}`}>{recipeCard?.user?.name}</Link></div>
        </section>

        <section>
            {
                recipeCard?.image?.length > 0 
                && <img src={recipeCard.image} alt="recipe" />
            }
        </section>

        <section className="recipeDetails_times">
            <div>Prep Time:{recipeCard.prepTime} minutes</div>
            <div>Cooking Time: {recipeCard.cookTime} minutes</div>
            <div>Total Time: {recipeCard.prepTime + recipeCard.cookTime} minutes</div>
        </section>

        <section>
            <div>Serves {recipeCard.servingSize}</div>
        </section>

        <section>
            <div>
                <h4>Description</h4>
                <div>{recipeCard.description}</div>
            </div>
            <div>
                <h4>Ingredients</h4>
                {
                    !ingredientsLoading && !recipeLoading
                        ? <ul>
                            { // Check if ingredient arrays have been populated and then find matching ingredient objects
                                attachedIngredients.length > 0 &&
                                allIngredients.length > 0 &&
                                attachedIngredients.map(attachedIngredient => {
                                    const matchedIngredient = allIngredients.find(
                                        ingredient => ingredient.id === attachedIngredient.ingredientId
                                    )
                                    if (matchedIngredient) { // Check if the matched ingredient value is truthy before rendering
                                        return <li key={`ingredientdetails--${matchedIngredient.id}`}>{attachedIngredient.quantity} {attachedIngredient.quantityUnit} {matchedIngredient.name}</li>
                                    } else {
                                        return null
                                    }
                                })
                            }
                        </ul>
                        : <div>Loading...</div>
                }
            </div>
        </section>

        <section>
            <h4>Preparation</h4>
            <div>{recipeCard.prepInstructions}</div>
        </section>

        <section>
            <h4>Cooking Instructions</h4>
            <div>{recipeCard.cookInstructions}</div>
        </section>

        {
            recipeCard.note
            && <section>
                <h4>Additional Notes and Tips</h4>
                <div>{recipeCard.note}</div>
            </section>
        }

        <section className="recipeDetails__categories">
            { /* Check if category arrays have been populated and then find matching category objects */
                !recipeLoading && !categoriesLoading
                    ? attachedCategories.length > 0 &&
                        attachedCategories.map(attachedCategory => {
                        const matchedCategory = allCategories.find(
                            category => category.id === attachedCategory.categoryId
                        )
                        if (matchedCategory) { // Check if the matched ingredient value is truthy before rendering
                            console.log("matchedCat", matchedCategory)
                            console.log("category relationship", attachedCategory)
                            return <div className="recipeDetails__category" key={`categorydetails--${matchedCategory.id}`}># {matchedCategory.name}</div>
                        } else {
                            return null
                        }
                    })
                    : <div>Loading...</div>
            }
        </section>


    </article>
}
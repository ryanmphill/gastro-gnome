import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FavoriteButton } from "../PostInteraction/Favorite"
import "./RecipeDetails.css"
import { Nutrition } from "./Nutrition"
import placeholderImg from "../../assets/food-placeholder-medium.svg"


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
        <header className="recipeDetails--header">
            <h1 className="recipeDetails--title">{recipeCard.title}</h1>
        </header>

        <section className="recipeDetails--topContainer">
            {
                recipeCard.userId !== gastroUserObject.id
                ? <div className="recipeDetails_fav"><FavoriteButton recipe={recipeCard} /></div>
                    : <div className="recipeDetails_fav">
                        <button className="btn-secondary"
                            onClick={(evt) => {
                                evt.preventDefault()
                                navigate(`/recipe/${recipeCard.id}/edit/${recipeCard.userId}`)
                            }}
                        >Edit</button>
                    </div>
            }
        </section>

        <section className="recipeDetails__userInfo">
            <div><b>{recipeCard?.genre?.name}</b></div>
            <div>Posted by: <Link to={`/userprofile/${recipeCard?.user?.id}`}>{recipeCard?.user?.name}</Link></div>
        </section>
        <div className="recipeDetails__imageAndTimesContainer">
            <section className="recipeDetails__imgContainer">
                <div className="recipeDetails__imgWrapper">
                    {
                        recipeCard?.image?.length > 0
                        ? <img className="recipeDetails--img" src={recipeCard.image} alt="recipe" />
                        : <img className="recipeDetails--img" src={placeholderImg} alt="recipe" />
                    }
                </div>
            </section>
            <div className="recipeDetails__timesServingsDescription">
                <section className="recipeDetails_times">
                    <div className="recipeDetails_time"><div><b>Prep Time:</b></div>  <div>{recipeCard.prepTime} minutes</div></div>
                    <div className="recipeDetails_time"><div><b>Cooking Time:</b></div>  <div>{recipeCard.cookTime} minutes</div></div>
                    <div className="recipeDetails_time"><div><b>Total Time:</b></div>  <div>{recipeCard.prepTime + recipeCard.cookTime} minutes</div></div>
                </section>

                <section className="recipeDetails__servings">
                    <div><b>Servings:</b> {recipeCard.servingSize}</div>
                </section>

                <section>
                    <div>
                        <h4>Description</h4>
                        <div className="recipeDetails--textblock" id="recipeDetails--desc" >{recipeCard.description}</div>
                    </div>
                </section>
            </div>
        </div>
        
        <section className="IngrNutritionContainer">
            <div className="recipeDetails__ingredientContainer">
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

            <Nutrition
            recipeTitle={recipeCard.title}
            allIngredients={allIngredients}
            attachedIngredients={attachedIngredients}
            recipeLoading={recipeLoading}
            ingredientsLoading={ingredientsLoading}
            servingSize={recipeCard.servingSize} />
        </section>

        <section>
            <h4>Preparation</h4>
            <div className="recipeDetails--textblock" >{recipeCard.prepInstructions}</div>
        </section>

        <section>
            <h4>Cooking Instructions</h4>
            <div className="recipeDetails--textblock" >{recipeCard.cookInstructions}</div>
        </section>

        {
            recipeCard.note
            && <section>
                <h4>Additional Notes and Tips</h4>
                <div className="recipeDetails--textblock" >{recipeCard.note}</div>
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
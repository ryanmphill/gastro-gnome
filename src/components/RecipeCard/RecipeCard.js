import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


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
    

    return <>
    <h1>Title</h1>
    </>
}
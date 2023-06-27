import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RecipeFeed } from "./RecipeFeed"
import { SearchRecipes } from "./SearchRecipes"


export const Home = () => {
    const [recipes, setRecipes] = useState([]) // Observing initial state []
    const [filteredRecipes, setFilteredRecipes] = useState([])
    const [searchTerms, updateSearchTerms] = useState("")

    // Define additional state variables to allow users to stack filtering options
    const [onlyRecipesWithTags, updateOnlyRecipesWithTags] = useState([])
    const [onlySearchedRecipes, updateOnlySearchedRecipes] = useState([])

    // Get the current user
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    // Fetch the list of recipes with user info expanded and ingredients and categories embedded
    const fetchRecipes = () => {
        fetch(`http://localhost:8088/recipeCards?_expand=user&_embed=ingredientsInRecipes&_embed=categoriesOfRecipes`)
            .then(response => response.json())
            .then((recipeArray) => {
                setRecipes(recipeArray)
            })
    }
    useEffect(
        () => {
            fetchRecipes()
        },
        [] // When this array is empty, you are observing initial component state
    )

    // Set the filtered recipes to default upon initial render
    useEffect(
        () => {
            if (searchTerms === "" && onlyRecipesWithTags.length === 0) {
                setFilteredRecipes(recipes)
            }
            if (searchTerms === "" && onlyRecipesWithTags.length > 0) {
                setFilteredRecipes(onlyRecipesWithTags)
                updateOnlySearchedRecipes([])
            }
        },
        [recipes, searchTerms] 
    )
    
    // Assign a variable to useNavigate()
    const navigate = useNavigate()
    
    return <section className="pageBody">
        <SearchRecipes searchTerms={searchTerms} 
        updateSearchTerms={updateSearchTerms} 
        setFilteredRecipes={setFilteredRecipes}
        recipes={recipes}
        filteredRecipes={filteredRecipes}
        onlyRecipesWithTags={onlyRecipesWithTags}
        updateOnlyRecipesWithTags={updateOnlyRecipesWithTags}
        onlySearchedRecipes={onlySearchedRecipes}
        updateOnlySearchedRecipes={updateOnlySearchedRecipes} />

        <h2>Recipe List</h2>

        
        <button onClick={ () => navigate("/postrecipe") }>Post a Recipe</button>
        <RecipeFeed recipes={filteredRecipes} gastroUserObject={gastroUserObject} updateMainFeed={fetchRecipes} />
    </section>
}
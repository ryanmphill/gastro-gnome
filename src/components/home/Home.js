import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RecipeFeed } from "./RecipeFeed"
import { FilterBar } from "./FilterBar"
import { FeedChoice } from "./FeedChoice"
import "./FilterBar.css"


export const Home = () => {
    // Get the current user
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    // State for all recipes
    const [recipes, setRecipes] = useState([]) // Observing initial state []

    /* State for which posts to display at the broadest level. User can choose
       'discover', which shows all posts, or 'my feed' which shows posts from 
       only users the current user is 'following' */
    const [display, setDisplay] = useState("allPosts") 
    // State for recipes that will be displayed based on users selection of display
    const [recipesToDisplay, updateRecipesToDisplay] = useState([])
    // State for recipes filtered by either searching or filtering by category

    /*--FILTER-OPTIONS--------------------------------------------------------------------------*/ 
    // State to allow recipes to be filtered by search query or by selected category tag
    const [filteredRecipes, setFilteredRecipes] = useState([])
    // State to track user input in search bar
    const [searchTerms, updateSearchTerms] = useState("")
    // State to keep track of all selected categories the user wants to use to filter recipe feed
    const [chosenCategories, updateChosenCategories] = useState([])

    /*  Define additional state variables to allow users to stack and unstack filtering options.
        Once the 'recipesToDisplay' is set, separate state will be preserved for filtering by search
        query and filtering by category tag. This will allow the user remove their search and still
        view filtered recipes based on category, or remove the selected category filters and still
        view results based on their search. */
    const [onlyRecipesWithTags, updateOnlyRecipesWithTags] = useState([])
    const [onlySearchedRecipes, updateOnlySearchedRecipes] = useState([])
    /*-------------------------------------------------------------------------------------------*/

    /*---------------------------------------------------------------------------------------------------------*/
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
    /*---------------------------------------------------------------------------------------------------------*/
    
    /* Set the filtered recipes to default upon initial render AND every time the search input is cancellled out.
       Filtering by search is mostly handled by click, but it is necessary to observe when the entire search query
       is cleared. If the search is removed but category filters are still in place, set the filteredRecipes to only 
       those filtered by category. Since the category tags being selected and unselected are already being observed in
       a separate useEffect() in the FilterByCategories component, that useEffect() will handle updating the 
       filteredRecipes when chosen category state changes.    */
    useEffect(
        () => {
            if (searchTerms === "" && chosenCategories.length === 0) {
                setFilteredRecipes(recipesToDisplay)
            }
            if (searchTerms === "" && chosenCategories.length > 0) {
                setFilteredRecipes(onlyRecipesWithTags)
            }
        },
        [recipesToDisplay, searchTerms, onlyRecipesWithTags] 
        /*Observe recipesToDisplay for initial render and for when display changes, observe search terms
          to update when input is cleared, and observe onlyRecipesWithTags to update with the most current
          recipes filtered based on category tag selection */
    )

    /*-----------------------------------------------------------------------------------------------------*/
    // Maintain 'follows' state here so that all listed recipes are updated when user is followed/unfollowed
    // Set a state variable for the user's follows
    const [usersFollows, updateUsersFollows] = useState([])

    // Define a function to fetch the current user with their follows embedded
    const fetchUsersFollows = () => {
        fetch(`http://localhost:8088/users/${gastroUserObject.id}?_embed=follows`)
                .then(response => response.json())
                .then((userObject) => {
                    const followArray = userObject.follows
                    updateUsersFollows(followArray)
                })
    }

    // Get the data for the current user with their follows embedded on initial render
    useEffect(
        () => {
            fetchUsersFollows()
        },
        [] // When this array is empty, you are observing initial component state
    )
    /*-----------------------------------------------------------------------------------------------------*/
    
    // Assign a variable to useNavigate()
    const navigate = useNavigate()
    
    return <section className="pageBody">
        <FeedChoice recipes={recipes}
        display={display}
        setDisplay={setDisplay}
        updateRecipesToDisplay={updateRecipesToDisplay}
        usersFollows={usersFollows} />

        <FilterBar searchTerms={searchTerms} 
        updateSearchTerms={updateSearchTerms} 
        setFilteredRecipes={setFilteredRecipes}
        recipes={recipesToDisplay}
        onlyRecipesWithTags={onlyRecipesWithTags}
        updateOnlyRecipesWithTags={updateOnlyRecipesWithTags}
        onlySearchedRecipes={onlySearchedRecipes}
        updateOnlySearchedRecipes={updateOnlySearchedRecipes}
        chosenCategories={chosenCategories}
        updateChosenCategories={updateChosenCategories} />

        
        {
            display === "allPosts"
                ? <h2 className="discoverFade feedHeader">Discover New Recipes</h2>
                : <h2 className="myFeedFade feedHeader">Recipes From People You're Following</h2>
        }
        

        
        <button onClick={ () => navigate("/postrecipe") }>Post a Recipe</button>
        <RecipeFeed recipes={filteredRecipes} 
        gastroUserObject={gastroUserObject} 
        updateMainFeed={fetchRecipes}
        usersFollows={usersFollows}
        fetchUsersFollows={fetchUsersFollows} />
    </section>
}
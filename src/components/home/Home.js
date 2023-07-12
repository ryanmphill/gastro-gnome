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


    /*--FILTER-OPTIONS--------------------------------------------------------------------------*/
    /* State for which posts to display at the broadest level. User can choose
       'discover', which shows 'allPosts', or 'my feed' which shows 'postsFollowed' - 
       posts from only users the current user is 'following' */
    const [display, setDisplay] = useState("allPosts") 
    // State for recipes that will be displayed based on users selection of 'display'
    const [recipesToDisplay, updateRecipesToDisplay] = useState([])
    // State to allow recipes to be filtered by search query or by selected category tag
    const [filteredRecipes, setFilteredRecipes] = useState([])
    /*-------------------------------------------------------------------------------------------*/

    /*-GET RECIPES FETCH CALL-------------------------------------------------------------------------------*/
    // Fetch the list of recipes with user info expanded and ingredients and categories embedded
    const fetchRecipes = () => {
        fetch(`http://localhost:8088/recipeCards?_expand=user&_embed=ingredientsInRecipes&_embed=categoriesOfRecipes`)
            .then(response => response.json())
            .then((fetchedArray) => {
                const recipeArray = fetchedArray.reverse()
                setRecipes(recipeArray)
            })
    }
    useEffect(
        () => {
            fetchRecipes()
        },
        [] // When this array is empty, you are observing initial component state
    )
    /*-----------------------------------------------------------------------------------------------------*/

    /*-GET CURRENT USER'S FOLLOW DATA-----------------------------------------------------------------------*/
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
    
    /* Render discover/my-feed tab, filter bar for searching/filtering by category, post recipe button,
       and recipe feed */
    return <section className="pageBody">

        <FeedChoice recipes={recipes}
                display={display}
                setDisplay={setDisplay}
                updateRecipesToDisplay={updateRecipesToDisplay}
                usersFollows={usersFollows} />
        

        <div className="feedControl">

            <FilterBar setFilteredRecipes={setFilteredRecipes}
                recipes={recipesToDisplay} />


            {
                display === "allPosts"
                    ? <h2 className="discoverFade feedHeader">Discover New Recipes</h2>
                    : <h2 className="myFeedFade feedHeader">Recipes From People You're Following</h2>
            }



            <button className="btn-primary" onClick={() => navigate("/postrecipe")}>Post a Recipe</button>
            <RecipeFeed recipes={filteredRecipes}
                gastroUserObject={gastroUserObject}
                updateMainFeed={fetchRecipes}
                usersFollows={usersFollows}
                fetchUsersFollows={fetchUsersFollows} />

        </div>
    </section>
}
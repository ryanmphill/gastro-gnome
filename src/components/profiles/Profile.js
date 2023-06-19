import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RecipeFeed } from "../feed/RecipeFeed"


export const Profile = () => {
    const [recipes, setRecipes] = useState([]) // Observing initial state []
    const [filteredRecipes, setFilteredRecipes] = useState([])
    const [ownerOfProfile, setOwnerOfProfile] = useState({})
    const [postsToDisplay, setPostsToDisplay] = useState("selectedUsersPosts") // Display profile owner's posts by default

    //assign a useParams() variable to the visited user's id
    const {selectedUserId} = useParams()

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

    // Observe the state for which recipes should be displayed
    useEffect(
        () => {
            // Filter the recipes so that only the posts by user whose profile is being viewed are being displayed
            if (postsToDisplay === "selectedUsersPosts") {
                const visitedUsersPosts = recipes.filter(recipe => recipe.userId === parseInt(selectedUserId))
                setFilteredRecipes(visitedUsersPosts)
            }
            // Filter the recipes so that only the selected user's favorites are being displayed
            if(postsToDisplay === "thisUsersFavorites") {
                const favRelationshipArray = ownerOfProfile.favorites
                const usersFavRecipes = recipes.filter((recipe) => favRelationshipArray.find(fav => fav.recipeCardId === recipe.id))
                setFilteredRecipes(usersFavRecipes)
            }
            
        },
        [recipes, postsToDisplay] // 
    )

    // Get the data for the selected profile user with their favorites embedded
    useEffect(
        () => {
            fetch(`http://localhost:8088/users/${selectedUserId}?_embed=favorites`)
                .then(response => response.json())
                .then((userObject) => {
                    setOwnerOfProfile(userObject)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )
    
    // Assign a variable to useNavigate()
    const navigate = useNavigate()
    
    return <>
        <h1>{ownerOfProfile.name}</h1>

        <input
            type="radio"
            name="profilePostInterface"
            value="selectedUsersPosts"
            checked={postsToDisplay === "selectedUsersPosts"}
            onChange={() => setPostsToDisplay("selectedUsersPosts")}
        />{ownerOfProfile.name}'s Posts

        <input
            type="radio"
            name="profilePostInterface"
            value="thisUsersFavorites"
            checked={postsToDisplay === "thisUsersFavorites"}
            onChange={() => setPostsToDisplay("thisUsersFavorites")}
        />{ownerOfProfile.name}'s Favorites

        <h2>Recipe List</h2>

        <RecipeFeed recipes={filteredRecipes} gastroUserObject={gastroUserObject} />
    </>

}
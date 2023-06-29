import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ProfileFeed } from "./ProfileFeed"
import { FollowedBy } from "./FollowedBy"
import { Following } from "./Following"


export const Profile = () => {
    const [recipes, setRecipes] = useState([]) // Observing initial state []
    const [filteredRecipes, setFilteredRecipes] = useState([])
    const [ownerOfProfile, setOwnerOfProfile] = useState({})
    const [ownerIsFollowing, setOwnerIsFollowing] = useState([])
    const [postsToDisplay, setPostsToDisplay] = useState("selectedUsersPosts") // Display profile owner's posts by default
    const [display, setDisplay] = useState("posts")

    //assign a useParams() variable to the visited user's id
    const {selectedUserId} = useParams()

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
        [selectedUserId] // When this array is empty, you are observing initial component state
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
        [recipes, postsToDisplay, ownerOfProfile] // 
    )

    // Get the data for the selected profile user with their favorites and followers embedded
    const fetchUserWithFavs = () => {
        fetch(`http://localhost:8088/users/${selectedUserId}?_embed=favorites&_embed=follows`)
                .then(response => response.json())
                .then((userObject) => {
                    setOwnerOfProfile(userObject)
                    setOwnerIsFollowing(userObject.follows)
                })
    }
    useEffect(
        () => {
            fetchUserWithFavs()
        },
        [selectedUserId] // When this array is empty, you are observing initial component state
    )

    /*-----------------------------------------------------------------------------------------------------*/
    // Maintain 'follows' state here so that all listed recipes and profile are updated when user is followed/unfollowed
    // Set a state variable for the user's follows
    const [currentUsersFollows, updateCurrentUsersFollows] = useState([])

    // Define a function to fetch the current user with their follows embedded
    const fetchUsersFollows = () => {
        fetch(`http://localhost:8088/users/${gastroUserObject.id}?_embed=follows`)
                .then(response => response.json())
                .then((userObject) => {
                    const followArray = userObject.follows
                    updateCurrentUsersFollows(followArray)
                })
    }

    // Get the data for the current user with their follows embedded on initial render
    useEffect(
        () => {
            fetchUsersFollows()
        },
        [] // 
    )
    /*-----------------------------------------------------------------------------------------------------*/
    
    // Assign a variable to useNavigate()
    const navigate = useNavigate()
    
    return <section className="pageBody">
        <h2>{ownerOfProfile.name}</h2>

        <input
            type="radio"
            name="profilePostInterface"
            value="selectedUsersPosts"
            checked={postsToDisplay === "selectedUsersPosts" && display === "posts"}
            onChange={() => {
                setPostsToDisplay("selectedUsersPosts")
                setDisplay("posts")
            }}
        />
        <span>
            {
                parseInt(selectedUserId) === gastroUserObject.id
                    ? <>My Posts</>
                    : <>{ownerOfProfile.name}'s Posts</>
            }
        </span>

        <input
            type="radio"
            name="profilePostInterface"
            value="thisUsersFavorites"
            checked={postsToDisplay === "thisUsersFavorites" && display === "posts"}
            onChange={() => {
                setPostsToDisplay("thisUsersFavorites")
                setDisplay("posts")
            }}
        />
        <span>
            {
                parseInt(selectedUserId) === gastroUserObject.id
                    ? <>My Favorites</>
                    : <>{ownerOfProfile.name}'s Favorites</>
            }
        </span>

        <input
            type="radio"
            name="profilePostInterface"
            value="followers"
            checked={display === "followers"}
            onChange={() => {
                setDisplay("followers")
            }}
        />
        <span>
            {
                parseInt(selectedUserId) === gastroUserObject.id
                    ? <>My Followers</>
                    : <>{ownerOfProfile.name}'s Followers</>
            }
        </span>

        <input
            type="radio"
            name="profilePostInterface"
            value="following"
            checked={display === "following"}
            onChange={() => {
                setDisplay("following")
            }}
        />
        <span>Following</span>

        {
            display === "posts"
            && <>
                <h2>Recipe List</h2>

                <ProfileFeed recipes={filteredRecipes}
                    gastroUserObject={gastroUserObject}
                    updateProfileFavs={fetchUserWithFavs}
                    updateProfileFeed={fetchRecipes}
                    usersFollows={currentUsersFollows}
                    fetchUsersFollows={fetchUsersFollows} />
            </>
        }

        {
            display === "followers"
            && <>
            <h2>Followers</h2>
            <FollowedBy
            selectedUserId={selectedUserId}
            gastroUserObject={gastroUserObject}
            currentUsersFollows={currentUsersFollows}
            fetchUsersFollows={fetchUsersFollows} />
            </>
        }

        {
            display === "following"
            && <>
            <h2>Following</h2>
            <Following
            followArray={ownerIsFollowing}
            updateFollowArray={fetchUserWithFavs}
            gastroUserObject={gastroUserObject}
            currentUsersFollows={currentUsersFollows}
            fetchUsersFollows={fetchUsersFollows} />
            </>
        }
    </section>

}
import { Link, useNavigate } from "react-router-dom"
import { DeleteRecipe } from "../PostInteraction/DeleteRecipe"
import { FavoriteButton } from "../PostInteraction/Favorite"
import { FollowButton } from "../PostInteraction/FollowUser"
import { useEffect, useState } from "react"

export const RecipeFeed = ({recipes, gastroUserObject, updateMainFeed}) => {
    const navigate = useNavigate()

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

    return <article className="recipeFeed">
    {
        recipes.map(
            (recipe) => {
                return <section className="recipe" key={`recipe--${recipe.id}`}>
                    <h3><Link className="recipe--header" to={`/recipe/${recipe.id}`}>{recipe.title}</Link></h3>
                    <div>{recipe.description}</div>
                    <div className="recipe__userContainer">
                        <div>Posted by: <Link to={`/userprofile/${recipe?.user?.id}`}>{recipe?.user?.name}</Link></div>
                        {
                            gastroUserObject.id !== recipe.userId
                            && <FollowButton 
                            gastroUserObject={gastroUserObject}
                            userToFollowId={recipe.userId}
                            usersFollows={usersFollows}
                            fetchUsersFollows={fetchUsersFollows} />
                        }
                    </div>
                    <footer>
                        {
                            gastroUserObject.id === recipe.userId
                            ? <>
                            <button
                                onClick={(evt) => {
                                    evt.preventDefault()
                                    navigate(`/recipe/${recipe.id}/edit/${recipe.userId}`)
                                }}
                            >Edit</button>
            
                            <DeleteRecipe recipeId={recipe.id}
                                recipeIngredients={recipe.ingredientsInRecipes}
                                recipeCategories={recipe.categoriesOfRecipes}
                                updateMainFeed={updateMainFeed} />
                            </>
                            : <FavoriteButton recipe={recipe} />
                        }
                    </footer>
                </section>
            }
        )
    }
</article>
}
import { Link, useNavigate } from "react-router-dom"
import { DeleteRecipe } from "../PostInteraction/DeleteRecipe"
import { FavoriteButton } from "../PostInteraction/Favorite"
import { FollowButton } from "../PostInteraction/FollowUser"


export const ProfileFeed = ({recipes, gastroUserObject, updateProfileFavs, updateProfileFeed, usersFollows, fetchUsersFollows}) => {
    const navigate = useNavigate()
    return <article className="recipeFeed">
    {
        recipes.map(
            (recipe) => {

                const bgImageStyle = {
                    '--bg-image': `url(${recipe.image})`,
                }

                return <section className="recipe" key={`recipe--${recipe.id}`}>
                    <div className="recipe--imgContainer" style={bgImageStyle}>
                        
                        </div>
                    <div className="recipe--content">
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
                                            updateProfileFeed={updateProfileFeed} />
                                    </>
                                    : <FavoriteButton recipe={recipe} updateProfileFavs={updateProfileFavs} />
                            }
                        </footer>
                    </div>
                </section>
            }
        )
    }
</article>
}
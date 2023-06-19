import { Link } from "react-router-dom"
import { DeleteRecipe } from "../PostInteraction/DeleteRecipe"
import { FavoriteButton } from "../PostInteraction/Favorite"

export const RecipeFeed = ({recipes, gastroUserObject}) => {
    return <article className="recipeFeed">
    {
        recipes.map(
            (recipe) => {
                return <section className="recipe" key={`recipe--${recipe.id}`}>
                    <h3>{recipe.title}</h3>
                    <div>{recipe.description}</div>
                    <div>Posted by: <Link to={`/userprofile/${recipe?.user?.id}`}>{recipe?.user?.name}</Link></div>
                    <footer>
                        {
                            gastroUserObject.id === recipe.userId
                            ? <>
                            <Link to={`/recipe/${recipe.id}/edit/${recipe.userId}`}>Edit</Link>
                            <DeleteRecipe recipeId={recipe.id}
                                recipeIngredients={recipe.ingredientsInRecipes}
                                recipeCategories={recipe.categoriesOfRecipes} />
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
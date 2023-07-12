import { useEffect } from "react"


export const FeedChoice = ({ recipes, display, setDisplay, updateRecipesToDisplay, usersFollows }) => {
    
    // Show only posts from users being followed when 'my feed' tab is toggled
    useEffect(
        () => {
            if (display === "allPosts") {
                updateRecipesToDisplay(recipes)
            }

            if (display === "postsFollowed") {
                const postsFromUsersFollowed = recipes.filter(
                    recipe => usersFollows.some(followObj => followObj.whoIsFollowed === recipe.userId))
                updateRecipesToDisplay(postsFromUsersFollowed)
            }
        },
        [recipes, display, usersFollows]
    )


    return <>
        <div className="recipeDisplayTab">
            <button className={`recipeDisplayTabLink recipeDisplayTab--hoverEffect underline-effect ${display === "allPosts" ? 'active' : ''}`}
            onClick={(e) => {
                e.preventDefault()
                setDisplay("allPosts")
            }}>Discover</button>

            <button className={`recipeDisplayTabLink recipeDisplayTab--hoverEffect underline-effect ${display === "postsFollowed" ? 'active' : ''}`}
            onClick={(e) => {
                e.preventDefault()
                setDisplay("postsFollowed")
            }}>My Feed</button>
        </div>
    </>
}
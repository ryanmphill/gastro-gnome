import { useEffect } from "react"


export const FeedChoice = ({ recipes, display, setDisplay, updateRecipesToDisplay, usersFollows }) => {

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
        <input
            type="radio"
            name="feedChoiceInterface"
            value="allPosts"
            checked={display === "allPosts"}
            onChange={() => {
                setDisplay("allPosts")
            }}
        />
        <span>Discover</span>

        <input
            type="radio"
            name="feedChoiceInterface"
            value="postsFollowed"
            checked={display === "postsFollowed"}
            onChange={() => {
                setDisplay("postsFollowed")
            }}
        />
        <span>My Feed</span>
    </>
}
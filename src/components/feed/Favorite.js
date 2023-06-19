import { useEffect, useState } from "react"


export const FavoriteButton = ( {recipe} ) => {
    // get the current user
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    // Set a state variable for the user's favorites
    const [usersFavs, updateUsersFavs] = useState([])

    // Define a variable for the favorite object to be POSTed
    const favoriteObjectToPost = {
        userId: gastroUserObject.id,
        recipeCardId: recipe.id
    }

    // Define a function to fetch the current user with their favorites embedded
    const fetchUserFavs = () => {
        fetch(`http://localhost:8088/users/${gastroUserObject.id}?_embed=favorites`)
                .then(response => response.json())
                .then((userObject) => {
                    const favoriteArray = userObject.favorites
                    updateUsersFavs(favoriteArray)
                })
    }

    // Get the data for the current user with their favorites embedded on initial render
    useEffect(
        () => {
            fetchUserFavs()
        },
        [] // When this array is empty, you are observing initial component state
    )

    // Handle the click to favorite a post
    const handleFavorite = (event) => {
        event.preventDefault()
        console.log("favoriteToPost", favoriteObjectToPost)
        
        // POST favorite object to API ///////////////////////////////////
        fetch("http://localhost:8088/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(favoriteObjectToPost)
        })
            .then(response => {
                if (response.ok) {
                    return response.json() // Await the response.json() Promise
                } else {
                    throw new Error("Unable to favorite recipe");
                }
            })
            .then(postedObject => {
                console.log("Posted Favorite", postedObject)
                // Update the user's list of favorites state
                fetchUserFavs()
            })
            .catch(error => {
                console.error("An error occurred:", error);
                window.alert("Something went wrong");
            })
        
    }

    // Handle the click to unfavorite a post
    const handleUndoFavorite = (event) => {
        event.preventDefault()
        // Find the favorite relationship between the user and recipeCard
        const favToDelete = usersFavs.find(userFav => userFav.recipeCardId === recipe.id)
        console.log("favoriteToDelete", favToDelete)
        console.log("FavToDelete Id", favToDelete.id)

        //DELETE the favorite object
        fetch(`http://localhost:8088/favorites/${favToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Unable to undo favorite')
                }
            })
            .then(() => {
                console.log('Favorite object successfully deleted')
                // Update the user's list of favorites state
                fetchUserFavs()
            })
            .catch((error) => {
                console.error('An error occurred:', error)
                window.alert('Something went wrong')
            })
            
    }

    /*Define a variable with a value of true if the user has already favorited this post, and false 
    if they haven't favorited this post yet*/
    const alreadyFavorited = usersFavs.some(userFav => userFav.recipeCardId === recipe.id)

    // Return the UI
    return <>
        {
            !alreadyFavorited
                ? <button onClick={click => handleFavorite(click)}>Favorite</button>
                : <button onClick={click => handleUndoFavorite(click)}>*Favorited*</button>
        }
    </>
}
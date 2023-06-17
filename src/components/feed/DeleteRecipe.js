import { useState } from "react"
import "./DeleteRecipe.css"

export const DeleteRecipe = ({ recipeId, recipeIngredients, recipeCategories }) => {
    // Define state variable for if delete button was clicked
    const [showPrompt, setShowPrompt] = useState(false)

    const handleInitialDeleteClick = (event) => {
        event.preventDefault()
        console.log("recipeId", recipeId)
        console.log("ingredients", recipeIngredients)
        console.log("categories", recipeCategories)
        setShowPrompt(true)
    }

    const handleCancelDelete = (event) => {
        event.preventDefault()
        setShowPrompt(false)
    }
    // Make copy of arrays to delete
    const ingredientsToDelete = [ ...recipeIngredients ]
    const categoriesToDelete = [ ...recipeCategories ]

    const handleDeleteRecipe = (event) => {
        event.preventDefault();
      
        //Define function to DELETE the relationship objects
        const deleteRelationships = (arrayOfObjects, endpoint) => {
          const promises = arrayOfObjects.map((dataObject) => {
            return fetch(`http://localhost:8088/${endpoint}/${dataObject.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }
            })
            .then((response) => response.json())
          });
        
          return Promise.all(promises)
            .then((results) => {
              console.log(results)
              return results
            })
            .catch((error) => {
              console.error(error)
              throw error
            })
      }

        // DELETE Ingredients 
        if (ingredientsToDelete.length > 0) {
          deleteRelationships(ingredientsToDelete, "ingredientsInRecipes")
        }

        // DELETE Categories
        if (categoriesToDelete.length > 0) {
          deleteRelationships(categoriesToDelete, "categoriesOfRecipes")
        }

        // DELETE recipeCard ////////////////////////////////////////////
        fetch(`http://localhost:8088/recipeCards/${recipeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json(); // Await the response.json() Promise
            } else {
              throw new Error('Unable to delete recipe');
            }
          })
          .then(() => {
            console.log('Recipe successfully deleted');
          })
          .catch((error) => {
            console.error('An error occurred:', error);
            window.alert('Something went wrong');
          });
      };
    
    return <>
    
    

        {showPrompt
            ? 
                <div className="confirmation-prompt">
                    <p>Are you sure you want to delete?</p>
                    <button onClick={(click) => handleDeleteRecipe(click)}>Delete</button>
                    <button onClick={(click) => handleCancelDelete(click)}>Cancel</button>
                </div>
            
            : 
                <button
                    onClick={(click) => handleInitialDeleteClick(click)}
                >Delete</button>
            
        }
    </>
}
import { useEffect, useState } from "react"
import "../RecipeForm.css"
import { useParams } from "react-router-dom"
import { EditIngredients } from "./EditIngredients"
import { EditCategories } from "./EditCategories"


export const EditRecipe = () => {
    // Get the current user information
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    // Get the selected recipe id
    const {recipeId} = useParams()

    /* Define and set state variable for the recipe object to be edited,
       the initial ingredient and category relationships, ingredient and category relationships 
       to be posted, and the ingredient and category relationships to be deleted */
    const [recipe, updateRecipe] = useState(
        {
            "id": 0,
            "title": "",
            "genreId": 0,
            "description": "",
            "prepInstructions": "",
            "cookInstructions": "",
            "prepTime": 0,
            "cookTime": 0,
            "servingSize": 0,
            "userId": 0,
            "note": "",
            "timestamp": 0,
            "image": ""
        }
    )

    const [initialIngredients, setInitialIngredients] = useState([])

    const [ingredientsToDelete, updateIngredientsToDelete] = useState([])

    const [ingredientsToPost, updateIngredientsToPost] = useState([])

    const [ingredientToAdd, updateIngredientToAdd] = useState(
        {
            "ingredientId": 0,
            "recipeCardId": parseInt(recipeId),
            "quantity": 0,
            "quantityUnit": ""
        }
    )

    const [initialCategories, setInitialCategories] = useState([])

    const [categoriesToDelete, updateCategoriesToDelete] = useState([])

    const [categoriesToPost, updateCategoriesToPost] = useState([])

    const [categoryToAdd, updateCategoryToAdd] = useState(
        {
            "recipeCardId": parseInt(recipeId),
            "categoryId": 0
        }
    )

    /* Define and set state variables for the fetched genre, ingredient and category choices*/
    const [allIngredients, setAllIngredients] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [genres, setGenres] = useState([])

    // On initial render, fetch the recipeCard that is being edited and update state
    useEffect(
        () => {
            fetch(`http://localhost:8088/recipeCards/${recipeId}`)
                .then(response => response.json())
                .then((recipeObject) => {
                    updateRecipe(recipeObject)
                })
        },
        []
    )

    // On initial render, fetch the ingredient and Category relationships associated with current recipeCard and update state
    useEffect(
        () => {
            fetch(`http://localhost:8088/recipeCards/${recipeId}?_embed=ingredientsInRecipes&_embed=categoriesOfRecipes`)
                .then(response => response.json())
                .then((recipeObject) => {
                    const attachedIngredients = recipeObject.ingredientsInRecipes
                    const attachedCategories = recipeObject.categoriesOfRecipes
                    setInitialIngredients(attachedIngredients)
                    setInitialCategories(attachedCategories)
                })
        },
        []
    )

    // On initial render, fetch the genres, categories, and ingredients lists
    useEffect(
        () => {
            fetch(`http://localhost:8088/categories`)
                .then(response => response.json())
                .then((categoriesArray) => {
                    setAllCategories(categoriesArray)
                })
        },
        []
    )

    useEffect(
        () => {
            fetch(`http://localhost:8088/ingredients`)
                .then(response => response.json())
                .then((ingredientsArray) => {
                    setAllIngredients(ingredientsArray)
                })
        },
        []
    )

    useEffect(
        () => {
            fetch(`http://localhost:8088/genres`)
                .then(response => response.json())
                .then((genreArray) => {
                    setGenres(genreArray)
                })
        },
        []
    )

    ////////////////////////////////////////////////////////////////////////////////////
    // Handle the post recipe click ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    const handleEditRecipeClick = (event) => {
        event.preventDefault()

        //Define function to POST the relationship objects
        const postRelationships = (arrayOfObjects, endpoint) => {
            const promises = arrayOfObjects.map((dataObject) => {
              return fetch(`http://localhost:8088/${endpoint}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataObject)
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
        
        // Check if all required fields have been entered
        const requiredStr = ['title', 'description', 'prepInstructions', 'cookInstructions']
        const requiredNum = ['genreId', 'prepTime', 'cookTime', 'servingSize']
        const formFilled = requiredStr.every(field => recipe[field].length > 0) && requiredNum.every(field => recipe[field] > 0)
        if (formFilled) {
            // PUT recipeCard to API ////////////////////////////////////////////
            fetch(`http://localhost:8088/recipeCards/${recipeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(recipe)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Await the response.json() Promise
                    } else {
                        throw new Error("Unable to edit recipe");
                    }
                })
                .then(editedRecipeObject => {
                    console.log("Recipe successfully edited", editedRecipeObject);
                    // Post ingredient relationships
                    if (ingredientsToPost.length > 0) {
                        return postRelationships(ingredientsToPost, "ingredientsInRecipes")
                    } else {
                        return null
                    }
                })
                .then(ingredientArr => {
                    ingredientArr && console.log("Ingredients added", ingredientArr);
                    // Post categories
                    if (categoriesToPost.length > 0) {
                        return postRelationships(categoriesToPost, "categoriesOfRecipes")
                    } else {
                        return null
                    }
                })
                .then(categoryArr => {
                    categoryArr && console.log("Categories added", categoryArr);
                    // Delete Ingredients
                    if (ingredientsToDelete.length > 0) {
                        return deleteRelationships(ingredientsToDelete, "ingredientsInRecipes")
                    } else {
                        return null
                    }
                })
                .then(deletedIng => {
                    deletedIng && console.log("Ingredients deleted", deletedIng);
                    // Delete Categories
                    if (categoriesToDelete.length > 0) {
                        return deleteRelationships(categoriesToDelete, "categoriesOfRecipes")
                    } else {
                        return null
                    }
                })
                .then(deletedCat => {
                    deletedCat && console.log("Categories deleted", deletedCat);
                })
                .catch(error => {
                    console.error("An error occurred:", error);
                    window.alert("Something went wrong");
                });
        } else {window.alert("Please fill all required fields")}
        
    }

    return <>
        <form className="postRecipeForm">
            <h2 className="postRecipeForm__title">Edit Your Recipe</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeTitle__input">Recipe Title:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="recipeForm--control"
                        placeholder="Add a title"
                        id = "recipeTitle__input"
                        value={recipe.title}
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.title = changeEvent.target.value
                                updateRecipe(copy) // Updating recipe title with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="genre_dropdown">What course is this recipe?:</label>
                    <select
                        className="recipeForm--control"
                        id="genre_dropdown"
                        value={recipe.genreId}
                        onChange={(changeEvent) => {
                            const copy = { ...recipe };
                            copy.genreId = parseInt(changeEvent.target.value);
                            updateRecipe(copy); // Updating recipe with value of copy
                        }}
                    >   {/*Add options for choosing a genre*/}
                        <option value="0">Select a course</option>
                        {
                            genres.map(genre => <option value={genre.id} key={`genre--${genre.id}`}>{genre.name}</option> )
                        }
                    </select>
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeDescription_input">Description:</label>
                    <textarea
                        required autoFocus
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Add a description for your recipe"
                        id = "recipeDescription_input"
                        value={recipe.description}
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.description = changeEvent.target.value
                                updateRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset className="addIngredients">
                <EditIngredients ingredientsToPost={ingredientsToPost}
                    allIngredients={allIngredients}
                    ingredientToAdd={ingredientToAdd}
                    updateIngredientToAdd={updateIngredientToAdd}
                    updateIngredientsToPost={updateIngredientsToPost}
                    initialIngredients={initialIngredients}
                    ingredientsToDelete={ingredientsToDelete}
                    updateIngredientsToDelete={updateIngredientsToDelete} />
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipePrep_input">Preparation:</label>
                    <textarea
                        required autoFocus
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Add preparation instructions for your recipe"
                        id = "recipePrep_input"
                        value={recipe.prepInstructions}
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.prepInstructions = changeEvent.target.value
                                updateRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeCook_input">Cooking Instructions:</label>
                    <textarea
                        required autoFocus
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Add cooking instructions for your recipe"
                        id = "recipeCook_input"
                        value={recipe.cookInstructions}
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.cookInstructions = changeEvent.target.value
                                updateRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset className="recipeTimes">
                <div className="form-group recipeTime--div">
                    <label htmlFor="prepTime_input">Prep Time:</label>
                    <input
                        required autoFocus
                        type="number"
                        className="recipeForm--control recipeTime--input"
                        placeholder="Enter a time"
                        id="prepTime_input"
                        value={recipe.prepTime !== 0 ? recipe.prepTime : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                        step="0.01" // Set the step attribute to control decimal precision
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.prepTime = changeEvent.target.value !== "" ? Math.round(parseFloat(changeEvent.target.value) * 100) / 100 : 0
                                updateRecipe(copy) // Updating time with value of copy
                            }
                        } />
                </div>
                <div className="form-group recipeTime--div">
                    <label htmlFor="cookTime_input">Cooking Time:</label>
                    <input
                        required autoFocus
                        type="number"
                        className="recipeForm--control recipeTime--input"
                        placeholder="Enter a time"
                        id="cookTime_input"
                        value={recipe.cookTime !== 0 ? recipe.cookTime : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                        step="0.01" // Set the step attribute to control decimal precision
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.cookTime = changeEvent.target.value !== "" ? Math.round(parseFloat(changeEvent.target.value) * 100) / 100 : 0
                                updateRecipe(copy) // Updating time with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group recipeServings--div">
                    <label htmlFor="recipeServings_input">Serving Size:</label>
                    <input
                        required autoFocus
                        type="number"
                        className="recipeForm--control"
                        placeholder="How many people will this meal feed?"
                        id="recipeServings_input"
                        value={recipe.servingSize !== 0 ? recipe.servingSize : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.servingSize = changeEvent.target.value !== "" ? Math.round(parseInt(changeEvent.target.value) * 100) / 100 : 0
                                updateRecipe(copy) // Updating serving size with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset className="addCategories">
                <EditCategories categoriesToPost={categoriesToPost}
                    allCategories={allCategories}
                    categoryToAdd={categoryToAdd}
                    updateCategoryToAdd={updateCategoryToAdd}
                    updateCategoriesToPost={updateCategoriesToPost}
                    initialCategories={initialCategories}
                    categoriesToDelete={categoriesToDelete}
                    updateCategoriesToDelete={updateCategoriesToDelete} />
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeNotes_input">Additional Notes and Tips:</label>
                    <textarea
                        required autoFocus
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Optional"
                        id = "recipeNotes_input"
                        value={recipe.note}
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.note = changeEvent.target.value
                                updateRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeImage__input">Image url:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="recipeForm--control"
                        placeholder="Paste image url here"
                        id = "recipeImage__input"
                        value={recipe.image}
                        onChange={
                            (changeEvent) => {
                                const copy = { ...recipe }
                                copy.image = changeEvent.target.value
                                updateRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>
            
            <button 
                onClick={ (clickEvent) => {handleEditRecipeClick(clickEvent)} }
                className="btn btn-primary submitRecipe">
                Submit Changes
            </button>

            <button
            onClick={(event) => {
                event.preventDefault()
                console.log("edited recipe", recipe)
                console.log("Ingredients to post", ingredientsToPost)
                console.log("Ingredients to delete", ingredientsToDelete)
                console.log("Categories to post", categoriesToPost)
                console.log("categories to delete", categoriesToDelete)
            }}
            >
                View State Changes to submit
            </button>
        </form>
    </>
}
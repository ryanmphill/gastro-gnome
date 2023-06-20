import { useEffect, useState } from "react"
import "../RecipeForm.css"
import { AddIngredients } from "./AddIngredients"
import { AddCategories } from "./AddCategories"


export const PostRecipe = () => {
    // Get the current user information
    const localGastroUser = localStorage.getItem("gastro_user")
    const gastroUserObject = JSON.parse(localGastroUser)

    /* Define and set state variable for the recipe object to be posted,
       the ingredient relationships to be posted, and the category relationships
       to be posted */
    const [newRecipe, updateNewRecipe] = useState(
        {
            "title": "",
            "genreId": 0,
            "description": "",
            "prepInstructions": "",
            "cookInstructions": "",
            "prepTime": 0,
            "cookTime": 0,
            "servingSize": 0,
            "userId": gastroUserObject.id,
            "note": "",
            "timestamp": 0,
            "image": ""
        }
    )

    const [includedIngredients, updateIncludedIngredients] = useState([])

    const [ingredientToAdd, updateIngredientToAdd] = useState(
        {
            "ingredientId": 0,
            "recipeCardId": 0,
            "quantity": 0,
            "quantityUnit": ""
        }
    )

    const [includedCategories, updateIncludedCategories] = useState([])

    const [categoryToAdd, updateCategoryToAdd] = useState(
        {
            "recipeCardId": 0,
            "categoryId": 0
        }
    )

    /* Define and set state variables for the fetched genre, ingredient and category choices*/
    const [allIngredients, setAllIngredients] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [genres, setGenres] = useState([])

    /*Set a state variable to track the response when a recipe is posted. The id from the
      newly created recipe object will be used as a foreign key on the ingredient and 
      category objects */
    const [newRecipeResponseId, setNewRecipeResponseId] = useState(0)

    // On initial render, fetch the genres, categories, and ingredients
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

    // Observe when a new recipeCard id is generated and post the category and ingredient relationships
    useEffect(() => {
        if (newRecipeResponseId !== 0) {
            // Make a copy of ingredient and category arrays
            const copyIngr = [...includedIngredients]
            const copyCat = [...includedCategories]

            // Define function to POST the objects
            const postRelationships = (arrayOfObjects, endpoint) => {
                if (arrayOfObjects.length > 0) {
                    return Promise.all(
                        arrayOfObjects.map((dataObject) =>
                            fetch(`http://localhost:8088/${endpoint}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(dataObject)
                            })
                                .then((response) => response.json())
                        )
                    );
                } else {
                    return Promise.resolve([])
                }
            };

            // Add newly created recipeId to ingredients
            const updatedIng = copyIngr.map((obj) => ({
                ...obj,
                recipeCardId: newRecipeResponseId,
            }))

            // Add newly created recipeId to categories
            const updatedCat = copyCat.map((obj) => ({
                ...obj,
                recipeCardId: newRecipeResponseId,
            }))

            // POST ingredient and category relationships to the API
            postRelationships(updatedIng, 'ingredientsInRecipes')
                .then((postedIngr) => {
                    postedIngr.length > 0 && console.log("posted ingredients", postedIngr)
                    return postRelationships(updatedCat, 'categoriesOfRecipes')
                })
                .then((postedCat) => {
                    postedCat.length > 0 && console.log("posted categories", postedCat)
                    console.log("All fetch calls are completed")
                    // Navigate the user to a different page here
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [newRecipeResponseId])
    
    // Handle the post recipe click
    const handlePostRecipeClick = (event) => {
        event.preventDefault()
        
        // Check if all required fields have been entered
        const requiredStr = ['title', 'description', 'prepInstructions', 'cookInstructions']
        const requiredNum = ['genreId', 'prepTime', 'cookTime', 'servingSize']
        const formFilled = requiredStr.every(field => newRecipe[field].length > 0) && requiredNum.every(field => newRecipe[field] > 0)
        if (formFilled) {
            // POST recipe to API ////////////////////////////////////////////
            fetch("http://localhost:8088/recipeCards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecipe)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Await the response.json() Promise
                    } else {
                        throw new Error("Unable to create new recipe");
                    }
                })
                .then(postedRecipeObject => {
                    console.log("New recipe successfully created", postedRecipeObject);
                    // update state with new recipe Id
                    const newId = postedRecipeObject.id
                    setNewRecipeResponseId(newId)
                    
                    ////////////////////////////////////////////////////////////////////////////////
                    /* Once newRecipeResponseId state has changed, useEffect() will trigger a 
                       POST for newly updated ingredient and category objects to be sent to 
                       the API with a foreign key recipeCardId that matches the newly posted recipe
                    *////////////////////////////////////////////////////////////////////////////////
                })
                .catch(error => {
                    console.error("An error occurred:", error);
                    window.alert("Something went wrong");
                });
        } else {window.alert("Please fill all required fields")}
        
    }

    return <>
        <form className="postRecipeForm">
            <h2 className="postRecipeForm__title">Add Your Recipe</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeTitle__input">Recipe Title:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="recipeForm--control"
                        placeholder="Add a title"
                        id = "recipeTitle__input"
                        value={newRecipe.title}
                        onChange={
                            (changeEvent) => {
                                const copy = {...newRecipe}
                                copy.title = changeEvent.target.value
                                updateNewRecipe(copy) // Updating recipe title with value of copy
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
                        value={newRecipe.genreId}
                        onChange={(changeEvent) => {
                            const copy = { ...newRecipe };
                            copy.genreId = parseInt(changeEvent.target.value);
                            updateNewRecipe(copy); // Updating recipe with value of copy
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
                        required 
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Add a description for your recipe"
                        id = "recipeDescription_input"
                        value={newRecipe.description}
                        onChange={
                            (changeEvent) => {
                                const copy = {...newRecipe}
                                copy.description = changeEvent.target.value
                                updateNewRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset className="addIngredients">
                <AddIngredients includedIngredients={includedIngredients}
                    allIngredients={allIngredients}
                    ingredientToAdd={ingredientToAdd}
                    updateIngredientToAdd={updateIngredientToAdd}
                    updateIncludedIngredients={updateIncludedIngredients} />
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipePrep_input">Preparation:</label>
                    <textarea
                        required 
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Add preparation instructions for your recipe"
                        id = "recipePrep_input"
                        value={newRecipe.prepInstructions}
                        onChange={
                            (changeEvent) => {
                                const copy = {...newRecipe}
                                copy.prepInstructions = changeEvent.target.value
                                updateNewRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeCook_input">Cooking Instructions:</label>
                    <textarea
                        required 
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Add cooking instructions for your recipe"
                        id = "recipeCook_input"
                        value={newRecipe.cookInstructions}
                        onChange={
                            (changeEvent) => {
                                const copy = {...newRecipe}
                                copy.cookInstructions = changeEvent.target.value
                                updateNewRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset className="recipeTimes">
                <div className="form-group recipeTime--div">
                    <label htmlFor="prepTime_input">Prep Time:</label>
                    <input
                        required 
                        type="number"
                        className="recipeForm--control recipeTime--input"
                        placeholder="Enter a time (minutes)"
                        id="prepTime_input"
                        value={newRecipe.prepTime > 0 ? newRecipe.prepTime : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                        step="0.01" // Set the step attribute to control decimal precision
                        onChange={
                            (changeEvent) => {
                                const copy = { ...newRecipe }
                                copy.prepTime = changeEvent.target.value !== "" ? Math.round(parseFloat(changeEvent.target.value) * 100) / 100 : 0
                                updateNewRecipe(copy) // Updating time with value of copy
                            }
                        } />
                </div>
                <div className="form-group recipeTime--div">
                    <label htmlFor="cookTime_input">Cooking Time:</label>
                    <input
                        required 
                        type="number"
                        className="recipeForm--control recipeTime--input"
                        placeholder="Enter a time (minutes)"
                        id="cookTime_input"
                        value={newRecipe.cookTime > 0 ? newRecipe.cookTime : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                        step="0.01" // Set the step attribute to control decimal precision
                        onChange={
                            (changeEvent) => {
                                const copy = { ...newRecipe }
                                copy.cookTime = changeEvent.target.value !== "" ? Math.round(parseFloat(changeEvent.target.value) * 100) / 100 : 0
                                updateNewRecipe(copy) // Updating time with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group recipeServings--div">
                    <label htmlFor="recipeServings_input">Serving Size:</label>
                    <input
                        required 
                        type="number"
                        className="recipeForm--control"
                        placeholder="How many people will this meal feed?"
                        id="recipeServings_input"
                        value={newRecipe.servingSize > 0 ? newRecipe.servingSize : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                        onChange={
                            (changeEvent) => {
                                const copy = { ...newRecipe }
                                copy.servingSize = changeEvent.target.value !== "" ? Math.round(parseInt(changeEvent.target.value) * 100) / 100 : 0
                                updateNewRecipe(copy) // Updating serving size with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset className="addCategories">
                <AddCategories includedCategories={includedCategories}
                    allCategories={allCategories}
                    categoryToAdd={categoryToAdd}
                    updateCategoryToAdd={updateCategoryToAdd}
                    updateIncludedCategories={updateIncludedCategories} />
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeNotes_input">Additional Notes and Tips:</label>
                    <textarea
                        type="text"
                        className="recipeForm--control recipe--textarea"
                        placeholder="Optional"
                        id = "recipeNotes_input"
                        value={newRecipe.note}
                        onChange={
                            (changeEvent) => {
                                const copy = {...newRecipe}
                                copy.note = changeEvent.target.value
                                updateNewRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipeImage__input">Image url:</label>
                    <input
                        type="text"
                        className="recipeForm--control"
                        placeholder="Paste image url here"
                        id = "recipeImage__input"
                        value={newRecipe.image}
                        onChange={
                            (changeEvent) => {
                                const copy = {...newRecipe}
                                copy.image = changeEvent.target.value
                                updateNewRecipe(copy) // Updating recipe with value of copy
                            }
                        } />
                </div>
            </fieldset>
            
            <button 
                onClick={ (clickEvent) => {handlePostRecipeClick(clickEvent)} }
                className="btn btn-primary submitRecipe">
                Submit New Recipe
            </button>
        </form>
    </>
}
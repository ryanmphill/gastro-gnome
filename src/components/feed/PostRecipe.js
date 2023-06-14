import { useEffect, useState } from "react"
import "./PostRecipe.css"


export const PostRecipe = () => {
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
            "userId": 0,
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

    const [categories, updateCategories] = useState([])

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
    
    // Handle the post recipe click
    const handlePostRecipeClick = (event) => {
        event.preventDefault()
        console.log("Not active yet...")
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
                        required autoFocus
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
                <div className="addedIngredients">
                    {
                        includedIngredients.length > 0
                        && includedIngredients.map(includedIngredient => {
                            const matchedIngredient = allIngredients.find(
                                ingredient => ingredient.id === includedIngredient.ingredientId
                            )
                            return <div className="addedIngredientRow" key={`addedIngDetails--${includedIngredient.ingredientId}`}>
                            <span className="flex-column1" key={`matchedIng--${includedIngredient.ingredientId}`}>{matchedIngredient.name}</span>
                            <span className="flex-column2" key={`addedQuant--${includedIngredient.ingredientId}`}>{includedIngredient.quantity}</span>
                            <span className="flex-column3" key={`addedUnit--${includedIngredient.ingredientId}`}>{includedIngredient.quantityUnit}</span>
                            </div>
                        })
                    }
                </div>
                <section className="ingredientInputContainer">
                    <div className="form-group ingredientInputs">
                        <label htmlFor="ingredientChoices">Choose Ingredient:</label>
                        <select
                            className="ingredient--control"
                            id="ingredientChoices"
                            value={ingredientToAdd.ingredientId}
                            onChange={(changeEvent) => {
                                const copy = { ...ingredientToAdd };
                                copy.ingredientId = parseInt(changeEvent.target.value);
                                updateIngredientToAdd(copy); // Updating recipe with value of copy
                            }}
                        >   {/*Add options for choosing a genre*/}
                            <option value="0">Select an Ingredient</option>
                            {
                                allIngredients.map(ingredient => <option value={ingredient.id} key={`ingredient--${ingredient.id}`}>{ingredient.name}</option> )
                            }
                        </select>
                    </div>
                    <div className="form-group ingredientInputs">
                        <label htmlFor="ingredientQuantity_input">Quantity:</label>
                        <input
                            required autoFocus
                            type="number"
                            className="ingredient--control"
                            placeholder="Enter a quantity"
                            id = "ingredientQuantity_input"
                            value={ingredientToAdd.quantity !== 0 ? ingredientToAdd.quantity : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                            step="0.01" // Set the step attribute to control decimal precision
                            onChange={
                                (changeEvent) => {
                                    const copy = {...ingredientToAdd}
                                    copy.quantity = changeEvent.target.value !== "" ? Math.round(parseFloat(changeEvent.target.value) * 100) / 100 : 0
                                    updateIngredientToAdd(copy) // Updating ingredient quantity with value of copy
                                }
                            } />
                    </div>
                    <div className="form-group ingredientInputs">
                        <label htmlFor="quantityType_input">Unit:</label>
                        <input
                            required autoFocus
                            type="text"
                            className="ingredient--control"
                            placeholder="Enter a unit of measurement"
                            id = "quantityType_input"
                            value={ingredientToAdd.quantityUnit}
                            onChange={
                                (changeEvent) => {
                                    const copy = {...ingredientToAdd}
                                    copy.quantityUnit = changeEvent.target.value
                                    updateIngredientToAdd(copy) // Updating recipe with value of copy
                                }
                            } />
                    </div>
                </section>
                <button
                onClick={
                    (event) => {
                        event.preventDefault()
                        const copy = [...includedIngredients]
                        copy.push(ingredientToAdd)
                        updateIncludedIngredients(copy)
                        console.log("included ingredients", includedIngredients)
                    }
                }
                >Add Ingredient</button>
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
                        required autoFocus
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
                        required autoFocus
                        type="number"
                        className="recipeForm--control recipeTime--input"
                        placeholder="Enter a time"
                        id="prepTime_input"
                        value={newRecipe.prepTime !== 0 ? newRecipe.prepTime : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
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
                        required autoFocus
                        type="number"
                        className="recipeForm--control recipeTime--input"
                        placeholder="Enter a time"
                        id="cookTime_input"
                        value={newRecipe.cookTime !== 0 ? newRecipe.cookTime : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
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
            
            <button 
                onClick={ (clickEvent) => {handlePostRecipeClick(clickEvent)} }
                className="btn btn-primary">
                Submit New Recipe
            </button>
        </form>
    </>
}
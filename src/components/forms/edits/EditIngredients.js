

export const EditIngredients = ({ingredientsToPost, allIngredients, ingredientToAdd, updateIngredientToAdd, updateIngredientsToPost, initialIngredients, ingredientsToDelete, updateIngredientsToDelete}) => {
    
    const handleAddIngredient = (event) => {
        event.preventDefault()
        // Get a copy of the current array of ingredients that are staged to be added
        const copy = [...ingredientsToPost]
        // Check if the ingredient has already been added
        const alreadyAdded = copy.some(ingredient => ingredient.ingredientId === ingredientToAdd.ingredientId)
        const stagedFordeletion = ingredientsToDelete.some(ingredient => ingredient.ingredientId === ingredientToAdd.ingredientId)
        const inInitialRecipe = initialIngredients.some(ingredient => ingredient.ingredientId === ingredientToAdd.ingredientId)
        if (!alreadyAdded && !inInitialRecipe) { // If not already staged to post and not in initial recipe, add to array to post
            copy.push(ingredientToAdd)
            updateIngredientsToPost(copy)
        } else if (inInitialRecipe && stagedFordeletion) { // If in initial recipe but staged for deletion, allow user to add new ingredient to edit quantity/measure
            copy.push(ingredientToAdd)
            updateIngredientsToPost(copy)
        } else {
            window.alert("That ingredient has already been added")
        }
    }

    const handleRemoveIngredient = (event, objectToRemove) => {
        event.preventDefault()
        const updatedIngredients = ingredientsToPost.filter(ingredient => ingredient.ingredientId !== objectToRemove.ingredientId)
        updateIngredientsToPost(updatedIngredients)
    }

    const handleDeleteExistingIngredient = (event, objectToDelete) => {
        event.preventDefault()

        // Get a copy of the current array of ingredients that are staged to be deleted
        const copy = [...ingredientsToDelete]

        // Check if the ingredient has already been added
        const alreadyStaged = copy.some(ingredient => ingredient.id === objectToDelete.id)
        
        if (!alreadyStaged) {
            copy.push(objectToDelete)
            updateIngredientsToDelete(copy)
        } else {
            window.alert("Ingredient already marked for deletion")
        }
        
    }

    const handleUndoDelete = (event, objectToUndo) => {
        event.preventDefault()
        // Get a copy of the current array of ingredients that are staged to be added
        const copy = [...ingredientsToPost]
        // Check if the same ingredient has been added since being staged for deletion
        const changesMadeToIngredient = copy.some(ingredient => ingredient.ingredientId === objectToUndo.ingredientId)

        if (changesMadeToIngredient) { // If changes for this ingredient have been added
            // Remove the new ingredient object with the changes
            const updatedIngredientsToPost = ingredientsToPost.filter(ingredient => ingredient.ingredientId !== objectToUndo.ingredientId)
            updateIngredientsToPost(updatedIngredientsToPost)
            // Then, remove the ingredient object from the ingredients array staged for deletion
            const updatedIngredientsToRemove = ingredientsToDelete.filter(ingredient => ingredient.id !== objectToUndo.id)
            updateIngredientsToDelete(updatedIngredientsToRemove)
        } else { // else, only remove the ingredient object from the ingredients array staged for deletion
            const updatedIngredientsToRemove = ingredientsToDelete.filter(ingredient => ingredient.id !== objectToUndo.id)
            updateIngredientsToDelete(updatedIngredientsToRemove)
        }
        
    }

    // Define function to check if an ingredient has been marked for deletion
    const markedForDeletion = (ingredientObject) => {
        const alreadyStaged = ingredientsToDelete.some(ingredient => ingredient.id === ingredientObject.id)
        return alreadyStaged
    }
    
    return <>
        <div className="addedIngredients">
            { /*Initial ingredients already attached to the recipe card*/
                initialIngredients.length > 0
                && initialIngredients.map(initialIngredient => {
                    const matchedIngredient = allIngredients.find(
                        ingredient => ingredient.id === initialIngredient.ingredientId
                    )
                    return <div key={`displayInitIng--${initialIngredient.id}`}>
                        { // If user has marked for delete, show 'undo' button
                            markedForDeletion(initialIngredient)
                                ? 
                                    <div className="addedIngredientRow ingredientToDelete" key={`initialIngDetails1--${initialIngredient.ingredientId}`}>
                                        <span className="flex-column1" key={`matchedIng--${initialIngredient.ingredientId}`}>{matchedIngredient?.name}</span>
                                        <span className="flex-column2" key={`addedQuant--${initialIngredient.ingredientId}`}>{initialIngredient.quantity} {initialIngredient.quantityUnit}</span>
                                        <span className="flex-column3" key={`removeIngredient--${initialIngredient.ingredientId}`}>
                                            Marked for Deletion <button
                                                onClick={(click) => handleUndoDelete(click, initialIngredient)}
                                                key={`btn--dltIng1${initialIngredient.ingredientId}`}
                                                className="btn--undoDelete">Undo</button>
                                        </span>
                                    </div>
                                
                                : 
                                    <div className="addedIngredientRow" key={`initialIngDetails2--${initialIngredient.ingredientId}`}>
                                        <span className="flex-column1" key={`matchedIng--${initialIngredient.ingredientId}`}>{matchedIngredient?.name}</span>
                                        <span className="flex-column2" key={`addedQuant--${initialIngredient.ingredientId}`}>{initialIngredient.quantity} {initialIngredient.quantityUnit}</span>
                                        <span className="flex-column3" key={`removeIngredient--${initialIngredient.ingredientId}`}>
                                            <button data-id={initialIngredient.id}
                                                onClick={(click) => handleDeleteExistingIngredient(click, initialIngredient)}
                                                key={`btn--dltIng2${initialIngredient.ingredientId}`}
                                                className="btn--removeItem">X</button>
                                        </span>
                                    </div>
                                
                        }
                    </div>
                })
            }

            {   /*New ingredients being added to recipe card by user*/
                ingredientsToPost.length > 0
                && ingredientsToPost.map(includedIngredient => {
                    const matchedIngredient = allIngredients.find(
                        ingredient => ingredient.id === includedIngredient.ingredientId
                    )
                    return <div className="addedIngredientRow addedIngredientRow--editForm" key={`addedIngDetails--${includedIngredient.ingredientId}`}>
                        <span className="flex-column1" key={`matchedIng--${includedIngredient.ingredientId}`}>{matchedIngredient?.name}</span>
                        <span className="flex-column2" key={`addedQuant--${includedIngredient.ingredientId}`}>{includedIngredient.quantity} {includedIngredient.quantityUnit}</span>
                        <span className="flex-column3" key={`removeIngredient--${includedIngredient.ingredientId}`}>
                            <button data-id={includedIngredient.ingredientId}
                                onClick={(click) => handleRemoveIngredient(click, includedIngredient)}
                                key={`btnremIng--${includedIngredient.ingredientId}`}
                                className="btn--removeItem">X</button>
                        </span>
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
                        allIngredients.map(ingredient => <option value={ingredient.id} key={`editIngredient--${ingredient.id}`}>{ingredient?.name}</option>)
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
                    id="ingredientQuantity_input"
                    value={ingredientToAdd.quantity !== 0 ? ingredientToAdd.quantity : ""} // If value is is zero, change to empty string to display placeholder text by default instead of zero
                    step="0.01" // Set the step attribute to control decimal precision
                    onChange={
                        (changeEvent) => {
                            const copy = { ...ingredientToAdd }
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
                    id="quantityType_input"
                    value={ingredientToAdd.quantityUnit}
                    onChange={
                        (changeEvent) => {
                            const copy = { ...ingredientToAdd }
                            copy.quantityUnit = changeEvent.target.value
                            updateIngredientToAdd(copy) // Updating recipe with value of copy
                        }
                    } />
            </div>
        </section>
        <button
            onClick={
                (event) => {handleAddIngredient(event)}
            }
        >Add Ingredient</button>
    </>
}
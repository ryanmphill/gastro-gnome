

export const EditIngredients = ({ingredientsToPost, allIngredients, ingredientToAdd, updateIngredientToAdd, updateIngredientsToPost, initialIngredients, ingredientsToDelete, updateIngredientsToDelete}) => {
    
    const handleAddIngredient = (event) => {
        event.preventDefault()
        // Get a copy of the current array of ingredients that are staged to be added
        const copy = [...ingredientsToPost]
        // Check if the ingredient has already been added
        const alreadyAdded = copy.some(ingredient => ingredient.ingredientId === ingredientToAdd.ingredientId)
        const inInitialRecipe = initialIngredients.some(ingredient => ingredient.ingredientId === ingredientToAdd.ingredientId)
        if (!alreadyAdded && !inInitialRecipe) {
            copy.push(ingredientToAdd)
            updateIngredientsToPost(copy)
            console.log("ingredients to post", ingredientsToPost)
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
        console.log("Ingredient to delete", objectToDelete)

        // Get a copy of the current array of ingredients that are staged to be deleted
        const copy = [...ingredientsToDelete]

        // Check if the ingredient has already been added
        const alreadyStaged = copy.some(ingredient => ingredient.id === objectToDelete.id)
        
        if (!alreadyStaged) {
            copy.push(objectToDelete)
            updateIngredientsToDelete(copy)
            console.log("ingredients to delete", ingredientsToDelete)
        } else {
            window.alert("Ingredient already marked for deletion")
        }
        
    }

    const handleUndoDelete = (event, objectToUndo) => {
        event.preventDefault()
        const updatedIngredients = ingredientsToDelete.filter(ingredient => ingredient.id !== objectToUndo.id)
        updateIngredientsToDelete(updatedIngredients)
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
                    return <div className="addedIngredientRow" key={`initialIngDetails--${initialIngredient.ingredientId}`}>
                        <span className="flex-column1" key={`matchedIng--${initialIngredient.ingredientId}`}>{matchedIngredient?.name}</span>
                        <span className="flex-column2" key={`addedQuant--${initialIngredient.ingredientId}`}>{initialIngredient.quantity} {initialIngredient.quantityUnit}</span>
                        <span className="flex-column3" key={`removeIngredient--${initialIngredient.ingredientId}`}>
                            { // If user has marked for delete, show 'undo' button
                                markedForDeletion(initialIngredient)
                                ? <>Marked for Deletion <button
                                onClick={(click) => handleUndoDelete(click, initialIngredient)}
                                className="btn--undoDelete">Undo</button></>
                                : <button data-id={initialIngredient.id}
                                onClick={(click) => handleDeleteExistingIngredient(click, initialIngredient)}
                                className="btn--removeItem">X</button>
                            }
                            
                        </span>
                    </div>
                })
            }

            {   /*New ingredients being added to recipe card by user*/
                ingredientsToPost.length > 0
                && ingredientsToPost.map(includedIngredient => {
                    const matchedIngredient = allIngredients.find(
                        ingredient => ingredient.id === includedIngredient.ingredientId
                    )
                    return <div className="addedIngredientRow" key={`addedIngDetails--${includedIngredient.ingredientId}`}>
                        <span className="flex-column1" key={`matchedIng--${includedIngredient.ingredientId}`}>{matchedIngredient?.name}</span>
                        <span className="flex-column2" key={`addedQuant--${includedIngredient.ingredientId}`}>{includedIngredient.quantity} {includedIngredient.quantityUnit}</span>
                        <span className="flex-column3" key={`removeIngredient--${includedIngredient.ingredientId}`}>
                            <button data-id={includedIngredient.ingredientId}
                                onClick={(click) => handleRemoveIngredient(click, includedIngredient)}
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
                        allIngredients.map(ingredient => <option value={ingredient.id} key={`ingredient--${ingredient.id}`}>{ingredient?.name}</option>)
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
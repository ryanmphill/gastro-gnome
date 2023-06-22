import Select from 'react-select';

export const EditIngredientForm = ({ initialIngredients, allIngredients, markedForDeletion, handleUndoDelete, handleDeleteExistingIngredient, handleRemoveIngredient, ingredientsToPost, ingredientToAdd, updateIngredientToAdd, handleAddIngredient, setShowCustom }) => {

    const validateQuantityInput = (changeEvent) => {
        const inputValue = changeEvent.target.value
        const isFractionOrDecimal = /^(?!.*\/.*\/)(?!.*\..*\.)(?!.* .* )[0-9\/. ]*$/
        const containsDot = inputValue.includes('.')
        const containsSlash = inputValue.includes('/')
        const containsDotAndSlash = containsDot && containsSlash ? true : false
    
        if (isFractionOrDecimal.test(inputValue) && !containsDotAndSlash) {
            return true
        } else {
            return false
        }
    
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
                <label>Choose Ingredient:
                    <Select
                        className="ingredient--control--select"
                        id="ingredientChoices"
                        options={allIngredients}
                        onChange={(selectedOption) => {
                            const copy = { ...ingredientToAdd }
                            copy.ingredientId = parseInt(selectedOption.id)
                            updateIngredientToAdd(copy)
                            console.log("copyToAdd", copy)
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        placeholder="Select an Ingredient"
                    />
                </label>
            </div>
            <div className="form-group ingredientInputs">
                <label htmlFor="ingredientQuantity_input">Quantity:</label>
                <input
                    required
                    type="text"
                    className="ingredient--control"
                    placeholder="Enter a quantity"
                    id="ingredientQuantity_input"
                    value={ingredientToAdd.quantity} 
                    onChange={
                        (changeEvent) => {
                            const copy = { ...ingredientToAdd }
                            const inputValue = changeEvent.target.value
                            copy.quantity = validateQuantityInput(changeEvent) ? inputValue : ingredientToAdd.quantity
                            updateIngredientToAdd(copy) // Updating ingredient quantity with value of copy
                        }
                    } />
            </div>
            <div className="form-group ingredientInputs">
                <label htmlFor="quantityType_input">Unit:</label>
                <input
                    required
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
                (event) => { handleAddIngredient(event) }
            }
        >Add Ingredient</button>

        <button
            onClick={
                (e) => {
                    e.preventDefault()
                    setShowCustom(true)
                }
            }
        >Don't see the ingredient you're looking for?</button>
    </>
}


export const EditIngredients = ({includedIngredients, allIngredients, ingredientToAdd, updateIngredientToAdd, updateIncludedIngredients}) => {
    
    const handleAddIngredient = (event) => {
        event.preventDefault()
        // Get a copy of the current array of ingredients that are staged to be added
        const copy = [...includedIngredients]
        // Check if the ingredient has already been added
        const alreadyAdded = copy.some(ingredient => ingredient.ingredientId === ingredientToAdd.ingredientId)
        if (!alreadyAdded) {
            copy.push(ingredientToAdd)
            updateIncludedIngredients(copy)
            console.log("included ingredients", includedIngredients)
        } else {
            window.alert("That ingredient has already been added")
        }
    }

    const handleRemoveIngredient = (event, objectToRemove) => {
        event.preventDefault()
        const updatedIngredients = includedIngredients.filter(ingredient => ingredient.ingredientId !== objectToRemove.ingredientId)
        updateIncludedIngredients(updatedIngredients)
    }
    
    return <>
        <div className="addedIngredients">
            {
                includedIngredients.length > 0
                && includedIngredients.map(includedIngredient => {
                    const matchedIngredient = allIngredients.find(
                        ingredient => ingredient.id === includedIngredient.ingredientId
                    )
                    return <div className="addedIngredientRow" key={`addedIngDetails--${includedIngredient.ingredientId}`}>
                        <span className="flex-column1" key={`matchedIng--${includedIngredient.ingredientId}`}>{matchedIngredient.name}</span>
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
                        allIngredients.map(ingredient => <option value={ingredient.id} key={`ingredient--${ingredient.id}`}>{ingredient.name}</option>)
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
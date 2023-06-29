import Select from 'react-select';

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

export const AddIngredientForm = ({includedIngredients, handleRemoveIngredient, allIngredients, ingredientToAdd, updateIngredientToAdd, handleAddIngredient, setShowCustom }) => {
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
                                onClick={(click) => {
                                    click.preventDefault()
                                    click.target === document.activeElement && handleRemoveIngredient(click, includedIngredient)}
                                }
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
                    onKeyDown={(evt) => evt.key === 'Enter' && evt.target === document.activeElement && handleAddIngredient(evt)} 
                    onChange={
                        (changeEvent) => {
                            const copy = { ...ingredientToAdd }
                            const inputValue = changeEvent.target.value
                            // If the typed in value is a decimal OR a fraction, update ingredientToAdd, else, value remains unchanged 
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
                    onKeyDown={(evt) => evt.key === 'Enter' && evt.target === document.activeElement && handleAddIngredient(evt)}
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
                (event) => { 
                    event.preventDefault() 
                    event.target === document.activeElement && handleAddIngredient(event) 
                }
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
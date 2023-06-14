

export const AddCategories = ({includedCategories, allCategories, categoryToAdd, updateCategoryToAdd, updateIncludedCategories}) => {
    
    const handleRemoveCategory = (event, objectToRemove) => {
        event.preventDefault()
        console.log("objectToRemove", objectToRemove)
        const updatedCategories = includedCategories.filter(category => category.categoryId !== objectToRemove.categoryId)
        updateIncludedCategories(updatedCategories)

    }
    
    return <>
        <div className="addedCategories">
            {
                includedCategories.length > 0
                && includedCategories.map(includedCategory => {
                    const matchedCategory = allCategories.find(
                        category => category.id === includedCategory.categoryId
                    )
                    return <div className="addedCategory" key={`addededCat--${includedCategory.categoryId}`}>
                        {matchedCategory.name}
                        <button 
                            onClick={(click) => handleRemoveCategory(click, includedCategory)}
                            className="btn--removeItem btn--removeCat"
                        >X</button>
                    </div>
                })
            }
        </div>
        <section className="selectCategoryContainer">
            <div className="form-group selectCategories">
                <label htmlFor="categoryChoices">Add a category tag:</label>
                <select
                    className="ingredient--control"
                    id="categoryChoices"
                    value={categoryToAdd.categoryId}
                    onChange={(changeEvent) => {
                        const copy = { ...categoryToAdd };
                        copy.categoryId = parseInt(changeEvent.target.value);
                        updateCategoryToAdd(copy); // Updating category with value of copy
                    }}
                >   {/*Add options for choosing a genre*/}
                    <option value="0">Search for a category</option>
                    {
                        allCategories.map(category => <option value={category.id} key={`category--${category.id}`}>{category.name}</option>)
                    }
                </select>
            </div>
        </section>
        <button
            onClick={
                (event) => {
                    event.preventDefault()
                    const copy = [...includedCategories]
                    copy.push(categoryToAdd)
                    updateIncludedCategories(copy)
                    console.log("included categories", includedCategories)
                }
            }
        >Add Category Tag</button>
    </>
}
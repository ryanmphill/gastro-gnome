

export const EditCategories = ({categoriesToPost, allCategories, categoryToAdd, updateCategoryToAdd, updateCategoriesToPost, initialCategories, categoriesToDelete, updateCategoriesToDelete}) => {
    
    const handleAddCategory = (event) => {
        event.preventDefault()
        // Get a copy of the current array of categories that are staged to be added
        const copy = [...categoriesToPost]
        // Check if the category has already been added
        const alreadyAdded = copy.some(category => category.categoryId === categoryToAdd.categoryId)
        const inInitialRecipe = initialCategories.some(category => category.categoryId === categoryToAdd.categoryId)
        if (!alreadyAdded && !inInitialRecipe) {
            copy.push(categoryToAdd)
            updateCategoriesToPost(copy)
            console.log("included categories", categoriesToPost)
        } else {
            window.alert("That tag has already been added")
        }
    }
    
    const handleRemoveCategory = (event, objectToRemove) => {
        event.preventDefault()
        console.log("objectToRemove", objectToRemove)
        const updatedCategories = categoriesToPost.filter(category => category.categoryId !== objectToRemove.categoryId)
        updateCategoriesToPost(updatedCategories)

    }

    const handleDeleteCategory = (event, objectToDelete) => {
        console.log("category to delete", objectToDelete)
    }
    
    return <>
        <div className="addedCategories">
            {
                initialCategories.length > 0
                && initialCategories.map(initialCategory => {
                    const matchedCategory = allCategories.find(
                        category => category.id === initialCategory.categoryId
                    )
                    return <div className="addedCategory" key={`addededCat--${initialCategory.categoryId}`}>
                        {matchedCategory?.name}
                        <button 
                            onClick={(click) => handleDeleteCategory(click, initialCategory)}
                            className="btn--removeItem btn--removeCat"
                        >X</button>
                    </div>
                })
            }
            
            {
                categoriesToPost.length > 0
                && categoriesToPost.map(includedCategory => {
                    const matchedCategory = allCategories.find(
                        category => category.id === includedCategory.categoryId
                    )
                    return <div className="addedCategory" key={`addededCat--${includedCategory.categoryId}`}>
                        {matchedCategory?.name}
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
                        allCategories.map(category => <option value={category.id} key={`category--${category.id}`}>{category?.name}</option>)
                    }
                </select>
            </div>
        </section>
        <button
            onClick={
                (event) => {handleAddCategory(event)}
            }
        >Add Category Tag</button>
    </>
}
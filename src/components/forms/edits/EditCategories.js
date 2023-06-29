import Select from 'react-select';

export const EditCategories = ({categoriesToPost, allCategories, categoryToAdd, updateCategoryToAdd, updateCategoriesToPost, initialCategories, categoriesToDelete, updateCategoriesToDelete}) => {
    
    const handleAddCategory = (event) => {
        event.preventDefault()
        // Check if category has been selected
        if (categoryToAdd.categoryId > 0) {
            // Get a copy of the current array of categories that are staged to be added
            const copy = [...categoriesToPost]
            // Check if the category has already been added
            const alreadyAdded = copy.some(category => category.categoryId === categoryToAdd.categoryId)
            const inInitialRecipe = initialCategories.some(category => category.categoryId === categoryToAdd.categoryId)
            if (!alreadyAdded && !inInitialRecipe) {
                copy.push(categoryToAdd)
                updateCategoriesToPost(copy)
            } else {
                window.alert("That tag has already been added")
            }
        } else {
            window.alert("Please select a category tag")
        }
    }
    
    const handleRemoveCategory = (event, objectToRemove) => {
        event.preventDefault()
        const updatedCategories = categoriesToPost.filter(category => category.categoryId !== objectToRemove.categoryId)
        updateCategoriesToPost(updatedCategories)

    }

    const handleDeleteExistingCategory = (event, objectToDelete) => {
        event.preventDefault()

        // Get a copy of the current array of categories that are staged to be deleted
        const copy = [...categoriesToDelete]

        // Check if the category has already been added
        const alreadyStaged = copy.some(category => category.id === objectToDelete.id)
        
        if (!alreadyStaged) {
            copy.push(objectToDelete)
            updateCategoriesToDelete(copy)
        } else {
            window.alert("Category tag already marked for deletion")
        }
    }

    const handleUndoDeleteCat = (event, objectToUndo) => {
        event.preventDefault()
        const updatedCategories = categoriesToDelete.filter(category => category.id !== objectToUndo.id)
        updateCategoriesToDelete(updatedCategories)
    }

    // Define function to check if an ingredient has been marked for deletion
    const markedForDeletion = (categoryObject) => {
        const alreadyStaged = categoriesToDelete.some(category => category.id === categoryObject.id)
        return alreadyStaged
    }
    
    return <>
        <div className="addedCategories">
            { // Display Categories already on recipe card with interface for deleting
                initialCategories.length > 0
                && initialCategories.map(initialCategory => {
                    const matchedCategory = allCategories.find(
                        category => category.id === initialCategory.categoryId
                    )
                    return <div key={`displayInitCat--${initialCategory.id}`}>
                        {   /*If marked for deletion, display undo button*/
                            markedForDeletion(initialCategory)
                                ? <div className="addedCategory categoryToDelete" key={`addededCat--${initialCategory.categoryId}`}>
                                    <section>
                                        <div>{matchedCategory?.name}</div>
                                        <div className="deleteStamp">Marked for deletion</div>
                                    </section>
                                    <button
                                        onClick={(click) => handleUndoDeleteCat(click, initialCategory)}
                                        key={`undoDeletCat--${initialCategory.id}`}
                                        className="btn--undoRemoveCat"
                                    >Undo</button>
                                </div>
                                : <div className="addedCategory" key={`addededCat--${initialCategory.categoryId}`}>
                                    {matchedCategory?.name}
                                    <button
                                        onClick={(click) => handleDeleteExistingCategory(click, initialCategory)}
                                        key={`deletCat2--${initialCategory.id}`}
                                        className="btn--removeCat"
                                    >X</button>
                                </div>
                        }
                    </div>
                })
            }
            
            { // Display newly added categories
                categoriesToPost.length > 0
                && categoriesToPost.map(includedCategory => {
                    const matchedCategory = allCategories.find(
                        category => category.id === includedCategory.categoryId
                    )
                    return <div className="addedCategory addedCategory--editForm" key={`addededCat2--${includedCategory.categoryId}`}>
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
                <label>Add a category tag:
                    <Select
                        className="category--select"
                        id="categoryChoices"
                        options={allCategories}
                        onChange={(selectedOption) => {
                            const copy = { ...categoryToAdd }
                            copy.categoryId = parseInt(selectedOption.id)
                            updateCategoryToAdd(copy)
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        placeholder="Select a Category"
                    />
                </label>
            </div>
        </section>
        <button
            onClick={
                (event) => {handleAddCategory(event)}
            }
        >Add Category Tag</button>
    </>
}
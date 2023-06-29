import { useState } from 'react';
import { EditIngredientForm } from './EditIngredientForm';
import { CustomIngredient } from '../CustomIngredient';

export const EditIngredients = ({ingredientsToPost, allIngredients, ingredientToAdd, updateIngredientToAdd, updateIngredientsToPost, initialIngredients, ingredientsToDelete, updateIngredientsToDelete, fetchList, setAllIngredients}) => {
    // Set state variable for tracking if the create custom ingredient view should be shown
    const [showCustom, setShowCustom] = useState(false)
    
    const handleAddIngredient = (event) => {
        event.preventDefault()
        // Check if required fields have been entered
        if (ingredientToAdd.ingredientId > 0 && ingredientToAdd.quantity.length > 0) {
            // Get a copy of the ingredientToAdd
            const copyIngToAdd = { ...ingredientToAdd }
            // Trim any whitespace on the quantity
            copyIngToAdd.quantity = ingredientToAdd.quantity.trim()
            updateIngredientToAdd(copyIngToAdd)

            // Get a copy of the current array of ingredients that are staged to be added
            const copy = [...ingredientsToPost]
            // Check if the ingredient has already been added
            const alreadyAdded = copy.some(ingredient => ingredient.ingredientId === copyIngToAdd.ingredientId)
            const stagedFordeletion = ingredientsToDelete.some(ingredient => ingredient.ingredientId === copyIngToAdd.ingredientId)
            const inInitialRecipe = initialIngredients.some(ingredient => ingredient.ingredientId === copyIngToAdd.ingredientId)
            if (!alreadyAdded && !inInitialRecipe) { // If not already staged to post and not in initial recipe, add to array to post
                copy.push(copyIngToAdd)
                updateIngredientsToPost(copy)
            } else if (inInitialRecipe && stagedFordeletion && !alreadyAdded) { // If in initial recipe but staged for deletion, allow user to add new ingredient to edit quantity/measure
                copy.push(copyIngToAdd)
                updateIngredientsToPost(copy)
            } else {
                window.alert("That ingredient has already been added")
            }
        } else {
            window.alert("Please enter an ingredient and a quantity")
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
        {
            !showCustom
                ? <EditIngredientForm
                initialIngredients={initialIngredients}
                allIngredients={allIngredients}
                markedForDeletion={markedForDeletion}
                handleUndoDelete={handleUndoDelete}
                handleDeleteExistingIngredient={handleDeleteExistingIngredient}
                handleRemoveIngredient={handleRemoveIngredient}
                ingredientsToPost={ingredientsToPost}
                ingredientToAdd={ingredientToAdd}
                updateIngredientToAdd={updateIngredientToAdd}
                handleAddIngredient={handleAddIngredient}
                setShowCustom={setShowCustom} />

                : <CustomIngredient
                allIngredients={allIngredients}
                fetchList={fetchList}
                setAllIngredients={setAllIngredients}
                setShowCustom={setShowCustom} />
        }
        
    </>
}

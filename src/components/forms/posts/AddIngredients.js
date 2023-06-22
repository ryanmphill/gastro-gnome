import { CustomIngredient } from '../CustomIngredient';
import { AddIngredientForm } from './AddIngredientForm';
import { useState } from 'react';


export const AddIngredients = ({includedIngredients, allIngredients, ingredientToAdd, updateIngredientToAdd, updateIncludedIngredients, fetchList, setAllIngredients}) => {
    // Set state variable for tracking if the create custom ingredient view should be shown
    const [showCustom, setShowCustom] = useState(false)
    
    const handleAddIngredient = (event) => {
        event.preventDefault()
        // Get a copy of the current array of ingredients that are staged to be added
        const copy = [...includedIngredients]
        // Check if the ingredient has already been added
        const alreadyAdded = copy.some(ingredient => ingredient.ingredientId === ingredientToAdd.ingredientId)
        if (!alreadyAdded) {
            copy.push(ingredientToAdd)
            updateIncludedIngredients(copy)
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
        {
            !showCustom
                ? <AddIngredientForm 
                includedIngredients={includedIngredients}
                handleRemoveIngredient={handleRemoveIngredient}
                allIngredients={allIngredients}
                ingredientToAdd={ingredientToAdd}
                updateIngredientToAdd={updateIngredientToAdd}
                handleAddIngredient={handleAddIngredient}
                setShowCustom={setShowCustom}
                />

                : <CustomIngredient
                allIngredients={allIngredients}
                fetchList={fetchList}
                setAllIngredients={setAllIngredients}
                setShowCustom={setShowCustom} />
        }
        
    </>
}

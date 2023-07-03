import { useState } from "react"


export const CustomIngredient = ({ allIngredients, fetchList, setAllIngredients, setShowCustom }) => {
    // Set state variable for ingredient to be added
    const [newIngredient, updateNewIngredient] = useState({
        name: ""
    })

    // POST new ingredient to API when user clicks button
    const handleCreateCustom = (evt) => {
        evt.preventDefault()

        // Check if the ingredient is already in database
        const alreadyAdded = allIngredients.some(ingredient => ingredient.name === newIngredient.name)

        if (!alreadyAdded && newIngredient.name.length > 0) {
            // POST ingredient to API ////////////////////////////////////////////
            fetch("http://localhost:8088/ingredients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newIngredient)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Await the response.json() Promise
                    } else {
                        throw new Error("Unable to create new recipe");
                    }
                })
                .then(postedIngredient => {
                    console.log("New ingredient successfully created", postedIngredient)
                    // update the allIngredients state with new posted ingredient
                    fetchList("ingredients", setAllIngredients)
                })
                .then(() => {
                    setShowCustom(false)
                })
                .catch(error => {
                    console.error("An error occurred:", error);
                    window.alert("Something went wrong");
                });
        } else if (alreadyAdded) {
            window.alert("Ingredient already in database")
        } else {
            window.alert("Please enter an ingredient name")
        }
    }

    return <>
        <div className="form-group ingredientInputs fadeIn">
            <label htmlFor="CustomIngredient_input">Create New Custome Ingredient:</label>
            <input
                type="text"
                className="ingredient--control"
                placeholder="Enter your ingredient"
                id="CustomIngredient_input"
                value={newIngredient.name}
                onChange={
                    (changeEvent) => {
                        const copy = { ...newIngredient }
                        copy.name = changeEvent.target.value
                        updateNewIngredient(copy) // Updating custom ingredient with value of copy
                    }
                } />
        </div>
        <button className="btn-secondary btn-group-left"
        onClick={(click) => handleCreateCustom(click)}
        >Create Custom Ingredient</button>

        <button className="btn-secondary btn-group-right"
        onClick={(e) => {
            e.preventDefault()
            setShowCustom(false)
        }}
        >Cancel</button>
        <div><p>After adding your custom ingredient, you'll be able to find it in the search bar and add it to your recipe.</p></div>
    </>
}
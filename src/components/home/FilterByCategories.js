import { useEffect, useState } from "react"
import Select from 'react-select';

export const FilterByCategories = ({ recipes, searchTerms, updateOnlyRecipesWithTags, setFilteredRecipes, onlySearchedRecipes}) => {
    // Define a state variable for fetched categories
    const [categories, setCategories] = useState([])
    // State variable for different types of categories 
    const [categoryTypes, setCategoryTypes] = useState([])
    // State variable for the type of category selected by user in the 'filter by' dropdown
    const [chosenCategoryType, updateChosenCategoryType] = useState("")
    // State variable for which category options to display based on chosenCategoryType
    const [filteredCategories, setFilteredCategories] = useState([])
    // State to keep track of all selected categories the user wants to use to filter recipe feed
    const [chosenCategories, updateChosenCategories] = useState([])

    // Fetch the list of categories
    const fetchCategories = () => {
        fetch(`http://localhost:8088/categories`)
            .then(response => response.json())
            .then((catArray) => {
                // Set categories state with all categories
                setCategories(catArray)
                // Get the category type from each category object
                const allCategoryTypes = catArray.map(cat => cat.categoryType)
                // Remove all duplicates so that the array only has one of each possible type
                const uniqueCategoryList = allCategoryTypes.filter((value, index, array) => {
                    return array.indexOf(value) === index
                  })
                setCategoryTypes(uniqueCategoryList)
            })
    }
    useEffect(
        () => {
            // Get categories and all possible category types upon initial render
            fetchCategories()
        },
        [] 
    )

    // Filter the categories based on chosen category type
    useEffect(
        () => {
            if (chosenCategoryType !== "") {
                const newCatList = categories.filter(category => category.categoryType === chosenCategoryType)
                setFilteredCategories(newCatList)
            }
        },
        [chosenCategoryType]
    )

    // Update filtered recipes when a category tag is chosen
    useEffect(
        () => {
            // If categories selected but no search entered, filter through original recipe list
            if (chosenCategories.length > 0 && searchTerms === "") {
                const matchingRecipes = recipes.filter(recipe =>
                    recipe.categoriesOfRecipes.some(category =>
                        chosenCategories.some(chosenCategory =>
                            chosenCategory.id === category.categoryId
                        )
                    )
                )
                updateOnlyRecipesWithTags(matchingRecipes)
                setFilteredRecipes(matchingRecipes)
            // If categories selected AND search terms entered, filter through the searched recipes
            } else if (chosenCategories.length > 0 && searchTerms !== "") {
                // Filter through searched recipes
                const searchedAndFilteredRecipes = onlySearchedRecipes.filter(recipe =>
                    recipe.categoriesOfRecipes.some(category =>
                        chosenCategories.some(chosenCategory =>
                            chosenCategory.id === category.categoryId
                        )
                    )
                )
                /* Also filter through original recipe list to preserve a filtered by categories state 
                   so that the search terms can be changed and stacked ontop of the selected categories to filter by*/
                const justFilteredRecipes = recipes.filter(recipe =>
                    recipe.categoriesOfRecipes.some(category =>
                        chosenCategories.some(chosenCategory =>
                            chosenCategory.id === category.categoryId
                        )
                    )
                )
                // Preserve state of filtering all recipes by selected categories
                updateOnlyRecipesWithTags(justFilteredRecipes)
                // Update recipe feed with current results
                setFilteredRecipes(searchedAndFilteredRecipes)

            // If no selected categories but search terms entered, update feed with search results
            } else if (chosenCategories.length === 0 && searchTerms !== "") {
                updateOnlyRecipesWithTags([])
                setFilteredRecipes(onlySearchedRecipes)

            // else, set recipe feed to default
            } else {
                updateOnlyRecipesWithTags([])
                setFilteredRecipes(recipes)
            }
        },
        [chosenCategories]
    )

    // Handle the selected category
    const handleSelectedCategory = (chosenCategory) => {
        // Get a copy of the current array of categories that are being used to filter
        const copy = [ ...chosenCategories ]
        // Check if the category has already been added
        const alreadyAdded = copy.some(category => category.id === chosenCategory.id)
        if (!alreadyAdded) {
            copy.push(chosenCategory)
            updateChosenCategories(copy)
        }
    }

    // Handle removing a category
    const handleRemoveSelected = (evt, objectToRemove) => {
        evt.preventDefault()

        const updatedCategories = chosenCategories.filter(category => category.id !== objectToRemove.id)
        updateChosenCategories(updatedCategories)
    }

    return <>
        <div className="filterBar__categories">
            <select
                className="filterBar__categoryType"
                onChange={(changeEvent) => {
                    updateChosenCategoryType(changeEvent.target.value)
                }}
            >   {/*Add options for filtering*/}
                <option value="0">Filter by:</option>
                {
                    categoryTypes.map(catType => <option value={catType} key={`catType--${catType}`}>{catType}</option>)
                }
            </select>

            <Select
                className="filterBar__categorySelect"
                id="filterByCategories"
                options={filteredCategories}
                onChange={(selectedOption) => {
                    handleSelectedCategory(selectedOption)
                }}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                placeholder="Select a Category"
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: 'none',
                    }),
                }}
            />
        </div>

        <div className="chosenCategories">
            {
                chosenCategories.length > 0
                && chosenCategories.map(category => {
                    return <div className="chosenCategory" key={`chosenCat--${category.id}`}>
                        {category.name}
                        <button
                            onClick={(click) => handleRemoveSelected(click, category)}
                            className="btn--removeItem btn--removeFilterCat"
                        >X</button>
                    </div>
                })
            }
        </div>
    </>

}
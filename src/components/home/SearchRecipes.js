import { useEffect, useState } from "react"
import searchIcon from "../../assets/skillet-search-small.svg"
import Select from 'react-select';

export const SearchRecipes = ({ searchTerms, updateSearchTerms, setFilteredRecipes, recipes, filteredRecipes, onlyRecipesWithTags, updateOnlyRecipesWithTags, onlySearchedRecipes, updateOnlySearchedRecipes }) => {
    // Define a state variable for categories
    const [categories, setCategories] = useState([])
    const [categoryTypes, setCategoryTypes] = useState([])
    const [chosenCategoryType, updateChosenCategoryType] = useState("")
    const [filteredCategories, setFilteredCategories] = useState([])
    const [chosenCategories, updateChosenCategories] = useState([])
    
    // Fetch the list of categories
    const fetchCategories = () => {
        fetch(`http://localhost:8088/categories`)
            .then(response => response.json())
            .then((catArray) => {
                setCategories(catArray)
                const allCategoryTypes = catArray.map(cat => cat.categoryType)
                const uniqueCategoryList = allCategoryTypes.filter((value, index, array) => {
                    return array.indexOf(value) === index
                  })
                setCategoryTypes(uniqueCategoryList)
            })
    }
    useEffect(
        () => {
            fetchCategories()
        },
        [] // When this array is empty, you are observing initial component state
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

    // Handle the search click
    const handleSearchClick = (evt) => {
        evt.preventDefault()
        if (searchTerms !== "" && onlyRecipesWithTags.length === 0) {
            const searchedRecipes = recipes.filter(recipe => {
                // Filter by recipe title OR the authors name
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
            })
            updateOnlySearchedRecipes(searchedRecipes)
            setFilteredRecipes(searchedRecipes)
        } else if (searchTerms !== "" && onlyRecipesWithTags.length > 0) {
            const justSearchedRecipes = recipes.filter(recipe => {
                // Filter by recipe title OR the authors name
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
            })
            const searchedAndFilteredRecipes = onlyRecipesWithTags.filter(recipe => {
                // Filter by recipe title OR the authors name
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
            })
            updateOnlySearchedRecipes(justSearchedRecipes)
            setFilteredRecipes(searchedAndFilteredRecipes)
        } else if (searchTerms === "" && onlyRecipesWithTags.length > 0) {
            updateOnlySearchedRecipes([])
            setFilteredRecipes(onlyRecipesWithTags)
        } else {
            updateOnlySearchedRecipes([])
            setFilteredRecipes(recipes)
        }
    }

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

    // Update filtered recipes when a category tag is chosen
    useEffect(
        () => {
            if (chosenCategories.length > 0 && searchTerms === "") {
                const matchingRecipes = recipes.filter(recipe =>
                    recipe.categoriesOfRecipes.some(category =>
                        chosenCategories.some(chosenCategory =>
                            chosenCategory.id === category.categoryId
                        )
                    )
                )

                console.log("filteredRecipes", filteredRecipes)
                console.log("chosenCats", chosenCategories)

                updateOnlyRecipesWithTags(matchingRecipes)
                setFilteredRecipes(matchingRecipes)
            } else if (chosenCategories.length > 0 && searchTerms !== "") {
                const justFilteredRecipes = recipes.filter(recipe =>
                    recipe.categoriesOfRecipes.some(category =>
                        chosenCategories.some(chosenCategory =>
                            chosenCategory.id === category.categoryId
                        )
                    )
                )

                const searchedAndFilteredRecipes = onlySearchedRecipes.filter(recipe =>
                    recipe.categoriesOfRecipes.some(category =>
                        chosenCategories.some(chosenCategory =>
                            chosenCategory.id === category.categoryId
                        )
                    )
                )
                updateOnlyRecipesWithTags(justFilteredRecipes)
                setFilteredRecipes(searchedAndFilteredRecipes)

            } else if (chosenCategories.length === 0 && searchTerms !== "") {
                updateOnlyRecipesWithTags([])
                setFilteredRecipes(onlySearchedRecipes)
            } else {
                updateOnlyRecipesWithTags([])
                setFilteredRecipes(recipes)
            }
        },
        [chosenCategories]
    )

    return <>
        
        
        <section className="searchBar">
            <input id="RecipeSearchBar"
                onChange={
                    (changeEvent) => {
                        updateSearchTerms(changeEvent.target.value)
                    }
                }
                type="text" placeholder="Find a Recipe" />
            <button className="btn--search"
                onClick={(evt) => handleSearchClick(evt)}
            ><img className="searchIcon" src={searchIcon} alt="search"></img></button>

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

        </section>
        
    </>
}
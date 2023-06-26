import { useEffect, useState } from "react"
import searchIcon from "../../assets/skillet-search-small.svg"
import Select from 'react-select';

export const SearchRecipes = ({ searchTerms, updateSearchTerms, setFilteredRecipes, recipes }) => {
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
        if (searchTerms !== "") {
            const searchedRecipes = recipes.filter(recipe => {
                // Filter by recipe title OR the authors name
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
            })
            setFilteredRecipes(searchedRecipes)
        } else {
            setFilteredRecipes(recipes)
        }
    }
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
                    <option value="0">Filter by: </option>
                    {
                        categoryTypes.map(catType => <option value={catType} key={`catType--${catType}`}>{catType}</option>)
                    }
                </select>
                <Select
                    className="filterBar__categorySelect"
                    id="filterByCategories"
                    options={filteredCategories}
                    onChange={(selectedOption) => {
                        const copy = [...chosenCategories]
                        copy.push(selectedOption)
                        updateChosenCategories(copy)
                    }}
                    isMulti
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
        </section>
    </>
}
import { useEffect } from "react"
import searchIcon from "../../assets/skillet-search-small.svg"

export const SearchRecipes = ({ recipes, searchTerms, onlyRecipesWithTags, updateOnlySearchedRecipes, setFilteredRecipes, updateSearchTerms, chosenCategories }) => {

    // Handle the search click
    const handleSearchClick = (evt) => {
        evt.preventDefault()
        // If there are no selected categories to filter by, filter through the original recipe list
        if (searchTerms !== "" && chosenCategories.length === 0) {
            const searchedRecipes = recipes.filter(recipe => {
                // Filter by recipe title OR the authors name
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
            })
            // update onlySearchedRecipes state so that additional filtering can be applied ontop of searched results
            updateOnlySearchedRecipes(searchedRecipes)
            // update recipe state with search results
            setFilteredRecipes(searchedRecipes)
        } else if (searchTerms !== "" && chosenCategories.length > 0) { // If there are selected categories, filter through recipes already filtered by categories
            const searchedAndFilteredRecipes = onlyRecipesWithTags.filter(recipe => {
                // Filter by recipe title OR the authors name
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
            })
            // Preserve the results of searching through all recipes so that the selected categories can be changed and update displayed recipes accordingly
            const justSearchedRecipes = recipes.filter(recipe => {
                // Filter by recipe title OR the authors name
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
            })
            // update search results for all recipes so that category options can be changed ontop of search results
            updateOnlySearchedRecipes(justSearchedRecipes)
            // Set filtered recipes with current filtered results
            setFilteredRecipes(searchedAndFilteredRecipes)
        } else if (searchTerms === "" && chosenCategories.length > 0) { // If no search terms but categories are selected, preserve recipes filtered by categories
            updateOnlySearchedRecipes([])
            setFilteredRecipes(onlyRecipesWithTags)
        } else { // else, set recipe list to default
            updateOnlySearchedRecipes([])
            setFilteredRecipes(recipes)
        }
    }

    /* When the display is toggled between 'allPosts' and 'postsFollowed'  OR when a user adds/removes a filter 
       category, this useEffect will trigger the recipe list to be filtered by the entered search terms.  Once 
       onlySearchedRecipes has been updated, the useEffect() for filtering categories will take notice and either 
       apply additional filtering on top of the searched recipes array if category tags are selected, or update 
       the filteredRecipes state with just the searched recipes if no categories are selected. */
    useEffect(
        () => {
            if (searchTerms !== "") {
                const searchedRecipes = recipes.filter(recipe => {
                    // Filter by recipe title OR the authors name
                    return recipe.title.toLowerCase().includes(searchTerms.toLowerCase()) || recipe.user.name.toLowerCase().includes(searchTerms.toLowerCase())
                })
                // update onlySearchedRecipes state so that additional filtering can be applied ontop of searched results
                updateOnlySearchedRecipes(searchedRecipes)
            }
            
        },
        [recipes, chosenCategories]
    )
    
    // When search terms are cleared, set onlySearchedRecipes to default
    useEffect(
        () => {
            if (searchTerms === "") {
                updateOnlySearchedRecipes([])
            } 
        },
        [searchTerms]
    )

    return <div className="searchBarContainer">
        <input id="RecipeSearchBar"
            onChange={
                (changeEvent) => {
                    updateSearchTerms(changeEvent.target.value)
                }
            }
            onKeyDown={(evt) => evt.key === 'Enter' && evt.target === document.activeElement && handleSearchClick(evt)}
            type="text" placeholder="Find a Recipe" />
        <button className="btn--search"
            onClick={(evt) => handleSearchClick(evt)}
        ><img className="searchIcon" src={searchIcon} alt="search"></img></button>
    </div>
}
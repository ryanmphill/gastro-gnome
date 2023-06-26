import searchIcon from "../../assets/skillet-search-small.svg"

export const SearchRecipes = ({ searchTerms, updateSearchTerms, setFilteredRecipes, recipes }) => {
    // Handle the search click
    const handleSearchClick = (evt) => {
        evt.preventDefault()
        if (searchTerms !== "") {
            const searchedRecipes = recipes.filter(recipe => {
                return recipe.title.toLowerCase().includes(searchTerms.toLowerCase())
            })
            setFilteredRecipes(searchedRecipes)
        } else {
            setFilteredRecipes(recipes)
        }
    }
    return <>
        <div className="searchBar">
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
        </div>
    </>
}
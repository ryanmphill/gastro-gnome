import { SearchRecipes } from "./SearchRecipes";
import { FilterByCategories } from "./FilterByCategories";
import { SelectedCategories } from "./SelectedCategories";
import { useState } from "react";

export const FilterBar = ({ setFilteredRecipes, recipes }) => {

    // State to track user input in search bar
    const [searchTerms, updateSearchTerms] = useState("")
    // State to keep track of all selected categories the user wants to use to filter recipe feed
    const [chosenCategories, updateChosenCategories] = useState([])

    /*  Define additional state variables to allow users to stack and unstack filtering options.
        Once the 'recipesToDisplay' is set, separate state will be preserved for filtering by search
        query and filtering by category tag. This will allow the user remove their search and still
        view filtered recipes based on category, or remove the selected category filters and still
        view results based on their search. */
    const [onlyRecipesWithTags, updateOnlyRecipesWithTags] = useState([])
    const [onlySearchedRecipes, updateOnlySearchedRecipes] = useState([])

    return <section className="filterContainer"> 
        <section className="filterBar">
            <SearchRecipes 
            recipes={recipes}
            searchTerms={searchTerms}
            onlyRecipesWithTags={onlyRecipesWithTags}
            updateOnlySearchedRecipes={updateOnlySearchedRecipes}
            setFilteredRecipes={setFilteredRecipes}
            updateSearchTerms={updateSearchTerms}
            chosenCategories={chosenCategories} />

            <FilterByCategories
            recipes={recipes}
            searchTerms={searchTerms}
            updateOnlyRecipesWithTags={updateOnlyRecipesWithTags}
            setFilteredRecipes={setFilteredRecipes}
            onlySearchedRecipes={onlySearchedRecipes}
            chosenCategories={chosenCategories}
            updateChosenCategories={updateChosenCategories} />
        </section>
        <SelectedCategories
        chosenCategories={chosenCategories}
        updateChosenCategories={updateChosenCategories} />
    </section>
}
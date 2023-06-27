import { SearchRecipes } from "./SearchRecipes";
import { FilterByCategories } from "./FilterByCategories";

export const FilterBar = ({ searchTerms, updateSearchTerms, setFilteredRecipes, recipes, onlyRecipesWithTags, updateOnlyRecipesWithTags, onlySearchedRecipes, updateOnlySearchedRecipes }) => {

    return <> 
        <section className="filterBar">
            <SearchRecipes 
            recipes={recipes}
            searchTerms={searchTerms}
            onlyRecipesWithTags={onlyRecipesWithTags}
            updateOnlySearchedRecipes={updateOnlySearchedRecipes}
            setFilteredRecipes={setFilteredRecipes}
            updateSearchTerms={updateSearchTerms}/>

            <FilterByCategories
            recipes={recipes}
            searchTerms={searchTerms}
            updateOnlyRecipesWithTags={updateOnlyRecipesWithTags}
            setFilteredRecipes={setFilteredRecipes}
            onlySearchedRecipes={onlySearchedRecipes} />
        </section>
    </>
}
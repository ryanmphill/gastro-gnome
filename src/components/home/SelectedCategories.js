

export const SelectedCategories = ({ chosenCategories, updateChosenCategories }) => {

    // Handle removing a category
    const handleRemoveSelected = (evt, objectToRemove) => {
        evt.preventDefault()

        const updatedCategories = chosenCategories.filter(category => category.id !== objectToRemove.id)
        updateChosenCategories(updatedCategories)
    }

    return <>
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
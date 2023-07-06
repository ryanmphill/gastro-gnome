import { useEffect, useState } from "react"

export const Nutrition = ({ recipeTitle, allIngredients, attachedIngredients, recipeLoading, ingredientsLoading, servingSize }) => {

    //Set state variable for ingredients to be sent to nutrition API as an array
    const [nutritionIngr, updateNutritionIngr] = useState([])
    const [titleToSend, setTitleToSend] = useState("")

    //Set a state variable for the fetched nutrition info
    const [nutrition, setNutrition] = useState({})
    const [nutritionLoaded, setNutritionLoaded] = useState(false)

    const appId = "d051915d"
    const apiKey = "66a68c6750b8d3607067512889543c09"

    // Define function to build ingredient array to send to nutrition api
    const buildIngredientsArray = () => {
        let ingredientsToSend = []
        attachedIngredients.forEach(attachedIngredient => {
            const matchedIngredient = allIngredients.find(
                ingredient => ingredient.id === attachedIngredient.ingredientId
            )
            if (matchedIngredient) { // Check if the matched ingredient value is truthy
                ingredientsToSend.push(`${attachedIngredient.quantity} ${attachedIngredient.quantityUnit} ${matchedIngredient.name}`)
            }
        })
        return ingredientsToSend
    }

    // Define function to send recipe to Edamam API
    const fetchNutrition = (recipeTitle, ingredients) => {
        const title = recipeTitle
        const ingr = ingredients
    
        return fetch(`https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${apiKey}`, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({title, ingr})
        }).then(response => response.json())
    }

    // Set the state for ingredients to send to api
    useEffect(
        () => {
            if (!recipeLoading && !ingredientsLoading) {
               const ingr = buildIngredientsArray()
               updateNutritionIngr(ingr)
               setTitleToSend(recipeTitle)
            }
        },
        [recipeLoading, ingredientsLoading]
    )

    // Invoke fetch call in a useEffect
    useEffect(
        () => {
            if (nutritionIngr.length > 0 && titleToSend.length > 0 && !nutritionLoaded) {
                console.log("nutritionIngr", nutritionIngr)
                console.log("recipeTitle", titleToSend)
                
                fetchNutrition(titleToSend, nutritionIngr).then((data) => {
                    console.log(data)
                    setNutrition(data)
                })
                .then(() => setNutritionLoaded(true))
                
            }
        },
        [nutritionIngr]
    )

    // Define a function to format the numbers in the results
    const formatNum = (num) => {
        if (typeof num === 'number') {
            const oneServing = num / servingSize
            const roundedNum = Math.round(oneServing)
            return roundedNum
          } else {
            return "-"
          }
    }
    return <section className="nutriFactsContainer">
        {
            nutritionIngr.length > 0 && titleToSend.length &&
            <section className="nutriFactsWrapper">

                <table className="nutriFacts">
                    <thead>
                        <tr>
                            <th><h2>Nutrition Facts</h2></th>
                        </tr>
                        <tr>
                            <th>Makes {servingSize} servings</th>
                        </tr>
                        <tr className="heavyTableBorder">
                            <th><h5>serving size: {formatNum(nutrition?.totalWeight)}g</h5></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Amount Per Serving</th>
                        </tr>
                        <tr className="mediumTableBorder">
                            <th><h3>Calories</h3></th>
                            <td><h3>{formatNum(nutrition?.calories)}</h3></td>
                        </tr>
                        <tr className="lightTableBorder">
                            <td> </td>
                            <th>% Daily Value</th>
                        </tr>
                        <tr className="lightTableBorder">
                            <th>Total fat {formatNum(nutrition?.totalNutrients?.FAT?.quantity)} {nutrition?.totalNutrients?.FAT?.unit ?? "-"}</th>
                            <td>{formatNum(nutrition?.totalDaily?.FAT?.quantity)}{nutrition?.totalDaily?.FAT?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <td>Saturated fat {formatNum(nutrition?.totalNutrients?.FASAT?.quantity)} {nutrition?.totalNutrients?.FASAT?.unit ?? "-"}</td>
                            <td>{formatNum(nutrition?.totalDaily?.FASAT?.quantity)}{nutrition?.totalDaily?.FASAT?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <td>Trans fat {formatNum(nutrition?.totalNutrients?.FATRN?.quantity)} {nutrition?.totalNutrients?.FATRN?.unit ?? "-"}</td>
                            <td>{formatNum(nutrition?.totalDaily?.FATRN?.quantity)}{nutrition?.totalDaily?.FATRN?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <th>Cholesterol {formatNum(nutrition?.totalNutrients?.CHOLE?.quantity)} {nutrition?.totalNutrients?.CHOLE?.unit ?? "-"}</th>
                            <td>{formatNum(nutrition?.totalDaily?.CHOLE?.quantity)}{nutrition?.totalDaily?.CHOLE?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <th>Sodium {formatNum(nutrition?.totalNutrients?.NA?.quantity)} {nutrition?.totalNutrients?.NA?.unit ?? "-"}</th>
                            <td>{formatNum(nutrition?.totalDaily?.NA?.quantity)}{nutrition?.totalDaily?.NA?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <th>Total Carbohydrates {formatNum(nutrition?.totalNutrients?.CHOCDF?.quantity)} {nutrition?.totalNutrients?.CHOCDF?.unit ?? "-"}</th>
                            <td>{formatNum(nutrition?.totalDaily?.CHOCDF?.quantity)}{nutrition?.totalDaily?.CHOCDF?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <th>Dietary Fiber {formatNum(nutrition?.totalNutrients?.FIBTG?.quantity)} {nutrition?.totalNutrients?.FIBTG?.unit ?? "-"}</th>
                            <td>{formatNum(nutrition?.totalDaily?.FIBTG?.quantity)}{nutrition?.totalDaily?.FIBTG?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <th>Total Sugars {formatNum(nutrition?.totalNutrients?.SUGAR?.quantity)} {nutrition?.totalNutrients?.SUGAR?.unit ?? "-"}</th>
                            <td>{formatNum(nutrition?.totalDaily?.SUGAR?.quantity)}{nutrition?.totalDaily?.SUGAR?.unit ?? "-"}</td>
                        </tr>
                        <tr>
                            <td>Including added sugars {formatNum(nutrition?.totalNutrients?.SUGAR?.added?.quantity)} {nutrition?.totalNutrients?.SUGAR?.added?.unit ?? "-"}</td>
                            <td>{formatNum(nutrition?.totalDaily?.SUGAR?.added?.quantity)}{nutrition?.totalDaily?.SUGAR?.added?.unit ?? "-"}</td>
                        </tr>
                        <tr className="heavyTableBorder">
                            <th>Protein {formatNum(nutrition?.totalNutrients?.PROCNT?.quantity)} {nutrition?.totalNutrients?.PROCNT?.unit ?? "-"}</th>
                            <td>{formatNum(nutrition?.totalDaily?.PROCNT?.quantity)}{nutrition?.totalDaily?.PROCNT?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <td>Vitamin D {formatNum(nutrition?.totalNutrients?.VITD?.quantity)} {nutrition?.totalNutrients?.VITD?.unit ?? "-"}</td>
                            <td>{formatNum(nutrition?.totalDaily?.VITD?.quantity)}{nutrition?.totalDaily?.VITD?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <td>Calcium {formatNum(nutrition?.totalNutrients?.CA?.quantity)} {nutrition?.totalNutrients?.CA?.unit ?? "-"}</td>
                            <td>{formatNum(nutrition?.totalDaily?.CA?.quantity)}{nutrition?.totalDaily?.CA?.unit ?? "-"}</td>
                        </tr>
                        <tr className="lightTableBorder">
                            <td>Iron {formatNum(nutrition?.totalNutrients?.FE?.quantity)} {nutrition?.totalNutrients?.FE?.unit ?? "-"}</td>
                            <td>{formatNum(nutrition?.totalDaily?.FE?.quantity)}{nutrition?.totalDaily?.FE?.unit ?? "-"}</td>
                        </tr>
                        <tr className="mediumTableBorder">
                            <td>Potassium {formatNum(nutrition?.totalNutrients?.K?.quantity)} {nutrition?.totalNutrients?.K?.unit ?? "-"}</td>
                            <td>{formatNum(nutrition?.totalDaily?.K?.quantity)}{nutrition?.totalDaily?.K?.unit ?? "-"}</td>
                        </tr>
                    </tbody>
                </table>
                <footer className="attributionContainer">
                    <img src="https://developer.edamam.com/images/badge.svg" alt="Edamam Logo" className="nutriAttribution"></img>
                </footer>
            </section>
        }
    </section>
    
    
    
}


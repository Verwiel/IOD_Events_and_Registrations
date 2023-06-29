
const arrayFunctions = {
    
    compareTwoArraysOfObjects(
        first_array_of_objects,
        second_array_of_objects
    ) {
        return (
            first_array_of_objects.length === second_array_of_objects.length &&
            first_array_of_objects.every((element_1) =>
                second_array_of_objects.some((element_2) =>
                    Object.keys(element_1).every((key) => element_1[key] === element_2[key])
                )
            )
        )
    }
}

module.exports = arrayFunctions

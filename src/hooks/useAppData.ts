// Graphql
import { useAppDataQuery } from "../graphql/models";

// Utils
import {
    convertCategoryApp,
    convertBurgerApp,
    convertItemApp,
    convertOptionApp,
    convertRestaurantApp,
    convertSaladApp,
    convertSandwichApp,
    convertSideApp,
    convertSimpleModel,
    convertIngredientApp,
} from "./Global.functions";

// Types
import { AppData } from "../types";

export const useAppData = () => {
    const { loading, error, data } = useAppDataQuery();
    let appData: AppData | undefined;

    try {
        appData =
            loading || !!error || !data
                ? undefined
                : ({
                      beverages: convertSimpleModel(data.beverages),
                      desserts: convertSimpleModel(data.desserts),
                      salads: convertSaladApp(data.salads),
                      sides: convertSideApp(data.sides),
                      sandwiches: convertSandwichApp(data.sandwiches),
                      burgers: convertBurgerApp(data.burgers),
                      items: convertItemApp(data.items),
                      options: convertOptionApp(data.options),
                      restaurants: convertRestaurantApp(data.restaurants),
                      categories: convertCategoryApp(data.categories),
                      ingredients: convertIngredientApp(data.ingredients),
                  } as AppData);
    } catch (error) {
        console.error(`Something went wrong: ${error}`);
        throw error;
    }

    return { loading, error, appData };
};

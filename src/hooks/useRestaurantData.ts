import { useState, useCallback, useMemo } from "react";
import { AppData, RestaurantData, Dessert, Beverage } from "../types";

import {
    convertSimpleModel,
    convertItem,
    convertIngredient,
    convertSidePage,
    convertSaladPage,
    convertSandwichPage,
    convertBurgerPage,
} from "./Restaurants.functions";

export const useRestaurantData = (appData: AppData) => {
    const [restaurantData, setRestaurantData] = useState<RestaurantData>();

    const filterProductForResturant = useCallback(
        (filter: string, findBySlug: boolean = false) => {
            try {
                const { restaurants } = appData;
                const restaurant = findBySlug
                    ? restaurants.find(({ slug }) => slug === slug)
                    : restaurants.find(({ id }) => id === filter);

                if (restaurant) {
                    const items = convertItem(appData.items, restaurant.id);
                    const beverages = convertSimpleModel({
                        elements: appData.beverages,
                        idRestaurant: restaurant.id,
                        type: "beverage",
                    });
                    const desserts = convertSimpleModel({
                        elements: appData.desserts,
                        idRestaurant: restaurant.id,
                        type: "dessert",
                    });
                    const ingredients = convertIngredient(appData.ingredients, restaurant.id);
                    const sidesPages = convertSidePage(appData.sides, restaurant.id, ingredients);
                    const saladsPages = convertSaladPage(appData.salads, restaurant.id, ingredients);
                    const sandwichesPages = convertSandwichPage(
                        appData.sandwiches,
                        restaurant.id,
                        ingredients,
                        appData.options,
                        items,
                        sidesPages,
                        beverages as Beverage[]
                    );

                    const burgersPages = convertBurgerPage(
                        appData.burgers,
                        restaurant.id,
                        ingredients,
                        appData.options,
                        items,
                        sidesPages,
                        beverages as Beverage[]
                    );

                    setRestaurantData({
                        items,
                        beverages: beverages as Beverage[],
                        desserts: desserts as Dessert[],
                        ingredients,
                        sidesPages,
                        saladsPages,
                        sandwichesPages,
                        burgersPages,
                        info: restaurant,
                    });
                } else {
                    console.warn(`There is not restaurant with the filter: ${filter}`);
                }
            } catch (error) {
                console.warn(error);
            }
        },
        [appData]
    );

    const value = useMemo(
        () =>
            [restaurantData, filterProductForResturant] as [
                RestaurantData | undefined,
                (filter: string, findBySlug: boolean) => void
            ],
        [filterProductForResturant, restaurantData]
    );

    return value;
};

import { useState, useCallback, useMemo } from "react";
import { AppData, RestaurantData, RestaurantCtx } from "../types";

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
    (idRestaurant: string) => {
      try {
        const { restaurants } = appData;
        const restaurant = restaurants.find(({ id }) => id === idRestaurant);
        if (restaurant) {
          const items = convertItem(appData.items, "1");
          const beverages = convertSimpleModel(appData.beverages, idRestaurant);
          const desserts = convertSimpleModel(appData.desserts, idRestaurant);
          const ingredients = convertIngredient(
            appData.ingredients,
            idRestaurant
          );
          const sidesPages = convertSidePage(
            appData.sides,
            idRestaurant,
            ingredients
          );
          const saladsPages = convertSaladPage(
            appData.salads,
            idRestaurant,
            ingredients
          );
          const sandwichesPages = convertSandwichPage(
            appData.sandwiches,
            idRestaurant,
            ingredients,
            appData.options,
            items,
            sidesPages,
            beverages
          );

          const burgersPages = convertBurgerPage(
            appData.burgers,
            idRestaurant,
            ingredients,
            appData.options,
            items,
            sidesPages,
            beverages
          );
          setRestaurantData({
            items,
            beverages,
            desserts,
            ingredients,
            sidesPages,
            saladsPages,
            sandwichesPages,
            burgersPages,
          });
        } else {
          console.warn(`There is not restaurant with the id: ${idRestaurant}`);
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [appData]
  );

  const value = useMemo(
    () => [restaurantData, filterProductForResturant] as RestaurantCtx,
    [filterProductForResturant, restaurantData]
  );

  return value;
};

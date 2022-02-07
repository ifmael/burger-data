import {
    BeverageApp,
    BeveragesQuery,
    BurgerApp,
    BurgerConfiguration,
    BurgerQuery,
    CategoryApp,
    CategoryQuery,
    DessertApp,
    DessertsQuery,
    IngredientApp,
    IngredientQuery,
    ItemApp,
    ItemQuery,
    RestaurantApp,
    RestaurantsQuery,
    OptionApp,
    OptionQuery,
    SaladApp,
    SaladsQuery,
    SandwichApp,
    SandwichQuery,
    SideApp,
    SideConfiguration,
    SidesQuery,
    ComponentCommonRestaurant,
    PriceRestaurant,
} from "../types";
import { BeverageEntity, IngredientEntity, ItemEntity, SideEntity } from "../graphql/models";

type Schedule = {
    closing: string;
    opening: string;
    days: { day: string; key: number }[];
};

// ################  COMPONENTS  ################

const convertComponentRestaurant = (restaurants: ComponentCommonRestaurant, avalaible = false): PriceRestaurant[] => {
    return (
        restaurants?.reduce((acc, currentValue) => {
            const restaurantId = currentValue?.restaurant?.data?.id ?? "";
            const isAvailable = currentValue.available ?? avalaible;

            return currentValue && isAvailable && restaurantId !== ""
                ? [...acc, { price: currentValue.price, restaurantId }]
                : acc;
        }, [] as PriceRestaurant[]) ?? []
    );
};

const convertComponentIngredient = (ingredientRelationColleciton: IngredientEntity[]): string[] => {
    return (
        ingredientRelationColleciton?.reduce(
            (acc, ingredientValue) => (ingredientValue.id ? [...acc, ingredientValue.id] : acc),
            [] as string[]
        ) ?? []
    );
};

// ################  MODELS  ################

export const convertRestaurantApp = (restaurantCollection: RestaurantsQuery): RestaurantApp[] => {
    let restaurants: RestaurantApp[] = [];
    if (restaurantCollection) {
        restaurants = restaurantCollection.data.map(({ id, attributes }) => {
            const postalCodes = attributes?.postalCodes
                ? attributes?.postalCodes?.reduce((acc, currentValue) => {
                      return currentValue ? [...acc, currentValue.key] : acc;
                  }, [] as number[])
                : [];
            const schedule = attributes?.schedule
                ? attributes?.schedule?.reduce((acc, currentValue) => {
                      const days =
                          currentValue?.days?.data?.reduce((accDays, { attributes: attributesDays }) => {
                              return attributesDays
                                  ? [...accDays, { key: attributesDays.key, day: attributesDays.day }]
                                  : accDays;
                          }, [] as { day: string; key: number }[]) ?? [];

                      return currentValue
                          ? [
                                ...acc,
                                {
                                    closing: currentValue.closing,
                                    opening: currentValue.opening,
                                    days,
                                },
                            ]
                          : acc;
                  }, [] as Schedule[])
                : [];

            const restaurant = {
                id: id ?? "",
                name: attributes?.name ?? "",
                address: attributes?.address ?? "",
                phone: attributes?.phone ?? "",
                slug: attributes?.slug ?? "",
                moreOrders: !!attributes?.moreOrders,
                isClose: !!attributes?.isClose,
                postalCodes,
                schedule,
            };
            return restaurant;
        });
    }
    return restaurants;
};

export const convertSaladApp = (saladCollection: SaladsQuery): SaladApp[] => {
    let salads: SaladApp[] = [];

    if (saladCollection) {
        salads = saladCollection.data.map(({ id, attributes }) => {
            const restaurant = attributes?.restaurant
                ? convertComponentRestaurant(attributes.restaurant as ComponentCommonRestaurant)
                : [];

            const ingredients = attributes?.ingredients?.data
                ? convertComponentIngredient(attributes.ingredients.data)
                : [];

            const salad = {
                id: id ?? "",
                name: attributes?.name ?? "",
                description: attributes?.description ?? "",
                slug: attributes?.slug ?? "",
                position: attributes?.position ?? 0,
                ingredients,
                restaurant,
            };
            return salad;
        });
    }

    return salads;
};

export const convertSideApp = (sideCollection: SidesQuery): SideApp[] => {
    let sides: SideApp[] = [];

    if (sideCollection) {
        sides = sideCollection.data.map(({ id, attributes }) => {
            const restaurant = attributes?.restaurant
                ? convertComponentRestaurant(attributes.restaurant as ComponentCommonRestaurant)
                : [];

            const ingredients = attributes?.ingredients?.data
                ? convertComponentIngredient(attributes.ingredients.data)
                : [];
            const sauces = attributes?.sauces?.data ? convertComponentIngredient(attributes.sauces.data) : [];

            const side = {
                id: id ?? "",
                name: attributes?.name ?? "",
                description: attributes?.description ?? "",
                slug: attributes?.slug ?? "",
                position: attributes?.position ?? 0,
                selectOneOption: !!attributes?.selectOneOption,
                isCustomizable: !!attributes?.isCustomizable,
                isSauce: !!attributes?.isSauce,
                restaurant,
                ingredients,
                sauces,
            };

            return side;
        });
    }

    return sides;
};

export const convertSandwichApp = (sandwichCollection: SandwichQuery): SandwichApp[] => {
    let sandwiches: SandwichApp[] = [];

    if (sandwichCollection) {
        sandwiches = sandwichCollection.data.map(({ id, attributes }) => {
            const ingredients = attributes?.ingredients?.data
                ? convertComponentIngredient(attributes.ingredients.data)
                : [];

            // Configuration for each restaurant (price, available, beverages, sides and bread)
            const restaurant =
                attributes?.restaurants?.reduce((acc, restaurantConfig) => {
                    const breadOption = restaurantConfig?.bread?.data?.id ?? "";
                    const beverageOption = restaurantConfig?.beverage?.data?.id ?? "";
                    const sideOption = restaurantConfig?.side?.data?.id ?? "";
                    const restaurantId = restaurantConfig?.restaurant?.data?.id ?? "";
                    const price = restaurantConfig?.price ?? -1;

                    return restaurantConfig?.available && restaurantId !== ""
                        ? [
                              ...acc,
                              {
                                  breadOption,
                                  beverageOption,
                                  sideOption,
                                  restaurantId,
                                  price,
                              },
                          ]
                        : acc;
                }, [] as (SideConfiguration & PriceRestaurant)[]) ?? [];

            const sandwich = {
                id: id ?? "",
                name: attributes?.name ?? "",
                description: attributes?.description ?? "",
                position: attributes?.position ?? 0,
                slug: attributes?.slug ?? "",
                ingredients,
                restaurant,
            };

            return sandwich;
        });
    }

    return sandwiches;
};

export const convertBurgerApp = (burgerCollection: BurgerQuery): BurgerApp[] => {
    let burgers: BurgerApp[] = [];

    if (burgerCollection) {
        burgers = burgerCollection.data.map(({ id, attributes }) => {
            const ingredients = attributes?.ingredients?.data
                ? convertComponentIngredient(attributes.ingredients.data)
                : [];

            const restaurants =
                attributes?.restaurants?.reduce((acc, restaurantConfig) => {
                    const breadOption = restaurantConfig?.bread?.data?.id ?? "";
                    const beverageOption = restaurantConfig?.beverage?.data?.id ?? "";
                    const sideOption = restaurantConfig?.sides?.data?.id ?? "";
                    const restaurantId = restaurantConfig?.restaurant?.data?.id ?? "-1";
                    const price = restaurantConfig?.price ?? -1;
                    const meatOption = restaurantConfig?.meat?.data?.id ?? "";
                    const meatPointOption = restaurantConfig?.meatPoint?.data?.id ?? "";

                    return restaurantConfig?.available && restaurantId !== ""
                        ? [
                              ...acc,
                              {
                                  price,
                                  restaurantId,
                                  meatOption,
                                  meatPointOption,
                                  breadOption,
                                  beverageOption,
                                  sideOption,
                              },
                          ]
                        : acc;
                }, [] as (BurgerConfiguration & PriceRestaurant)[]) ?? [];

            const burger: BurgerApp = {
                id: id ?? "",
                name: attributes?.name ?? "",
                description: attributes?.description ?? "",
                isChildrenMenu: !!attributes?.isChildrenMenu,
                isYourTaste: !!attributes?.isYourTaste,
                position: attributes?.position ?? 0,
                ingredients,
                restaurants,
                slug: attributes?.slug ?? "",
            };
            return burger;
        });
    }

    return burgers;
};

export const convertItemApp = (itemCollection: ItemQuery): ItemApp[] => {
    let items: ItemApp[] = [];

    if (itemCollection) {
        items = itemCollection.data.map(({ id, attributes }) => {
            const restaurant = attributes?.restaurant
                ? convertComponentRestaurant(attributes.restaurant as ComponentCommonRestaurant)
                : [];

            const item = {
                id: id ?? "",
                name: attributes?.name ?? "",
                restaurant,
            };

            return item;
        });
    }

    return items;
};

export const convertOptionApp = (optionCollection: OptionQuery): OptionApp[] => {
    let options: OptionApp[] = [];
    if (optionCollection) {
        options = optionCollection.data.map(({ id, attributes }) => {
            function extractIds(acc: string[], currentEntity: ItemEntity | BeverageEntity | SideEntity): string[] {
                return currentEntity?.id ? [...acc, currentEntity?.id] : acc;
            }
            const items = attributes?.items?.data.reduce(extractIds, []) ?? [];
            const beverages = attributes?.beverages?.data.reduce(extractIds, []) ?? [];
            const sides = attributes?.sides?.data.reduce(extractIds, []) ?? [];

            const option = {
                id: id ?? "",
                name: attributes?.name ?? "",
                items,
                beverages,
                sides,
            };

            return option;
        });
    }

    return options;
};

export function convertSimpleModel(collection: BeveragesQuery): BeverageApp[];
export function convertSimpleModel(collection: DessertsQuery): DessertApp[];
export function convertSimpleModel(collection: BeveragesQuery | DessertsQuery): (BeverageApp | DessertApp)[] {
    let modelElements: (BeverageApp | DessertApp)[] = [];

    if (collection) {
        modelElements =
            collection.data.map(({ id, attributes }) => {
                const restaurant = attributes?.restaurant
                    ? convertComponentRestaurant(attributes.restaurant as ComponentCommonRestaurant)
                    : [];

                const element = {
                    id: id ?? "",
                    name: attributes?.name ?? "",
                    position: attributes?.position ?? 0,
                    slug: attributes?.slug ?? "",
                    restaurant,
                };

                return element;
            }) ?? [];
    }

    return modelElements;
}

export const convertCategoryApp = (collectionCategory: CategoryQuery): CategoryApp[] => {
    let categories: CategoryApp[] = [];

    if (collectionCategory) {
        categories = collectionCategory.data.map(({ id, attributes }) => ({
            id: id ?? "",
            name: attributes?.name ?? "",
            position: attributes?.position ?? 0,
            asset: attributes?.asset ?? "",
            slug: attributes?.slug ?? "",
        }));
    }

    return categories;
};

export const convertIngredientApp = (ingredientCollection: IngredientQuery): IngredientApp[] => {
    let ingredients: IngredientApp[] = [];

    if (ingredientCollection) {
        ingredients = ingredientCollection.data.map(({ id, attributes }) => {
            const restaurant = attributes?.restaurants
                ? convertComponentRestaurant(attributes.restaurants as ComponentCommonRestaurant, true)
                : [];

            const ingredient = {
                id: id ?? "",
                name: attributes?.name ?? "",
                inSalad: !!attributes?.inSalad,
                inBurger: !!attributes?.inBurger,
                inSandwich: !!attributes?.inSandwich,
                restaurant,
            };

            return ingredient;
        });
    }

    return ingredients;
};

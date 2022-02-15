import {
    Restaurant as RestaurantAPI,
    Beverage as BeverageAPI,
    Dessert as DessertAPI,
    Salad as SaladAPI,
    Side as SideAPI,
    Sandwich as SandwichAPI,
    Burger as BurgerAPI,
    Item as ItemAPI,
    Option as OptionAPI,
    Category as CategoryAPI,
    Ingredient as IngredientAPI,
    AppDataQuery,
} from "../graphql/models";

import { useRestaurantData } from "../hooks/useRestaurantData";
export type UndefinedNull = undefined | null;

export interface Config {
    server: string | UndefinedNull;
    apiToken: string | UndefinedNull;
}

//  ############### Utils ###############
type Merge<A, B> = {
    [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

//  ############### Model App Configuration ###############

export type PriceRestaurant = { price: number; restaurantId: string };
export type SideConfiguration = {
    breadOption: string;
    beverageOption: string;
    sideOption: string;
};
export type BurgerConfiguration = {
    meatOption: string;
    meatPointOption: string;
    breadOption: string;
    beverageOption: string;
    sideOption: string;
};

//  ############### Components ###############

export type ComponentCommonRestaurant =
    | {
          price: number;
          available: boolean;
          restaurant?:
              | {
                    data?:
                        | {
                              id?: string | null | undefined;
                          }
                        | null
                        | undefined;
                }
              | null
              | undefined;
      }[]
    | null
    | undefined;

// ###############  Models APP ###############

export type RestaurantApp = Omit<RestaurantAPI, "schedule" | "postalCodes"> & {
    id: string;
    schedule: {
        closing: string;
        opening: string;
        days: { day: string; key: number }[];
    }[];
    postalCodes: number[];
};

export type BeverageApp = Omit<BeverageAPI, "restaurant" | "__typename"> & {
    id: string;
    restaurant: PriceRestaurant[];
};

export type DessertApp = Omit<DessertAPI, "restaurant" | "__typename"> & {
    id: string;
    restaurant: PriceRestaurant[];
};

export type SaladApp = Omit<SaladAPI, "restaurant" | "ingredients"> & {
    id: string;
    restaurant: PriceRestaurant[];
    ingredients: string[];
};

export type SideApp = Omit<SideAPI, "restaurant" | "ingredients" | "sauces"> & {
    id: string;
    restaurant: PriceRestaurant[];
    ingredients: string[];
    sauces: string[];
};

export type SandwichApp = Omit<SandwichAPI, "restaurant" | "ingredients"> & {
    id: string;
    ingredients: string[];
    restaurant: (SideConfiguration & PriceRestaurant)[];
};

export type BurgerApp = Omit<BurgerAPI, "restaurants" | "ingredients"> & {
    id: string;
    ingredients: string[];
    restaurants: (BurgerConfiguration & PriceRestaurant)[];
};

export type ItemApp = Omit<ItemAPI, "restaurant"> & {
    id: string;
    restaurant: PriceRestaurant[];
};

export type OptionApp = Omit<OptionAPI, "items" | "beverages" | "sides"> & {
    id: string;
    items?: string[];
    beverages?: string[];
    sides: string[];
};

export type CategoryApp = CategoryAPI & {
    id: string;
};

export type IngredientApp = Omit<IngredientAPI, "restaurant"> & {
    id: string;
    restaurant: PriceRestaurant[];
};

// Apollo Query
export type RestaurantsQuery = AppDataQuery["restaurants"];
export type BeveragesQuery = AppDataQuery["beverages"];
export type DessertsQuery = AppDataQuery["desserts"];
export type SaladsQuery = AppDataQuery["salads"];
export type SidesQuery = AppDataQuery["sides"];
export type SandwichQuery = AppDataQuery["sandwiches"];
export type BurgerQuery = AppDataQuery["burgers"];
export type ItemQuery = AppDataQuery["items"];
export type OptionQuery = AppDataQuery["options"];
export type CategoryQuery = AppDataQuery["categories"];
export type IngredientQuery = AppDataQuery["ingredients"];

// Models
export type Ingredient = {
    id: string;
    name: string;
    price: number;
    inSalad: boolean;
    inBurger: boolean;
    inSandwich: boolean;
};

export type IngredientProduct = {
    id: string;
    name: string;
    price: number;
    selected: boolean;
};

export type Item = {
    id: string;
    name: string;
    price: number;
};

export type Beverage = {
    id: string;
    name: string;
    price: number;
    position: number;
    slug: string;
};

export type Dessert = {
    id: string;
    name: string;
    price: number;
    position: number;
    slug: string;
};

export type SaladPage = {
    id: string;
    name: string;
    description: string;
    price: number;
    position: number;
    ingredients: Ingredient[];
    ingredientsExtra: Ingredient[];
    slug: string;
};
export type Salad = {
    id: string;
    name: string;
    price: number;
    ingredients: IngredientProduct[];
    ingredientsExtra: IngredientProduct[];
};

export type SidePage = {
    id: string;
    name: string;
    description: string;
    price: number;
    position: number;
    isCustomizable: boolean;
    isSauce: boolean;
    selectOneOption: boolean;
    ingredients: Ingredient[];
    sauces: Ingredient[];
    slug: string;
};

export type Side = {
    id: string;
    name: string;
    price: number;
    isSauce: boolean;
    ingredients: IngredientProduct[];
    sauces: IngredientProduct[];
};

export type SandwichPage = {
    id: string;
    name: string;
    description: string;
    price: number;
    position: number;
    ingredients: Ingredient[];
    ingredientsExtra: Ingredient[];
    bread: Item[];
    sides: SidePage[];
    beverages: Beverage[];
    slug: string;
};

export type Sandwich = {
    id: string;
    name: string;
    price: number;
    isMenu: boolean;
    ingredients: IngredientProduct[];
    ingredientsExtra: IngredientProduct[];
    bread: Item;
    beverage: Beverage;
    side: Side;
};

export type BurgerPage = {
    id: string;
    name: string;
    description: string;
    price: number;
    position: number;
    isChildrenMenu: boolean;
    isYourTaste: boolean;
    ingredients: Ingredient[];
    ingredientsExtra: Ingredient[];
    bread: Item[];
    meat: Item[];
    meatPoint: Item[];
    sides: SidePage[];
    beverages: Beverage[];
    slug: string;
};

export type Burger = {
    id: string;
    name: string;
    price: number; // total for ingredients and menu or only the basic prodict price ??
    isChildrenMenu: boolean;
    isYourTaste: boolean;
    isMenu: boolean;
    ingredients: IngredientProduct[];
    ingredientsExtra: IngredientProduct[];
    bread: Item;
    meat: Item;
    meatPoint: Item;
    beverage: Beverage;
    side: Side;
};

export type RestaurantData = {
    items: Item[];
    beverages: Beverage[];
    desserts: Dessert[];
    ingredients: Ingredient[];
    sidesPages: SidePage[];
    saladsPages: SaladPage[];
    sandwichesPages: SandwichPage[];
    burgersPages: BurgerPage[];
    info: RestaurantApp;
};

// Context

export type AppData = {
    restaurants: RestaurantApp[];
    beverages: BeverageApp[];
    desserts: DessertApp[];
    salads: SaladApp[];
    sides: SideApp[];
    sandwiches: SandwichApp[];
    burgers: BurgerApp[];
    items: ItemApp[];
    options: OptionApp[];
    categories: CategoryApp[];
    ingredients: IngredientApp[];
};

export type RestaurantCtx = ReturnType<typeof useRestaurantData>;

import {
    BurgerApp,
    OptionApp,
    Item,
    ItemApp,
    Beverage,
    BeverageApp,
    Dessert,
    DessertApp,
    SideApp,
    SidePage,
    IngredientApp,
    Ingredient,
    SaladApp,
    SaladPage,
    SandwichApp,
    BurgerPage,
    PriceRestaurant,
    SideConfiguration,
    BurgerConfiguration,
    SandwichPage,
} from "../types";

// ####### Utils  #######
function getElements(listIngredients: string[], ingredients: Ingredient[]): Ingredient[];
function getElements(listSides: string[], sides: SidePage[]): SidePage[];
function getElements(listBeverages: string[], beverages: Beverage[]): Beverage[];
function getElements(listItems: string[], items: Item[]): Item[];
function getElements(
    list: string[],
    elements: Ingredient[] | Item[] | Beverage[] | SidePage[]
): Ingredient[] | Item[] | Beverage[] | SidePage[] {
    let elementsForProduct: Ingredient[] | Item[] | Beverage[] | SidePage[] = [];
    if (list.length && elements.length) {
        elementsForProduct = list.reduce((acc, idSide) => {
            const side = elements.find((sideInner) => sideInner.id === idSide);

            return side ? [...acc, side] : acc;
        }, [] as Ingredient[] | Item[] | Beverage[] | SidePage[]);
    }
    return elementsForProduct;
}

const getOptions = (options: OptionApp[], optionId: string): OptionApp | undefined =>
    options.find(({ id }) => id === optionId);

function getPriceRestaurant(
    priceRestaurant: (PriceRestaurant & BurgerConfiguration)[],
    idRestaurant: string
): (PriceRestaurant & BurgerConfiguration) | undefined;
function getPriceRestaurant(
    priceRestaurant: (PriceRestaurant & SideConfiguration)[],
    idRestaurant: string
): (PriceRestaurant & SideConfiguration) | undefined;
function getPriceRestaurant(priceRestaurant: PriceRestaurant[], idRestaurant: string): PriceRestaurant | undefined;
function getPriceRestaurant(
    priceRestaurant:
        | PriceRestaurant[]
        | (PriceRestaurant & SideConfiguration)[]
        | (PriceRestaurant & BurgerConfiguration)[],
    idRestaurant: string
): PriceRestaurant | (PriceRestaurant & SideConfiguration) | (PriceRestaurant & BurgerConfiguration) | undefined {
    return priceRestaurant.find((itemRestaurant) => itemRestaurant.restaurantId === idRestaurant);
}

// ####### Converter #######
export const convertItem = (items: ItemApp[], idRestaurant: string): Item[] => {
    return items.reduce((acc, item) => {
        const resturantItem = getPriceRestaurant(item.restaurant, idRestaurant);

        return resturantItem ? [...acc, { id: item.id, name: item.name, price: resturantItem.price }] : acc;
    }, [] as Item[]);
};

export const convertIngredient = (ingredients: IngredientApp[], idRestaurant: string): Ingredient[] => {
    return ingredients.reduce((acc, ingredient) => {
        const resturantItem = getPriceRestaurant(ingredient.restaurant, idRestaurant);

        return resturantItem
            ? [
                  ...acc,
                  {
                      id: ingredient.id,
                      name: ingredient.name,
                      price: resturantItem.price,
                      inSalad: ingredient.inSalad,
                      inBurger: ingredient.inBurger,
                      inSandwich: ingredient.inSandwich,
                  },
              ]
            : acc;
    }, [] as Ingredient[]);
};

export const convertSidePage = (sides: SideApp[], idRestaurant: string, ingredients: Ingredient[]): SidePage[] => {
    return sides.reduce((acc, side) => {
        const resturantItem = getPriceRestaurant(side.restaurant, idRestaurant);
        const {
            id,
            name,
            description,
            position,
            ingredients: ingredientsIDs,
            sauces: saucesIDs,
            isCustomizable,
            isSauce,
            selectOneOption,
            slug,
        } = side;
        const ingredientsSide = getElements(ingredientsIDs, ingredients);
        const saucesSide = getElements(saucesIDs, ingredients);

        const sidePage = {
            id,
            name,
            description: description ?? "",
            slug,
            position: position ?? 0,
            isCustomizable: !!isCustomizable,
            isSauce: !!isSauce,
            selectOneOption: !!selectOneOption,
            ingredients: ingredientsSide,
            sauces: saucesSide,
        };

        return resturantItem ? [...acc, { ...sidePage, price: resturantItem.price }] : acc;
    }, [] as SidePage[]);
};

export const convertSaladPage = (salads: SaladApp[], idRestaurant: string, ingredients: Ingredient[]): SaladPage[] => {
    return salads.reduce((acc, saladInner) => {
        const resturantItem = getPriceRestaurant(saladInner.restaurant, idRestaurant);
        const ingredientsProduct = getElements(saladInner.ingredients, ingredients);

        const saladPage = {
            id: saladInner.id,
            name: saladInner.name,
            description: saladInner.description ?? "",
            position: saladInner.position,
            slug: saladInner.slug,
            ingredients: ingredientsProduct,
            ingredientsExtra: [],
        };

        return resturantItem ? [...acc, { ...saladPage, price: resturantItem.price }] : acc;
    }, [] as SaladPage[]);
};

export const convertBurgerPage = (
    burgers: BurgerApp[],
    idRestaurant: string,
    ingredients: Ingredient[],
    options: OptionApp[],
    items: Item[],
    sides: SidePage[],
    beverages: Beverage[]
): BurgerPage[] => {
    return burgers.reduce((acc, currentBurger) => {
        const resturantItem = getPriceRestaurant(currentBurger.restaurants, idRestaurant);
        const ingredientsProduct = getElements(currentBurger.ingredients, ingredients);

        if (resturantItem) {
            const breadOption = getOptions(options, resturantItem.breadOption);
            const meatOption = getOptions(options, resturantItem.meatOption);
            const meatPointOption = getOptions(options, resturantItem.meatPointOption);
            const beverageOption = getOptions(options, resturantItem.beverageOption);
            const sideOption = getOptions(options, resturantItem.sideOption);

            const bread = breadOption?.items ? getElements(breadOption.items, items) : [];
            const beveragesProduct: Beverage[] = beverageOption?.beverages
                ? getElements(beverageOption.beverages, beverages)
                : [];
            const sidesPage = sideOption?.sides ? getElements(sideOption?.sides, sides) : [];
            const meat = meatOption?.items ? getElements(meatOption.items, items) : [];
            const meatPoint = meatPointOption?.items ? getElements(meatPointOption.items, items) : [];

            const burgerPage: BurgerPage = {
                id: currentBurger.id,
                name: currentBurger.name,
                description: currentBurger.description ?? "",
                price: resturantItem.price,
                position: currentBurger.position,
                isChildrenMenu: !!currentBurger.isChildrenMenu,
                isYourTaste: !!currentBurger.isYourTaste,
                ingredients: ingredientsProduct,
                ingredientsExtra: [],
                meat,
                meatPoint,
                bread,
                sides: sidesPage,
                beverages: beveragesProduct,
                slug: currentBurger.slug,
            };
            return [...acc, burgerPage];
        }
        return acc;
    }, [] as BurgerPage[]);
};

export const convertSandwichPage = (
    sandwiches: SandwichApp[],
    idRestaurant: string,
    ingredients: Ingredient[],
    options: OptionApp[],
    items: Item[],
    sides: SidePage[],
    beverages: Beverage[]
): SandwichPage[] => {
    return sandwiches.reduce((acc, currentSandwich) => {
        const resturantItem = getPriceRestaurant(currentSandwich.restaurant, idRestaurant);

        const ingredientsProduct = getElements(currentSandwich.ingredients, ingredients);
        if (resturantItem) {
            const breadOption = getOptions(options, resturantItem.breadOption);
            const beverageOption = getOptions(options, resturantItem.beverageOption);
            const sideOption = getOptions(options, resturantItem.sideOption);

            const bread = breadOption?.items ? getElements(breadOption.items, items) : [];
            const beveragesProduct = beverageOption?.beverages
                ? getElements(beverageOption.beverages, beverages as Beverage[])
                : [];
            const sidesPage = sideOption?.sides ? getElements(sideOption?.sides, sides) : [];

            const sandwichPage = {
                id: currentSandwich.id,
                name: currentSandwich.name ?? "",
                description: currentSandwich.description ?? "",
                slug: currentSandwich.slug,
                price: resturantItem.price,
                position: currentSandwich.position,
                ingredients: ingredientsProduct,
                ingredientsExtra: [],
                bread,
                sides: sidesPage,
                beverages: beveragesProduct,
            };
            return [...acc, sandwichPage];
        }
        return acc;
    }, [] as SandwichPage[]);
};

export function convertSimpleModel(elements: DessertApp[], idRestaurant: string): Dessert[];
export function convertSimpleModel(elements: BeverageApp[], idRestaurant: string): Beverage[];
export function convertSimpleModel(
    elements: BeverageApp[] | DessertApp[],
    idRestaurant: string
): Beverage[] | Dessert[] {
    return elements
        .map((el) => {
            const resturantItem = getPriceRestaurant(el.restaurant, idRestaurant);

            return resturantItem ? { id: el.id, name: el.name, price: resturantItem.price } : null;
        })
        .filter((el) => !!el) as Beverage[] | Dessert[];
}

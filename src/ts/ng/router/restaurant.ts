
export enum RestaurantRouteName {
    Manage = 'manage',
    Order = 'order'
}

export interface RestaurantRoute {
    Manage: string[];
    Order: string[];
}

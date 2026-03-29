export interface WorldNode {
    id: string;
    label: string;
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    route: string;
    icon: string;
    requiredLevel: number;
    description: string;
}

export const worldMapNodes: WorldNode[] = [
    { 
        id: "town", 
        label: "Town Square", 
        x: 50, 
        y: 40, 
        route: "/town",
        icon: "🏘️",
        requiredLevel: 1,
        description: "Shops, upgrades, and safety."
    },
    { 
        id: "forest", 
        label: "Mystic Forest", 
        x: 75, 
        y: 35, 
        route: "/forest",
        icon: "🌲",
        requiredLevel: 5,
        description: "Wilderness and gathering."
    },
    { 
        id: "dungeon", 
        label: "The Dungeon", 
        x: 85, 
        y: 70, 
        route: "/dungeon",
        icon: "🌋",
        requiredLevel: 10,
        description: "Dangerous boss encounters."
    },
    { 
        id: "training", 
        label: "Training Grounds", 
        x: 25, 
        y: 60, 
        route: "/dashboard", // We'll handle this in the map component or a modal for now
        icon: "⚔️",
        requiredLevel: 3,
        description: "Hone your stats."
    },
    { 
        id: "marketplace", 
        label: "Marketplace", 
        x: 60, 
        y: 20, 
        route: "/town", // Routes to town for now, can be updated later
        icon: "⚖️",
        requiredLevel: 2,
        description: "Trade and barter."
    },
    { 
        id: "base", 
        label: "Player Base", 
        x: 35, 
        y: 80, 
        route: "BASE_MODAL", // Special route to open base manager
        icon: "🏰",
        requiredLevel: 1,
        description: "Your sanctuary."
    }
];

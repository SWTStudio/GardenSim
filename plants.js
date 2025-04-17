class Plant {
    constructor(type) {
        this.type = type;
        this.growthStage = 0; // 0=germinating, 1=seedling, 2=growing, 3=mature, 4=harvestable
        this.growthProgress = 0; // Progress toward next stage (0-100%)
        this.isDead = false;
        this.dryDays = 0; // Count of consecutive days without water
        
        // Expanded plant types with seasonal preferences and rewards
        const plantTypes = {
            tomato: {
                name: "Tomato",
                growthRate: 1.0,
                waterNeed: 1.2,
                icons: ['🌰', '🌱', '🌿', '🌱', '🍅'],
                deadIcon: '🥀',
                harvestReward: 10,
                preferredSeason: "summer",  // Tomatoes love summer heat
                description: "A juicy red fruit that grows well in summer."
            },
            carrot: {
                name: "Carrot",
                growthRate: 0.8,
                waterNeed: 0.9,
                icons: ['🌰','🌱', '🌿', '🌱', '🥕',],
                deadIcon: '🥀',
                harvestReward: 5,
                preferredSeason: "spring",  // Carrots prefer cool spring weather
                description: "A root vegetable that grows well in spring."
            },
            corn: {
                name: "Corn",
                growthRate: 1.2,
                waterNeed: 1.5,
                icons: ['🌰','🌱', '🌿', '🌱', '🌽'],
                deadIcon: '🥀',
                harvestReward: 15,
                preferredSeason: "summer",  // Corn needs summer heat
                description: "A tall grain that grows best in hot summer weather."
            },
            lettuce: {
                name: "Lettuce",
                growthRate: 0.7,
                waterNeed: 1.1,
                icons: ['🌰','🌱', '🌿', '🌱', '🥬', ],
                deadIcon: '🥀',
                harvestReward: 6,
                preferredSeason: "spring",  // Lettuce bolts in heat, prefers spring
                description: "A leafy vegetable that prefers cool weather."
            },
            pumpkin: {
                name: "Pumpkin",
                growthRate: 0.9,
                waterNeed: 1.3,
                icons: ['🌰','🌱', '🌿', '🌱', '🎃'],
                deadIcon: '🥀',
                harvestReward: 20,
                preferredSeason: "fall",    // Pumpkins are harvested in fall
                description: "A large orange gourd that matures in the fall."
            },
            sunflower: {
                name: "Sunflower",
                growthRate: 1.1,
                waterNeed: 1.0,
                icons: ['🌰','🌱', '🌿', '🌱', '🌻'],
                deadIcon: '🥀',
                harvestReward: 12,
                preferredSeason: "summer",  // Sunflowers love sunny summer days
                description: "A tall flower that follows the sun as it grows."
            },
            radish: {
                name: "Radish",
                growthRate: 0.6,
                waterNeed: 0.8,
                icons: ['🌰','🌱', '🌿', '🌱', '🥗'],  // No radish emoji, using salad
                deadIcon: '🥀',
                harvestReward: 4,
                preferredSeason: "spring",  // Radishes are quick spring crops
                description: "A fast-growing root vegetable good for early spring."
            },
            potato: {
                name: "Potato",
                growthRate: 0.85,
                waterNeed: 0.95,
                icons: ['🌰','🌱', '🌿', '🌱', '🥔'],
                deadIcon: '🥀',
                harvestReward: 8,
                preferredSeason: "fall",    // Potatoes store well for fall harvest
                description: "A starchy tuber that grows underground."
            }
        };
        
        const plantData = plantTypes[type] || plantTypes.tomato;
        this.name = plantData.name;
        this.growthRate = plantData.growthRate;
        this.waterNeed = plantData.waterNeed;
        this.icons = plantData.icons;
        this.deadIcon = plantData.deadIcon;
        this.harvestReward = plantData.harvestReward;
        this.preferredSeason = plantData.preferredSeason;
        this.description = plantData.description;
    }
    
    // Get current visual representation
    getIcon() {
        if (this.isDead) {
            return this.deadIcon;
        }
        
        // Return appropriate icon based on growth stage
        return this.icons[this.growthStage];
    }
    
    // Update the grow method to consider seasonal effects
    grow(soilMoisture, environmentModifier, currentSeason) {
        // Handle plant death
        if (soilMoisture === 0) {
            this.dryDays++;
            
            if (this.dryDays >= 2) {
                this.isDead = true;
                console.log(`Plant has died from drought!`);
                return;
            }
            
            // No growth without water
            console.log(`No growth: soil moisture is 0`);
            return;
        } else {
            // Reset dry days counter if watered
            this.dryDays = 0;
        }
        
        // Don't grow if dead
        if (this.isDead) {
            console.log(`No growth: plant is dead`);
            return;
        }
        
        // Already at max growth stage
        if (this.growthStage >= 4) {
            console.log(`No growth: plant is already at max growth stage`);
            return;
        }
        
        // Calculate growth amount - constant base rate as long as there's moisture
        let growthAmount = 15; // Base growth rate
        
        // Apply seasonal modifier if provided
        if (currentSeason) {
            // Plants grow 50% faster in their preferred season
            if (currentSeason === this.preferredSeason) {
                growthAmount *= 1.5;
                console.log(`${this.name} is growing faster in its preferred ${currentSeason} season!`);
            }
            // Plants grow 25% slower in the opposite season
            else {
                const oppositeSeasons = {
                    "spring": "fall",
                    "summer": "winter",
                    "fall": "spring",
                    "winter": "summer"
                };
                if (oppositeSeasons[this.preferredSeason] === currentSeason) {
                    growthAmount *= 0.75;
                    console.log(`${this.name} is growing slower in the opposing ${currentSeason} season.`);
                }
            }
        }
        
        // Environmental modifier still affects growth
        growthAmount *= environmentModifier;
        
        // Apply plant's growth rate
        growthAmount *= this.growthRate;
        
        // Log growth amount for debugging
        console.log(`Plant growth: +${growthAmount.toFixed(1)}%, Current: ${this.growthProgress.toFixed(1)}%, Stage: ${this.growthStage}`);
        
        // Apply growth progress
        this.growthProgress += growthAmount;
        
        // Move to next stage if ready
        if (this.growthProgress >= 100) {
            this.growthStage += 1;
            this.growthProgress = 0;
            console.log(`Plant advanced to growth stage ${this.growthStage}`);
        }
    }
    
    // Check if plant is ready to harvest
    isHarvestable() {
        return this.growthStage === 4;
    }
}
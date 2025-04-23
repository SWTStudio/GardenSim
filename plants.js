class Plant {
    constructor(type) {
        this.type = type;
        this.growthStage = 0; // 0=germinating, 1=seedling, 2=growing, 3=mature, 4=harvestable
        this.growthProgress = 0; // Progress toward next stage (0-100%)
        this.isDead = false;
        this.dryDays = 0; // Count of consecutive days without water
        this.harvestCount = 0; // Track how many times this plant has been harvested
        this.isGerminating = true; // Track if seed is still trying to germinate
        
        // Expanded plant types with more realistic growth patterns
        const plantTypes = {
            tomato: {
                name: "Tomato",
                growthRate: 1.0,
                waterNeed: 1.2,
                icons: ['🌰', '🌱', '🌿', '🍅', '🍅'],
                deadIcon: '🥀',
                harvestReward: 10,
                preferredSeason: "summer",  // Tomatoes love summer heat
                description: "A juicy red fruit that grows well in summer.",
                isPerennial: false,         // Annual plant
                continuousHarvest: true,    // Can be harvested multiple times
                maxHarvests: 5,             // How many harvests before plant is spent
                minGerminationTemp: 60,     // Minimum soil temperature to germinate
                productionSeasons: ["summer", "fall"] // When it produces harvestable fruit
            },
            carrot: {
                name: "Carrot",
                growthRate: 0.8,
                waterNeed: 0.9,
                icons: ['🌰','🌱', '🌿', '🥕', '🥕'],
                deadIcon: '🥀',
                harvestReward: 5,
                preferredSeason: "spring",  // Carrots prefer cool spring weather
                description: "A root vegetable that grows well in spring.",
                isPerennial: false,         // Annual plant
                continuousHarvest: false,   // One-time harvest
                maxHarvests: 1,             // Only one harvest
                minGerminationTemp: 45,     // Can germinate in cooler temperatures
                productionSeasons: ["spring", "fall"] // When it produces harvestable crops
            },
            corn: {
                name: "Corn",
                growthRate: 1.2,
                waterNeed: 1.5,
                icons: ['🌰','🌱', '🌿', '🌽', '🌽'],
                deadIcon: '🥀',
                harvestReward: 15,
                preferredSeason: "summer",  // Corn needs summer heat
                description: "A tall grain that grows best in hot summer weather.",
                isPerennial: false,         // Annual plant
                continuousHarvest: false,   // One-time harvest
                maxHarvests: 1,             // Only one harvest
                minGerminationTemp: 55,     // Needs moderate warmth to germinate
                productionSeasons: ["summer"] // When it produces harvestable crops
            },
            lettuce: {
                name: "Lettuce",
                growthRate: 0.7,
                waterNeed: 1.1,
                icons: ['🌰','🌱', '🌿', '🥬', '🥬'],
                deadIcon: '🥀',
                harvestReward: 6,
                preferredSeason: "spring",  // Lettuce bolts in heat, prefers spring
                description: "A leafy vegetable that prefers cool weather.",
                isPerennial: false,         // Annual plant
                continuousHarvest: false,   // One-time harvest
                maxHarvests: 1,             // Only one harvest
                minGerminationTemp: 40,     // Can germinate in cool temps
                productionSeasons: ["spring", "fall"] // When it produces harvestable crops
            },
            pumpkin: {
                name: "Pumpkin",
                growthRate: 0.9,
                waterNeed: 1.3,
                icons: ['🌰','🌱', '🌿', '🎃', '🎃'],
                deadIcon: '🥀',
                harvestReward: 20,
                preferredSeason: "fall",    // Pumpkins are harvested in fall
                description: "A large orange gourd that matures in the fall.",
                isPerennial: false,         // Annual plant
                continuousHarvest: false,   // One-time harvest
                maxHarvests: 1,             // Only one harvest
                minGerminationTemp: 70,     // Needs warm soil
                productionSeasons: ["fall"] // When it produces harvestable crops
            },
            sunflower: {
                name: "Sunflower",
                growthRate: 1.1,
                waterNeed: 1.0,
                icons: ['🌰','🌱', '🌿', '🌻', '🌻'],
                deadIcon: '🥀',
                harvestReward: 12,
                preferredSeason: "summer",  // Sunflowers love sunny summer days
                description: "A tall flower that follows the sun as it grows.",
                isPerennial: false,         // Annual plant
                continuousHarvest: false,   // One-time harvest
                maxHarvests: 1,             // Only one harvest
                minGerminationTemp: 50,     // Moderate germination temperature
                productionSeasons: ["summer"] // When it produces harvestable flowers
            },
            strawberry: {
                name: "Strawberry",
                growthRate: 0.9,
                waterNeed: 1.0,
                icons: ['🌰','🌱', '🌿', '🍓', '🍓'],
                deadIcon: '🥀',
                harvestReward: 8,
                preferredSeason: "spring",  // Strawberries produce in spring
                description: "A sweet red berry that returns year after year.",
                isPerennial: true,          // Perennial plant
                continuousHarvest: true,    // Can be harvested multiple times
                maxHarvests: 3,             // Per season
                minGerminationTemp: 50,     // Moderate germination temperature
                productionSeasons: ["spring", "summer"] // When it produces berries
            },
            asparagus: {
                name: "Asparagus",
                growthRate: 0.7,
                waterNeed: 0.8,
                icons: ['🌰','🌱', '🌿', '🫑', '🫑'], // No asparagus emoji, using pepper
                deadIcon: '🥀',
                harvestReward: 15,
                preferredSeason: "spring",  // Asparagus produces in spring
                description: "A perennial vegetable that returns for many years.",
                isPerennial: true,          // Perennial plant
                continuousHarvest: true,    // Can be harvested multiple times
                maxHarvests: 4,             // Per season
                minGerminationTemp: 50,     // Moderate germination temperature
                productionSeasons: ["spring"] // Only produces in spring
            },
            potato: {
                name: "Potato",
                growthRate: 0.85,
                waterNeed: 0.95,
                icons: ['🌰','🌱', '🌿', '🥔', '🥔'],
                deadIcon: '🥀',
                harvestReward: 8,
                preferredSeason: "fall",    // Potatoes store well for fall harvest
                description: "A starchy tuber that grows underground.",
                isPerennial: false,         // Annual plant
                continuousHarvest: false,   // One-time harvest
                maxHarvests: 1,             // Only one harvest
                minGerminationTemp: 45,     // Can grow in moderately cool soil
                productionSeasons: ["summer", "fall"] // When it produces harvestable crops
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
        
        // New properties for realistic growth patterns
        this.isPerennial = plantData.isPerennial;
        this.continuousHarvest = plantData.continuousHarvest;
        this.maxHarvests = plantData.maxHarvests;
        this.minGerminationTemp = plantData.minGerminationTemp;
        this.productionSeasons = plantData.productionSeasons;
        
        // Initialize dormant state for perennials (depends on current season)
        this.isDormant = this.isPerennial ? !this.productionSeasons.includes(environment.season) : false;
    }
    
    // Get current visual representation
    getIcon() {
        if (this.isDead) {
            return this.deadIcon;
        }
        
        if (this.isDormant) {
            return this.icons[2]; // Show as a growing plant when dormant
        }
        
        // Return appropriate icon based on growth stage
        return this.icons[this.growthStage];
    }
    
    // Handle perennial plant season transitions
    checkSeasonTransition(currentSeason) {
        if (!this.isPerennial) return; // Only applies to perennials
        
        const wasInProductionSeason = !this.isDormant;
        const isInProductionSeason = this.productionSeasons.includes(currentSeason);
        
        // Entering dormancy
        if (wasInProductionSeason && !isInProductionSeason) {
            this.isDormant = true;
            this.growthStage = Math.min(this.growthStage, 2); // Return to vegetative stage
            this.growthProgress = 0;
            this.harvestCount = 0; // Reset harvest count for next season
            console.log(`${this.name} has gone dormant for the ${currentSeason} season.`);
        }
        // Coming out of dormancy
        else if (!wasInProductionSeason && isInProductionSeason) {
            this.isDormant = false;
            console.log(`${this.name} has come out of dormancy for the ${currentSeason} season.`);
        }
    }
    
    // Updated grow method to consider temperature requirements and plant lifecycle
    grow(soilMoisture, environmentModifier, currentSeason, soilTemperature) {
        // Check for seasonal transitions for perennials
        this.checkSeasonTransition(currentSeason);
        
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
        
        // Don't grow if dormant
        if (this.isDormant) {
            console.log(`No growth: plant is dormant`);
            return;
        }
        
        // Handle germination temperature requirement
        if (this.isGerminating && this.growthStage === 0) {
            if (soilTemperature < this.minGerminationTemp) {
                console.log(`Too cold to germinate. Current: ${soilTemperature}°F, Needed: ${this.minGerminationTemp}°F`);
                return; // Too cold to germinate
            } else {
                // If we reach here, we're germinating
                this.isGerminating = false;
            }
        }
        
        // Already at max growth stage and not a continuous harvest plant
        if (this.growthStage >= 4 && !this.continuousHarvest) {
            console.log(`No growth: plant is already at max growth stage`);
            return;
        }
        
        // If we're at harvestable stage and have reached max harvests, don't grow further
        if (this.growthStage >= 3 && this.harvestCount >= this.maxHarvests) {
            console.log(`No growth: plant has reached maximum harvests`);
            return;
        }
        
        // Calculate growth amount - constant base rate as long as there's moisture
        let growthAmount = 15; // Base growth rate
        
        // Apply seasonal modifier
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
            
            // Check if this is a production season
            if (!this.productionSeasons.includes(currentSeason)) {
                // If not in production season, slow growth even more
                growthAmount *= 0.5;
                console.log(`${this.name} is growing slowly as it's not in a production season.`);
            }
        }
        
        // Environmental modifier still affects growth
        growthAmount *= environmentModifier;
        
        // Apply plant's growth rate
        growthAmount *= this.growthRate;
        
        // Apply temperature scaling for growth (beyond just germination)
        if (soilTemperature < this.minGerminationTemp + 5) {
            growthAmount *= 0.5; // Significantly reduced growth at low temperatures
        } else if (soilTemperature > 95) {
            growthAmount *= 0.7; // Reduced growth at very high temperatures
        }
        
        // Log growth amount for debugging
        console.log(`Plant growth: +${growthAmount.toFixed(1)}%, Current: ${this.growthProgress.toFixed(1)}%, Stage: ${this.growthStage}`);
        
        // Apply growth progress
        this.growthProgress += growthAmount;
        
        // Move to next stage if ready
        if (this.growthProgress >= 100) {
            // If we're already at max stage and continuous harvest, reset progress but don't advance stage
            if (this.growthStage >= 3 && this.continuousHarvest) {
                this.growthProgress = 0;
                this.growthStage = 4; // Ensure it's at harvestable stage
                console.log(`${this.name} is ready for another harvest!`);
            } else {
                // Normal stage advancement
                this.growthStage += 1;
                this.growthProgress = 0;
                console.log(`Plant advanced to growth stage ${this.growthStage}`);
            }
        }
    }
    
    // Check if plant is ready to harvest
    isHarvestable() {
        return this.growthStage === 4 && !this.isDormant;
    }
    
    // Handle harvest - now returns whether plant should be removed
    harvest() {
        if (!this.isHarvestable()) {
            return false; // Cannot harvest
        }
        
        this.harvestCount++;
        
        // If continuous harvest and under max harvests, keep the plant but reset growth progress
        if (this.continuousHarvest && this.harvestCount < this.maxHarvests) {
            this.growthProgress = 30; // Start at 30% progress toward next harvest
            console.log(`Harvested ${this.name}. Ready for another harvest soon.`);
            return false; // Don't remove plant
        }
        
        // If perennial plant that's done for the season, make it dormant instead of removing
        if (this.isPerennial && this.harvestCount >= this.maxHarvests) {
            this.growthStage = 2; // Back to growing stage
            this.growthProgress = 0;
            this.harvestCount = 0;
            console.log(`Harvested ${this.name}. Plant is now exhausted for this season.`);
            return false; // Don't remove plant
        }
        
        // For one-time harvest plants and spent continuous harvesters
        console.log(`Harvested ${this.name}. Plant removed.`);
        return true; // Remove plant
    }
    
    // Check if this plant should die due to cold temperatures
    checkTemperatureSurvival(temperature) {
        // Perennials survive cold weather
        if (this.isPerennial) return true;
        
        // Temperature thresholds for each plant type vary, but let's use a simple approach:
        // Most annuals die at freezing temperatures
        if (temperature <= 32) {
            this.isDead = true;
            console.log(`${this.name} has died due to freezing temperatures!`);
            return false;
        }
        
        // Some plants die in cold but above freezing
        if (temperature <= 40 && ["tomato", "corn", "pumpkin"].includes(this.type)) {
            this.isDead = true;
            console.log(`${this.name} has died due to cold temperatures!`);
            return false;
        }
        
        return true;
    }
}
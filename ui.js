// User interface and rendering
class UI {
    constructor(garden, environment) {
        this.garden = garden;
        this.environment = environment;
        this.currentTool = null;
        this.selectedSeedType = 'tomato';
        this.setupSeedSelection();
        
        // Set up event listeners when UI is initialized
        this.setupEventListeners();
        
        // Initial render
        this.renderGarden();
        this.updateGameInfo();
    }
    
    // Set up event listeners for user interaction
    setupEventListeners() {
        // Tool selection
        document.getElementById('water-tool').addEventListener('click', () => this.setActiveTool('water'));
        document.getElementById('seed-tool').addEventListener('click', () => this.setActiveTool('seed'));
        document.getElementById('clear-tool').addEventListener('click', () => this.setActiveTool('clear'));
        document.getElementById('harvest-tool').addEventListener('click', () => this.setActiveTool('harvest'));
        
        // Garden cell interaction
        document.getElementById('garden-container').addEventListener('click', (event) => {
            const cellElement = event.target.closest('.garden-cell');
            if (cellElement && this.currentTool) {
                const x = parseInt(cellElement.dataset.x);
                const y = parseInt(cellElement.dataset.y);
                this.handleCellAction(x, y);
            }
        });
        
        // Next day button
        document.getElementById('next-day-btn').addEventListener('click', () => this.advanceDay());
    }
    setupSeedSelection() {
        const toolsDiv = document.querySelector('.tools');
        
        // Create seed selection container
        const seedSelectionContainer = document.createElement('div');
        seedSelectionContainer.id = 'seed-selection-container';
        seedSelectionContainer.style.display = 'none'; // Initially hidden
        seedSelectionContainer.style.marginTop = '10px';
        seedSelectionContainer.style.padding = '10px';
        seedSelectionContainer.style.backgroundColor = '#f5f5f5';
        seedSelectionContainer.style.borderRadius = '4px';
        seedSelectionContainer.style.border = '1px solid #ddd';
        
        // Add title
        const title = document.createElement('h3');
        title.textContent = 'Select a seed to plant:';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';
        seedSelectionContainer.appendChild(title);
        
        // Create seed buttons container
        const seedButtonsContainer = document.createElement('div');
        seedButtonsContainer.style.display = 'flex';
        seedButtonsContainer.style.flexWrap = 'wrap';
        seedButtonsContainer.style.gap = '8px';
        
        // Add seed type buttons
        const seedTypes = [
            { type: 'tomato', icon: '🍅', name: 'Tomato', season: 'Summer' },
            { type: 'carrot', icon: '🥕', name: 'Carrot', season: 'Spring' },
            { type: 'corn', icon: '🌽', name: 'Corn', season: 'Summer' },
            { type: 'lettuce', icon: '🥬', name: 'Lettuce', season: 'Spring' },
            { type: 'pumpkin', icon: '🎃', name: 'Pumpkin', season: 'Fall' },
            { type: 'sunflower', icon: '🌻', name: 'Sunflower', season: 'Summer' },
            { type: 'radish', icon: '🥗', name: 'Radish', season: 'Spring' },
            { type: 'potato', icon: '🥔', name: 'Potato', season: 'Fall' }
        ];
        
        seedTypes.forEach(seed => {
            const button = document.createElement('button');
            button.className = 'seed-button';
            button.dataset.seedType = seed.type;
            
            const buttonContent = document.createElement('div');
            buttonContent.style.display = 'flex';
            buttonContent.style.flexDirection = 'column';
            buttonContent.style.alignItems = 'center';
            
            const icon = document.createElement('span');
            icon.textContent = seed.icon;
            icon.style.fontSize = '24px';
            
            const name = document.createElement('span');
            name.textContent = seed.name;
            name.style.fontSize = '12px';
            
            const season = document.createElement('span');
            season.textContent = seed.season;
            season.style.fontSize = '10px';
            season.style.color = '#666';
            
            buttonContent.appendChild(icon);
            buttonContent.appendChild(name);
            buttonContent.appendChild(season);
            
            button.appendChild(buttonContent);
            seedButtonsContainer.appendChild(button);
            
            // Add click event to select this seed
            button.addEventListener('click', () => {
                // Remove active class from all seed buttons
                document.querySelectorAll('.seed-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to this button
                button.classList.add('active');
                
                // Store selected seed type
                this.selectedSeedType = seed.type;
                
                console.log(`Selected seed type: ${this.selectedSeedType}`);
            });
        });
        
        seedSelectionContainer.appendChild(seedButtonsContainer);
        toolsDiv.after(seedSelectionContainer);
        
        // Initialize the first seed as selected
        this.selectedSeedType = seedTypes[0].type;
        
        // Show/hide seed selection when Seed Packet tool is clicked
        document.getElementById('seed-tool').addEventListener('click', () => {
            seedSelectionContainer.style.display = 'block';
            // Activate the first seed button if none are active
            if (!document.querySelector('.seed-button.active')) {
                document.querySelector('.seed-button').classList.add('active');
            }
        });
        
        // Hide seed selection when other tools are selected
        ['water-tool', 'clear-tool', 'harvest-tool'].forEach(toolId => {
            document.getElementById(toolId).addEventListener('click', () => {
                seedSelectionContainer.style.display = 'none';
            });
        });
    }
    
    // Handle tool actions on cells
    handleCellAction(x, y) {
        if (this.currentTool === 'water') {
            this.garden.waterPlot(x, y);
        } else if (this.currentTool === 'seed') {
            // Use the selected seed type
            this.garden.plantSeed(x, y, this.selectedSeedType);
        } else if (this.currentTool === 'harvest') {
            this.garden.harvestPlant(x, y);
        } else if (this.currentTool === 'clear') {
            this.garden.clearPlot(x, y);
        }
        
        this.renderGarden();
    }
    
    // Set the active tool
    setActiveTool(tool) {
        this.currentTool = tool;
        
        // Update UI to show which tool is selected
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`${tool}-tool`).classList.add('active');
    }
    
    // Render the garden grid
    renderGarden() {
        const container = document.getElementById('garden-container');
        container.innerHTML = ''; // Clear existing cells
        
        for (let y = 0; y < this.garden.height; y++) {
            for (let x = 0; x < this.garden.width; x++) {
                const cell = this.garden.getCell(x, y);
                const cellElement = document.createElement('div');
                cellElement.className = 'garden-cell';
                cellElement.dataset.x = x;
                cellElement.dataset.y = y;
                
                // Visual indication of soil moisture
                const moisturePercent = cell.soilMoisture;
                if (moisturePercent >= 75) {
                    cellElement.style.backgroundColor = '#3E2723'; // Very wet (darkest)
                } else if (moisturePercent >= 50) {
                    cellElement.style.backgroundColor = '#4E342E'; // Wet
                } else if (moisturePercent >= 25) {
                    cellElement.style.backgroundColor = '#5D4037'; // Moist
                } else {
                    cellElement.style.backgroundColor = '#8B4513'; // Dry (lightest)
                }
                
                // Add moisture percentage indicator
                const moistureIndicator = document.createElement('div');
                moistureIndicator.className = 'moisture-indicator';
                moistureIndicator.textContent = `${cell.soilMoisture}%`;
                cellElement.appendChild(moistureIndicator);
                
                // Show plant if present
                if (cell.plant) {
                    // Create plant icon element
                    const plantIcon = document.createElement('div');
                    plantIcon.className = 'plant-icon';
                    
                    // Get appropriate icon using the plant's getIcon method
                    plantIcon.textContent = cell.plant.getIcon();
                    cellElement.appendChild(plantIcon);
                    
                    // Add growth progress indicator
                    const progressIndicator = document.createElement('div');
                    progressIndicator.style.position = 'absolute';
                    progressIndicator.style.bottom = '2px';
                    progressIndicator.style.left = '2px';
                    progressIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    progressIndicator.style.padding = '2px 4px';
                    progressIndicator.style.borderRadius = '3px';
                    progressIndicator.style.fontSize = '10px';
                    progressIndicator.style.fontWeight = 'bold';
                    progressIndicator.style.zIndex = '10';
                    
                    if (cell.plant.isDead) {
                        progressIndicator.textContent = 'DEAD';
                        progressIndicator.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                    } else {
                        progressIndicator.textContent = `${Math.floor(cell.plant.growthProgress)}%`;
                    }
                    
                    cellElement.appendChild(progressIndicator);
                    
                    // Debug log
                    console.log(`Cell (${x},${y}): Plant=${cell.plant.type}, Stage=${cell.plant.growthStage}, Progress=${cell.plant.growthProgress}%`);
                }
                
                container.appendChild(cellElement);
            }
        }
    }

    // Update game information display
    updateGameInfo() {
        document.getElementById('day-counter').textContent = this.environment.day;
        document.getElementById('temperature').textContent = `${this.environment.temperature}°F`;
        document.getElementById('sunlight').textContent = this.environment.sunlight.charAt(0).toUpperCase() + this.environment.sunlight.slice(1);
        
        // Add season and weather information
        const seasonElement = document.getElementById('season') || this.createSeasonElement();
        seasonElement.textContent = this.environment.season.charAt(0).toUpperCase() + this.environment.season.slice(1);
        
        const weatherElement = document.getElementById('weather') || this.createWeatherElement();
        weatherElement.textContent = this.environment.weatherConditions;
        
        // Visual cue for rainfall
        if (this.environment.rainfall > 0) {
            weatherElement.textContent += ` (${this.environment.rainfall}% rainfall)`;
            weatherElement.style.color = 'blue';
        } else {
            weatherElement.style.color = 'black';
        }
    }
    
    // Create season display element
    createSeasonElement() {
        const gameInfoDiv = document.querySelector('.game-info p');
        gameInfoDiv.innerHTML += ' | Season: <span id="season">Spring</span>';
        return document.getElementById('season');
    }
    
    // Create weather display element
    createWeatherElement() {
        const gameInfoDiv = document.querySelector('.game-info p');
        gameInfoDiv.innerHTML += ' | Weather: <span id="weather">Clear</span>';
        return document.getElementById('weather');
    }
    
    // Update the advanceDay method in UI class
    advanceDay() {
        const moistureReduction = this.environment.advanceDay();
        const environmentModifier = this.environment.getGrowthModifier();
        const currentSeason = this.environment.season;
        const rainfallAmount = this.environment.getRainfallMoisture();
        
        this.garden.advanceDay(moistureReduction, environmentModifier, currentSeason, rainfallAmount);
        
        this.renderGarden();
        this.updateGameInfo();
    }
}

// Initialize UI when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const ui = new UI(garden, environment);
    // Make UI globally accessible (helpful for debugging)
    window.ui = ui;
});
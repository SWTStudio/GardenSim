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
        
        // Add seed type buttons with more detailed information
        const seedTypes = [
            { type: 'tomato', icon: '🍅', name: 'Tomato', season: 'Summer', lifecycle: 'Annual, Multiple Harvests' },
            { type: 'carrot', icon: '🥕', name: 'Carrot', season: 'Spring', lifecycle: 'Annual, Single Harvest' },
            { type: 'corn', icon: '🌽', name: 'Corn', season: 'Summer', lifecycle: 'Annual, Single Harvest' },
            { type: 'lettuce', icon: '🥬', name: 'Lettuce', season: 'Spring', lifecycle: 'Annual, Single Harvest' },
            { type: 'pumpkin', icon: '🎃', name: 'Pumpkin', season: 'Fall', lifecycle: 'Annual, Single Harvest' },
            { type: 'sunflower', icon: '🌻', name: 'Sunflower', season: 'Summer', lifecycle: 'Annual, Single Harvest' },
            { type: 'strawberry', icon: '🍓', name: 'Strawberry', season: 'Spring', lifecycle: 'Perennial, Multiple Harvests' },
            { type: 'asparagus', icon: '🫑', name: 'Asparagus', season: 'Spring', lifecycle: 'Perennial, Multiple Harvests' },
            { type: 'potato', icon: '🥔', name: 'Potato', season: 'Fall', lifecycle: 'Annual, Single Harvest' }
        ];
        
        seedTypes.forEach(seed => {
            const button = document.createElement('div');
            button.className = 'seed-button';
            button.dataset.seedType = seed.type;
            button.dataset.season = seed.season;
            
            const icon = document.createElement('div');
            icon.className = 'icon';
            icon.textContent = seed.icon;
            
            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = seed.name;
            
            const season = document.createElement('div');
            season.className = 'season';
            season.textContent = seed.season;
            
            const lifecycle = document.createElement('div');
            lifecycle.className = 'lifecycle';
            lifecycle.textContent = seed.lifecycle;
            lifecycle.style.fontSize = '9px';
            lifecycle.style.color = '#666';
            lifecycle.style.marginTop = '2px';
            
            button.appendChild(icon);
            button.appendChild(name);
            button.appendChild(season);
            button.appendChild(lifecycle);
            
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
        document.querySelector('.seed-button').classList.add('active');
        
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
    
    // Render the garden grid with improved plant status display
    renderGarden() {
        const container = document.getElementById('garden-container');
        container.innerHTML = ''; // Clear existing cells
        
        for (let y = 0; y < this.garden.height; y++) {
            for (let x = 0; x < this.garden.width; x++) {
                const cell = this.getCell(x, y);
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
                
                // Add moisture indicator (no longer showing temperature per cell)
                const moistureIndicator = document.createElement('div');
                moistureIndicator.className = 'moisture-indicator';
                moistureIndicator.textContent = `💧 ${cell.soilMoisture}%`;
                moistureIndicator.style.position = 'absolute';
                moistureIndicator.style.top = '2px';
                moistureIndicator.style.right = '2px';
                moistureIndicator.style.backgroundColor = 'rgba(0, 120, 255, 0.7)';
                moistureIndicator.style.color = 'white';
                moistureIndicator.style.padding = '2px 4px';
                moistureIndicator.style.borderRadius = '3px';
                moistureIndicator.style.fontSize = '10px';
                moistureIndicator.style.fontWeight = 'bold';
                cellElement.appendChild(moistureIndicator);
                
                // Show plant if present
                if (cell.plant) {
                    // Create plant icon element
                    const plantIcon = document.createElement('div');
                    plantIcon.className = 'plant-icon';
                    
                    // Get appropriate icon using the plant's getIcon method
                    plantIcon.textContent = cell.plant.getIcon();
                    cellElement.appendChild(plantIcon);
                    
                    // Add plant status indicator
                    const statusIndicator = document.createElement('div');
                    statusIndicator.style.position = 'absolute';
                    statusIndicator.style.bottom = '2px';
                    statusIndicator.style.left = '2px';
                    statusIndicator.style.padding = '2px 4px';
                    statusIndicator.style.borderRadius = '3px';
                    statusIndicator.style.fontSize = '10px';
                    statusIndicator.style.fontWeight = 'bold';
                    statusIndicator.style.zIndex = '10';
                    
                    if (cell.plant.isDead) {
                        statusIndicator.textContent = 'DEAD';
                        statusIndicator.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                        statusIndicator.style.color = 'white';
                    } else if (cell.plant.isDormant) {
                        statusIndicator.textContent = 'DORMANT';
                        statusIndicator.style.backgroundColor = 'rgba(150, 150, 150, 0.8)';
                        statusIndicator.style.color = 'white';
                    } else if (cell.plant.isHarvestable()) {
                        statusIndicator.textContent = 'HARVEST!';
                        statusIndicator.style.backgroundColor = 'rgba(50, 200, 50, 0.8)';
                        statusIndicator.style.color = 'white';
                    } else {
                        // Show growth percentage, no TOO COLD message
                        statusIndicator.textContent = `${Math.floor(cell.plant.growthProgress)}%`;
                        statusIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                        statusIndicator.style.color = 'black';
                    }
                    
                    cellElement.appendChild(statusIndicator);
                    
                    // Add plant type label
                    const plantLabel = document.createElement('div');
                    plantLabel.style.position = 'absolute';
                    plantLabel.style.bottom = '2px';
                    plantLabel.style.right = '2px';
                    plantLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    plantLabel.style.color = 'white';
                    plantLabel.style.padding = '2px 4px';
                    plantLabel.style.borderRadius = '3px';
                    plantLabel.style.fontSize = '10px';
                    plantLabel.textContent = cell.plant.name;
                    
                    cellElement.appendChild(plantLabel);
                }
                
                container.appendChild(cellElement);
            }
        }
    }

    // Helper function to get a cell from the garden
    getCell(x, y) {
        return this.garden.getCell(x, y);
    }

    // Update game information display with high/low temperature
    updateGameInfo() {
        document.getElementById('day-counter').textContent = this.environment.day;
        
        // Update temperature (now showing high/low)
        const tempElement = document.getElementById('temperature');
        tempElement.textContent = `${this.environment.temperature}°F`;
        
        // Create high/low temperature element if needed
        const tempRangeElement = document.getElementById('temp-range') || this.createTempRangeElement();
        tempRangeElement.textContent = `${this.environment.lowTemp}°F - ${this.environment.highTemp}°F`;
        
        document.getElementById('sunlight').textContent = this.environment.sunlight.charAt(0).toUpperCase() + this.environment.sunlight.slice(1);
        
        // Add season and weather information
        const seasonElement = document.getElementById('season') || this.createSeasonElement();
        seasonElement.textContent = this.environment.season.charAt(0).toUpperCase() + this.environment.season.slice(1);
        
        const weatherElement = document.getElementById('weather') || this.createWeatherElement();
        weatherElement.textContent = this.environment.weatherConditions.charAt(0).toUpperCase() + this.environment.weatherConditions.slice(1);
        
        // Visual cue for rainfall
        if (this.environment.rainfall > 0) {
            weatherElement.textContent += ` (${this.environment.rainfall}% rainfall)`;
            weatherElement.style.color = 'blue';
        } else {
            weatherElement.style.color = 'black';
        }
        
        // Get average soil temperature from the garden
        const avgSoilTemp = this.getAverageSoilTemperature();
        
        // Add soil temperature to game info
        const soilTempElement = document.getElementById('soil-temp') || this.createSoilTempElement();
        soilTempElement.textContent = `${avgSoilTemp}°F`;
        
        // Color-code soil temperature
        if (avgSoilTemp <= 32) {
            soilTempElement.style.color = '#0066ff'; // Cold/freezing
        } else if (avgSoilTemp <= 50) {
            soilTempElement.style.color = '#3399ff'; // Cool
        } else if (avgSoilTemp <= 75) {
            soilTempElement.style.color = '#009900'; // Moderate
        } else {
            soilTempElement.style.color = '#ff6600'; // Hot
        }
        
        // Add frost warning if applicable
        if (this.environment.frostWarning) {
            const warningElement = document.getElementById('frost-warning') || this.createFrostWarningElement();
            warningElement.style.display = 'inline';
        } else if (document.getElementById('frost-warning')) {
            document.getElementById('frost-warning').style.display = 'none';
        }
    }
    
    // Get average soil temperature across all cells
    getAverageSoilTemperature() {
        let totalTemp = 0;
        let cellCount = 0;
        
        for (let y = 0; y < this.garden.height; y++) {
            for (let x = 0; x < this.garden.width; x++) {
                const cell = this.getCell(x, y);
                totalTemp += cell.soilTemperature;
                cellCount++;
            }
        }
        
        return Math.round(totalTemp / cellCount);
    }
    
    // Create temperature range element (high/low)
    createTempRangeElement() {
        const tempElement = document.getElementById('temperature');
        const tempRangeSpan = document.createElement('span');
        tempRangeSpan.id = 'temp-range';
        tempRangeSpan.textContent = '65°F - 80°F';
        tempRangeSpan.style.fontSize = '12px';
        tempRangeSpan.style.color = '#666';
        tempRangeSpan.style.marginLeft = '5px';
        
        tempElement.parentNode.insertBefore(tempRangeSpan, tempElement.nextSibling);
        
        return tempRangeSpan;
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
    
    // Create soil temperature display element
    createSoilTempElement() {
        const gameInfoDiv = document.querySelector('.game-info p');
        gameInfoDiv.innerHTML += ' | Soil Temp: <span id="soil-temp">65</span>';
        return document.getElementById('soil-temp');
    }
    
    // Create frost warning element
    createFrostWarningElement() {
        const gameInfoDiv = document.querySelector('.game-info p');
        gameInfoDiv.innerHTML += ' | <span id="frost-warning" style="color: red; font-weight: bold; display: none;">⚠️ FROST WARNING!</span>';
        return document.getElementById('frost-warning');
    }
    
    // Update the advanceDay method in UI class
    advanceDay() {
        const moistureReduction = this.environment.advanceDay();
        const environmentModifier = this.environment.getGrowthModifier();
        const currentSeason = this.environment.season;
        const rainfallAmount = this.environment.getRainfallMoisture();
        const airTemperature = this.environment.getAirTemperature();
        
        // Pass air temperature to the garden update
        this.garden.advanceDay(moistureReduction, environmentModifier, currentSeason, rainfallAmount, airTemperature);
        
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
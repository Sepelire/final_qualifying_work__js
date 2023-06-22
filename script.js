window.addEventListener('DOMContentLoaded', () => {
    const forest = document.getElementById('forest');
    const pineCount = 1000;
    const pineCrownMinSize = 5;
    const pineCrownMaxSize = 15;
    const rottenWidthMinSize = 1.5;
    const rottenWidthMaxSize = 4.5;
    const pineMinSpacing = 1;
    const pineMaxSpacing = 3;
    const gridSize = 10;
    const pineData = [];
    const rottenPineCount = pineCount - (pineCount * (97 / 100));

    const forestWidth = 500;
    const forestHeight = 500;
    const gridCellSize = Math.max(pineCrownMaxSize, pineMaxSpacing) * 2;

    const gridWidth = Math.ceil(forestWidth / gridCellSize);
    const gridHeight = Math.ceil(forestHeight / gridCellSize);

    const grid = createGrid(gridWidth, gridHeight);

    for (let i = 0; i < pineCount; i++) {
        const pineCrownSize = getRandomFloat(pineCrownMinSize, pineCrownMaxSize, 2);
        const pineSpacing = getRandomInt(pineMinSpacing, pineMaxSpacing);
        let x, y;
        let overlapping = false;

        let isRottenPine = i >= pineCount - rottenPineCount;

        let attempts = 0;
        let maxAttempts = 100;
        
        do {
            // Генерировать координаты дерева только один раз
            const gridX = getRandomInt(0, gridWidth - 1);
            const gridY = getRandomInt(0, gridHeight - 1);
            const offsetX = getRandomInt(-gridCellSize / 2, gridCellSize / 2);
            const offsetY = getRandomInt(-gridCellSize / 2, gridCellSize / 2);
            x = gridX * gridCellSize + gridCellSize / 2 + offsetX;
            y = gridY * gridCellSize + gridCellSize / 2 + offsetY;
        
            const minX = pineCrownSize / 2;
            const maxX = forestWidth - pineCrownSize / 2;
            const minY = pineCrownSize / 2;
            const maxY = forestHeight - pineCrownSize / 2;
        
            x = Math.min(maxX, Math.max(minX, x));
            y = Math.min(maxY, Math.max(minY, y));

            // Проверка пересечения с другими деревьями
            overlapping = checkOverlap(x, y, pineCrownSize, pineSpacing, gridCellSize, gridWidth, gridHeight, grid);
        
            attempts++;
        
            if (attempts > maxAttempts) {
                break;
            }
        } while (overlapping);
        
        // Если количество попыток превысило предел, пропустить это дерево и перейти к следующему
        if (attempts > maxAttempts) {
            continue;
        }        

        if (isRottenPine) {
            const x = getRandomInt(0, forestWidth);
            const y = getRandomInt(0, forestHeight);

            const trunkWidth = (getRandomFloat(rottenWidthMinSize, rottenWidthMaxSize, 2)).toFixed(2); // Ширина ствола для гнилого дерева
            const trunkHeight = (trunkWidth * 10).toFixed(2); // Высота ствола для гнилого дерева

            const trunk = document.createElement('div');
            trunk.className = 'trunk';
            trunk.style.width = `${trunkWidth * 2}px`;
            trunk.style.height = `${trunkWidth * 2}px`;
            trunk.style.left = `${x}px`;
            trunk.style.top = `${y}px`;

            trunk.addEventListener('click', () => {
                alert(`Это гнилое дерево без кроны.\nШирина дерева: ${trunkWidth}м\nВысота ствола: ${trunkHeight}м`);
            });

            forest.appendChild(trunk);

            pineData.push({
                Крона: 0, // Размер кроны для гнилого дерева
                Ширина: trunkWidth,
                Высота: trunkHeight,
                X: x,
                Y: y
            });

            const gridX = Math.floor(x / gridCellSize);
            const gridY = Math.floor(y / gridCellSize);
            addToGrid(x, y, 0, 0, gridX, gridY, grid);
        } else {
            const pineCrown = document.createElement('div');
            pineCrown.className = 'pineCrown';
            pineCrown.style.width = `${pineCrownSize}px`;
            pineCrown.style.height = `${pineCrownSize}px`;
            pineCrown.style.left = `${x}px`;
            pineCrown.style.top = `${y}px`;
    
            //добавили характеристики "высота и ширина ствола" для дерева
    
            const trunkWidth = (pineCrownSize * 3 / 10).toFixed(2);
            const trunkHeight = (pineCrownSize * 3).toFixed(2);
    
            const trunk = document.createElement('div');
            trunk.className = 'trunk';
            trunk.style.width = `${trunkWidth}px`;
            trunk.style.height = `${trunkWidth}px`;
            trunk.style.left = `${x + (pineCrownSize/2) - (trunkWidth/2)}px`;
            trunk.style.top = `${y + (pineCrownSize/2) - (trunkWidth/2)}px`;
    
            // Добавляем обработчик события "click" для каждого дерева
            pineCrown.addEventListener('click', () => {
                // При нажатии на дерево выводим диалоговое окно с данными о размере дерева
                alert(`Размер кроны: ${pineCrownSize}м\nШирина дерева: ${trunkWidth}м\nВысота ствола: ${trunkHeight}м`);
            });
    
            // Добавляем обработчик события "click" для каждого ствола
            trunk.addEventListener('click', () => {
                // При нажатии на дерево выводим диалоговое окно с данными о размере дерева
                alert(`Размер кроны: ${pineCrownSize}м\nШирина дерева: ${trunkWidth}м\nВысота ствола: ${trunkHeight}м`);
            });
    
            forest.appendChild(pineCrown);
            forest.appendChild(trunk);
    
            pineData.push({
                Крона: pineCrownSize,
                Ширина: trunkWidth,
                Высота: trunkHeight,
                X: x,
                Y: y
            });
    
            const gridX = Math.floor(x / gridCellSize);
            const gridY = Math.floor(y / gridCellSize);
            addToGrid(x, y, pineCrownSize, pineSpacing, gridX, gridY, grid);
        }
    }

    const downloadButtonXLSX = document.getElementById('downloadButton--xlsx');
    downloadButtonXLSX.addEventListener('click', () => {
        exportToExcel(pineData, 'данные_деревьев.xlsx');
    });

    localStorage.setItem('pineData', JSON.stringify(pineData));

    const downloadButtonJSON = document.getElementById('downloadButton--json');
    downloadButtonJSON.addEventListener('click', () => {
        const filename = 'данные.json';
        const data = JSON.stringify(pineData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });

        // Создание ссылки для скачивания
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // Добавление ссылки на страницу и эмуляция клика
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    //Загрузка данных
    const loadButton = document.getElementById('loadButton');
    loadButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx';
        fileInput.addEventListener('change', handleFileSelection);
        fileInput.click();
    });

    function handleFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                processData(data);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function processData(data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
        clearForest();
    
        for (const pine of jsonData) {
            const pineCrownSize = parseFloat(pine['Крона']);
            const trunkWidth = parseFloat(pine['Ширина']);
            const trunkHeight = parseFloat(pine['Высота']);
            const x = parseFloat(pine['X']);
            const y = parseFloat(pine['Y']);
    
            const pineCrown = document.createElement('div');
            pineCrown.className = 'pineCrown';
            pineCrown.style.width = `${pineCrownSize}px`;
            pineCrown.style.height = `${pineCrownSize}px`;
            pineCrown.style.left = `${x}px`;
            pineCrown.style.top = `${y}px`;
    
            const trunk = document.createElement('div');
            trunk.className = 'trunk';
            trunk.style.width = `${trunkWidth}px`;
            trunk.style.height = `${trunkWidth}px`;
            trunk.style.left = `${x + (pineCrownSize / 2) - (trunkWidth / 2)}px`;
            trunk.style.top = `${y + (pineCrownSize / 2) - (trunkWidth / 2)}px`;
                
            forest.appendChild(pineCrown);
            forest.appendChild(trunk);
        }
    }
    

    function clearForest() {
        const forest = document.getElementById('forest');
        while (forest.firstChild) {
            forest.firstChild.remove();
        }
    }
});


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function createGrid(width, height) {
    const grid = new Array(width);
    for (let i = 0; i < width; i++) {
        grid[i] = new Array(height);
    }
    return grid;
}

function addToGrid(x, y, size, spacing, gridX, gridY, grid) {
    const cell = {
        x,
        y,
        size,
        spacing,
    };
    if (!grid[gridX][gridY]) {
        grid[gridX][gridY] = [cell];
    } else {
        grid[gridX][gridY].push(cell);
    }
}

function checkOverlap(x, y, size, spacing, gridCellSize, gridWidth, gridHeight, grid) { // Добавляем gridWidth и gridHeight в параметры
    const gridX = Math.floor(x / gridCellSize);
    const gridY = Math.floor(y / gridCellSize);

    const nearbyCells = getNearbyCells(gridX, gridY, gridWidth, gridHeight, grid); // Добавляем gridWidth и gridHeight в параметры

    for (const cell of nearbyCells) {
        for (const pineCrown of cell) {
            const dx = x - pineCrown.x;
            const dy = y - pineCrown.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = pineCrown.spacing + size + spacing;
            if (distance < minDistance) {
                return true;
            }
        }
    }

    return false;
}

function getNearbyCells(gridX, gridY, gridWidth, gridHeight, grid) { // Добавляем gridWidth и gridHeight в параметры
    const nearbyCells = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const x = gridX + i;
            const y = gridY + j;
            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight && grid[x][y]) {
                nearbyCells.push(grid[x][y]);
            }
        }
    }
    return nearbyCells;
}

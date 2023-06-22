window.addEventListener('DOMContentLoaded', () => {
    const forest = document.getElementById('forest');
    const treeCount = 1000;
    const treeCrownMinSize = 5;
    const treeCrownMaxSize = 15;
    const treeMinSpacing = 1;
    const treeMaxSpacing = 3;
    const gridSize = 10;
    const treeData = [];

    const forestWidth = 500;
    const forestHeight = 500;
    const gridCellSize = Math.max(treeCrownMaxSize, treeMaxSpacing) * 2;

    const gridWidth = Math.ceil(forestWidth / gridCellSize);
    const gridHeight = Math.ceil(forestHeight / gridCellSize);

    const grid = createGrid(gridWidth, gridHeight);

    for (let i = 0; i < treeCount; i++) {
        const treeCrownSize = getRandomFloat(treeCrownMinSize, treeCrownMaxSize, 2);
        const treeSpacing = getRandomInt(treeMinSpacing, treeMaxSpacing);
        let x, y;
        let overlapping = false;

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
        
            const minX = treeCrownSize / 2;
            const maxX = forestWidth - treeCrownSize / 2;
            const minY = treeCrownSize / 2;
            const maxY = forestHeight - treeCrownSize / 2;
        
            x = Math.min(maxX, Math.max(minX, x));
            y = Math.min(maxY, Math.max(minY, y));

            // Проверка пересечения с другими деревьями
            overlapping = checkOverlap(x, y, treeCrownSize, treeSpacing, gridCellSize, gridWidth, gridHeight, grid);
        
            attempts++;
        
            if (attempts > maxAttempts) {
                break;
            }
        } while (overlapping);
        
        // Если количество попыток превысило предел, пропустить это дерево и перейти к следующему
        if (attempts > maxAttempts) {
            continue;
        }        

        const treeCrown = document.createElement('div');
        treeCrown.className = 'treeCrown';
        treeCrown.style.width = `${treeCrownSize}px`;
        treeCrown.style.height = `${treeCrownSize}px`;
        treeCrown.style.left = `${x}px`;
        treeCrown.style.top = `${y}px`;

        //добавили характеристики "высота и ширина ствола" для дерева

        const trunkWidth = (treeCrownSize / 3).toFixed(2);
        const trunkHeight = (treeCrownSize * 4).toFixed(2);

        const trunk = document.createElement('div');
        trunk.className = 'trunk';
        trunk.style.width = `${trunkWidth}px`;
        trunk.style.height = `${trunkWidth}px`;
        trunk.style.left = `${x + (treeCrownSize/2) - (trunkWidth/2)}px`;
        trunk.style.top = `${y + (treeCrownSize/2) - (trunkWidth/2)}px`;

        // Добавляем обработчик события "click" для каждого дерева
        treeCrown.addEventListener('click', () => {
            // При нажатии на дерево выводим диалоговое окно с данными о размере дерева
            alert(`Размер кроны: ${treeCrownSize}м\nШирина дерева: ${trunkWidth}м\nВысота ствола: ${trunkHeight}м`);
        });

        // Добавляем обработчик события "click" для каждого ствола
        trunk.addEventListener('click', () => {
            // При нажатии на дерево выводим диалоговое окно с данными о размере дерева
            alert(`Размер кроны: ${treeCrownSize}м\nШирина дерева: ${trunkWidth}м\nВысота ствола: ${trunkHeight}м`);
        });

        forest.appendChild(treeCrown);
        forest.appendChild(trunk);

        treeData.push({
            Крона: treeCrownSize,
            Ширина: trunkWidth,
            Высота: trunkHeight,
            X: x,
            Y: y
        });

        const gridX = Math.floor(x / gridCellSize);
        const gridY = Math.floor(y / gridCellSize);
        addToGrid(x, y, treeCrownSize, treeSpacing, gridX, gridY, grid);
    }

    const downloadButtonXLSX = document.getElementById('downloadButton--xlsx');
    downloadButtonXLSX.addEventListener('click', () => {
        exportToExcel(treeData, 'данные_деревьев.xlsx');
    });

    localStorage.setItem('treeData', JSON.stringify(treeData));

    const downloadButtonJSON = document.getElementById('downloadButton--json');
    downloadButtonJSON.addEventListener('click', () => {
        const filename = 'данные.json';
        const data = JSON.stringify(treeData, null, 2);
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
    
        for (const tree of jsonData) {
            const treeCrownSize = parseFloat(tree['Крона']);
            const trunkWidth = parseFloat(tree['Ширина']);
            const trunkHeight = parseFloat(tree['Высота']);
            const x = parseFloat(tree['X']);
            const y = parseFloat(tree['Y']);
    
            const treeCrown = document.createElement('div');
            treeCrown.className = 'treeCrown';
            treeCrown.style.width = `${treeCrownSize}px`;
            treeCrown.style.height = `${treeCrownSize}px`;
            treeCrown.style.left = `${x}px`;
            treeCrown.style.top = `${y}px`;
    
            const trunk = document.createElement('div');
            trunk.className = 'trunk';
            trunk.style.width = `${trunkWidth}px`;
            trunk.style.height = `${trunkWidth}px`;
            trunk.style.left = `${x + (treeCrownSize / 2) - (trunkWidth / 2)}px`;
            trunk.style.top = `${y + (treeCrownSize / 2) - (trunkWidth / 2)}px`;
                
            forest.appendChild(treeCrown);
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
        for (const treeCrown of cell) {
            const dx = x - treeCrown.x;
            const dy = y - treeCrown.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = treeCrown.spacing + size + spacing;
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

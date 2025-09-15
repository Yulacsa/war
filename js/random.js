let elements = []
let field = {}
let FilledInField = {}
let ships = { 1: 4, 2: 3, 3: 2, 4: 1 }
let selectedShipLength = 1;
let isHorizontal = true;
let placedShips = { 1: 0, 2: 0, 3: 0, 4: 0 }
let nomber = document.getElementById('nomber')
let tops = document.getElementById('tops')
let letters = document.getElementById('letters')

for (let i = 1; i <= 100; i++) {
    const el = document.getElementById(`cl${i}`);
    elements.push(el);
    field[`cl${i}`] = { filled: false }
    if (el) {
        el.addEventListener("click", () => {
            if (placedShips[selectedShipLength] >= ships[selectedShipLength]) return;
            const shipCells = getShipCells(i, selectedShipLength, isHorizontal);
            if (!shipCells || !canPlaceShip(shipCells)) return;

            shipCells.forEach((id) => {
                field[id].filled = true;
                FilledInField[id] = true;
                document.getElementById(id).style.backgroundColor = "rgba(128, 0, 128, 0.112)";
            });

            placedShips[selectedShipLength]++;
            shipButtons()
        });
    }
}

function getShipCells(startIndex, length, horizontal) {
    const cells = [];
    for (let i = 0; i < length; i++) {
        const index = horizontal ? startIndex + i : startIndex + i * 10;
        if (index > 100 || (horizontal && Math.floor((index - 1) / 10) !== Math.floor((startIndex - 1) / 10))) {
            return null;
        }
        cells.push(`cl${index}`)
    }
    return cells;
}

function canPlaceShip(cells) {
    return cells.every(id => !field[id]?.filled && !getNeighbors(id).some(n => FilledInField[n]));
}

function getNeighbors(id) {
    const index = parseInt(id.replace("cl", ""));
    const neighbors = [-1, 1, -10, 10, -11, -9, 9, 11].map(offset => `cl${index + offset}`);
    return neighbors.filter(n => field[n])
}

function shipButtons() {
    document.querySelectorAll(".btn").forEach((btn) => {
        const length = parseInt(btn.dataset.length)
        btn.style.opacity = ships[length] === placedShips[length] ? 0.5 : 1;
        btn.disabled = ships[length] === placedShips[length]
    });

    if (Object.values(ships).every((count, i) => count === placedShips[i + 1])) {
        document.getElementById("ship-size").style.display = "none";
        nomber.style.display = "flex";
        tops.style.display = "flex";
        letters.style.display = "block";
    }
}

document.querySelectorAll(".btn").forEach((btn) =>
    btn.addEventListener("click", () => {
        selectedShipLength = parseInt(btn.dataset.length);
        document.querySelectorAll(".btn").forEach(b => b.classList.remove("active"))
        btn.classList.add("active");
    })
)

document.getElementById("toggleDirection").addEventListener("click", function () {
    isHorizontal = !isHorizontal;
    this.textContent = isHorizontal ? "Горизонтально" : "Вертикально";
});

function resetGame() {
    placedShips = { 1: 0, 2: 0, 3: 0, 4: 0 }
    FilledInField = {};
    elements.forEach((el) => {
        field[el.id].filled = false;
    })
    document.getElementById("ship-size").style.display = "block";
    shipButtons();
}


let foursome = []
let triples = []
let double = []
let single = []
let impossible = []
let FilledInFields = {}

// Генерація кораблів
function generateShip(size, shipArray, maxCount) {
    while (shipArray.length < maxCount) {
        let rand1 = Math.floor(Math.random() * 10); // X координата (0-9)
        let rand2 = Math.floor(Math.random() * 10) * 10; // Y координата (0, 10, ..., 90)
        let rand3 = Math.floor(Math.random() * 2) + 1; // 1 - горизонтальний, 2 - вертикальний
        let n = rand1 + rand2; // Поточний індекс
        let shipcom = []; // Масив для поточного корабля
        let isValid = true;

        for (let i = 0; i < size; i++) {
            if (rand3 === 1) {
                // Горизонтальний
                n = rand1 + i + rand2;
            } else {
                // Вертикальний
                n = rand1 + rand2 + i * 10;
            }

            // Перевірка виходу за межі поля або перетину з іншими кораблями
            if (
                n >= 100 ||
                FilledInFields[n] ||
                impossible.includes(n) ||
                (rand3 === 1 && Math.floor(n / 10) !== Math.floor(rand2 / 10))
            ) {
                isValid = false;
                break;
            }
            shipcom.push(n);
        }

        if (isValid) {
            shipcom.forEach((cell) => {
                FilledInFields[cell] = true;
                markImpossible(cell)
            });
            shipArray.push(shipcom);
        }
    }
}

generateShip(4, foursome, 1)
generateShip(3, triples, 2)
generateShip(2, double, 3)
generateShip(1, single, 4)

// Функція для позначення недоступних клітинок навколо корабля
function markImpossible(n) {
    let x = n % 10;
    let y = Math.floor(n / 10);

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                let neighbor = ny * 10 + nx;
                if (!FilledInFields[neighbor] && !impossible.includes(neighbor)) {
                    impossible.push(neighbor);

                    // Змінюємо колір недоступних клітинок
                    let botclElement = document.querySelector(`.botcl${neighbor}`);

                }
            }
        }
    }
}





// гра
let isUserTurn = true;
let userHits = 0;
let computerHits = 0;
let userShots = new Set();
let computerShots = new Set();
const ttt = 20; // Загальна кількість частин кораблів


function checkIfComputerShipSunk(cellId) {
    let sunk = true;
    let shipPart = getShipPart(cellId);

    shipPart.forEach(cell => {
        const xIcon = document.querySelector(`#cl${cell}`).querySelector('.bi-x');
        if (!xIcon.style.display) {
            sunk = false;
        }
    });

    if (sunk) {
        shipPart.forEach(cell => {
            markSurroundingCells2(cell);
        });
    }
}

// Викликається після кожного попадання комп'ютера
function handleComputerHit(cellId) {
    const userCell = document.querySelector(`#cl${cellId}`);
    const xIcon = userCell.querySelector('.bi-x');
    const dotIcon = userCell.querySelector('.bi-record-fill');

    const isHit = FilledInField[`#cl${cellId}`] !== undefined;

    if (isHit) {
        xIcon.style.display = 'block'; 
        dotIcon.style.display = 'none'; 
        computerHits++;
        checkIfComputerShipSunk(cellId);
        
        // Перевірка на перемогу комп'ютера
        if (computerHits === ttt) {
            alert("Комп'ютер виграв!");
            return; // Завершуємо гру
        }
        
        // Передаємо хід користувачу, якщо комп'ютер влучив
        isUserTurn = false; 
    } else {
        xIcon.style.display = 'none';
        dotIcon.style.display = 'block';
    }
}

// Перевірка, чи знищений корабель
function checkIfShipSunk(cellId) {
    let sunk = true;
    let shipPart = getShipPart(cellId);

    shipPart.forEach(cell => {
        const xIcon = document.querySelector(`.botcl${cell}`).querySelector('.bi-x');
        if (!xIcon.style.display) {
            sunk = false;
        }
    });

    if (sunk) {
        shipPart.forEach(cell => {
            markSurroundingCells(cell);
        });
    }
}

// Функція для отримання частин корабля
function getShipPart(cellId) {
    return Object.values(foursome).concat(Object.values(triples), Object.values(double), Object.values(single))
        .find(ship => ship.includes(cellId));
}

// Позначаємо навколо знищеного корабля (крапки •)
function markSurroundingCells(cellId) {
    let x = cellId % 10;
    let y = Math.floor(cellId / 10);

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                let neighbor = ny * 10 + nx;
                const neighborCell = document.querySelector(`.botcl${neighbor}`);
                const dotIcon = neighborCell.querySelector('.bi-record-fill');
                if (neighborCell && !dotIcon.style.display) {
                    dotIcon.style.display = 'block';
                }
            }
        }
    }
}

function markSurroundingCells2(cellId) {
    let x = cellId % 10;
    let y = Math.floor(cellId / 10);

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                let neighbor = ny * 10 + nx;
                const neighborCell = document.querySelector(`#cl${neighbor}`);
                const dotIcon = neighborCell.querySelector('.bi-record-fill');
                if (neighborCell && !dotIcon.style.display) {
                    dotIcon.style.display = 'block';
                }
            }
        }
    }
}

// Зміни для комп'ютера
function computerTurn() {
    let cellId;
    
    do {
        cellId = Math.floor(Math.random() * 100);
    } while (computerShots.has(cellId));

    computerShots.add(cellId);
    
    
    if (FilledInField[`#cl${cellId}`]) { // Якщо є корабель у цій клітинці
        handleComputerHit(cellId);
    } else { // Промах
        handleComputerHit(cellId)
        isUserTurn = true; // Передаємо хід користувачу
    }
}

//  код для ходу користувача
document.querySelectorAll('.botcl').forEach((botclElement) => {
    botclElement.addEventListener('click', function () {
        if (!isUserTurn) return;

        const cellId = parseInt(botclElement.className.match(/botcl(\d+)/)?.[1]);

        if (userShots.has(cellId)) return;

        userShots.add(cellId);
        
        const xIcon = botclElement.querySelector('.bi-x');
        const dotIcon = botclElement.querySelector('.bi-record-fill');

        if (FilledInFields[cellId]) { // Влучив у корабель
            xIcon.style.display = 'block';
            dotIcon.style.display = 'none';
            userHits++;
            checkIfShipSunk(cellId);
            
            // Перевірка на перемогу користувача
            if (userHits === ttt) {
                alert("Вітаємо! Ви виграли!");
                return; // Завершуємо гру
            }
            
            isUserTurn = true; 
        } else { // Промах
            xIcon.style.display = 'none';
            dotIcon.style.display = 'block';
            isUserTurn = false;
            setTimeout(computerTurn, 500)
        }
    });
});



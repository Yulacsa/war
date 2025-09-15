let elements = [];
let field = {};
let FilledInField = {};
let ships = { 1: 4, 2: 3, 3: 2, 4: 1 };
let selectedShipLength = 1;
let isHorizontal = true;
let placedShips = { 1: 0, 2: 0, 3: 0, 4: 0 };
let nomber = document.getElementById('nomber')
let tops = document.getElementById('tops')
let letters = document.getElementById('letters')

for (let i = 1; i <= 100; i++) {
    const el = document.getElementById(`cl${i}`);
    elements.push(el);
    field[`cl${i}`] = { filled: false };
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
            updateShipButtons();
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
        cells.push(`cl${index}`);
    }
    return cells;
}

function canPlaceShip(cells) {
    return cells.every(id => !field[id]?.filled && !getNeighbors(id).some(n => FilledInField[n]));
}

function getNeighbors(id) {
    const index = parseInt(id.replace("cl", ""));
    const neighbors = [-1, 1, -10, 10, -11, -9, 9, 11].map(offset => `cl${index + offset}`);
    return neighbors.filter(n => field[n]);
}

function updateShipButtons() {
    document.querySelectorAll(".btn").forEach((btn) => {
        const length = parseInt(btn.dataset.length);
        btn.style.opacity = ships[length] === placedShips[length] ? 0.5 : 1;
        btn.disabled = ships[length] === placedShips[length];
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
        document.querySelectorAll(".btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    })
);

document.getElementById("toggleDirection").addEventListener("click", function () {
    isHorizontal = !isHorizontal;
    this.textContent = isHorizontal ? "Горизонтально" : "Вертикально";
});

function resetGame() {
    placedShips = { 1: 0, 2: 0, 3: 0, 4: 0 };
    FilledInField = {};
    elements.forEach((el) => {
        el.style.backgroundColor = "";
        field[el.id].filled = false;
    });
    document.getElementById("ship-size").style.display = "block";
    updateShipButtons();
}


let foursome = [];
let triples = [];
let double = [];
let single = [];
let impossible = [];
let FilledInFields = {};

// Генерація кораблів
function generateShip(size, shipArray, maxCount) {
    while (shipArray.length < maxCount) {
        let rand1 = Math.floor(Math.random() * 10); // X координата (0-9)
        let rand2 = Math.floor(Math.random() * 10) * 10; // Y координата (0, 10, ..., 90)
        let rand3 = Math.floor(Math.random() * 2) + 1; // 1 - горизонтальний, 2 - вертикальний
        let n = rand1 + rand2; // Поточний індекс
        let shipcom = []; // Масив для поточного корабля
        let isValid = true; // Перевірка на валідність розташування

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
                markImpossible(cell); // Позначаємо недоступні клітинки
            });
            shipArray.push(shipcom);
            // Змінюємо колір елементів у DOM
            shipcom.forEach((cell) => {
                let botclElement = document.querySelector(`.botcl${cell}`);
            });
        }
    }
}

// Генеруємо кораблі відповідного розміру
generateShip(4, foursome, 1); // 1 корабель на 4 клітинки
generateShip(3, triples, 2); // 2 кораблі на 3 клітинки
generateShip(2, double, 3); // 3 кораблі на 2 клітинки
generateShip(1, single, 4); // 4 кораблі на 1 клітинку

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





// Подія на клітинку при кліку
let isUserTurn = true;
let userHits = 0;
let computerHits = 0;
let userShots = new Set();
let computerShots = new Set();
const totalShips = 20 // Загальна кількість частин кораблів

// Позначення навколо знищеного корабля для комп'ютера
function checkIfComputerShipSunk(cellId) {
    let sunk = true;
    let shipPart = getShipPart(cellId); // Отримуємо частину корабля, до якої належить клітинка

    shipPart.forEach(cell => {
        const xIcon = document.querySelector(`#cl${cell}`).querySelector('.bi-x');
        if (!xIcon.style.display) {
            sunk = false; // Якщо хоча б одна клітинка не вражена, корабель ще не знищено
        }
    });

    if (sunk) {
        shipPart.forEach(cell => {
            markSurroundingCells2(cell); // Позначаємо навколо знищеного корабля
        });
    }
}

// Викликається після кожного попадання комп'ютера
function handleComputerHit(cellId) {
    const userCell = document.querySelector(`#cl${cellId}`);
    const xIcon = userCell.querySelector('.bi-x'); // X for a hit
    const dotIcon = userCell.querySelector('.bi-record-fill'); // Dot for a miss

    const isHit = FilledInField[`cl${cellId}`] !== undefined; // Check if the cell is filled by the user

    if (isHit) {
        xIcon.style.display = 'block'; // Show 'X' for a hit
        dotIcon.style.display = 'none'; // Hide the dot for a hit
        computerHits++; // Increment the computer's hit counter
        checkIfComputerShipSunk(cellId); // Check if the ship is sunk
    } else {
        xIcon.style.display = 'none'; // Hide the 'X' for a miss
        dotIcon.style.display = 'block'; // Show the dot for a miss
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
            markSurroundingCells(cell); // Позначаємо навколо знищеного корабля
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
        cellId = Math.floor(Math.random() * 100); // Комп'ютер вибирає випадкову клітинку
    } while (computerShots.has(cellId)); // Перевіряємо, чи комп'ютер вже стріляв у цю клітинку

    computerShots.add(cellId); // Записуємо клітинку
    const userCell = document.querySelector(`#cl${cellId}`);
    const xIcon = userCell.querySelector('.bi-x');
    const dotIcon = userCell.querySelector('.bi-record-fill');

    if (FilledInField[`cl${cellId}`]) { // Якщо є корабель у цій клітинці
        if (xIcon.style.display) {
            // Якщо вже позначено, що влучили в цю клітинку, комп'ютер має вибрати іншу клітинку
            computerTurn();
            return;
        }
        handleComputerHit(cellId); // Викликаємо обробку попадання

        if (computerHits == totalShips) {
            alert("Комп'ютер виграв!");
            return; // Завершуємо гру
        }

        // Комп'ютер ходить знову, якщо влучив
        setTimeout(computerTurn(), 1000);
    }
    else { // Промах
        if (dotIcon.style.display) {
            // Якщо вже позначено промах, комп'ютер має вибрати іншу клітинку
            computerTurn();
            return;
        }
        handleComputerHit(cellId)
        isUserTurn = true; // Передаємо хід користувачу
    }
}




// Виправлений код для кліку користувача, щоб також відображати попадання на полі комп'ютера
document.querySelectorAll('.botcl').forEach((botclElement) => {
    botclElement.addEventListener('click', function () {
        if (!isUserTurn) return; // Якщо не час ходити користувачу, нічого не робимо
        const cellId = parseInt(botclElement.className.match(/botcl(\d+)/)?.[1]);

        if (userShots.has(cellId)) return; // Якщо вже стріляли в цю клітинку

        userShots.add(cellId); // Записуємо клітинку
        const xIcon = botclElement.querySelector('.bi-x');
        const dotIcon = botclElement.querySelector('.bi-record-fill');

        if (FilledInFields[cellId]) { // Влучив у корабель
            xIcon.style.display = 'block';
            dotIcon.style.display = 'none';
            userHits++;
            checkIfShipSunk(cellId); // Перевірка, чи знищено корабель
        } else { // Промах
            xIcon.style.display = 'none';
            dotIcon.style.display = 'block';
            isUserTurn = false; // Передаємо хід комп'ютеру
            setTimeout(computerTurn, 1000); // Комп'ютер стріляє через 1 секунду
        }
    });
});


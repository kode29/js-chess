const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const width = 8;
let playerGo = 'black';
playerDisplay.textContent = playerGo;

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square');
        square.innerHTML = startPiece;
        
        // The below is the long-form of the next line
        // square.firstChild && square.firstChild.setAttribute('draggable');
        square.firstChild?.setAttribute('draggable', true);

        square.setAttribute('square-id', i);
        // square.classList.add('beige');
        const row = Math.floor((63-i)/ 8) + 1;
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? 'beige' : "brown");
        } else {
            square.classList.add(i % 2 === 0 ? 'brown' : "beige");
        }

        if (i <= 15) {
            square.firstChild.firstChild.classList.add('black');
        } else if (i >= 48) {
            square.firstChild.firstChild.classList.add('white');
        }
        gameBoard.append(square);
    });
}

createBoard();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
    // console.log(e); // element - all information
    // console.log(`e.target: ${e.target}`); // where it was dropped
    // console.log(e.target.parentNode); // parent information
    // console.log(e.target.parentNode.getAttribute('square-id')); // get the ID of the Starting (parent) box
    
    startPositionId = e.target.closest('.square').getAttribute('square-id');
    // console.log(`Start ID: ${startPositionId}`);
    draggedElement = e.target.closest('.piece');
}

function dragOver(e){
    e.preventDefault(); // don't show all information during the drag
}

function dragDrop (e) {
    e.stopPropagation();
    console.log(e.target);
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    console.log(`correctGo: ${correctGo}`)
    const taken = e.target.closest('.square').firstChild?.classList.contains('piece') || false;
    console.log(`taken: ${taken}`)
    const valid = checkIfValid(e.target); // .closest('.piece'));
    console.log(`valid: ${valid}`)
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    console.log(`opponentGo: ${opponentGo}`)
    const takenByOpponent = e.target.closest('svg')?.classList.contains(opponentGo) || false;
    console.log(`takenByOpponent: ${takenByOpponent}`)
    // it was e.target.firstChild?.classList.contains(opponentGo), but FF would allow dropping on .piece, svg, AND path, so I updated it to 'closet' so the DOM would find the .piece and identify the class

    if (correctGo) {
        // must check this first
        if (takenByOpponent && valid){
            console.log("Taken by opponent && Valid")
            e.target.closest('.square').append(draggedElement);
            e.target.closest('.piece').remove();
            checkForWin();
            changePlayer();
            return
        }
        // then check this
        if (taken && !takenByOpponent) {
            console.log("Taken and !takeByOpponent")
            infoDisplay.textContent = "Invalid Move";
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }
        if (valid) {
            console.log()
            e.target.append(draggedElement);
            checkForWin();
            changePlayer();
            return;
        }
    }
}

function changePlayer() {
    console.log(`PlayerGo: ${playerGo}`);
    if (playerGo == "black") {
        reverseIds();
        playerGo = "white";
    } else {
        revertIds();
        playerGo = "black";
    }
    playerDisplay.textContent = playerGo;
}

function reverseIds(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - i)-1) 
    );
}

function revertIds(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => square.setAttribute('square-id', i));
}

function checkIfValid(target) {
    // console.log(target)
    const targetId = Number(target.closest('.square')?.getAttribute('square-id'))
    // console.log(targetId)
    const startId = Number(startPositionId);
    const piece = draggedElement.id

    console.log(`targetId: ${targetId}`)
    console.log(`startId: ${startId}`)
    console.log(`piece: ${piece}`)
    
    console.log(`${playerGo.toUpperCase()} ${piece.toUpperCase()}`)

    switch (piece) {
        case 'pawn':
            const starterRow = [8,9,10,11,12,13,14,15]
            if (
                starterRow.includes(startId) 
                && startId + width * 2 === targetId
                || startId + width === targetId
                || startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
            ) {
                return true;
            }
            break;
        case 'bishop':
            if (
                // down/right
                startId + width + 1 === targetId
                || startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                // down/left
                || startId - width - 1 === targetId
                || startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                || startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild

                // up/right
                || startId - width + 1 === targetId
                || startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                || startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild

                // up/left
                || startId + width - 1 === targetId
                || startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                || startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
            ) {
                return true;
            }
            break;
        case "rook":
            if (
                /// up
                startId + width === targetId
                || startId + width * 2 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild
                || startId + width * 3 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild
                || startId + width * 4 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild
                || startId + width * 5 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild
                || startId + width * 6 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild
                || startId + width * 7 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild
                // down
                || startId - width === targetId
                || startId - width * 2 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild
                || startId - width * 3 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild
                || startId - width * 4 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild
                || startId - width * 5 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild
                || startId - width * 6 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild
                || startId - width * 7 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild
                // right
                || startId + 1 === targetId
                || startId + 2 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild
                || startId + 3 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                || startId + 4 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                || startId + 5 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild && document.querySelector(`[square-id="${startId + 4}"]`).firstChild
                || startId + 6 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild && document.querySelector(`[square-id="${startId + 4}"]`).firstChild && document.querySelector(`[square-id="${startId + 5}"]`).firstChild
                || startId + 7 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild && document.querySelector(`[square-id="${startId + 4}"]`).firstChild && document.querySelector(`[square-id="${startId + 5}"]`).firstChild && document.querySelector(`[square-id="${startId + 6}"]`).firstChild
                // left
                || startId - 1 === targetId
                || startId - 2 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild
                || startId - 3 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                || startId - 4 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                || startId - 5 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild && document.querySelector(`[square-id="${startId - 4}"]`).firstChild
                || startId - 6 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild && document.querySelector(`[square-id="${startId - 4}"]`).firstChild && document.querySelector(`[square-id="${startId - 5}"]`).firstChild
                || startId - 7 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild && document.querySelector(`[square-id="${startId - 4}"]`).firstChild && document.querySelector(`[square-id="${startId - 5}"]`).firstChild && document.querySelector(`[square-id="${startId - 6}"]`).firstChild
            ) {
                return true;
            }
            break;
        case "queen":
            if (
                // down/right
                startId + width + 1 === targetId
                || startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                || startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                // down/left
                || startId - width - 1 === targetId
                || startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                || startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild
                || startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild

                // up/right
                || startId - width + 1 === targetId
                || startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                || startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild
                || startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild

                // up/left
                || startId + width - 1 === targetId
                || startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                || startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                || startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
                
                /// up
                ||startId + width === targetId
                || startId + width * 2 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild
                || startId + width * 3 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild
                || startId + width * 4 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild
                || startId + width * 5 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild
                || startId + width * 6 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild
                || startId + width * 7 === targetId && document.querySelector(`[square-id="${startId + width}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild && document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild
                // down
                || startId - width === targetId
                || startId - width * 2 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild
                || startId - width * 3 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild
                || startId - width * 4 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild
                || startId - width * 5 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild
                || startId - width * 6 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild
                || startId - width * 7 === targetId && document.querySelector(`[square-id="${startId - width}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild && document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild
                // right
                || startId + 1 === targetId
                || startId + 2 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild
                || startId + 3 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                || startId + 4 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                || startId + 5 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild && document.querySelector(`[square-id="${startId + 4}"]`).firstChild
                || startId + 6 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild && document.querySelector(`[square-id="${startId + 4}"]`).firstChild && document.querySelector(`[square-id="${startId + 5}"]`).firstChild
                || startId + 7 === targetId && document.querySelector(`[square-id="${startId + 1}"]`).firstChild && document.querySelector(`[square-id="${startId + 2}"]`).firstChild && document.querySelector(`[square-id="${startId + 3}"]`).firstChild && document.querySelector(`[square-id="${startId + 4}"]`).firstChild && document.querySelector(`[square-id="${startId + 5}"]`).firstChild && document.querySelector(`[square-id="${startId + 6}"]`).firstChild
                // left
                || startId - 1 === targetId
                || startId - 2 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild
                || startId - 3 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                || startId - 4 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                || startId - 5 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild && document.querySelector(`[square-id="${startId - 4}"]`).firstChild
                || startId - 6 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild && document.querySelector(`[square-id="${startId - 4}"]`).firstChild && document.querySelector(`[square-id="${startId - 5}"]`).firstChild
                || startId - 7 === targetId && document.querySelector(`[square-id="${startId - 1}"]`).firstChild && document.querySelector(`[square-id="${startId - 2}"]`).firstChild && document.querySelector(`[square-id="${startId - 3}"]`).firstChild && document.querySelector(`[square-id="${startId - 4}"]`).firstChild && document.querySelector(`[square-id="${startId - 5}"]`).firstChild && document.querySelector(`[square-id="${startId - 6}"]`).firstChild
            ) {
                return true;
            }
            break;
        case "king":
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width + 1 === targetId ||
                startId - width + 1 === targetId ||
                startId + width - 1 === targetId ||
                startId - width - 1 === targetId 
            ){
                return true;
            }
            break;
        case "knight":
            // TODO: Tasks pending completion -@kyle at 12/26/2023, 1:23:51 AM
            // need to finish this
            if (1) {
                return true;
            }
            break;
    }
}

function checkForWin() {
    const kings = Array.from(document.querySelectorAll("#king"));
    console.log(kings);
    const allSquares = document.querySelectorAll('.square');
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black Wins!";
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
    } else if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White Wins";
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false)) ;
    }
}
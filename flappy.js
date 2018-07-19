let mainLoop = null;
let mainLoopTickTimeSec = 0.01;
let box = null;
let explosion = null;
let boxSpeed = 500;
let boxSpeedDown = 100;
let currentLeftPosition = null;
let currentTopPosition = null;
let timeGoingUpSec = 0;
let fromTop = 0;
let fromBottom = 0;
let obstacles = [];
let obstacleSpeed = 200;
let screenDensity = 1;
let holeHeight = 400;
let holdRepetition = false;
let tmpCurrTime = 0;
let timePlaying = 0;

(function () {
    mainContainer = document.getElementById('mainContainer');
    box = document.getElementById('box');
    explosion = document.getElementById('explosion');


    document.getElementById('startGame').onclick = () => {
        startGame();
        document.activeElement.blur();
    }

    window.addEventListener('keydown', (event) => {
        if (event.keyCode === 32 && !holdRepetition && timeGoingUpSec <= 0) {
            holdRepetition = true;
            timeGoingUpSec = 0.1;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.keyCode === 32) {
            holdRepetition = false;
        }
    });

    currentLeftPosition = 100;
    currentTopPosition = (mainContainer.offsetHeight / 2) - (box.offsetHeight / 2);

    box.style.left = currentLeftPosition + 'px';
    box.style.top = currentTopPosition + 'px';
    explosion.style.left = currentLeftPosition + 'px';
    explosion.style.top = currentTopPosition + 'px';
})();

function mainLoopTick(deltaTimeSec) {

    if (timeGoingUpSec > 0) {

        currentTopPosition -= boxSpeed * deltaTimeSec;
        timeGoingUpSec -= deltaTimeSec;

        if (currentTopPosition <= fromTop) {
            currentTopPosition = fromTop;
        }
    } else {
        currentTopPosition += boxSpeedDown * deltaTimeSec;

        if (currentTopPosition >= (mainContainer.offsetHeight - box.offsetHeight)) {
            currentTopPosition = (mainContainer.offsetHeight - box.offsetHeight);

            clearInterval(mainLoop);

            mainLoop = null;
            document.getElementById('you-lose').classList.remove('hidden');
            document.getElementById('box').classList.add('hidden');
            document.getElementById('explosion').classList.remove('hidden');
        }
    }

    obstacles.forEach((element, index) => {
        let newPosition = (parseFloat(element.style.left) - obstacleSpeed * deltaTimeSec);
        let obstacleWidth = parseFloat(element.style.width);

        if (index === obstacles.length - 1) {
            let showObsticle = mainContainer.offsetWidth - mainContainer.offsetWidth * screenDensity;

            if (newPosition < showObsticle) {
                createObstacle();
            }
        }

        if (newPosition < -obstacleWidth) {
            element.parentElement.removeChild(element);
            obstacles.splice(index, 1);

            screenDensity = Math.max(0.05, screenDensity - 0.0002);

        } else {
            element.style.left = newPosition + 'px';
        }

    });

    obstacles.forEach((element) => {
        if (isBoxCollision(box, element)) {
            clearInterval(mainLoop);

            mainLoop = null;
            document.getElementById('you-lose').classList.remove('hidden');
            document.getElementById('box').classList.add('hidden');
            document.getElementById('explosion').classList.remove('hidden');
        }
    });

    timePlaying = timePlaying + deltaTimeSec;

    document.getElementsByClassName('time-playing')[0].innerHTML = timePlaying.toFixed(2) + ' sec';

    box.style.top = currentTopPosition + 'px';
    explosion.style.top = currentTopPosition + 'px';
}


function startGame() {
    if (mainLoop !== null) {
        return;
    }

    obstacles.forEach((element) => {
        element.parentElement.removeChild(element);
    });

    obstacles = [];

    timePlaying = 0;

    screenDensity = 0.1;

    currentLeftPosition = 100;
    currentTopPosition = (mainContainer.offsetHeight / 2) - (box.offsetHeight / 2);

    createObstacle();

    tmpCurrTime = (new Date()).getTime();
    mainLoop = setInterval(() => {

        let currTime = (new Date()).getTime();
        let elapsedMilliseconds = currTime - tmpCurrTime;
        tmpCurrTime = currTime;

        mainLoopTick(elapsedMilliseconds / 1000);


    }, mainLoopTickTimeSec * 1000);

    document.getElementById('you-lose').classList.add('hidden');
    document.getElementById('box').classList.remove('hidden');
    document.getElementById('explosion').classList.add('hidden');
}

function isBoxCollision(a, b) {

    return !(
        ((parseFloat(a.style.top, 10) + a.offsetHeight) < parseFloat(b.style.top, 10)) ||
        (parseFloat(a.style.top, 10) > (parseFloat(b.style.top, 10) + b.offsetHeight)) ||
        ((parseFloat(a.style.left, 10) + a.offsetWidth) < parseFloat(b.style.left, 10)) ||
        (parseFloat(a.style.left, 10) > (parseFloat(b.style.left, 10) + b.offsetWidth))
    );
}

function getRandomFloat(max) {
    return Math.random() * max;
}

function createObstacle() {
    let randomHolePosition = getRandomFloat(mainContainer.offsetHeight - holeHeight);
    let topHeight = randomHolePosition;
    let bottomTop = holeHeight + randomHolePosition;
    let bottomHeight = mainContainer.offsetHeight - bottomTop;

    let obstacleTop = document.getElementById('obstacle-template').cloneNode();
    let obstacleBottom = document.getElementById('obstacle-template').cloneNode();

    obstacleTop.removeAttribute('id');
    obstacleTop.style.width = '20px';
    obstacleTop.style.display = 'block';
    obstacleTop.style.left = mainContainer.offsetWidth + 'px';
    obstacleTop.style.top = '0';
    obstacleTop.style.height = topHeight + 'px';

    obstacleBottom.removeAttribute('id');
    obstacleBottom.style.width = '20px';
    obstacleBottom.style.display = 'block';
    obstacleBottom.style.left = mainContainer.offsetWidth + 'px';
    obstacleBottom.style.top = bottomTop + 'px';
    obstacleBottom.style.height = bottomHeight + 'px';

    mainContainer.appendChild(obstacleTop);
    mainContainer.appendChild(obstacleBottom);

    obstacles.push(obstacleTop, obstacleBottom);
}

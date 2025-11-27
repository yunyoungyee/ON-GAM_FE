export function createEmotionCharacter(type) {
    const character = document.createElement('div');
    character.className = `character ${type}`;

    const face = document.createElement('div');
    face.className = `face ${type}`;

    const eyeLeft = document.createElement('div');
    eyeLeft.className = `eye eye-left`;
    const pupilLeft = document.createElement('div');
    pupilLeft.className = 'pupil';
    eyeLeft.appendChild(pupilLeft);

    const eyeRight = document.createElement('div');
    eyeRight.className = `eye eye-right`;
    const pupilRight = document.createElement('div');
    pupilRight.className = 'pupil';
    eyeRight.appendChild(pupilRight);

    applyEmotionShape(face, type);

    face.append(eyeLeft, eyeRight);
    character.append(face);

    return character;
}

function applyEmotionShape(face, type) {
    switch (type) {
        case 'angry':
            addDevilHorns(face);
            break;

        case 'anxious':
            face.classList.add('anxious');
            break;
    }
}

function addDevilHorns(face) {
    const hornLeft = document.createElement('div');
    const hornRight = document.createElement('div');

    hornLeft.className = 'devil-horn left';
    hornRight.className = 'devil-horn right';

    face.append(hornLeft, hornRight);
}


export function moveEyes(event) {
    const pupils = document.querySelectorAll('.pupil');

    pupils.forEach((pupil) => {
        const eye = pupil.parentElement;
        if (!eye) return;

        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);

        const maxMovement = 8;
        const x = Math.cos(angle) * maxMovement;
        const y = Math.sin(angle) * maxMovement;

        pupil.style.transform = `translate(-10%, -10%) translate(${x}px, ${y}px)`;
    });
}
export function scatterPosition(characterArea, character) {
    const areaWidth = characterArea.clientWidth;
    const areaHeight = characterArea.clientHeight;

    const maxX = areaWidth - 150;
    const maxY = areaHeight - 150;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    character.style.left = x + "px";
    character.style.top = y + "px";
}
class Exercise {
    constructor(props, angles) { // {sets: 0, leftReps: 0, rightReps: 0, rest: 0, name: "-"}
        this.setMax = props.sets || 0;
        this.leftMax = props.leftReps || 0
        this.rightMax = props.rightReps || 0;
        this.restTime = props.rest || 0;

        this.setCount = 0;
        this.leftCount = 0;
        this.rightCount = 0;
        this.isResting = false;
        this.restCount = 0;
        this.restInterval = null;
        this.finished = false;

        // Esses objetos abaixo se referem ao lado esquerdo
        this.concentric = {} //props.concentric;
        this.eccentric = {} //props.eccentric;

        // Os objetos invertidos se referem ao lado direito
        this.flippedConcentric = {}
        this.flippedEccentric = {}

        for (const key in props.concentric) {
            let value = this.angleNameToNumber(key);

            this.concentric[value] = props.concentric[key] * Math.PI / 180;

            if (value % 2 == 0) {
                value++;
            }
            else {
                value--;
            }

            this.flippedConcentric[value] = props.concentric[key] * Math.PI / 180;
        }

        for (const key in props.eccentric) {
            let value = this.angleNameToNumber(key);

            this.eccentric[value] = props.eccentric[key] * Math.PI / 180;

            if (value % 2 == 0) {
                value++;
            }
            else {
                value--;
            }

            this.flippedEccentric[value] = props.eccentric[key] * Math.PI / 180;
        }

        this.margin = props.margin || 0;
        this.margin = this.margin * Math.PI / 180 // converte para radianos

        this.angles = angles;

        this.needsReset = { left: false, right: false };
        this.reseted = { left: true, right: true };

        document.getElementById('sets-max').innerText = this.setMax;
        this.sets = document.getElementById('sets');

        if (typeof props.name === 'string' && props.name.length > 0) {
            document.getElementById('exercise-name').innerText = props.name;
        }

        if (props.leftReps <= 0) {
            document.getElementById('header-left').style.display = 'none';
            document.getElementById('counter-left').style.display = 'none';
        }
        else {
            document.getElementById('reps-left-max').innerText = props.leftReps.toString();
            this.leftReps = document.getElementById('reps-left');
        }

        if (props.rightReps <= 0) {
            document.getElementById('header-right').style.display = 'none';
            document.getElementById('counter-right').style.display = 'none';
        }
        else {
            document.getElementById('reps-right-max').innerText = props.rightReps.toString();
            this.rightReps = document.getElementById('reps-right');
        }

        if (this.restTime <= 0) {
            document.getElementById('rest-wrapper').display.style = 'none';
        }
        else {
            this.rest = document.getElementById('rest');
            this.rest.innerText = this.restTime.toString();
        }
    }

    angleNameToNumber(name) {
        switch (name) {
            case 'rightElbow':
                return 0;
            case 'leftElbow':
                return 1;
            case 'rightKnee':
                return 2;
            case 'leftKnee':
                return 3;
            case 'rightShoulder':
                return 4;
            case 'leftShoulder':
                return 5;
            case 'rightHip':
                return 6;
            case 'leftHip':
                return 7;
            default:
                return -1;
        }
    }

    /**
     * Recebe os keypoints estimados e retorna se o exercicio foi completado
     * @return {object} {left: [boolean], right: [boolean]} 
     */
    verify() {
        let left = true, right = true;

        for (let joint of Object.keys(this.concentric)) {
            joint = parseInt(joint);
            left = left && (this.angles[joint] >= this.concentric[joint] - this.margin
                && this.angles[joint] <= this.concentric[joint] + this.margin);
        }

        for (let joint of Object.keys(this.flippedConcentric)) {
            joint = parseInt(joint);
            right = right && (this.angles[joint] >= this.flippedConcentric[joint] - this.margin
                && this.angles[joint] <= this.flippedConcentric[joint] + this.margin);
        }

        return { left, right }
    }

    /**
     * Recebe os keypoints estimados e retorna a se o exercicio pode ser contabilizado novamente
     * @return {object} {left: [boolean], right: [boolean]} 
     */
    reset() {
        let left = true, right = true;

        for (const joint of Object.keys(this.eccentric)) {
            left = left && (this.angles[joint] >= this.eccentric[joint] - this.margin
                && this.angles[joint] <= this.eccentric[joint] + this.margin);
        }

        for (const joint of Object.keys(this.flippedEccentric)) {
            right = right && (this.angles[joint] >= this.flippedEccentric[joint] - this.margin
                && this.angles[joint] <= this.flippedEccentric[joint] + this.margin);
        }

        return { left, right }
    }

    update(keypoints) {
        if (this.isResting || this.finished) return;

        let result = this.verify(keypoints);
        let reset = this.reset();

        for (let side of ['left', 'right']) {
            if (this.reseted[side] && result[side]) {
                let counter = `${side}Count`;
                let element = `${side}Reps`;

                if (this[counter] < this[`${side}Max`]) {
                    this[counter] += 1;
                    this[element].innerText = this[counter].toString();
                    this[element].className = 'green';

                    setTimeout(() => {
                        this[element].className = 'white';
                    }, 500);

                    this.reseted[side] = false;
                    this.needsReset[side] = true;
                }
            }
            if (this.needsReset[side]) {
                this.reseted[side] = reset[side];
                this.needsReset[side] = !reset[side];
            }
        }

        if (
            (this.leftMax <= 0 || this.leftCount == this.leftMax)
            && (this.rightMax <= 0 || this.rightCount == this.rightMax)
        ) {
            this.leftCount = 0;
            this.rightCount = 0;

            this.setCount += 1;
            this.sets.innerHTML = this.setCount.toString();
            this.sets.className = 'green';

            setTimeout(() => {
                this.sets.className = 'white';
                this.leftReps.innerText = '0';
                this.rightReps.innerText = '0';
            }, 500);

            const message = document.getElementById('msg');

            if (this.setCount < this.setMax) {

                message.className = 'show';
                setTimeout(() => {
                    message.className = 'hide';
                }, 3000);

                this.restCount = this.restTime;
                this.isResting = true;
                this.restInterval = setInterval(() => {
                    if (this.restCount == 1) {
                        clearInterval(this.restInterval);
                        this.isResting = false;
                        this.rest.innerText = this.restTime.toString();
                    }
                    else {
                        this.restCount -= 1;
                        this.rest.innerText = this.restCount.toString();
                    }
                }, 1000);
            }
            else {
                this.finished = true;
                message.className = 'show';
            }
        }
    }
}
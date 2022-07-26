// 가위바위보 게임 Logic

/**
 * 
 * @param {*} choice1 : player 의 선택 
 * @param {*} choice2 : PC 의 선택
 * @returns 
 */
var compare = function (choice1, choice2) {
    
    console.log('==================');
    console.log(choice1, choice2);
    console.log('==================');

    if (choice1 === choice2) {
        return "비겼습니다.";
    }
    if (choice1 === "rock") {
        if (choice2 === "scissors") {
            // rock wins
            return "당신의 승리입니다!";
        } else {
            // paper wins
            return "당신의 패배입니다!";
        }
    }
    if (choice1 === "paper") {
        if (choice2 === "rock") {
            // paper wins
            return "당신의 승리입니다!";
        } else {
            // scissors wins
            return "당신의 패배입니다!";
        }
    }
    if (choice1 === "scissors") {
        if (choice2 === "paper") {
            // rock wins
            return "당신의 승리입니다!";
        } else {
            // scissors wins
            return "당신의 패배입니다!";
        }
    }
};
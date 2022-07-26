let net;
var user_counter = 0;
var computer_counter = 0;
var game_counter = 0;

// html 문서에서 'webcam' element 를 찾아 변수에 넣어준다.
const webcamElement = document.getElementById('webcam');
// tensorflow.js 에서 knn-classifier 를 불러온다.
const classifier = knnClassifier.create();

/**
 * 1. Train 버튼 누를 경우 knn-classifier 학습하는 함수
 */
async function app1() {
    console.log('Loading mobilenet..');
    let train_btn_status = document.getElementById('train')
    train_btn_status.innerHTML = 'Loading mobilenet'

    // tensorflow 의 mobilenet 을 불러온다.
    net = await mobilenet.load();
    console.log('Successfully loaded model');
    train_btn_status.innerHTML = 'Successfully loaded model'

    // webcam 의 이미지를 변수에 담는다.
    // tensorflow.js의 tf.data.webcam method를 사용한다.
    const webcam = await tf.data.webcam(webcamElement);

    // knn-classifier 를 학습시키는 함수
    // 1) web cam 의 이미지를 캡쳐하고 (tf.data.webcam method 사용)
    // 2) 캡쳐한 이미지로 mobilenet 에서 imbedding 을 얻고
    // 3) 이를 knn classifier 에 imbedding, 클래스 로 추가 학습시킨다.
    // 4) 학습완료된 이미지는 삭제한다. (knn 에 imbed 가 들어갔으니 필요없음)
    const addExample = async classId => {
        // 1)
        const img = await webcam.capture();

        // 2)
        const activation = net.infer(img, true);

        // 3) 주의 여기의 addExample 은 위에서 선언한 const 가 아님, knn 의 method 임!!
        classifier.addExample(activation, classId);

        // 4)
        img.dispose();
    };


    // Button click 에 대한 event listener 를 만든다.
    document.getElementById('class-rock').addEventListener('click', () => addExample(0));
    document.getElementById('class-papers').addEventListener('click', () => addExample(1));
    document.getElementById('class-scissors').addEventListener('click', () => addExample(2));


    console.log('training');
    // 여기까지 정상적으로 진행되었으면 HTML 문서의 div class=add_buttons 를 보이게 한다.
    $(".add_buttons button").show();


    while (true) {
        // knn classifier 에 학습되는 class 가 1개 이상일 경우 작동 
        if (classifier.getNumClasses() > 0) {
            // 이미지를 캡쳐한다. 
            const img = await webcam.capture();
            play == false;
            // mobilenet 에 image 를 입력하고 추론값을 변수에 담는다.
            const activation = net.infer(img, 'conv_preds');
            // 해당 imbedding 값을 classifier 에 입력해 class 를 얻는다.
            // predictClass 는 tensorflow.knnclassifier의 method 임
            const result = await classifier.predictClass(activation);
            console.log(result)

            const classes = ['rock', 'paper', 'scissors'];
            // html 문서의 label Element에 label에 예측한 결과 class 를 반환시켜준다.
            document.getElementById('label').innerText = `
              ${classes[result.label]}`;
            // html 문서의 confidences Element 에 확률값을 반환시켜 준다.
            document.getElementById('confidences').innerText = `
            probability: ${result.confidences[result.label]}`;

            // 여기까지 완료되면, 이미지는 폐기한다. (메모리 문제 우려)
            img.dispose();

        }
        // tf.nextFrame 은 프로미스를 돌려준다.
        // 아마도 계속 바뀌는 이미지의 비동기적 성격때문에 선언해준것으로 보인다.
        await tf.nextFrame();
    }


}

// HTML 문서에서 train 버튼을 click 할 경우 위에서 정의한
// app1 함수가 실행되도록 eventListener 추가
document.getElementById('train').addEventListener('click',
    function () {

        app1();
    }
);



/**
 * 2. Play 버튼을 누르면 Computer 와 게임을 진행하게 하는 함수
 */
document.getElementById('play').addEventListener('click',
    function () {
        // HTML 문서의 결과들을 지워준다.
        document.getElementById('player_choice').innerText = ``;
        document.getElementById('computer_choice').innerText = ``;
        document.getElementById('result').innerText = ``;

        if (document.getElementById('user_url')) {
            document.getElementById('user_url').remove();
        }
        if (document.getElementById('computer_url')) {
            document.getElementById('computer_url').remove();
        }
        if (document.getElementById('result_url')) {
            document.getElementById('result_url').remove();
        }

        // 승패 누적 결과를 지워준다.
        if (game_counter == 0) {
            $(".user-bar").css("width", (0) + "%");
            $(".computer-bar").css("width", (0) + "%");
        }

        console.log('game!');
        // HTML 문서에서 id 가 label 인 element 의 textContent 를 userChoice 변수에 할당해준다.
        // 위의 app1() 에서 결과를 이미 넣어뒀다.
        var userChoice = document.getElementById('label').textContent;
        console.log(userChoice);

        var user_url;
        var computer_url;
        var result;
        // player 가 낸 결과를 표시할 element를 새로 만든다. (img 객체를 넣어줄~)
        var user_elem = document.createElement("img");
        // 폭 설정
        user_elem.setAttribute("width", "100%");
        // 해당 element 의 설명
        user_elem.setAttribute("alt", "user choice img");

        // Computer 가 낸 결과를 표시할 element를 새로 만든다.(img 객체를 넣어줄~)
        var computer_elem = document.createElement("img");
        // 폭설정
        computer_elem.setAttribute("width", "100%");
        // 해당 element 의 설명
        computer_elem.setAttribute("alt", "computer choice img");

        // 결과를 표시할 image 객체를 넣을 element 를 새로 만든다.
        var result_elem = document.createElement("img");
        result_elem.setAttribute("width", "100%");
        result_elem.setAttribute("alt", "result img");

        // PLAYER 의 결과 처리
        // player 의 결과가 없으면 경고문 내보낸다.
        if (!userChoice) {
            // User choice was undefined
            document.getElementById('player_choice').innerText = `Train 을 우선 실시해주세요!!`;

        } else {
            // player 가 낸 것을 판단한 결과를 HTML 문서의 player_choice element.innerText에 넣어준다.
            document.getElementById('player_choice').innerText = `Player : ${userChoice}`;
            if (userChoice.trim() == 'rock') {
                user_url = "https://cdn1.iconfinder.com/data/icons/paper-rock-scissors-1/100/Fist-128.png"
            }
            else if (userChoice.trim() == 'paper') {
                user_url = "https://cdn1.iconfinder.com/data/icons/paper-rock-scissors-1/100/5-128.png"
            }
            else {
                user_url = "https://cdn1.iconfinder.com/data/icons/paper-rock-scissors-1/100/2-128.png"
            }

            // player 의 결과 이미지를 연결해준다.
            user_elem.setAttribute("src", user_url);
            document.getElementById("player_choice").className = "text-center";
            // HTML 문서의 class=player_choice 의 하위 요소에 위에서 만든 user_elem을 추가해준다.
            document.getElementById("player_choice").appendChild(user_elem);
            // id를 추가해준다.
            user_elem.id = "user_url"
            // class 를 정해준다.
            document.getElementById("user_url").className = "img-fluid";

        }


        // Computer 의 결과 처리
        // random 으로 나온 수에 따라 결과 나오도록 설정
        var computerChoice = Math.random();
        if (computerChoice < 0.34) {
            computerChoice = "rock";
            computer_url = "https://cdn1.iconfinder.com/data/icons/paper-rock-scissors/100/Fist-128.png"

        } else if (computerChoice <= 0.67) {
            computerChoice = "paper";
            computer_url = "https://cdn1.iconfinder.com/data/icons/paper-rock-scissors/100/5-128.png"

        } else {
            computerChoice = "scissors";
            computer_url = "https://cdn1.iconfinder.com/data/icons/paper-rock-scissors/100/2-128.png"

        }

        // HTML 문서의 id computer_choice 에 결과를 표시해준다.
        document.getElementById('computer_choice').innerText = `Computer :  ${computerChoice}`;
        document.getElementById("computer_choice").className = "text-center";

        console.log(computerChoice);
        // 컴퓨터가 낸 것을 표시해줄 computer_elem 에 이미지를 연결해준다.
        computer_elem.setAttribute("src", computer_url);
        document.getElementById("computer_choice").appendChild(computer_elem);
        computer_elem.id = "computer_url"
        document.getElementById("computer_url").className = "img-fluid";


        // 각 변수에 저장된 값에 space 가 있으면 제거후 저장한다.
        var a = userChoice.trim();
        var b = computerChoice.trim();
        // game 에 있는 compare 함수 사용
        var result = compare(a, b);

        win_url = "https://cdn1.iconfinder.com/data/icons/man-sitting-on-chair-poses-and-postures/236/man-sit-sitting-chair-009-128.png";
        tie_url = "https://cdn0.iconfinder.com/data/icons/olympic-1-1/65/86-128.png";
        lose_url = "https://cdn0.iconfinder.com/data/icons/boxing-32/496/knockout-defeated-boxer-injured-lost-128.png"

        console.log(result);

        // 결과에 따라 이미지 주소 할당
        // Game 횟수 갱신
        if (result.trim() == "비겼습니다.") {
            result_url = tie_url;
            game_counter += 1;

        }
        else if (result.trim() == "당신의 승리입니다!") {
            result_url = win_url;
            // player 가 이기면 user_count 갱신
            user_counter += 1;
            game_counter += 1;
            console.log(user_counter)
            // HTML 문서의 class=user-bar 의 폭을 갱신한다.
            $(".user-bar").css("width", (user_counter * 10) + "%");

        }
        else {
            result_url = lose_url;
            // computer 가 이기면 computer_count 갱신
            computer_counter += 1;
            game_counter += 1;
            console.log(computer_counter)
            // HTML 문서의 class=computer-bar 의 폭을 갱신한다.
            $(".computer-bar").css("width", (computer_counter * 10) + "%");

        }


        // 여기까지 정상 동작되었으면 div class id = bars 이하를 보여준다.
        $(".bars").show();
        // id = game_counter 의 text를 갱신
        $('#game_counter').text("Game count: " + game_counter);
        // id = user_score 의 text를 갱신
        $('#user_score').text("User won " + user_counter + " times.");
        // id = computer_socre 의 text를 갱신
        $('#computer_score').text("Computer won " + computer_counter + " times.");

        // HTML 문서의 id = result 에 결과 출력
        document.getElementById('result').innerText = `${result}`;
        document.getElementById("result").className = "text-center";

        // 위에서 만들어준 result_elem 에 이미지를 연결해준다.
        result_elem.setAttribute("src", result_url);
        document.getElementById("result").appendChild(result_elem);
        result_elem.id = "result_url"
        document.getElementById("result_url").className = "img-fluid";
        console.log(user_counter, computer_counter);

        // 누구던지 10게임 이기게되면 10게임 이겼다고 메시지 출력
        // alert 로 메시지 띄우고
        // 승패 결과를 모두 초기화한다.
        if (user_counter == 10) {

            alert("You won 10 games!");
            user_counter = 0;
            computer_counter = 0;
            game_counter = 0;


        } else if (computer_counter == 10) {

            alert("Computer won 10 games!");
            user_counter = 0;
            computer_counter = 0;
            game_counter = 0;


        }

        if ((user_counter == 10) &&
            (computer_counter == 10)) {
            console.log(user_counter, computer_counter);

            alert("Tie game!");
            user_counter = 0;
            computer_counter = 0;
            game_counter = 0;



        }

        console.log("game counter: " + game_counter)

        return;


    });
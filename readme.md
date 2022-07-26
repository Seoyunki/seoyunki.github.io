# 이곳은 Codestates Section4 Project 저장용 Repo 입니다.

아래의 3가지 모델이 저장되어 있습니다.
* 아래 3가지 모델 모두 Web demo 구현시에는 Javascript 의 Tensorflow 지원 라이브러리인 
  Tensorflow.js 를 사용했습니다.

## 1. quickdraw : Image Classification
* Alex Net 구성 참고하여 모델 구성 : 5xConv Layer + 1xFlatten + 2xDense Layer
* class 10ea x data 50,000 개로 학습 진행 (class 는 random 추출)
* Callbacks : Early Stopping (top_3_accuracy) 
* web demo 구현시 Javascript 코드는 Zaid Alyafeai 씨의 것을 참고 (https://github.com/zaidalyafeai/zaidalyafeai.github.io)
* 링크를 통해 demo 시연이 가능합니다. (https://seoyunki.github.io/quickdraw_toy/)

## 2. rps : Image Classification (web real time)
* Base Model : MobileNet V2 
* 출력층을 3개의 node 를 갖는 dense layer로 구성해 classification layer로 만듬
* 첨부된 colab notebook 파일은 web cam 지원안되고, 저장소에 저장한 이미지를 읽어와서 테스트 가능함 (이미지는 가로 세로 pixel size 가 같아야 함 : 노트북에서 1x128x128x3 으로 resize 시 에러발생될 수 있음)
* web real time 구현의 경우 Javascript 코드는 Lina Sachuk 씨의 것을 참고 (https://github.com/LinaSachuk)
* 링크를 통해 demo 시연이 가능합니다. (https://seoyunki.github.io/rps_toy/)

## 3. style_transfer : Image Style Transfer
* Base Model : VGG19
* VGG19 모델에서 Style Layer로 5개층을 뽑고, Content Layer 로 1개층을 뽑아 재구성함
* 리온 게티스에 의해 발표된 논문의 로직을 따라 ipynb 노트북 작성함 (논문 review 참고 : https://ssungkang.tistory.com/entry/%EB%94%A5%EB%9F%AC%EB%8B%9DNeural-Style-Transfer)
![image](https://user-images.githubusercontent.com/89177051/180946379-dc96005e-0b57-4d6b-bd9c-25175e6f080c.png)

* web demo 구현시 Javascript 코드는 Zaid Alyafeai 씨의 코드를 참고함 (https://github.com/zaidalyafeai/zaidalyafeai.github.io) 
* 링크를 통해 demo 시연이 가능합니다. (https://seoyunki.github.io/style_transfer_toy/)

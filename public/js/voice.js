var SDK, recognizer, spokenText;
const messageSpan = document.getElementById('message'); 
let sendMessage = false;

function voiceToText(){
    Initialize(function (speechSdk) {
      SDK = speechSdk;
      Setup();
      RecognizerStart(SDK, recognizer);
    });

  
  function Setup () {
    if (recognizer != null) {
      RecognizerStop(SDK, recognizer);
    }
    recognizer = RecognizerSetup(SDK, 'Interactive', 'en-US', SDK.SpeechResultFormat['Sample'], '5c132892bdcb4883b169cdf69668db49');
  } 
}



function UpdateRecognizedHypothesis (text, append) {
    if (append) { spokenText += text + ' '; } else {
      spokenText = text;
    }
  }
  
  
  function OnComplete () {
    console.log(spokenText);
      if (spokenText === 'hello') sendMessage = true;
    else if (spokenText === 'goodbye') {
      sendMessage = false;
      $('#message').attr('aria-hidden', 'false');
    }
    console.log(sendMessage);
    if (sendMessage && spokenText.trim() !== '') {
    fetch('/voice',{method:'POST',body:JSON.stringify({spokenText}) ,
      headers: { 'Content-Type': 'application/json' }})
      .then(res=>res.json())
      .then(({message})=>{
        $('#message').attr('aria-hidden', 'false');     
        if (message !== 'no speech'){
        $('#face-authenticated').attr('aria-hidden', 'true');     
        $('#face-close').attr('aria-hidden', 'true');        
        messageSpan.innerText = message;
        console.log(messageSpan);
        }
        spokenText='';
        RecognizerStart(SDK, recognizer);
      })
      .catch(err=>{
        console.log(err);
      })
    } else {
      RecognizerStart(SDK, recognizer);
    }
  }
  
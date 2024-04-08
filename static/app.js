class Chatbox{
    constructor(){
        this.args ={
            openButton: document.querySelector('.chatbox__button'),
            chatbox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.message= [];
    }

    display() {
        const {openButton, chatbox , sendButton} = this.args;
        openButton.addEventListener('click',() => this.toggleState(chatbox))
        sendButton.addEventListener('click',() => this.onSendButton(chatbox))
        const node = chatbox.querySelector('input');
        node.addEventListener("keyup",({key}) => {
            if(key === "Enter"){
                this.onSendButton(chatbox)
            }
        })
    }

    toggleState(chatbox){
        this.state = !this.state;

        if(this.state){
            chatbox.classList.add('chatbox--active')
        }else{
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox){
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if(text1===""){
            return;
        }

        let msg1= {name:"User", message:text1}
        this.message.push(msg1);

        //'http://127.0.0.1:5000/predict
        fetch($SCRIPT_ROOT + '/predict', {
            method:'Post',
            body:JSON.stringify({message: text1}),
            mode:'cors',
            headers:{
                'Content-Type': 'application/json'

            },

        })
        .then(r => r.json())
        .then(r => {
            let msg2 = {name: "Steve", message: r.answer};
            this.message.push(msg2);
            this.updateChatText(chatbox)
            textField.value =''

        }).catch((error)=>{
            console.error('Error: ',error);
            this.updateChatText(chatbox)
            textField.value= ''
        });
    }

    updateChatText(chatbox) {
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = '';
        this.message.slice().reverse().forEach(item => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('messages__item'); 
            if (item.name === 'Steve') {
                messageElement.classList.add('messages__item--visitor');
            } else {
                messageElement.classList.add('messages__item--operator');
            }
            messageElement.textContent = item.message;
            chatmessage.appendChild(messageElement);
        });
        chatmessage.scrollTop = chatmessage.scrollHeight;
    }

}

const chatbox= new Chatbox();
chatbox.display();
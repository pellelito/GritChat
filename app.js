/***********************************************************************
* Author: Pellelito                                                    *
* A simple videochat app, made for a class in Javascript aug-sept 2020 *
* Enjoy!!                                                              * 
************************************************************************/
//Global variables
//Self invoked anonymous function 
(function(){
    
let peer = null;
let con = null;    


// Sets user name on page
const peerOnOpen = (id) => {document.querySelector('.my-peer-id').innerHTML= id};
// Handles errors
const peerOnError = (error) => {console.log(error)};

// Get user
let myPeerId;
let getUser = () => {
    let person = prompt("Please enter your name:", "Mr_Potatohead");
  if (person == null || person == "") {
    myPeerId = "Mr_Potatohead";
  } else {
    myPeerId = person;
  }   
}
document.addEventListener('load', getUser()); 

// Conect to peer server
peer = new Peer(myPeerId,{ host: "glajan.com", port:8443, path: "/myapp", secure: true});

// Handle Peer events
peer.on('open', peerOnOpen);
peer.on('error', peerOnError)

const connectToPeerClick = (el) => {
    
    //get remote user ID
    const peerId = el.target.textContent;
    console.log(peerId);  
    
    //Test if con exits and the close it
    con && con.close();
    
    //Open connection to remote user
    con = peer.connect(peerId);
    con.on('open', () => {
        console.log('con open');
        
        
        //custom event
        const event = new CustomEvent('peerChanged', { detail:{peerId: peerId},});
        document.dispatchEvent(event);
        
    });
    
}


//Refreshes online friends
document.querySelector(".list-all-peers-button").addEventListener("click", () => {
  
    
    const peersEl = document.querySelector('.peers');
    peersEl.firstChild && peersEl.firstChild.remove();
    peer.listAllPeers((peers) => {
             
        const ul = document.createElement('ul');
        peers.filter((peerId)=>{
            return peerId !== myPeerId ? true : false;
        })
        
            .forEach(peerId => {
            
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.innerText = peerId;
                button.className = "connect-button";
                button.classList.add(`peerId-${peerId}`);
                button.addEventListener('click', connectToPeerClick); 
                li.appendChild(button);
                ul.appendChild(li);
            
        }); 
        peersEl.appendChild(ul);
    });
});
document.addEventListener('peerChanged',(e) => {
    const peerId = e.detail.peerId;
    //console.log("peerID = " + peerId);
     
    document.querySelectorAll('.connect-button').forEach((el) => {
           el.classList.remove('connected');
    });
    
    const conUser = document.querySelector(`.connect-button.peerId-${peerId}`);
    
    //document.querySelectorAll(`.connect-button peerId-${peerId}`).classList.add('connected');
    //console.log(button);
    conUser.classList.add('connected');
    
})    
})();
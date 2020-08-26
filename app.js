/***********************************************************************
* Author: Pellelito                                                    *
* A simple videochat app, made for a class in Javascript aug-sept 2020 *
* Enjoy!!                                                              * 
************************************************************************/

// Sets user name on page
const peerOnOpen = (id) => {document.querySelector('.my-peer-id').innerHTML= id};
// Handles errors
const peerOnError = (error) => {console.log(error)};

// Get user
let myPeerId;
let getUser = () => {
    let person = prompt("Please enter your name:", "Mr Potatohead");
  if (person == null || person == "") {
    myPeerId = "Mr Potatohead";
  } else {
    myPeerId = person;
  }   
}
document.addEventListener('load', getUser()); 

// Conect to peer server
let peer = new Peer(myPeerId,{ host: "glajan.com", port:8443, path: "/myapp", secure: true});

// Handle Peer events
peer.on('open', peerOnOpen);
peer.on('error', peerOnError)


//Refreshes online friends
document.querySelector(".list-all-peers-button").addEventListener("click", () => {
  
    
    const peersEl = document.querySelector('.peers');
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
                button.classList.add('peerId-${peerId}');
                li.appendChild(button);
                ul.appendChild(li);
            
        }); 
        peersEl.appendChild(ul);
    });
});

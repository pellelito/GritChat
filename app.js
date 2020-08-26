//Author: Pelle
// A simple videochat app, made for a class in Javascript aug-aept 2020
//Enjoy!!

const peerOnOpen = (id) => {document.querySelector('.my-peer-id').innerHTML= id};

const peerOnError = (error) => {console.log(error)};

let myPeerId = location.hash.slice(1);
// console.log(myPeerId);

// Conect to peer server
let peer = new Peer(myPeerId,{ host: "glajan.com", port:8443, path: "/myapp", secure: true});

// Handle Peer events
peer.on('open', peerOnOpen);
peer.on('error', peerOnError)

document.querySelector(".list-all-peers-button").addEventListener("click", () => {
    //console.log("hej");
    
    const peersEl = document.querySelector('.peers');
    peer.listAllPeers((peers) => {
        //console.log(peers);
        
        const ul = document.createElement('ul');
        
        peers.filter((peerId)=>{
            return peerId !== myPeerId ? true : false;
            // .filter((p) => p !== myPeerId)
            //if (peerId === myPeerId) return false;
            //return true;
        }).forEach(peerId => {
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

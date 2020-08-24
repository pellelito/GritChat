//Author: Pelle
// A simple videochat app, made for a class in Javascript aug-aept 2020
//Enjoy!!
const peerOnOpen = (id) => {
    document.querySelector('.my-peer-id').innerHTML= id;
}

const myPeerId = location.hash.slice(1);
console.log(myPeerId);

let peer = new Peer(myPeerId,{ host: "glajan.com", port:8443, path: "/myapp", secure: true});

peer.on('open', peerOnOpen);

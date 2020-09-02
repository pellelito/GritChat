/******************************************************************************
 * Author: Pellelito                                                          *
 * A simple video/text chat app, made for a class in Javascript aug-sept 2020 *
 * Enjoy!!                                                                    *
 *****************************************************************************/

//Self invoked anonymous function
(function () {
  //"Global" variables
  let peer = null;
  let con = null;

  // Sets user name on page
  const peerOnOpen = (id) => {
    document.querySelector(".my-peer-id").innerHTML = id;
  };

  //opens connection from remote user
  const peerOnConnection = (dataConnection) => {
    //First clears and then opens new connection
    con && con.close();
    con = dataConnection;

    // recive message
    con.on("data", (data) => {
      printMessage(data, "them");
    });

    
    //calls the peerChanged to show in list who's connected
    const event = new CustomEvent("peerChanged", {
      detail: {
        peerId: con.peer,
      },
    });

    document.dispatchEvent(event);
  };

  // Handles errors
  const peerOnError = (error) => {
    console.log(error);
  };

  //Print message function
  function printMessage(msg, writer) {
    const messageDiv = document.querySelector(".messages");
    const newWrapDiv = document.createElement("div");
    const newMsgDiv = document.createElement("div");
    newMsgDiv.innerHTML =
      msg + "<br><i><small>Sent: " + timeStamp() + "</small></i>";
    newWrapDiv.classList.add("message");
    newWrapDiv.classList.add(writer);
    newWrapDiv.appendChild(newMsgDiv);
    messageDiv.appendChild(newWrapDiv);
  }
  //Get time
  function timeStamp() {
    let d = new Date();
    let time =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getDate() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds();
    return time;
  }
  // Get new user
  let myPeerId;
  let getUser = () => {
    let person = prompt("Please enter your name:", "Mr_Potatohead");
    if (person == null || person == "") {
      myPeerId = "Mr_Potatohead";
    } else {
      myPeerId = person;
    }
  };
  document.addEventListener("load", getUser());

  // Conect to peer server
  peer = new Peer(myPeerId, {
    host: "glajan.com",
    port: 8443,
    path: "/myapp",
    secure: true,
    config: {
      iceServers: [
        {
          url: ["stun:eu-turn7.xirsys.com"],
        },
        {
          username:
            "1FOoA8xKVaXLjpEXov-qcWt37kFZol89r0FA_7Uu_bX89psvi8IjK3tmEPAHf8EeAAAAAF9NXWZnbGFqYW4=",
          credential: "83d7389e-ebc8-11ea-a8ee-0242ac140004",
          url: "turn:eu-turn7.xirsys.com:80?transport=udp",
        },
      ],
    },
  });

  // Handle Peer events
  peer.on("open", peerOnOpen);
  peer.on("error", peerOnError);
  peer.on("connection", peerOnConnection);

  const connectToPeerClick = (el) => {
    //get remote user ID
    const peerId = el.target.textContent;
    console.log(peerId);

    //Test if con exits and the close it
    con && con.close();

    //Open connection to remote user
    con = peer.connect(peerId);
    con.on("open", () => {
      console.log("con open");

      //custom event
      const event = new CustomEvent("peerChanged", {
        detail: {
          peerId: peerId,
        },
      });
      document.dispatchEvent(event);

      // recive message
      con.on("data", (data) => {
        printMessage(data, "them");
      });
    });
  };

  //Refreshes online friends
  document
    .querySelector(".list-all-peers-button")
    .addEventListener("click", () => {
      const peersEl = document.querySelector(".peers");
      peersEl.firstChild && peersEl.firstChild.remove();
      peer.listAllPeers((peers) => {
        const ul = document.createElement("ul");
        peers
          .filter((peerId) => {
            return peerId !== myPeerId ? true : false;
          })

          .forEach((peerId) => {
            const li = document.createElement("li");
            const button = document.createElement("button");
            button.innerText = peerId;
            button.className = "connect-button";
            button.classList.add(`peerId-${peerId}`);
            button.addEventListener("click", connectToPeerClick);
            li.appendChild(button);
            ul.appendChild(li);
          });
        peersEl.appendChild(ul);
      });
    });

  //when connecting to new peer
  document.addEventListener("peerChanged", (e) => {
    const peerId = e.detail.peerId;

    //turns off all selected users
    document.querySelectorAll(".connect-button.connected").forEach((el) => {
      el.classList.remove("connected");
    });

    //turns on userbutton to selected
    const conUser = document.querySelector(`.connect-button.peerId-${peerId}`);
    conUser && conUser.classList.add("connected");
  });

  //variables for sending msg
  const sendButton = document.querySelector(".send-new-message-button");
  const msgBox = document.querySelector(".new-message");

  //calls sendButton click if enter is pressed
  msgBox.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      // Trigger the button element with a click
      sendButton.click();
    }
  });

  //send new message button
  sendButton.addEventListener("click", () => {
    //console.log(clock.format(clock.now));
    const msg = msgBox.value;
    con.send(msg);
    document.querySelector(".new-message").value = "";
    printMessage(msg, "me");
  });

  //
})();

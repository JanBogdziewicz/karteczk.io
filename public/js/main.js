checkCookie("username")
document.getElementById("player_name").innerHTML = getCookie("username")

let playerData = {
    name: getCookie("username"),
    character: "",
    id: 0
}

let localArray = []

document.addEventListener('DOMContentLoaded', () => {
    const socket = io()
    socket.emit('player', playerData)
    document.getElementById('chat_input').addEventListener('submit', (e) => {
        e.preventDefault() // prevents page reloading
        socket.emit('chat message', document.getElementById('m').value)
        socket.emit('name', getCookie("username"))
        document.getElementById('m').value = ''
        return false
    })
    socket.on('player', (newData) => {
        playerData = newData
    })
    
    socket.on('global', (playersArray) => {
        localArray = playersArray
        document.getElementById('player_table').getElementsByTagName('tbody')[0].innerHTML = ''
        document.getElementById('player_table').getElementsByTagName('tbody')[0].innerHTML += `<tr><th>Gracz</th><th>Postać</th></tr>`
        for(let i = 0; i < playersArray.length; i++) {
            if(findIndexOfProperty(localArray) === i && playersArray[i].character != '') {
                charDisplay = '???'
            } else {
                charDisplay = playersArray[i].character
            }
            document.getElementById('player_table').getElementsByTagName('tbody')[0].innerHTML += `<tr><td>${playersArray[i].name}</td><td>${charDisplay}</td></tr>`
            if(playersArray[i].character === '' || playersArray[i].character === null) {
                let button = document.createElement('button')
                button.innerHTML = 'Dodaj postać'
                button.id = 0
                
                document.getElementById('player_table').getElementsByTagName('tbody')[0].childNodes[i + 1].lastChild.appendChild(button)
            }
        }
        for(let i = 0; i < playersArray.length; i++) {
            if (findIndexOfProperty(localArray) === i) {
                ((index) => {
                    document.getElementById('player_table').getElementsByTagName('tbody')[0].childNodes[i + 1].lastChild.firstChild.addEventListener('click', () => {
                        alert('Nie mozesz sam se dac postaci jezu -.-')
                    })
                    //alert('dodano listener do guzika ' + i)
                })(i)
            } else if (playersArray[i].character === '') {
                ((index) => {
                    document.getElementById('player_table').getElementsByTagName('tbody')[0].childNodes[i + 1].lastChild.firstChild.addEventListener('click', () => {
                        addCharacter(i)
                    })
                    //alert('dodano listener do guzika ' + i)
                })(i)
            }
        }
    })

    let name
    let message

    socket.on('chat message', (msg) => {
        message = msg
    })
    socket.on('name', (msg) => {
        name = msg
        document.getElementById('messages').innerHTML += `<li><b>${name}:</b> ${message}</li>`
    })
    onunload = () => {
        socket.emit('delete_player', findIndexOfProperty(localArray))
    }
})

function addCharacter(index) {
    const socket = io()
    let newChar = ""
    while(newChar === "") {
        newChar = prompt("Nazwa postaci:")
    }
    socket.emit('add_character', newChar, index)
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";"
}

function getCookie(cname) {
    let name = `${cname}=`
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')
    for(let i = 0; i < cookieArray.length; i++) {
        const currentCookie = cookieArray[i];
        while (currentCookie.charAt(0) == ' ') {
            currentCookie = currentCookie.substring(1);
        }
        if (currentCookie.indexOf(name) == 0) {
            return currentCookie.substring(name.length, currentCookie.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    let username = getCookie(cname)
    while(username == "" || username == null) {
        username = prompt("Podaj nazwe: ")
    }
    setCookie(cname, username)
}

function findIndexOfProperty(players) {
    for(let i = 0; i < players.length; i++) {
        if(players[i].name === getCookie("username")) {
            return i
        }
    }
    return -1
}
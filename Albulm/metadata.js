let fs = require("fs");
let axios = require("axios");

let songs = ["dissonant.mp3", "kbd softly.mp3", "pad copter.mp3"];
let durations = ["00:23", "00:27", "00:24"];
let ipfsArray = [];

for (let i = 0; i < songs.length; i++) {
  ipfsArray.push({
    path: `metadata/${i}.json`,
    content: {
      image: `ipfs://QmeTxC3ie2yFDr3QXm99ieLEuqTpj37LiyHuYCoXeeXhfN/media/0`, //xxx = hash
      name: songs[i],
      animation_url: `ipfs://QmWSYTr4J51MZM5ACm1rSj1nZ7DXSjV94yeCRf4ZYXNSZS/media/${i}`, //xxx = hash
      duration: durations[i],
      artist: "63MoneyT",
      year: "2022"
    },
  });
}
console.log(ipfsArray);

axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", ipfsArray, {
    headers: {
      "X-API-KEY":
        "WH2croGLgqs0tunJ63Iut9i0pthkKdGSETTzUqKzHZPo9fDF72jYJCPhReYCeywd",
      "Content-Type": "application/json",
      accept: "application/json",
    },
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error);
  });

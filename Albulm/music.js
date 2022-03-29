let fs = require("fs");
let axios = require("axios");

let media = ["63moneyT.jpg", "dissonant.mp3", "kbd softly.mp3", "pad copter.mp3"];
let ipfsArray = [];
let promises = []; 

for (let i = 0; i < media.length; i++) {
  promises.push(
    new Promise((res, rej) => {
      fs.readFile(`${__dirname}/export/${media[i]}`, (err, data) => {
        if (err) rej();
        ipfsArray.push({
          path: `media/${i}`,
          content: data.toString("base64"),
        });
        res();
      });
    })
  );
}
Promise.all(promises).then(() => {
  axios
    .post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", ipfsArray, {
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
});
